/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@saas-platform/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/tiktok7fHNbRPiQdz4VezDzzqgiIirw98jMf9J.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
