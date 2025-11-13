/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Disable Turbopack completely (uses Webpack instead)
  experimental: {
    turbo: false,
  },

  // ✅ Fix Emotion (used internally by MUI) SSR + CSS issues
  compiler: {
    emotion: true,
  },

  // ✅ Allow Cloudinary-hosted images to render properly
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },

  // ✅ Enable React strict mode (safe for MUI + Next 16)
  reactStrictMode: true,
};

export default nextConfig;
