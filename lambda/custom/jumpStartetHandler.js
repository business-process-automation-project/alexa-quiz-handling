const mqtt = require('mqtt')
const Speech = require('ssml-builder');

exports.JumpStartetHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'JumpStartetIntent';
    },
    async handle(handlerInput) {

        publishDataMQTT("Lights","StarteSpiel");

        let speech = new Speech();
        speech.pause('1s')
            .audio('soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_countdown_loop_32s_full_01')
            .say('1, 2 oder 3, letzte Chance...')
            .pause('2s')
            .say('vorbei!')
            .audio('soundbank://soundlibrary/musical/amzn_sfx_buzzer_loud_alarm_01')
            .say('Sind alle an ihren Positionen und soll ausgewertet werden?');
        let speechOutput = speech.ssml(true);

        return handlerInput.responseBuilder
            .speak(speechOutput)
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