/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Correctly externalize server-only packages to prevent bundling errors
    config.experiments = {
      ...config.experiments,
      serverComponentsExternalPackages: [
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
        'winston',
      ],
    };

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
