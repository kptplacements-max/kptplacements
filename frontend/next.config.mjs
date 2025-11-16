import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack
  experimental: {
    turbo: false,
  },

  // Fix Emotion (MUI)
  compiler: {
    emotion: true,
  },

  // Allow Cloudinary images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },

  reactStrictMode: true,
};

// Wrap with PWA
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA during dev
})(nextConfig);
