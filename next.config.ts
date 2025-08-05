
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
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
    ],
  },
  // Optimization for build cache
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config, { isServer }) => {
    // Handle require.extensions and missing modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      '@opentelemetry/exporter-jaeger': false,
      '@genkit-ai/firebase': false,
    };

    // Add null-loader for missing files/modules and handle handlebars
    config.module.rules.push(
      {
        test: /\.node$/,
        use: 'null-loader',
      },
      {
        test: /handlebars/,
        use: 'null-loader',
      }
    );

    // Split large chunks for better caching
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
