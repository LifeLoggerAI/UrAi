/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent server-only libs from being bundled client-side
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
        'genkit': false,
        '@genkit-ai/core': false,
        '@genkit-ai/googleai': false,
        '@genkit-ai/google-cloud': false,
        '@genkit-ai/firebase': false,
        // OpenTelemetry related packages that are Node.js specific
        '@opentelemetry/api': false,
        '@opentelemetry/sdk-node': false,
        '@opentelemetry/instrumentation': false,
        '@opentelemetry/exporter-jaeger': false,
        '@opentelemetry/instrumentation-winston': false,
        'handlebars': false,
        'require-in-the-middle': false,
      };

      // Polyfill Node.js built-in modules for the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
