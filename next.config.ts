import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ['picsum.photos'],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig

export default nextConfig;

