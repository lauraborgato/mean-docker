const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../.env` });

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: (process.env.PORT) ? process.env.PORT : 3000,
  DB:{
    DB_URL: process.env.DB_URL
  }
}

module.exports = config;
