var ControlsIsInstalled=true;
//Copyright 2004 and onwards Zucchetti Spa.
var i_last_focused_item=null;
var skipPreventDefault=false;
var isShiftKeyPressed=false;
var m_bAskFixedKeyConfirm=false;
var m_oDetailItemWithMenu=[]
function SetEndRoutineMessage(msg) {
HideLoadingLayer("none")
Ctrl('routine_message').style.display='';
Ctrl('routine_message').innerHTML = msg;
}
function HideLoadingLayer(status){
 Ctrl('entity_loading').style.display=(typeof(status)=='undefined' || status?'none':'');
 if(!status && window['m_aStateEvals']){
  for(var i=0;i<m_aStateEvals.length;i++)
   m_aStateEvals[i]()
 }
}
function CheckModified() {
 if(m_bUpdated){
  return "";
 }
 else{
  return void(0);
 }
}
if(typeof LibJavascript=='undefined') var LibJavascript={};
LibJavascript.ReadGetData=function(){
var res={};
var getDataString=new String(window.location);
var questionMarkLocation=getDataString.search(/\?/);
if(questionMarkLocation!=-1){
getDataString=getDataString.substr(questionMarkLocation+1);
var getDataArray=getDataString.split(/&/g);
for(var i=0;i<getDataArray.length;i++){
var nameValuePair=getDataArray[i].split(/=/);
res[unescape(nameValuePair[0])]=unescape(nameValuePair[1]);
}
}
return res;
}
LibJavascript.UserCanSee=function(c1){
if(IsA(c1,'C'))c1=Ctrl(c1)
var c=c1.parentNode
return(c.getAttribute('status')!='close'||c.parentNode.getAttribute('status')!='close')&&c.style.display!='none'&&c.parentNode.style.display!='none'&&(typeof tabs=='undefined'||tabs.IsExpanded(ControlPage(c1)))
}
LibJavascript.RefreshChildGrid=function(c){
if(IsIE()){if(IsA(c,"C"))c=Ctrl(c)
if(c&&c.contentWindow.adjustWidthAndHeight)c.contentWindow.adjustWidthAndHeight(false);
if(c&&(c=c.contentWindow.Ctrl("GridTable_Container")))c.style.cssText=c.style.cssText
}}
jsapplets=new Array()

function AutonumberJavascript(p_documentloc) {
this.reset = function() {
this.names=new Array();
this.values=new Array();
this.ops=new Array();
this.types=new Array();
this.lens=new Array();
this.decs=new Array();
this.tables=new Array();
}
this.composeName = function(par) {
var file2=par
if (file2.lastIndexOf('?')>-1)
  file2=file2.substring(0,file2.indexOf('?'));
if (Right(file2,5)==".aspx")
  file2=file2.substring(0,file2.lastIndexOf('/'))+"/SPUpdateAutonumber.aspx";
else
  file2=file2.substring(0,file2.lastIndexOf('/'))+"/SPUpdateAutonumber";
return file2;
}
this.reset()
this.documentloc=p_documentloc
this.toUpdate=false
this.ok=false

this.GetFromResponse=function(res) {
var l;
var stop=false;
var i=0,p;
var text=LibJavascript.Split(res)
var line=0
for(line=0;line<text.length && !stop;line++) {
l=text[line]
i=i+1;
stop=(l=="-->")
if (i==2){
this.ok=l=="Ok"
this.errmsg=l;
} else if (i>2 && !stop) {
p=l.indexOf('=');
if (p!=-1) {
this.rdvar[l.substring(0,p).toLowerCase()]=l.substring(p+1)
}
}
}
}
this.SetETName=function(etname) {this.etname=etname}
this.doUpdate=function() {
var urle="?";
try {
var fixed=1;
for(var name in this.names) {
if (!IsA(this.names[name],'F')) {
var idx=this.names[name]
urle=urle+"Name"+fixed+"="+URLenc(idx)+"&";
urle=urle+"Value"+fixed+"="+URLenc(this.values[idx])+"&";
urle=urle+"Type"+fixed+"="+URLenc(this.types[idx])+"&";
urle=urle+"Len"+fixed+"="+URLenc(this.lens[idx])+"&";
urle=urle+"Dec"+fixed+"="+URLenc(this.decs[idx])+"&";
urle=urle+"Op"+fixed+"="+URLenc(this.ops[idx])+"&";
++fixed;
}
}
var row=1;
for(var tablename in this.tables) {
if (!IsA(this.tables[tablename],'F')) {
urle=urle+"Tablename"+row+"="+URLenc(tablename)+"&";
urle=urle+"Autonumber"+row+"="+URLenc(this.tables[tablename])+"&";
++row;
}
}
if(this.etname!=null)urle=urle+"ETName"+row+"="+URLenc(this.etname)+"&";
urle=urle.substring(0,urle.length-1);
this.rdvar=new Array();
var file=this.documentloc
file=this.composeName(file);
var url=new JSURL(file+urle,true);
this.GetFromResponse(url.__response());
} catch(e) {
this.ok=false;
}
this.reset();
}
this.checkUpdate=function() {
if (this.toUpdate) {
this.doUpdate()
this.toUpdate=false
this.etname=null
}
}
this.GetAutonumberString=function(p_cName) {
this.checkUpdate();
p_cName=p_cName.toLowerCase();
if (this.rdvar[p_cName] != null){
return this.rdvar[p_cName]
} else
return "";
}
this.GetAutonumberDouble=function(p_cField) {
this.checkUpdate();
p_cField=p_cField.toLowerCase();
if (this.rdvar[p_cField] != null) {
try {
return this.rdvar[p_cField]
} catch (e) {
return 0;
}
} else
return 0;
}
this.SetProg=function(name,value,op,type,len,dec) {
this.toUpdate=true;
var ln=name.toLowerCase();
this.names=this.names.concat(ln);
this.values[ln]=value
this.types[ln]=type
this.ops[ln]=op
this.lens[ln]=len+''
this.decs[ln]=dec+''
}
this.SetFixedProg=function(name,value,type,len,dec){
value=(type=='C'?Left(value+Replicate(' ',len),len):value+'')
this.SetProg(name,value,type=='N'?'0':'',type,len,dec)
}
this.SetAutonumber=function(auto,table) {
this.toUpdate=true;
this.tables[table]=auto.toLowerCase()
}
}

function LinkJavascript(p_documentloc) {

this.composeName = function(par) {
var file2=par
if (file2.lastIndexOf('?')>-1)
  file2=file2.substring(0,file2.indexOf('?'));
if (Right(file2,5)==".aspx")
  file2=file2.substring(0,file2.lastIndexOf('/'))+"/SPLinker.aspx";
else
  file2=file2.substring(0,file2.lastIndexOf('/'))+"/SPLinker";
return file2;
}
this.documentloc=p_documentloc
var par=this.composeName(this.documentloc)
this.m_cKey=""
this.m_cSearchingFunction=""
this.m_bFillEmptyKey=false
this.m_cParms={}
this.m_cID=""
this.m_cRdfields = ""
this.m_cRdtypes = ""
this.m_cAutozoom=""
this.m_cTable=""
this.m_bLooselyLinked=false
this.m_cDefaultsFunction=""
this.m_cMode=""
this.m_cRows="" //righe del suggest
this.m_cFixedKeyName=""
this.m_cFiltersString=""
this.SetFixedKeyName = function(keyFieldName) {
this.m_cFixedKeyName=keyFieldName;
}
this.SetDoubleKey = function(keyFieldName,keyFieldValue,len,dec,fe) {
this.m_bEmptyKey=keyFieldValue==0;
if (this.m_bFillEmptyKey||fe) {
if (Empty(keyFieldValue)) {
keyFieldValue=''
}
}
this.m_cKey = this.m_cKey+","+keyFieldName+","+keyFieldValue
}
this.SetStringKey = function(keyFieldName,keyFieldValue,len,dec) {
this.m_bEmptyKey=keyFieldValue=="";
if (this.m_bFillEmptyKey) {
if (Empty(keyFieldValue)) {
keyFieldValue=''
} else {
keyFieldValue="'"+Strtran(keyFieldValue,"'","''")+"'"
}
} else {
keyFieldValue="'"+Strtran(keyFieldValue,"'","''")+"'"
}
this.m_cKey = this.m_cKey+","+keyFieldName+","+keyFieldValue
}
this.SetBooleanKey = function(keyFieldName,keyFieldValue,len,dec) {
this.m_bEmptyKey=keyFieldValue==false;
if (this.m_bFillEmptyKey) {
if (Empty(keyFieldValue)) {
keyFieldValue=''
}
}
this.m_cKey = this.m_cKey+","+keyFieldName+","+(keyFieldValue?1:0)
}
this.SetDateKey = function(keyFieldName,keyFieldValue,len,dec) {
this.m_bEmptyKey=(keyFieldValue=="0100-01-01")
if (this.m_bFillEmptyKey) {
if (Empty(keyFieldValue)) {
keyFieldValue=''
} else {
keyFieldValue="{d '"+keyFieldValue+"'}"
}
} else {
keyFieldValue="{d '"+keyFieldValue+"'}"
}
this.m_cKey = this.m_cKey+","+keyFieldName+","+keyFieldValue
}
this.SetDateTimeKey = function(keyFieldName,keyFieldValue,len,dec) {
this.m_bEmptyKey=(keyFieldValue=="0100-01-01 00:00:00")
if (this.m_bFillEmptyKey) {
if (Empty(keyFieldValue)) {
keyFieldValue=''
} else {
keyFieldValue="{ts '"+keyFieldValue+"'}"
}
} else {
keyFieldValue="{ts '"+keyFieldValue+"'}"
}
this.m_cKey = this.m_cKey+","+keyFieldName+","+keyFieldValue
}
this.SetFixedFilters = function(filtersString) {
this.m_cFiltersString = filtersString;
}
this.SetFields = function(rd_fields) {
this.m_cRdfields = rd_fields
}
this.SetTypes = function(rd_types) {
this.m_cRdtypes = rd_types
}
this.SetLinkzoom = function(autozoom) {
this.m_cAutozoom = autozoom
}
this.SetMode = function(mode) {
this.m_cMode = mode
}
this.SetRows = function(rows) { //righe del suggest
this.m_cRows = rows
}
this.LinkTable = function(p_cTableName) {
this.m_cTable=p_cTableName
}
this.SetSearchingFunction = function(p_cSearchingFunction) {
this.m_cSearchingFunction=p_cSearchingFunction
}
this.FillEmptyKey = function() {
this.m_bFillEmptyKey=true
}
this.SetParm=function(n,v){this.m_cParms[n]=v}
this.SetDefaultsFunction = function(p_cDefaultsFunction) {
this.m_bLooselyLinked=true
this.m_cDefaultsFunction=p_cDefaultsFunction
}
this.SetID=function(p_cID){
try{this.m_cID=m_IDS[p_cID][0]}catch(oldtemplate){this.m_cID=m_IDS[p_cID]}
}


this.DoLink=function(m_nKmode){
this.m_cWhereFieldExpr="";
this.m_cWhereFixedExpr="";
this.m_cWhereAddedFixedFilters="";
this.m_nDefaultRoutineResult=1;
this.m_oData="";
this.rdvar=[];
var noconn=false,urle="?",c,url;
try{
if (!this.m_bEmptyKey || this.m_cFixedKeyName){
if(this.m_cKey.charAt(0)==',')this.m_cKey=this.m_cKey.substring(1);
urle+="Table="+this.m_cTable+"&";
urle+="Kfld="+URLenc(this.m_cKey)+"&";
urle+="Rdfld="+URLenc(this.m_cRdfields)+"&";
urle+="Rdtypes="+URLenc(this.m_cRdtypes)+"&";
urle+="Kmode="+m_nKmode+"&";
urle+="Autozoom="+this.m_cAutozoom+"&";
urle+="SearchingFunction="+this.m_cSearchingFunction+"&";
urle+="FillEmptyKey="+this.m_bFillEmptyKey+"&";
urle+="LooselyLinked="+this.m_bLooselyLinked+"&";
urle+="DefaultsFunction="+this.m_cDefaultsFunction+"&";
urle+="FiltersString="+URLenc(this.m_cFiltersString)+"&";
urle+="Key="+this.m_cID+"&";
for(c in this.m_cParms){urle+=c+"="+URLenc(this.m_cParms[c])+"&";}
urle+="Mode="+this.m_cMode+"&";
urle+="Rows="+this.m_cRows+"&"; //righe del suggest
urle+="FixedKeyName="+this.m_cFixedKeyName+"&";
urle=this.composeName(this.documentloc)+urle;
c=LinkJavascript.cache?LinkJavascript.cache[urle]:null;
if(c){this.rdvar=c.rdvar;this.m_cWhereFieldExpr=c.m_cWhereFieldExpr;
this.m_cWhereFixedExpr=c.m_cWhereFixedExpr;this.m_nDefaultRoutineResult=c.m_nDefaultRoutineResult;this.m_cWhereAddedFixedFilters=c.m_cWhereAddedFixedFilters;
this.ok=c.ok;this.askZoom=c.askZoom;this.doNothing=c.doNothing;
}else{
url=new JSURL(urle,true);
try {
this.GetFromResponse(url.__response());
if(LinkJavascript.cache){LinkJavascript.cache[urle]=this;AppletTag("Link");}
}catch(e){
if(e&&url.http.status!=200&&!m_bAlreadySubmitted){alert('errore interno:'+e.message);noconn=true;this.ok=false;}
}
}
}else{
this.ok=true;
this.askZoom=false;
this.doNothing=false;
}
if(this.ok){if(this.doNothing){return 3;}else {return this.askZoom?2:1;}}else{return noconn?-1:0;}
}finally{
this.m_cSearchingFunction="";
this.m_bFillEmptyKey=false;
this.m_cParms={};
this.m_cID="";
this.m_bLooselyLinked=false;
this.m_cDefaultsFunction="";
this.m_cFiltersString="";
this.m_cAutozoom="";
this.m_cKey="";
this.m_cMode="";
this.m_cRows="";
this.m_cFixedKeyName="";
}
}

this.GetFromResponse = function(res) {
var l,stop=false,i=0,p,line,xap=LibJavascript.xap
this.askZoom=false;
this.doNothing=false;
var text=LibJavascript.Split(res)
for(line=0;i<text.length && !stop;line++) {
l=text[line]
i=i+1;
stop=(l=="-->")
if (i==2){
  this.ok=l=="Ok"
  this.errmsg=l;
} else if (i>2 && !stop) {
  if ("More data"==l)
    this.askZoom=true;
  else if ("Do nothing"==l)
    this.doNothing=true;
  else if (Left(l,12)=="WarnsToShow:" && !this.askZoom && !this.doNothing) {
    TogglePostit.addPostit.idx=0
    ShowPostit(eval('['+l.substring(12)+']'),this.m_cID)
  } else if (Left(l,15)=="WhereFieldExpr:")
    this.m_cWhereFieldExpr=xap('prova',l.substring(15));
  else if (Left(l,15)=="WhereFixedExpr:")
    this.m_cWhereFixedExpr=xap('prova',l.substring(15));
  else if (Left(l,21)=="DefaultRoutineResult:")
    this.m_nDefaultRoutineResult=eval(l.substring(21));
  else if (Left(l,8)=="Suggest:")
    this.m_oData=Right(l,l.length-8);
  else if (Left(l,23)=="WhereAddedFixedFilters:")
    this.m_cWhereAddedFixedFilters=xap('prova',l.substring(23));
  else {
    l=xap('prova',l)
    p=l.indexOf('=');
    if (p!=-1) {
      this.rdvar[l.substring(0,p)]=eval(l.substring(p+1))
    }
  }
}
}//for
}

this.GetStringValue = function(p_cField,p_nLen,p_nDec) {
if (this.rdvar[p_cField]!=null){
return RTrim(this.rdvar[p_cField])
} else
return "";
}
this.GetDateValue = function(p_cField,p_nLen,p_nDec) {
if (!Empty(this.rdvar[p_cField])){
var date=this.rdvar[p_cField];
var year=date.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1);
var month=date.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1)+' ';
var day=date.substring(0,date.indexOf(' '))-0
return new Date(year,month-1,day,0,0,0,0)
} else
return NullDate();
}
this.GetDateTimeValue = function(p_cField,p_nLen,p_nDec) {
if (!Empty(this.rdvar[p_cField])){
var date = this.rdvar[p_cField];
var year=date.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1);
var month=date.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1);
var day=date.substring(0,date.indexOf(' '))-0
date=date.substring(date.indexOf(' ')+1);
var hour=date.substring(0,date.indexOf(':'))-0
date=date.substring(date.indexOf(':')+1);
var minute=date.substring(0,date.indexOf(':'))-0
date=date.substring(date.indexOf(':')+1);
var second=parseInt(date); //casi: solo secondi, secondi.millisecondi, secondi+timezone; in ogni caso la parseInt esclude il resto del testo
return new Date(year,month-1,day,hour,minute,second,0)
} else
return NullDateTime();
}
this.GetDoubleValue = function(p_cField,p_nLen,p_nDec) {
if (this.rdvar[p_cField]!=null) {
try {
return this.rdvar[p_cField]-0
} catch (e) {
return 0;
}
} else
return 0;
}

this.GetBooleanValue= function(p_cField,p_nLen,p_nDec) {
if (this.rdvar[p_cField]!=null)
return true==this.rdvar[p_cField];
else
return false;
}
this.GetWhereExpr = function(){
return URLenc(this.m_cWhereFieldExpr)
}
this.GetWhereFieldExprUnencoded= function(){
return this.m_cWhereFieldExpr
}
this.GetWhereFixedExprUnencoded= function(){
return this.m_cWhereFixedExpr
}
this.GetWhereAddedFixedFiltersUnencoded= function(){
return this.m_cWhereAddedFixedFilters
}
this.GetDefaultRoutineResult= function(){
return this.m_nDefaultRoutineResult
}
this.GetJSONData=function(){
return this.m_oData;
}
}

function InitWvApplet() {
 if( IsDeviceMobile() )
  AddMobileLinkListener();
 var l_oWv = WvApplet();
 l_oWv.reset();
 l_oWv.SetRow(0);
 return l_oWv;
}
function InitWvOfflineApplet() {
 if( IsDeviceMobile() )
  AddMobileLinkListener();
 var l_oWv = WvOfflineApplet();
 l_oWv.reset();
 return l_oWv;
}
function WvApplet(){
 return jsapplets.WvApplet;
}
function WvOfflineApplet(){
 return jsapplets.WvOfflineApplet;
}
function BatchApplet(){
 return jsapplets.BatchApplet;
}
function SettingsApplet(){
 return jsapplets.SettingsApplet;
}
function HParApplet(){
 return jsapplets.HParApplet;
}
function TrsApplet(){
 return jsapplets.TrsApplet;
}
function LinkApplet(){
 return jsapplets.LinkApplet;
}
function LinkAppletOffline(){
 return new LinkJavascriptOffline(location.toString());
 //return jsapplets.LinkOfflineApplet;
}
function AutonumberApplet(){
 return jsapplets.AutonumberApplet
}

function AppletTag(name,appletclass,SetValueNameFirst){
 var napp;
 switch ( name ) {
  case 'Trs': case 'Wv': case 'HPar': case 'Settings':
   napp = new TrsJavascript(SetValueNameFirst);
   break;
  case 'WvOffline':
   napp = new TrsJavascriptOffline(SetValueNameFirst);
   break;
  case 'Link':
   napp = new LinkJavascript(location.toString());
   break;
  case 'LinkOffline':
   napp = new LinkJavascriptOffline(location.toString());
   break;
  case 'Batch':
   napp = new BatchJavascript(location.toString());
   break;
  case 'Autonumber':
   napp = new AutonumberJavascript(location.toString());
   break;
  default:
 }
 jsapplets[name+'Applet']=napp;
}

function CheckDateChar(e){
 e=e?e:window.event;
 var keyCode=GetKeyCode(e);
 if (IsNetscape() || IsMozilla()) {
  if (Eq(keyCode,0) || Eq(keyCode,8) || Eq(keyCode,13)) {
   return true
  }
 }
 var field=GetEventSrcElement(e);
 if (field.readOnly || field.disabled) return true;
 if (e.ctrlKey) return true;
 //32-->Space ascii code, 45-->Minus ascii code, 46-->Point ascii code, 47-->/ ascii code, 58-->: ascii code, 37--> freccia sinistra, 39 --> freccia destra, 8--> backspace
 return (keyCode>47 && keyCode<58) || keyCode==32 || keyCode==45 || keyCode==46 || keyCode==47 || keyCode==58 || keyCode==37 || keyCode==39 || keyCode==8
}
//Validazione della data
function CheckDate() {
return LibJavascript.Date.CheckDate.apply(this,arguments);
}
//Validazione della data ora
function CheckDateTime() {
return LibJavascript.Date.CheckDateTime.apply(this,arguments);
}
function WtH(workvar,type,len,dec,picture){
 if(len==null) len=0;
 if(dec==null) dec=0;
 if(picture==null) picture='';
 switch(type){
  case 'L':
   return FormatBoolean(workvar,picture);
   break;
  case 'C': case 'M':
   return FormatChar(workvar,len,picture);
   break;
  case 'N':
   if(len==0 && dec==0 && picture=='')
     return Strtran(workvar.toString(),".",decSep);
   else
     return FormatNumber(workvar,len,dec,picture);
   break;
  case 'D':
   return FormatDate(workvar,picture);
   break;
  case 'T':
   return FormatDateTime(workvar,picture);
   break;
 }
}
function HtW(obj,type){
 switch(type){
  case 'L':
   return CharToBool(obj);
   break;
  case 'C': case 'M':
   return FixIssueChrome338738(Trim(obj));
   break;
  case 'N':
   return Val(Strtran(Strtran(obj, milSep,''),decSep,'.'));
   break;
  case 'D':
   return HtmlToWork_Date(obj);
   break;
  case 'T':
   return HtmlToWork_DateTime(obj);
   break;
 }
}

function HtmlToWork_Date(strDate){
 if(strDate=='' || strDate=='  -  -'){
  return new Date(100,0,1,0,0,0,0);
 }
 var day, month, year, eng, objDate;
 if (IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date ){
   // YYYY-MM-DD
   objDate = new Date(strDate);
   year=strDate.substr(0,4)-0
   month=strDate.substr(5,2)-0
   day=strDate.substr(8,2)-0
   return new Date(year,month-1,day);
 }else if("N"==dataFormatSetByapplication && typeof ZtVWeb=='undefined'){
  eng = window.m_cLanguage=='eng'
  day=strDate.substr((eng?3:0),2)-0;
  month=strDate.substr((eng?0:3),2)-0;
  year=strDate.substr(6,4)-0;
  objDate = new Date(year,month-1,day);
 }else{
  if(typeof ZtVWeb=='undefined')
    LibJavascript.RequireLibrary( ToResource('visualweb/VisualWEB.js'), true )
  objDate = ZtVWeb.strToDate(strDate,TranslatePicture(datePattern))||NullDate()
 }
 return objDate;
}
function HtmlToWork_DateTime(strDate){
 if(strDate=='' || strDate=='  -  -'){
  return new Date(100,0,1,0,0,0,0);
 }
 var year,month,day,h,m,s;
 if (IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.datetimeLocal ){
  // YYYY-MM-DDThh:mm:ss
  year=strDate.substr(0,4)-0
  month=strDate.substr(5,2)-0
  day=strDate.substr(8,2)-0
  h=strDate.substr(11,2)-0
  m=strDate.substr(14,2)-0
  s=strDate.substr(17)-0;
  return new Date(year,month-1,day,h,m,s);
 }else if("N"==dataFormatSetByapplication && typeof ZtVWeb=='undefined'){
  var eng = window.m_cLanguage=='eng'
    , day=strDate.substr((eng?3:0),2)-0
    , month=strDate.substr((eng?0:3),2)-0
    , year=strDate.substr(6,4)-0
    , h=strDate.substr(11,2)-0
    , m=strDate.substr(14,2)-0
    , s=strDate.substr(17)-0;
  return new Date(year,month-1,day,h,m,s);
 }else{
  if(typeof ZtVWeb=='undefined')
    LibJavascript.RequireLibrary( ToResource('visualweb/VisualWEB.js'), true )
  return ZtVWeb.strToDateTime(strDate,TranslatePicture(dateTimePattern))||NullDateTime()
 }
}
function FormatChar(workvar,len,picture){
 if(picture!=null){
  var pictureType=picture.substr(0,1)
  if('!'==pictureType || 'M'==pictureType || 'W'==pictureType)
   workvar=workvar.toUpperCase()
  else if('w'==pictureType || 'm'==pictureType)
   workvar=workvar.toLowerCase()
  else if('9'==pictureType && ''!=workvar)
   workvar=FormatNumber(Strtran(workvar.toString(),decSep,"."),len,0,picture)
 }
 return workvar
}
function FormatBoolean(workvar,picture){
 return (workvar?'true':'false');
}
function FormatNumber(number,len,dec,picture){
 if(isNaN(number)) number=0;
 if(picture==null) picture='';
 if(len==null) len=0;
 if(dec==null) dec=0;

 var i,j,stringLen=picture.length;
 var stringNumber,integerValue,aux,decimalValue='';
 var bNeg=false;

 if(number<0){
  bNeg=true;
 }

 if(stringLen>0){
  for(i=0;i<stringLen;i++)
   if(picture.charAt(i)==".") break;
  if(i==stringLen)
   dec=0;
  else
   dec=stringLen-i-1;
 }

 stringNumber=FormatDecimals(Math.abs(number),dec);
 j=stringNumber.length-dec;
 if(dec>0){
  decimalValue=decSep+Substr(stringNumber,stringNumber.length-dec+1);
  j--;
 }
 aux=integerValue=Left(stringNumber,j);
 if(aux==''){
  integerValue=aux="0";
 }

 if(At(",",picture)>0){
  if(dec>0)
   picture=Left(picture,stringLen-dec-1);
  //aggiunta del separatore delle migliaia
  aux='';
  stringLen=integerValue.length;
  for(i=0;i<stringLen;i++){
   aux=integerValue.charAt(stringLen-i-1)+aux;
   if((i+1) % 3 == 0 && i!=(stringLen-1)) aux=milSep+aux;
  }
 }
 if(bNeg)
  return '-'+aux+decimalValue;
 else
  return aux+decimalValue;
}
function FormatDecimals(number,dec){
 if(dec==0)
  return(Math.round(number).toString());
 if(number==0)
  return "."+"0000000000000".substr(0,dec);
 var mult=1;
 for(var i=0;i<dec;i++){
  mult=mult*10;
 }
 var r=(Math.round(number*mult)).toString();
 r=ZeroPad(r,dec);
 var l=r.length;
 var decimals=r.substr(l-dec,dec);
 if(decimals!='')
  return r.substr(0,l-dec)+"."+r.substr(l-dec,dec);
 else
  return r.substr(0,l-dec);
}

function GetDatePicture(say,type) {
  switch (type) {
    case 'D':
      if (IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date )
        return 'YYYY-MM-DD';
      else if (say) {
        return datePattern
      } else {
        return datePattern.replace(/[^DMY]/g,'')
      }
      break;
    case 'T':
      if (IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date )
        return 'YYYY-MM-DDThh:mm:ss';
      else if (say) {
        return dateTimePattern
      } else {
        return dateTimePattern.replace(/[^DMYhms]/g,'')
      }
  }
  return "";
}
var lastDateIsOk

