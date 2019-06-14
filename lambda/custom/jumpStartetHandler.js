const mqtt = require('mqtt')
const Speech = require('ssml-builder');

exports.JumpStartetHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'JumpStartetIntent';
    },
    async handle(handlerInput) {

        // publishDataMQTT("Lights","StarteSpiel");

        // let speechText = '<break time=".8s"/> Sind alle an ihren Positionen und soll ausgewertet werden?';

        // <audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_countdown_loop_32s_full_01' />
        // <audio src='soundbank://soundlibrary/musical/amzn_sfx_buzzer_loud_alarm_01' />

        var speech = new Speech();
        speech.pause('1s')
            .audio('soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_countdown_loop_32s_full_01')
            .audio('soundbank://soundlibrary/musical/amzn_sfx_buzzer_loud_alarm_01')
            .say('Sind alle an ihren Positionen und soll ausgewertet werden?');
        var speechOutput = speech.ssml(true);
        // this.emit(':tell', speechOutput);

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();

        // publishDataMQTT("Monitor",'{Question:"Wie gehts?", Answer1: "gut", Answer2: "schlecht", Answer3: "normal"}');

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
