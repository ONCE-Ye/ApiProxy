#!/usr/bin/env python3
import base64
import json
import os
import socket
import subprocess
import time
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
AUDIT_DIR = ROOT / "docs" / "audits" / "2026-06-24-product-flow"
SCREENSHOT_DIR = AUDIT_DIR / "screenshots"
TMP_DIR = AUDIT_DIR / "tmp"
BASE_URL = "http://127.0.0.1:3004"
DEBUG_PORT = 9223


class CdpClient:
    def __init__(self, websocket_url: str):
        self.host, self.port, self.path = self._parse_ws_url(websocket_url)
        self.sock = socket.create_connection((self.host, self.port), timeout=10)
        self._handshake()
        self.next_id = 1

    def _parse_ws_url(self, url: str):
        if not url.startswith("ws://"):
            raise ValueError("Only ws:// CDP endpoints are supported")
        rest = url[5:]
        host_port, path = rest.split("/", 1)
        host, port = host_port.split(":")
        return host, int(port), "/" + path

    def _handshake(self):
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        request = (
            f"GET {self.path} HTTP/1.1\r\n"
            f"Host: {self.host}:{self.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(request.encode("ascii"))
        response = self.sock.recv(4096)
        if b" 101 " not in response:
            raise RuntimeError("CDP WebSocket handshake failed: " + response.decode("utf8", "ignore"))

    def _send_frame(self, payload: str):
        data = payload.encode("utf8")
        header = bytearray([0x81])
        length = len(data)
        if length < 126:
            header.append(0x80 | length)
        elif length < 65536:
            header.extend([0x80 | 126, (length >> 8) & 255, length & 255])
        else:
            header.append(0x80 | 127)
            header.extend(length.to_bytes(8, "big"))
        mask = os.urandom(4)
        header.extend(mask)
        masked = bytes(byte ^ mask[index % 4] for index, byte in enumerate(data))
        self.sock.sendall(bytes(header) + masked)

    def _recv_exact(self, count: int) -> bytes:
        chunks = []
        remaining = count
        while remaining:
            chunk = self.sock.recv(remaining)
            if not chunk:
                raise RuntimeError("CDP WebSocket closed")
            chunks.append(chunk)
            remaining -= len(chunk)
        return b"".join(chunks)

    def _recv_frame(self):
        first = self._recv_exact(2)
        opcode = first[0] & 0x0F
        length = first[1] & 0x7F
        if length == 126:
            length = int.from_bytes(self._recv_exact(2), "big")
        elif length == 127:
            length = int.from_bytes(self._recv_exact(8), "big")
        masked = bool(first[1] & 0x80)
        mask = self._recv_exact(4) if masked else b""
        payload = self._recv_exact(length) if length else b""
        if masked:
            payload = bytes(byte ^ mask[index % 4] for index, byte in enumerate(payload))
        if opcode == 8:
            raise RuntimeError("CDP WebSocket closed")
        if opcode == 9:
            self.sock.sendall(b"\x8a\x00")
            return self._recv_frame()
        if opcode != 1:
            return None
        return json.loads(payload.decode("utf8"))

    def command(self, method: str, params=None):
        command_id = self.next_id
        self.next_id += 1
        self._send_frame(json.dumps({"id": command_id, "method": method, "params": params or {}}))
        while True:
            message = self._recv_frame()
            if not message:
                continue
            if message.get("id") == command_id:
                if "error" in message:
                    raise RuntimeError(f"{method} failed: {message['error']}")
                return message.get("result", {})


def fetch_json(url: str, method="GET"):
    request = urllib.request.Request(url, method=method)
    with urllib.request.urlopen(request, timeout=10) as response:
        return json.loads(response.read().decode("utf8"))


def wait_for_dev_server():
    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(BASE_URL, timeout=2) as response:
                if response.status == 200:
                    return
        except Exception:
            time.sleep(1)
    raise RuntimeError("Dev server did not become ready")


def wait_for_chrome():
    deadline = time.time() + 20
    while time.time() < deadline:
        try:
            return fetch_json(f"http://127.0.0.1:{DEBUG_PORT}/json/version")
        except Exception:
            time.sleep(0.5)
    raise RuntimeError("Chrome debugging endpoint did not become ready")


def wait_for_page(cdp: CdpClient):
    deadline = time.time() + 20
    while time.time() < deadline:
        state = cdp.command("Runtime.evaluate", {
            "expression": "document.readyState",
            "returnByValue": True
        })["result"].get("value")
        if state == "complete":
            time.sleep(0.5)
            return
        time.sleep(0.2)
    raise RuntimeError("Page did not finish loading")


def evaluate(cdp: CdpClient, expression: str):
    result = cdp.command("Runtime.evaluate", {
        "expression": expression,
        "awaitPromise": True,
        "returnByValue": True
    })["result"]
    return result.get("value")


def click_selector(cdp: CdpClient, selector: str, index=0):
    rect = evaluate(cdp, f"""
      (() => {{
        const el = Array.from(document.querySelectorAll({json.dumps(selector)}))[{index}];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {{ x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, height: r.height, text: el.textContent }};
      }})()
    """)
    if not rect:
        raise RuntimeError("Missing selector: " + selector)
    x, y = rect["x"], rect["y"]
    cdp.command("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": x, "y": y})
    cdp.command("Input.dispatchMouseEvent", {"type": "mousePressed", "x": x, "y": y, "button": "left", "clickCount": 1})
    cdp.command("Input.dispatchMouseEvent", {"type": "mouseReleased", "x": x, "y": y, "button": "left", "clickCount": 1})
    time.sleep(0.5)
    return rect