//Formattazione delle Date a seconda dello stato di editing
function ApplyPictureToDate(str,format,ctrl){
 //ctrl e' l' UID del control
 var dayString='',monthString='',yearString='';
 var hasFormat=Len(str)>8 || At('-',str)>0 || At('/',str)>0 || At(':',str)>0 || At('.',str)
 var res,picture,tmpPict;
 lastDateIsOk=true

 if(format=='D' || format=='')
   picture=datePattern
 else if(format=='N')
   picture=datePattern.replace(/[^DMY]/g,'')
 else
   picture=format;

 if(hasFormat){
  tmpPict=picture
 }else{
  tmpPict=picture.replace(/[^DMY]/g,'')
 }
 dayString=str.substr(tmpPict.indexOf("DD"),2)
 monthString=str.substr(tmpPict.indexOf("MM"),2);
 yearString=str.substr(tmpPict.indexOf("YY"),4);
 if(Len(yearString)==2){
  yearString=iif(Val(yearString)>50,'19','20')+yearString;
 }
 res=CheckDate(Val(dayString),Val(monthString),Val(yearString));

 if(res)
  str=_PictDS(dayString,monthString,yearString,picture);
 else{
  if((dayString+monthString+yearString)!='' && ctrl!=null){
   lastDateIsOk=false;
   alert(Translate('MSG_WRONG_DATE'));
   str='';
   SetControlFocus(ctrl);
  }
 }
 return str;
}
function ApplyPictureToDateTime(str,format,ctrl){
 var dayString='',monthString='',yearString='',hourString='',minuteString='',secondString='';
 var hasFormat=Len(str)>14 || At('-',str)>0 || At('/',str)>0 || At(':',str)>0 || At('.',str)
 var res,picture,tmpPict;
 lastDateIsOk=true;

 if(format=='D' || format=='')
  picture=dateTimePattern
 else if(format=='N')
  picture=dateTimePattern.replace(/[^DMYhms]/g,'')
 else
  picture=format;

 if(!Empty(str)){
  if(hasFormat){
   tmpPict=picture
  }else{
   tmpPict=picture.replace(/[^DMYhms]/g,'')
  }
  dayString=str.substr(tmpPict.indexOf("DD"),2)
  monthString=str.substr(tmpPict.indexOf("MM"),2);
  yearString=str.substr(tmpPict.indexOf("YYYY"),4);
  hourString=str.substr(tmpPict.indexOf("hh"),2) || '00';
  minuteString=str.substr(tmpPict.indexOf("mm"),2) || '00';
  secondString=str.substr(tmpPict.indexOf("ss"),2) || '00';
  if(Len(yearString)<4){
   if(Len(yearString)==2)
    yearString=iif(Val(yearString)>50,'19','20')+yearString;
   else
    yearString=ZeroPad(yearString,4);
  }
  res=CheckDateTime(Val(dayString),Val(monthString),Val(yearString),Val(hourString),Val(minuteString),Val(secondString));

  if(res)
   str=_PictTS(dayString,monthString,yearString,hourString,minuteString,secondString,picture);
  else{
   if((dayString+monthString+yearString+hourString+secondString+minuteString)!='' && ctrl!=null){
    lastDateIsOk=false;
    alert(Translate('MSG_WRONG_DATE'));
    str='';
    SetControlFocus(ctrl);
   }
  }
 }
 return str;
}
function CheckDateValidity(ctrl) { //controllo valori elementi nativi di tipo date
  if (ctrl.type=='date' || ctrl.type=='datetime-local') {
    if (ctrl.validity && ctrl.validity.valid===false) {
      lastDateIsOk=false;
      alert(Translate('MSG_WRONG_DATE'));
      ctrl.value='';
      SetControlFocus(ctrl.id);
    }
  }
}

function _flt1_(value){
 return ZeroPad(''+value.getFullYear(),4)+'-'+ZeroPad(''+(value.getMonth()+1),2)+'-'+ZeroPad(''+value.getDate(),2);
}
window['\x73q'+'\x6cD'+'a\x74e']=_flt1_
function _flt2_(value){
 return _flt1_(value)+' '+ZeroPad(''+value.getHours(),2)+':'+ZeroPad(''+(value.getMinutes()),2)+':'+ZeroPad(''+value.getSeconds(),2);
}
window['\x73q'+'\x6cD'+'a\x74e'+'\x54ime']=_flt2_

function getTypeFromValue(value){
 var type="C";
 if(typeof(value)=="string"){
  type="C";
 }else if(typeof(value)=="number"){
  type="N";
 }else if(typeof(value)=="boolean"){
  type="L";
 }else if(IsA(value,"D")){
  type=((value.getHours()==0 && value.getMinutes()==0 && value.getSeconds()==0)?'D':'T');
 }
 return type;
}
function _flt_(name,value,type,no, op){
 if(no==null) no=false;
 if(op==null) op="=";
 if (type==null) type=getTypeFromValue(value);
 var w=''
 switch(type){
  case 'C': case 'M':
   if(no){
    w=name+" "+op+" '"+Strtran(value,"'","''")+"'"
   }else{
    w=name+" "+"\x6ci"+"\x6be '"+Strtran(value,"'","''")+"%'"
   }
   break
  case 'N':
   w=name+' '+op+' '+value
   break
  case 'D':
   w=name+" "+op+" \x7b"+"d '"+_flt1_(value)+"'}"
   break
  case 'T':
   w=name+" "+op+" \x7b"+"ts '"+_flt2_(value)+"'}"
   break
  case 'L':
   w=name+' '+op+' '+(IsA(value,'L')?(value?1:0):value)
   break
 }
 return w
}
window['\x74o'+'\x53Q\x4c']=_flt_
// Gestione checkbox
function ChkboxCheckUncheck(ChkboxCtrl,TValue,workValue){
 if(Eq(TValue,workValue)){
  ChkboxCtrl.checked=true;
 }else{
  ChkboxCtrl.checked=false;
 }
}
function ChkboxValueAssign(ChkboxCtrl,TValue,FValue,type,len,dec,picture){
 if(picture==null){ picture=''; }
 if(len==null){ len=0; }
 if(dec==null){ dec=0; }
 if(ChkboxCtrl.checked){
  ChkboxCtrl.value=WtH(TValue,type,len,dec,picture);
  return TValue;
 }else{
  ChkboxCtrl.value=WtH(FValue,type,len,dec,picture);
  return FValue;
 }
}
function selectRadio(RadioCtrls,val,type,later){
 for(var i=0;i<RadioCtrls.length;i++) if(Eq(HtW(RadioCtrls[i].value,type),val)){
  RadioCtrls[i].checked=true
  return
 }
 if (!later) {
  uncheck()
  return
 }
 function uncheck() {
  LibJavascript.Array.forEach(RadioCtrls, function(r){r.checked=false})
 }
 if(!('l' in selectRadio)) {
  selectRadio.l = []
  setTimeout(alluncheck, 0)
 }
 function alluncheck() {
  LibJavascript.Array.forEach(selectRadio.l, function(u/*uncheck*/){u()})
  delete selectRadio.l
 }
 selectRadio.l.push( uncheck )
}
function getRadioValue(RadioCtrls){
 for(var i=0;i<RadioCtrls.length;i++){
  if(RadioCtrls[i].checked){
   return RadioCtrls[i].value;
  }
 }
 return '';
}
var timeout_id_hidecontextmenu;
function ClearMenuTimeout(){
  window.clearTimeout(timeout_id_hidecontextmenu);
  timeout_id_hidecontextmenu=null;
}
function closeContextMenuWithDelay(id,delay){
  if(delay>0){
   timeout_id_hidecontextmenu=window.setTimeout("closeContextMenu('"+id+"')",delay);
  }
  else closeContextMenu(id);
}

function closeContextMenu(id){
  var c=Ctrl(id+'_container');
  if (c){
    c.setAttribute("open_mode","")
    c.style.display = 'none';
    var btn=Ctrl(id);
    if (btn){
      btn.style.display = '';
      btn.style.opacity = '';
    }
  }
}

function toggleContextMenu(id,item){
  ClearMenuTimeout();
  var c=Ctrl(id+'_container');
  if (c) {
    if (c.style.display=='none') {
      showContextMenu(id,item,'');
    } else {
      if (c.getAttribute("open_mode")!="focus")
        closeContextMenu(id);
      else {
        c.setAttribute("open_mode","");
        SetControlFocus(c.getElementsByTagName('li')[0].id)
      }
    }
  }
}

function showContextMenu(id,item,mode){
  var c=Ctrl(id+'_container');
  if (c && c.style.display=='none'){
    if (!Empty(mode))
      c.setAttribute("open_mode","focus")
    if (!item){
      item=Ctrl(id);
      item.style.display='block';
      item.style.opacity='1';
    }
    else item=Ctrl(item)
    c.style.display='block';
    var position=LibJavascript.DOM.getPosFromFirstRel(item, c);
    c.style.top = (position.y + item.offsetHeight) + 'px';
    var space=GetWindowSize().w-item.getBoundingClientRect().left-item.offsetWidth-c.offsetWidth;
    if (space>0)
      c.style.left = (position.x+item.offsetWidth) + 'px';
    else
      c.style.left = (position.x-c.offsetWidth) + 'px';
    c.style.zIndex=dragObj.zIndex;
    if (mode!='mouseover')
      SetControlFocus(c.getElementsByTagName('li')[0].id)
  }
}

function FocusContextMenuOpener(id,closeMenu){
  var c=Ctrl(Strtran(id,'_MENU',''));
  if (c.childNodes && c.childNodes[0]){
   SetControlFocus(c.childNodes[0].id);
  } else if(c.id){
    SetControlFocus(c.id);
  }
  if (closeMenu)
    closeContextMenu(id);
}

function OnKeyDown_contextmenu(e,id,f){
  e=e?e:window.event;
  if (GetKeyCode(e)==13){
    FocusContextMenuOpener(id);
    if (f in window)
      window[f]();
    else clickContextMenu(f)
  }
}

function showSubContextMenu(el){
el.parentNode.style.display='block';
  if (el.children[2]){
    el.children[2].style.display='block'
    el.children[2].style.top=el.offsetTop+'px';
    el.children[2].style.left='-100%'; // se non metto il left negativo non calcola correttamente la larghezza.. da rivedere!
    if (el.parentNode.offsetLeft<0) // una volta messo il menu a sx va sempre a sx
      el.children[2].style.left='-'+el.children[2].offsetWidth+'px'
    else {
      var space=GetWindowSize().w-el.getBoundingClientRect().left-el.offsetWidth-el.children[2].offsetWidth
      if (space>0)
        el.children[2].style.left='100%'
      else el.children[2].style.left='-'+el.children[2].offsetWidth+'px'
    }
  }
}

function hideSubContextMenu(el){
  if (el.children[2]){
    el.children[2].style.display='none'
  }
}

function clickContextMenu(url){
  if(!Empty(url)){
    var rg=new RegExp('=(%(w_\\w+)%)');
    var match=url.match(rg);
    while (match){
      if (match[2] in window){
        var t=getTypeFromValue(window[match[2]]);
        if (t=='D')
          url=url.replace(match[1],URLenc(_flt1_(window[match[2]])))
        else if (t=='T')
          url=url.replace(match[1],URLenc(_flt2_(window[match[2]])))
        else url=url.replace(match[1],URLenc(window[match[2]]))
      }
      match=url.match(rg);
    }
    if (url.indexOf('http://') !=0 && url.indexOf('https://') !=0 && url.indexOf('javascript')!=0){
      url='../servlet/'+url;
    }
    windowOpenForeground(url)
  }
}

function selectCombo(ComboboxCtrl,val,type){
 if(ComboboxCtrl.type!='select-one')
  return
 var ComboOptions=ComboboxCtrl.options;
 for(var i=0;i<ComboOptions.length;i++) if(Eq(HtW(ComboOptions[i].value,type),val)){
  ComboboxCtrl.selectedIndex=i
  return
 }
 if(IsMozilla())
  ComboboxCtrl.selectedIndex=-1
 else
  ComboboxCtrl.value=''
}
function getComboValue(ComboboxCtrl){
 if(ComboboxCtrl.selectedIndex==-1){
  //un combo puo' presentare un valore '' che non e' un'option del combo stesso
  return '';
 }else{
  return ComboboxCtrl.options[ComboboxCtrl.selectedIndex].value;
 }
}

function DoZoomOnLink(e){
 var ctrl=GetEventSrcElement(e);
 if(ctrl!=null){
  if(link_index(ctrl)>-1){
   var id=ctrl.id;
   if(At('_ZOOM',id)!=0){
    ctrl.onclick();
   }else{
    var blur=ctrl.onblur;
    ctrl.onblur=null;
    var val=ctrl.value;
    if("function"==eval("typeof("+id+"_Valid)") && window[id+"_Valid"](null)){
     id=Left(id,10)+'_ZOOM'+Substr(id,11);
     var ctrl_z=Ctrl(id);
     if(ctrl_z!=null){
      ctrl_z.onclick();
     }
    }
    ctrl.onblur=blur;
   }
  }
 }
}
function GetEventSrcElement(e){
 e=e?e:window.event;
 if(IsNetscape() || IsMozilla())
  return e.target;
 else
  return e.srcElement;
}
function isComboElement(ctrl) {
 if (IsA(ctrl,'A')) {
  for(var c in ctrl) {
   if (c.tagName!='OPTION') return false;
  }
 }
 if (ctrl.tagName!='SELECT') return false;
 return true;
}
function ManageKeys(e,p_bQuery,p_bBody,p_bOnlyLink,p_bIsDate){
  e=e?e:window.event;
  //e.shiftKey funziona solo in IE con l'evento onfocus, quindi ad ogni pressione da tasto settiamo una variabile globale che segna se lo shift e' premuto oppure no (si usa nel cambio di riga dei detail)
  isShiftKeyPressed=e.shiftKey;
  //per controlli in detail il default e' edit
  if(p_bQuery==null) p_bQuery=false;
  if(p_bBody==null) p_bBody=true;
  if(p_bOnlyLink==null) p_bOnlyLink=false;
  if(p_bIsDate==null) p_bIsDate=false;

  var keyCode=GetKeyCode(e);
  var ctrl=GetEventSrcElement(e);
  if(typeof(hideCalendar)=='function'){
    hideCalendar();
  }
  if(e.altKey && keyCode!=123) return;
  if((keyCode>111 && keyCode<124) || keyCode==8 || keyCode==9 || keyCode==27 || keyCode==33 || keyCode==34 || keyCode==38 || keyCode==40 || keyCode==46){
    if(typeof m_cFunction!='undefined' && m_cFunction=='view'){
      switch(keyCode) {
        case 38: //Freccia su
          return;
        case 40: //Freccia giu'
          return;
        case 113://F2
          if(typeof(PrintPrg)!='undefined') PrintPrg();
          break;
        case 114: //F3
          SubmitListenerForm('edit');
          break;
        case 121://F10
        case 27: //ESC
          window.setTimeout("SendData('discard')",1);
          break;
      }
    } else {
      if (p_bOnlyLink) {
        switch (keyCode) {
          case 8: //BackSpace
            if(IsIE() || IsIE_Mac())
              ManageNumericDel(e, keyCode)
            return //Devo fermarmi
          case 9: //TAB
            CallEventModifyCheck(e)
            FixIssueChrome338738(e)
            return//Devo fermarmi
          case 27: //ESC
            if (typeof m_cFunction!='undefined' && m_cFunction=='dialog') {
              //Per compatibilita' Mozilla 1.2 e Netscape 7.0.2
              window.setTimeout("SendData('discard')",1);
            }
            break;
          case 38: //Freccia su
            return;
          case 40: //Freccia giu'
            return;
          case 46: //Canc
            ManageNumericDel(e, keyCode)
            return //Devo fermarmi
          case 120://F9
            if (!p_bQuery) {
              if (!GetDisabled(ctrl)) {
                if (p_bIsDate && link_index(ctrl)<0)
                  LaunchCalendar(ctrl,TranslatePicture(datePattern.replace(/[^DMY]/g,'')));
                else
                  DoZoomOnLink(e);
              }
            }
            break;
          case 121://F10
            if (typeof SendData!='undefined' && !p_bQuery && CallEventModifyCheck(e)) {
              if ("f10_timestamp" in ManageKeys && (new Date().getTime()-ManageKeys.f10_timestamp)<100) {
                CancelEvent(e);
                return false;
              }
              SendData('save');
            }
            break;
          case 123: //ALT+F12
            if (e.altKey) RunSecurity();
            break;
        }
      } else
      if (p_bQuery) {
        switch (keyCode) {
          case 9: //TAB
            return
          case 27: //ESC
            if (window.opener!=null && typeof(m_nChildStatus)!='undefined' && m_nChildStatus==1)
              window.close()
            break
          case 38: //Freccia su
            return;
          case 40: //Freccia giu'
            return;
          case 112: //F1
            break
          case 113: //F2
            if(typeof(PrintPrg)!='undefined') PrintPrg()
            break
          case 114: //F3
            SubmitListenerForm('edit')
            break
          case 115: //F4
            SubmitListenerForm('new')
            break
          case 116: //F5
            SubmitListenerForm('delete')
            break
          case 118: //F7
            RecSeek('previous')
            break
          case 119: //F8
            RecSeek('next')
            break
          case 120: //F9
            Zoom()
            break
          case 121: //F10
            if ("f10_timestamp" in ManageKeys && (new Date().getTime()-ManageKeys.f10_timestamp)<100) {
              CancelEvent(e);
              return false;
            }
            SetMultiQuery(e)
            break
          case 123: //F12
            if (!e.altKey) {
              if (typeof detailed_database_error!="undefined")
                alert(detailed_database_error)
            } else {
              RunSecurity()
            }
            break
        }
      } else {
        switch (keyCode) {
          case 8: //BackSpace
            if(IsIE() || IsIE_Mac())
              ManageNumericDel(e, keyCode)
            return //Devo fermarmi
          case 9: //TAB
            CallEventModifyCheck(e)
            FixIssueChrome338738(e)
            return//Devo fermarmi
          case 27: //ESC
            if (typeof SendData!='undefined' && CallEventModifyCheck(e)) {
              //Per compatibilita' Mozilla 1.2 e Netscape 7.0.2
              window.setTimeout("SendData('moveto')",1);
            }
            break
          case 38: //Freccia su
            if(p_bBody && !m_bShowSuggest && !isComboElement(ctrl)) {
              if (CallEventModifyCheck(e)) {
                ActivatePreviousRow(e)
              }
            } else {
              return
            }
            break
          case 40: //Freccia giu'
            if(p_bBody && !m_bShowSuggest && !isComboElement(ctrl)) {
              if (CallEventModifyCheck(e)) {
                if (!ActivateNextRow(e)) {
                  CancelEvent(e);
                  return
                }
              }
            } else {
              return
            }
            break
          case 46: //Canc
            ManageNumericDel(e, keyCode)
            return //Devo fermarmi
          case 112: //F1
            break
          case 117: //F6
            if(p_bBody) F6Ops()
            break
          case 120: //F9
            if (!p_bQuery) {
              if (!GetDisabled(ctrl)) {
                if (p_bIsDate && link_index(ctrl)<0)
                  LaunchCalendar(ctrl,TranslatePicture(datePattern.replace(/[^DMY]/g,'')));
                else
                  DoZoomOnLink(e);
              }
            }
            break
          case 121: //F10
            if (typeof SendData!='undefined' && CallEventModifyCheck(e)) {
              //inserito controllo di tempo causato  da un doppio richiamo del metodo in IE9
              if ("f10_timestamp" in ManageKeys && (new Date().getTime()-ManageKeys.f10_timestamp)<100) {
                CancelEvent(e);
                return false;
              }
              var srcControl=GetEventSrcElement(e);
              if (srcControl.name!=null && srcControl.name!='' && srcControl.type!='button') {
                var hlist=['onblur','onchange','onclick'];
                var handler;
                for(var i=0;handler==null && i<hlist.length;i++)
                  if (srcControl[hlist[i]]!=null && At("_Valid",srcControl[hlist[i]].toString())>0)
                    handler=srcControl[hlist[i]];
                if (handler!=null) {
                  try {
                    srcControl[hlist[i-1]]=function(){}
                    SendData('save')
                  } finally {
                    if (CallEventModifyCheck.IsChromeOver54) setTimeout(function(){srcControl[hlist[i-1]]=handler;},0);
                    else srcControl[hlist[i-1]]=handler;
                  }
                } else
                  SendData('save')
              } else
                SendData('save')
            }
            break
          case 123: //F12
            if(!e.altKey){
              if (typeof detailed_database_error!="undefined")
                alert(detailed_database_error)
            }
            break
        }
      }
    }
    if(keyCode==8 || keyCode==46 || keyCode==122) return;
    if(keyCode==112){if (!(IsIE() || IsIE_Mac())){e.preventDefault();Help();}
    }else if(IsIE() || IsIE_Mac()){try{e.keyCode=0}catch(e){e.keyCode=null}}
    if((keyCode==33 || keyCode==34) && e.ctrlKey){
      if(keyCode==33)cp_StandardFunction("PgUp");
      if(keyCode==34)cp_StandardFunction("PgDn");
    }
    CancelEvent(e);
    if (keyCode==121)
      ManageKeys.f10_timestamp=new Date().getTime();
    return false;
  } // else if (keyCode==13 && IsSafari() && e.srcElement && e.srcElement.nodeName!='TEXTAREA') CancelEvent(e);
}
function CancelEvent(e){
 e.cancelBubble=true
 if(e.stopPropagation) e.stopPropagation();
 if(e.preventDefault) e.preventDefault(true);
 e.returnValue=false
}
function CancelHelp() {
 CancelEvent(event);
 Help();
}
function F6Ops() {
 if((typeof(m_bStateNoDeleteRows)!="undefined" && m_bStateNoDeleteRows)||(typeof(m_bBlockTrsRow)!="undefined" && m_bBlockTrsRow)||(typeof(m_bChildDisabled)!='undefined' && m_bChildDisabled))
  return;
 NotifyEvent('Before row delete');
 if(Dataoperations('Delete', Ctrl('GridTable')))
  NotifyEvent('Row deleted')
 if ('undefined'!=typeof(DisableChainedLinks))
  EnableControlsUnderCondition_WhenReady();
 FocusFirstDetailComponent();
 closeButtonPanelDiv();
}

function CallEventModifyCheck(e){
var keyCode=GetKeyCode(e);
var bRes=true
var srcControl=GetEventSrcElement(e)
if (srcControl.name!=null && srcControl.name!='' && srcControl.type!='button') {
var hlist=['onblur','onchange','onclick']
var handler
for(var i=0;handler==null && i<hlist.length;i++)
if (srcControl[hlist[i]]!=null && At("_Valid",srcControl[hlist[i]].toString())>0)
handler=srcControl[hlist[i]]
if (handler!=null)
try {
srcControl[hlist[i-1]]=function(){}
skipPreventDefault=true;
bRes = handler(e)
if (!skipPreventDefault && keyCode==9 && e.preventDefault && CallEventModifyCheck.IsFirefoxNot4849 ) e.preventDefault();//workaround per firefox BUG https://bugzilla.mozilla.org/show_bug.cgi?id=540579
} finally {
  if (CallEventModifyCheck.IsChromeOver54) setTimeout(function(){srcControl[hlist[i-1]]=handler;},0);
  else srcControl[hlist[i-1]]=handler;
}
}
return bRes
}
CallEventModifyCheck.IsFirefoxNot4849 = ( IsMozilla() && [48,49].indexOf( parseInt((navigator.userAgent.match('Firefox/([0-9]+)')||[])[1]) ) == -1 );
CallEventModifyCheck.IsChromeOver54 = ( parseInt((navigator.userAgent.match('Chrome/([0-9]+)')||[])[1])>=54 );
function FixIssueChrome338738(e_or_val) {
  //se si passa il valore la funzione ritorna il valore senza il tab finale, se si passa l'evento la funzione modifica il valore nell'elemento del DOM
  if (FixIssueChrome338738.IsChromeUnder52 || FixIssueChrome338738.IsFirefox48Or49 ) {
    if (typeof(e_or_val)=='string') {
      if (e_or_val.substr(Math.max(0,e_or_val.length-1))=='\t')
        return e_or_val.substr(0,e_or_val.length-1);
      else if (e_or_val.substr(0,Math.min(1,e_or_val.length))=='\t')
        return e_or_val.substr(1,e_or_val.length-1);
      else
        return e_or_val;
    } else {
      var el = e_or_val.srcElement||e_or_val.target;
      if (el.value && el.value.substr(Math.max(0,el.value.length-1))=='\t') {
        el.value = el.value.substr(0,el.value.length-1);
      } else if (el.value && el.value.substr(0,Math.min(1,el.value.length))=='\t') {
        el.value = el.value.substr(1,el.value.length-1);
      }
    }
  } else {
    if (typeof(e_or_val)=='string') {
      return e_or_val;
    }
  }
}
FixIssueChrome338738.IsFirefox48Or49 = ( IsMozilla() && [48,49].indexOf( parseInt((navigator.userAgent.match('Firefox/([0-9]+)')||[])[1]) ) > -1 );
FixIssueChrome338738.IsChromeUnder52 = ( parseInt((navigator.userAgent.match('Chrome/([0-9]+)')||[])[1])<52 );
function compareDate(d1,d2){
 return d1.getDate()==d2.getDate() && d1.getMonth()==d2.getMonth() && d1.getFullYear()==d2.getFullYear();
}

function cp_StandardFunction(cCmd){
 switch(cCmd){
  case 'Query':
   if(CtrlByName('FSender')!=null)
    SendData('moveto');
   break;
  case 'Edit':
   SubmitListenerForm('edit');
   break;
  case 'Delete':
   SubmitListenerForm('delete');
   break;
  case 'Load':
   SubmitListenerForm('new');
   break;
  case 'Save':
   if(CtrlByName('FSender')!=null)
    SendData('save');
   break;
  case 'Quit':
   if(CtrlByName('FSender')!=null)
    SendData('moveto');
   break;
  case 'Help':
   //da fare
   break;
  case 'PgUp':
   if(typeof(tabs)!='undefined')
    tabs.Prev();
   break;
  case 'PgDn':
   if(typeof(tabs)!='undefined')
    tabs.Next();
   break;
  case 'ZoomPrev': case 'ZoomNext':
   //da fare
   break;
  case 'Back':
   history.back();
   break;
  case 'Forward':
   history.forward();
   break;
  case 'Refresh':
   location.reload();
   break;
  default:
   if(Left(cCmd,11)=="OrderDetail"){
    eval(cCmd);
    return;
   }
 }
 return;
}
function AsControlValue(any){
 switch(typeof(any)){
  case 'string':
   return any;
   break;
  case 'number':
   return WtH(any,'N',0,0,'');
   break;
  case 'boolean':
   return ''+any;
   break;
  case 'object':
   if(any.constructor!=Date)
    any=_rargs.rebuildIfDate(any)
   if(any.constructor==Date)
    return (any.getHours()>0 || any.getMinutes()>0 || any.getSeconds()>0 ? FormatDateTime : FormatDate)(any,'D')
   break
 }
 return '';
}
function AsAppletValue(any){
 switch(typeof(any)){
  case 'string':
   return WtA(any,'C');
   break;
  case 'number':
   return WtA(any,'N');
   break;
  case 'boolean':
   return WtA(any,'L');
   break;
  case 'object':
   if(any.constructor!=Date)
    any=_rargs.rebuildIfDate(any)
   if(any.constructor==Date)
    return WtA(any,any.getHours()>0 || any.getMinutes()>0 || any.getSeconds()>0?'T':'D')
   break
 }
 return '';
}
//AppletToWork
function AtW(obj,type){
 switch(type){
  case 'L':
   return CharToBool(obj);
   break;
  case 'C': case 'M':
   return Trim(obj);
   break;
  case 'N':
   return Val(obj);
   break;
  case 'D':
   return CharToDate(obj.replace(AtW.nosep,'').replace(AtW.swap, "$3$2$1"))
   break;
  case 'T':
   return CharToDateTime(obj.replace(AtW.nosep,'').replace(AtW.swap, "$3$2$1"))
   break;
 }
}
AtW.nosep=/[^0123456789]/g
AtW.swap=/([0-9][0-9])([0-9][0-9])([0-9][0-9][0-9][0-9])/

