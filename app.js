const Twit = require('twit');
const Dotenv = require('dotenv').config();
console.log(process.env.TWITTER_API_KEY)


const T = new Twit({
    consumer_key:         process.env.TWITTER_API_KEY,
    consumer_secret:      process.env.TWITTER_API_SECRET_KEY,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
  });

const tweet = {
  status: 'Test'
}

function tweetCallback(err, data, response) {
  console.log(data)
  if (err) {
    console.log('Something went wrong')
  } else {
    console.log('Tweet posted')
  }
}

T.post('statuses/update', tweet, tweetCallback);
