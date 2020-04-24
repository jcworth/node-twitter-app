const Dotenv = require('dotenv').config();
const Unsplash = require('unsplash-js').default;
const fetch = require('node-fetch');
global.fetch = fetch;
const https = require('https');
const fs = require('fs');

const Twit = require('twit');

const unsplash = new Unsplash({
  accessKey: `${process.env.UNSPLASH_ACCESS_KEY}`
});

// console.log(unsplash)

function saveImageToDisk(photoUrl) {
  // Create a writable path for the target file, '.pipe()' connects 
  // readable data to the writeable stream.
  const file = fs.createWriteStream('./images/file.jpeg')
  const request = https.get(`${photoUrl}`, function (response) {
    response.pipe(file)
  });
}

unsplash.photos.getRandomPhoto({
  query: 'brutalism'
})
  .then(response => response.json())
  .then(data => {
    const photoUrl = data.urls.raw
    console.log(data);
    console.log(photoUrl)
    saveImageToDisk(photoUrl)
  });

// const T = new Twit({
//   consumer_key:         process.env.TWITTER_API_KEY,
//   consumer_secret:      process.env.TWITTER_API_SECRET_KEY,
//   access_token:         process.env.ACCESS_TOKEN,
//   access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
// });


// function sendTweet() {
//   const tweet = {
//     status: 'Test'
//   }
//   function tweetCallback(err, data, response) {
//     // console.log(data)
//     if (err) {
//       console.log('Something went wrong')
//       console.log(err)
//     } else {
//       console.log('Tweet posted')
//     }
//   }
//   T.post('statuses/update', tweet, tweetCallback);
// }
