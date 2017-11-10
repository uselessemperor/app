// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');
const fs = require('fs');

// Your Google Cloud Platform project ID
const projectId = 'ferrous-osprey-184713';
//////

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const bucketName = 'audiofiles';
const filename = '. ./local/path/to/file.txt';

// Uploads a local file to the bucket
storage
  .bucket(bucketName)
  .upload(filename)
  .then(() => {
    console.log(`${filename} uploaded to ${bucketName}.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });



// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = './resources/3.flac';
const uri = 'gs://${bucketName}/${filename}'

// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: audioBytes
};
const config = {
  encoding: 'FLAC',
  sampleRateHertz: 32000,
  languageCode: 'en-IN'
};
const request = {
  audio: audio,
  config: config
};

// Detects speech in the audio file
speechClient.recognize(request)
  .then((data) => {
    const response = data[0];
    const transcription = response.results.map(result =>
        result.alternatives[0].transcript).join('\n');
    console.log(`Transcription: ${transcription}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });