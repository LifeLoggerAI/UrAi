const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
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
  allowedDevOrigins: [
    "http://localhost:9002",
    process.env.PREVIEW_HOST || "https://*.cloudworkstations.dev"
  ],
  webpack(config) {
    config.module.rules.push({
      test: /node_modules[\\/]handlebars[\\/]lib[\\/]index\.js$/,
      use: require.resolve("null-loader"),
    });
    return config;
  }
};

module.exports = nextConfig;