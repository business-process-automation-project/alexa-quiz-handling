const Alexa = require('ask-sdk-core');
const mqtt = require('mqtt');

const language = require('./language');
const StartGameIntent = require('./startGameHandler');
const QuestionsEndedIntent = require('./questionsEndedHandler');
const JumpStartetIntent = require('./jumpStartetHandler.js');
const DeletePlayerIntent = require('./deletePlayerHandler.js');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder
      .speak(language.deData.translation.WELCOME_MESSAGE)
      .reprompt(language.deData.translation.REPROMT_MESSAGE)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(language.deData.translation.HELP_MESSAGE)
      .reprompt(language.deData.translation.REPROMT_MESSAGE)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    publishDataMQTT("ClearSession", "Ende");
    return handlerInput.responseBuilder
      .speak(language.deData.translation.CLOSE_MESSAGE)
      .getResponse();
  },
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    publishDataMQTT("ClearSession", "Ende");
    return handlerInput.responseBuilder
      .speak(language.deData.translation.CLOSE_MESSAGE)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    publishDataMQTT("ClearSession", "Ende");
    
    return handlerInput.responseBuilder
      .speak(language.deData.translation.ERROR_MESSAGE)
      .reprompt(language.deData.translation.ERROR_MESSAGE)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    StartGameIntent.StartGameHandler,
    JumpStartetIntent.JumpStartetHandler,
    QuestionsEndedIntent.QuestionsEndedHandler,
    DeletePlayerIntent.DeletePlayerHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

function publishDataMQTT(channelName, daten) {
  const client = mqtt.connect('mqtt://34.230.40.176');

  client.on('connect', function () {
    client.publish(channelName, daten);
    client.end();
  });
}
