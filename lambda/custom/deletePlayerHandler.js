const mqtt = require('mqtt')

exports.DeletePlayerHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeletePlayerIntent';
    },
    async handle(handlerInput) {
        publishDataMQTT("DeletePlayer", "Spieler loeschen");

        let speechText = 'Alle Spieler wurden gelöscht. Wie soll ich fortfahren?'

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
