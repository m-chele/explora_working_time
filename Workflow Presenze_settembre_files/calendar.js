//************************
//Configuration variables:
//************************

var imgDir='../'+(typeof(ZtVWeb)!='undefined' ? ZtVWeb.theme : (window['m_cThemePath'] ? m_cThemePath : 'SpTheme_2'))+'/formPage/';
var calendarWidth = SPTheme.calendarWidth||250;
var imgsrc=new Array((SPTheme.calendarDrop1||imgDir+"drop1.gif"),(SPTheme.calendarDrop2||imgDir+"drop2.gif"),(SPTheme.calendarLeft1||imgDir+"left1.gif"),(SPTheme.calendarLeft2||imgDir+"left2.gif"),(SPTheme.calendarRight1||imgDir+"right1.gif"),(SPTheme.calendarRight2||imgDir+"right2.gif"),(SPTheme.calendarClose||imgDir+"close.gif"),(SPTheme.calendarDivider||imgDir+"divider.gif"));
var calendarReady=false;

var fixedX=-1;             //-1 if to appear below control
var fixedY=-1;             //-1 if to appear below control
var startAt=1;             // 0 - sunday ; 1 - monday
var showWeekNumber=1;      // 0 - don't show; 1 - show
var showToday=1;           // 0 - don't show; 1 - show

var gotoString,todayString,weekString,scrollLeftMessage,scrollRightMessage;
var selectMonthMessage,selectYearMessage,closeTheCalendar;
var monthName,dayName;

var calendarObj,monthSelected,yearSelected,dateSelected;
var omonthSelected,oyearSelected,odateSelected,monthConstructed,yearConstructed;
var intervalID1,intervalID2,timeoutID1,timeoutID2,ctlToPlaceValue,ctlNow,dateFormat,nStartingYear;

var bPageLoaded=false;

var today=new Date();
var dateNow=today.getDate();
var monthNow=today.getMonth();
var yearNow=(today.getFullYear?today.getFullYear():(today.getYear()>1000?today.getYear():today.getYear()+1900));

var img = imgsrc.map(function(src) {
    var i = new Image;
    i.src = src;
    return i;
  });

var bShow=false;
var Holidays=new Array();

var styleAnchor="text-decoration:none;";

var calendarFixedPos=false;

function PrepareJsCalendar(documentOpened,fixed){
  calendarFixedPos = fixed || false;
  //Prepara il calendario per visualizzazrlo appena si chiama il metodo ShowPopUpCalendar
  if(typeof(monthName)=='undefined'){//Non e' ancora preparato
    InitCalendarVars();
    BuildCalendar(documentOpened);
  }
}

