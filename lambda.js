
buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
}

buildSpeechletResponseHelp = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: false
    }
}
        
generateResponse = (speechletResponse) => {
    return {
        version: "1.0",
        response: speechletResponse
    }
}


exports.handler = (event, context, callback) => {
    switch (event.request.type) {
        case "LaunchRequest":
            context.succeed(generateResponse(buildSpeechletResponse("Welcome to Dungeon Dice Roller.", false)))
            break;
        case "IntentRequest":
            switch (event.request.intent.name) {
            case "DiceRoller":
                var request = event.request;
                var diceNumber = request.intent.slots.DiceNumber.value;
                var sideNumber = request.intent.slots.SideNumber.value;
                var modifier = request.intent.slots.Modifier.value;
                
                var resultArray = new Array(diceNumber);
                
                var total = 0;
                for(var i = 0; i < diceNumber; i++){
                    resultArray[i] = getRandomInt(1, sideNumber);
                    total += resultArray[i];
                }
                
                if(modifier != undefined){
                    total = Number(total) + Number(modifier);
                }
                
                var response = "Total: " + total + ",";
                
                for(var j = 0; j < diceNumber; j++){
                    response += " Dice " + j + ": " + resultArray[j] + ",";
                }
                if(modifier != undefined){
                    response += " Modifier: " + modifier;
                }
                context.succeed(generateResponse(buildSpeechletResponse(response, false)))
                break;
                
            case "AMAZON.HelpIntent":
                context.succeed(generateResponse(buildSpeechletResponse("To use the dice roller, launch the skill and say your roll.  For example: 'Roll two dee six plus two'.", false)))
                break;
                
            case "AMAZON.CancelIntent":
                context.succeed(generateResponse(buildSpeechletResponse("Goodbye.", true)))
                break;
                
            case "AMAZON.StopIntent":
                context.succeed(generateResponse(buildSpeechletResponse("Goodbye.", true)))
                break;
                
            case "AMAZON.NavigateHomeIntent":
                context.succeed(generateResponse(buildSpeechletResponse("Goodbye.", true)))
                break;
            }
            break;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

