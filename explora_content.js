chrome.runtime.onMessage.addListener (
    function(request, sender, sendResponse) {
      // $("span.Title").css("background-color","blue");
      var workedMilliseconds = 0;
      $('div')
        .filter(function() {
          return this.id.match(/_Grid1_25_3_viewDiv/);
        }).css("background-color","green");
      // $("div:regex(id, *_Grid1_25_3_viewDiv)").css("background-color","red");
      // $("span select[title='Entrata']").css("background-color","red");
      // $("#pzvuf_Grid1_25_3_viewDiv").each(function(){
        // alert($("select[title='Entrata']"));

    //     var checkinSpan = $(this).find("span.entrata");
    //     var checkoutSpan = $(this).find("span.uscita");
    //     var validSpanCount = checkinSpan.size() + checkoutSpan.size();
    //
    //     if(validSpanCount > 0 && validSpanCount != 4)
    //     {
    //       $(this).css("background-color","red");
    //     }
    //
    //     // Exclude:
    //     //    days with missing checks
    //     //    day with more then 2 checkin and 2 checkout
    //     if(validSpanCount == 4)
    //     {
    //       var morningCheckin = getMillisecondsFromText($(checkinSpan.get(0)).text());
    //       var morningCheckout =  getMillisecondsFromText($(checkoutSpan.get(0)).text());
    //
    //       var afternoonCheckin =  getMillisecondsFromText($(checkinSpan.get(1)).text());
    //       var afternoonCheckout = getMillisecondsFromText($(checkoutSpan.get(1)).text());
    //
    //       workedMilliseconds += (morningCheckout - morningCheckin + afternoonCheckout - afternoonCheckin);
    //
    //     }
    //
      // });
    //     sendResponse(workedTime(workedMilliseconds));
    //     return true;
    }
);

// //TODO: spostare
function extractTime(textTime) {
  return textTime.replace('.', ':');
}
