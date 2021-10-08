module.exports = {
  PORT: process.env.PORT || 8082,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  // JWT_EXPIRY: process.env.JWT_EXPIRY,
  JWT_EXPIRY: '1200s',
};