function InitCalendarVars(){
  monthName=[Translate("MSG_CALENDAR_JANUARY"),Translate("MSG_CALENDAR_FEBRUARY"),Translate("MSG_CALENDAR_MARCH"),
             Translate("MSG_CALENDAR_APRIL"),Translate("MSG_CALENDAR_MAY"),Translate("MSG_CALENDAR_JUNE"),
             Translate("MSG_CALENDAR_JULY"),Translate("MSG_CALENDAR_AUGUST"),Translate("MSG_CALENDAR_SEPTEMBER"),
             Translate("MSG_CALENDAR_OCTOBER"),Translate("MSG_CALENDAR_NOVEMBER"),Translate("MSG_CALENDAR_DECEMBER")];

  dayName = [Translate("MSG_CALENDAR_MON"),Translate("MSG_CALENDAR_TUE"),Translate("MSG_CALENDAR_WED"),
             Translate("MSG_CALENDAR_THU"),Translate("MSG_CALENDAR_FRI"),Translate("MSG_CALENDAR_SAT")]
  if (startAt==0)
    dayName.splice(0, 0, Translate("MSG_CALENDAR_SUN"));
  else
    dayName.push(Translate("MSG_CALENDAR_SUN"));

  gotoString=Translate("MSG_CALENDAR_GOTO_CURRENTMONTH");
  todayString=Translate("MSG_CALENDAR_TODAY_IS");
  weekString=Translate("MSG_CALENDAR_WEEK");
  scrollLeftMessage=Translate("MSG_CALENDAR_PREVIOUS_MONTH");
  scrollRightMessage=Translate("MSG_CALENDAR_NEXT_MONTH");
  selectMonthMessage=Translate("MSG_CALENDAR_SELECT_MONTH");
  selectYearMessage=Translate("MSG_CALENDAR_SELECT_YEAR");
  closeTheCalendar=Translate("MSG_CALENDAR_CLOSE");
  var lang=(typeof(m_cLanguage)!='undefined'?m_cLanguage:null);
  lang=((lang==null && typeof(ZtVWeb)!='undefined' && typeof(ZtVWeb.Language)!='undefined')?ZtVWeb.Language:lang);
  if (typeof(lang)=='undefined') lang='default';
  if(gotoString==="MSG_CALENDAR_GOTO_CURRENTMONTH"){ //traduzioni non disponibili nel file
    switch(lang){
      case 'ita':
      case 'default':
        monthName=new Array("Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre");
        if (startAt==0)
          dayName=new Array("Dom","Lun","Mar","Mer","Gio","Ven","Sab");
        else
          dayName=new Array("Lun","Mar","Mer","Gio","Ven","Sab","Dom");

        gotoString="Vai al mese corrente";
        todayString="Oggi \u00e8";
        weekString="Sett";
        scrollLeftMessage="Premere per scorrere al mese precedente. Tieni premuto per scorrere automaticamente.";
        scrollRightMessage="Premere per scorrere al mese prossimo. Tieni premuto per scorrere automaticamente.";
        selectMonthMessage="Premere per cambiare mese.";
        selectYearMessage="Premere per cambiare anno.";
        closeTheCalendar="Chiude il calendario.";
        break;
      case 'eng':
        monthName=new Array("January","February","March","April","May","June","July","August","September","October","November","December")
        if (startAt==0)
          dayName=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat")
        else
          dayName=new Array("Mon","Tue","Wed","Thu","Fri","Sat","Sun")

        gotoString="Go to current month"
        todayString="Today is"
        weekString="Wk"
        scrollLeftMessage="Click to scroll to previous month. Hold mouse button to scroll automatically."
        scrollRightMessage="Click to scroll to next month. Hold mouse button to scroll automatically."
        selectMonthMessage="Click to select a month."
        selectYearMessage="Click to select a year."
        closeTheCalendar="Close the calendar.";
      break
       case 'spa':
        monthName=new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre")
        if (startAt==0)
          dayName=new Array("Dom","Lun","Mar","Mi\u00e9","Jue","Vie","S\u00e1b")
        else
          dayName=new Array("Lun","Mar","Mi\u00e8","Jue","Vie","S\u00e1b","Dom")

        gotoString="Ir al mes actual"
        todayString="Hoy es"
        weekString="Sem"
        scrollLeftMessage="Haga clic para ir al mes anterior. Para desplazarse, mantenga pulsado el bot\u00f3n del rat\u00f3n."
        scrollRightMessage="Haga clic para ir al mes siguiente. Para desplazarse, mantenga pulsado el bot\u00f3n del rat\u00f3n."
        selectMonthMessage="Haga clic para seleccionar un mes."
        selectYearMessage="Haga clic para seleccionar un a\u00f1o."
        closeTheCalendar="Cerrar el calendario.";
      break
      case 'deu':
      monthName=new Array("Januar","Februar","M\u00e4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember")
        if (startAt==0)
          dayName=new Array("Son","Mon","Die","Mit","Don","Fre","Sam")
        else
          dayName=new Array("Mon","Die","Mit","Don","Fre","Sam","Son")

        gotoString="Zum aktuellen Monat wechseln"
        todayString="Heute"
        weekString="W"
        scrollLeftMessage="Dr\u00fccken Sie, um zum Vormonat zu scrollen. Halten Sie Maustaste, um automatisch zu scrollen."
        scrollRightMessage="Dr\u00fccken Sie, um zum n\u00e4chsten Monat zu scrollen. Halten Sie Maustaste, um automatisch zu scrollen."
        selectMonthMessage="Klicken Sie hier um einen Monat auszuw\u00e4hlen."
        selectYearMessage="Klicken Sie hier um ein Jahr auszuw\u00e4hlen."
        closeTheCalendar="Schlie\u00dfen Sie den Kalender.";
      break
      case 'fra':
        monthName=new Array("Janvier","F\u00e9vrier","Mars","Avril","Mai","Juin","Juillet","Ao\u00fbt","Septembre","Octobre","Novembre","D\u00e9cembre")
        if (startAt==0)
          dayName=new Array("Dim","Lun","Mar","Mer","Jeu","Ven","Sam")
        else
          dayName=new Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim")

        gotoString="Mois en cours"
        todayString="Nous sommes le"
        weekString="Sem."
        scrollLeftMessage="Mois pr\u00e9c\u00e9dent. Maintenez le bouton de la souris enfonc\u00e9 pour d\u00e9filer automatiquement."
        scrollRightMessage="Mois suivant. Maintenez le bouton de la souris enfonc\u00e9 pour d\u00e9filer automatiquement."
        selectMonthMessage="Cliquez ici pour s\u00e9lectionner un mois."
        selectYearMessage="Cliquez ici pour s\u00e9lectionner une ann\u00e9e."
        closeTheCalendar="Fermer le calendrier.";
      break	
    }
  }
}

