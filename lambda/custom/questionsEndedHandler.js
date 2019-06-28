const mqtt = require('mqtt')

exports.QuestionsEndedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuestionsEndedIntent';
    },
    async handle(handlerInput) {
        // console.log(JSON.stringify(globalData));
        let correctAnswerString = "Answer";
        let correctAnswer = "";
        for (let i = 0; i < 3; i++) {
            if (globalData[0].Answer[i].Correctnes == true) {
                correctAnswerString += (i+1);
                correctAnswer += globalData[0].Answer[i].Text;
            }
        }
        // console.log("_____Richtige Anwort" + correctAnswerString);
        publishDataMQTT("Lights", correctAnswerString);

        let speechText = 'Die richtige Anwort lautet <break time="1s"/> ' + correctAnswer + '. <break time="9s"/> Wie soll ich fortfahren?';

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
