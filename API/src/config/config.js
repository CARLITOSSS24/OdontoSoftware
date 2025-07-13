require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 5000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  recoverySecret: process.env.RECOVERY_SECRET || 'recovery_secret_key',
  mailerUser: process.env.MAILER_USER,
  mailerPassword: process.env.MAILER_PASSWORD,
  apiUrl: process.env.API_URL || 'http://localhost:5000/api',
};

module.exports = config; 
