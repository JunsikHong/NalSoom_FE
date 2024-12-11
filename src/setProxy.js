const {createProxyMiddleware} = require('http-proxy-middleware');

export default function (app) {
  app.use( '/api',
    createProxyMiddleware({
      target: "https://nalsoom.online",
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
      target: 'http://openapi.seoul.go.kr:8088',
      changeOrigin: true,
    })
  )
};
