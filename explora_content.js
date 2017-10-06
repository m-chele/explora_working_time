chrome.runtime.onMessage.addListener (
    function(request, sender, sendResponse) {
      var workedMilliseconds = 0;
      var morningCheckin = $(getClockingSpanIds(1));
      var morningCheckout = $(getClockingSpanIds(2));

      var afternoonCheckin = $(getClockingSpanIds(3));
      var afternoonCheckout = $(getClockingSpanIds(4));

// DEBUG
      morningCheckin.css("background-color","green");
      afternoonCheckin.css("background-color","yellow");
//
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
  var myDiv = $('div')
        .filter(function() {
            return this.id.match(/_Grid1_4_3_viewDiv/);
          });
  return '#' + myDiv.attr('id') + ' > table > tbody > tr > td > a:nth-child(' + position + ') > span';
}

function extractTime(textTime) {
  return textTime.text().replace('.', ':').trim();
}
