chrome.runtime.onMessage.addListener (
    function(request, sender, sendResponse) {
      var workedMilliseconds = 0;
      var morningCheckin = $(getClockingSpanIds(1));
      var morningCheckout = $(getClockingSpanIds(2));

      var afternoonCheckin = $(getClockingSpanIds(3));
      var afternoonCheckout = $(getClockingSpanIds(4));

      morningCheckin.css("background-color","green");
      afternoonCheckin.css("background-color","yellow");

      var morningCheckinMilliseconds = getMillisecondsFromText(extractTime(morningCheckin));
      var morningCheckoutMilliseconds =  getMillisecondsFromText(extractTime(morningCheckout));

      var afternoonCheckinMilliseconds =  getMillisecondsFromText(extractTime(afternoonCheckin));
      var afternoonCheckoutMilliseconds = getMillisecondsFromText(extractTime(afternoonCheckout));

      workedMilliseconds += (morningCheckoutMilliseconds - morningCheckinMilliseconds + afternoonCheckoutMilliseconds - afternoonCheckinMilliseconds);

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
