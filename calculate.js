



// rimane in ascolto dei messaggi che arrivano dallo script in background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var entrate = "";
      $(".entrata").each(function() {
        entrate += " " + $(this).attr("title");
      });


      alert("entrate: " + entrate);
    }
  });