var last_focused_comp=null
function EnsureControlFocus() {
if(IsA(window.HideTrsOrizzontalScrollBar,"F"))HideTrsOrizzontalScrollBar()
if(last_focused_comp!=null){
if(!IsA(last_focused_comp,'A')) {
last_focused_comp=[last_focused_comp];
}
var focused=false,i;
for(i=0;!focused && i<last_focused_comp.length;i++){
if(last_focused_comp[i]&&!last_focused_comp[i].disabled&& last_focused_comp[i].style.display!='none'&&last_focused_comp[i].style.visibility!='hidden'){
focused=true;
try{
last_focused_comp[i].focus()
if(IsMozilla()) {
 clearTimeout(EnsureControlFocus.timeout);
 EnsureControlFocus.timeout = setTimeout("try{Ctrl('"+last_focused_comp[i].id+"').focus();Ctrl('"+last_focused_comp[i].id+"').select()}catch(e){}",1)
}
}catch(e){}
last_focused_comp=null
}
}
}
}

function SetControlFocus(candidates){
  function set_focus(dest){
    try {
     if ( !(dest.readOnly===true || dest.disabled===true) && GuessIsVisible(dest) ) {
      if ( !window.SPMobileLib || !window.SPMobileLib.isPlatformMobile() ) {
        dest.focus();
      }
      if ((dest.tagName||'').toLowerCase()=='input')
        SPSelectCtrl( dest );
      if(!IsMozilla())
       last_focused_comp=dest;
      return true;
     }
    } catch(e) {}
    return false;
  }
  if ( !IsA(candidates,'A') ) {
   candidates = [candidates];
  }
  var focused=false;
  for ( var i = 0, dest; !focused && i<candidates.length; i++ ) {
   dest = Ctrl(candidates[i])
   if ( dest ) {
    var pagid=ControlPage(dest);
    if(pagid && Ctrl(pagid).style.display=='none')
     tabs.Select(pagid);
    //Solo per i control RADIO cerco di selezionare il primo disponibile
    if(dest.length!=null && dest.length>0 && dest.type!='select-one') {
     for (var j=0;!focused && j<dest.length;j++) {
       focused = set_focus(dest[j]);
     }
    } else {
     focused=set_focus(dest)
    }
   }
  }
}

function SPSelectCtrl (ctrl, evt) {
  if(IsMozilla()) {
   last_focused_comp=ctrl;
   clearTimeout(EnsureControlFocus.timeout);
  }
  if ( ctrl.type && ctrl.type!='date' && ctrl.type!='datetime-local' && ctrl.type!='button' ) {
    if ( !('length' in ctrl)/*no combo*/ && ctrl.value.length/*c'e' da selezionare*/ ) {
      if ( getSelectionStart(ctrl)==getSelectionEnd(ctrl) ) {
        if ( /WebKit/.test(navigator.userAgent) /*&& evt*/ ) { //https://bugs.webkit.org/show_bug.cgi?id=22691
          ctrl.setSelectionRange( 0, ctrl.value.length );
          if ( evt ) {
            function preventUnselect (mouseup) {
              mouseup.preventDefault();
              ctrl.removeEventListener('mouseup', preventUnselect, false);
            }
            ctrl.addEventListener('mouseup', preventUnselect, false);
          }
        } else {
          ctrl.select();
          if ( SPSelectCtrl.IsFirefox48Or49 ) {
            clearTimeout(SPSelectCtrl.timeout);
            var val = ctrl.value;
            SPSelectCtrl.timeout = setTimeout(function(){
              if (ctrl.value=='\t') {
                ctrl.value = val;
                ctrl.select();
              }
            },1);
          }
        }
      }
    } else if ( SPSelectCtrl.IsFirefox48Or49 && ctrl.value.length===0 ) {
      clearTimeout(SPSelectCtrl.timeout);
      SPSelectCtrl.timeout = setTimeout(function(){
        if (ctrl.value=='\t') {
          ctrl.value = '';
        }
      },1);
    }
  }

  if(IsMobile()){
    if ( ctrl.getAttribute( 'data-sp-item-len' ) /* numeric */ && !ctrl.readOnly ) {
      LibJavascript.Browser.TopFrame( 'LibJavascript' ).ShowPopUpCalculator( ctrl, 32, milSep, decSep, window );
      SPMobileLib.hideKeyboard();
    }
  }

}
SPSelectCtrl.IsFirefox48Or49 = ( IsMozilla() && [48,49].indexOf( parseInt((navigator.userAgent.match('Firefox/([0-9]+)')||[])[1]) ) > -1 );
function GuessIsVisible( el ) {
  if ( IsA(el,'C') ) el = Ctrl(el);
  var cs = GuessIsVisible.computedStyle || (GuessIsVisible.computedStyle = (function(){
    if ( document.defaultView && document.defaultView.getComputedStyle ) {
      //attenzione al bug in firefox!! Se un iframe e' in display none ritorna null!! https://bugzilla.mozilla.org/show_bug.cgi?id=548397
      return function (el, prop) {
        return document.defaultView.getComputedStyle(el, null)[prop];
      };
    } else if ( el.currentStyle ) {
      return function (el, prop) {
        return el.currentStyle[prop];
      };
    } else {
      return function (el, prop) {
        return el.style[prop];
      }
    }
  })());
  return (cs(el,'display')=='none' || cs(el,'visibility')=='hidden') ? false : (el.parentNode && el.parentNode.tagName ? GuessIsVisible(el.parentNode) : true) ;
}
function SetActiveField(ctrl,status){
 if(IsA(ctrl,'C'))ctrl=Ctrl(ctrl);
 if(status){
  i_last_focused_item=ctrl.id;
  LibJavascript.CssClassNameUtils.addClass(ctrl,'Active');
  var c;
  if (ctrl.id && (c=Ctrl(ctrl.id+'_ZOOM'))) {
    LibJavascript.CssClassNameUtils.addClass(c,'Active');
  }
 }
 else {
  LibJavascript.CssClassNameUtils.removeClass(ctrl,'Active');
  var c;
  if (ctrl.id && (c=Ctrl(ctrl.id+'_ZOOM'))) {
    LibJavascript.CssClassNameUtils.removeClass(c,'Active');
  }
  if (IsMozilla() && ctrl.tagName=='INPUT' && ctrl.type=='text') //in Firefox se il testo era selezionato e si fa focus con il mouse rimuove la selezione
    setSelection(ctrl,0,0);
  }
  SetActiveMenu(ctrl,status)
}
function SetActiveMenu(ctrl,status){
  if(IsA(ctrl,'C'))ctrl=Ctrl(ctrl);
  if(status){
    if (ctrl.id && (c=Ctrl(ctrl.id+'_MENU'))) {
      LibJavascript.CssClassNameUtils.addClass(c,'Active');
    }
  }
  else {
    if (ctrl.id && (c=Ctrl(ctrl.id+'_MENU'))) {
      LibJavascript.CssClassNameUtils.removeClass(c,'Active');
    }
  }
}
function SetErrorField(ctrl,status){
 if(IsA(ctrl,'C'))ctrl=Ctrl(ctrl);
 if(status){
  LibJavascript.CssClassNameUtils.addClass(ctrl,'Error');
 }
 else {
  LibJavascript.CssClassNameUtils.removeClass(ctrl,'Error');
 }
}
function ToResource(src){
 if(At(':', src)==0 && Left(src, 1)!='.' && src!=''){
  src='../'+src;
 }
 if ( window.SPOfflineLib && window.SPOfflineLib.hasManifest() ) {
  return src;
 }
 return CompleteWithRegionalSettings(src);
}

function ToHTag(p_cValue){
 p_cValue=Strtran(p_cValue,"&#13;","\r");
 p_cValue=Strtran(p_cValue,"&#10;","\n");
 var p=p_cValue.indexOf("<html>");
 var s='';
 while(p!=-1){
  s+=Strtran(Strtran(Left(p_cValue,p-1),"\r\n","<BR>"),"\n","<BR>");
  p_cValue=Substr(p_cValue,p+7);
  p=p_cValue.indexOf("</html>");
  if(p==-1){
   s+=p_cValue;
   p_cValue='';
   p=-1;
  }else{
   s+=Left(p_cValue,p);
   p_cValue=Substr(p_cValue,p+8);
   p=p_cValue.indexOf("<html>");
  }
 }
 s+=Strtran(Strtran(p_cValue,"\r\n","<BR>"),"\n","<BR>");
 s = s.replace(new RegExp("<(/?script[^>]*)>",'gi'),function (match, p1, offset) { return '&lt;'+p1+'&gt;'; } ); //sanitizza i tag script
 return s;
}

function RecSeek(action){
 if(typeof(m_nChildStatus)=='undefined' || (typeof(m_nChildStatus)!='undefined' && m_nChildStatus==0)){
  var Frm=document.FSender;
  Frm.m_cAction.value=action;
  Frm.submit();
 }
}
function SelectRecord(){
 var Frm=document.FSender;
 var last=Val(document.FrmToolbar.last.value);
 if(!this.value)
  this.value=Ctrl("pos").value;
 if(Lt(Val(this.value),1) && Gt(last,0)){
  this.value=1;
 }else if(Gt(Val(this.value),last)){
  this.value=document.FrmToolbar.last.value;
 }
 if(Ne(Frm.m_nRecPos.value,this.value)){
  Frm.m_cAction.value='moveto';
  Frm.m_nRecPos.value=this.value;
  Frm.submit();
 }
}
function SelectRecordPortlet(last_p,pos_p){
 var Frm=document.FSender;
 var last=Val(last_p);
 if(!this.value)
  this.value=pos_p;
 if(Lt(Val(this.value),1) && Gt(last,0)){
  this.value=1;
 }else if(Gt(Val(this.value),last)){
  this.value=last_p;
 }
 if(Ne(Frm.m_nRecPos.value,this.value)){
  Frm.m_cAction.value='moveto';
  Frm.m_nRecPos.value=this.value;
  Frm.submit();
 }
}

function RecPositionInput(e){
 e=e?e:window.event;
 if(13==GetKeyCode(e)) SelectRecord();
}
function CheckSize(control) {
  var maxLength = control.attributes["maxLength"].value;
  if(maxLength && control.value.length > maxLength-1)return getSelectionStart(control)-getSelectionEnd(control)!=0;
  else return true;
}
function ChangeMarkField(field,selStart,selEnd){
 selStart=typeof(selStart)=='undefined' ? getSelectionStart(field) : selStart;
 selEnd=typeof(selEnd)=='undefined' ? getSelectionEnd(field) : selEnd;
 if(At('-',field.value)==0){
  field.value='-'+field.value;
  setSelection(field,selStart+1,selEnd+1);
 }else{
  field.value=Substr(field.value,2);
  setSelection(field,selStart-1,selEnd-1);
 }
}
function CheckUpper(e){ //BUG in mozilla o netscape: evidezia e digita. Non cancella. Inserisce
 var keyCode,field
 e=e?e:window.event
 keyCode=GetKeyCode(e)       //ottiene il codice ASCII del tasto digitato
 field=GetEventSrcElement(e) //ottiene l'elemento che ha generato l'evento
 if (field.readOnly || field.disabled) return true;
 if (e.ctrlKey) return true;
 if(IsNetscape() || IsMozilla()){
  if(Eq(keyCode,0) || Eq(keyCode,8) || Eq(keyCode,13)){
   return true
  }
 }
 if(IsAlpha(keyCode)) {
  if (CheckSize(field)) {
   if(keyCode>96 && keyCode<123){ // lettera minuscola
    if ( !document.createEvent ) { // IE
      e.keyCode -= 32; //scrivo la lettera maiuscola
    } else { // Opera, WebKit, Firefox
      e.preventDefault();
      var selStart = field.selectionStart,
          selEnd = field.selectionEnd;
      field.value = field.value.substr(0,selStart)+String.fromCharCode(keyCode-32)+field.value.substr(selEnd);
      field.setSelectionRange(selStart+1, selStart+1);
   }
   }
  } else return false //superata la lunghezza
 }
 return true
}
function CheckLower(e){
 var keyCode,field
 e=e?e:window.event
 keyCode=GetKeyCode(e)
 field=GetEventSrcElement(e)
 if (field.readOnly || field.disabled) return true;
 if (e.ctrlKey) return true;
 if(IsNetscape() || IsMozilla()){
  if(Eq(keyCode,0) || Eq(keyCode,8) || Eq(keyCode,13)){
   return true
  }
 }
 if(IsAlpha(keyCode)){
  if (CheckSize(field)) {
   if(keyCode>64 && keyCode<91){ //e una lettera maiuscola
    if ( !document.createEvent ) { // IE
      e.keyCode += 32; //scrivo la lettera minuscola
    } else { // Opera, WebKit, Firefox
      e.preventDefault();
      var selStart = field.selectionStart,
          selEnd = field.selectionEnd;
      field.value = field.value.substr(0,selStart)+String.fromCharCode(keyCode+32)+field.value.substr(selEnd);
      field.setSelectionRange(selStart+1, selStart+1);
    }
   }
  } else return false //superata la lunghezza
 }
 return true
}
function CheckAlpha(e){ //BUG in mozilla o netscape: evidezia e digita. Non cancella. Inserisce
 var keyCode,field
 e=e?e:window.event
 keyCode=GetKeyCode(e)       //ottiene il codice ASCII del tasto digitato
 field=GetEventSrcElement(e) //ottiene l'elemento che ha generato l'evento
 if (field.readOnly || field.disabled) return true;
 if (e.ctrlKey) return true;
 if (IsNetscape() || IsMozilla()){
  if (Eq(keyCode,0) || Eq(keyCode,8) || Eq(keyCode,13)){
   return true
  }
 }
 return IsAlpha(keyCode)
}

function ManageNumericDel(e,keyCode){
 var field=GetEventSrcElement(e);
 try {
  var x=new MyEvent(e,keyCode);
  return window[field.id+'_CheckNumWithPict'](x); //non so se serve il return
 }catch(ex){}
}
MyEvent = function(e,code) {
  if (code==46)
    code=-1
  this.rootEvent=e
  this.keyCode=code
  this.which=code
}

function ValidNum(v,picture) {
  var p_dec = 0
  if (At('.', picture) > 0) p_dec = Len(Substr(picture, At('.', picture) + 1))
  return(Round(v, p_dec))
}
// function windowOpenForeground(){
// clearTimeout(windowOpenForeground.id)
// LibJavascript.IncludeFunction('controls','windowOpenForeground',0,1)
// return windowOpenForeground.apply(null,arguments)
// }
// windowOpenForeground.l=function(){
// if(!windowOpenForeground.l){
// }else if(LibJavascript.IncludeFunction){
// LibJavascript.IncludeFunction('controls','windowOpenForeground',1,1)
// }else{
// windowOpenForeground.id=setTimeout(windowOpenForeground.l,50)
// }
// }
// windowOpenForeground.id=setTimeout/*stdFunctions caricato dopo controls dic08*/(windowOpenForeground.l,500/*lazy x html con submit immediata*/)
function PageOpened(page){
last_focused_comp=null
try{LoadChildrenInPage(page,1)}catch(e){/*no children*/}
calculateSidebarBandsPosition(page);
if(IsIE()){
try{
Ctrl("GridTable_Container").style.cssText=Ctrl("GridTable_Container").style.cssText
}catch(e){
}
setTimeout(t,0)
function t(){
try{
LibJavascript.Array.forEach(Ctrl(page).getElementsByTagName('iframe'),a)
function a(p){
try{
p.contentWindow.adjustWidthAndHeight()
}catch(e){
}
}
}catch(e){
}
}
}
}

function ControlPage(ctrl) {
if(ctrl.length!=null && ctrl.length>0)ctrl=ctrl[0].parentNode;
if(typeof(tabs)=='undefined')return null;
if(ctrl.parentNode!=null && typeof(tabs)!='undefined' && Left(ctrl.parentNode.id, 5)=='page_')
return ctrl.parentNode.id
else{if(ctrl.parentNode!=null)return ControlPage(ctrl.parentNode)
else return 'page_1'}
}
if(IsIE()){
Ctrl=function(id){
var c=Ctrl[id];
try{if(c&&c.document==c.ownerDocument)return c;}catch(e){/*non e' piu' nel document*/}
if((c=document.getElementById(id))&&(c.id==id)){return Ctrl[id]=c}
c=document.getElementsByName(id);
return c.length==1?(Ctrl[id]=c[0]):(c.length?Ctrl[id]=c:null);
}
}else{
Ctrl=function(id){
var c;
if(c=document.getElementById(id))return c;
c=document.getElementsByName(id);
return c.length==1?c[0]:(c.length?c:null);
}
}
var CtrlById=Ctrl
// if(LibJavascript && LibJavascript.DOM) LibJavascript.DOM._CtrlById=Ctrl;
function CtrlByName(id){
var c=document.getElementsByName(id)
return c.length==1?c[0]:(c.length==0?null:c)
}
function ReloadMenu(){
try {
 var f=window.parent.frames.menu;
 if(f==null)
  f=window.parent.parent.frames.menu;
 if(f!=null){
  if((f.m_nUserCode!=null && f.m_nUserCode!=m_nUserCode) ||
     (f.m_cLanguage!=null && f.m_cLanguage!=m_cLanguage) ||
     (f.m_cCompany!=null && f.m_cCompany!=m_cCompany) ||
     (f.m_cThemePath!=null && Strtran(f.m_cThemePath,'../','')!=m_cThemePath)
     ){
   f.location.reload(true);
   if(window.parent.winList)
    window.parent.location.reload(true);
  }
 }
}catch (e) {}
}

function SetRegionalSettings() {
SetNumberSettings()
var a=SettingsApplet()
a.SetRow(0)
a.setValue("decimalSeparator",decSep)
a.setValue("thousandSeparator",milSep)
a.setValue("datePattern",datePattern)
a.setValue("dateTimePattern",dateTimePattern)
a.setValue("timeZoneOffset",""+new Date().getTimezoneOffset())
a.setValue("clientDateTime",DateTimeToChar(DateTime()))
document.FSender.m_cRegionalSettings.value=a.asString();
}
function GetFrameIdx(framename){
 var idx,i=0;
 var frm=window.frames;
 while(i<frm.length && idx==null){
  try{
   if(frm[i].name==framename)
    idx=i;
  }catch(e){/*cross-origin frame (probabilmente da estensioni del browser)*/}
  i++;
 }
 return idx;
}
function FrameRef(framename){
 var idx=GetFrameIdx(framename);
 if(idx!=null)
  return window.frames[idx];
}

function FetchDate(objDate){
 var day=objDate.getDate();
 var month=objDate.getMonth();
 var year=objDate.getFullYear();
 return new Date(year,month,day);
}
function FetchDateTime(objDate) {
 var day=objDate.getDate();
 var month=objDate.getMonth();
 var year=objDate.getFullYear();
 var hour=objDate.getHours();
 var minute=objDate.getMinutes();
 var second=objDate.getSeconds();
 return new Date(year,month,day,hour,minute,second);
}

function SetHypPar(name,value) {
 var a=HParApplet();
 a.SetRow(0);
 a.setValue(name,value);
}

function ToHTMLValue(p_cVar){
 return "'"+ToHTML(p_cVar)+"'";
}
function ToHTML(p_cVar) {
 p_cVar=Strtran(p_cVar,"&","&amp;");
 p_cVar=Strtran(p_cVar,"\\","&#092;");
 p_cVar=Strtran(p_cVar,"<","&lt;");
 p_cVar=Strtran(p_cVar,">","&gt;");
 p_cVar=Strtran(p_cVar,"\"","&quot;");
 p_cVar=Strtran(p_cVar,"'","&#39;");
 p_cVar=Strtran(p_cVar,"\r","&#13;");
 p_cVar=Strtran(p_cVar,"\n","&#10;");
 p_cVar=Strtran(p_cVar,"\u20ac","&euro;");
 return  p_cVar;
}

function IsNamedParameters(arg){
 return (typeof(arg)=='object' && arg.constructor!=Date)
}

function GetProperty(p_trs, name, type) {
return AtW(p_trs.getValue(name), type);
}
function GetTrsProps() {
var p_wh=arguments[0]
var p_trs=arguments[1],row
for(var i=2;i<arguments.length;i++) {
p_wh[arguments[i]]=new TrsJavascript()
row=p_trs.p["0#"+arguments[i]]
if(row==null)row=p_trs.p[arguments[i]]
p_wh[arguments[i]].BuildProperties(row==null?'':row)
}
}

function AtExitValue() {
var frm=CtrlByName('FSender')
if (frm==null || typeof(frm) == 'undefined' || typeof(frm['m_cAtExit'])=='undefined') {
return ''
} else {
return frm.m_cAtExit.value
}
}

function AltInterfaceValue() {
var frm=CtrlByName('FSender')
if (frm==null || typeof(frm) == 'undefined' || typeof(frm['m_cAltInterface'])=='undefined') {
return ''
} else {
return frm.m_cAltInterface.value
}
}

function AutozoomParms() {
var frm=CtrlByName('FSender')
var r=''
if (frm!=null)
if (typeof(frm.m_cAtExit)!='undefined') {
r='&m_cAtExit='+frm.m_cAtExit.value
}
if (typeof(frm.m_cDecoration)!='undefined') {
r+='&m_cDecoration='+frm.m_cDecoration.value
}
return r
}

function AlertErrorMessage(p_cMessage,v1,v2,v3,v4,v5) {
var mess=''
if (v1=='Fri Jan 1 00:00:00 UTC+0100 100'){v1='  /  /    '}
if (v2=='Fri Jan 1 00:00:00 UTC+0100 100'){v2='  /  /    '}
if (v3=='Fri Jan 1 00:00:00 UTC+0100 100'){v3='  /  /    '}
if (v4=='Fri Jan 1 00:00:00 UTC+0100 100'){v4='  /  /    '}
if (v5=='Fri Jan 1 00:00:00 UTC+0100 100'){v5='  /  /    '}
p_cMessage=Translate(p_cMessage,v1!=null?v1:'',v2!=null?v2:'',v3!=null?v3:'',v4!=null?v4:'',v5!=null?v5:'')
if (typeof m_cErrorFromRoutine != 'undefined' && m_cErrorFromRoutine!=null) {mess=m_cErrorFromRoutine}
else {mess=Translate('MSG_VALUE_NOT_ALLOWED')}
p_cMessage=Strtran(p_cMessage,'%ERRORMESSAGE%',mess)
m_cErrorFromRoutine=''
return p_cMessage
}

function RunSecurity() {
if (typeof m_cProgName=='undefined') return
var p='SPManageProcedureSecurity'
if (typeof PlatformPathStart == 'function') p=PlatformPathStart(p)
windowOpenForeground(p+'?progname='+m_cProgName,'','toolbar=0,menubar=0,directories=0,width=524,height=400,resizable=1')
}
function CreatePortlet(){
if (typeof m_cProgNameAlter=='undefined') return;
windowOpenForeground(ToResource('visualweb/editor.jsp'+'?servlet='+URLenc('true')+'&id='+URLenc(m_cProgNameAlter)+'')+'&m_cAction=start&m_cAtExit=close&m_cMode=hyperlink','','toolbar=0,menubar=0,directories=0,width='+(100+m_nPreferredWidth)+',height='+(10+m_nPreferredHeight)+',resizable=1')
}
function ExtendTable(){
if (typeof m_cProgName=='undefined') return;
windowOpenForeground(ToResource('spextender/index.htm?table='+URLenc(m_cVirtName)),'','toolbar=0,menubar=0,directories=0,width=625,height=465,resizable=1')
}

