



// rimane in ascolto dei messaggi che arrivano dallo script in background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
      alert("primo URL trovato: " + firstHref);
      
      // rimanda allo script in backround un messaggio con un url da aprire in una nuova tab,
      // calculate.js non può aprire tab perché è di tipo "content"
      // chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);