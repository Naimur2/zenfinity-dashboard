module.exports = {
    async rewrites() {
        return [{
            source: '/',
            destination: '/home'
        }];
    },
    transpilePackages: ['@mui/x-charts'],
    images: {
        domains: [
            "localhost",
            "admin.zenfinity.app",
          ],
    },
}