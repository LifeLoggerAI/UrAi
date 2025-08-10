// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep node-only deps out of the RSC/client bundler
    serverComponentsExternalPackages: [
      '@opentelemetry/api',
      '@opentelemetry/instrumentation',
      '@opentelemetry/sdk-node',
      '@opentelemetry/winston-transport',
      '@opentelemetry/exporter-jaeger',
      'require-in-the-middle',
      'handlebars',
      'dotprompt',
    ],
  },
  webpack: (config, { isServer }) => {
    // Never try to polyfill these in the browser
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
    };

    if (!isServer) {
      // Make sure client bundles don’t even try to resolve these
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/instrumentation': false,
        '@opentelemetry/sdk-node': false,
        '@opentelemetry/winston-transport': false,
        '@opentelemetry/exporter-jaeger': false,
        'require-in-the-middle': false,
        'handlebars': false,
        'dotprompt': false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
