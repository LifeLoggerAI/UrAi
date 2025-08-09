/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {},
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      net: false,
      tls: false,
      fs: false,
      child_process: false,
      http: false,
      https: false,
      os: false,
      path: false,
    };

    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@opentelemetry/ },
      /require\.extensions/,
    ];

    // Handle handlebars loader
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
    });

    return config;
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
  devIndicators: {
    allowedDevOrigins: ['https://*.cloudworkstations.dev'],
  },
  // Removed experimental.turbo block
};

module.exports = nextConfig;
