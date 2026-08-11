if (process.env.URAI_SKIP_REAL_3D_BUILD !== "1") {
  await import("./scripts/assets/build-real-3d-assets.mjs");
  await import("./scripts/assets/embed-real-3d-world-contracts.mjs");
  await import("./scripts/assets/check-real-3d-assets.mjs");
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
