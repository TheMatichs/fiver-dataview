const http = require('http');
const httpProxy = require('http-proxy');

const targetUrl = 'http://220.135.145.156:5014'; // Replace this with the base URL of your actual API server

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

const port = 3000; // Change this to the desired port number

server.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
