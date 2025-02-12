// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // experimental: {
//   //   appDir: true, // app 디렉토리 활성화
//   // },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     domains: ["ko-chock-chock.s3.ap-northeast-2.amazonaws.com"],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
};

export default nextConfig;
