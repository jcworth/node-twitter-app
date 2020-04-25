const Dotenv = require('dotenv').config();
const Unsplash = require('unsplash-js').default;
const fetch = require('node-fetch');
global.fetch = fetch;
const https = require('https');
const fs = require('fs');
const Twit = require('twit');

// Twitter API authorisation
const T = new Twit({
  consumer_key:         process.env.TWITTER_API_KEY,
  consumer_secret:      process.env.TWITTER_API_SECRET_KEY,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});

// Unsplash API authorisation
const unsplash = new Unsplash({
  accessKey: `${process.env.UNSPLASH_ACCESS_KEY}`
});
console.log(Date());
console.log('Starting application.')

// Search unsplash for a photo, then download it,
// then attach it to a tweet

function initBot() {
  console.log(Date());
  console.log('Querying Unsplash...')
  let fetchPhoto = unsplash.photos.getRandomPhoto({
    query: 'concrete brutalism'
  })
    .then(response => response.json())
    .then(data =>  {
      unsplash.photos.downloadPhoto(data);
      saveImageToDisk(data);
    })
    .catch(error => console.log(error))
}

function saveImageToDisk(data) {
  console.log('Saving image to disk...')
  let file = fs.createWriteStream('./images/file.jpeg')
  const request = https.get(data.urls.regular, (response) => {
    response.pipe(file)
      .on('finish', () => {
        console.log('Image saved.')
        sendTweet(data);
      })
  });
}

// Wrapper function for composing a tweet. First encodes and uploads
// the saved image, then writes the tweet content.

function sendTweet(data) {
  const imageJson = data
  let file = './images/file.jpeg';
  console.log(file);
  const params = {
    encoding: 'base64'
  }
  const base64content = fs.readFileSync(file, params);
  console.log('Uploading media to Tweet...')
  T.post('media/upload', { media_data: base64content }, uploaded);

  function uploaded(err, data, response) {
    if (err) {
      console.log(err)
    } else {
      const id = data.media_id_string;
      const status = {
        status: `Credit: ${imageJson.user.name} on Unsplash\n${imageJson.links.html}`,
        media_ids: [id]
      }
      console.log('Tweeting...')
      T.post('statuses/update', status, tweetCallback);
    }
  }

  function tweetCallback(err, data, response) {
    if (err) {
      console.log(err)
    } else {
      console.log('Tweet posted!')
    }
  }
}

// Run the application on an hourly interval
setInterval(initBot, 1000*60*60);