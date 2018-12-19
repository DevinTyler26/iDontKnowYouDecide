/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

"use strict";
const Alexa = require("alexa-sdk");

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = "amzn1.ask.skill.aacf2066-fbd6-4006-953c-2b568ef7281a";

const SKILL_NAME = "I Don't Know, You Decide.";
const HELP_MESSAGE =
  "You can say somthing like, Find a place to eat at, or, Find me a place Burger joint in Seattle to eat at. What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const greetings = [
  "Hey! If you are pretty indecisive, you can ask things like, find me a place to eat, or, find a place to eat in Seattle.",
  "Hello! If you know they type of food you want to eat, you can ask things like, find me a thai place to eat, or, find a burger place to eat in Seattle.",
  "Hello! You can leave all the decision making up to us, just ask, find me a place to eat, or find me a place in Bellevue",
  "Hey! You can be very direct, just ask, find me an ice cream place to eat in Redmond, or to leave it up to us, just say, find me a place to eat."
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

function buildHandlers(event) {
  var handlers = {
    "LaunchRequest": function() {
      const greetingsIndex = Math.floor(Math.random() * greetings.length);
      const randomGreeting = greetings[greetingsIndex];
      const speechOutput = randomGreeting;

      this.response.cardRenderer(SKILL_NAME, randomGreeting);
      this.response.speak(speechOutput);
      this.emit(":responseReady");
    },
    "getGreeting": async function() {
      console.log(null);
    },
    "findRestaurant": function(){
    
      const myLocation = event.request.intent.slots.city.value;
      const myCategory = event.request.intent.slots.place.value;

      const search = {
        term: myCategory,
        radius: 10000,
        limit: 50,
        open_now: true,
        category: "food,All"
      };
    
      if (myLocation) {
        search.location = location;
      } else {
        search.location = await getLocation(event);
      }
      client
        .search(search)
        .then(response => {
          let clientResponse = response.jsonBody.businesses;
          let len = clientResponse.length;
          if (len === 0) {
            console.log("No Locations");
            res.send("No Locations");
            return;
          }
          let choice = Math.floor(Math.random() * (len + 1));
          let miles = clientResponse[choice].distance * 0.00062137;
          console.log("------------------------------------------");
          console.log(`
          Picked:  ${clientResponse[choice].name}
          Miles Away: ${miles}
          Options Length: ${len}
          Options Choice Number: ${choice}
          `);
          console.log("------------------------------------------");
          this.response.speak(`How about trying out ${place}. It is ${miles} away from your location given and is currently open.`);
        })
        .catch(e => {
          console.log(e);
          res.send(e);
        });
    },
    "AMAZON.HelpIntent": function() {
      const speechOutput = HELP_MESSAGE;
      const reprompt = HELP_REPROMPT;

      this.response.speak(speechOutput).listen(reprompt);
      this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
      this.response.speak(STOP_MESSAGE);
      this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
      this.response.speak(STOP_MESSAGE);
      this.emit(":responseReady");
    }
  };
}

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(buildHandlers);
  alexa.execute();
};


function getLocation(event){
  //generate the voice response using this.response.speak 
  this.response.speak('Please grant skill permissions to access your device address.'); 
  const permissions = ['read::alexa:device:all:address']; 
  this.response.askForPermissionsConsentCard(permissions); 
  this.emit(':responseReady'); 
  //grabbing the deviceID and api access token
  const token = event.context.System.apiAccessToken 
  const deviceId = event.context.System.device.deviceId; 
  //getting the api endpoint
  const apiEndpoint = event.context.System.apiEndpoint; 
  // Grabbing the address and then saving it as a string for later
  const das = new Alexa.services.DeviceAddressService(); 
  const city;
  das.getFullAddress(deviceId, apiEndpoint, token) 
  .then((data) => { 
    //this.response.speak('<address information>'); 
    JSON.stringify(data); //turning the address into a string. 
    city = data.city;
    //this.response.speak("You are in " + data.city); 
    this.emit(':responseReady'); 
  }) 
.catch((error) => { 
    this.response.speak('I\'m sorry. Something went wrong.'); 
    this.emit(':responseReady'); 
    console.log(error.message); 
    }); 
    return city;
}