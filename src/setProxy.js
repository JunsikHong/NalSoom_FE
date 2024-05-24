const {createProxyMiddleware} = require('http-proxy-middleware');

export default function (app) {
  app.use( '/api',
    createProxyMiddleware({
      target: "https://localhost:443",
      changeOrigin: true,
    })
  );
};