def type_into(cdp: CdpClient, selector: str, text: str):
    click_selector(cdp, selector)
    cdp.command("Input.dispatchKeyEvent", {"type": "keyDown", "key": "Control", "windowsVirtualKeyCode": 17, "modifiers": 2})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyDown", "key": "a", "windowsVirtualKeyCode": 65, "modifiers": 2})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyUp", "key": "a", "windowsVirtualKeyCode": 65, "modifiers": 2})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyUp", "key": "Control", "windowsVirtualKeyCode": 17})
    cdp.command("Input.insertText", {"text": text})
    time.sleep(0.6)


def clear_input(cdp: CdpClient, selector: str):
    click_selector(cdp, selector)
    cdp.command("Input.dispatchKeyEvent", {"type": "keyDown", "key": "Control", "windowsVirtualKeyCode": 17, "modifiers": 2})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyDown", "key": "a", "windowsVirtualKeyCode": 65, "modifiers": 2})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyUp", "key": "a", "windowsVirtualKeyCode": 65, "modifiers": 2})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyUp", "key": "Control", "windowsVirtualKeyCode": 17})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyDown", "key": "Backspace", "windowsVirtualKeyCode": 8})
    cdp.command("Input.dispatchKeyEvent", {"type": "keyUp", "key": "Backspace", "windowsVirtualKeyCode": 8})
    time.sleep(0.5)


