/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static generation during build
  output: process.env.NODE_ENV === 'production' ? undefined : 'standalone',
  
  // Disable image optimization to avoid build issues
  images: {
    unoptimized: true
  },
  
  // Configure webpack to handle the build differently
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Skip client-side static generation
      config.optimization = {
        ...config.optimization,
        sideEffects: false
      }
    }
    return config
  },
  
  // Force dynamic rendering
  experimental: {
    isrMemoryCacheSize: 0,
  },
  
  // Skip certain optimizations
  poweredByHeader: false,
  compress: false,
}

module.exports = nextConfig
