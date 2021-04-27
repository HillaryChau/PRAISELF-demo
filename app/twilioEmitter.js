const EventEmitter = require('events');
const schedule = require('node-schedule');
const accountSid = process.env.TWILIO_ACCOUNT_SID; // the .env allows me to hide enviroment variables from the code when uploaded online
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken); // picks up twilio from the node modules and helps you login to twilio with the variables accountSid, authToken)
const twilioEmitter = new EventEmitter();


function sendSms(req, res) {
  const { phoneNumber, link, affirmation } = req.body; // destructured code, same as writing it as const phoneNumber = req.body.phoneNumber//
  const { negativeEmotion, positiveAffirmation } = affirmation;
  const textHeader = 'Hello from PRAISELF.';
  const feelingHeader = `${negativeEmotion}...`;
  const emotionsHeader = 'Please read these affirmations:';
  const emotionsBody = '• ' + positiveAffirmation.split('. ').join('.\n• ');
  const textFooter = `See these affirmations at ${link}`;
  const textFooterEnd = `🌻 🌻 🌻 🌻 🌻 🌻 🌻 🌻 🌻`;
  const body = [textHeader, feelingHeader, emotionsHeader, emotionsBody, textFooter, textFooterEnd].join('\n\n');


  //=== this is where the SMS promise is created===
  client.messages
    .create({ body, from: '+12013807615', to: phoneNumber })
    .then((message) => {
      // this is where the fullfillment promise handler is//
      if (message.sid) {
        res.send({ message: 'Message sent successful' });
      } else {
        res.send({ message: 'Oops, something went wrong!' });
      }
    })
    .catch(() => {
      // catch block in case the promise fails, it goes to this route
      res.send({ message: 'Twilio Phone number has been disabled' });
    });
}

//===eventListener to SCHEDULE MESSAGES===
twilioEmitter.on('twilio-scheduled-message', (req, res) => {
  const { scheduledTime } = req.body;
  let [hours, minutes] = scheduledTime;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  if (process.env.NODE_ENV) {
    // heroku server runs on UTC time
    // this normalizes EST to UTC
    hours = hour - 4;
  }
  const date = new Date(year, month, day, hours, minutes, 0);
  schedule.scheduleJob(date, function () {
    sendSms(req, res);
  });
  res.send({ message: `Message scheduled successfully for ${date}` });
});


twilioEmitter.on('twilio-message', (req, res) => {
  sendSms(req, res);
});


module.exports = twilioEmitter;