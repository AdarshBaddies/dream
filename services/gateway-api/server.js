require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://auth:5001';

// Simple health
app.get('/', (req, res) => res.send('Gateway API is running'));

// Route examples: /auth/... -> auth service
app.use('/auth', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: { '^/auth': '' } }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Gateway listening on ${PORT}, proxying auth -> ${AUTH_SERVICE}`);
});
