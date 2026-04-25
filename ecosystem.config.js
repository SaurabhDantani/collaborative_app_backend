require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'collab-app',
      script: 'dist/server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8080,
        CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: process.env.PORT || 8080,
        CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
      },
    },
  ],
};