function BuildCalendar(documentOpened){
  documentOpened = documentOpened || (window.document.readyState && window.document.readyState!='complete' && window.document.readyState!='interactive')
	var document = documentOpened ? window.document : [];
  if (!document.write){
		document.write=function(s){
			this.push(s);
		}
	}
  var z_index = ('zIndex' in (dragObj||{}) ? ++dragObj.zIndex:999)
  document.write("<div class='SPCalendar' id='Calendar' onmouseover='PrepareToDoNotHide()' onmouseout='PrepareToHide()' style='position:absolute;visibility:hidden;z-index:+"+z_index+";top:0px;left:0px;'>")
  document.write("<table cellspacing='0' width='"+((showWeekNumber==1)?calendarWidth:(calendarWidth-30))+"px'>")
  document.write("<tr class='SPCalendarHeader'>")
	document.write("<td valign='middle' class='SPCalendarHeaderAll'>")
  document.write("<table width='"+((showWeekNumber==1)?(calendarWidth-2):(calendarWidth-32))+"px'>")
	document.write("<tr>")
  document.write("<td class='SPCalendarHeader'>")
	document.write("<span id='calendar_caption'></span>")
	document.write("</td>")
  if( !calendarFixedPos ){
	document.write("<td class='SPCalendarDragger' onmousedown=\"dragCalendar(event,'Calendar',this)\" style='width:90px;cursor:move;'>")
	document.write("&nbsp;")
	document.write("</td>")
	document.write("<td align='right'><a href='javascript:hideCalendar()' title='"+closeTheCalendar+"'>")
	document.write("<img src='"+imgsrc[6]+"' border='0' alt='"+closeTheCalendar+"'>")
	document.write("</a>")
	document.write("</td>")
  }
	document.write("</tr>")
	document.write("</table>")
	document.write("</td>")
	document.write("</tr>")
	document.write("<tr>")
  document.write("<td class='SPCalendarContent'>")
	document.write("<span id='content'></span>")
	document.write("</td>")
	document.write("</tr>")
	if (showToday==1){
    document.write("<tr>")
    document.write("<td class='SPCalendarFooter' style='padding:0;padding-bottom:8px;' align=center>")
    document.write("<span id='lblToday'></span>")
		document.write("</td>")
		document.write("</tr>")
	}
	document.write("</table>")
	document.write("</div>")
	document.write("<div id='selectMonth' class='SPCalendarMonth' style='z-index:+"+(++z_index)+";position:absolute;visibility:hidden'></div>")
	document.write("<div id='selectYear' class='SPCalendarYear' style='z-index:+"+(++z_index)+";position:absolute;visibility:hidden'></div>")
	if(!documentOpened){
		var d=window.document.createElement('div');
		d.innerHTML=document.join('');
		window.document.body.appendChild(d);
	}
}

