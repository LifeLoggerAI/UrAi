/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { tsconfigPath: "./tsconfig.next.json" },
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // For server-side, tell Webpack to not bundle firebase-admin
      // as it's a Node.js module that should be resolved at runtime.
      config.externals.push('firebase-admin');
    } else {
      // Prevent client-only libs from being bundled client-side
      config.resolve.alias = {
        ...config.resolve.alias,
        'genkit': false,
        '@genkit-ai/core': false,
        '@genkit-ai/googleai': false,
        '@genkit-ai/google-cloud': false,
        '@genkit-ai/firebase': false,
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
