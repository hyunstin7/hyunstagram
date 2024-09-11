
module.exports = {
  // reactStrictMode : false,
    async rewrites() {
      return [
        {
          source: '/api/websocket',
          destination: '/api/websocket',
        },
      ];
    },
  };
  