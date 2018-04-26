aimlHigh = require('aiml-high');
var interpreter = new aimlHigh({name:'eMMA', age:'22'});
interpreter.loadFiles(['german-1.aiml']);

var callback = function(answer, wildCardArray, input){
    console.log(input + ' | ' + answer);
	console.log(wildCardArray);
	console.log('------------------------');
};

function normaliseString(str) {
	temp = str.toUpperCase();
	return temp.replace(/[^a-zA-Z ]/g, "");
}

var question = 'Ich mag Linux!';
interpreter.findAnswer(normaliseString(question), callback);
interpreter.findAnswer('Mein Name ist Guillaume.', callback);
interpreter.findAnswer('Was ist mein Name?', callback);
interpreter.findAnswer('Wie heisst du?', callback);
