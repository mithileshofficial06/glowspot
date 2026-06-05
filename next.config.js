/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Optimize builds and prevent caching issues
  webpack: (config, { dev, isServer }) => {
    // Disable caching in development to prevent style issues
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  // Faster refresh
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
