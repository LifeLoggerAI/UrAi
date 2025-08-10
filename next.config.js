
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This is required for some Node.js modules that are not available in the browser.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
      http: false,
      https: false,
      os: false,
      path: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