function InitCalendar(){
  // for (i=0;i<imgsrc.length;i++){
    // img[i]=new Image;
    // img[i].src=imgsrc[i];
  // }
  calendarObj=LibJavascript.DOM.Ctrl("Calendar").style;
  monthConstructed=false;
  yearConstructed=false;
  hideCalendar();

  if (showToday==1){
    LibJavascript.DOM.Ctrl("lblToday").innerHTML=todayString+" <a class='SPCalendarFooter' title='"+gotoString+"' style='"+styleAnchor+"' href='javascript:monthSelected=monthNow;yearSelected=yearNow;constructCalendar();'>"+dayName[(today.getDay()-startAt==-1)?6:(today.getDay()-startAt)]+", "+dateNow+" "+monthName[monthNow].substring(0,3)+" "+yearNow+"</a>"
  }
  var sHTML1="<span class='SPCalendarHeader' id='spanLeft' style='cursor:pointer' title='"+scrollLeftMessage+"'"
  if (imgsrc[3]!==imgsrc[2]) 
    sHTML1+=" onmouseover='swapImage(\"changeLeft\",\""+imgsrc[3]+"\");'"
  sHTML1+=" onclick='decMonth()' onmouseout='clearInterval(intervalID1);"+ (imgsrc[3]!==imgsrc[2] ? "swapImage(\"changeLeft\",\""+imgsrc[2]+"\");" : "") +"'"
  sHTML1+=" onmousedown='clearTimeout(timeoutID1);timeoutID1=setTimeout(\"StartDecMonth()\",500)'"
  sHTML1+=" onmouseup='clearTimeout(timeoutID1);clearInterval(intervalID1)'>&nbsp<img id='changeLeft' src='"+imgsrc[2]+"' border='0'>&nbsp</span>&nbsp;"

  sHTML1+="<span class='SPCalendarHeader' id='spanRight' style='cursor:pointer' title='"+scrollRightMessage+"'"
  if (imgsrc[5]!==imgsrc[4])
    sHTML1+=" onmouseover='swapImage(\"changeRight\",\""+imgsrc[5]+"\");'"
  sHTML1+=" onmouseout='clearInterval(intervalID1);"+ (imgsrc[5]!==imgsrc[4] ? "swapImage(\"changeRight\",\""+imgsrc[4]+"\");" : "") +"'"
  sHTML1+=" onclick='incMonth()' onmousedown='clearTimeout(timeoutID1);timeoutID1=setTimeout(\"StartIncMonth()\",500)'"
  sHTML1+=" onmouseup='clearTimeout(timeoutID1);clearInterval(intervalID1)'>&nbsp<img id='changeRight' src='"+imgsrc[4]+"' border='0'>&nbsp</span>&nbsp"

  sHTML1+="<span class='SPCalendarHeader' id='spanMonth' style='cursor:pointer' title='"+selectMonthMessage+"'"
  if (imgsrc[1]!==imgsrc[0]) {
    sHTML1+=" onmouseover='swapImage(\"changeMonth\",\""+imgsrc[1]+"\");'";
    sHTML1+=" onmouseout='swapImage(\"changeMonth\",\""+imgsrc[0]+"\");'";
  }
  sHTML1+=" onclick='popUpMonth()'></span>&nbsp;"

  sHTML1+="<span class='SPCalendarHeader' id='spanYear' style='cursor:pointer' title='"+selectYearMessage+"'"
  if (imgsrc[1]!==imgsrc[0]) {
    sHTML1+=" onmouseover='swapImage(\"changeYear\",\""+imgsrc[1]+"\");'";
    sHTML1+=" onmouseout='swapImage(\"changeYear\",\""+imgsrc[0]+"\");'";
  }
  sHTML1+=" onclick='popUpYear()'></span>"

  LibJavascript.DOM.Ctrl("calendar_caption").innerHTML=sHTML1;
  bPageLoaded=true;
}

/* hides <select> and <applet> objects (for IE only) */
function hideElement(elmID,overDiv){
  if(IsIE() && overDiv){
    for(var i=0;i<document.all.tags(elmID).length;i++){
      var obj=document.all.tags(elmID)[i]
      if(!obj || !obj.parentNode){
        continue;
      }

      // Find the element's offsetTop and offsetLeft relative to the BODY tag.
      var a = LibJavascript.DOM.getAbsolutePos(obj),
          objLeft = a.x,
          objTop = a.y,
          objHeight=obj.offsetHeight,
          objWidth=obj.offsetWidth;

      if((overDiv.offsetLeft+overDiv.offsetWidth)<=objLeft);
      else if((overDiv.offsetTop+overDiv.offsetHeight)<=objTop);
      else if(overDiv.offsetTop>=(objTop+objHeight));
      else if(overDiv.offsetLeft>=(objLeft+objWidth));
      else{
        obj.style.visibility="hidden"
      }
    }
  }
}

/*
* unhides <select> and <applet> objects (for IE only)
*/
function showElement(elmID){
  if(IsIE()){
    for(var i=0;i<document.all.tags(elmID).length;i++){
      var obj=document.all.tags(elmID)[i]

      if(!obj || !obj.parentNode){
        continue
      }
      obj.style.visibility=""
    }
  }
}

function HolidayRec(d,m,y,desc){
  this.d=d
  this.m=m
  this.y=y
  this.desc=desc
}

function addHoliday(d,m,y,desc){
  Holidays.push(new HolidayRec(d,m,y,desc))
}

function swapImage(srcImg,destImg){
LibJavascript.DOM.Ctrl(srcImg).src=destImg
}

function hideCalendar(){
  if(typeof(calendarObj)!='undefined'){
    calendarObj.visibility="hidden"
    calendarObj.top="-"+LibJavascript.DOM.Ctrl("Calendar").offsetHeight+"px"; //portlet + gestione bassa continua a ridimensionare in chrome
    LibJavascript.DOM.Ctrl("selectMonth").style.top="-"+LibJavascript.DOM.Ctrl("selectMonth").offsetHeight+"px"
    LibJavascript.DOM.Ctrl("selectYear").style.top="-"+LibJavascript.DOM.Ctrl("selectYear").offsetHeight+"px"
    if (LibJavascript.DOM.Ctrl("selectMonth").style!=null)
      LibJavascript.DOM.Ctrl("selectMonth").style.visibility="hidden"
    if (LibJavascript.DOM.Ctrl("selectYear").style!=null)
      LibJavascript.DOM.Ctrl("selectYear").style.visibility="hidden"
    showElement('SELECT')
    showElement('APPLET')
    documentRemoveClick(hideCalendar2)
  }
}

