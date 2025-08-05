import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  webpack: (config, { isServer }) => {
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
  // Enable build caching
  experimental: {
    turbo: {
      rules: {
        '*.hbs': {
          loaders: ['handlebars-loader'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
