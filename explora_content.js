
// rimane in ascolto dei messaggi che arrivano dallo script in background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
         
      $("#cartTable tr").each(function(){
        var validSpanCount = $(this).find("span.entrata").size() + $(this).find("span.uscita").size();
        if(validSpanCount > 0 && validSpanCount != 4)
        {
          $(this).css("background-color","red");
        }

        if(validSpanCount == 4)
        {
            alert("E= " + $(this).find("span.entrata").first().text() + " U= " + $(this).find("span.uscita").first().text());            
        }

      });
    }
});