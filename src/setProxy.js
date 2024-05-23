const {createProxyMiddleware} = require('http-proxy-middleware');

export default function (app) {
  app.use( '/api',
    createProxyMiddleware({
      target: "https://127.0.0.1:443",
      changeOrigin: true,
    })
  );
};