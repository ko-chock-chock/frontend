/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true, // app 디렉토리 활성화
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kmong-s3.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
