/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "*",
            //hostname: "*.googleusercontent.com",
            port: "",
            pathname: "**"
          }
        ]
    },
    async headers() {
      return [
        {
          // source: '/api/(.*)',
          source: '/api/rankings',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate',
            },
          ],
        },
      ];
    },
}

module.exports = nextConfig