function SetDisplay(c, h) {
var img=null,box,i,boxStateChange=false;
if(typeof c=='string')c=Ctrl(c)
if (c != null && c.getAttribute('data-sp-skip-set-display') !== 'true') {
function _s(c, v) {
c.style.display = v
if(('LABEL'==c.tagName||c.getAttribute('type')=='checkbox') && 'SPAN'==c.parentNode.tagName)c.parentNode.style.display=h?'none':'block';
else if (IsMobile() && 'SELECT'==c.tagName && 'SPAN'==c.parentNode.tagName && LibJavascript.CssClassNameUtils.hasClass(c.parentNode,'select_container') ) c.parentNode.style.display=h?'none':'inline-block';

}
if (c.tagName == 'IMG') {
img = c.id;
if (c.parentNode.tagName=='A' && c.parentNode.id==c.id+"_HREF") c=c.parentNode;
}
if (typeof c.length == 'undefined' || c.tagName == 'SELECT') {
try {
box = c.style.visibility
c.style.visibility = (h ? 'hidden' : '')
//solo se cambia la visibilita
if (box != c.style.visibility && c.tagName == 'DIV' && c.id.length>10 && Right(c.id,4)=='_DIV' && Ctrl(Left(c.id, 10))) { // e' un box collassabile
  boxStateChange=true;
}
if (h || box == c.style.visibility) {
box = null
} else {
box = ToggleCollapsibleBox.children[Left(c.id, 10)]
}
if (box && (Ctrl(Left(c.id, 10)).getAttribute("status") == "open") && (typeof tabs == 'undefined' || tabs.IsExpanded(ControlPage(Ctrl(box[0]))))) {
for (i = 0; i < box.length; i++) {
if (ChildToLoad(box[i])) {
ChangeIframeSrcWithoutPushingHistory(box[i], linkpc_url(box[i]))
} else if (IsRepeatedChild(box[i])) {
LoadContext(1, box[i])
if (Ctrl(box[i]).contentWindow.adjustWidthAndHeight) {
setTimeout(Ctrl(box[i]).contentWindow.adjustWidthAndHeight, 0)
}
}
}
}
} catch (e) {}
if ('IFRAME' != c.tagName) {
if('INPUT'==c.tagName&&c.id)SetDisplay(c.id+'_ZOOM',h)
_s(c, h ? 'none' : '')
if (boxStateChange) {
  calculateSidebarBandsPosition(ControlPage(c));
  CalculateAndResizeEntityHeight();
}
if (!h && arguments.length>2) setTimeout("scaleImage('"+img+"',"+arguments[2]+','+arguments[3]+')',0);
} else if (IsMobile()) {
c.style.maxHeight = h ? '0px' : '';
}
} else {
for(var i=0;i<c.length;i++)_s(c[i],h?'none':'')
}
}
}
function GetDisabled(c) {
 if(typeof c == 'string') c=Ctrl(c)
 if(c!=null){
  if(typeof c.length=='undefined' || c.tagName=='SELECT'){
   var p=c.tagName=='TEXTAREA' || (c.tagName=='INPUT' && c.type=='text')?'readOnly':'disabled'
   return c[p];
  }
 }
}
function GetRadios(c){
 if(typeof c == 'string') c=Ctrl(c);
 if (!c) return [];
 return LibJavascript.Array.filter(c.getElementsByTagName('input'), function(input){
  return input.type == 'radio';
 });
}
function SetDisabled(c,d) {
 if(typeof c == 'string') c=Ctrl(c)
 if(c!=null){
  if(typeof c.length=='undefined' || c.tagName=='SELECT'){
   var p=c.tagName=='TEXTAREA' || (c.tagName=='INPUT' && (c.type=='text' || c.type=='date' || c.type=='datetime-local'))?'readOnly':'disabled'
   c[p]=d
   if(typeof IsTabstrip=='function' && IsTabstrip(c.id)){
    return SetDisabledTabstrip(c.id,d)
   }else if (At('_ZOOM', c.id) != 0) {
    var oldclass;
    if (oldclass=(c.className.match(/( |^)(ZoomButton|GridZoomButton|CalendarButton|CalculatorButton|MultiLanguageButton)/))) {
      oldclass=oldclass[2];
     if(d){
      LibJavascript.CssClassNameUtils.replaceClass(c,oldclass+'Enabled',oldclass+'Disabled');
     }else{
      LibJavascript.CssClassNameUtils.replaceClass(c,oldclass+'Disabled',oldclass+'Enabled');
     }
    }else{
     if(d){
      var s=Strtran(Strtran(c.style.backgroundImage,'zoom_enabled','zoom_disabled'),'zoom_calendar_enabled','zoom_calendar_disabled')
      if (s!=c.style.backgroundImage)c.style.backgroundImage=s
     }else{
      var s=Strtran(Strtran(c.style.backgroundImage,'zoom_disabled','zoom_enabled'),'zoom_calendar_disabled','zoom_calendar_enabled')
      if (s!=c.style.backgroundImage)c.style.backgroundImage=s
     }
    }
   }else if (At('_MENU', c.id) != 0){
      if (d){
        LibJavascript.CssClassNameUtils.removeClass(c,'MenuButtonEnabled');
        LibJavascript.CssClassNameUtils.addClass(c,'MenuButtonDisabled');
      }
      else {
        LibJavascript.CssClassNameUtils.addClass(c,'MenuButtonEnabled');
        LibJavascript.CssClassNameUtils.removeClass(c,'MenuButtonDisabled');
      }
   }else if(c.tagName=='TEXTAREA' || (c.tagName=='INPUT' && c.type=='text')){
    if(d){
     LibJavascript.CssClassNameUtils.addClass(c,'Disabled');
     c.tabIndex='-1';
     if(!c.hasAttribute("curTabIndex"))
      c.setAttribute("removeTabIndex",true);
    }else {
     LibJavascript.CssClassNameUtils.removeClass(c,'Disabled');
     if (c.getAttribute("curTabIndex"))
      c.tabIndex=c.getAttribute("curTabIndex");
     else if(c.hasAttribute("removeTabIndex")){
      c.removeAttribute("tabIndex");
      c.removeAttribute("removeTabIndex");
     }
    }
    var c_zoom
    if (c_zoom=Ctrl(c.id+'_ZOOM'))
      if (Left(c_zoom.className,19)!='MultiLanguageButton')
        SetDisabled(c_zoom,d);
   }else if(c.tagName=='SELECT'){
    c.style.cssText=c.style.cssText
    if(d){
     LibJavascript.CssClassNameUtils.addClass(c,'Disabled');
     c.tabIndex='-1';
     if(!c.hasAttribute("curTabIndex"))
      c.setAttribute("removeTabIndex",true);
    }else {
     LibJavascript.CssClassNameUtils.removeClass(c,'Disabled');
     if (c.getAttribute("curTabIndex"))
      c.tabIndex=c.getAttribute("curTabIndex");
     else if(c.hasAttribute("removeTabIndex")){
      c.removeAttribute("tabIndex");
      c.removeAttribute("removeTabIndex");
     }
    }
   }else if(c.tagName=='IMG') {
    if(d){
     c.tabIndex='-1';
     if(!c.hasAttribute("curTabIndex"))
      c.setAttribute("removeTabIndex",true);
    }else {
     if (c.getAttribute("curTabIndex"))
      c.tabIndex=c.getAttribute("curTabIndex");
     else if(c.hasAttribute("removeTabIndex")){
      c.removeAttribute("tabIndex");
      c.removeAttribute("removeTabIndex");
     }
    }
   }else{
    LibJavascript.Array.forEach(GetRadios(c),function(r){
      r.disabled = d;
    });
   }
  }else{for(var i=0;i<c.length;i++) c[i].disabled=d}
 }
}
function SetObligatory(c,o) {
 if (c!=null) {
  var p = (c.tagName=='SELECT' && c.parentNode.tagName=='SPAN' && LibJavascript.CssClassNameUtils.hasClass(c.parentNode,'select_container') ? c.parentNode : null );
  if(o){
   LibJavascript.CssClassNameUtils.addClass(c,'Obligatory');
   if (p)
    LibJavascript.CssClassNameUtils.addClass(p,'Obligatory');
  }else {
   LibJavascript.CssClassNameUtils.removeClass(c,'Obligatory');
   if (p)
    LibJavascript.CssClassNameUtils.removeClass(p,'Obligatory');
  }
 }
}
function IsWndAccessible(op) {
if(typeof op=='string'){op=Ctrl(op);if(op)op=op.contentWindow}
try{
return op!=null && op._avoidleak()==undefined
}catch(e){
return false
}finally{
IsWndAccessible.w=op
}
}
function SetWindowPreferredSize(reduce,autoCenter) {
  if(IsInModalLayer())
    return;
  //Il parametro reduce indica se la funzione dovrebbe anche diminuire la dimensione della finestra
  var entityWidth=m_nPreferredWidth+22;
  var frm = Ctrl('FrmMain');
  if ( frm && frm.querySelectorAll('div.sidebar') ) {
    var tmp_sidebar = document.createElement('div');
    tmp_sidebar.className='sidebar';
    document.body.appendChild(tmp_sidebar);
    entityWidth+=tmp_sidebar.offsetWidth;
    entityWidth+=parseInt(LibJavascript.DOM.getComputedStyle(tmp_sidebar,'marginLeft'))
    entityWidth+=parseInt(LibJavascript.DOM.getComputedStyle(tmp_sidebar,'marginRight'))
    document.body.removeChild(tmp_sidebar);
  }
  var tbTD=Ctrl("toolbarTD"), portlets, i;
  if (!Empty(tbTD.innerHTML)) {
    if ('ZtVWeb' in window) { //cerco se contiene un portlet
      portlets = tbTD.querySelectorAll('div[portlet_id]');
      for (i=0;i<portlets.length;i++) {
        var ptlObj=window[portlets[i].getAttribute('portlet_id')];
        if (ptlObj) {
          entityWidth=Max(entityWidth,ptlObj.width+5);
        }
      }
    } else {
      entityWidth=Max(entityWidth,tbTD.offsetWidth+5);
    }
  }
  var titTD=Ctrl("titleTD");
  if (!Empty(titTD.innerHTML)) {
    if ('ZtVWeb' in window) { //cerco se contiene un portlet
      portlets = titTD.querySelectorAll('div[portlet_id]');
      for (i=0;i<portlets.length;i++) {
        var ptlObj=window[portlets[i].getAttribute('portlet_id')];
        if (ptlObj) {
          entityWidth=Max(entityWidth,ptlObj.width+5);
        }
      }
    } else {
      entityWidth=Max(entityWidth,titTD.offsetWidth+5);
    }
  }
  var tbHeight=Ctrl("toolbarTR")?Ctrl("toolbarTR").offsetHeight:0;
  var titHeight=titTD?titTD.offsetHeight+2:0;
  var tabStripHeight=Ctrl('tabsContainer')==null ? 0 : Ctrl('tabsContainer').offsetHeight+2;
  var nWidth=parent.document.body.offsetWidth+20;
  var nHeight=document.body.offsetHeight,resz=function(h){try{parent.window.resizeTo(nWidth, h?parent.document.body.offsetHeight:nHeight)}catch(e){}}
  if(reduce==null) reduce=false;
  if(autoCenter==null) autoCenter=false;
  if(Max(m_nPreferredWidth,entityWidth)>nWidth || reduce){
    nWidth=Max(m_nPreferredWidth,entityWidth)+12;
    if(SPTheme.sv_WindowMinWidth) nWidth=Max(nWidth,SPTheme.sv_WindowMinWidth)
    resz(1)
  }
  if(m_nPreferredHeight>nHeight || reduce){
    nHeight=Max(m_nPreferredHeight+titHeight+tbHeight+tabStripHeight+100+(parent.document.body.offsetHeight-document.body.offsetHeight),200);
    if(SPTheme.sv_WindowMinHeight) nHeight=Max(nHeight,SPTheme.sv_WindowMinHeight)
    resz()
  }
  if(autoCenter){
    moveTo((screen.availWidth-nWidth)/2>0 ? (screen.availWidth-nWidth)/2 : 0, (screen.availHeight-nHeight)/2>0 ? (screen.availHeight-nHeight)/2 : 0);
  }
}
function GetWindowPreferredSize(){
 var tbWidth=Ctrl("toolbarTR")?Ctrl("toolbarTR").offsetWidth+5:0;
 var tbHeight=Ctrl("toolbarTR")?Ctrl("toolbarTR").offsetHeight:0;
 var titHeight=Ctrl("titleTD")?Ctrl("titleTD").offsetHeight+2:0;
 var frm = Ctrl('FrmMain');
 var sidebarWidth=0;
 if ( frm && frm.querySelectorAll('div.sidebar') ) {
  var tmp_sidebar = document.createElement('div');
  tmp_sidebar.className='sidebar';
  document.body.appendChild(tmp_sidebar);
  sidebarWidth+=tmp_sidebar.offsetWidth;
  sidebarWidth+=parseInt(LibJavascript.DOM.getComputedStyle(tmp_sidebar,'marginLeft'));
  sidebarWidth+=parseInt(LibJavascript.DOM.getComputedStyle(tmp_sidebar,'marginRight'));
  document.body.removeChild(tmp_sidebar);
 }
 return {h:m_nPreferredHeight+titHeight+tbHeight,w:Max(m_nPreferredWidth+sidebarWidth+20,tbWidth)+12}
}
function CalculateAndResizeEntityHeight(node,action){
 var page_div;
 if (!IsMobile()) {
  if(node){
   page_div=node.parentNode;
   while(page_div!=null && Left(page_div.id,5)!='page_'){
    page_div=page_div.parentNode;
   }
   if(page_div!=null && Left(page_div.id,5)=='page_' && action){ //alla chiusura di una zona collassabile, cambio alzezza page per non bloccare il resize del body
    if(action=='open'){
     page_div.style.overflow='hidden'; //un trucco per poter misurare l'altezza in firefox
     page_div.style.height='';
     page_div.style.height=page_div.scrollHeight+"px";
     page_div.style.overflow='';
    }
    else if(action=='close') {
     if (node.getAttribute('band_height')) {
      page_div.style.height=Max(Min(page_div.offsetHeight-node.getAttribute('band_height'),page_div.offsetHeight-parseInt(node.style.height)),0)+"px";
     } else {
      page_div.style.overflow='hidden'; //un trucco per poter misurare l'altezza in firefox
      page_div.style.height='';
      page_div.style.height=page_div.scrollHeight+"px";
      page_div.style.overflow='';
     }
    }
   }
  } else {
   if(typeof(m_cSelectedPage)!= 'undefined'){
    if (page_div=Ctrl(m_cSelectedPage)) {
     page_div.style.overflow='hidden'; //un trucco per poter misurare l'altezza in firefox
     page_div.style.height='';
     page_div.style.height=page_div.scrollHeight+"px";
     page_div.style.overflow='';
    }
   }
  }
 }
 var c;
 if(c=Ctrl("FrmMain")){
  if(c.offsetHeight>0){
   var eltop = document.createElement('div');
   eltop.style.height='1px';
   c.insertBefore(eltop ,c.firstChild);
   var elbottom = document.createElement('div');
   elbottom.style.height='1px';
   c.appendChild(elbottom);
   c.style.height='auto';
   m_nPreferredHeight=c.offsetHeight-2;
   c.style.height='';
   c.removeChild(eltop);
   c.removeChild(elbottom);
  }
 }
 try {
  if(window!=window.parent && window.parent.resizeIframe)
   window.parent.resizeIframe(window.name);
 }catch (e) {}
 if(typeof(adjustWidthAndHeight)!='undefined') {
  adjustWidthAndHeight(false);
 }
 try {
  if(window!=window.parent && window.parent.resizeChildIframe)
   window.parent.resizeChildIframe(window.name);
 }catch (e) {}
}
function resizeChildIframe(frame) {
 if (frame in resizeChildIframe.children) {
  if(Empty(frame)) return;
  if(IsA(frame,'C')){
   if(!Empty(document.getElementsByName(frame)[0]))
    frame=document.getElementsByName(frame)[0];
   else
    frame=document.getElementById(frame);
  }
  //var isInBox=(Left(frame.parentNode.id,5)!='page_');
  if('m_nPreferredHeight' in window.frames[frame.name]){
   var wps = window.frames[frame.name].GetWindowPreferredSize();
   var childHeight=wps.h;
   if (wps.w>window.document.body.offsetWidth) {
    childHeight=childHeight+20;
   }
   frame.style.height=childHeight+'px';
   if (frame.parentNode.style.height!='')
    frame.parentNode.style.height=childHeight+frame.offsetTop+'px';
   if (frame.parentNode.getAttribute('band_height')) {
    frame.parentNode.setAttribute('band_height',(childHeight+frame.offsetTop));
    if (LibJavascript.UserCanSee(frame))
      effectOpenCloseLayer(frame.parentNode.id,true,null,false,false)
   }
  }
 if(typeof(CalculateAndResizeEntityHeight)!='undefined')
  CalculateAndResizeEntityHeight();
 }
}
resizeChildIframe.children={};
function DoLinkZoom(uid,value){
 if(typeof window.opener.ReportLinkValue!='undefined'){
  window.opener.ReportLinkValue(uid,value);
  window.opener.focus();
  self.close();
 }else{
  alert("Impossibile riportare il valore selezionato");
 }
}
function EntityStatus() {
if(typeof m_cFunction=='undefined'){
return " "
}else switch(m_cFunction){
case 'query':
return "Q"
case 'edit':
return "E"
case 'new':
return "N"
case 'view':
return "V"
case 'dialog':
case 'page':
return "D"
default:
return " "
}
}
function SubmitForm(formaction,url,data) {
var bSubmit=true
if (m_bAlreadySubmitted) {
alert(Translate('MSG_SERVER_DATA'))
return
}
if (typeof m_bFieldsUpdated!='undefined' && m_bFieldsUpdated && formaction!='save') {
bSubmit = window.confirm(Translate('MSG_LEAVE_MOD'))
}
if (!bSubmit)
 return
var l_cOP
if (EntityStatus()=='D')
 l_cOP=m_cOP
var Frm = document.FSender
if (l_cOP && !url)
 url=Frm.action
if (l_cOP)
 url += (At('?',url)>0 ? '&': '?') + 'm_cOP='+l_cOP
if (Frm.StartRow && formaction!='next' && formaction!='previous'
    && (typeof m_bResetOnSave=='undefined' || formaction!='save')) {
Frm.StartRow.value = '1'
Frm.m_nRows.value = '0'
}
if (Frm.m_bQuery && (formaction=='query' || formaction=='save')) {
Frm.m_bQuery.value='true'
}
SubmitForm.SetAction(formaction)
Frm.m_cWv.value=PrepareSubmitData(data)
if (url!=null) {
 SubmitForm.TargetClose(url)
}
Frm.submit()
m_bAlreadySubmitted = true
InstTR()
}
SubmitForm.SetAction=function(a){
var f=document.FSender,w,m_cExtra=JSURL.Extra(f.action+(At('?',f.action)==0?'?':'&')+'m_cAction='+a)
try{
w=f.WorkFlowScript
w.value=a+'\n'+w.value
}catch(e){}
f.m_cAction.value=a
if(m_cExtra)
 f.action+=(At('?',f.action)==0?'?':'&')+'m_c'+'Check='+URLenc(m_cExtra)
}
SubmitForm.TargetClose=function(url){
 var HistPin,HistStep,f,FNameHash,Opener
 if (!(f=CtrlByName('FSender')))
  return
 HistPin=f.action.match(/[\?&]m_HistPin=([0-9]+)/)
 f.action=url||f.action
 if (!f.m_cAtExit || !f.m_cAtExit.value.match(/close(&reload)?/) || HistPin)
  return
 HistPin = HistPin ? HistPin[1] : document.location.toString().match(/[\?&]m_HistPin=([0-9]+)/)
 if(HistPin){
  HistPin = HistPin[1]
 }else{
  HistPin = history.length - (history.length > 1 ? 1 : 0)
  HistPin -= (document.location.toString().match(/[\?&]m_cParameterCache=/) && history.length>2) ? 1 : 0
 }
 HistStep = document.location.toString().match(/[\?&]m_HistStep=([0-9]+)/)
 HistStep = (HistStep ? HistStep[1]-0 : 0) + 1
 function hashCode(n){
  var hash = 0, i, char
  if (n.length == 0)
   return hash
  for (i = 0; i < n.length; i++) {
   char = n.charCodeAt(i)
   hash = ((hash<<5)-hash)+char
   hash = hash & hash // Convert to 32bit integer
  }
  return hash
 }
 FNameHash=frameElement&&frameElement.name
 FNameHash=FNameHash?'&m_FNameHash='+hashCode(FNameHash):''
 Opener = document.location.toString().match(/([\?&]m_Opener=[0-9]+)/)
 Opener = Opener ? Opener[1] : (opener || (history.length==1 && document.referrer.length)?'&m_Opener=1':'')
 f.action+=(At('?',f.action)==0?'?':'&')+'m_HistPin='+HistPin+'&m_HistStep='+HistStep+FNameHash+Opener
}
if(window.addEventListener){
 window.addEventListener("load",function(){SubmitForm.TargetClose()},true)
}else if(window.attachEvent){
 window.attachEvent("onload",function(){SubmitForm.TargetClose()})
}
function PrepareSubmitData(data) {
FillWv()
if (data!=null) {
WvApplet().Append(data)
}
return WvApplet().asString()
}
function SetWindowObject(needsregionalsettings) {
var f=NameForCaller()
if (IsWndAccessible(window[f])) {
l_oWnd=new Function('v,d','return typeof '+f+'[v] == \'undefined\' ? d : '+f+'[v]')
if (Ne(typeof(window[f].FrmMain),'undefined')) {
if (needsregionalsettings) {
if (Ne(typeof(window[f].FSender),'undefined') && Ne(typeof(window[f].FSender.m_cRegionalSettings),'undefined')) {
l_oWv.setValue('m_cRegionalSettings',window[f].FSender.m_cRegionalSettings.value)
}
}
}
} else {
l_oWnd=new Function('v,d','return d')
}
}
function NameForCaller() {
var f='opener'
if (IsInModalLayer() && 'caller' in window){
f='caller'
} else if(IsInModalLayer()) {
f='m_Caller_'+window.frameElement.id
window[f]=window.parent.spModalLayer[window.frameElement.id].getOpenerRef()
} else if (IsWndAccessible(window.opener)) {
} else if (IsWndAccessible(window.parent)) {
f='parent'
}
return f
}
function IsDisabledByStateDriver(id,detail){
return IsDisabledByStateDriver.isInArr(['m_aStateDisabledFields','m_aStateDisabledTabs','m_aStateDisabledBoxes'],id) ||
       IsInDisabledPages(id,detail)
}
IsDisabledByStateDriver.isInArr=function(a,id){
for(var i=0;i<a.length;i++) if(window[a[i]] && LibJavascript.Array.indexOf(window[a[i]],id)!=-1) {
return true
}
return false
}
function IsHiddenByStateDriver(id){
return IsDisabledByStateDriver.isInArr(['m_aStateHiddenFields','m_aStateHiddenTabs','m_aStateHiddenBoxes'],id)
}
function IsObligatoryByStateDriver(id){
  return IsDisabledByStateDriver.isInArr(['m_aStateObligatoryItems'],id)
}
function DisableInputsInContainer(container,disable){
 container=typeof(container)=='string'?Ctrl(container):container;
 var children=container!=null?container.childNodes:new Array();
 var itm;
 for(var i=0;i<children.length;i++){
  itm=children.item(i);
  switch(itm.tagName){
   case 'INPUT':
   case 'TEXTAREA':
   case 'SELECT':
    SetDisabled(itm,disable);
    break;
   case 'DIV': case 'SPAN':
    DisableInputsInContainer(itm,disable);
    break;
   case 'TABLE':
    DisableInputsInTable(itm,disable);
    break;
   default:
    //alert(itm.tagName+' '+itm.id)
  }
 }
}
function DisableInputsInTable(table,disable){
 table=typeof(table)=='string'?Ctrl(table):table;
 var i,ii;
 for(i=0;i<table.rows.length;i++){
  for(ii=0;ii<table.rows[i].cells.length;ii++){
   DisableInputsInContainer(table.rows[i].cells[ii],disable);
  }
 }
}
function DisplayErrorMessageOfChild(p_cErrorInChild) {
//nome del metodo generato nel _edit delle entita'
 window['DisplayErrorMessage_'+p_cErrorInChild]();
}
function TransferBetweenWindows(srcWnd,sourceName,varName,funcName,dontcheck) {
var o=srcWnd[sourceName]
try{
//o potrebbe essere garbage collected in seguito, inoltre potrebbe essere o.constructor!=Date
o=new Date(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds(),o.getMilliseconds())
}catch(notDate){}
if(dontcheck==null||Ne(window[varName],o)){
 if(funcName!=null){
  window[funcName](o)
 }else{
  window[varName]=o
 }
 return true
}
return false
}
function _CopyCallers(v){
 var n,i,f
 if (IsInModalLayer()) {
  f=NameForCaller()
 } else {
  f='opener'
 }
 if(IsWndAccessible(window[f])){
  for(i=0;i<v.length;i++){
   n='w_'+v[i]
   if (eval('Empty('+n+') && Ne('+f+'.'+n+',null)')) {
    TransferBetweenWindows(window[f],n,n)
   }
  }
 }
}
function CopyWorkVar(dest,dstNames,srcNames,checkDep) {
var mustUpdate=false,srcName,dstName,destRow
if (typeof dest.TrsRow != "undefined")
 destRow=dest.TrsRowSample()
for(var i=0; i<srcNames.length; i++) {
 srcName=srcNames[i]
 if (!checkDep || Ne(window['o_'+srcName],window['w_'+srcName])) {
  dstName=dstNames[i]
  if (dest['Set_'+dstName] != null) {
   mustUpdate = dest.TransferBetweenWindows(window,'w_'+srcName,'w_'+dstName,'Set_'+dstName,1) ? false : mustUpdate
  } else if (dest.TransferBetweenWindows(window,'w_'+srcName,'w_'+dstName,null,1)) {
   dest.SetModified(destRow!=null && typeof destRow[dstName]!="undefined")
   mustUpdate=true
  }
 }
}
if(mustUpdate)
 dest.DoUpdate(true)
}
function TrsRowSample() {
return new TrsRow(2)
}
function ChildToLoad(idOrW){
return !IsWndAccessible(idOrW)||(IsWndAccessible.w.location!=null&&IsWndAccessible.w.location.href=='javascript:[].join()')||typeof(IsWndAccessible.w._IAmReady)=='undefined'||!IsWndAccessible.w._IAmReady
}
function AdjustFontSize(){
 var i,j,styleSheetRules,currentFontSize,currentFontSizeNum,currentDimension,formCss,currentRule,sample,themeSize,formSize,dpi_controller, resizeDPI, computed={}, scale, trigger, old, l_cProgName
 try {
  document.querySelector('BODY:not([nonexistentattribute])')
  old=false
 } catch (oldBrowser) {
  old=true
 }
 if(document.styleSheets) try {
  dpi_controller = Ctrl('dpi_controller')
  if (dpi_controller) {
   trigger = dpi_controller.clientHeight / (IsMozilla() ? 14 : 13)
   resizeDPI = trigger > 1
  } else {
   resizeDPI = false
  }
  formSize=themeSize=0
  formCss=false
  l_cProgName = window.m_cProgName || Zoom.p
  for(i=0;i<document.styleSheets.length && (resizeDPI || !formCss);i++){
   styleSheetRules=document.styleSheets[i]
   if (!styleSheetRules.href) {
    formCss = false
   } else if (At('/'+l_cProgName+'.css',styleSheetRules.href) > 0) {
    formCss = true
   } else {
    formCss = At('/'+ Substr(l_cProgName, 1, RAt('_',l_cProgName,1) - 1) +'.css',styleSheetRules.href) > 0
   }
   if (!formCss && !resizeDPI) {
    continue
   } else try {
    styleSheetRules = styleSheetRules.cssRules || styleSheetRules.rules
   }
   catch(importCss) {
    continue
   }
   if (!styleSheetRules)
    continue
   AdjustFontSize.run=true
   for(j=0;j<styleSheetRules.length && (resizeDPI || !sample);j++){
    currentRule = styleSheetRules[j]
    currentFontSize = currentRule.style == null ? "" : LRTrim(currentRule.style.fontSize)
    currentFontSizeNum = parseInt(currentFontSize)
    currentDimension = ""
    if(resizeDPI && (Right(currentFontSize,2)=="pt" || Right(currentFontSize,2)=="px")){
     currentDimension=Right(currentFontSize,2)
     if(currentFontSizeNum>2) {
      scale=currentFontSizeNum / trigger
      scale=computed[scale]
      if (!scale) {
       scale=currentFontSizeNum / trigger
       computed[scale]=LRTrim(Str(scale,4,2))
       scale=computed[scale]
      }
      currentRule.style.fontSize=scale+currentDimension
     }
    }
    if (!formCss) {
    } else if (!sample && Left(currentRule.selectorText,1)=='#' && Right(currentRule.selectorText,4)=='_DIV' && currentFontSize=="" && !old) {
     sample = document.querySelector(currentRule.selectorText+' .SPLabel') || document.querySelector(currentRule.selectorText)
    } else if (currentRule.selectorText!='.FormDefault') {
    } else if (At("px",currentFontSize) > 0) {
     formSize = Val(currentFontSize) * 72 / 96
    } else {
     formSize = Val(currentFontSize)
    }
   }
  }
  if (sample && formSize)
   sample = getComputedStyle(sample).fontSize
  else
   sample = null
  if (!sample || formSize==0) {
  } else if (At("px",sample) > 0) {
   themeSize = Val(sample) * 72 / 96
  } else {
   themeSize = Val(sample)
  }
  if (Round(themeSize,2) >= formSize + 1) {
   document.body.setAttribute('ettl','yes')
  } else if(old) {
   document.body.setAttribute('ettl','old')
   document.body.style.cssText=document.body.style.cssText
  }
 }
 catch(e) {
  console.log('AdjustFontSize:'+e)
  if (old) {
   document.body.setAttribute('ettl','old')
   document.body.style.cssText=document.body.style.cssText
  }
 }
}
AdjustFontSize.run=false
LibJavascript.Events.addEvent(window,'load', function() {
  if (typeof m_cProgName != 'undefined' && !AdjustFontSize.run)
   AdjustFontSize()
 }
)
function DisableUI(){
var i,j,k,c,a
if(typeof m_aStateDisabledFields!='undefined') DisableFields(m_aStateDisabledFields);
if(typeof m_aStateDisabledTabs!='undefined'){for(i=0; i<m_aStateDisabledTabs.length; i++)tabs.SetDisable(m_aStateDisabledTabs[i],true)}
if(typeof m_aStateObligatoryItems!='undefined')for(i=0;i<m_aStateObligatoryItems.length;i++){
c=CtrlByName(m_aStateObligatoryItems[i])
if (!c && _ObliD[m_aStateObligatoryItems[i]] && _ObliD[m_aStateObligatoryItems[i]].length>0)
 c = Ctrl(_ObliD[m_aStateObligatoryItems[i]][0].scriptid)
if(c){
a=_ObliD[m_aStateObligatoryItems[i]]
for(j=0;j<a.length;j++){
a[j].on=true
if(CtrlByName(m_aStateObligatoryItems[i])) {
 if(!c.length)c=[c]
 for(k=0;k<c.length;k++)LibJavascript.CssClassNameUtils.addClass(c[k],"Obligatory")
}
}
}else{
a=_ObliD[m_aStateObligatoryItems[i]]
for(k=0;k<a.length;k++)a[k].txt_error=m_aStateObligatoryItems[i]
}
}
}
function HideUI(){
var i,l,j
if(typeof m_aStateHiddenFields!='undefined')for(i=0;i<m_aStateHiddenFields.length;i++){
if (CtrlByName(m_aStateHiddenFields[i])) {
 SetDisplay(CtrlByName(m_aStateHiddenFields[i]),true)
} else if (_ObliD[m_aStateHiddenFields[i]] && _ObliD[m_aStateHiddenFields[i]].length>0) {
 SetDisplay(_ObliD[m_aStateHiddenFields[i]][0].scriptid+'_DIV',true)
}
l=HideUI.lblids[m_aStateHiddenFields[i]]
if(l)for(j=0;j<l.length;j++)SetDisplay(l[j],true)
}
if(typeof m_aStateHiddenTabs!='undefined'){
for(i=0;i<m_aStateHiddenTabs.length;i++)
if(tabs.Exists(m_aStateHiddenTabs[i]))SetDisplay(tabs.GetTabstripID(m_aStateHiddenTabs[i]),true)
}
}
HideUI.lblids={}
function DisableFields(fields){
 var i,c
 for (i=0; i<fields.length; i++){
  c=fields[i]
  if(!Ctrl(c) && !CtrlByName(c) && _ObliD[c] && _ObliD[c].length>0)
   c=_ObliD[c][0].scriptid
  SetDisabled(c,true)
 }
}
function DisablePages(pages){
  for (var i=0; i<pages.length; i++){
    DisableInputsInContainer(pages[i],true)
  }
}
function ExpandCollapsibleBox(id,cond){
 if(cond && Ctrl(id).getAttribute('status')=='close') ToggleCollapsibleBox(id,true);
}
function CollapseCollapsibleBox(id,cond){
 if(cond && Ctrl(id).getAttribute('status')=='open') ToggleCollapsibleBox(id,false);
}
function ToggleCollapsibleBox(id,expand,calculateContainerHeight,useEffect){
 if (id+"_filters_toggle_Click" in window){ // chiamata definita nelle maschere vdm
   window[id+"_filters_toggle_Click"](id);
   return;
 }
 var c=ToggleCollapsibleBox.children[id]||[],i,div=Ctrl(id);
 if(typeof(expand)=='undefined'){
  expand=div.style.display=='none';
 }
 if(typeof(calculateContainerHeight)=='undefined'){
  calculateContainerHeight=true;
 }
 if(typeof(useEffect)=='undefined'){
  useEffect=true;
 }
 if(expand){
  LibJavascript.CssClassNameUtils.removeClass( div.parentNode, 'SPSection_collapsed');
  LibJavascript.CssClassNameUtils.addClass( div.parentNode, 'SPSection_expanded');
  div.style.display='';
  if(div.offsetHeight>0) div.style.height=0;
  effectOpenCloseLayer(id,true,0,calculateContainerHeight,useEffect);
  c=GuessIsVisible(div)?c:[]
  LibJavascript.Array.forEach(c,function(e){
   if((typeof tabs=='undefined'||tabs.IsExpanded(ControlPage(Ctrl(e)))) && ChildToLoad(e) && Ctrl(e).src!=linkpc_url(e)){
    ChangeIframeSrcWithoutPushingHistory(e,linkpc_url(e))
   }
   if(Ctrl(e).contentWindow.adjustWidthAndHeight){
    setTimeout(Ctrl(e).contentWindow.adjustWidthAndHeight,0)
   }
  })
 }else{
  LibJavascript.CssClassNameUtils.removeClass( div.parentNode, 'SPSection_expanded');
  LibJavascript.CssClassNameUtils.addClass( div.parentNode, 'SPSection_collapsed');
  if(!HideLayerBox.syncChildren(c,div.id))
   return
  effectOpenCloseLayer(id,false,0,calculateContainerHeight,useEffect);
 }
}
ToggleCollapsibleBox.children={}
function effectOpenCloseLayer(id,open,counter,calculateContainerHeight,useEffect){
 var div=Ctrl(id),img;
 var dheight=20, vrefresh=20;
 if(div!=null){
  if(open){
   var limit = div.getAttribute('band_height') || div.scrollHeight;
   var c;
   if(c=Ctrl("bodyDiv")) c.style.overflow='hidden';
   if(!useEffect || counter==20 || div.offsetHeight+dheight>=limit){
    if (div.getAttribute('band_height')!=null)
     div.style.height=div.getAttribute('band_height')+'px';
    else
     div.style.height='';
    if(img=Ctrl(id+"_HEADER_ICON"))
     img.src=Strtran(img.src,"box_expand","box_collapse");
    if(c=Ctrl("bodyDiv")) c.style.overflow='auto';
    div.setAttribute('status','open');
    HideControlsUnderCondition();//Prova per fa vedere un gruppo se l'altro e' aperto
    calculateSidebarBandsPosition(ControlPage(div));
    if(calculateContainerHeight || !useEffect)
      CalculateAndResizeEntityHeight(div,'open');
    if( LibJavascript.scrollStackObj )
      LibJavascript.scrollStackObj.refreshActiveScroll(100);
    return;
   }
   div.style.height=(div.offsetHeight+dheight)+"px";
  }else{
   if(!useEffect || counter==20 || div.offsetHeight-dheight<=0){
    if(div.getAttribute('band_height')!=null)div.style.height='0px';
    else div.style.height='';
    div.style.display='none';
    if(img=Ctrl(id+"_HEADER_ICON"))
     img.src=Strtran(img.src,"box_collapse","box_expand");
    div.setAttribute('status','close');
    HideControlsUnderCondition();//Prova per fa vedere un gruppo se l'altro e' aperto
    calculateSidebarBandsPosition(ControlPage(div));
    if(calculateContainerHeight)
     CalculateAndResizeEntityHeight(div,'close');
    else if(!useEffect)
      CalculateAndResizeEntityHeight();
    if( LibJavascript.scrollStackObj )
      LibJavascript.scrollStackObj.refreshActiveScroll(100);
    return;
   }
   div.style.height=Math.max(div.offsetHeight-dheight,0)+"px";
  }
  if(div.style.display!='none' && div.style.height!=div.getAttribute('band_height'))
   setTimeout("effectOpenCloseLayer('"+id+"',"+open+","+(counter+1)+","+calculateContainerHeight+","+useEffect+")",vrefresh);
  }
  if( LibJavascript.scrollStackObj ){
    LibJavascript.scrollStackObj.refreshActiveScroll(100);
  }
}
var timeout_id_showlayer=null;
var timeout_id_hidelayer=null;
var open_layer_ref=null;
var layer_opener_ref=null;
function SetEventShowLayer (p_oCtrl,p_fEvtHandler) {
  p_oCtrl && ( p_oCtrl[ ( IsMobile() ? 'onclick' : 'onmouseover') ] = p_fEvtHandler );
}
function SetEventHideLayer(p_oCtrl,p_fEvtHandler) {
  p_oCtrl && ( p_oCtrl[ ( IsMobile() ? 'onclick' : 'onmouseout') ] = p_fEvtHandler );
}
function ToggleLayerBoxGroup(id,box,container) {
 var ctrl,old_layer=layer_opener_ref;
 if(typeof(box)=="string")box=Ctrl(box)
 if(typeof(id)=="string") ctrl=Ctrl(id);
 if(typeof(container)=="string") container=Ctrl(container);
 var status=container.getAttribute('pin_status');
 var position=container.getAttribute('layer_position');
 ClearTimeout('hide');
 ShowLayerBox(ctrl,box,position||'00',false,container,'',true,'toggle');
 HideLayerBox(container,false);
 SetPinLayerBox(Left(box.id,10),status);
}
function ToggleLayerBox(ctrl,box,position,detail,container,container_header,container_ref){
 if(typeof(box)=="string")box=Ctrl(box)
 if(typeof(ctrl)=="string") {
  var c=Ctrl(ctrl);
  if (detail && c==null) { //elementi in griglia detail in view non hanno id
   if (document.getElementsByClassName)
    c=Ctrl('GridTable').rows[m_nCurrentRow].getElementsByClassName(ctrl);
   else//<=IE8
    c=Ctrl('GridTable').rows[m_nCurrentRow].querySelectorAll('.'+ctrl);
   if (c && c[0])
    ctrl=c[0];
  } else {
   ctrl=c;
  }
 }
 if(!Empty(ctrl) && ControlPage(ctrl)!=ControlPage(box)){
  if(!(box.getAttribute('status')=='close' || box.getAttribute('status')==null)){
    box.setAttribute('open_mode','toggle');
    HideLayerBox(box,true);
  }
 }
 if(box.getAttribute('status')=='close' || box.getAttribute('status')==null){
  ShowLayerBox(ctrl,box,position,detail,container,container_header,container_ref,'toggle');
 }
 else {
  if(box.getAttribute('open_mode')=='focus'){
   box.setAttribute('open_mode','toggle');
   box.setAttribute('close_on_out','no');
  }
  else {
  HideLayerBox(box,true);
  layer_opener_ref=null;
  }
 }
}
ToggleLayerBox.children={}
function ShowLayerBoxWithDelay(ctrl,box,position,detail,container,container_header,container_ref,mode,delay){
 if(typeof(delay)=='undefined' || delay==0)
  ShowLayerBox(ctrl,box,position,detail,container,container_header,container_ref,mode);
 else {
  //la variabile ctrl potrebbe essere un oggetto se si trova nelle righe del detail (in query) in quanto non ha id
  if(typeof(ctrl)=="object"){
   layer_opener_ref=ctrl;
  }
  timeout_id_showlayer=window.setTimeout("ShowLayerBox("+(typeof(ctrl)=="string"?"'"+ctrl+"'":"layer_opener_ref")+",'"+box+"','"+position+"',"+detail+",'"+container+"','"+container_header+"',"+container_ref+",'"+mode+"');",delay);
 }
}
function ShowLayerBox(ctrl,box,position,detail,container,container_header,container_ref,mode){
 var checkPage=!Empty(ctrl),i,c
 if(typeof(box)=="string") box=Ctrl(box);
 if(typeof(ctrl)=="string") {
  c=Ctrl(ctrl);
  if (detail && c==null) { //elementi in griglia detail in view non hanno id
   if (document.getElementsByClassName)
    c=Ctrl('GridTable').rows[m_nCurrentRow].getElementsByClassName(ctrl);
   else//<=IE8
    c=Ctrl('GridTable').rows[m_nCurrentRow].querySelectorAll('.'+ctrl);
   if (c && c[0])
    ctrl=c[0];
  } else {
   ctrl=c;
  }
  if(layer_opener_ref==ctrl) return;
 }
 if(IsA(ctrl,'A')){
  if(ctrl.length>0 && typeof(ctrl[0])=="string") ctrl[0]=Ctrl(ctrl[0]);
  else checkPage=false;
 }

 c=ToggleLayerBox.children[box.id];
 for(i=0;c && i<c.length;i++){
  if((typeof tabs=='undefined'||tabs.IsExpanded(ControlPage(Ctrl(c[i]))))&&ChildToLoad(c[i])){
   ChangeIframeSrcWithoutPushingHistory(c[i],linkpc_url(c[i]));
  }else{
   LoadContext(IsRepeatedChild(c[i]),c[i])
  }
  if(Ctrl(c[i]).contentWindow.adjustWidthAndHeight){
   setTimeout(Ctrl(c[i]).contentWindow.adjustWidthAndHeight,0)
   LibJavascript.RefreshChildGrid(c[i])
  }
 }

 if(checkPage && ControlPage(ctrl)!=ControlPage(box)){
  if(!(box.getAttribute('status')=='close' || box.getAttribute('status')==null)){
    box.setAttribute('open_mode','toggle');
    HideLayerBox(box,true);
  }
  LibJavascript.DOM.addNode(ControlPage(ctrl),box);
 }

 if(box.getAttribute('status')=='close' || box.getAttribute('status')==null){
  if ( !IsMobile() ) {
    var container_pos;
    if (container_ref) {
      if(typeof(container)=="string") container=Ctrl(container);
      container_pos = LibJavascript.DOM.getPosFromFirstRel(container,box);
      if (position.charAt(0)=='1') { //allineamento a destra
        container_pos.x += container.offsetWidth;
      }
      // if (position.charAt(1)=='1') { //allineamento in basso
        // container_pos.y += container.offsetHeight;
      // }
    }
  } else {
    if ( container_ref ) {
      if ( IsA(container,'C') ) container = Ctrl(container);
      LibJavascript.DOM.insertElement(container.parentNode, LibJavascript.DOM.indexOfElement(container.parentNode, container), box);
    } else {
      var node = ctrl;
      do {
        node = node.parentNode;
      } while ( node && !LibJavascript.CssClassNameUtils.hasClass(node,"tabuled") );
      if (node && node.parentNode) {
        LibJavascript.DOM.insertElement(node.parentNode, LibJavascript.DOM.indexOfElement(node.parentNode, node)+1, box);
      }
    }
  }
  if(open_layer_ref!=null){
   ClearTimeout('hide');
   if (!HideLayerBox(open_layer_ref,true))
    return
   open_layer_ref=null;
  }
  box.style.display=IsMobile()?'':'block';
  if( !IsMobile() ){
    if(container_ref){
     if (position.charAt(0)=='1') { //allineamento a destra
      container_pos.x -= box.offsetWidth;
     }
     // if (position.charAt(1)=='1') { //allineamento in basso
      // container_pos.y -= box.offsetHeight;
     // }
     box.style.left=container_pos.x+"px";
     box.style.top=container_pos.y+"px";
    } else {
     var pos;
     function appendContainerGap() {
      var c;
      if(!Empty(container)){
       if(typeof(container)=="string") container=Ctrl(container);
       pos.x+=container.offsetLeft;
       pos.y+=container.offsetTop;
       if(!Empty(container_header)){
        if (c=Ctrl(container_header)) //l'header potrebbe non esserci
         pos.y+=c.offsetHeight;
       }
      }
      if(detail){
       var parentRow=ctrl;
       do {
        parentRow=parentRow.parentNode;
       }
       while(parentRow.tagName!="DIV")
       pos.x+=Ctrl("GridTable_Container").offsetLeft;
       pos.x+=Ctrl("GridTable_Container").offsetTop+parentRow.offsetTop-Ctrl("GridTable_DIV").scrollTop;
      }
     }
     if (Empty(ctrl)) {
      pos = {x:5, y:5};
      appendContainerGap();
     } else if ( ctrl.tagName ) {
      pos = LibJavascript.DOM.getPosFromFirstRel(ctrl,box);
     } else if(IsA(ctrl,'A')) {
      pos = {x:ctrl[1], y:ctrl[2]};
      appendContainerGap();
     } else {
      pos = {x:ctrl.offsetLeft, y:ctrl.offsetTop};
      appendContainerGap();
     }
     switch(position.charAt(0)){
      case '0':box.style.left=pos.x+"px"
      case '-':break
      case 's':box.style.left=Max(pos.x-box.offsetWidth,0)+"px"; break;
      default:box.style.left=Max(pos.x-box.offsetWidth+ctrl.offsetWidth,0)+"px"
     }
     switch(position.charAt(1)){
      case '0':box.style.top=(pos.y+ctrl.offsetHeight+1)+"px"
      case '-':break
      case 's':box.style.top=(pos.y)+"px";break;
      default:box.style.top=(Max(pos.y-box.offsetHeight,0))+"px"
     }
     if (position=='ss') position='10';
    }
    var page_div=box.parentNode;
    while(Left(page_div.id,5)!='page_'){
     page_div=page_div.parentNode;
    }
    if(Left(page_div.id,5)=='page_'){
     if(page_div.offsetHeight<box.offsetHeight+box.offsetTop){
      page_div.style.height=(box.offsetHeight+box.offsetTop+20)+"px";
      CalculateAndResizeEntityHeight();
     }
    }
  }
  //Se il layer e' stato chiuso con il pin, lo tolgo
  //if(box.getAttribute('pin_status')=='pinned') UnpinLayerBox(Left(box.id,Len(box.id)-4));
  //layer aperto in sidebar
  box.setAttribute('layer_position',position);
  box.setAttribute('status','open');
  box.setAttribute('open_mode',mode);
  if(mode=='focus') box.setAttribute('close_on_out','yes');
  else if(mode=='toggle') box.setAttribute('close_on_out','no');
  if(mode=='focus' || mode=='toggle'){
   FocusLayerFirstComponent(box.id); //sta facendo ricorsione, da vedere
   layer_opener_ref=ctrl;
  }
  if ( !IsMobile() ) {
    box.style.height=box.style.height;
  }
  open_layer_ref=box;
 }
 else if(timeout_id_hidelayer!=null){
  ClearTimeout('hide');
 }
}
function HideLayerBoxWithDelay(box,delay){
 ClearTimeout('show');
 if (i_last_focused_item != null) {
  var c;
  if (ToggleLayerBox.children[box]) { //potrebbe essere in un figlio
   for (i = 0; i < ToggleLayerBox.children[box].length; i++) {
    c = Ctrl(ToggleLayerBox.children[box][i]);
    if (c && 'child_' + c.name == i_last_focused_item) {
     break;
    } else {
     c = null;
    }
   }
  }
  if (!c) { //potrebbe essere un campo normale
   c = Ctrl(i_last_focused_item);
  }
  var c_box = Ctrl(box);
  while (c && c.tagName.toLowerCase() != 'body') {
   if (c == c_box) {
    return;
   }
   c = c.parentNode;
  }
 }
 if(Ctrl(box).getAttribute('close_on_out')=='no') return;
 if(Ctrl(box).getAttribute('status')=='open' && Ctrl(box).getAttribute('pin_status')!='pinned'){
  if(delay>0){
   timeout_id_hidelayer=window.setTimeout("HideLayerBox(Ctrl('"+box+"'),true)",delay);
  }
  else HideLayerBox(box,true);
 }
}
function HideLayerBox(box,check_pin){
 if(typeof(box)=="string") box=Ctrl(box);
 var layerId=Left(box.id,10)
 if ('closeContextMenu_'+layerId in window)
   window['closeContextMenu_'+layerId]();
 if(!HideLayerBox.syncChildren(ToggleLayerBox.children[box.id],box.id))
   return false
 if(box.getAttribute('status')=='open' && (!check_pin || box.getAttribute('pin_status')!='pinned')){
  var r = true;
  if (i_last_focused_item!=null && ( Eq(m_cFunction,'new') || Eq(m_cFunction,'edit') ) && box.querySelector("#"+i_last_focused_item)!=null) {
    r = CheckZone(); //Se chiudo il layer e l'elemento corrente era dentro al layer stesso chiamo la checkzone definendo che non c'e' nessun item corrente
    if (r) {// se la checkzone e' andata a buon fine posso nullare l'elemento corrente selezionato
      i_last_focused_item=null;
    } else {
      DisplayErrorMessage();
    }
  }
  if (r) { // se la CheckZone non e' risultata positiva non posso chiudere il layer
  box.style.display='none';
  box.setAttribute('status','close');
  //box.setAttribute('pin_status','unpinned');
  box.removeAttribute('close_on_out');
  open_layer_ref=null;
 }
 }
 return true
}
HideLayerBox.syncChildren=function(c,boxId){
var i,sr,e
if((m_cFunction=='edit' || m_cFunction=='new') && c){
for(i=0;i<c.length;i++){
if(!IsRepeatedChild(c[i])){
if (!ChildToLoad(Ctrl(c[i]).contentWindow))
window['m_cWv_'+Ctrl(c[i]).name]=Ctrl(c[i]).contentWindow.GetContext()
continue
}
if (ChildToLoad(c[i]))
 continue
if(sr==null)
 sr = SaveRow(true)
if(sr){
}else if(!Empty(m_cLastWorkVarError)) {
 e=Ctrl(m_cLastWorkVarError)
} else if(!Empty(m_cErrorInChild)) {
 e=Ctrl(m_cErrorInChild)
}
while(e && e.id != boxId){
 e=e.parentNode
}
if(!sr && e) {
 DisplayErrorMessage()
 return false
} else {
 Ctrl(c[i]).src='javascript:[].join()'
}
}
}
return true
}
function ClearTimeout(type){
 if(typeof(type)=='undefined' || type=='hide'){
  window.clearTimeout(timeout_id_hidelayer);
  timeout_id_hidelayer=null;
 }
 else if(type=='show'){
  window.clearTimeout(timeout_id_showlayer);
  timeout_id_showlayer=null;
 }
}
function FocusLayerOpener(){
 if (layer_opener_ref) {
  if (layer_opener_ref.childNodes && layer_opener_ref.childNodes[0] && layer_opener_ref.childNodes[0].childNodes[0]){
   SetControlFocus(layer_opener_ref.childNodes[0].childNodes[0].id);
  } else if(layer_opener_ref.id){
   SetControlFocus(layer_opener_ref.id);
  }
  if(open_layer_ref.getAttribute('close_on_out')=='yes') {
    open_layer_ref.setAttribute('close_on_out','no');
    HideLayerBox(open_layer_ref,true);
    layer_opener_ref = null;
  }
 }
}
function TogglePinLayerBox(id){
 var box=Ctrl(id+'_DIV');
 if(box.getAttribute('status')=='open'){
  if(box.getAttribute('pin_status')==null || box.getAttribute('pin_status')!='pinned'){
   PinLayerBox(id);
  }
  else if(box.getAttribute('pin_status')=='pinned'){
   UnpinLayerBox(id);
  }
 }
}
function SetPinLayerBox(id,status) {
  if (status=="pinned") PinLayerBox(id);
  else UnpinLayerBox(id);
}
function PinLayerBox(id){
 Ctrl(id+'_DIV').setAttribute('pin_status','pinned');
 if( Ctrl(id+"_HEADER_ICON_PIN"))
  Ctrl(id+"_HEADER_ICON_PIN").src=Strtran(Ctrl(id+"_HEADER_ICON_PIN").src,"box_layer_pin","box_layer_unpin");
 else {
  var image = GetStyleVariable("layerHeaderUnpinImage");
  if( image && image.indexOf('{') > -1 ){
   image = JSON.parse( image );
   Ctrl(id+'_DIV').querySelector(".LayerHeaderIconPin").innerHTML = String.fromCharCode(image.Char);
  }
 }
}
function UnpinLayerBox(id){
 Ctrl(id+'_DIV').setAttribute('pin_status','unpinned');
 if( Ctrl(id+"_HEADER_ICON_PIN"))
  Ctrl(id+"_HEADER_ICON_PIN").src=Strtran(Ctrl(id+"_HEADER_ICON_PIN").src,"box_layer_unpin","box_layer_pin");
 else{
  var image = GetStyleVariable("layerHeaderPinImage");
  if( image && image.indexOf('{') > -1 ){
   image = JSON.parse( image );
   Ctrl(id+'_DIV').querySelector(".LayerHeaderIconPin").innerHTML = String.fromCharCode(image.Char);
  }
 }

 open_layer_ref=Ctrl(id+'_DIV')
}
function dragLayer(e,obj){
 e=e?e:window.event;
 obj=Ctrl(obj);
 if(obj) dragObj.css=obj.style;
 var layerId=Left(obj.id,10)
 if ('closeContextMenu_'+layerId in window)
   window['closeContextMenu_'+layerId]();
 if(obj.getAttribute('status')=='open'){ //Layer
  var aTag=obj;
  var y_delta=0,x_delta=0;
  do {
   aTag=aTag.offsetParent;
   x_delta+=aTag.offsetLeft;
   y_delta+=aTag.offsetTop;
  } while(aTag.tagName!="BODY" && aTag.tagName!="HTML");
  // In caso di finestra scrollata
  if( Ctrl("bodyDiv") && Ctrl("bodyDiv").scrollTop ) {
    y_delta=y_delta-Ctrl("bodyDiv").scrollTop;
  }
  var srcElement=GetEventSrcElement(e);
  dragObj.deltaY=y_delta+srcElement.offsetTop;
  dragObj.deltaX=x_delta+srcElement.offsetLeft;
  dragObj.iW=dragObj.css.width
  dragObj.css.zIndex=++dragObj.zIndex
 }
 if(!e || !dragObj.css) return;
 //Save mousedown location
 var pos = eventPos(e);
 dragObj.downX=pos.x;
 dragObj.downY=pos.y;

 if(document.addEventListener){
  document.addEventListener("mousemove",dragStart,true);
  document.addEventListener("mouseup",dragEnd,true);
  e.preventDefault();
 } else if(document.attachEvent){
  document.attachEvent("onmousemove",dragStart);
  document.attachEvent("onmouseup",dragEnd);
  return false;
 }
}
var IsHidden=IsHiddenByStateDriver,IsDisabled=IsDisabledByStateDriver
function IsInDisabledPages(id,detail){
  if(typeof m_cStateDisabledPages!='undefined'){
    for (var i=0; i<m_cStateDisabledPages.length; i++){
      if(FindInputInContainer(id,Ctrl(m_cStateDisabledPages[i]),detail))
        return true
    }
  }
  return false
}
function FindInputInContainer(id,container,detail){
 var children=container.childNodes;
 var itm;
 for(var i=0;i<children.length;i++){
  itm=children.item(i);
  switch(itm.tagName){
   case 'INPUT':
    if(itm.id==id || itm.name==id || (detail && itm.className==id))
     return true;
    break;
   case 'DIV': case 'SPAN':
    if(FindInputInContainer(id,itm,detail))
     return true;
    break;
   case 'TABLE':
    if(FindInputInTable(id,itm,detail))
     return true;
    break;
   default:
    //alert(itm.tagName)
  }
 }
 return false;
}
function FindInputInTable(id,table,detail){
  var i,ii
  for(i=0; i<table.rows.length; i++){
    for(ii=0; ii<table.rows[i].cells.length; ii++){
      if(FindInputInContainer(id,table.rows[i].cells[ii],detail)){
        return true
      }
    }
  }
  return false
}
function _ResetTracker(){
if(typeof _tracker=='undefined' || !_tracker.askwrn){
  _tracker={ctrl:null,badValue:null,askwrn:false,
goon:function(p_ctrl,p_badValue){return (Ne(this.ctrl,p_ctrl) || Ne(this.badValue,p_badValue)) && !this.askwrn}
}}}
function _modifyandopen(page,zopt,detail){
if(detail!=null && typeof SetModified=='function')SetModified(detail)
windowOpenForeground(page,'',zopt)}
function Set(name,value){return window['Set_'+name](value)}
function _chNotF(a,t,n){alert('Errore dell\'applicazione :"'+a+'" non corrisponde al nome logico della tabella di un figlio della entita\' di tipo '+t+' chiamata  "'+n+'"')}
function _FillChildren(w){
var r,i,n,cn=typeof m_FillChildrenName!='undefined'?m_FillChildrenName:_FillChildren.n
for(i=0;i<cn.length;i++){
n=cn[i]
r=FrameRef(n)
if(typeof r=='undefined')r=window["m_o"+n]
n='m_cWv_'+n
if(!ChildToLoad(r) && typeof(r.GetContext)!='undefined' && m_cFunction!='view')window[n]=r.GetContext();
if(!Empty(window[n]))w.setValue(n,WtA(window[n],'C'))
}}
function CheckChild(repeated) {
 var l_bResult=true;
 var l_bChildCheck = true;
 var c = CheckChild.child;
 for (var i=0;i<c.length;i++) {
  if (repeated==c[i].repeated) {
   if ( ! (ChildToLoad(c[i].BOScId()))){
    if (Ne(typeof(c[i].BOScId().SaveRow),'undefined')) {
     l_bChildCheck=c[i].BOScId().SaveRow(true);
     if ( ! (l_bChildCheck)) {
      l_bResult=false;
      m_cErrorInChild=c[i].prg;
     }
    }
    if (l_bResult && Ne(typeof(c[i].BOScId().Check),'undefined')) {
     l_bChildCheck=c[i].BOScId().Check();
     if ( ! (l_bChildCheck)) {
      l_bResult=false;
      m_cErrorInChild=c[i].prg;
     }
    }
   }
  }
 }
 return l_bResult;
}
function SaveContext(){
  var c = SaveContext.child;
  for (var i=0;i<c.length;i++) {
    var Script=c[i].BOScId();
    if ( !(ChildToLoad(Script)) && Ne(typeof(Script.GetContext),'undefined') && Script.m_bUpdated) {
      if(!IsIE()) {
       Script.frameElement.blur()
      }
      window["m_cWv_"+c[i].prg]=Script.GetContext();
    }
  }
}
function BlankRowChild() {
  var c = SaveContext.child;
  for (var i=0;i<c.length;i++) {
    window["m_cWv_"+c[i].prg]='';
  }
}
function GetContext(allowEncoding){
if(typeof SaveRow=='function')SaveRow(true)
if(typeof SetFromContext.lastSet!='undefined'&& !m_bUpdated&& (typeof m_bHeaderUpdated=='undefined'||!m_bHeaderUpdated))return SetFromContext.lastSet
FillWv()
return WvApplet().asString(allowEncoding)
}
function SetFromContext(s){
if(Left(s,1)=='{'){
if(typeof SetFromContext.lastSet!="undefined")delete SetFromContext.lastSet
eval(s)
if(SetFromContext.hasD()){
var realtrs,savedrow=typeof m_cDetailBehavior!='undefined' && m_cDetailBehavior=='select'?new TrsRow(m_nRowStatus):0
InitTable(Ctrl('GridTable'),m_cFunction,true)
if(savedrow){
realtrs=m_oTrs[m_nCurrentRow]
m_oTrs[m_nCurrentRow]=savedrow
try{
TrsToWork()
}finally{
m_oTrs[m_nCurrentRow]=realtrs
}
}
LoadContext(false)
FillFrmMainTrs();//aggiorno il TrsApplet con i dati attuali
if (typeof RenderDynamicCombo=='function') RenderDynamicCombo()
if(Ctrl('GridTable_SelectedEditRow')!=null)SetControlsValue();
if (Ctrl('GridTable_Band')) CalculateAndResizeEntityHeight();
}else{
LoadContext();
if (typeof RenderDynamicCombo=='function') RenderDynamicCombo()
SetControlsValue();
}
}else{
var l_oWv=InitWvApplet(),rows,i,oTrs,p
l_oWv.BuildProperties(s)
l_oWv.SetRow(0)
function t(w){return IsA(w,'C')?'C':(IsA(w,'N')?'N':(IsA(w,'T')?'T':(IsA(w,'L')?'L':'D')))}
for(i in FillWv.n){i=FillWv.n[i];window["w_"+i]=GetProperty(l_oWv,i,t(window["w_"+i]));
if ("t_"+i in window) window["t_"+i]=GetProperty(l_oWv,"t_"+i,t(window["w_"+i]));}
for(i in _FillChildren.n){i='m_cWv_'+_FillChildren.n[i];window[i]=GetProperty(l_oWv,i,'C')}
LoadContext(false)
if(SetFromContext.hasD()){
m_oTrs=[]
m_oDeletedRows=[]
DeleteAllRows()
oTrs=[{},new TrsJavascript(true)]
oTrs[1].BuildProperties(GetProperty(l_oWv,'m_oTrs','C'))
rows=oTrs[1].getRows()
p=TrsRowSample()
for(var name in p)oTrs[oTrs.length]=(Upper(name)=='CPROWNUM'?'m_nCPRowNum':(Left(name,2)=='w_'?Substr(name,2):name))
GetTrsProps.apply(null,oTrs)
for(i=1;i<=rows;i++){
function crn(n){return Upper(n)=='CPROWNUM'?'m_nCPRowNum':n}
for(var name in p){
oTrs[0][crn(name)].SetRow(i)
if(typeof window["w_"+name]!='undefined'){
window["w_"+name]=GetProperty(oTrs[0][crn(name)],'',t(window["w_"+name]))
}else{
if(Left(name,2)!='t_'||(EntityStatus()!='Q'&&EntityStatus()!='V'))window[name]=GetProperty(oTrs[0][crn(name)],'',t(window[name]))
}
}
if(m_nRowStatus!=3){
m_oTrs[m_oTrs.length]=new TrsRow(m_nRowStatus)
}else{
m_oDeletedRows[m_oDeletedRows.length]=new TrsRow(m_nRowStatus)
}
}
InitTable(Ctrl('GridTable'),m_cFunction,true)
m_bHeaderUpdated=GetProperty(l_oWv,'m_bHeaderUpdated','L')
if(Ctrl('GridTable_SelectedEditRow')!=null){
SaveDependsOn();
if (typeof RenderDynamicCombo=='function') {RenderDynamicCombo();}
SetControlsValue();}
if (Ctrl('GridTable_Band')) CalculateAndResizeEntityHeight();
}else{
SaveDependsOn();
if (typeof RenderDynamicCombo=='function') {RenderDynamicCombo();}
SetControlsValue();
}
m_bLoaded=GetProperty(l_oWv,'m_bLoaded','L')
m_cOldCPCCCHK=GetProperty(l_oWv,'m_cOldCPCCCHK','C')
m_bUpdated=GetProperty(l_oWv,'m_bUpdated','L')
SetFromContext.lastSet=s
}
EnableControlsUnderCondition()
}
SetFromContext.hasD=function(){return typeof m_oTrs!='undefined'}
function LoadContext(d,ctxLoading){
var i,iframes=[]
for(var i=0;i<LoadContext.u.length;i++){
iframes.push(LoadContext.u[i](d==true,ctxLoading))
if(ctxLoading && iframes[i]){
return iframes[i]
}
}
return iframes
}
if(typeof LoadContext.u=='undefined')LoadContext.u=[]
LoadContext.f=function(id,BOScriptID,changeCtxType,name,loadAlways,page){
LoadContext.u[LoadContext.u.length]=function(d,ctxLoading){
var notLoaded,iframe,bo
if(ctxLoading && id != ctxLoading){
return
}
if(!SetFromContext.hasD() || d==IsRepeatedChild(id)){
notLoaded=m_cFunction == 'view' || m_cFunction == 'query' || (Empty(window['m_cWv_'+name]) && !LoadContext.inRoutine) || BOScriptID() == null || (typeof BOScriptID().SetFromContext == 'undefined')
}
if(notLoaded==null){
}else if(notLoaded && (loadAlways || (Ctrl(id) && LibJavascript.UserCanSee(id)) || ctxLoading)){
iframe=LoadContext.lc(changeCtxType,id,BOScriptID,ctxLoading)
}else if(notLoaded){
}else if(loadAlways && ChildToLoad(BOScriptID())){
iframe=LoadContext.lc(changeCtxType,id,BOScriptID,ctxLoading)
}else if(typeof BOScriptID().SetFromContext == 'undefined'){
}else if(Empty(window['m_cWv_'+name]) && LoadContext.inRoutine){
bo=new BatchJavascript()
bo.GetFromResponse(new JSURL(linkpc_url(id)+"&m_OnlyContext").Response())
window['m_cWv_'+name]=bo.rdvar['BO']
i=BOScriptID().LoadContext.inRoutine
try{
BOScriptID().SetFromContext(window['m_cWv_'+name])
}finally{
BOScriptID().LoadContext.inRoutine=i
}
}else if(!ctxLoading){
i=BOScriptID().LoadContext.inRoutine
try{
BOScriptID().LoadContext.inRoutine=LoadContext.inRoutine
BOScriptID().SetFromContext(window['m_cWv_'+name])
}finally{
BOScriptID().LoadContext.inRoutine=i
}
}
return iframe
}
}
LoadContext.inRoutine=false
LoadContext.lc=function(changeCtxType,id,BOScriptID,ctxLoading){
var iframe
if(changeCtxType && ((RAt(linkpc_url(id),Ctrl(id).src)==0) || (SetFromContext.hasD()&&IsRepeatedChild(Ctrl(id).id)))){
iframe=ChangeIframeSrcWithoutPushingHistory(id, linkpc_url(id))
}else if(!changeCtxType && IsWndAccessible(BOScriptID()) || ctxLoading) {//ChildToLoad impedirebbe il caricamento
iframe=BOScriptID()
iframe.m_bResetOnUnload=false
iframe.location=linkpc_url(id)
}
return iframe
}
function ChangeIframeSrcWithoutPushingHistory(id,src,create,name,iframe){
var newIframe
if(!iframe){
iframe = Ctrl(id)
}
if(iframe||!create){
id = iframe.id
iframe.removeAttribute('id')
iframe.removeAttribute('src')
newIframe = iframe.cloneNode(false)
}else{
newIframe=ChangeIframeSrcWithoutPushingHistory.cframe(function(s){return document.createElement(s)},name)
newIframe.frameBorder='no'
newIframe.style.cssText='visibility:hidden;height:0;width:0'
}
newIframe.setAttribute( 'toResize', 'no' );
newIframe.id = id
newIframe.src = src
if(iframe){
iframe.parentNode.replaceChild(newIframe, iframe)
}else{
document.body.appendChild(newIframe)
}
iframe = null
if(window){
  window[newIframe.name]=newIframe.contentWindow; //bug firefox, il vecchio nome rimane con il contenuto dell'iframe vecchio se c'e' gia' stato un accesso.
}
return newIframe
}
ChangeIframeSrcWithoutPushingHistory.cframe=function(ce,name){
var i
try{
i=ce('<iframe name="'+name+'">')
}catch(e){
i=ce('iframe')
i.name=name
}
return i
}
function IsRepeatedChild(uid) {
for (var i = 0; IsRepeatedChild.child && i<IsRepeatedChild.child.length; i++)
 if (uid==IsRepeatedChild.child[i])
  return true;
return false;
}
function linkpc_url(i){
var f
try{f=linkpc_url.r[i]}catch(e){}
if(f)return f()
}
linkpc_url.r={}
linkpc_url.u=function(i,f){linkpc_url.r[i]=f}
function GetLinkPCKeys(n){
var r="",k=GetLinkPCKeys.o[n],i,v
if(k){for(i in k){if(v=k[i](WtA))r+='&'+i+'='+URLenc(v)}}
try{r+='&m_dHistoricalLoadStart='+document.FSender.m_dHistoricalLoadStart.value}catch(e){}
return r
}
GetLinkPCKeys.o={}
GetLinkPCKeys.set_o=function(n,r){
GetLinkPCKeys.o[n]={}
GetLinkPCKeys.o[n]['m_cAction']=function(){
if(m_cFunction!='edit'){
return m_cFunction
}else if(r && RowStatus()=="A"){
return "new"
}else{
return "editload"
}
}
GetLinkPCKeys.o[n]['m_bAutoFill']=function(){
if(m_cFunction!='query' && !Empty(window['m_cWv_'+Lower(n)])){
return "true"
}
}
GetLinkPCKeys.o[n]['m_cID']=function(){
try{
return m_IDS[Lower(n)]
}catch(e){
}
}
}
GetLinkPCKeys.wfk=function(n,s){
var k=GetLinkPCKeys.o[n],a=k['m_cAction']
k['m_cAction']=function(){return 'workflow'}
k['WorkFlowScript']=function(){
s=' \n'+s
for(var v in k)if(Left(v,2)!='m_' && v!='WorkFlowScript' && k[v](GetLinkPCKeys.c)){
s=','+v+'='+k[v](GetLinkPCKeys.c)+s
}
return a()+' '+Substr(s,2)
}
}
GetLinkPCKeys.c=function(v,t){
v=WtA(v)
switch(t){
case'C':case'M':return "'"+v+"'"
case'D':case'T':return "{"+v+"}"
default:return v
}
}
function _Obli(name,blank,scriptid,on,comment,uid,txt_error,cond_obbl){
var a=_ObliD[name],o=new _Obligatory(name,scriptid,on,comment,uid,txt_error,cond_obbl)
if(!a)a=_ObliD[name]=[]
a[a.length]=o
_ObliD[scriptid]=o
o.txt_error=txt_error
o.on=on
o.cond_obbl=cond_obbl
}
function _Obligatory(name,scriptid,on,comment,uid,txt_error,cond_obbl){
this.scriptid=scriptid
if (typeof(cond_obbl) == 'function') {
this.check = function (globchk, cb) {
var r = true;
if (on || this.on) {
r = !Empty(window['w_' + name]);
if (!r) {
cond_obbl(cond_obbl_cb);
function cond_obbl_cb(res) {
r = !res;
m_nLastError = 1;
m_cObblFieldName = comment ? comment : name;
if (txt_error)
m_cLastMsgError = AlertErrorMessage(txt_error);
else
m_cLastMsgError = '';
if (!globchk) {
if (uid)
window["Link_" + uid + "_Blank"]();
SetControlFocus(scriptid);
SetErrorField(_RetFoc.ctl, true);
if (!last_focused_comp && ('m_nCurrentRow' in window))
SetControlFocus(scriptid + '_' + m_nCurrentRow);
if (last_focused_comp)
_RetFoc.ctl = (last_focused_comp.tagName ? last_focused_comp : last_focused_comp[0]); //se DOMElement assegno, altrimenti prendo il primo elemento dell'array
}
cb(r);
}
} else cb(r);
} else cb(r);
}
}
else {
this.check = function (globchk,cb) {
var r = true;
if (on || this.on) {
r = !Empty(window['w_' + name]) || (this.cond_obbl ? !eval(this.cond_obbl) && !IsObligatoryByStateDriver(name) : false);
if (!r) {
m_nLastError = 1;
m_cObblFieldName = comment ? comment : name;
if (this.txt_error)
m_cLastMsgError = AlertErrorMessage(this.txt_error);
else
m_cLastMsgError = '';
if (!globchk) {
if (uid)
window["Link_" + uid + "_Blank"]();
SetControlFocus(scriptid);
SetErrorField(_RetFoc.ctl, true);
if (!last_focused_comp && ('m_nCurrentRow' in window))
SetControlFocus(scriptid + '_' + m_nCurrentRow);
if (last_focused_comp)
_RetFoc.ctl = (last_focused_comp.tagName ? last_focused_comp : last_focused_comp[0]); //se DOMElement assegno, altrimenti prendo il primo elemento dell'array
}
}
}
if (cb) cb(r);
else return r;
}
}
}
var _ObliD={}
function _ChkObl(id,g,cb){
return _ObliD[id].check(g?true:false,cb)
}
function _RetFoc(e,ctrlValue,v){
try{
var c=_RetFoc.ctl
if('INPUT'==c.tagName && 'radio'==c.getAttribute('type')){
 selectRadio(Ctrl(c.name),null,'C',1)
 _tracker.badValue=null
}else if('SELECT'==c.tagName){
 selectCombo(Ctrl(c.name),null,'C')
 _tracker.badValue=null
}else{
 c.value=v
_tracker.badValue=ctrlValue
}
_tracker.ctrl=c
if(e)try{
 CancelEvent(e)
}catch(x){}
SetControlFocus(c.id)
SetErrorField(c,true)
}finally{
if(_RetFoc.ctl)delete _RetFoc.ctl
}
}
function _SignErr(id,txt_e,v1,v2,v3,v4,v5){
if(m_nLastError==0)m_nLastError=2
if(txt_e)m_cLastMsgError=AlertErrorMessage(txt_e,v1,v2,v3,v4,v5)
if(m_cLastWorkVarError=='')m_cLastWorkVarError=id
}
function _GetCtl(e,id){
var c
try{c=GetEventSrcElement(e)||Ctrl(id)}catch(x){c=Ctrl(id)}
if(e && e.type=='click' && IsSafari() && 'INPUT'==c.tagName && LibJavascript.Array.indexOf(['checkbox','radio'],c.getAttribute('type')) != -1){
c.focus()
}
_RetFoc.ctl=_tracker.ctrl?_tracker.ctrl:c
return c
}
_regWarn=function(p,id){
 if(arguments.length>0){
  var i=0,j
  while(i<p.length){
   for(j=0;j<_regWarn.code.length && i<p.length;j++) try {
    if(_regWarn.code[j]==p[i]){
     j=0
     i++
     continue
    }
   }
   catch(e){
   }
   if(i<p.length){
    _regWarn.code[_regWarn.code.length]=p[i]
    _regWarn.ctrl[_regWarn.ctrl.length]=id
    i++
   }
  }
 }
}
_regWarn.code=[]
_regWarn.ctrl=[]
function TogglePostit(){
var i
if(TogglePostit.toggled.join('')!=''){
for(i=0;i<TogglePostit.toggled.length;i++)
if(TogglePostit.toggled[i]!='')Ctrl(TogglePostit.toggled[i]+'_DIV').childNodes[0].childNodes[3].onclick()
TogglePostit.addPostit.idx=0
}else{
if(ShowPostit())NewPostin()
}
}
TogglePostit.toggled=[]
TogglePostit.addPostit=function(idx){
var i,h,s,d,p,did="_"+Math.random(),ce=function(s){return document.createElement(s)},lw=typeof sv_PostitWidth!='undefined'?sv_PostitWidht:'300',lh=typeof sv_PostitHeight!='undefined'?sv_PostitHeight:'200'
d=ce("div")
d.style.cssText='height:'+lh+'px;width:'+lw+'px;position:absolute;z-index:999'
d.className='LayerContainer PostitLayer'      //aggiunta classe css per i postit
d.setAttribute('pin_status','pinned')
d.id=did+'_DIV'
h=ce("div")
h.style.cssText='width:100%;' //height:'+hh+'px;
h.className='LayerHeader'
h.onmousedown=function(e){dragLayer(e,did+'_DIV')}
d.appendChild(h)
i=ce("span")
i.className='LayerHeaderCaption'
i.innerHTML="Post-In"
i.style.cssText='left:20px'
h.appendChild(i)
s=ce("img")
s.style.cssText='position:absolute;top:2px;left:2px;cursor:nw-resize'
s.src='../visualweb/images/grid_separator.png'
s.onmousedown=function(e){dragObj.minW=300;dragObj.resize='nw';dragLayer(e,did+'_DIV')}
h.appendChild(s)
s=LibJavascript.DOM.GenerateElementIcon(SPTheme.layerHeaderUnpinImage||'../'+m_cThemePath+'/formPage/box_layer_unpin.gif','','',"class='LayerHeaderIconPin'",'');
s.className='LayerHeaderIconPin';
s.onclick=function(){if(confirm(Translate("MSG_DELETE_POSTIT"))){
Ctrl(TogglePostit.toggled[idx]+'_DIV').getElementsByTagName('iframe')[0].contentWindow.Set_textualpostit('')
var a=this.parentNode.childNodes
a[3].onclick()
}}
h.appendChild(s)
s=LibJavascript.DOM.GenerateElementIcon(SPTheme.layerHeaderCloseImage||'../'+m_cThemePath+'/formPage/box_layer_close.gif','','','','');
s.className='LayerHeaderIconClose';
s.onclick=function(){
 var c=Ctrl(TogglePostit.toggled[idx]+'_DIV').getElementsByTagName('iframe')[0];
 _regWarn.code[idx]=''
 LibJavascript.Events.addEvent(c,'load',new Function(//5-5-8 addEvent usa stringa seguente come chiave
  "var c=Ctrl('"+TogglePostit.toggled[idx]+"_DIV');"+
  "LibJavascript.Events.removeEvent(c.getElementsByTagName('iframe')[0],'load',arguments.callee);"+
  "c.parentNode.removeChild(c);"+
  "TogglePostit.toggled["+idx+"]=''"
 ))
 c.contentWindow.open('about:blank','_self')//scateno unload
}
h.appendChild(s)
s=ce("div")
s.style.cssText='z-index:0;overflow:hidden;position:absolute;width:100%'
// s.className='LayerBody'
try{
i=ce('<iframe name="_postit'+TogglePostit.addPostit.idx+'">')
}
catch(e){
 i=ce('iframe')
 i.name='_postit'+TogglePostit.addPostit.idx
}
TogglePostit.addPostit.idx++
i.frameBorder='no'
i.allowTransparency="true"
i.style.cssText='top:-2px;left:-2px;height:100%;width:100%;height:100%;'
LibJavascript.Events.addEvent(i,'load',function(){
 s.style.cssText+=';background-color:rgb(127,127,127)'
 i.contentWindow.adjustWidthAndHeight()
 i.style.cssText=i.style.cssText
 LibJavascript.Events.removeEvent(i,"load",arguments.callee)
})
i.src='postin_user?m_cAction=editload&m_cDecoration=none&code='+URLenc(_regWarn.code[idx])
s.appendChild(i)
d.appendChild(s)
try{(p=Ctrl(m_cSelectedPage)).appendChild(d)}catch(x){(p=Ctrl('page_1')).appendChild(d)}
TogglePostit.toggled[idx]=did
ShowLayerBox({offsetLeft:Val(Ctrl('bodyDiv').style.width)-p.offsetLeft-lw-50*TogglePostit.addPostit.idx,offsetTop:50*TogglePostit.addPostit.idx-p.offsetTop,offsetHeight:0,parentNode:d.parentNode},did+'_DIV','00')
var hh = LibJavascript.DOM.getComputedStyle(h, 'height')||'18px';
s.style.height='calc(100% - '+ hh +')';
}
TogglePostit.addPostit.idx=0
function ShowPostit(p,id){
var s=_regWarn.code.length,i
if(p){
 // p=p.slice(0)
} else if(m_bLoaded) {
 LibJavascript.IncludeFunction("ShowPostit","postin_operation")
 p=eval(postin_operation(i_PrimaryKey(),'GW',''))
 for(i=0;i<_regWarn.code.length;i++) if(_regWarn.code[i]!=''){
  TogglePostit.addPostit(i)
 }
} else {
 alert(Translate('MSG_REC_NOT_SELECTED'))
 return false
}
if(p[p.length-1]=='substitute'){
 for(i=0;i<_regWarn.code.length;i++) {
  if (_regWarn.ctrl[i]==id && TogglePostit.toggled[i]!='' && LibJavascript.Array.indexOf(p,_regWarn.code[i])==-1)
   setTimeout(new Function("","Ctrl('"+TogglePostit.toggled[i]+"_DIV').childNodes[0].childNodes[3].onclick()"),0)
 }
 p=p.slice(0,p.length-1)
}
_regWarn(p,id)
for(;s<_regWarn.code.length;s++)TogglePostit.addPostit(s)
return true
}
function NewPostin(){
if(m_bLoaded){
var i=_regWarn.code.length
_regWarn.code[i]=i_PrimaryKey()
TogglePostit.addPostit(i)
}else{
alert(Translate('MSG_REC_NOT_SELECTED'))
}
}
function NonBlockingMessage(m){
var d,h,f=function(){
if(h<255){d.style.color="rgb("+h+","+h+","+h+")";h+=11;setTimeout(f,100)}
else{d.parentNode.removeChild(d);delete NonBlockingMessage.div}}
if(typeof NonBlockingMessage.div=='undefined'){
d=document.createElement('div')
NonBlockingMessage.div=d
d.style.cssText='position:absolute;top:100px;left:100px'
document.body.appendChild(d)
h=0
f()
}else{
h=0
d=NonBlockingMessage.div
d.innerHTML=d.innerHTML+'<br>'
}
d.innerHTML=d.innerHTML+m
}
PostitButtonClick=NewPostin
PostinButtonClick=NewPostin
function Zoom(c,t){
var setl=function(w){
var u,a=AtExitValue(),b=AltInterfaceValue()
if(typeof m_cProgName!='undefined')Zoom.p=m_cProgName
u='../servlet/'+Zoom.p+'?m_cAction=autozoom'+(EmptyString(a)?'':'&m_cAtExit='+a)+(EmptyString(b)?'':'&m_cAltInterface='+b)
if(c==null && Ctrl('SP_HISTORICAL_DATE_DIV')){
u+='&FixedFilter='+URLenc('cphstk=1')
}else if(c && m_bLoaded){
u+='&FixedFilter='+URLenc(c)
}else if(Ctrl('SP_HISTORICAL_DATE_DIV') && Eq(Ctrl('SP_HISTORICAL_DATE_DIV').style.visibility,'')){
u+='&HistoryFilterDate='+Ctrl('SP_HISTORICAL_DATE').value
}else if(c){
u+='&FixedFilter='+URLenc(c)
}
w.location.href=u
}
if(t&&IsWndAccessible(window['m_oFather'])) {
setl(m_oFather)
}else if(IsWndAccessible(window['m_oFather']) && m_nChildStatus==2){
m_oFather.Zoom()
}else if(IsWndAccessible(window['m_oFather']) && !t){
alert(Translate('MSG_CHILD_FUNCTION'))
}else{
setl(window)
}
}

