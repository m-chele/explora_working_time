window.onload = function() {

    document.getElementById("calculateButton").onclick = function() {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            
                chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {                            
                    document.getElementById('result').textContent = response;                   
                });
        });    
    };

};
