/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "ApiProxy";
const basePath = isGitHubPages ? "/" + repositoryName : "";

const nextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath + "/",
        images: { unoptimized: true },
        env: {
          NEXT_PUBLIC_BASE_PATH: basePath
        }
      }
    : {})
};

export default nextConfig;
