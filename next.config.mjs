import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:[
      {
        protocol: "https",
        hostname: "localhost",
        port: "7777",
        pathname: "/images/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7778",
        pathname: "/images/**"
      },
      {
        protocol: "https",
        hostname: "dobdkvtatcbahlfxeriy.supabase.co",
        pathname: "/**"
      },
      {
        protocol: 'https',
        hostname: 'http.cat',
        pathname: '/**'
      }
    ]
  },
  pageExtensions: ['md', 'mdx', 'ts', 'tsx']
};

const withMDX = createMDX({
  
});

export default withMDX(nextConfig);
