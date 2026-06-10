import { AgentDirectory } from "@/components/agent-directory";
import { agents } from "@/data/agents";
import { providers } from "@/data/providers";

export default function Home() {
  return <AgentDirectory agents={agents} providers={providers} />;
}