function padZero(num){
  return (num<10) ? '0'+num : num
}

function constructDate(d,m,y){
  var sTmp=dateFormat
  sTmp=sTmp.replace("DD","<e>")
  sTmp=sTmp.replace("D","<d>")
  sTmp=sTmp.replace("<e>",padZero(d))
  sTmp=sTmp.replace("<d>",d)
  sTmp=sTmp.replace("mmm","<o>")
  sTmp=sTmp.replace("MM","<n>")
  sTmp=sTmp.replace("m","<m>")
  sTmp=sTmp.replace("<m>",m+1)
  sTmp=sTmp.replace("<n>",padZero(m+1))
  sTmp=sTmp.replace("<o>",monthName[m])
  return sTmp.replace("YYYY",y)
}

function closeCalendar(notClose){
  if(!notClose)
  hideCalendar();
  if(typeof(ZtVWeb)!='undefined' && ctlToPlaceValue instanceof ZtVWeb.StdControl)// e' un Ctrl di PS
		ctlToPlaceValue.Set(new Date(yearSelected,monthSelected,dateSelected));
  else{
	  ctlToPlaceValue.value=constructDate(dateSelected,monthSelected,yearSelected);
		try{
      if(typeof(window[ctlToPlaceValue.id+"_Valid"])=="function"){
				//i campi aggiunti hanno un id uguale al nome e di lunghezza variabile
        window[ctlToPlaceValue.id+"_Valid"]();
      } else if(typeof(window[Left(ctlToPlaceValue.id,10)+"_Valid"])=="function"){
				//Nello zoom, la procedura _Valid non e' presente
        window[Left(ctlToPlaceValue.id,10)+"_Valid"]()
			}
			SetControlFocus(ctlToPlaceValue.id);
		} catch(e){}
	}
}

/*** Month Pulldown ***/
function StartDecMonth(){
  intervalID1=setInterval("decMonth()",80)
}

function StartIncMonth(){
  intervalID1=setInterval("incMonth()",80)
}

function incMonth(){
  monthSelected++
  if (monthSelected>11){
    monthSelected=0
    yearSelected++
  }
  constructCalendar()
}

function decMonth(){
  monthSelected--
  if (monthSelected<0){
    monthSelected=11
    yearSelected--
  }
  constructCalendar()
}

function constructMonth(){
  popDownYear()
  if (!monthConstructed){
    var sHTML="";
    for (var i=0;i<12;i++){
      var sName=monthName[i]
      if (i==monthSelected){
        sName="<B>"+sName+"</B>"
      }
      sHTML+="<tr><td id='m"+i+"' onmouseover=this.className='mover' onmouseout=this.className='mout' style='cursor:pointer' onclick='MonthChanged("+i+",event)'>&nbsp;"+sName+"&nbsp;</td></tr>"
    }
    LibJavascript.DOM.Ctrl("selectMonth").innerHTML="<table class='SPCalendarHeader SPCalendarComboYearsMonths' width='70px' cellspacing='0' onmouseover='clearTimeout(timeoutID1)' onmouseout='clearTimeout(timeoutID1);timeoutID1=setTimeout(\"popDownMonth()\",100);stopEvent(event);'>"+sHTML+"</table>"
    monthConstructed=true
  }
}

function stopEvent(evt){
	evt || window.event;
	if (evt.stopPropagation){
	evt.stopPropagation();
	evt.preventDefault();
	}else if(typeof evt.cancelBubble != "undefined"){
	evt.cancelBubble = true;
	evt.returnValue = false;
	}
	return false;
}

function MonthChanged(i,evt){
  monthConstructed=false;
  monthSelected=i;
  constructCalendar();
  popDownMonth();
  stopEvent(evt);
}

function popUpMonth(){
  var month=LibJavascript.DOM.Ctrl("selectMonth").style
  constructMonth()
  month.visibility="visible";
  month.zIndex=dragObj.zIndex+1
  month.left=(parseInt(calendarObj.left)+50)+'px'
  month.top=(parseInt(calendarObj.top)+26)+'px'
  hideElement('SELECT',LibJavascript.DOM.Ctrl("selectMonth"))
  hideElement('APPLET',LibJavascript.DOM.Ctrl("selectMonth"))
}

