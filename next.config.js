
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/websocket',
          destination: '/api/websocket',
        },
      ];
    },
  };
  