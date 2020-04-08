/*
            ___                            _   
    /\   /\/ __\___  _ __  _ __   ___  ___| |_ 
    \ \ / / /  / _ \| '_ \| '_ \ / _ \/ __| __|
     \ V / /__| (_) | | | | | | |  __/ (__| |_ 
      \_/\____/\___/|_| |_|_| |_|\___|\___|\__|
                                                
        Sentence checker for Projet-Volatire
*/

/*
    Class to send and recieve data from language tool
*/
class LanguageToolAPI {
    /*
        constructor of the LT API

        apiLink: link of the LT API (String)
    */
    constructor (apiLink) {
        this.LANGUAGE_TOOL_API = apiLink;
    }

    /*
    Language tool json spelling mistake parser
    Get the word index the spelling mistake
    */
    static parseError(jsonInput, sentence) {
        //Check if we of any json at all
        console.log(jsonInput);
        
        //Parse raw text into JSON
        var parsedContent = JSON.parse(jsonInput);
        
        //Says how many error is in the sentence
        console.log("VC: " + parsedContent.matches.length + " error(s) detected");
        
        //Check if there is not matches using LT
        if (parsedContent.matches.length == 0)
        return;
        
        //There is something, color it in red...
        for (let match = 0; match < parsedContent.matches.length; match++) {
            console.log("Match:" + parsedContent.matches[match], "- word: " + sentence[StringUtils.getWordIndex(sentence, parsedContent.matches[match].offset)]);
            VoltaireParser.setWordColor(StringUtils.getWordIndex(sentence, parsedContent.matches[match].offset), "red");
        }
    }
    /*
    Do a request to Langage tool website and propose correction
    */
    async fixSentence(sentence) {
        //Create request
        var xhr = new XMLHttpRequest();
        
        xhr.open("POST", LANGUAGE_TOOL_API, true);
        
        //From language tool API
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "application/json");
        
        //Try to get the JSON from the API
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.warn("VC: Recieved response from LT");
                    LanguageToolAPI.parseError(xhr.responseText, sentence);
                    
                } else {
                    console.error("VC: Couldn't get response from LanguageTools, the API may be down or you may have been banned");
                    console.error("VC - Debug: " + xhr.statusText + " - " + e.type);
                    console.error("VC - Debug: Got " + xhr.status + " from API")
                }
            }
            else
            {
                console.error("VC: Got " + xhr.readyState + " in readyState");
            }
        };
        
        //Error handler
        xhr.onerror = function (e) {
            console.error("VC: " + xhr.statusText);
        };
        
        //Send request
        xhr.send("text=" + encodeURI(StringUtils.sentenceStringify(sentence)) + "&language=fr&enabledOnly=false");
    }
}