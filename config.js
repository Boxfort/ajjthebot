const convict = require('convict');

const config = convict({
  consumer_key: {
    default: '',
    env: 'CONSUMER_KEY',
    format: String,
  },
  consumer_secret: {
    default: '',
    env: 'CONSUMER_SECRET',
    format: String,
  },
  access_token: {
    default: '',
    env: 'ACCESS_TOKEN',
    format: String,
  },
  access_token_secret: {
    default: '',
    env: 'ACCESS_TOKEN_SECRET',
    format: String,
  },
  rate: {
    default: 1 / (60 * 60 * 1000),
    doc: 'Expected rate of tweets per minute (in milliseconds)',
    env: 'RATE',
    format: Number,
  },
  minimum: {
    default: 1 * 60 * 60 * 1000,
    doc: 'Minimum time between tweets (in milliseconds)',
    env: 'MINIMUM',
    format: Number,
  },
  maximum: {
    default: 4 * 60 * 60 * 1000,
    doc: 'Maximum time between tweets (in milliseconds)',
    env: 'MAXIMUM',
    format: Number,
  },
});

config.validate({ strict: true });

module.exports = config;