//Funzioni relative al suggest
function highLightRow(obj,id,rowid){
 var c=Ctrl(rowid),cold;
 cold=Ctrl(id+'_row_'+c.selezionato);
 if(cold) cold.className="suggest_row";
 obj.className="suggest_row_selected";
 c.selezionato=eval(Right(obj.id,1));
}

function select_suggest(id,rowid,i){
 var optionsOfSuggest = select_suggest[id];
 var bRes=false;
 var firstNullIdx=-1;
 if(i>-1) {
  if (optionsOfSuggest) {
    for (var j=0;j<optionsOfSuggest[1].length;j++) {
      if (optionsOfSuggest[1][j]!=null)
        window[optionsOfSuggest[1][j]]=document.getElementById("suggest"+i+j).innerHTML;
      else if (firstNullIdx==-1)
        firstNullIdx = j;
    }
    window['w_'+optionsOfSuggest[0]]=null;
  } else {
    document.getElementById(rowid).value=document.getElementById("suggest"+i+"0").innerHTML;
  }
 }
 var pg=ControlPage(Ctrl(rowid)),n="_1",c;
 if(pg) n=pg.substring(RAt('_',pg)-1);
 document.getElementById("SUGGEST_DIV"+n).style.visibility="hidden";
 m_bShowSuggest=false;
 if(c=Ctrl(rowid))
  if(c.onblur!=window[id+"_Valid"]){
   c.onblur=window[id+"_Valid"];
   if (i>-1 && optionsOfSuggest) {
    bRes=window['Set_'+optionsOfSuggest[0]](optionsOfSuggest[2](document.getElementById("suggest"+i+""+firstNullIdx).innerHTML),null,{});
    window[id+'_OnKeyUp'].oldValue = (optionsOfSuggest[1][0]==null? window[ 'w_'+optionsOfSuggest[0] ] : window[optionsOfSuggest[1][0]] );
   } else
    bRes=eval(id+"_Valid({})");
  }
 if(c=Ctrl(rowid+'_ZOOM')) c.onclick=window[id+"_ZOOM_Click"];
 resetSuggest(id,rowid);
 return bRes;
}

