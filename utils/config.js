const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../../.env` });

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: (process.env.PORT) ? process.env.PORT : 3000
}

module.exports = config;
