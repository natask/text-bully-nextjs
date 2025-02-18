/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle ffmpeg binaries
    if (isServer) {
      config.externals = [
        ...config.externals,
        '@ffmpeg-installer/ffmpeg',
        'ffprobe-static'
      ];
    }
    return config;
  },
  serverExternalPackages: ['@ffmpeg-installer/ffmpeg', 'ffprobe-static'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
