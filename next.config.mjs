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
        protocol: 'https',
        hostname: 'http.cat',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
