const language = require('./language');
const mqtt = require('mqtt')

exports.StartGameHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StartGameIntent';
    },
    async handle(handlerInput) {
        // const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
        // const NumberOfQuestions = filledSlots.NumberofQuestions.value;

        // if (typeof NumberOfQuestions === 'undefined' || NumberOfQuestions === '?' || NumberOfQuestions < 1) {
        //     NumberOfQuestions = 3;
        // }

        // publishDataMQTT("Lights", "DefaultLight");
        let data = await mqttConnection();

        let speechText = '';
        speechText += 'Die Frage lautet' + '<break time=".2s"/> ' + data[0].Question + '? ';
        speechText += '<break time=".4s"/>' + 'Ist es eins' + '<break time=".2s"/>' + data[0].Answer[0].Text + "?";
        speechText += '<break time=".4s"/>' + 'zwei' + '<break time=".2s"/>' + data[0].Answer[1].Text + "?";
        speechText += '<break time=".4s"/>' + 'oder ist es drei' + '<break time=".2s"/>' + data[0].Answer[2].Text + "?";
        speechText += '<break time="2s"/> ';
        speechText += 'Kann es los gehen?';

        // for (let i = 0; i < NumberOfQuestions; i++) {
        //     speechText += 'Frage ' + (i + 1) + '<break time=".2s"/> ' + data[i].Question + '? ';
        //     speechText += '<break time=".4s"/>' + 'Ist es eins' + '<break time=".2s"/>' + data[i].Answer[0].Text;
        //     speechText += '<break time=".4s"/>' + 'zwei' + '<break time=".2s"/>' + data[i].Answer[1].Text;
        //     speechText += '<break time=".4s"/>' + 'oder ist es drei' + '<break time=".2s"/>' + data[i].Answer[2].Text;
        //     speechText += '<break time=".8s"/> ';
        // }

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();

        // publishDataMQTT("Monitor",'{Question:"Wie gehts?", Answer1: "gut", Answer2: "schlecht", Answer3: "normal"}');

    }
};

function publishDataMQTT(channelName, status) {
    const client = mqtt.connect('mqtt://34.230.40.176');

    client.on('connect', function () {
        console.log("connected with mqtt: " + channelName );
        client.subscribe(channelName, function (err) {
            if (!err) {
                client.publish(channelName, status);
            }
        })
        client.end();
    })
}

function mqttConnection() {
    const client = mqtt.connect('mqtt://34.230.40.176');
    
    return new Promise(((resolve, reject) => { 
        client.on('connect', function () {
            console.log("connected with mqtt");
            client.subscribe("RequestQuestions", function (err) {
                if (!err) {
                    client.publish("RequestQuestions", "1");
                } else {
                    reject(err);
                }
            })
            client.unsubscribe("RequestQuestions");
            client.subscribe("ResponseQuestions");
        })

        client.on('message', function (topic, message) {
            resolve(JSON.parse(message));
            client.end();
        })
    }));
}