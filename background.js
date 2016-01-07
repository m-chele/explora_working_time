

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  	var activeTab = tabs[0];
  	chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "calculate-result":
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  	    var activeTab = tabs[0];
  	    chrome.tabs.sendMessage(activeTab.id, {"message": "calculate_hours"});
  });           
        break;
    }
    return true;
});

