const mqtt = require('mqtt')

exports.QuestionsEndedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuestionsEndedIntent';
    },
    async handle(handlerInput) {
        // console.log(JSON.stringify(globalData));
        let correctAnswer = "Answer";
        for (let i = 0; i < 3; i++) {
            if (globalData[0].Answer[i].Correctnes == true) {
                correctAnswer += (i+1);
            }
        }
        // console.log("_____Richtige Anwort" + correctAnswer);
        publishDataMQTT("Lights", correctAnswer);

        let speechText = '<break time="9s"/> Wie soll ich fortfahren?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

function publishDataMQTT(channelName, daten) {
    const client = mqtt.connect('mqtt://34.230.40.176');

    client.on('connect', function () {
        client.publish(channelName, daten);
        client.end();
    });
}
