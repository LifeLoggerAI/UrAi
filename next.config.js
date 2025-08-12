/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent server-only libs from being bundled client-side
      config.resolve.alias['@opentelemetry/api'] = false;
      config.resolve.alias['@opentelemetry/instrumentation'] = false;
      config.resolve.alias['@opentelemetry/sdk-node'] = false;
      config.resolve.alias['genkit'] = false;
      config.resolve.alias['firebase-admin'] = false;
      config.resolve.alias['handlebars'] = false;
      config.resolve.alias['require-in-the-middle'] = false;
      config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    }
    return config;
  },
};

export default nextConfig;
