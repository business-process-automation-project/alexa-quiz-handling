const mqtt = require('mqtt')

exports.QuestionsEndedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuestionsEndedIntent';
    },
    async handle(handlerInput) {

        // publishDataMQTT("Lights","Answer3");

        let speechText = '<break time="4s"/> Wie soll ich fortfahren?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

function publishDataMQTT(channelName, status) {
    const client = mqtt.connect('mqtt://34.230.40.176');

    client.on('connect', function () {
        console.log("connected with mqtt: " + channelName);
        client.subscribe(channelName, function (err) {
            if (!err) {
                client.publish(channelName, status);
            }
        })
        client.end();
    })
}