function popDownMonth(){
  LibJavascript.DOM.Ctrl("selectMonth").style.visibility= "hidden"
}

/*** Year Pulldown ***/
function incYear(){
  for (var i=0;i<7;i++){
    var newYear=(i+nStartingYear)+1, txtYear;
    if (newYear==yearSelected){
      txtYear="&nbsp;<B>"+newYear+"</B>&nbsp;"
    }
    else{
      txtYear="&nbsp;"+newYear+"&nbsp;"
    }
    LibJavascript.DOM.Ctrl("y"+i).innerHTML=txtYear
  }
  nStartingYear++
  bShow=true
}

function decYear(){
  for (var i=0;i<7;i++){
    var newYear=(i+nStartingYear)-1, txtYear;
    if (newYear==yearSelected){
      txtYear="&nbsp;<B>"+newYear+"</B>&nbsp;"
    }
    else{
      txtYear="&nbsp;"+newYear+"&nbsp;"
    }
    LibJavascript.DOM.Ctrl("y"+i).innerHTML=txtYear
  }
  nStartingYear--
  bShow=true
}

function selectYear(nYear){
  yearSelected=parseInt(nYear+nStartingYear)
  yearConstructed=false
  constructCalendar()
  popDownYear()
}

function constructYear(){
  popDownMonth()
  var sHTML=""
  if (!yearConstructed){
    sHTML="<tr><td align='center' onmouseover=this.className='mover' onmouseout='clearInterval(intervalID1);this.className=\"mout\"'"
    sHTML+=" style='cursor:pointer' onmousedown='clearInterval(intervalID1);intervalID1=setInterval(\"decYear()\",30)' onmouseup='clearInterval(intervalID1)'>-</td></tr>"
    var j=0;
    nStartingYear=yearSelected-3
    for (var i=(yearSelected-3);i<=(yearSelected+3);i++){
      var sName=i
      if (i==yearSelected){
        sName="<B>"+sName+"</B>"
      }
      sHTML+="<tr><td id='y"+j+"' onmouseover=this.className='mover' onmouseout=this.className='mout' style='cursor:pointer' onclick='selectYear("+j+");stopEvent(event);'>&nbsp;"+sName+"&nbsp;</td></tr>"
      j++
    }
    sHTML+="<tr><td align='center' onmouseover=this.className='mover' onmouseout='clearInterval(intervalID2);this.className=\"mout\"' style='cursor:pointer' onmousedown='clearInterval(intervalID2);intervalID2=setInterval(\"incYear()\",30)' onmouseup='clearInterval(intervalID2)'>+</td></tr>"
    LibJavascript.DOM.Ctrl("selectYear").innerHTML="<table class='SPCalendarHeader SPCalendarComboYearsMonths' width='44px' cellspacing='0' onmouseover='clearTimeout(timeoutID2)' onmouseout='clearTimeout(timeoutID2);timeoutID2=setTimeout(\"popDownYear()\",100)'>"+sHTML+"</table>"
    yearConstructed=true
  }
}

function popDownYear(){
  clearInterval(intervalID1)
  clearTimeout(timeoutID1)
  clearInterval(intervalID2)
  clearTimeout(timeoutID2)
  LibJavascript.DOM.Ctrl("selectYear").style.visibility= "hidden"
}

function popUpYear(){
  var leftOffset, year=LibJavascript.DOM.Ctrl("selectYear").style

  constructYear()
  year.visibility="visible";
  leftOffset=parseInt(calendarObj.left)+LibJavascript.DOM.Ctrl("spanYear").offsetLeft
  if (IsIE()){
    leftOffset+=6
  }
  year.zIndex=dragObj.zIndex+1
  year.left=leftOffset+'px'
  year.top=(parseInt(calendarObj.top)+26)+'px'
}

/*** calendar ***/
function WeekNbr(n){
var year=n.getFullYear(),month=n.getMonth()+1,day=n.getDate()+(startAt==0?1:0)
var a=Math.floor((14-month)/12),y=year+4800-a,m=month+12*a-3,b=Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400),J=day+Math.floor((153*m+2)/5)+365*y+b-32045,d4=(((J+31741-(J%7))%146097)%36524)%1461,L=Math.floor(d4/1460)
var d1=((d4-L)%365)+L,week=Math.floor(d1/7)+1
return week
}

