/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent server‑only libs from being bundled client‑side
      config.resolve.alias['@opentelemetry/api'] = false;
      config.resolve.alias['@opentelemetry/instrumentation'] = false;
      config.resolve.alias['@opentelemetry/sdk-node'] = false;
      config.resolve.alias['genkit'] = false; // safeguard if anything imports it directly
    }
    
    // Keep node-only deps out of the RSC/client bundler
    config.experiments = { ...config.experiments, serverComponentsExternalPackages: [
      ...(config.experiments?.serverComponentsExternalPackages || []),
      '@genkit-ai/core',
      '@genkit-ai/googleai',
      '@genkit-ai/firebase',
      '@opentelemetry/api',
      '@opentelemetry/instrumentation',
      '@opentelemetry/sdk-node',
      '@opentelemetry/winston-transport',
      '@opentelemetry/exporter-jaeger',
      'require-in-the-middle',
      'handlebars',
      'dotprompt',
    ] };
    
    // Fallbacks for Node.js modules that might be pulled in by server dependencies
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

    return config;
  },
};

module.exports = nextConfig;