function GetSelectedChildPage(p_d) {
 var key;
 for (key in GetSelectedChildPage.child) {
  var child = GetSelectedChildPage.child[key]();
  if ( ! (ChildToLoad(child))) {
   if (Ne(typeof(child.GetSelectedPage),'undefined')) {
    child.GetSelectedPage(p_d);
   }
  }
 }
return p_d;
}
//riutilizzo GetSelectedChildPage.child, attenzione!!
function IsEditRowLayerOpened() {
 var result = false;
 if ('m_cGridLayerId' in window) {
  result = LibJavascript.CssClassNameUtils.hasClass( Ctrl( window.m_cGridLayerId + '_DIV' ), "SPEditRowLayer_Opened" );
 }
 if (!result) {
  //cerco nei figli
  var key;
  for (key in GetSelectedChildPage.child) {
   var child = GetSelectedChildPage.child[key]();
   if ( ! (ChildToLoad(child))) {
    if (Ne(typeof(child.IsEditRowLayerOpened),'undefined')) {
     result = result || child.IsEditRowLayerOpened();
    }
   }
   if (result) break;
  }
 }
 return result;
}
function CloseEditRow() { //la versione master deve tornare true se ha chiuso l'edit di un figlio, il controllo e' fatto in tablefuncts.mobile.js
 var key;
 for (key in GetSelectedChildPage.child) {
  var child = GetSelectedChildPage.child[key]();
  if ( ! (ChildToLoad(child))) {
   if (Ne(typeof(child.IsEditRowLayerOpened),'undefined')) {
    if (child.IsEditRowLayerOpened()) {
     child.CloseEditRow();
     return true;
    }
   }
  }
 }
 return false;
}
function callSuggest(fnc,prm) {
 if (callSuggest.timeout_id==null) {
  callSuggest.timeout_id=setTimeout(function(){ callSuggest.timeout_id=null; fnc(prm); },200 );
 }
}
callSuggest.timeout_id=null;
function resetSuggest(id,rowid) {
 if (callSuggest.timeout_id!=null) {
  window.clearTimeout(callSuggest.timeout_id);
  callSuggest.timeout_id=null;
 }
 render_suggest('{Data:[]}',id,rowid);
}

