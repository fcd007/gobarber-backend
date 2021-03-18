import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  config: {
    redis: RedisOptions;
  };
}

export default {

  config: {
    redis: {
      host: process.env.REDIS_HOST,
      Port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined,
    },
  },
} as ICacheConfig
