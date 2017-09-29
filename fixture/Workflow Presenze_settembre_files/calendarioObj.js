function ZTCalendar(){
  var dCurDate=new Date();
  this.objPrevElement=new Object();
  this.Day=0;
  this.Month=dCurDate.getMonth()+1;
  this.Year=dCurDate.getFullYear();
  this.varName='';
  // setta la data
  this.Value=function(v){
    if(typeof(v)!='undefined'){
      dCurDate=v;
      this.Day=dCurDate.getDate();
      this.Month=dCurDate.getMonth()+1;
      this.Year=dCurDate.getFullYear();
      this.fUpdateCal(this.Day,this.Month,this.Year);
    }
    v=dCurDate;
    v.setFullYear(this.Year);
    v.setMonth(this.Month-1);
    v.setDate(this.Day);
    return v;
  }

  // cabia il colore di un elemento del calendario
  this.fToggleColor=function(myElement) {
    var toggleColor="#ff0000";
    if(myElement.color==toggleColor) {
      myElement.color="";
    } else {
      myElement.color=toggleColor;
    }
  }

  // seleziona un giorno specifico
  this.fSetSelectedDay=function(Day){
    if(typeof(Day)!='object'){
      this.Day=Day;
    } else {
      if(Day.innerHTML){
        if(Day.tagName=="TD"){
          this.Day=Day.firstChild.innerHTML;
        } else if(Day.tagName=="FONT"){
          this.Day=Day.innerHTML;
        }
      }
    }
  }
  // ritorna un array che contiene un mese
  this.fBuildCal=function(iYear,iMonth,iDayStyle) {
    this.Year=iYear;
    this.Month=iMonth;
    var aMonth=new Array();
    aMonth[0]=new Array(7);
    aMonth[1]=new Array(7);
    aMonth[2]=new Array(7);
    aMonth[3]=new Array(7);
    aMonth[4]=new Array(7);
    aMonth[5]=new Array(7);
    aMonth[6]=new Array(7);
    var dCalDate=new Date(iYear, iMonth-1, 1);
    var iDayOfFirst=dCalDate.getDay();

    var aNumDays=Array(31,0,31,30,31,30,31,31,30,31,30,31);
    var iDaysInMonth;
    if(iMonth==2){
      endDate=new Date(iYear,iMonth,1);
      endDate=new Date(endDate-(24*60*60*1000));
      iDaysInMonth=endDate.getDate();
    }
    else {
      iDaysInMonth=aNumDays[iMonth-1];
    }
    //var iDaysInMonth = new Date(iYear,iMonth-1, 0).getDate();

    var iVarDate=1;
    var i,d,w;

    // nella prima riga i nomi dei giorni
    aMonth[0][0]="D";
    aMonth[0][1]="L";
    aMonth[0][2]="M";
    aMonth[0][3]="M";
    aMonth[0][4]="G";
    aMonth[0][5]="V";
    aMonth[0][6]="S";

    // riempie anche i giorni nel posto opportuno
    for(d=iDayOfFirst;d<7;d++){
      aMonth[1][d]=iVarDate;
      iVarDate++;
    }
    for(w=2;w<7;w++){
      for(d=0;d<7;d++){
        if(iVarDate<=iDaysInMonth){
          aMonth[w][d]=iVarDate;
          iVarDate++;
        }
      }
    }
    return aMonth;
  }

  // disegna un calendario
  this.fDrawCal=function(id,font,font_size){
    this.varName=id+'_calendar';
    iYear=this.Year;
    iMonth=this.Month;
    iCellWidth=10;
    iCellHeight=10;
    iDayStyle=0;
    var myMonth=this.fBuildCal(iYear,iMonth,iDayStyle);
    var css_style="";
    if(font!="") css_style+="font-family:"+font+";";
    if(font_size!="") css_style+="font-size:"+font_size+"pt;";
    var str="";
    str+="<table width='100%' height='100%' border='0'>";
    str+="<tr bgcolor='#cccccc'>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][0]+"</td>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][1]+"</td>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][2]+"</td>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][3]+"</td>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][4]+"</td>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][5]+"</td>";
    str+="<td align='center' style='font-weight:bold;"+css_style+"'>"+myMonth[0][6]+"</td>";
    str+="</tr>";
    for(w=1;w<7;w++){
      str+="<tr>";
      for(d=0;d<7;d++){
        str+="<td align='center' valign='top' id='"+this.varName+"_calCell_"+d+"_"+w+"' style='cursor:pointer' onMouseOver='"+this.varName+".fToggleColor(this)' onMouseOut='"+this.varName+".fToggleColor(this)' onclick="+this.varName+".fSetSelectedDay(this,true) bgcolor='#f1f1f1'>";
        if(!isNaN(myMonth[w][d])) {
          str+="<font id='"+this.varName+"_calDateText_"+d+"_"+w+"' onMouseOver='"+this.varName+".fToggleColor(this)' style='cursor:pointer;"+css_style+"' onmouseout='"+this.varName+".fToggleColor(this)' onclick="+this.varName+".fSetSelectedDay(this)>" + myMonth[w][d] + "</font>";
        } else {
          str+="<font id='"+this.varName+"_calDateText_"+d+"_"+w+"' onMouseOver='"+this.varName+".fToggleColor(this)' style='cursor:pointer;"+css_style+"' onmouseout='"+this.varName+".fToggleColor(this)' onclick="+this.varName+".fSetSelectedDay(this)></font>";
        }
        str+="</td>";
      }
      str+="</tr>";
    }
    str+='<tr>';
    str+='<td colspan="7">';
    str+='<table border="0"><tr><td>';
    str+='<select id="'+this.varName+'_tbSelMonth" name="'+this.varName+'_tbSelMonth" onchange="'+this.varName+'.fUpdateCal_(0)" onkeyup="'+this.varName+'.fUpdateCal_(0)" style="font-family:verdana;font-size:7pt">'
    str+='<option value="1">Gennaio</option>';
    str+='<option value="2">Febbraio</option>';
    str+='<option value="3">Marzo</option>';
    str+='<option value="4">Aprile</option>';
    str+='<option value="5">Maggio</option>';
    str+='<option value="6">Giugno</option>';
    str+='<option value="7">Luglio</option>';
    str+='<option value="8">Agosto</option>';
    str+='<option value="9">Settembre</option>';
    str+='<option value="10">Ottobre</option>';
    str+='<option value="11">Novembre</option>';
    str+='<option value="12">Dicembre</option>';
    str+='</select>';
    str+='<input id="'+this.varName+'_tbSelYear" name="'+this.varName+'_tbSelYear" maxlength="4" onblur="'+this.varName+'.fUpdateCal_(0)" style="width:60;font-family:verdana;font-size:7pt"></input>';
    str+='</td></tr>';
    str+=' </table>';
    str+='</td>';
    str+='</tr>';
    str+='</table>';
    var ctrl=document.getElementById(id);
    ctrl.innerHTML=str;
    var dCurDate=new Date();
    ctrl=document.getElementById(this.varName+'_tbSelMonth');
    ctrl.options[dCurDate.getMonth()].selected = true;
    ctrl=document.getElementById(this.varName+'_tbSelYear');
    ctrl.value=this.Year;
  }
  this.fUpdateCal_=function(iDay){
    var ctrl,m,y;
    ctrl=document.getElementById(this.varName+'_tbSelYear');
    y=ctrl.value;
    ctrl=document.getElementById(this.varName+'_tbSelMonth');
    m=ctrl.value;
    this.fUpdateCal(iDay,m,y);
  }
  // aggiorna il calendario
  this.fUpdateCal=function(iDay,iMonth,iYear){
    myMonth=this.fBuildCal(iYear,iMonth);
    var ctrl;
    this.objPrevElement.bgColor="";
    this.iDay=iDay;
    for(w=1;w<7;w++){
      for(d=0;d<7;d++){
        if(!isNaN(myMonth[w][d])){
          ctrl=document.getElementById(this.varName+'_calDateText_'+d+'_'+w);
          //if (w==3) alert(ctrl.outerHTML)
          ctrl.innerHTML=myMonth[w][d];
          if(myMonth[w][d]==this.iDay){
             ctrl=document.getElementById(this.varName+'_calCell_'+d+'_'+w);
             this.fSetSelectedDay(ctrl,false);
          }
        } else {
          ctrl=document.getElementById(this.varName+'_calDateText_'+d+'_'+w);
          ctrl.innerHTML=" ";
        }
      }
    }
    ctrl=document.getElementById(this.varName+'_tbSelMonth');
    ctrl.options[this.Month-1].selected=true;
    ctrl=document.getElementById(this.varName+'_tbSelYear');
    ctrl.value=this.Year;
  }
}
ZtVWeb.CalendarioCtrl=function(form,id,name,x,y,w,h,font,font_size,anchor,popup,return_input){  //name--->id
  this.name=name;
  this.form=form;
  this.Ctrl=document.getElementById(id);
  this.popup=popup;
  var onclick=this.Ctrl.onclick;
  this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true);
  this.setCtrlStdMethods(this);
  this.addToForm(this.form,this);
  function EnabledImage(){
    var imgCalendarEnabled = SPTheme.formShowCalendarEnabledImage || '../'+ZtVWeb.theme+'/formPage/zoom_calendar_enabled.gif'
    if (imgCalendarEnabled.substr(0,1)=='{') {
      imgCalendarEnabled = JSON.parse(imgCalendarEnabled);
      this.Ctrl.innerHTML = "<span id='"+'window.'+this.form.formid+'.'+this.name+"_icon' style='font-family:"+imgCalendarEnabled.FontName+";"+
                            (imgCalendarEnabled.Size?"font-size:"+imgCalendarEnabled.Size+"px;":"")+
                            (imgCalendarEnabled.FontWeight?"font-weight:"+imgCalendarEnabled.FontWeight+";":"")+
                            (imgCalendarEnabled.Color?"color:"+imgCalendarEnabled.Color+";":"")+
                            "'>"+String.fromCharCode(imgCalendarEnabled.Char)+"</span>";
    } else {
      this.Ctrl.innerHTML = "<img id='"+'window.'+this.form.formid+'.'+this.name+"_icon' src='"+imgCalendarEnabled+"' style='z-index:1' border='0'>"
    }
    this.Ctrl_Icon=document.getElementById(id+'_icon');
  }
  function DisabledImage() {
    var imgCalendarDisabled = SPTheme.formShowCalendarDisabledImage || '../'+ZtVWeb.theme+'/formPage/zoom_calendar_disabled.gif'
    if (imgCalendarDisabled.substr(0,1)=='{') {
      imgCalendarDisabled = JSON.parse(imgCalendarDisabled);
      this.Ctrl.innerHTML = "<span id='"+'window.'+this.form.formid+'.'+this.name+"_icon' style='font-family:"+imgCalendarDisabled.FontName+";"+
                            (imgCalendarDisabled.Size?"font-size:"+imgCalendarDisabled.Size+"px;":"")+
                            (imgCalendarDisabled.FontWeight?"font-weight:"+imgCalendarDisabled.FontWeight+";":"")+
                            (imgCalendarDisabled.Color?"color:"+imgCalendarDisabled.Color+";":"")+
                            "'>"+String.fromCharCode(imgCalendarDisabled.Char)+"</span>";
    } else {
      this.Ctrl.innerHTML = "<img id='"+'window.'+this.form.formid+'.'+this.name+"_icon' src='"+imgCalendarDisabled+"' style='z-index:1' border='0'>"
    }
    this.Ctrl_Icon=document.getElementById(id+'_icon');
  }
  if(popup=='true'){
    EnabledImage.call(this);
    this.return_input=return_input;
    if(form[return_input].Ctrl_input.type=='date'){
      this.Ctrl_Icon.style.display='none';  
    }
  } else {
    PrepareJsCalendar(false,true);
    LaunchCalendar(form[return_input],form[return_input].picture);
  }
  this.AddListenerToHTMLEvent('ondblclick', 'dbClick');
  this.Disabled=function(){
    this.Ctrl.removeAttribute('href');
    this.Ctrl.onclick=null;
    if(popup=='true'){
      DisabledImage.call(this);
    }
  }
  this.Enabled=function(){
    this.Ctrl.setAttribute('href','javascript:void(0)');
    this.Ctrl.onclick=onclick;
    if(popup=='true'){
      EnabledImage.call(this);
    }
  }  
  this.Value=function(v){return window[id+'_calendar'].Value(v);}
  this.PopupCalendar=function(){
    PrepareJsCalendar(false);
    LaunchCalendar(form[return_input],form[return_input].picture);
  }
}

ZtVWeb.CalendarioCtrl.prototype=new ZtVWeb.StdControl();
