// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');
const fs = require('fs');

// Your Google Cloud Platform project ID
const projectId = 'ferrous-osprey-184713';

const bucketName = 'audiofilestemp';
var filename = '1.flac';

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();


const gcuri = 'gs://'+bucketName+'/'+filename;


    
// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = './resources/3.flac';
//const uri = 'gs://${bucketName}/${filename}'

// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  //content: audioBytes
uri: gcuri
};
const config = {
  encoding: 'FLAC',
  sampleRateHertz: 16000,
  languageCode: 'en-IN'
};
const request = {
  audio: audio,
  config: config
};
//asynclongrunning();
asynclongwordtimeindex();

function trysync(){
// Detects speech in the audio file

filename = '3.flac';
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
}

function asynclongrunning(){

    speechClient
    .longRunningRecognize(request)
    .then(data => {
      const response = data[0];
      const operation = response;
      // Get a Promise representation of the final result of the job
      return operation.promise();
    })
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function asynclongwordtimeindex(){
    
    speechClient
    .longRunningRecognize(request)
  .then(data => {
    const operation = data[0];
    // Get a Promise representation of the final result of the job
    return operation.promise();
  })
  .then(data => {
    const response = data[0];
    response.results.forEach(result => {
      console.log(`Transcription: ${result.alternatives[0].transcript}`);
      result.alternatives[0].words.forEach(wordInfo => {
        // NOTE: If you have a time offset exceeding 2^32 seconds, use the
        // wordInfo.{x}Time.seconds.high to calculate seconds.
        const startSecs =
          `${wordInfo.startTime.seconds}` +
          `.` +
          wordInfo.startTime.nanos / 100000000;
        const endSecs =
          `${wordInfo.endTime.seconds}` +
          `.` +
          wordInfo.endTime.nanos / 100000000;
        console.log(`Word: ${wordInfo.word}`);
        console.log(`\t ${startSecs} secs - ${endSecs} secs`);
      });
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}