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

console.log('Querying Unsplash...')

// Search unsplash for a photo, then download it,
// then attach it to a tweet
let fetchPhoto = unsplash.photos.getRandomPhoto({
  query: 'brutalist + architecture'
})
  .then(response => response.json())
  .then(data => saveImageToDisk(data))
  .catch(error => console.log(error))

function saveImageToDisk(data) {
  // Create a writable path for the target file, '.pipe()' connects 
  // readable data to the writeable stream.
  console.log('Saving image to disk...')
  let file = fs.createWriteStream('./images/file.jpeg')
  const request = https.get(data.urls.regular, (response) => {
    response.pipe(file)
      .on('finish', () => {
        console.log('Image saved!')
        sendTweet(data);
      })
  });
}

// Wrapper function for composing a tweet. First uploads
// the saved image, then writes the text.
function sendTweet(data) {
  // console.log(data.urls)
  // console.log(data.user.links.html)
  let file = './images/file.jpeg';
  console.log(file);
  const params = {
    encoding: 'base64'
  }
  const base64content = fs.readFileSync(file, params);

  T.post('media/upload', { media_data: base64content }, uploaded);

  function uploaded(err, data, response) {
    if (err) {
      console.log(err)
    } else {
      const id = data.media_id_string;
      console.log(id)
      const status = {
        status: 'image test',
        media_ids: [id]
      }
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
