const Twitter = require('twit');
const moment = require('moment');

const config = require('./config');
const { pick } = require('./lyrics');

const T = new Twitter({
  consumer_key: config.get('consumer_key'),
  consumer_secret: config.get('consumer_secret'),
  access_token: config.get('access_token'),
  access_token_secret: config.get('access_token_secret'),
});

const generateRandomInterval = (rate, minimum, maximum) => {
  const interval = Math.floor(-Math.log(1 - Math.random()) / rate);
  return Math.min(interval + minimum, maximum);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function tweeter() {
  while(true) {
    const { song, tweet } = await pick();
    T.post('statuses/update', { status: tweet });

    const interval = generateRandomInterval(
      config.get('rate'),
      config.get('minimum'),
      config.get('maximum')
    );

    console.log('TWEET');
    console.log('From:', song);
    console.log('Tweeted:', tweet.replace(/\n/g, '\\n'));
    console.log('Waiting:', moment.utc(interval).format('HH:mm:ss'));
    console.log();

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
      const { song, tweet: reply } = await pick(140 - prefix.length);
      T.post('statuses/update', { status: prefix + reply, in_reply_to_status_id: id_str });

      console.log('REPLY');
      console.log('From:', song);
      console.log('Tweeted:', prefix + reply.replace(/\n/g, '\\n'));
      console.log();
    }
  });
}

tweeter();
replyer();
