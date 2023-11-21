const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        "/user",
      createProxyMiddleware( {
        target: 'http://3.112.14.157:80',
        changeOrigin: true
      })
    )
    
  };