function render_suggest(suggest_res, id ,rowid,detail,container,container_header,linkIndexToView){
  var ctrl= Ctrl(rowid)
  var pg=ControlPage(ctrl)
  var n="_1";
  linkIndexToView = linkIndexToView||0;
  if (pg) n=pg.substring(RAt('_',pg)-1);
  var box=Ctrl('SUGGEST_DIV'+n);
  box.style.zIndex=(dragObj && dragObj.zIndex && box.style.zIndex<dragObj.zIndex?++dragObj.zIndex:(box.style.zIndex||'1001'));
  var x_delta=0,y_delta=0,i,cc;
  if (Ctrl(pg||'page_1')) {
    var pos = LibJavascript.DOM.getPosFromFirstRel(ctrl,box);
    box.style.left=(pos.x)+"px";
    box.style.top=(pos.y+ctrl.offsetHeight)+"px";
  } else {
    if(!Empty(container)){
     if(typeof(container)=="string") container=Ctrl(container);
     x_delta+=container.offsetLeft;
     y_delta+=container.offsetTop;
     if(!Empty(container_header)){
      if (cc=Ctrl(container_header))
      y_delta+=cc.offsetHeight;
     }
    }
    if(detail){
     var parentRow=ctrl;
     do {
      parentRow=parentRow.parentNode;
     }
     while(parentRow.tagName!="DIV")
     x_delta+=Ctrl("GridTable_Container").offsetLeft;
     y_delta+=Ctrl("GridTable_Container").offsetTop+parentRow.offsetTop-Ctrl("GridTable_DIV").scrollTop;
    }
    box.style.left=(ctrl.offsetLeft+x_delta)+"px";
    box.style.top=(ctrl.offsetTop+ctrl.offsetHeight+y_delta)+"px";
  }
  var JSONObj= eval("("+suggest_res+")");
  var Data=JSONObj.Data,c;
  if(Data.length>1){
    m_bShowSuggest=true;
    box.style.visibility="visible";
    if (ctrl) {
      ctrl.onblur=window[id+"_ValidSuggest"];
      ctrl.selezionato=-1;
      ctrl.onkeydown=window[id+"_Sugg_OnKeyDown"];
    }
    if(c=Ctrl(rowid+'_ZOOM')) c.onclick=null;
  } else{
    m_bShowSuggest=false;
    box.style.visibility="hidden";
    if(ctrl) ctrl.onblur=window[id+"_Valid"];
    if(c=Ctrl(rowid+'_ZOOM')) c.onclick=window[id+"_ZOOM_Click"];
  }
  var optionsOfSuggest = select_suggest[id];
  var itemClasses=[];
  if (optionsOfSuggest) {
    i=0;
    while( i < optionsOfSuggest[1].length && optionsOfSuggest[1][i] != null ) { //se i primi campi sono compilati sono chiavi fisse
      itemClasses[i]='suggest_FixedKeySearch';
      i++;
    }
    while( i < optionsOfSuggest[1].length && optionsOfSuggest[1][i] == null ) { //campo chiave piu' linked using
      if ( i>=linkIndexToView )
        itemClasses[i]='suggest_Field';
      else
        itemClasses[i]='suggest_HiddenKey';
      i++;
    }
    while( i < optionsOfSuggest[1].length && optionsOfSuggest[1][i] != null) { //chiavi fisse per fill empty key, se compilati sono da nascondere
      if ( Empty( window[optionsOfSuggest[1][i]] ) ) {
        itemClasses[i]='suggest_FixedKey';
      } else {
        itemClasses[i]='suggest_HiddenFixedKey';
      }
      i++;
    }
    for (i=0;i<itemClasses.length;i++) {
      if ( itemClasses[i].indexOf('Hidden')==-1 ) { //il primo visibile non deve avere il separatore
        itemClasses[i] = itemClasses[i] + ' suggest_SuppressSeparator';
        break;
      }
    }
  } else {
    if (Data[0] && Data[0].length) {
      itemClasses = ((new Array( Data[0].length + 1 ).join( 'suggest_Field,' )).slice(0,-1)).split(',');
      itemClasses[0] = itemClasses[0] + ' suggest_SuppressSeparator';
    }
  }

  var html="<div class='suggest_Container'>";
  for(i=0;i<Data.length-1;i++){
    html+="<div id='"+id+"_row_"+i+"' class='suggest_row' onmouseover='highLightRow(this,\""+id+"\",\""+rowid+"\")' onmousedown='select_suggest(\""+id+"\",\""+rowid+"\","+i+")'>"
    for(var j=0;j<Data[i].length;j++)
      html+="<div id='suggest"+i+j+"'class='"+(itemClasses[j]||'suggest_Field')+"'>"+Data[i][j]+"</div>";
    html+="</div>";
  }
  html+="</div>"
  box.innerHTML=html;
}

function OnKeyDown_suggest(id,rowid,keyCode){
 var c=Ctrl(rowid);
 if(keyCode==38 || keyCode==40){
  var c1=Ctrl(id+'_row_'+c.selezionato),c2=null;
  switch(keyCode){
   case 38:
    c2=Ctrl(id+'_row_'+(c.selezionato-1));
    if(c.selezionato>-1){
     c.selezionato--;
     if(c2) c2.className="suggest_row_selected";
     if(c1) c1.className="suggest_row";
    }
    break;
   case 40:
    c2=Ctrl(id+'_row_'+(c.selezionato+1));
    if(c2){
     c.selezionato++;
     c2.className="suggest_row_selected";
     if(c1) c1.className="suggest_row";
    }
    break;
  }
 } else if (keyCode==13) {
  if(c.selezionato>=-1)
   select_suggest(id,rowid,c.selezionato);
 }
}

function OnFocus_HistoricalValidityDate(){
 var validity=HtW(Ctrl('SP_HISTORICAL_DATE').value,'D');
 Ctrl('SP_HISTORICAL_DATE').value=WtH(validity,'D',8,0,TranslatePicture(datePattern.replace(/[^DMY]/g,'')))
 Ctrl('SP_HISTORICAL_DATE').select();
}
function OnBlur_HistoricalValidityDate(){
 Ctrl('SP_HISTORICAL_DATE').value=ApplyPictureToDate(Ctrl('SP_HISTORICAL_DATE').value,TranslatePicture(datePattern),'SP_HISTORICAL_DATE');
}
function scaleImage(c,height,width){
if(typeof c=='string')c=Ctrl(c)
if (c==null) return;
if(c.offsetWidth>width) {
c.style.width=width+'px';
c.style.height='auto';
}
if(c.offsetHeight>height) {
c.style.height=height+'px';
c.style.width='auto';
}
}
function render_combobox(id,query,campo,valore,cmdHash,key,value,orderby,select){
 var queryfilter="",sep="",variabili="";
 for(var i=0;i<campo.length;i++) {
  if(campo[i]!=''){
   if(Left(campo[i],1)=='?') {
    variabili+="&"+Right(campo[i],campo[i].length-1)+"="+URLenc(valore[i]);
   } else {
    queryfilter+=URLenc(sep+_flt_(campo[i],valore[i],null,true))
    sep=" AND ";
   }
  }
 }
 var urlOfCombo = '../servlet/SQLDataProviderServer?rows=100000&startrow=0&count=false&cmdhash='+cmdHash+'&sqlcmd='+URLenc(query)+'&queryfilter='+queryfilter+'&orderby='+URLenc(orderby)+variabili;
 var obj=null;
 if (urlOfCombo in render_combobox.spcache) {
  obj=render_combobox.spcache[urlOfCombo];
 } else {
  var jsonobj=new JSURL(urlOfCombo,true);
  var a=jsonobj.Response();
  obj=eval("("+a+")");
  if ( !(query in render_combobox.excludedvqr) ) {
    render_combobox.spcache[urlOfCombo]=obj;
  }
 }
 var combo=null;
 if(IsA(id,'C')) combo=Ctrl(id);
 else if (id && id.tagName=='SELECT') combo=id;
 var s='';
 var value_idx, key_idx, opt, selected=false;
 if (combo) {
  combo.innerHTML="";
  opt=new Option;
  opt.text='';
  opt.value='';
  combo.options[0]=opt;
 }
 value_idx=LibJavascript.Array.indexOf(obj.Fields,value);
 key_idx=LibJavascript.Array.indexOf(obj.Fields,key);
 if(value_idx==-1)
  value_idx=LibJavascript.Array.indexOf(obj.Fields,Lower(value));
 if(key_idx==-1)
  key_idx=LibJavascript.Array.indexOf(obj.Fields,Lower(key));
 var types=obj.Data[obj.Data.length-1].split(",")[1];
 function getHV(v,t) {
   if (t=='N') {
     v=WtH(Val(v),'N');
   }
   return v;
 }
 for(var i=0;i<obj.Data.length-1;i++){
  if (combo) {
   opt=new Option();
   opt.text=getHV(obj.Data[i][value_idx], types[value_idx]);
   opt.value=getHV(obj.Data[i][key_idx], types[key_idx]);
   if(Eq(select,Trim(obj.Data[i][key_idx]))) {
    opt.selected='selected';
    selected=true;
   }
   combo.options[combo.options.length]=opt;
  }else{
    s+="<option value="+ToHTMLValue(getHV(obj.Data[i][key_idx], types[key_idx]));
    if(Eq(select,Trim(obj.Data[i][key_idx]))) {
     s+=' SELECTED';
     selected=true;
    }
    s+=">"+getHV(obj.Data[i][value_idx], types[value_idx])+"</option>";
  }
 }
 if (!combo) {
  if (selected) {
   return '<option value=""></option>'+s;
  } else {
   return '<option value="" SELECTED></option>'+s;
  }
 } else {
  if (!selected) {
   combo.options[0].selected='selected';
  }
  if (IsMobile() && ('m_nCurrentRow' in window) ) {
   var i, opt, ctrl;
   if(IsA(id,'C')) {
    ctrl=Ctrl(id+"_"+m_nCurrentRow);
   } else if (id && id.tagName=='SELECT') {
    ctrl=Ctrl(id.id + +"_"+m_nCurrentRow);
   }
   if (ctrl) {
    ctrl.innerHTML = "";
    for(i=0; i<combo.options.length; i++){
     opt = new Option();
     opt.value = combo.options[i].value;
     opt.text = combo.options[i].text;
     opt.selected = combo.options[i].selected;
     ctrl.options[ctrl.options.length] = opt;
    }
   }
  }
 }
}
render_combobox.spcache={};
render_combobox.excludedvqr={};
function FillCombo(id, element, select, cb){
  function fill(values){
    var i, opt
      , ctrl = Ctrl(element)
      ;
    ctrl.innerHTML = "";
    for(i=0; i<values.length; i++){
      opt = new Option();
      opt.value = values[i][0];
      opt.text = values[i][1];
      if(select!=null && Eq(select,Trim(values[i][0].toString()))) {
        opt.selected='selected';
      }
      ctrl.options[ctrl.options.length] = opt;
    }
  if (cb) cb();
  }
  var values = window[id+'_Curs'];
  if ( values ) { // online
    fill(values)
  } else { // offline
    window[id+'_Settings'](function(res) {
      doQueryCombo(res, fill);
    });
  }
}
function _HistCheck(save){
var r=true,sh,startd,se=function(m,v){
r=false
if(_HistCheck.id=='SP_HISTORICAL_DATE')
m_cLastMsgError=AlertErrorMessage(m,v)
else
_SignErr(_HistCheck.id,m,v)
}
try{
if(typeof m_nChildStatus != 'undefined' && m_nChildStatus>0 && IsWndAccessible(m_oFather)){
sh=m_oFather.document.FSender.m_bSaveHistorical.value
startd=HtW(m_oFather.Ctrl(m_oFather._HistCheck.id).value,'D')
}else{
sh=document.FSender.m_bSaveHistorical.value
startd=HtW(Ctrl(_HistCheck.id).value,'D')
}
if(!m_bUpdated || Ne(sh,'true')){
}else if(Empty(startd)){
se('MSG_H_START_NOT_EMPTY')
}else if(Ge(m_dHistoricalcpfromdate,startd)){
se('MSG_H_START_U',WtH(m_dHistoricalcpfromdate,'D'))
}else if(!Empty(m_dHistoricalcptodate) && Le(m_dHistoricalcptodate,startd)){
se('MSG_H_END_U',WtH(m_dHistoricalcptodate,'D'))
}
}catch(e){
e/*x debug,non storico*/
}
return r
}
_HistCheck.id='SP_HISTORICAL_DATE'
function _HistZoneWrite(t1,t2,k){
var table,idx,tb,bar,btn,subst,ool,
mtype=_HistZoneWrite.MenuType(),
d=document,
odiv='SP_HISTORICAL_OUTER_DIV',
send="javascript:SetDisplay('"+odiv+"',false);SendData('save_historical')",
as="display:block;width:45px;height:45px;"
function pb(i,t,s,ce){
 if(ce){
  d=ce('div')
  d.style.cssText=bs(i)
  d.title=t
  d.appendChild(ce('a'))
  d.firstChild.href='javascript:'+s
  d.firstChild.style.cssText=as
  Ctrl('SP_HISTORICAL_OUTER_DIV').appendChild(d)
 }else{
  d.write("<div style='"+bs(i)+"' title="+ToHTMLValue(t)+">")
  d.write('<a href="javascript:'+s+'" style="'+as+'"></a>')
  d.write("</div>")
 }
}
function cs(n){
 return typeof m_nChildStatus !='undefined' && (n != null ? m_nChildStatus == n : true)
}
function hideshist(){
var v=SPTheme['sv_ShowSaveHistoricalNewStatus']
if(v==undefined){
v=false
}else if(v && _HistCheck.id!='SP_HISTORICAL_DATE'){
//presuppone che _HistZoneWrite sia stata chiamata dopo HideControlsUnderCondition
v=Ctrl(_HistCheck.id).style
v=v.display=='none'||v.visibility=='hidden'
}else{
v=!v
}
return v
}
function bs(i){
 return "cursor:pointer;float:right;width:45px;height:45px;background:url(\"../"+m_cThemePath+"/formPage/"+i+"\") no-repeat center"
}
try{
switch(mtype[0]){
case 'MenuView':
 btn=mtype[1]
 for(idx=0;idx<btn.ctrls.length && !IsA(btn.ctrls[idx],ZtVWeb.MenuViewCtrl);idx++);
 if(idx<btn.ctrls.length){
  btn=btn.ctrls[idx]
  bar=btn.datasource.xmlDoc.documentElement.selectNodes('//*/text()')
  for(idx=0;!tb && idx<bar.length;idx++) if(bar[idx].nodeValue.indexOf('SendData("save")') != -1 || bar[idx].nodeValue.indexOf("SendData('save')") != -1){
   subst=bar[idx].parentNode.parentNode
   subst.selectSingleNode('//'+bar[idx].parentNode.nodeName+'/text()').nodeValue=send
   subst.selectSingleNode('//'+btn.field_NodeDescr+'/text()').nodeValue=t1
   table=subst.selectNodes('//*/text()')
   for(var nn=0;nn<table.length;nn++){
    if(table[nn].nodeValue==send){
    }else if(table[nn].nodeValue.match(/((.+)\/)+/g)){
     table[nn].nodeValue=table[nn].nodeValue.match(/((.+)\/)+/g)[0]+'save_historical.png'
    }
   }
   tb=function(){
    var prev=typeof btn.next_to_action=='undefined'?'':btn.next_to_action
try{btn.next_to_action='save'
    btn.datasource.setXMLString('<SPVMNMenu>'+(typeof XMLSerializer!="undefined"?(new XMLSerializer()).serializeToString(subst):subst.xml)+'</SPVMNMenu>')
    return true
   }
    catch(e){
     e//debug
    }finally{
    btn.next_to_action=prev
    }
   }
  }
 }
break
case 'SlideToolbar':
 tb=mtype[1]
 bar=tb.toolbar
 tb=function(){
  return bar.NextToAction('save',t1,'save_historical.png','',send,'',t1)
 }
 break
case 'Toolbar':
 subst=mtype[1]
 table=mtype[3]
 btn=mtype[2].parentNode.cloneNode(true)
 btn.firstChild.href=send
 btn.firstChild.firstChild.src="../"+m_cThemePath+"/toolbar/save_historical.png"
 btn.firstChild.title=t1
 btn.firstChild.firstChild.nextSibling.nodeValue=t1
 mtype[2].parentNode.parentNode.insertBefore(btn,mtype[2].parentNode)
 mtype[2].parentNode.parentNode.insertBefore(mtype[2].parentNode.nextSibling.nextSibling.cloneNode(true),mtype[2].parentNode)
 tb=function(){
try
{ subst.parentNode.replaceChild(table,subst)
  return true
} catch(e) {
   return false
  }
 }
}
}
catch(e){
 e//debug
}
if(EntityStatus()=='Q' && !cs()){
 pb('query_historical_form.png',t1,"SubmitListenerForm('shide_historical_input')")
 pb('zoom_historical_form.png',t2,'Zoom('+(k?LibJavascript.ToJSValue(k):'false')+')')
}else if(EntityStatus()!='Q' && (!cs() || cs(0)) && tb){
 ool=OnLoad
 OnLoad=function(){
  ool.apply(window,arguments)
  if(EntityStatus()=='N'&&hideshist()){
   if(SPTheme['sv_ShowSaveHistoricalDIVNewStatus']){
    setTimeout(_HistZoneWrite.adoptLayer,0)
   }
  }else if(!tb()){
   SetDisplay(odiv,false)
   Ctrl(odiv).style.width=(parseInt(Ctrl(odiv).style.width) + 2*45)+'px'
   pb('save_historical_form.png',t1,"SendData('save_historical')",function(s){return document.createElement(s)})
  }else if(_HistCheck.id != 'SP_HISTORICAL_DATE'){
   Ctrl(odiv).style.height='0px'
  }
 }
 SetDisplay(odiv,true)
 Ctrl(odiv).style.width=(parseInt(Ctrl(odiv).style.width) - 2*45)+'px'
}else if(EntityStatus()!='Q' && (!cs() || cs(0))){
 pb('save_historical_form.png',t1,"SendData('save_historical')")
}else if(EntityStatus()=='Q' && (cs(1) || cs(2))){
 pb('zoom_historical_form.png',t1,'Zoom('+(k?LibJavascript.ToJSValue(k):'false')+',1)')
 pb('zoom_form.png',t2,'Zoom(null,1)')
}else if(EntityStatus()=='Q' && cs(0)){
 pb('query_historical_form.png',t1,"SubmitListenerForm('shide_historical_input')")
 pb('zoom_historical_form.png',t2,'Zoom('+(k?LibJavascript.ToJSValue(k):'false')+',1)')
}
}
_HistZoneWrite.MenuType=function(){
 var r,bar,idx,c
 if(typeof ZtVWeb=='undefined'){
 }else if(typeof ZtVWeb.MenuViewCtrl!='undefined' && (r=ZtVWeb.getPortletWindow('default_toolbar'))){
  return ['MenuView',r]
 }else if((r = ZtVWeb.getPortletWindow('default_title_form_ui')|| ZtVWeb.getPortletWindow('default_title_form')) && typeof r.toolbar != "undefined" && typeof r.toolbar.NextToAction == "function"){
  return ['SlideToolbar',r]
 }
 if (!r && (r = Ctrl("toolbarTR"))) {
  r = r.parentNode.parentNode
  c = r.cloneNode(true)
  bar = c.getElementsByTagName("a")
  for(idx=0;idx<bar.length;idx++) if (bar[idx].href.indexOf('SendData("save")') != -1  || bar[idx].href.indexOf("SendData('save')") != -1) {
   return ['Toolbar',r,bar[idx],c,r.getElementsByTagName("a")[idx]]
  }
 }
 return ['unknown']
}
_HistZoneWrite.adopted=[]
_HistZoneWrite.notAdopted=function(){
 return _HistZoneWrite.adopted.length==0
}
_HistZoneWrite.adoptLayer=function(c,hdiv){
var a=_HistZoneWrite.adopted,i,l,mtype
function cstyle(c){
if(typeof c.currentStyle=='undefined')
return document.defaultView.getComputedStyle(c,null)
else
return c.currentStyle
}
c=c||"SP_HISTORICAL_DIV"
if(EntityStatus()=='Q' || !SPTheme.hideSaveOnSaveHistorical) {
} else switch((mtype = _HistZoneWrite.MenuType())[0]){
case 'SlideToolbar':
 mtype[1].toolbar.HideItem('save')
 break
case 'Toolbar':
 if(mtype[4].parentNode.nextSibling.nextSibling.backgroundImage!='')
  mtype[4].parentNode.parentNode.removeChild(mtype[4].parentNode.nextSibling.nextSibling)
 mtype[4].parentNode.parentNode.removeChild(mtype[4].parentNode)
 break
}
if(typeof GetLayerID=="function" && GetLayerID(c)){
l=Ctrl(GetLayerID(c))
for(i=0;l.childNodes[i].className!='LayerBody' && i<l.childNodes.length;i++);
l=l.childNodes[i]
if(EntityStatus()!='Q'){
hdiv=hdiv||Ctrl('SP_HISTORICAL_OUTER_DIV')
hdiv.style.top=Val(cstyle(l).height)+'px'
l.style.height=(Val(hdiv.style.height)+Val(hdiv.style.top))+'px'
l.parentNode.style.height=Val(cstyle(l.parentNode).height)+Val(hdiv.style.height)+'px'
hdiv.parentNode.removeChild(hdiv)
l.appendChild(hdiv)
}
if(EntityStatus()=='Q' || LibJavascript.Array.indexOf(a,c)==-1){
ToggleLayerBox(null,l.parentNode,'--',false,'','',false)
}
if(EntityStatus()!='Q' && LibJavascript.Array.indexOf(a,c)==-1){
a[a.length]=c
return true
}
}
return false
}
function _ShowHistoricalTodate(d) {
if(Eq(d,new Date(2999,11,31,0,0,0,0))){
return NullDate()
}else{
return d
}
}
function FocusFirstComponent() {
  if ("postin_user" ==(window.m_cProgName || Zoom.p) )
   return
  var mode = window.m_cFunction in FocusFirstComponent ? m_cFunction : 'otherwise' ,
      page = window.m_cSelectedPage || 'page_1';
  if ( page in FocusFirstComponent[mode] ) {
    SetControlFocus(FocusFirstComponent[mode][page]);
  } else if ( window.tabs && tabs.Exists(page) ) {
    tabs.Select(page);
  }
}
FocusFirstComponent.otherwise={"page_1":[]};
function GetZoneArrayDifference(newZones,oldZones) {
 return LibJavascript.Array.filter(oldZones, function(el){
  return LibJavascript.Array.indexOf(newZones,el)==-1;
 });
}
function EmbeddedChild(){
  return window.parent!=window && window.frameElement && parent.document.getElementById("FrmMain");
}
function ManageFrames() {
  LibJavascript.Array.forEach(document.getElementsByClassName("EmbeddedChild"), function(iframe){
    if ( iframe.contentWindow.document.body && iframe.offsetHeight < iframe.contentWindow.document.body.offsetHeight ) {
      iframe.style.height = iframe.contentWindow.document.body.offsetHeight + 'px';
    }
  });
}

