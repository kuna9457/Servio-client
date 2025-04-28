/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://servio-server.onrender.com/api/:path*'
          : 'http://localhost:5000/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig 