const { send } = require('process');
//const { ConnectionPolicyPage } = require('twilio/lib/rest/voice/v1/connectionPolicy');

//Twilio credentials
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

//GLOBAL varaibles
var gameCounter = 0;
var rounds = 0;
var hints = 3;
var correctAns = false;
var gameStarted = false;
var playerPhoneNum;
var newMessageBody;

//GLOBAL arrays
var knownFor = [];
var heroDob = [];
var heroDied = [];
var heroDesc = [];
var heroAge = [];
var heroImage = [];
var blackHeroNames = [];


//function complete!
//read peopleDB file to get users
function readDB() {
    var peopleDatabase;
    const fs = require('fs');

    fs.readFile('./demoPeopleDB.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        }
        else {
            peopleDatabase = JSON.parse(data);
        }
        let numOfBlackHereos = getRandomInt(0, peopleDatabase.length);
        let numOfBlackHereosFiltered = numOfBlackHereos.filter((value, index) => numOfBlackHereos.indexOf(value) === index);
        var currentHero = 0;
        var i;



        //parsing data
        for (let db = 0; db < numOfBlackHereosFiltered.length; db++) {
            currentHero = numOfBlackHereosFiltered.pop();
            i = parseInt(currentHero);

            if(peopleDatabase[i].name != ''){
            blackHeroNames.push(peopleDatabase[i].name);
            knownFor.push(peopleDatabase[i].knownFor);
            heroDob.push(peopleDatabase[i].dob);
            heroDied.push(peopleDatabase[i].died);
            heroDesc.push(peopleDatabase[i].description);
            heroImage.push(peopleDatabase[i].image);
            heroAge.push(peopleDatabase[i].age)
            }
        }
        
        console.log(blackHeroNames);
        console.log(blackHeroNames.length);

        gameLogic();
    });


}

function gameLogic() {    
    var response = newMessageBody;
    var i = parseInt(gameCounter);

    if(gameStarted == true && i == 0 && response == "Play"){
        sendMessage(playerPhoneNum,`This hero is known for: ${knownFor[i]}`);
        console.log(blackHeroNames[i]);

    }
    else if(gameStarted == true && response == "Skip" && rounds < blackHeroNames.length){
        sendMessage(playerPhoneNum, `Good try! The hero is ${heroDesc[i]}`);
        sendMessage(playerPhoneNum,heroImage[i]);
        sendMessage(playerPhoneNum, 'Reply "Next" to continue'); //--NEED LOGIC TO HAVE APP WAIT
        rounds++;
        gameCounter++;
        i = parseInt(gameCounter);
        hints = 3;
    }
    else if(gameStarted == true && response == blackHeroNames[i]){
        sendMessage(playerPhoneNum, `Correct! ${heroDesc[i]}`);
        sendPhoto(playerPhoneNum, heroImage[i]);

        sendMessage(playerPhoneNum, 'Reply "Next" to continue'); //--NEED LOGIC TO HAVE APP WAIT
        // rounds++;
        // gameCounter++;
        correctAns = true;
    }
    //user guessing logic
    else if(gameStarted == true && response != blackHeroNames[i] && response != "Hint" && response != "Next" && response != "Play"){
        if(hints != 0){
            sendMessage(playerPhoneNum,'Nope guess again! Type "Hint" for a clue or "Skip"');
        }else{
            sendMessage(playerPhoneNum,"Nope guess again! You don't have anymore hints keep guessing or reply 'Skip'");
        }
    }

    //new round started
    if (gameStarted == true && rounds < blackHeroNames.length && response == "Next"){
        correctAns = false;
        hints = 3;
        rounds++;
        gameCounter++;
        i = parseInt(gameCounter);
        sendMessage(playerPhoneNum,`This hero is known for: ${knownFor[i]}`);
        console.log(blackHeroNames[i]);
    }
    //end game logic
    if(rounds == 10){
        sendMessage(playerPhoneNum,'This game is complete! Thanks for playing! If you want to play another game just text "Play" or type "Done" to end the session!'); //--NEED LOGIC TO HAVE APP WAIT
        gameStarted = false;
    }
    //HINTS LOGIC
    if(gameStarted == true && response == "Hint"){
        if(hints == 3){
            hints--;
            sendMessage(playerPhoneNum,`This hero was born on: ${heroDob[i]}`);
        }
        else if (hints == 2){
            hints--;
            sendMessage(playerPhoneNum,`This hero died on: ${heroDied[i]} (age ${heroAge[i]})`);
        }
        else if (hints == 1){
            hints--;
            sendMessage(playerPhoneNum,"Here's a photo, you're out of hints now! Keep guessing or reply 'Skip'", heroImage[i]);
            //sendMessage(playerPhoneNum,heroImage[i]);
        }
        

    }
}

function processMes(messageBody){

    // var messageContent;

    // if (messageBody != null){
    //     messageContent = messageBody.trim();
    //     console.log("message content " + messageContent);
    // }
    // return messageContent;
}

function sendPhoto(playerPhoneNum,mediaURL) {
console.log("send photo");
    const client = require('twilio')(accountSid, authToken);

    if(mediaURL != null ){
        client.messages.create({
            to: playerPhoneNum,
            from: '+17342159372',
            mediaUrl: mediaURL,
            statusCallback: 'https://0332ea57df2dbb2a7c337c9b9c3fb835.m.pipedream.net'
        })
           // .then((message) => console.log(message.sid));
 
    }

}
function sendMessage(playerPhoneNum,messageBody,mediaURL) {

    const client = require('twilio')(accountSid, authToken);

    if(mediaURL == null){
        client.messages.create({
            to: playerPhoneNum,
            from: '+17342159372',
            body: messageBody,
            statusCallback: 'https://0332ea57df2dbb2a7c337c9b9c3fb835.m.pipedream.net'
        })
           // .then((message) => console.log(message.sid));

    }
    else if(mediaURL != null && messageBody == null){
        client.messages.create({
            to: playerPhoneNum,
            from: '+17342159372',
            mediaUrl: mediaURL,
            statusCallback: 'https://0332ea57df2dbb2a7c337c9b9c3fb835.m.pipedream.net'
        })
           // .then((message) => console.log(message.sid));

    }
    else if (mediaURL != null && messageBody != null){
        client.messages.create({
            to: playerPhoneNum,
            from: '+17342159372',
            body: messageBody,
            mediaUrl: mediaURL,
            statusCallback: 'https://0332ea57df2dbb2a7c337c9b9c3fb835.m.pipedream.net'
        })
           // .then((message) => console.log(message.sid));

    }

}

//function working
function gameStart(){

const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  console.log("new game started");
  
  if (gameStarted == false && req.body.Body != "Play"){
    sendMessage(req.body.From, "https://black-hero-images.s3.us-east-2.amazonaws.com/BHAppRules.png");
    twiml.message('Welcome to the Black Hero App! You will receive a link to the game rules, be sure to read over them! When you are ready reply "Play" to start the game.');
  }

  if(req.body.Body == "Play" && gameStarted == false){
    twiml.message('Wohoo your new game has started! Your job is to reply with the name of the Black Hero based on the description!');
    playerPhoneNum = req.body.From; 
    newMessageBody = req.body.Body;
    gameStarted = true; 
    gameCounter = 0;
    rounds = 1;
    readDB();     
  }
  else if (req.body.Body == "Done"){
    newMessageBody = req.body.Body;
    twiml.message('Thanks for playing! If you want to play another game just text "Play"!');
    gameStarted = false;
    console.log("game ended "); 
 }
  else if(gameStarted == true)
  {
    newMessageBody = req.body.Body;
    console.log("new message body " + newMessageBody);
    gameLogic();
  }
  
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(80, () => {
  console.log('Express server listening on port 80');
});


}
//function complete!
function getRandomInt(min, max) {
    let numOfBlackHereos = [];
    min = Math.ceil(min);
    max = Math.floor(max);
    //console.log(Math.floor(Math.random() * (max - min) + min));

    for (let i = 0; i < 25; i++) {
        let ranNum = Math.floor(Math.random() * (max - min) + min);
        numOfBlackHereos.push(ranNum);
    }
    return numOfBlackHereos;
}

gameStart();
//readDB();
//sendMessage('+17346730354','Hello');
