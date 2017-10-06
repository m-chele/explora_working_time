chrome.runtime.onMessage.addListener (
    function(request, sender, sendResponse) {
      var workedMilliseconds = 0;
      var checkinSpan = $(getClockingSpanIds(1));
      var checkoutSpan = $(getClockingSpanIds(2));

      $(checkinSpan).css("background-color","green");
      $(checkoutSpan).css("background-color","red");

      var morningCheckin = getMillisecondsFromText(extractTime($(checkinSpan)));
      var morningCheckout =  getMillisecondsFromText(extractTime($(checkoutSpan)));

      var afternoonCheckin =  3000;
      var afternoonCheckout = 3000;

      workedMilliseconds += (morningCheckout - morningCheckin + afternoonCheckout - afternoonCheckin);

      sendResponse(workedTime(workedMilliseconds));
      return true;
    }
);

function getClockingSpanIds(position) {
  return '#pzvuf_Grid1_26_3_viewDiv > table > tbody > tr > td > a:nth-child(' + position + ') > span';
}


// //TODO: spostare
function extractTime(textTime) {
  // alert("text: --" + textTime.text().replace('.', ':').trim() + "--");
  return textTime.text().replace('.', ':').trim();
}
