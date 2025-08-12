/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // These are server-only packages that should not be included in the client bundle.
      // We alias them to a dummy module that returns an empty object.
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
        'genkit': false,
        '@genkit-ai/core': false,
        '@genkit-ai/googleai': false,
        '@genkit-ai/google-cloud': false,
        '@genkit-ai/firebase': false,
        '@opentelemetry/api': false,
        '@opentelemetry/sdk-node': false,
        '@opentelemetry/instrumentation': false,
        'handlebars': false,
        'require-in-the-middle': false,
        '@opentelemetry/exporter-jaeger': false,
        '@opentelemetry/instrumentation-winston': false,
      };
    }
    return config;
  },
};

export default nextConfig;
