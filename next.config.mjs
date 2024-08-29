/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "static.vecteezy.com",
      },
      {
        hostname: "avatar.vercel.sh",
        port: "",
      },
      {
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};
export default nextConfig;
