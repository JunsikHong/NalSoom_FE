const {createProxyMiddleware} = require('http-proxy-middleware');

export default function (app) {
  app.use( '/api',
    createProxyMiddleware({
      target: "https://localhost:443",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware({
      target: 'https://apis.data.go.kr',
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware({
      target: 'https://openapi.seoul.go.kr:8088',
      changeOrigin: true
    })
  )
};
