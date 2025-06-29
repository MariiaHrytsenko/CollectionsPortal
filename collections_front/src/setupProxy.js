// This file is used to proxy API requests from the frontend to the backend during development.
// Update the target below to match your backend server's URL and port.

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5057', // <-- Changed to your backend URL/port
      changeOrigin: true,
    })
  );
};
