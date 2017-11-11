// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');
const Storage = require('@google-cloud/storage');
const fs = require('fs');

// Your Google Cloud Platform project ID
const projectId = 'ferrous-osprey-184713';
const bucketName = 'audiofilestemp'
const storage = new Storage();

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const filename = '3.flac';
const filepath = '/users/danielwesley/desktop/nodejs/resources/';
const path =filepath+filename;
//const filepath = '../resources/'
console.log("1");



function Upload(){
    console.log("2");
    //var deferred = Q.defer();
storage
  .bucket(bucketName)
  .upload(path)
  .then(() => {
    console.log(`${path} uploaded to ${bucketName}.`);
  })
  .catch(err => {
    console.error('ERROR1:', err);
  });
   // return deferred.promise;
}
console.log("3");
// Reads a local audio file and converts it to base64
//const file = fs.readFileSync(fileName);
//const audioBytes = file.toString('base64');


// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
    "uri":filepath
   //  "uri":"gs://"+bucketName+"/"+filename
  
};
console.log('gs://'+bucketName+'/'+filename);
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

