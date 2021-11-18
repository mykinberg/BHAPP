const { send } = require('process');

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        to:'+17346730354',
        from: '+17342159372',
        body: 'Welcome to the Black History App. Reply "Start" for instructions.',
        statusCallback: 'https://0332ea57df2dbb2a7c337c9b9c3fb835.m.pipedream.net'
    })
        .then((message) => console.log(message.sid));


const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  console.log("testing");

  console.log(req.body.Body);
  if(req.body.Body == "Start"){
   
    twiml.message('This is a Black Hero Trivia game! Your job is to reply with the name of the Black Hero based on a description I will send!');
    //twiml.message('This game is case sensitive make sure you spell the name right!');
    twiml.message('At any point text a game keyword: "Hint" for clues or "Done" to end the game.');
  }
  else if (req.body.Body == "Done"){
    twiml.message('Thanks for playing! If you want to play another game just text "Start"!');
  }
  else if (req.body.Body == "Yes"){
    //trigger game start
  }
  else{
    //trigger game start
    twiml.message('Thanks for playing Black Hero Trivia!');
  }
  
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

