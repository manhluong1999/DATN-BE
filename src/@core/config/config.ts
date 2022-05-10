import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.ENV || 'PROD',
  api: {
    port: process.env.PORT || 4000,
  },
  mongo: {
    port: process.env.MONGO_PORT || 27017,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
    host: process.env.MONGO_HOST,
  },
  jwt: {
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    access_token_expireTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refresh_token_expireTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
};
