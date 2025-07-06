
import type { NextConfig } from 'next';

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com;
    img-src 'self' data: https://placehold.co https://lh3.googleusercontent.com;
    connect-src 'self' https://*.googleapis.com https://accounts.google.com http://127.0.0.1:9099 http://127.0.0.1:8080 ws://127.0.0.1:8080 https://*.cloudworkstations.dev wss://*.cloudworkstations.dev;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://accounts.google.com;
    frame-ancestors 'self' https://*.cloudworkstations.dev;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { 
            key: "Content-Security-Policy", 
            value: cspHeader
          }
        ],
      },
    ]
  },
};

export default nextConfig;
