/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "*": ["./prisma/**/*"],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