function constructCalendar(){
  var aNumDays = Array(31,0,31,30,31,30,31,31,30,31,30,31);
  var startDate=new Date(yearSelected,monthSelected,1);
  var endDate, numDaysInMonth;

  var sClass = '';

  if(monthSelected==1){
    endDate=new Date(yearSelected,monthSelected+1,1);
    endDate=new Date(endDate-(24*60*60*1000));
    numDaysInMonth=endDate.getDate();
  }
  else{
    numDaysInMonth=aNumDays[monthSelected];
  }
  var datePointer=0;
  var dayPointer=startDate.getDay()-startAt;

  if(dayPointer<0){
    dayPointer=6;
  }
  var sHTML="<table class='SPCalendarBody' border='0'><tr>";

  if(showWeekNumber==1){
    sHTML+="<td align='right' width='"+parseInt(calendarWidth/8)+"'><span class='SPCalendarWeeks'><b>"+weekString+"</b></span></td>";
    sHTML+="<td width='1' rowspan='7' bgcolor='#d0d0d0' style='padding:0px'><img src='"+imgsrc[7]+"' width='1px'></td>";
  }

  for (var i=0;i<7;i++){
    if ((i==5&&startAt==1) || (i==6&&startAt==0))
      sHTML+="<td width='"+parseInt(calendarWidth/8)+"px' align='right' class='SPCalendarSaturday'><B>"+dayName[i]+"</B></td>";
    else if ((i==6&&startAt==1) || (i==0&&startAt==0))
      sHTML+="<td width='"+parseInt(calendarWidth/8)+"px' align='right' class='SPCalendarSunday'><B>"+dayName[i]+"</B></td>";
    else
      sHTML+="<td width='"+parseInt(calendarWidth/8)+"px' align='right'><B>"+dayName[i]+"</B></td>";
  }
  sHTML+="</tr><tr>";

  if (showWeekNumber==1){
    sHTML+="<td align='right'><span class='SPCalendarWeeks'>"+WeekNbr(startDate)+"&nbsp;</span></td>";
  }
  for (var i=1;i<=dayPointer;i++){
    sHTML+="<td>&nbsp;</td>";
  }
  for (datePointer=1;datePointer<=numDaysInMonth;datePointer++){
    dayPointer++;
    sHTML+="<td align=right>";
    var sStyle=styleAnchor;
    sClass = '';
    if ((datePointer==odateSelected) && (monthSelected==omonthSelected) && (yearSelected==oyearSelected)){
      sClass ='SPCalendarCurrentDay';
    }
    var sHint="";
    for (var k=0;k<Holidays.length;k++){
      if ((parseInt(Holidays[k].d,10)==datePointer)&&(parseInt(Holidays[k].m,10)==(monthSelected+1))){
        if ((parseInt(Holidays[k].y,10)==0)||((parseInt(Holidays[k].y,10)==yearSelected)&&(parseInt(Holidays[k].y,10)!=0))){
          sStyle+="background-color:#FFDDDD;";
          sHint+=sHint==""?Holidays[k].desc:"\n"+Holidays[k].desc;
        }
      }
    }
    var regexp= /\"/g;
    var href = "javascript:dateSelected="+datePointer+";closeCalendar("+(calendarFixedPos ? "true" : "" )+");" 
    sHint=sHint.replace(regexp,"&quot;");

    if ((datePointer==dateNow)&&(monthSelected==monthNow)&&(yearSelected==yearNow)){
      sHTML+="<b><a class='"+sClass+" SPCalendarToday' "+" title=\""+sHint+"\" style='"+sStyle+"' href='"+href+"'><span class='SPCalendarToday'>&nbsp;"+datePointer+"</span>&nbsp;</a></b>";
    }
     else if (dayPointer%7==6+(startAt*-1)+1){
      sHTML+="<a  class='"+sClass+"' "+" title=\""+sHint+"\" style='"+sStyle+"' href='"+href+"'><span class='SPCalendarSaturday'>&nbsp;"+datePointer+"&nbsp;</span></a>";
    }
    else if (dayPointer%7==(startAt*-1)+1){
      sHTML+="<a  class='"+sClass+"' "+" title=\""+sHint+"\" style='"+sStyle+"' href='"+href+"'><span class='SPCalendarSunday'>&nbsp;"+datePointer+"&nbsp;</span></a>";
    }
    else{
      sHTML+="<a class='SPCalendarBody "+sClass+"' "+" title=\""+sHint+"\" style='"+sStyle+"' href='"+href+"'>&nbsp;"+datePointer+"&nbsp;</a>";
    }

    sHTML+="";
    if ((dayPointer+startAt)%7==startAt){
      sHTML+="</tr><tr>";
      if ((showWeekNumber==1)&&(datePointer<numDaysInMonth)){
        sHTML+="<td align='right'><span class='SPCalendarWeeks'>"+(WeekNbr(new Date(yearSelected,monthSelected,datePointer+1)))+"&nbsp;</span></td>";
      }
    }
  }
  LibJavascript.DOM.Ctrl("content").innerHTML=sHTML;
  LibJavascript.DOM.Ctrl("spanMonth").innerHTML="&nbsp;"+monthName[monthSelected]+"&nbsp;<img id='changeMonth' src='"+imgsrc[0]+"' border='0'>";
  LibJavascript.DOM.Ctrl("spanYear").innerHTML="&nbsp;"+yearSelected+"&nbsp;<img id='changeYear' src='"+imgsrc[0]+"' border='0'>";
}

