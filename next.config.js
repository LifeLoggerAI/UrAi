/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side builds, explicitly mark server-only modules as false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
        os: false,
        http: false,
        https: false,
        child_process: false,
        worker_threads: false,
        'firebase-admin': false,
      };
    }

    return config;
  },
};

export default nextConfig;
