const Unsplash = require('unsplash-js').default;
const fetch = require('node-fetch');
global.fetch = fetch;
const Twit = require('twit');
const Dotenv = require('dotenv').config();

const unsplash = new Unsplash({
  accessKey: `${process.env.UNSPLASH_ACCESS_KEY}`
});

// console.log(unsplash)

unsplash.photos.getRandomPhoto({
  query: 'brutalism'
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

const T = new Twit({
  consumer_key:         process.env.TWITTER_API_KEY,
  consumer_secret:      process.env.TWITTER_API_SECRET_KEY,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});


function sendTweet() {
  const tweet = {
    status: 'Test'
  }
  function tweetCallback(err, data, response) {
    // console.log(data)
    if (err) {
      console.log('Something went wrong')
      console.log(err)
    } else {
      console.log('Tweet posted')
    }
  }
  T.post('statuses/update', tweet, tweetCallback);
}