function ShowPopUpCalendar(ctrl,getPicture,sayPicture){
  var origCtrl=ctrl;
  if (!calendarReady){
    InitCalendar();
    calendarReady=true;
  }
  if (bPageLoaded){
    if (calendarObj.visibility=="hidden"){
      ctlToPlaceValue=ctrl;
      dateFormat=sayPicture;
      var currentDate;
      if(typeof(ZtVWeb)!='undefined' && ctlToPlaceValue instanceof ZtVWeb.StdControl){// e' un Ctrl di PS
        currentDate=ZtVWeb.applyPicture(ctrl.Value(),ctrl.type,0,ctrl.picture);
        ctrl=ctlToPlaceValue.Ctrl_input
      } else {
        currentDate=ctrl.value;
      }
      if (currentDate==""){
        dateSelected=dateNow;
        monthSelected=monthNow;
        yearSelected=yearNow;
      }else{
        dateSelected=Val(Substr(currentDate,At('DD',getPicture),2));
        monthSelected=Val(Substr(currentDate,At('MM',getPicture),2))-1;
        yearSelected=Val(Substr(currentDate,At('YYYY',getPicture),4));
        //Se la data inserita e' sbagliata, seleziono quella attuale
        if (!LibJavascript.Date.CheckDate(dateSelected,monthSelected+1,yearSelected)){ // monthSelected+1 perchè nella checkdate fa già -1 quindi Gennaio verrebbe -1!
          dateSelected=dateNow;
          monthSelected=monthNow;
          yearSelected=yearNow;
        }
      }
      odateSelected=dateSelected;
      omonthSelected=monthSelected;
      oyearSelected=yearSelected;

      var a=LibJavascript.DOM.getPosFromFirstRel(ctrl,document.body);
      calendarObj.left=(fixedX==-1 ? a.x : fixedX)+'px';
      calendarObj.top=(fixedY==-1 ? a.y+ctrl.offsetHeight : fixedY)+'px';
      constructCalendar(1,monthSelected,yearSelected);
      if(document.body.offsetLeft+document.body.offsetWidth < parseInt(calendarObj.left)+LibJavascript.DOM.Ctrl("Calendar").offsetWidth)
        if (parseInt(calendarObj.left=(parseInt(calendarObj.left)-LibJavascript.DOM.Ctrl("Calendar").offsetWidth+ctrl.offsetWidth)+'px')<0)
          calendarObj.left='0px';
      if(document.body.offsetTop+document.body.offsetHeight < parseInt(calendarObj.top)+LibJavascript.DOM.Ctrl("Calendar").offsetHeight)
        if (parseInt(calendarObj.top=(parseInt(calendarObj.top)-LibJavascript.DOM.Ctrl("Calendar").offsetHeight-ctrl.offsetHeight)+'px')<0)
          calendarObj.top='0px';
      calendarObj.visibility="visible";
      if ('dragObj' in window)
       calendarObj.zIndex=++dragObj.zIndex

      hideElement('SELECT',LibJavascript.DOM.Ctrl("Calendar"));
      hideElement('APPLET',LibJavascript.DOM.Ctrl("Calendar"));

      bShow=true;
    }
    else{
      hideCalendar();
      if (ctlNow!=origCtrl)
        ShowPopUpCalendar(origCtrl,getPicture,sayPicture);
    }
    ctlNow=origCtrl;
  }
  documentAddClick(hideCalendar2);
}
function hideCalendar2(){/*
  if (!bShow)
    hideCalendar();
    */
}
function PrepareToDoNotHide(){
  bShow=true;
}
function PrepareToHide(){
  bShow=false;
}
function dragCalendar(event,obj,dragger){
  LibJavascript.DOM.Ctrl("selectYear").style.visibility=LibJavascript.DOM.Ctrl("selectMonth").style.visibility="hidden";
  dragToolbar(event,obj,dragger.offsetLeft);
}