function SPParameterSource() {
  var url_args_decode = function () {
    var args_enc, el, i, nameval, ret, myname;
    ret = {};
    // strip off initial ? on search and split
    args_enc = document.location.search.substring(1).split('&');
    for (i = 0; i < args_enc.length; i++) {
      // convert + into space, split on =, and then decode
      args_enc[i].replace(/\+/g, ' ');
      nameval = args_enc[i].split('=');
      myname = nameval.splice(0,1);
      ret[decodeURIComponent(myname)] = decodeURIComponent(nameval.join('='));
    }
    // strip off initial # on search and split
    args_enc = document.location.hash.substring(1).split('&');
    for (i = 0; i < args_enc.length; i++) {
      // convert + into space, split on =, and then decode
      args_enc[i].replace(/\+/g, ' ');
      nameval = args_enc[i].split('=');
      myname = nameval.splice(0,1);
      ret[decodeURIComponent(myname)] = decodeURIComponent(nameval.join('='));
    }

    return ret;
  };

  this.params = url_args_decode();
  this.GetParameter=function(name, defaultvalue) {
    if (typeof (this.params[name])!='undefined') return PtW(this.params[name],getTypeFromValue(defaultvalue));
    else return defaultvalue;
  }
  this.HasParameter=function(name) {
    if (typeof (this.params[name])!='undefined') return true;
    else return false;
  }
  this.FillHash=function(newHashObj) {
    var sep = "#"
    var hash="";
    for (var name in newHashObj) {
      hash+=sep+name+"="+URLenc(newHashObj[name]);
      sep="&";
    }
    document.location.hash=hash;
  }
  function PtW(obj,type){
   switch(type){
   case 'L':
    return CharToBool(obj)
    break;
   case 'C': case 'M':
    return Trim(obj)
    break;
   case 'N':
    return Val(obj)
    break;
   case 'D':
    return CharToDate(obj.replace(/[^0123456789]/g,'').replace(/([0-9][0-9])([0-9][0-9])([0-9][0-9][0-9][0-9])/, "$3$2$1"))
    break;
   case 'T':
    return HtmlToWork_DateTime(ApplyPictureToDateTime(obj,TranslatePicture(dateTimePattern)))
    break;
  }
}
}
function MakeKeysHash(){
  var result="", sep = "";
  for (var i=0; i<m_PrimaryKeys.length;i++) {
    result+=sep+m_PrimaryKeys[i]+"="+URLenc(window["w_"+m_PrimaryKeys[i]]);
    sep="&";
  }
  return result;
}

function SetCurrentState() {
  var obj = {lastKeys:m_oLastKeyNames, lastValues:m_oLastKeyValues, recPos:m_nRecPos};
  if (history.pushState) {
    history.pushState( obj, document.title );
  }
}
function FillFromState(popStateEvt) {
  var obj = popStateEvt.state;
  if (obj && obj.lastKeys && obj.lastValues && obj.recPos) {
    m_oLastKeyNames = obj.lastKeys;
    m_oLastKeyValues = obj.lastValues
    m_nRecPos = obj.recPos;
    QuerySearch(true);
  }
}
function doQueryCombo(cmbSettings, fillFnc){
  // {"value":"descr","orderby":"perc_aliquota","table":"iva","key":"cod",filters:[{field:'fieldname',expr:'expr'}]}
  var i, sqlPhrase, query
    , where = ''
    , values = []
    , params = []
    ;
  if (Lower(Right(cmbSettings.table,4))=='.vqr') { //query
    var sep = ''
      , queryfilter = ''
      , c = new SPOfflineLib.HMCaller()
      ;
    // new (function() {
      // var values = {};
      // this.AddValue = function(name,value) {
        // if (Left(name,2)!='w_'){
          // name = 'w_' + name;
        // }
        // values[name] = value;
      // }
      // this.eval=function(str) {
        // return eval("with(values) { " + str + ";}");
      // }
    // })();
    var paramsQL = { caller: c, params : { queryname : cmbSettings.table.substring(0, cmbSettings.table.length - 4)} }; //tolgo .vqr;
    var ql = new QueryLoader(paramsQL);
    ql.LoadQuery();
    for(i=0; i<cmbSettings.filters.length; i++){
      var fldName = cmbSettings.filters[i].field;
      if( Left(fldName,1)=='?')
        fldName = Substr(fldName,2);
      if (ql.IsParameter(fldName)) {
        c.Set(fldName,cmbSettings.filters[i].expr);
      } else {
        where += sep + cmbSettings.filters[i].field + " = ?";
        params.push(cmbSettings.filters[i].expr);
        sep = ' and ';
      }
    }

    ql = new QueryLoader(paramsQL);
    ql.LoadQuery();
    ql.LoadTempWhere(where,params);
    var sql = ql.GetSqlExp();
    sqlPhrase = sql.sql;
    values = sql.params;

  } else { //tabella
    for(i=0; i<cmbSettings.filters.length; i++){
      where += cmbSettings.filters[i].field + "= ? ";
      if (i!=cmbSettings.filters.length-1){
        where += ' AND '
      }
      values.push(cmbSettings.filters[i].expr);
    }
    sqlPhrase = "SELECT "+cmbSettings.key+","+cmbSettings.value+
           " FROM "+cmbSettings.table+
           (where ? " WHERE "+where : '')+
           (cmbSettings.orderby ? ' ORDER BY '+cmbSettings.orderby : '')

  }
  query =
    { sql: sqlPhrase
    , params : values
    , success : function(rs) {
        var i, row
          , result = [["",""]]
          ;
        for(i=0; i<rs.rows.length; i++){
          row = rs.rows.item(i);
          result.push( [row[cmbSettings.key], row[cmbSettings.value]] );
        }
        fillFnc(result);
      }
    , error: function(error) {
        console.log("error in sql phrase"); debugger;
      }
    }
  ;
  CPPooler.connect( window.SPOfflineLib.getDataBaseName(), false, function () {
    CPPooler.singleQuery(query);
  } );

}

function LinkJavascriptOffline(p_documentloc){
  var l_oLinkJavascriptOffline = new LinkJavascript(p_documentloc);
  l_oLinkJavascriptOffline.keys = [];
  l_oLinkJavascriptOffline.fields = [];
  l_oLinkJavascriptOffline.rdvar = {};
  l_oLinkJavascriptOffline.SetDoubleKey = function (keyFieldName, keyFieldValue, len, dec, fe) {
    this.m_bEmptyKey = keyFieldValue == 0;
    this.keys.push( { name: keyFieldName
                    , value: keyFieldValue
                    , type: 'N'
                    } );
  }
  l_oLinkJavascriptOffline.SetStringKey = function (keyFieldName, keyFieldValue, len, dec) {
    this.m_bEmptyKey = keyFieldValue == "";
    this.keys.push( { name: keyFieldName
                    , value: keyFieldValue
                    , type: 'C'
                    } );
  }
  l_oLinkJavascriptOffline.SetBooleanKey = function (keyFieldName, keyFieldValue, len, dec) {
    this.m_bEmptyKey = keyFieldValue == false;
    this.keys.push( { name: keyFieldName
                    , value: keyFieldValue
                    , type: 'L'
                    } );
  }
  l_oLinkJavascriptOffline.SetDateKey = function (keyFieldName, keyFieldValue, len, dec) {
    this.m_bEmptyKey = keyFieldValue == "0100-01-01";
    this.keys.push( { name: keyFieldName
                    , value: keyFieldValue
                    , type: 'D'
                    } );
  }
  l_oLinkJavascriptOffline.SetDateTimeKey = function (keyFieldName, keyFieldValue, len, dec) {
    this.m_bEmptyKey = keyFieldValue == "0100-01-01 00:00:00";
    this.keys.push( { name: keyFieldName
                    , value: keyFieldValue
                    , type: 'T'
                    } );
  }
  l_oLinkJavascriptOffline.SetFields = function(p_cRdFields) {
    var i, l_oField
      , l_aFields = p_cRdFields.split(',');
      ;
    for ( i = 0; i < l_aFields.length; i++ ) {
      l_oField = this.fields[i];
      if ( !l_oField ) {
        this.fields[i] = { name : l_aFields[i] };
      } else {
        l_oField.name = l_aFields[i];
      }
    }
    this.m_cRdfields = p_cRdFields;
  }
  l_oLinkJavascriptOffline.SetTypes = function(p_cRdTypes) {
    var i, l_oField
      , l_aTypes = p_cRdTypes.split(',');
      ;
    for ( i = 0; i < l_aTypes.length; i++ ) {
      l_oField = this.fields[i];
      if ( !l_oField ) {
        this.fields[i] = { type : l_aTypes[i] };
      } else {
        l_oField.type = l_aTypes[i];
      }
    }
    this.m_cRdtypes = p_cRdTypes;
  }

  l_oLinkJavascriptOffline.GetFromResultSet = function (rs, p_nSearchAttempts, p_valueSearched) {
    /*
      Assegnazione this.askZoom mutuata da SPLinker.java (cercare "More data"):
      // controlla se ci sono altri record
      ...
      // non deve controllare se la ricerca era stata fatta con "like" sulla chiave primaria
    */
    if ( p_nSearchAttempts==0 && // e' il primo tentativo di ricerca
         ( typeof p_valueSearched == 'string' || p_valueSearched instanceof String ) && // il valore cercato e' una stringa
         ( rs.rows.length > 0 && // ci sono risultati
           p_valueSearched == rs.rows.item(0)[this.fields[0].name] // il valore del campo cercato nel primo record coincide perfettamente con il valore passato
         )
       ) {
      this.askZoom = false; // allora il valore va bene e si prende il primo record senza aprire lo zoom
    } else {
      this.askZoom = rs.rows.length > 1;
    }
    this.ok = true;
    var fieldName, i
      ;
    if ( !this.askZoom ) {
      for ( i=0; i<this.fields.length; i++ ) {
        fieldName = this.fields[i].name;
        this.rdvar[fieldName] = rs.rows.item(0)[fieldName];
      }
      if ( this.m_bFillEmptyKey ) {
        for (i=0;i<this.keys.length-1;i++) { //escludo l'rdfield
          fieldName = this.keys[i].name;
          this.rdvar[fieldName] = rs.rows.item(0)[fieldName];
        }
      }
    }
  }

  l_oLinkJavascriptOffline.DoLink = function (p_nKmode, p_fAtEndDoLink) {
    this.m_cWhereFieldExpr = "";
    this.m_cWhereFixedExpr = "";
    this.m_cWhereAddedFixedFilters = "";
    this.m_nDefaultRoutineResult = 1;
    this.m_oData = "";
    this.rdvar = {};

    function l_fDoQueryLink (p_aRdFields, p_nFldIdx, p_someValueToSearch, p_bUseLike, p_fAtEndDoLink) {
      var l_cSql, l_oQuery, i, l_oKey, l_cFieldFilter, l_cFixedFilter
        , l_aParams = [p_someValueToSearch]
        , l_aKeys = []
        , l_aFixedKeys = []
        , l_oField = p_aRdFields[p_nFldIdx]
        ;
      l_cSql = "SELECT " + _this.m_cRdfields;
      if ( _this.m_bFillEmptyKey ) {
        for (i=0;i<_this.keys.length-1;i++) { //escludo l'rdfield
          l_cSql += ", "+_this.keys[i].name;
        }
      }
      l_cSql += " FROM " + _this.m_cTable;
      l_cSql += " WHERE ";
      l_cSql += l_oField.name;
      l_cFieldFilter = l_oField.name;

      if ( p_bUseLike ) {
        l_cSql += " LIKE ";
        l_cFieldFilter += " LIKE ";
        l_aParams[0] += '%'
        l_cFieldFilter += CPSql.ToQueryValue( l_aParams[0], 'C', 0, 0 );
      } else {
        l_cSql += " =";
        l_cFieldFilter += " =";
        l_cFieldFilter += CPSql.ToQueryValue( l_aParams[0], l_oField.type, 0, 0 );
      }
      l_cSql += " ? ";

      l_cFixedFilter = "";
      for ( i = 0; i < _this.keys.length-1; i++ ) { //escludo l'rdfield
        l_oKey = _this.keys[i];
        if ( !_this.m_bFillEmptyKey  || !Empty(l_oKey.value) /*!= null && l_oField.name != l_oKey.name*/ ) {
          l_aKeys.push( l_oKey.name + ' = ?' );
          l_aFixedKeys.push( l_oKey.name + ' = ' + CPSql.ToQueryValue( l_oKey.value, l_oKey.type, 0, 0 ) );
          l_aParams.push( l_oKey.value );
        }
      }
      if ( l_aKeys.length ) {
        l_cSql += " AND ";
        l_cSql += l_aKeys.join(" AND ");
        l_cFixedFilter = l_aFixedKeys.join(" AND ")
      }

      if ( _this.m_cFiltersString ) {
        l_cSql += ' AND ' + _this.m_cFiltersString;
      }

      _this.m_cWhereFieldExpr = l_cFieldFilter;
      _this.m_cWhereFixedExpr = l_cFixedFilter;
      // _this.m_cWhereAddedFixedFilters // TO DO

      l_oQuery =
      { sql : l_cSql
      , params : l_aParams
      , success : function (rs) {
          l_fAtEndDoQueryLink( p_aRdFields, p_nFldIdx, p_someValueToSearch, p_bUseLike, rs );
        }
      , error : function error (err) {
          _this.ok = false;
          m_nLastError = 1;
          m_cLastMsgError = err.message;
          l_fClearStatusVars();
          p_fAtEndDoLink( -1 );
        }
      };
      CPPooler.connect( window.SPOfflineLib.getDataBaseName(), false, function () {
        CPPooler.singleQuery(l_oQuery);
      } );
    }

    function l_fAtEndDoQueryLink (p_aRdFields, p_nFldIdx, p_someValueToSearch, p_bUseLike, rs) {
      if ( rs.rows.length > 0 ) { // ci sono risultati
        _this.GetFromResultSet(rs, p_nFldIdx, p_someValueToSearch);
        l_fClearStatusVars();
        p_fAtEndDoLink( _this.askZoom ? 2 : 1 );
      } else if ( !p_bUseLike && p_aRdFields[p_nFldIdx].type == 'C' && p_nKmode > 0) { // ha terminato la ricerca di un campo 'C' con operatore '=' e non e' un link "secco" (aka p_nKmode==0, quando si viene da una Load)
        // esegue la ricerca sullo stesso campo con operatore 'like'
        l_fDoQueryLink( p_aRdFields, p_nFldIdx, p_someValueToSearch, true, p_fAtEndDoLink );
      } else if ( p_nFldIdx+1 < p_nKmode && p_nFldIdx < p_aRdFields.length) { // cerca sul campo successivo (se il num di search function aka p_nKmode lo permette)
        // esegue la ricerca sul campo successivo con operatore '='
        l_fDoQueryLink( p_aRdFields, p_nFldIdx+1, p_someValueToSearch, false, p_fAtEndDoLink );
      } else { // tentativi terminati, link fallito
        l_fClearStatusVars();
        p_fAtEndDoLink( 0 );
      }
    }

    function l_fClearStatusVars() {
      _this.keys = [];
      _this.fields = [];
      _this.m_cSearchingFunction = "";
      _this.m_bFillEmptyKey = false;
      _this.m_cParms = {};
      _this.m_cID = "";
      _this.m_bLooselyLinked = false;
      _this.m_cDefaultsFunction = "";
      _this.m_cFiltersString = "";
      _this.m_cAutozoom = "";
      _this.m_cKey = "";
      _this.m_cMode = "";
      _this.m_cRows = "";
    }

    var i, valueToSearch
      , searchingFieldName = this.fields[0].name
      , _this = this
      ;
    for ( i = 0; i < this.keys.length; i++ ) {
      if ( searchingFieldName == this.keys[i].name ) {
        valueToSearch = this.keys[i].value;
        break;
      }
    }
    if ( !this.m_bEmptyKey ) { // var valorizzata?
      l_fDoQueryLink( this.fields // array dei campi da riportare
                    , 0 // indice iniziale
                    , valueToSearch // valore di ricerca
                    , false // l_bUseLike
                    , p_fAtEndDoLink // callback da chiamare una volta terminato il link
                    );
    } else { // si sta svuotando la var linkata
      this.ok = true;
      this.askZoom = false;
      l_fClearStatusVars();
      p_fAtEndDoLink( 1 );
    }
  }

  return l_oLinkJavascriptOffline;
}

function GenerateLinkFrom(leftTbl, rightTbl, rightTblAlias, leftFld, rightFld) {
  var result = " LEFT OUTER JOIN " + rightTbl + " " + rightTblAlias + " ON " + leftTbl + "." + leftFld + "=" + rightTblAlias + "." + rightFld;
  return result;
}
function GenerateJoinCondition(leftTbl, rightTbl, rightTblAlias, leftFld, rightFld, joinCond) {
  var result = "";
  if (!joinCond) {
    result = " AND " + leftTbl + "." + leftFld + "=" + rightTblAlias + "." + rightFld;
  }
  return result;
}
function BuildSQLPhrase(p_cFields, p_cPhName, p_cWhereClause, p_cOrderByClause) {
  return "select " + p_cFields + " from " + p_cPhName +
            ( Empty(p_cWhereClause) ? "" : " where " + p_cWhereClause ) +
            ( Empty(p_cOrderByClause) ? "" : " order by " + p_cOrderByClause );
}

function SetPassedWorkVars(fieldsToExclude, p_fMethodCallback) {
  fieldsToExclude = fieldsToExclude || [];
  if (Eq(m_SPParameters.GetParameter('m_cMode',''),'hyperlink')) {
    var parmSeq = m_SPParameters.GetParameter('m_cParameterSequence','');
    var params = parmSeq.split(",");
    var i=0;
    function whileMethod() {
      if (i<params.length) {
        if (params[i].indexOf("m_")!=0 && typeof (window["Set_"+params[i]])!='undefined' && LibJavascript.Array.indexOf(fieldsToExclude,params[i])) {
          window["Set_"+params[i]](m_SPParameters.GetParameter(params[i],window["w_"+params[i]]),null,null,Set_callback);
        } else {
          Set_callback()
        }
        function Set_callback() {
          i++;
          whileMethod()
        }
      } else {
        endMethod();
      }
    }
    whileMethod();
    function endMethod() {
      p_fMethodCallback();
    }
  } else {
    p_fMethodCallback();
  }
}
function CloseEnclosing(frameback){
 if(IsInModalLayer()) {
  window.parent.spModalLayer[window.frameElement.id].close()
 } else if(frameback && window.frameElement) {
  history.back(-1)
 } else if(CloseEnclosing.nat.apply){
  CloseEnclosing.nat.apply(window)
 } else {
  CloseEnclosing.nat()
 }
}
CloseEnclosing.nat=window.close;
function IsInModalLayer(){
  try {
  return window.frameElement && window.frameElement.getAttribute('modallayer')
  } catch(e){
  return false;
  }
}
function GetEditDetailButton() {
  return (SPTheme && SPTheme.formGridEditRowImage ? '../'+m_cThemePath+'/'+SPTheme.formGridEditRowImage : '../'+m_cThemePath+'/images/formPage/grid_edit.png');
}
function SubstituteInterface(p_cLayerName) {
  var layerId;
  var frmMain = Ctrl("FrmMain");
  if ('GetLayerID' in window)
    layerId = GetLayerID(p_cLayerName);
  if (layerId) {
    var cntDiv = document.createElement("div");
    frmMain.appendChild(cntDiv);
    cntDiv.style.display='none';
    for (var ii=0; ii<frmMain.childNodes.length;) {
      if (frmMain.childNodes[ii] != cntDiv)
        cntDiv.appendChild(frmMain.removeChild(frmMain.childNodes[ii]));
      else
        ii++;
    }
    var layerBody = Ctrl(Strtran(layerId,'_DIV',''));
    frmMain.appendChild(layerBody.parentNode.removeChild(layerBody));
    if (Lower(p_cLayerName)=='editrow' && window.MoveFixedPosVarsIntoLayer) {
      MoveFixedPosVarsIntoLayer()
    }
  }
  frmMain.style.display='';
}
function FocusLayerFirstComponent(layer) {
  if (layer in FocusLayerFirstComponent.Layers) {
    SetControlFocus(FocusLayerFirstComponent.Layers[layer]);
  }
}
function ToggleNotifyContainer(){
  var c=Ctrl('listNotify');
  if (c){
    if (c.style.display=='none'){
      c.style.display='block';
      var elements=c.getElementsByClassName('notify_item');
      var empty=true;
      for (var i=0; i<elements.length; i++){
        if (elements[i].style.display!='none'){
          empty=false;
          var id=Strtran(elements[i].id,'_DIV','');
          var icon=Ctrl(id+'_icon');
          if (icon){
            var iconDimension=icon.offsetWidth+parseInt(LibJavascript.DOM.getComputedStyle( icon, "marginRight" ))+parseInt(LibJavascript.DOM.getComputedStyle( icon, "marginLeft" ));
            var space=elements[i].offsetWidth-parseInt(LibJavascript.DOM.getComputedStyle( elements[i], "paddingLeft" ))-parseInt(LibJavascript.DOM.getComputedStyle( elements[i], "paddingRight" ))-iconDimension;
            Ctrl(id).style.maxWidth=space+'px';
          }
        }
      }
      if (empty)
        c.getElementsByClassName('empty_notify')[0].style.display='block';
      else
        c.getElementsByClassName('empty_notify')[0].style.display='none';
      return true;
    }
    else c.style.display='none';
  }
  return false;
}

function CloseNotify(id){
  Ctrl(id+'_notify').parentNode.style.display='none';
}

function ShowNotify(c, cond, blockClose){
  if (typeof c == 'string')
    c = Ctrl(c)
  var n=document.getElementById('listNotify');
  if (c){
    var el=c.parentNode;
    if (cond){
      el.style.display='none';
      if (Ctrl(c.id+'_notify'))
        Ctrl(c.id+'_notify').parentNode.style.display='none'
      var empty=true;
      var elements=n.getElementsByClassName('notify_item');
      for (var i=0; i<elements.length && empty; i++)
        if (elements[i].style.display!='none')
          empty=false;
      if (empty)
        n.getElementsByClassName('empty_notify')[0].style.display='block'
    }
    else {
      // if (el.style.display=='none'){
        // devo far apparire una notifica
        el.style.display='table';
        var text=c.textContent||c.innerText;
        var div=Ctrl(c.id+'_notify');
        div.parentNode.style.display='block';
        div.innerHTML=text;
        div.parentNode.style.height='auto';
        div.parentNode.style.opacity='1';
        var iconDimension=0,icon=Ctrl(c.id+'_notify_icon'),space;
        if (icon)
          iconDimension=icon.offsetWidth+parseInt(LibJavascript.DOM.getComputedStyle( icon, "marginRight" ))+parseInt(LibJavascript.DOM.getComputedStyle( icon, "marginLeft" ));
        if (el.parentNode.style.display!='none'){
          space=el.parentNode.offsetWidth-parseInt(LibJavascript.DOM.getComputedStyle( el.parentNode, "paddingLeft" ))-parseInt(LibJavascript.DOM.getComputedStyle( el.parentNode, "paddingRight" ))-iconDimension;
          c.style.maxWidth=space+'px';
        }
        space=div.parentNode.offsetWidth-parseInt(LibJavascript.DOM.getComputedStyle( div.parentNode, "paddingLeft" ))-parseInt(LibJavascript.DOM.getComputedStyle( div.parentNode, "paddingRight" ))-iconDimension;
        div.style.maxWidth=space+'px'
        n.getElementsByClassName('empty_notify')[0].style.display='none';
        if (!blockClose){
          window.setTimeout(function(){
            div.parentNode.style.opacity='0';
          },2000)
          window.setTimeout(function(){
            div.parentNode.style.display='none';
          },3000)
        }
      // }
    }
  }
}
function isMaskExpand(){
  return !LibJavascript.CssClassNameUtils.hasClass(Ctrl('bodyDiv'),'reduced')
}
function ExpandReduce(){
  if (isMaskExpand())
    LibJavascript.CssClassNameUtils.addClass(Ctrl('bodyDiv'),'reduced')
  else
    LibJavascript.CssClassNameUtils.removeClass(Ctrl('bodyDiv'),'reduced')
}

FocusLayerFirstComponent.Layers={};

function calculateSidebarBandsPosition( p_cPageId ) {
  if (typeof(p_cPageId)=='undefined' || p_cPageId == null) p_cPageId = 'page_1';
  var band, minTop, curBottom, j,
      sidebar = LibJavascript.DOM.Ctrl('sidebar_'+p_cPageId),
      page_div = document.getElementById(p_cPageId),
      sidebands = LibJavascript.CssClassNameUtils.getElementsByClassName('sidebar_band_wrapper',sidebar,'div') || [];
  if ( !page_div || page_div.style.display=='none' ) return;
  if (sidebar && sidebar.style.left=='') { //non e' stata riposizionata dentro alla pagina
    if (!calculateSidebarBandsPosition.sidebarWidth) {
      var cr_page = page_div.getBoundingClientRect(),
          cr_bar = sidebar.getBoundingClientRect();
      calculateSidebarBandsPosition.sidebarWidth = Math.max(sidebar.offsetWidth + cr_bar.left - cr_page.right, 0);
    }
    sidebar.style.left = 'calc(100% - ' + calculateSidebarBandsPosition.sidebarWidth + 'px)';
    page_div.style.paddingRight = calculateSidebarBandsPosition.sidebarWidth + 'px';
  } else if ( page_div.style.paddingRight=='' && calculateSidebarBandsPosition.sidebarWidth ) {
    page_div.style.paddingRight = calculateSidebarBandsPosition.sidebarWidth + 'px';
  }
  //se non ci sono bande non ci sono neanche sidebands
  for (var i=0;i<sidebands.length;i++) {
    band = document.getElementById(sidebands[i].getAttribute('band_id'));
    if (band.offsetHeight===0) {
      sidebands[i].style.display = 'none';
      continue;
    } else {
      sidebands[i].style.display = 'block';
      //da valutare se far partire la banda dall'inizio del titolo o del contenuto
      /* var tmp = document.getElementById(band.id+'_DIV');
      if (tmp) {
        band = tmp;
       } */
    }
    //essendo la banda visibile funziona il getPosFromFirstRel
    minTop = LibJavascript.DOM.getPosFromFirstRel(band,page_div.firstChild).y
    curBottom = 0;
    j = i-1;
    while (j>=0 && curBottom == 0) {
      if ( sidebands[j].offsetHeight!= 0 ) { //trovato banda subito superiore
        curBottom = sidebands[j].offsetTop + sidebands[j].offsetHeight
      }
      j--;
    }
    if (minTop > curBottom) {
      sidebands[i].style.marginTop = ( minTop - curBottom ) + 'px';
    } else {
      sidebands[i].style.marginTop = '';
    }
  }
}
