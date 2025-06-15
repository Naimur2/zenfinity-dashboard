module.exports = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
  transpilePackages: ["@mui/x-charts"],
  images: {
    domains: [
      "localhost",
      "admin.zenfinity.app",
      "zenfinity-prod.s3.ap-south-1.amazonaws.com",
    ],
  },
};