/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'www.waveproject.cl',
        'waveproject.cl',
        'waveproject-chile.vercel.app',
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/registro',
        destination: '/',
        permanent: true,
      },
      {
        source: '/mi-cuenta',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
