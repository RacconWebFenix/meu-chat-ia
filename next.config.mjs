/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "*": ["./prisma/**/*"],
  },
};

export default nextConfig;
