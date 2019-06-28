const language = require('./language');
const mqtt = require('mqtt')

exports.StartGameHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StartGameIntent';
    },
    async handle(handlerInput) {

        publishDataMQTT("Lights", "DefaultLight");
        global.globalData = await mqttConnection();
        const dataFormated = formatJSONForMonitor();
        // publishDataMQTT("Monitor", JSON.stringify(globalData));
        publishDataMQTT("Monitor", dataFormated);

        let speechText = '';
        speechText += 'Die Frage lautet' + '<break time=".2s"/> ' + globalData[0].Question + '? ';
        speechText += '<break time=".4s"/>' + 'Ist es eins' + '<break time=".2s"/>' + globalData[0].Answer[0].Text + "?";
        speechText += '<break time=".4s"/>' + 'zwei' + '<break time=".2s"/>' + globalData[0].Answer[1].Text + "?";
        speechText += '<break time=".4s"/>' + 'oder ist es drei' + '<break time=".2s"/>' + globalData[0].Answer[2].Text + "?";
        speechText += '<break time="2s"/> ';
        speechText += 'Kann es los gehen?';

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

function formatJSONForMonitor() {
    let jsonOutput = '{';
    jsonOutput += '"question":"' + globalData[0].Question + '",';
    for (let i = 0; i < 3; i++) {
        if (i < 2) {
            jsonOutput += '"answer' + (i + 1) + '":"' + globalData[0].Answer[i].Text + '",';
        }
        if (i == 2) {
            jsonOutput += '"answer' + (i + 1) + '":"' + globalData[0].Answer[i].Text + '"';
        }
    }
    jsonOutput += '}';
    return jsonOutput;
}