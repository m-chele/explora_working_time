window.onload = function() {

    document.getElementById("calculateButton").onclick = function() {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                
                // send message to content script
                chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {                            
                    document.getElementById('hours').textContent = response.hours + " ore";                   
                    document.getElementById('minutes').textContent = response.minutes + " minuti";
                    document.getElementById('result').style.display = 'block';
                   
                });
        });    
    };

};
