/** @type {import('next').NextConfig} */
const cloudWorkstationDevOrigins = [
  "3000-firebase-urai-spatial-1769687960051.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev",
  "3014-firebase-urai-spatial-1769687960051.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev",
  "3000-firebase-urai-1757145184070.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev",
  "3014-firebase-urai-1757145184070.cluster-c72u3gwiofapkvxrcwjq5zllcu.cloudworkstations.dev",
];

const localDevOrigins = [
  "localhost:3000",
  "localhost:3014",
  "127.0.0.1:3000",
  "127.0.0.1:3014",
  "0.0.0.0:3000",
  "0.0.0.0:3014",
];

const envDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig = {
  reactStrictMode: true,
  images: { domains: [] },
  allowedDevOrigins: [...new Set([...cloudWorkstationDevOrigins, ...localDevOrigins, ...envDevOrigins])],
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;