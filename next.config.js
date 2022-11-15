/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.lp1.av5ja.srv.nintendo.net',
      },
    ],
  },
}

module.exports = nextConfig
