/** @type {import('next').NextConfig} */
const productionApiBase = process.env.NEXT_PUBLIC_API_BASE_URL
  ? (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000"
      },
      ...(productionApiBase
        ? [
            {
              protocol: productionApiBase.protocol.replace(":", ""),
              hostname: productionApiBase.hostname,
              ...(productionApiBase.port ? { port: productionApiBase.port } : {})
            }
          ]
        : [])
    ]
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  }
};

export default nextConfig;
