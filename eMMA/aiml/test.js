aimlHigh = require('aiml-high');
var interpreter = new aimlHigh({name:'eMMA', age:'22'});
interpreter.loadFiles(['german-1.aiml']);

var callback = function(answer, wildCardArray, input){
    console.log(answer + ' | ' + wildCardArray + ' | ' + input);
};

interpreter.findAnswer('Ich mag Linux', callback);
interpreter.findAnswer('Ich heisse Guillaume.', callback);
interpreter.findAnswer('Wie heisse ich?', callback);
interpreter.findAnswer('Gute Nacht, eMMA!', callback);
interpreter.findAnswer('Absolut', callback);