def screenshot(cdp: CdpClient, name: str):
    path = SCREENSHOT_DIR / name
    data = cdp.command("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
    path.write_bytes(base64.b64decode(data))
    return str(path.relative_to(ROOT))


def visible_text(cdp: CdpClient):
    return evaluate(cdp, "document.body.innerText")


def main():
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    wait_for_dev_server()

    chrome = subprocess.Popen([
        "/usr/bin/google-chrome",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--remote-debugging-port={DEBUG_PORT}",
        f"--user-data-dir={TMP_DIR / 'chrome-profile'}",
        "about:blank"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    results = {"baseUrl": BASE_URL, "steps": [], "checks": {}}
    try:
        version = wait_for_chrome()
        target = fetch_json(f"http://127.0.0.1:{DEBUG_PORT}/json/new?{BASE_URL}", method="PUT")
        cdp = CdpClient(target.get("webSocketDebuggerUrl") or version["webSocketDebuggerUrl"])
        cdp.command("Page.enable")
        cdp.command("Runtime.enable")
        cdp.command("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 1000,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        cdp.command("Page.navigate", {"url": BASE_URL})
        wait_for_page(cdp)

        results["steps"].append({
            "name": "home-agents",
            "screenshot": screenshot(cdp, "01-home-agents.png"),
            "visibleAgents": evaluate(cdp, "document.querySelectorAll('[data-testid^=\"agent-card-\"]').length"),
            "hasAnnotationButton": "批注模式" in visible_text(cdp)
        })

        type_into(cdp, "input[aria-label='搜索 Agent']", "Codex")
        results["steps"].append({
            "name": "agent-search-codex",
            "screenshot": screenshot(cdp, "02-agent-search-codex.png"),
            "visibleAgents": evaluate(cdp, "document.querySelectorAll('[data-testid^=\"agent-card-\"]').length"),
            "hasCodex": "Codex" in visible_text(cdp)
        })

        click_selector(cdp, "a[aria-label='查看 Codex 详情']")
        wait_for_page(cdp)
        results["steps"].append({
            "name": "agent-detail-codex",
            "screenshot": screenshot(cdp, "03-agent-detail-codex.png"),
            "url": evaluate(cdp, "location.pathname"),
            "hasBackLink": "返回目录" in visible_text(cdp)
        })

        click_selector(cdp, "a[href='/']")
        wait_for_page(cdp)
        click_selector(cdp, "button", 2)
        results["steps"].append({
            "name": "providers-tab",
            "screenshot": screenshot(cdp, "04-providers-tab.png"),
            "visibleProviders": evaluate(cdp, "document.querySelectorAll('[data-testid^=\"provider-card-\"]').length"),
            "hasRelayBadge": "中转站" in visible_text(cdp)
        })

        click_selector(cdp, "a[aria-label^='查看 ']", 0)
        wait_for_page(cdp)
        results["steps"].append({
            "name": "provider-detail",
            "screenshot": screenshot(cdp, "05-provider-detail.png"),
            "url": evaluate(cdp, "location.pathname"),
            "hasSupportSection": "支持的智能体 API" in visible_text(cdp)
        })

        click_selector(cdp, "a[href='/']")
        wait_for_page(cdp)
        click_selector(cdp, "button", 2)
        type_into(cdp, "input[aria-label='搜索多智能体 API']", "deepseek")
        results["steps"].append({
            "name": "provider-search-deepseek",
            "screenshot": screenshot(cdp, "06-provider-search-deepseek.png"),
            "visibleProviders": evaluate(cdp, "document.querySelectorAll('[data-testid^=\"provider-card-\"]').length"),
            "hasEmptyState": "没有找到匹配结果" in visible_text(cdp)
        })

        click_selector(cdp, "button", 1)
        clear_input(cdp, "input[aria-label='搜索 Agent']")
        click_selector(cdp, "button", 0)
        click_selector(cdp, "article[data-testid^='agent-card-']", 0)
        results["steps"].append({
            "name": "annotation-draft",
            "screenshot": screenshot(cdp, "07-annotation-draft.png"),
            "hasDraft": "已选区域" in visible_text(cdp)
        })
        type_into(cdp, "textarea", "审计自测批注：检查卡片点击后的反馈是否清晰。")
        click_selector(cdp, "button", len(evaluate(cdp, "Array.from(document.querySelectorAll('button')).map(b => b.textContent)") or []) - 1)
        time.sleep(0.8)
        results["steps"].append({
            "name": "annotation-saved",
            "screenshot": screenshot(cdp, "08-annotation-saved.png"),
            "hasSavedStatus": "已保存" in visible_text(cdp)
        })

        api_agents = json.loads(urllib.request.urlopen(BASE_URL + "/api/agents", timeout=10).read().decode("utf8"))
        api_providers = json.loads(urllib.request.urlopen(BASE_URL + "/api/providers", timeout=10).read().decode("utf8"))
        api_annotations = json.loads(urllib.request.urlopen(BASE_URL + "/api/annotations", timeout=10).read().decode("utf8"))
        results["checks"] = {
            "apiAgentsCount": len(api_agents.get("agents", [])),
            "apiProvidersCount": len(api_providers.get("providers", [])),
            "apiAnnotationsCount": len(api_annotations.get("annotations", [])),
            "screenshotsNonEmpty": all((SCREENSHOT_DIR / step["screenshot"].split("/")[-1]).stat().st_size > 10000 for step in results["steps"])
        }
    finally:
        chrome.terminate()
        try:
            chrome.wait(timeout=5)
        except subprocess.TimeoutExpired:
            chrome.kill()

    (AUDIT_DIR / "flow-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", "utf8")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
