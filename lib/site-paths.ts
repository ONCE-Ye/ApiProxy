export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string, basePath = siteBasePath) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  const normalizedBasePath = basePath.replace(/\/$/, "");

  if (!normalizedBasePath) {
    return path;
  }

  return normalizedBasePath + path;
}
