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
    // Handle handlebars files
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
    });

    // Handle null loader for compatibility
    config.module.rules.push({
      test: /\.null$/,
      use: 'null-loader',
    });

    // Ignore handlebars require.extensions warnings
    config.ignoreWarnings = [{ message: /require\.extensions is not supported by webpack/ }];

    return config;
  },
};

export default nextConfig;
