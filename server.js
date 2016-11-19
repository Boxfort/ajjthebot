const Twitter = require('twit');
const moment = require('moment');

const config = require('./config');
const { pick } = require('./lyrics');

const generateRandomInterval = (rate, minimum, maximum) => {
  const interval = Math.floor(-Math.log(1 - Math.random()) / rate);
  return Math.min(interval + minimum, maximum);
}

const T = new Twitter({
  consumer_key: config.get('consumer_key'),
  consumer_secret: config.get('consumer_secret'),
  access_token: config.get('access_token'),
  access_token_secret: config.get('access_token_secret'),
});

console.log(config.getProperties());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function tweeter() {
  while(true) {
    const tweet = await pick();
    // T.post('statuses/update', { status: tweet });

    const interval = generateRandomInterval(
      config.get('rate'),
      config.get('minimum'),
      config.get('maximum')
    );

    await sleep(interval);
  }
}

function replyer () {
  const stream = T.stream('statuses/filter', { track: 'ajjthebot'});
  stream.on('tweet', async function(tweet) {
    const { id_str, user, text } = tweet;

    // Favourite the tweet.
    T.post('favorites/create', { id: id_str });

    // If asked a question, respond with a lyric (hopefully).
    if (text.indexOf('?') > -1) {
      const prefix = `@${user.screen_name} `;
      const reply = await pick(140 - prefix.length);
      T.post('statuses/update', { status: `${prefix}${reply}`, in_reply_to_status_id: id_str });
    }
  });
}

tweeter();
replyer();
