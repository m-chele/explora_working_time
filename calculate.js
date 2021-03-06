

function extractTime(textTime) {
  return textTime.substring(1);
}


function getMillisecondsFromText(textTime) {  

  return new Date("01/01/1970 " + extractTime(textTime)).getTime();
}


function differenceInMilliseconds(textCheckinTime, textCheckoutTime) {

  return getMillisecondsFromText(textCheckoutTime) - getMillisecondsFromText(textCheckinTime)
}

function workedTime(workedMilliseconds){

  return {
      minutes: (workedMilliseconds/(1000*60))%60,
      hours: Math.floor(workedMilliseconds/(1000*60*60))
    }
}