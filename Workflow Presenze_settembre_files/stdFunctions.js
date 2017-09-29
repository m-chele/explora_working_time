//Copyright 2004 and onwards Zucchetti Spa.
var decSep, milSep, dragObj = {zIndex:999,resize:'',iW:0,minW:280,minH:30}, dataFormatSetByapplication, datePattern, dateTimePattern, FormatDateSwapItalian
//dragObj.zOrder = 1000

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

function SetNumberSettings() {
var i,j,sep,s,ca,c,r,k,rsk=['dataFormatSetByapplication','milSep','decSep','datePattern','dateTimePattern','FormatDateSwapItalian'],uFF40="\uFF40"
function normKey(){
 return SetNumberSettings.normKey('com.zucchetti.sitepainter.rs.')
}
function findLSindex(){
 for(i=0; i<localStorage.length;i++) {
  s=localStorage.key(i)
  for(j=0;j< s.length && i < c.length && s.charAt(j)==c.charAt(j);j++);
  if (sep.length<j && s.substring(0,j).indexOf('stdFunctions.js') != -1) {
   sep=s.substring(0,j)
   ca=i
  }
 }
}
try{
 ca=document.cookie.split(';')
 for(k=0;k<rsk.length;k++){
  s=rsk[k]
  for(i=0;i < ca.length;i++) {
   c = ca[i]
   while (c.charAt(0)==' ')
    c = c.substring(1,c.length)
   if (c.indexOf('sprsc=') == 0)
    r=c.substring('sprsc='.length,c.length)
   else
    continue
   sep=r.split(/A/)
   if (sep.length==0)
    break
   for(j=0;j<sep.length;j++) if (sep[j]==s) {
    window[s]=''
    break
   }
   sep=sep[j+1].split(/N/)
   for(j=0; j < sep.length ; j++) if(sep[j]!=""){
    window[s] += String.fromCharCode(sep[j]-0)
   }
   break
  }
 }
 if(sep)
  localStorage.setItem(normKey(),decSep+uFF40+milSep+uFF40+dataFormatSetByapplication+uFF40+datePattern+uFF40+dateTimePattern+uFF40+FormatDateSwapItalian)
 if(r)
  localStorage.removeItem(DateTime.key())
 if(decSep && milSep){
  return
 }else{
  c=normKey()
  sep=''
  ca=null
  findLSindex()
  if(ca==null){
  }else if(r){
   localStorage.removeItem(localStorage.key(ca))
   localStorage.removeItem(DateTime.key())
  }else{
   decSep=localStorage.getItem(localStorage.key(ca)).split(uFF40)
   milSep=decSep[1]
   dataFormatSetByapplication=decSep[2]
   datePattern=decSep[3]
   dateTimePattern=decSep[4]
   FormatDateSwapItalian=decSep[5]
   decSep=decSep[0]
  }
 }
}catch(noAppRS){
  try {
   c=normKey()
   ca=null
   if(r)
    findLSindex()
   if(ca!=null)
    localStorage.removeItem(localStorage.key(ca))
   if(ca!=null||r)
    localStorage.removeItem(DateTime.key())
  }catch(noLocalStorage){
   }
 }
if(decSep && milSep)
 return
if(IsDeviceMobile() && (navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage||'').toLowerCase().indexOf('it') != -1) {
 decSep = ','
 milSep = '.'
}else try {
 var s = (1.2).toLocaleString()
 decSep = s.substr(1,1)
 s = (1000).toLocaleString()
 milSep = s.substr(1,1)
 if (milSep=="0") milSep=(decSep==','?'.':',');
}catch(except) {
  decSep = '.'
  milSep = ','
}
dataFormatSetByapplication="N"
datePattern="DD-MM-YYYY"
dateTimePattern="DD-MM-YYYY hh:mm:ss"
FormatDateSwapItalian=""
}
SetNumberSettings.normKey=function(p){
 var r,i,a,s=document.scripts
 if (!s)
  s = document.getElementsByTagName('script')
 for (i = 0; i < s.length; i++) if (At("stdFunctions.js",s[i].src)>0) {
  r=s[i].src.replace(/servlet\/SPPrxy\/[^\/]+\//,'')
  if (Left(r,4)!='http')
   r = document.location.toString()+r
  a = document.createElement('a')
  a.href = r
  return p+a.protocol+'//'+a.hostname+':'+a.port+a.pathname.replace(/^([^\/])/,'/$1')
 }
}

function Replicate(str,n){
  if (str==null) return ""
  if (!IsA(str,'C')) return ""
  if (n==null) n=1
  if (!IsA(n,'N')) n=1
  var r=""
  for(var i=0;i<n;i++) {
    r=r+str
  }
  return r
}

function Space(n){
  return Replicate(" ",n)
}

function Trim(str,chr){
  if (str==null) return ""
  var i=1, l=str.length
  chr=!IsA(chr,'U')?""+chr:' '
  while (i<=l && str.charAt(l-i)==chr)
    i++
  return str.substring(0,l-i+1)
}

function RTrim(str,chr){
  return Trim(str,chr)
}

function LTrim(str,chr){
  var i=0, l=str.length
  chr=!IsA(chr,'U')?""+chr:' '
  while (i<l && str.charAt(i)==chr)
    i++
  return str.substring(i)
}

function LRTrim(str,chr){
  return LTrim(Trim(str,chr),chr)
}

function Left(str,len) {
  if (IsA(str,'C') && IsA(len,'N')) {
    return(str.substr(0,len))
  } else {
    return ''
  }
}

function Right(str,len) {
  if (IsA(str,'C')) {
    return str.substr(Math.max(0,str.length-len));
  } else {
    return ''
  }
}

function Strtran(src,find,repl){
 var sb = [],
     b = 0,
     e = find.length>0 ? src.indexOf(find) : -1 ;
 while (e > -1) {
  if (b!=e) sb.push(src.substring(b, e));
  if (typeof(repl)!='string' || repl.length>0) sb.push(repl);
  b = e + find.length;
  e = src.indexOf(find, b);
 }
 sb.push(src.substring(b));
 return sb.join("");
}

function Substr(str,pos,cnt) {
  if (!IsA(str,'C')) return ''
  if (IsA(pos,'N')) {
    pos-=1
    if (pos<0) return ""
    if (IsA(cnt,'N')){
      if (cnt<1) return ""
      return str.substr(pos,cnt)
    } else {
      return str.substr(pos)
    }
  } else if (pos==null) {
    return str.substr()
  } else {
    return ''
  }
}

function Upper(str) {
  if (IsA(str,'C')) return str.toUpperCase(); else return ''
}

function Lower(str) {
  if (IsA(str,'C')) return str.toLowerCase(); else return ''
}

function Val(str) {
  if (IsA(str,'C')) {
    var n=parseFloat(str);
    if (isNaN(n)) {
      return(0);
    }
    else {
      return(n);
    }
  } else {
    return(0)
  }
}

function Str(p_n,len,dec) {
  if (p_n==null) {p_n=0}
  if (!IsA(p_n,'N')) {p_n=0}
  if (len==null) {len=10}
  if (!IsA(len,'N')) {len=10}
  if (dec==null) {dec=0}
  if (!IsA(dec,'N')) {dec=0}
  var res=p_n.toString()
  var point=At(".",res)
  if (point==0) res=res+".0"
  res+=Replicate("0",dec-Len(res)+At(".",res));
  point=At(".",res)
  if (point<=len+1) {
    res=Substr(res,1,dec>0 ? point+dec: point-1);
    if (res.length> len) {
      res=Substr(res,1,len)
      if (res.charAt(len-1)=='.')
        res=Substr(res,1,len-1);
    }
    len=len-res.length
    for(;len>0;len--) {
      res=" "+res
    }
  } else {
    res="";
    for(;len>0;len--)
      res+="*"
  }
  return res
}

function At(p_cStrFind,p_cStr,cnt) {
  // Resituisce la posizione di una stringa in un'altra.
  // Il param opz. "cnt" indica quale occorrenza e' richiesta
  if (cnt<=0 || !IsA(cnt,'N')) {cnt=1}
  if (p_cStrFind==null || p_cStrFind=="") {return 0}
  var l=0
  var pos=-1;
  while (l<cnt) {
    pos=p_cStr.indexOf(p_cStrFind, pos+1) ;
    l++;
  }
  return pos+1;
}

function RAt(p_cStrFind,p_cStr,cnt) {
  // Resituisce la posizione di una stringa in un'altra iniziando la ricerca da destra.
  // Il param opz. "cnt" indica quale occorrenza e' richiesta
  if (cnt<=0 || !IsA(cnt,'N')) {cnt=1}
  if (p_cStrFind==null || p_cStrFind=="") {return 0}
  var l=0
  var pos=p_cStr.length+1;
  while (l<cnt) {
    pos=p_cStr.lastIndexOf(p_cStrFind, pos-1) ;
    l++;
  }
  return pos+1;
}

function ZeroPad(str,size) {
  if (!IsA(str,'C')) return ''
  while (str.length<size) {
   str='0'+str
  }
  return str
}

function Len(obj) {
  //Resituisce la lunghezza di una stringa o array
  return obj.length
}

function Asc(str) {
  if (str==null || str.length==0) return -1
  return str.charCodeAt(0)
}

function Chr(num){
  return String.fromCharCode(num)
}

function Max(a,b) {
  return ((Gt(a,b))?a:b)
}

function Min(a,b) {
  return ((Gt(a,b))?b:a)
}

function Mod(a,b) {
 var r = a % b
 if (Eq(Math.abs(r),Math.abs(b)))
  return 0
 else
  return r
}

function Floor(a,b) {
  return Math.floor(a,b)
}

function IsNumber(kCode) {
  //44-->Comma ascii code , 45-->Minus ascii code, 46-->Point ascii code
  return IsDigit(kCode) || kCode==44 || kCode==45 || kCode==46;
}

function IsDigit(kCode) {
  return kCode > 47 && kCode < 58;
}

function IsAlpha(kCode) {
  return (kCode>64 && kCode<91) || (kCode>96 && kCode<123);
}

function BoolToChar(b) {
  if ( IsA(b, 'L') )
    return b ? "t" : "f";
  return "f";
}

function CharToBool(s) {
  return 'true'==Trim(Lower(s));
}

function NullDate() {
  return new Date(100,0,1,0,0,0,0)
}

function NullDateTime() {
  return NullDate();
}

function DateToChar(obj) {
  if (IsA(obj,'D'))
    return zeroFill(''+obj.getFullYear(),4)+zeroFill(''+(obj.getMonth()+1),2)+zeroFill(''+obj.getDate(),2);
  return '';
}

function DateTimeToChar(obj) {
  if (IsA(obj,'D'))
    return zeroFill(''+obj.getFullYear(),4)+zeroFill(''+(obj.getMonth()+1),2)+zeroFill(''+obj.getDate(),2)+zeroFill(''+obj.getHours(),2)+zeroFill(''+obj.getMinutes(),2)+zeroFill(''+obj.getSeconds(),2);
  return '';
}

function CharToDate(obj) {
  if (!Empty(obj) && IsA(obj,'C')) {
    var year,month,day
    var fstSlash = obj.indexOf("/")
    var lstSlash = obj.lastIndexOf("/")
    if ((obj.indexOf("/", fstSlash + 1) == lstSlash) && (lstSlash == Len(obj) - 5)) {
      day = Val(Left(obj, fstSlash))
      month = Val(Substr(obj, fstSlash + 2, lstSlash - fstSlash))
      year = Val(Right(obj, 4))
      return new Date(year,month-1,day,0,0,0,0)
    }
    else{
      return new Date(Val(Substr(obj,1,4)),Val(Substr(obj,5,2))-1,Val(Substr(obj,7,2)),0,0,0,0)
    }
  }
  return new Date(100,0,1,0,0,0,0)
}

function CharToDateTime(obj) {
  if (!Empty(obj) && IsA(obj,'C')) {
    return new Date(Val(Substr(obj,1,4)),Val(Substr(obj,5,2))-1,Val(Substr(obj,7,2)),
                    Val(Substr(obj,9,2)),Val(Substr(obj,11,2)),Val(Substr(obj,13,2)),0)
  }

  return new Date(100,0,1,0,0,0,0)
}

function DayOfWeek(obj) {
  if (Eq(obj,NullDate())) return 0
  if (IsA(obj,'D')) {
    return obj.getDay()+1
  }
  return 0
}

function Sec(obj) {
  if (Eq(obj,NullDateTime())) return 0
  if (IsA(obj,'D')) {
    return obj.getSeconds()
  }
  return 0
}

function Minute(obj) {
  if (Eq(obj,NullDateTime())) return 0
  if (IsA(obj,'D')) {
    return obj.getMinutes()
  }
  return 0
}

function Hour(obj) {
  if (Eq(obj,NullDateTime())) return 0
  if (IsA(obj,'D')) {
    return obj.getHours()
  }
  return 0
}

function Day(obj) {
  if (Eq(obj,NullDate())) return 0
  if (IsA(obj,'D')) {
    return obj.getDate()
  }
  return 0
}

function Month(obj) {
  if (Eq(obj,NullDate())) return 0
  if (IsA(obj,'D')) {
    return obj.getMonth()+1
  }
  return 0
}

function Year(obj) {
  if (Eq(obj,NullDate())) return 0
  if (IsA(obj,'D')) {
    return obj.getFullYear()
  }
  return 0
}

function Week(obj) {
  if (Eq(obj,NullDate())) return 0
  if (IsA(obj,'D')) {
    // modified version from http://www.phys.uu.nl/~vgent/calendar/isocalendar_text5.htm to return isoweeknr
    function gregdaynumber(year,month,day){
      // computes the day number since 0 January 0 CE (Gregorian)
      var y=year
      var m=month;
      if(month < 3) y=y-1;
      if(month < 3) m=m+12;
      return Math.floor(365.25*y)-Math.floor(y/100)+Math.floor(y/400)+Math.floor(30.6*(m+1))+day-62;
    }
    // computes the ISO calendar date from the current Gregorian date
    var year=obj.getFullYear();
    var month=obj.getMonth(); // 0=January, 1=February, etc.
    var day=obj.getDate();
    var weekday=((obj.getDay()+6)%7)+1; // weekdays will be numbered 1 to 7
    var d0=gregdaynumber(year,1,0);
    var weekday0=((d0+4)%7)+1;
    var d=gregdaynumber(year,month+1,day);
    var isoweeknr=Math.floor((d-d0+weekday0+6)/7)-Math.floor((weekday0+3)/7);
    // check whether the last few days of December belong to the next year's ISO week
    if((month == 11) && ((day-weekday) > 27)){
      isoweeknr=1;
    }
    // check whether the first few days of January belong to the previous year's ISO week
    if((month == 0) && ((weekday-day) > 3)){
      d0=gregdaynumber(year-1,1,0);
      weekday0=((d0+4)%7)+1;
      isoweeknr=Math.floor((d-d0+weekday0+6)/7)-Math.floor((weekday0+3)/7);
    }
    return isoweeknr;
  }
  return 0
}

function floorDivide( numerator, denominator,  remainder) {
  if (remainder==null) remainder=[0]
  if (numerator >= 0) {
    remainder[0] = numerator % denominator
    return Math.floor(numerator / denominator)
  }
  var quotient = Math.floor((numerator + 1) / denominator) - 1;
  remainder[0] = numerator - (quotient * denominator);
  return quotient
}

var day_of_year_offset= [0,31,59,90,120,151,181,212,243,273,304,334];

function IsLeapYear(year){
return (year%4==0 && year%100!=0) || (year%400==0);
}

function DaysOfMonth(month,year){
switch(month){
case 1:
case 3:
case 5:
case 7:
case 8:
case 10:
case 12:
  return 31;
case 4:
case 6:
case 9:
case 11:
  return 30;
case 2:
  return IsLeapYear(year)? 29: 28;
default:
  return 0;
}
}

function DaysOfYear(year){
if(year>0)
return IsLeapYear(year)? 366: 365;
else
return -1;
}

function DayOfYear(day,month,year){
if((day>0)&&(month>0)&&(year>0))
return day + day_of_year_offset[month-1] + (month>2 && IsLeapYear(year)? 1: 0);
else
return -1;
}

function AddDays(a,days) {
  if (Empty(a)) return NullDate();
  if (days==0) return a;
  var day=Day(a);
  var month=Month(a);
  var year=Year(a);

  if (days>0) {
    var days_of_month=DaysOfMonth(month,year);
    for(;days>0;days--) {
      if (++day>days_of_month) {
        if (++month>12) {
          year++;
          month=1;
        }
        day=1;
        days_of_month=DaysOfMonth(month,year);
      }
    }
  }
  else {
    for (;days<0;days++) {
      if (--day<1) {
        if (--month<1) {
          year--;
          month=12;
        }
        day=DaysOfMonth(month,year);
      }
    }
  }
  return new Date(year,month-1,day,Hour(a),Minute(a),Sec(a),0);
}

function TernsCmp(xa,ya,za,xb,yb,zb){
if(za>zb)
return 1;
if(za<zb)
return -1;
if(ya>yb)
return 1;
if(ya<yb)
return -1;
if(xa>xb)
return 1;
if(xa<xb)
return -1;
return 0;
}

function DaysBetw(dayL,monthL,yearL,dayH,monthH,yearH){
var neg=false;
if(TernsCmp(dayL,monthL,yearL,dayH,monthH,yearH)==0)
return 0;
if(TernsCmp(dayL,monthL,yearL,dayH,monthH,yearH)>0){
var back;
back=yearL;
yearL=yearH;
yearH=back;
back=monthL;
monthL=monthH;
monthH=back;
back=dayL;
dayL=dayH;
dayH=back;
neg=true;
}
var days = -DayOfYear(dayL,monthL,yearL);
var y;
for (y=yearL; y<yearH; y++) days += DaysOfYear(y);
days += DayOfYear(dayH,monthH,yearH);
if(neg)
return -days;
return days;
}

function DaysBetween(low,high) {
if(Empty(low)&&Empty(high))
return 0;
else
if (Empty(low)||Empty(high))
return 0;
return DaysBetw(Day(low),Month(low),Year(low),Day(high),Month(high),Year(high));
}

function DateDiff(low,high){
if(Empty(low)||Empty(high)){
return 0
}else{
var f=function(d){
return (Sec(d)+Minute(d)*60+Hour(d)*3600)/86400
}
return DaysBetween(low,high)+f(high)-f(low)
}
}

function iif(expr,trueExpr,falseExpr) {
  return ((expr)?trueExpr:falseExpr)
}

function zeroFill(varValue,len) {
  if ("0123456789".indexOf(varValue.charAt(0)) > -1) {
    while (varValue.length < len)
      varValue = '0' + varValue;
  }
  return varValue
}
function Round(n,d) {
var res,l;
if (d>0) {
  l = Round.pow10(d);
  var nn = Math.abs(n),
         nl = nn*l,
         rmd= nn%(1/l)*l;
  res = Math.floor(nl+0.5);
  var sc = Math.max(0,Round.getScale(nn)+d);

  if (sc<=14 && Math.abs(rmd-0.5)>=Round.lim[sc]) {
    res = (n>0?1:-1)*res/l;
  } else {
    var r2=jsImpl2(nn,15-sc+d);
    res = jsImpl2((n>0?1:-1)*r2,d);
  }
} else {
  l = Round.pow10(Math.abs(d));
  res = Math.floor(n/l+0.5)*l;
}
return res;


function jsImpl2(n,d) {
var s=Lower(''+n),add="",e=0,p=At(".",s);
if(At("e",s)>0){
  e=Val(Substr(s,At("e",s)+1));
  s=Left(s,At("e",s)-1);
  s=Strtran(s,".","");
  if (e>0) {
    s+=Replicate("0",e);
    s=Left(s,p+e-1)+"."+Right(s,Len(s)-p-e+1);
  } else {
    e = -e;
    d -= e;
    if (n<0) {
      s="-0."+Replicate("0",e-1)+Substr(s,2);
    } else {
      s="0."+Replicate("0",e-1)+s;
    }
  }
}
if (p>0){
  if (Len(s) < p+e+d+1) {
    s+=Replicate("0",Len(s) - p+e+d+1);
  }
  switch(Substr(s,p+e+d+1,1).charAt(0)){
    case '0':case'1':case'2':case'3':case'4':
      s=Left(s,p+e+d);
    break;
    case '5':case '6':case'7':case'8':case'9':
      if (n<0 && "5"==Substr(s,p+e+d+1,1) && Val(Substr(s,p+e+d+2))==0) {
        s=Left(s,p+e+d);
      } else {
        s=Left(s,p+e+d);
        while (Len(s)>0 && "9.".indexOf(Right(s,1))!=-1) {
          if("."==Right(s,1)){
            add = " ";
          } else if(" "==add) {
            add ="0";
          } else if(Len(add)>0) {
            add +="0";
          }
          s=Left(s,Len(s)-1);
        }
        if("-"==s)
          s = "-1"+add;
        else
          s = Left(s,Len(s)-1)+Str(Val(Right(s,1))+1,1)+add;
      }
    break;
    case'.':
    break;
  }
}
return Val(s);
}
}
Round.pow10=function(p){
try{
return [1,10,100,1000,10000,100000,1E6,1E7,1E8,1E9,1E10,1E11,1E12,1E13,1E14,1E15,1E16,1E17,1E18,1E19,1E20,1E21,1E22,1E22,1E23,1E24,1E25][p]
}catch(highD){
return Math.pow(10,p)
}
}
Round.lim=[0.0000000001,0.0000000001,0.0000000001,0.0000000001,0.0000000001,0.0000000001,0.0000000002,0.000000001,0.00000001,0.0000001,0.000001,0.000015,0.0002,0.002,0.02,0.15,0.6];
Round.getScale=function(nn){
var sc=0;
if (nn>=1000) {
  if (nn>=1E9) {
    if (nn>=1E14)
      sc=15;
    else if (nn>=1E13)
      sc=14;
    else if (nn>=1E12)
      sc=13;
    else if (nn>=1E11)
      sc=12;
    else if (nn>=1E10)
      sc=11;
    else
      sc=10;
 } else {
   if (nn>=1E8)
     sc=9;
   else if (nn>=1E7)
     sc=8;
   else if (nn>=1000000)
     sc=7;
   else if (nn>=100000)
     sc=6;
   else if (nn>=10000)
     sc=5;
   else
     sc=4;
 }
} else {
  if (nn>=0.001) {
    if (nn>=100)
      sc=3;
    else if (nn>=10)
      sc=2;
    else if (nn>=1)
      sc=1;
    else if (nn>=0.1)
      sc=0;
    else if(nn>=0.01)
      sc=-1;
    else
     sc=-2;
  } else {
     if(nn>=0.0001)
       sc=-3;
     else if(nn>=0.00001)
       sc=-4;
     else if(nn>=0.000001)
       sc=-5;
     else if(nn>=0.0000001)
       sc=-6;
     else
       sc=-7;
  }
}

return sc;
}
function Trunc(n,d){
var nn=Math.abs(n),
    sc=Round.getScale(nn),
    l=Round.pow10(d),
    rnd=nn*l,
    res=Math.floor(rnd),
    dif=rnd-res;
if (sc+d > 0 && sc+d < Round.lim.length && Math.abs(1-dif)<Round.lim[sc+d] && dif>0.99999 /*Round(dif,9-sc-d)==1.0*/){
  res=res+1;
}
return (n>=0?res/l:-res/l);
}

function Int(varValue) {
  return Math.floor(varValue)
}

function Int2(varValue) {
  if(varValue<0)
    return Math.ceil(varValue);
  else
    return Math.floor(varValue);
}

function SystemDate(d){
if(d==null)d=new Date()
return new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0)
}

SystemDate.parse=function(strdate) {
if (Eq("1-1-100",strdate)){
return NullDate()
}
return Date.parse(strdate)
}

function DateTime(d){
if(d==null){d=new Date();d.setMilliseconds(0)}
return d
}

DateTime.Sync=function(clientDateTime,serverDateTime,serverTZ){
 var key=DateTime.key(),data
 try{
  data=localStorage.getItem(key)
  if(!data)
   localStorage.setItem(key,Str(CharToDateTime(serverDateTime).getTime() - CharToDateTime(clientDateTime).getTime(),16)+"\uFF40"+Str(serverTZ))
 }catch(noLocalStorage){
  }
}

DateTime.key=function(){
 return SetNumberSettings.normKey('com.zucchetti.sitepainter.tzdata.')
}

DateTime.tzData=function(){
 try{
  var data=localStorage.getItem(DateTime.key())
  if(!data)
   return []
  return data.split("\uFF40")
 }catch(noLocalStorage){
   return []
  }
}

function EmptyString(str){
  if (str==null) return true;
  if (typeof(str.match)=='undefined') return false;
  return str.match(/\S/)==null;
}
function EmptyNumber(num) {
  return Eq(num,0)
}
function EmptyDate(date) {
  if (date==null) {
    return true
  }
  if (date.getFullYear()==100) {
    if (date.getMonth()==0) {
      if (date.getDate() == 1) {
        return true
      }
    }
  }
  return false
}

function EmptyDateTime(date) {
  return EmptyDate(date)
}

function EmptyBoolean(yesno) {
  return yesno==false
}

function EmptyArray(arr) {
  return arr==null||arr.length==0;
}

function Empty(any) {
  switch(typeof any) {
    case 'number':
      return Eq(any,0)
    case 'boolean':
      return EmptyBoolean(any)
    case 'string':
      return EmptyString(any)
    case 'object':
      if (any==null) return true
      if(IsA(any,'D'))
        return EmptyDate(any)
      else if(IsA(any,'A'))
        return EmptyArray(any)
      break;
    case 'undefined':
      return true
  }
  return false
}

function IsNull(any) {
  return Empty(any);
}
function Eq(a,b){
var dist=null,epsilon=1e-10
if(a==null || b==null){
}else if(IsA(a,'D') && IsA(b,'D')){
return a.getTime()==b.getTime()
}else if(IsA(a,'C')&&IsA(b,'D')){
return a==FormatDate(b)
}else if(IsA(a,'D')&&IsA(b,'C')){
return b==FormatDate(a)
}else if(IsA(a,'N')&&IsA(b,'N')){
dist = a - b
}
if(dist==null){
}else if (dist <= epsilon && -epsilon <= dist){
return true
}else if (dist > 2 * epsilon || dist < -2*epsilon){
return false
}else{
var aLong = lexicographicallyOrderedAsTwosComplement(a),
    bLong = lexicographicallyOrderedAsTwosComplement(b),
    norm = [Math.abs(aLong[0] - bLong[0]),Math.abs(aLong[1] - bLong[1])],
    exp = aLong[0] >>> 5*4
if (exp > 0 && a < 1 && a > -1){
norm = [norm[0] / exp, norm[1] / exp]
}
return norm[0]==0 && norm[1] <= 14 //Library.maxUlps
}
return a==b
function lexicographicallyOrderedAsTwosComplement(a) {
//https://gist.github.com/1541883
function toIEEE754(v, ebits, fbits) {
var s,
    f,
    bias = (1 << (ebits - 1)) - 1,
    e=null
// Compute sign, exponent, fraction
if (isNaN(v)) {
e = (1 << bias) - 1; f = 1; s = 0;
} else if (v === Infinity || v === -Infinity) {
e = (1 << bias) - 1; f = 0; s = (v < 0) ? 1 : 0;
} else if (v === 0) {
e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
} else {
s = v < 0;
v = Math.abs(v);
}
if (e!=null) {
} else if (v >= Math.pow(2, 1 - bias)) {
var ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
e = ln + bias;
f = v * Math.pow(2, fbits - ln) - Math.pow(2, fbits);
} else {
e = 0;
f = v / Math.pow(2, 1 - bias - fbits);
}
// Pack sign, exponent, fraction
var i, bits = [];
for (i = fbits; i; i -= 1) {
bits.push(f % 2 ? 1 : 0);
f = Math.floor(f / 2);
}
for (i = ebits; i; i -= 1) {
bits.push(e % 2 ? 1 : 0);
e = Math.floor(e / 2);
}
bits.push(s ? 1 : 0);
bits.reverse();
var str = bits.join('');
// Bits to bytes
var dword = [];
while (str.length) {
dword.push(parseInt(str.substring(0, 32), 2));
str = str.substring(32);
}
return dword;
}
var aLong = toIEEE754( a, 11, 52 );
if (aLong[0] < 0) {
aLong[0] = 0x80000000 - aLong[0];
aLong[1] = - aLong[1];
}
return aLong;
}
}
function Eqr(a,b) {
if (IsA(a,'C') && IsA(b,'C'))
return RTrim(a)==RTrim(b)
else
return Eq(a,b)
}
function Ne(a,b){return !Eq(a,b)}
function Lt(a,b){
if(IsA(a,'D'))return a.getTime()<b.getTime()
if(IsA(a,'N')&&IsA(b,'N'))return a<b && !Eq(a,b)
return a<b
}
function Le(a,b){
if(IsA(a,'D'))return a.getTime()<=b.getTime()
if(IsA(a,'N')&&IsA(b,'N'))return a<b || Eq(a,b)
return a<=b
}
function Ge(a,b){
if(IsA(a,'D'))return a.getTime()>=b.getTime()
if(IsA(a,'N')&&IsA(b,'N'))return a>b || Eq(a,b)
return a>=b
}
function Gt(a,b){
if(IsA(a,'D'))return a.getTime()>b.getTime()
if(IsA(a,'N')&&IsA(b,'N'))return a>b && !Eq(a,b)
return a>b
}

function DateFromApplet(date) {
  return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0)
}

function DateTimeFromApplet(date) {
  return new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),
                  date.getMinutes(),date.getSeconds(),0)
}

function Format(any, len, dec, picture) {
  if (picture==null && IsA(len,'C')) {
    picture=len
    len=0
  }
  switch (typeof(any)) {
    case 'string':
      return FormatChar(any, len, picture)
      break
    case 'number':
      return FormatNumber(any, len, dec, picture)
      break
    case 'boolean':
      return FormatBoolean(any, picture)
      break
    case 'object':
      if (IsA(any,'D')) {
        if (any.getHours() > 0 || any.getMinutes() > 0 || any.getSeconds() > 0)
          return FormatDateTime(any, picture)
        else
          return FormatDate(any, picture)
        //return ApplyPictureToDate(any, picture)
      }
      break
    default:
      return any
      break;
  }
}
function Translate(message,parm1,parm2,parm3,parm4,parm5){
 var outmessage=typeof TransDict == 'undefined'?message:TransDict[message];
 if(outmessage==null){
  outmessage=message;
 }
 if(parm1!=null){
  outmessage=Strtran(outmessage,"%1",parm1);
 }
 if(parm2!=null){
  outmessage=Strtran(outmessage,"%2",parm2);
 }
 if(parm3!=null){
  outmessage=Strtran(outmessage,"%3",parm3);
 }
 if(parm4!=null){
  outmessage=Strtran(outmessage,"%4",parm4);
 }
 if(parm5!=null){
   outmessage=Strtran(outmessage,"%5",parm5);
 }
 return outmessage;
}
function FormatMsg(){
 var r=Translate(arguments[0]),s,p
 for(p=arguments.length;p>1;p--){
  s=arguments[p-1]
  if (s==null) {
   s="null"
  } else if(IsA(s,'N')) {
   s=WtA(s)
  } else {
   s=s.toString()
  }
  r=Strtran(r,"%"+(p-1),s)
 }
 return r
}
function FormatDate(date,pict){
if(Empty(date))
 return ''
if(pict=='D'||pict==''||pict==null){
 pict='DD-MM-YYYY'
}else if(pict=='N'){
 pict='DDMMYYYY'
 pict=FormatDate.swapYYMMDD(pict,"NO")
}else{
 pict=FormatDate.swapYYMMDD(pict,"NO")
}
pict=_PictDS(ZeroPad(date.getDate().toString(),2),ZeroPad((date.getMonth()+1).toString(),2),ZeroPad(date.getFullYear().toString(),4),pict)
return pict
}
function FormatDateTime(time,pict){
if(Empty(time))
 return ''
if(pict=='D'||pict==''||pict==null){
 pict='DD-MM-YYYY hh:mm:ss'
}else if(pict=='N') {
 pict='DDMMYYYYhhmmss'
 pict=FormatDate.swapYYMMDD(pict,"NO")
} else {
 pict=FormatDate.swapYYMMDD(pict,"NO")
}
pict=_PictTS(ZeroPad(time.getDate().toString(),2),ZeroPad((time.getMonth()+1).toString(),2),ZeroPad(time.getFullYear().toString(),4),ZeroPad(time.getHours().toString(),2),ZeroPad(time.getMinutes().toString(),2),ZeroPad(time.getSeconds().toString(),2),pict)
return pict
}
FormatDate.yyyy=/['"]?dd([^m])?mm[^y]?yyyy['"]?/i
FormatDate.yy=/['"]?dd([^m])?mm[^y]?yy['"]?/i
FormatDate.onlySep=/[^dmy h:s'"]/gi
FormatDate.t=/ *\[ *T *\( *([^)]) *\) *\] */i
FormatDate.swapYYMMDD=function(picture,forPicture){
 var p,tr = picture.match(FormatDate.t)
 if (tr)
  picture = tr[1]
 if(  ! tr
     &&
      ("YES"!=FormatDateSwapItalian && "justPicture"!=FormatDateSwapItalian
        ||
       (forPicture=="NO" && "justPicture"==FormatDateSwapItalian)
      )
   )
 {
 } else if (p=picture.match(FormatDate.yyyy)) {
  picture = picture.replace(FormatDate.yyyy,datePattern)
 } else if (p=picture.match(FormatDate.yy)) {
  picture = picture.replace(FormatDate.yy,Strtran(datePattern,"YYYY","YY"))
 }
 if(p && p.length>0 && p[1])
  picture = picture.replace(FormatDate.onlySep,p[1])
 return picture
}
function _PictDS(day,month,year,pict){
pict=Strtran(pict,"DD",day)
pict=Strtran(pict,"D",Left(day,1)=="0"?Right(day,1):day)
pict=Strtran(pict,"MM",month)
pict=Strtran(pict,"M",Left(month,1)=="0"?Right(month,1):month)
pict=Strtran(pict,"YYYY",year)
pict=Strtran(pict,"YY",Right(year,2))
if(At('h',pict)>0)pict=LRTrim(Substr(pict,1,At('h',pict)-1))
return pict
}
function _PictTS(day,month,year,hour,minute,second,pict){
pict=Strtran(pict,"hh",hour)
pict=Strtran(pict,"h",Left(hour,1)=="0"?Right(hour,1):hour)
pict=Strtran(pict,"mm",minute)
pict=Strtran(pict,"m",Left(minute,1)=="0"?Right(minute,1):minute)
pict=Strtran(pict,"ss",second)
pict=Strtran(pict,"s",Left(second,1)=="0"?Right(second,1):second)
return _PictDS(day,month,year,pict)
}
function CountChar(chr, str) {
  var num=0;
  for(var i=0; i<str.length; i++ ) {
    if(str.charAt(i)==chr) num++;
  }
  return num;
}

function URLenc(s){
var e=Lower(document.charset|| document.characterSet)
return Strtran(Strtran((e=='utf-8'?encodeURIComponent(s):escape(s)),"+","%2B"),"%u20AC",e=='utf-8'?"%E2%82%AC":(e=='iso-8859-15'?"%A4":"%80"))
}

function BuildPicture(type,len,dec){
  var i;
  var p;
  var result="";
  if (type=="N" && len>0){
    p="";
    if(dec==0){
      for(i=0;i<len;i++){
        p+="9";
      }
    }
    else{
      for(i=0;i<len-dec-1;i++){
        p+="9";
      }
      p+=".";
      for(i=0;i<dec;i++){
        p+="9";
      }
    }
    result=p;
  }
  if (type=="D"){
    return datePattern
  }
  if (type=="T"){
    return dateTimePattern
  }
  return result;
}
var m_Ctx = new function() { //oggetto da inizializzare
  this.GetDataLanguage=function(){return 'default';};
  this.GetSql=function(){return null};
  this.GetServer=function(){return ''};
  this.GetPhName=function(n){return n};
  this.IsSharedTemp=function(){return false};

  function GetGlobalVar (cname) {
    var globalVars
      , SPOfflineLib = window.SPOfflineLib
      ;
    if ( SPOfflineLib ) {
      globalVars = SPOfflineLib.SPLocalStorage.getItem( "g_oSPOfflineGlobalVars" ) ;
      if ( globalVars ) {
        globalVars = JSON.parse( globalVars );
      } else {
        globalVars = {};
      }
      if ( cname in globalVars && "value" in globalVars[cname] ) {
        return globalVars[cname].value;
      } else {
        return SPOfflineLib.getGlobalDefault( cname );
      }
    }
    return null;
  }

  function SetGlobalVar (cname, cvalue) {
    var globalVars
      , SPOfflineLib = window.SPOfflineLib
      ;
    if ( SPOfflineLib ) {
      globalVars = SPOfflineLib.SPLocalStorage.getItem("g_oSPOfflineGlobalVars");
      if ( globalVars ) {
        globalVars = JSON.parse( globalVars );
      } else {
        globalVars = {};
      }
      globalVars[cname] || ( globalVars[cname] = {} );
      globalVars[cname].value = cvalue;
      SPOfflineLib.SPLocalStorage.setItem("g_oSPOfflineGlobalVars", JSON.stringify(globalVars) );
      return true;
    }
    return false;
  }

  this.GetGlobalDate = function (cname) {
    var d = GetGlobalVar(cname);
    return d == null ? NullDate() : coerce(d, 'D');
  };
  this.GetGlobalDateTime = function (cname) {
    var d = GetGlobalVar(cname);
    return d == null ? NullDateTime() : coerce(d, 'T');
  };
  this.GetGlobalString = function (cname) {
    var d = GetGlobalVar(cname);
    return d == null ? '' : coerce(d, 'C');
  };
  this.GetGlobalNumber = function (cname) {
    var d = GetGlobalVar(cname);
    return d == null ? 0 : coerce(d, 'N');
  };
  this.GetGlobalLogic = function (cname) {
    var d = GetGlobalVar(cname);
    return d == null ? false : coerce(d, 'L');
  };
  this.SetGlobalDate = function (cname, value) {
    return SetGlobalVar(cname,DateToChar(value));
  }
  this.SetGlobalDateTime = function (cname, value) {
    return SetGlobalVar(cname,DateTimeToChar(value));
  }
  this.SetGlobalString = function (cname, value) {
    return SetGlobalVar(cname,value);
  }
  this.SetGlobalNumber = function (cname, value) {
    return SetGlobalVar(cname,value);
  }
  this.SetGlobalLogic = function (cname, value) {
    return SetGlobalVar(cname,value);
  }
  function coerce (value, p_desired) {
    var original;
    switch (typeof value) {
    case 'string':
      original = 'C';
      break;
    case 'number':
      original = 'N';
      break;
    case 'boolean':
      original = 'L';
      break;
    }
    if (original == p_desired)
      return value;
    else {
      if (original == 'C') {
        switch (p_desired) {
        case 'N':
          return Val(value);
        case 'D':
          return CharToDate(value);
        case 'T':
          return CharToDateTime(value);
        case 'L':
          return !Empty(value);
        }
      } else if (original == 'N') {
        switch (p_desired) {
        case 'C':
          return '' + value;
        case 'L':
          return !Empty(value);
        }
      }
    }
    return value;
  };
}
var CPMessageSink={
ConsoleSink:{SendMessage:function(msg){alert(msg)},log:function(msg){alert(msg)}}
}
var Forward={
Unforwarded:null
}
function CPResultSet(s,id,v){
var u,r,p,enc
this.resultset={metadata:{},data:[],errormessage:'no results'}
try{
if(id==null&&typeof s=='string'){
eval('this.resultset='+s)
}else if(id==null){
this.resultset=s
}else{
if(typeof PlatformPathStart=='function')s=PlatformPathStart(s);
u=['../servlet/'+s,'?m_cBrowseName='+id]
for(p in v){
if(IsA(v[p],'C')){
enc="'"+v[p]+"'"
}else if(IsA(v[p],'D')){
enc='{'+Day(v[p])+'-'+Month(v[p])+'-'+Year(v[p])+" "+Hour(v[p])+':'+Minute(v[p])+':'+Sec(v[p])+'}'
}else if(v[p].constructor==CPMemoryCursor){
enc=WtA(v[p],'MC')
}else{
enc=''+v[p]
}
u[u.length]='&'+p+'='+URLenc(enc)
}
eval('this.resultset='+new JSURL(u.join(''),true).__response())
for(p in this.resultset.readdata){
if(typeof v[p]!='undefined'&&v[p].constructor==CPMemoryCursor){
v[p]._Copy(new CPMemoryCursor(new CPResultSet(this.resultset.readdata[p])))
}else{
v[p]=this.resultset.readdata[p]
}
}
}
}catch(e){
this.resultset.errormessage=e.message
}
this.currow=0
this.Close=function(){}
this.Next=function(){this.currow++}
this.Eof=function(){return this.currow>=this.resultset.data.length}
this.ErrorMessage=function(){return this.resultset.errormessage}
this.Datum=function(cname){
try{
return this.resultset.data[this.currow][this.resultset.metadata[cname][0]]
}catch(e){
try{
return this.resultset.data[this.currow][this.resultset.metadata[Lower(cname)][0]]
}catch(ee){ return null;}
}
}
this.GetDate=function(cname){
var d=this.Datum(cname)
return d==null?NullDate():this.coerce(d,'D')
}
this.GetDateTime=function(cname){
var d=this.Datum(cname)
return d==null?NullDateTime():this.coerce(d,'T')
}
this.GetString=function(cname){
var d=this.Datum(cname)
return d==null?'':this.coerce(d,'C')
}
this.GetDouble=function(cname){
var d=this.Datum(cname)
return d==null?0:this.coerce(d,'N')
}
this.GetBoolean=function(cname){
var d=this.Datum(cname)
return d==null?false:this.coerce(d,'L')
}
this.coerce=function(value,p_desired) {
var original
switch(typeof value) {
case 'string':
original='C';break
case 'number':
original='N';break
case 'boolean':
original='L';break
}
if (original==p_desired)
return value
else {
if(original=='C') {
switch(p_desired) {
case'N':return Val(value)
case'D':return CharToDate(value)
case'T':return CharToDateTime(value)
case'L':return !Empty(value)
}
} else if(original=='N') {
switch(p_desired){
case'C':return ''+value
case'L':return !Empty(value)
}
}
}
return value
}
}
function Caller(c,prefix){
if(prefix==null)prefix=""
var sget=function(e,n,d){
try{
if(e==n && c.eval('typeof '+prefix+n)=='undefined' && c.eval('typeof '+n)=='undefined' && (Substr(n,3)!='w_' && c.eval('typeof w_'+n)=='undefined') ){
return d
}else if(c.eval('typeof '+n+'=="undefined"')  && Left(e,2)=='w_' && c.eval('typeof '+Substr(n,3)+'!="undefined"')){
return c.eval(Substr(e,3))
} else if((Substr(n,3)!='w_' && c.eval('typeof w_'+n)!='undefined') && c.eval('typeof '+n)=='undefined' ) {
return c.eval('w_'+e)
}else{
return Left(e,prefix.length)==prefix?c.eval(e,arguments):c.eval(prefix+e,arguments)
}
}catch(ex){
return d
}
}
this.GetNumber=function(n){return sget(n,n,0)}
this.GetString=function(n){return sget(n,n,'')}
this.GetDate=function(n){return sget(n,n,NullDate())}
this.GetDateTime=function(n){return sget(n,n,NullDateTime())}
this.GetLogic=function(n){return sget(n,n,false)}
this.GetMemoryCursor=function(n){return sget(n,n,new CPMemoryCursor())}
this.GetMemoryCursorRow=function(n){return sget(n,n,new CPMemoryCursorRow())}
this.SetNumber=function(n,t,l,d,v){sget(n+'='+v,n)}
this.SetString=function(n,t,l,d,v){sget(n+'='+LibJavascript.ToJSValue(v),n)}
this.SetDate=function(n,t,l,d,v){sget(n+'=CharToDate("'+DateToChar(v)+'")',n)}
this.SetDateTime=function(n,t,l,d,v){sget(n+'=CharToDateTime("'+DateTimeToChar(v)+'")',n)}
this.SetLogic=function(n,t,l,d,v){sget(n+'='+v,n)}
this.SetMemoryCursorCtrl=function(n,t,l,d,v){sget(n+'=new CPMemoryCursor(new CPResultSet('+MemoryCursorCtrlToRS(v)+'))',n,v)}
this.SetMemoryCursor=function(n,t,l,d,v){sget(n+'=arguments[1][2]',n,v)}
this.SetMemoryCursorRow=this.SetMemoryCursor
this.CalledBatchEnd=function(){if(c.CalledBatchEnd)c.CalledBatchEnd()}
}

function MemoryCursorCtrlToRS(objMCC){
  var rs_obj={readdata:{},metadata:{},currentRow:1,uniqueID:'0',rowPointers:{},data:[],errormessage:''};
  var toStringObj = "{readdata:{},metadata:{"
  var n_fld = (objMCC.objRif.flds[objMCC.objRif.flds.length-1].name=="ps_rowstatus" ? objMCC.objRif.flds.length-1 : objMCC.objRif.flds.length)
  for(var i=0;i<n_fld;i++)
    rs_obj.metadata[objMCC.objRif.flds[i].name] = [i,objMCC.objRif.flds[i].type,false]
  for(var i=0;i<objMCC.objRif.rows.length;i++){
    rs_obj.data[i] = []
    for(var ni in objMCC.objRif.rows[i]){
      rs_obj.data[i].push(objMCC.objRif.rows[i][ni]);
    }
  }
  return JSON.stringify(rs_obj);
}

function ReadGlobals(srvlt,glbls,sttr,snk,bOffline){
var r,v,g,getGlobals;
if ( bOffline ) {
var type, name
, ctx = SPOfflineLib.getContext()
;
for ( g = 0; g < glbls.length; g++ ) {
type = glbls[g][0];
name = glbls[g][1];
try {
switch ( type ) {
case'D':v=ctx.GetGlobalDate(name);break;
case'T':v=ctx.GetGlobalDateTime(name);break;
case'N':v=ctx.GetGlobalNumber(name);break;
case'L':v=ctx.GetGlobalLogic(name);break;
default:v=ctx.GetGlobalString(name);
}
sttr( name , v );
} catch ( e ) {
snk.SendMessage( '' + e );
debug.log( [ "Error assigning global read var :" + name
, { 'name' : name
, 'type' : type
, 'value' : v
, 'assignor' : sttr
}
]
);
}
}
} else {
r = (function () {
var r,rsp,jsu,z=window.ZtVWeb,mIds;
mIds=window.m_IDS?'&m_cID='+(window.m_IDS[srvlt]||''):'';
jsu=new JSURL((z && (z.SPWebRootURL?z.SPWebRootURL:'..'))+'/servlet/'+srvlt+'?m_cGlobalsToRead=1'+mIds,true);
try{
rsp=jsu.__response();
r=eval("("+rsp+")");
return r;
}catch(e){
snk.SendMessage(''+e);
debug.log(["Error reading globals from:"+srvlt,e,rsp,r]);
}
})();
for ( g=0; g<glbls.length; g++ ) {
try{
if(r==null || IsA(r[glbls[g][1]],'U')){
switch(glbls[g][0]) {
case'D':v=NullDate();break;
case'T':v=NullDateTime();break;
case'N':v=0;break;
case'L':v=false;break;
default:v='';
}
}else{
v=r[glbls[g][1]];
switch(glbls[g][0]){
case'D':v=CharToDate(v);break;
case'T':v=CharToDateTime(v);break;
case'R':v=new CPMemoryCursor(new CPResultSet(v)).row;break;
case'MC':v=new CPMemoryCursor(new CPResultSet(v));break;
}
}
sttr(glbls[g][1],v);
}catch(e){
snk.SendMessage(''+e);
debug.log(["Error assigning global read var :"+glbls[g][1],{name:glbls[g][1],type:glbls[g][0],value:v,assignor:v}]);
}
}
}
}
CPLib={
ToSQL:function(value,cpt,l,d){
switch(cpt){
case 'C':case'M':return value
default:alert('TBD')
}
},
ToCPStr:function(cs){
var res
if(IsA(cs,"C"))return Trim(cs)
if(IsA(cs,"N")){
res=Strtran(Trim(Strtran(Str(cs,16,16),"0"," "))," ","0")
res=Strtran(res,",",".")
if(Eq(Right(res,1),"."))res=Left(res,Len(res)-1)
if(Empty(res))res="0"
return res
}
if(IsA(cs,"D")){
res=DateToChar(cs)
if(Empty(res))
res="{}"
else
res="{^"+Left(res,4)+"-"+Substr(res,5,2)+"-"+Right(res,2)+"}"
return res
}
if(IsA(cs,"L"))return cs?".T.":".F."
if(IsA(cs,"T")){
if(Empty(cs))res="{}"
else{
res=DateTimeToChar(cs)
res="{^"+Left(res,4)+"-"+Substr(res,4,2)+"-"+Substr(res,5,2)+" "+Substr(res,6,2)+":"+Substr(res,7,2)+":"+Right(res,2)+"}"
}
return res
}
}
}
function IsAny(o){return o!=null && !IsA(o,'U')}
function __tof(o){return typeof o};
function _tof(o,t){return t==typeof o};
function _oof(o,o2){return _iof(o,o2.constructor)};
function _iof(o,f){return (o) instanceof f};
function _isd(o){return o && (o instanceof Date || (o.getFullYear && o.getMonth && o.getDate && o.getHours && o.getMinutes && o.getSeconds && o.getMilliseconds))};
function _hasc(o,c){return IsAny(o) && o.constructor==c}
_tpOfs={U:function(o){return _tof(o,'undefined');},C:function(o){return _hasc(o,String)},N:function(o){return _hasc(o,Number)},L:function(o){return _hasc(o,Boolean)},O:function(o){return _tof(o,'object')},F:function(o){return _tof(o,'function')},D:function(o){return _isd(o);},A:function(o){return _iof(o,Array);},T:function(o){return this.D(o);}};
_cis={"object":_oof,"function":_iof,"string":_tpOfs.C,"number":_tpOfs.N,"boolean":_tpOfs.L};
function IsA(o,c){
if(_tpOfs[c]) return _tpOfs[c](o);
switch (c){
case String: return _tpOfs.C(o);
case Number: return _tpOfs.N(o);
case Boolean: return _tpOfs.L(o);
case Function: return _iof(o,c);
case Object: return _oof(o,c);
default: return _cis[__tof(c)](o,c);
}}


if(typeof LibJavascript=='undefined') var LibJavascript={};
LibJavascript.AlfaKeyGen=function(keyLen){
  if (!keyLen || keyLen<0) keyLen=10;
	var res="";
  for(var i=0; i++<keyLen; res+=String.fromCharCode(Math.floor(Math.random()*26+97)));
	return res;
}
LibJavascript.String={
  stripTags:function(s){
    return s.replace(/<([^>]+)>/g,'');
  },
  Chainer: function(){
    var b;
    if(navigator.userAgent.indexOf('MSIE')!=-1){
      b=[];
      return {
        concat: function(s){
          b.push(s);
          return this;
        },
        flush: function(){
          var res=this.toString();
          b=[];
          return res;
        },
        debug: function(){
          debugger;
        },
        toString: function(){
          //debugger
          return b.join('');
        }
      }
    }else{
      b='';
      return {
        concat: function(s){
          b+=s;
          return this;
        },
        flush: function(){
          var res=this.toString();
          b='';
          return res;
        },
        debug: function(){
          debugger;
        },
        toString: function(){
          return b;
        }
      };
    }
  }
};
LibJavascript.JSONUtils={
  validate: function(obj, schema){
    throw new Error("Validate function not yet implemented")
  },
  adjust: function(obj, schema){
    /*
      Verifica che tutte le proprieta' del diz schema siano presenti in obj.
      Quelle che mancano vengono valorizzate da schema[p].
      - Se schema[p] non e' una funzione il valore viene condiviso
          !!! ATTENZIONE A NON CAMBIARE I VALORI IN SCHEMA !!!
      - Se schema[p] e' una funzione viene invocata e assegnato il risultato a obj[p]

      Viene ritornato l'obj "aggiustato".

      Se obj e' un array viene "aggiustato" ogni elemento dell'array.
        Se un elemento e' null viene creato e inserito un nuovo oggetto "aggiustato".

      Pensata per far "unmarshalling" di serializzazioni vecchie su versioni nuove
    */
    var objs = IsA(obj, 'A') ? obj : [obj];

    for(var p in schema){
      for(var i=0, o, l=objs.length; i<l; i++){
        o=objs[i];
        if(!IsAny(o)){
          o=objs[i]={};
        }
        if(!(p in o)){
          var defVal = schema[p];
          o[p]= ('function' == typeof(defVal) ? defVal(o) : defVal);
        }
      }
    }
    return IsA(obj, 'A') ? objs : objs[0];
  },
  purge: function(obj, props, skipNotFound){
    /*
      Ritorna un oggetto con solo le proprieta' di obj elencate in props.
      props e' un array di stringhe che contiene i nomi delle proprieta' da assegnare.
      Restituisce un oggetto nuovo.

      Se obj e' un array applica la "pulizia" ad ogni elemento dell'array
        ritornando un array nuovo.

      Pensato per serializzare tramite JSON e minimizzare il cosi' traffico.
    */
    function purge(obj){//pulisce il singolo obj
      var res={};
      for(var i=0, p; p=props[i++]; ){
        if (!skipNotFound || typeof(obj[p])!='undefined') {
          res[p]=obj[p];
        }
      }
      return res;
    }

    var res = [],
        objs = IsA(obj, 'A') ? obj : [obj];

    for(var i=0, o, l=objs.length; i<l; i++){
      if(o=objs[i]){
        res.push(purge(objs[i]));
      }
    }
    return IsA(obj, 'A') ? res : res[0];
  },
  fillWith: function(toFill,_with){
    /* Aggiunge al primo parametro le proprieta' specificate nel secondo.
      in caso di clash sul nome di proprieta' il conflitto viene risolto
      sostituendo la proprieta' del primo con il valore del secondo
    */
    for(var p in _with){
      toFill[p]=_with[p];
    }
  }
};
LibJavascript.Array={
  indexOf: function(m_aArr,m_oElem,m_fCmpFnc){ //la funzione nativa non prevede il terzo parametro
    if(IsA(m_aArr,'U'))return -1;
    if(IsA(m_fCmpFnc,'U')){
      m_fCmpFnc=function(el){
        return m_oElem==el&&IsA(el,m_oElem);
      }
    }
    if(IsA(m_oElem,'U')&&arguments.length<3)return -1;
    for(var i=0;i<m_aArr.length;i++)
    if(m_fCmpFnc(m_aArr[i],m_oElem))return i;
    return -1;
  },
  moveAfter: function(a, f, t){//array, from, to
    if(f==t || f==t+1)return;
    a.splice(t+1,0,a[f]);
    a.splice(f+(t<f ? 1 : 0),1);
  },
  moveBefore: function(a, f, t){//array, from, to
    if(f==t || f==t-1)return;
    a.splice(t,0,a[f]);
    a.splice(f+(t<f ? 1 : 0),1);
  },
  remove: function(a, i){//array, idx
    if(!(i in a))return;
    return a.splice(i,1)[0];
  },
  insert: function(a, i, e){//array, idx, any
    var l=a.length;
    a.splice(i, 0, e);
    return i>=0 ? (a[i]==e ? i : (a[l]==e ? l : LibJavascript.Array.indexOf(a,e))) : Math.max(0, l+i);
  },
  copy: function(a){
    return a.slice();
  },
  every: Array.every || function(a, fun /*, thisp*/){//array, callback, callback context
    //Tests whether all elements in the array pass the test implemented by the provided function
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/every
    if (typeof fun != "function")
      throw new TypeError();

    var len = a.length >>> 0;
    var thisp = arguments[2];
    for (var i = 0; i < len; i++) {
      if (i in a &&
          !fun.call(thisp, a[i], i, a))
        return false;
    }
    return true;
  },
  forEach: Array.forEach || function(a, fun /*, thisp*/) { //array, callback, callback context
    //Executes a provided function once per array element
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach
    if (typeof fun != "function")
      throw new TypeError();

    var len = a.length >>> 0;
    var thisp = arguments[2];
    for (var i = 0; i < len; i++){
      if (i in a) {
        fun.call(thisp, a[i], i, a);
      }
    }
  },
  filter: Array.filter || function(a, fun /*, thisp*/) { //array, callback, callback context
    //Creates a new array with all elements that pass the test implemented by the provided function
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
    if (typeof fun != "function")
      throw new TypeError();

    var len = a.length >>> 0;
    var res = new Array();
    var thisp = arguments[2];
    for (var i = 0; i < len; i++) {
      if (i in a) {
        var val = a[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, a)) {
          res.push(val);
        }
      }
    }
    return res;
  },
  map: Array.map || function(a, fun /*, thisp*/) { //array, callback, callback context
    //Creates a new array with the results of calling a provided function on every element in this array
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach
    if (typeof fun != "function")
      throw new TypeError();

    var len = a.length >>> 0;
    var res = new Array(len);
    var thisp = arguments[2];
    for (var i = 0; i < len; i++) {
      if (i in a) {
        res[i] = fun.call(thisp, a[i], i, a);
      }
    }
    return res;
  },
  reduce: Array.reduce || function reduce (a, fun/*, initiVal*/ ) { // array, callback, initialValue
    //Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
    if (a===null || a===undefined) throw new TypeError("Object is null or undefined");
    var i = 0, l = a.length >> 0, curr;

    if(typeof fun !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
      throw new TypeError("Second argument is not callable");

    if(arguments.length < 3) {
      if (l === 0) throw new TypeError("Array length is 0 and no second argument");
      curr = a[0];
      i = 1; // start accumulating at the second element
    }
    else
      curr = arguments[2];

    while (i < l) {
      if(i in a) curr = fun.call(undefined, curr, a[i], i, a);
      ++i;
    }

    return curr;
  },
  equals: function(a, b) {
    return !(a<b || b<a);
  }
}
LibJavascript.Css=function(){
  var _rulesKeyword;
  function _getRulesKeyword(){
    if(!_rulesKeyword){
      _rulesKeyword = 'rules' in document.styleSheets[0] ? 'rules' : 'cssRules';
    }
    return _rulesKeyword;
  }
  return {
    getStyleSheets:function(){
      return document.styleSheets;
    }
    ,getRules:function(){
      var rules = [];
      LibJavascript.Array.forEach(this.getStyleSheets(), function(styleSheet/*, idx, styleSheets*/){
        LibJavascript.Array.forEach(styleSheet[_getRulesKeyword()], function(rule/*, idx, rules*/){
          rules.push(rule);
        });
      });
      return rules;
    }
    ,getCSSRuleStyleProp:function(selectorText, styleProperty){
      var values = []
      LibJavascript.Array.forEach(this.getStyleSheets(), function(styleSheet/*, idx, styleSheets*/){
        LibJavascript.Array.forEach(styleSheet[_getRulesKeyword()], function(rule/*, idx, rules*/){
          if ( rule.selectorText==selectorText )
            values.push(rule.style[styleProperty]);
        });
      });
      if ( values.length==1 )
        return values[0];
      return values;
    }
    ,setCSSRuleStyleProp:function(selectorText, styleProperty, propertyValue){
      LibJavascript.Array.forEach(this.getStyleSheets(), function(styleSheet/*, idx, styleSheets*/){
        LibJavascript.Array.forEach(styleSheet[_getRulesKeyword()], function(rule/*, idx, rules*/){
          if ( rule.selectorText==selectorText )
            rule.style[styleProperty] = propertyValue;
            //rule.style.setProperty(styleProperty, propertyValue, null);
        });
      });
    }
  }
}();
LibJavascript.CssClassNameUtils=function(){
  /* polyfill for element.classList */
  // if(!("classList" in document.createElement("_"))){

  // }

  var _this;
  return {
  init:function(){
    _this=LibJavascript.CssClassNameUtils;
  },
	hasClass:function(obj,cname){
    if(!obj) return;
    if(typeof(obj) == "string")
      obj = LibJavascript.DOM.Ctrl(obj);
		return new RegExp('(^| )'+cname+'( |$)').test(!obj?"":obj.className);
	},
	hasClasses:function(obj,classes){
    if(!obj) return;
		for(var i=0,l=classes.length;i<l;i++)
      if(!_this.hasClass(obj,classes[i]))
				return false;
		return true;
	},
  _addClass:function(obj,cname){
    if(!obj) return;
    if(!_this.hasClass(obj,cname))
			obj.className+=EmptyString(obj.className)?cname:' '+cname;
  },
  addClass:function(obj,cname,lazy){
    if(typeof(obj) == "string")
      obj = LibJavascript.DOM.Ctrl(obj);
    if(lazy){
      window.setTimeout(function(){
        _this._addClass(obj,cname);
      }, 0);
    }else{
      _this._addClass(obj,cname);
    }
	},
  _removeClass:function(obj,cname){
    if(!obj) return;
    if(!_this.hasClass(obj,cname))
			return;
		var rep=obj.className.match(' '+cname)?' '+cname:cname;
		obj.className=obj.className.replace(rep,'');
  },
  removeClass:function(obj,cname,lazy){
    if(typeof(obj) == "string")
      obj = LibJavascript.DOM.Ctrl(obj);
    if(lazy){
      window.setTimeout(function(){
        _this._removeClass(obj,cname);
      }, 0);
    }else{
      _this._removeClass(obj,cname);
    }
	},
  toggleClass:function(obj,cname){
    _this[ _this.hasClass(obj,cname) ? '_removeClass' : '_addClass'](obj,cname);
  },
	swapClasses:function(obj,class1,class2){
    if(_this.hasClass(obj,class1)){
      _this._removeClass(obj,class1);
      _this._addClass(obj,class2);
			return;
		}
    if(_this.hasClass(obj,class2)){
      _this._removeClass(obj,class2);
      _this._addClass(obj,class1);
			return;
		}
	},
	replaceClass:function(obj,find,_with){
    if(_this.hasClass(obj,find))
      _this.removeClass(obj,find);
    _this.addClass(obj,_with);
		return true;
	},
  getElementsByClassName:function(className,container/*default to document*/,tag/*default to'*' */){
    if(IsAny(container)){
      container=LibJavascript.DOM.Ctrl(container);
      if(!container) return;
    }else{
      container=document;
    }
    if ( "querySelectorAll" in container ) {
      /*usa querySelectorAll per getElementsByClassName, adeguando il selettore
      "cn_1 cn_2" => ".cn_1.cn_2"*/
      return container.querySelectorAll( ( tag || '' ) + LRTrim( className ).replace( /([^ ]+)/g, '.$1' ).replace( ' ', '' ) );
    /*} else if ( !tag && ( "getElementsByClassName" in container ) ) {
      return container.getElementsByClassName( className );*/
    } else {
      tag=tag||'*';
      var all=container.getElementsByTagName?container.getElementsByTagName(tag):container.all;//listing container descendants
      var found=[];
      className = LRTrim(className).split(" ");
      for(var f=0,el; el=all[f++]; ){
        if(_this.hasClasses(el,className)){
          found.push(el);
        }
      }
      return found;
    }
	},
  getClassWithPrefix: function(obj,prefix){
    if(!obj) return;
    if(typeof(obj) == "string")
      obj = LibJavascript.DOM.Ctrl(obj);
    var classes = obj.className.split(" ");
    for (var i=0; i<classes.length; i++) {
      if( classes[i].lastIndexOf(prefix, 0) !== 0 )
        classes.splice(i--,1);
    };
    return classes;
  }
  };
}();
LibJavascript.CssClassNameUtils.init();
if (!LibJavascript.Date)
LibJavascript.Date = {
//Validazione della data
 CheckDate : function(N_day,N_month,N_year){
 var objDate
 var day,month,year
 if(isNaN(N_day) || isNaN(N_month) || isNaN(N_year)){
  return(false)
 }
 else{
  objDate=new Date(N_year,N_month-1,N_day)
  day=objDate.getDate()
  month=objDate.getMonth()+1
  year=objDate.getFullYear()
  if(day==N_day && month==N_month && year==N_year){
   return(true)
  }
  else {
   return(false)
  }
 }
},
//Validazione della data ora
CheckDateTime:function(N_day,N_month,N_year,N_hour,N_minute,N_second){
 var res=LibJavascript.Date.CheckDate(N_day,N_month,N_year)
 if(res){
  var objDate
  var hour,minute,second
  if(isNaN(N_hour) || isNaN(N_minute) || isNaN(N_second)){
   res=false
  }else{
   objDate=new Date(N_year,N_month-1,N_day,N_hour,N_minute,N_second)
   hour=objDate.getHours()
   minute=objDate.getMinutes()
   second=objDate.getSeconds()
   if(hour!=N_hour || minute!=N_minute || second!=N_second){
    res=false
   }
  }
 }
 return(res)
}
}
if(!LibJavascript.Events){
LibJavascript.Events = {
  _evts: {},

  addAction:function(defEvent,mode,obj, fn){
     var mooObj = {};
     var isTouch = 'ontouchstart' in window;
     switch(mode){
      case 'default':
        switch(defEvent){
        case 'click' :
          if (isTouch){
             mooObj.touchstart=function(){
              obj.addEvent("touchmove",mooObj.touchmove);
              obj.addEvent("touchend", mooObj.touchend);
             }
             mooObj.touchmove=function(){
              obj.removeEvent("touchend", mooObj.touchend);
             }
            mooObj.touchend=function(evt){
              fn(evt);
              obj.removeEvent("touchend", mooObj.touchend);
              obj.addEvent("touchstart",mooObj.touchstart);
            }
          } else {
            mooObj.click=function(evt){
              fn(evt);
            }
          }
          break;
        case 'mousedown':
          if (isTouch){
            mooObj.touchstart=function(evt){
              fn(evt);
            }
          } else {
            mooObj.mousedown= function(evt){
              fn(evt)
            }
          }
          break;
        case 'mouseup':
          if (isTouch){
            mooObj.touchend=function(evt){
              fn(evt)
            }
          } else {
            mooObj.mouseup=function(evt){
              fn(evt)
            }
          }
          break;
        }
      break;
      case 'optimized':
        switch(defEvent){
        case 'click' :
          if (isTouch){
            mooObj.touchstart=function(){
              obj.addEvent("touchmove",mooObj.touchmove);
              obj.addEvent("touchend", mooObj.touchend);
            }
            mooObj.touchmove=function(){
              obj.removeEvent("touchend", mooObj.touchend);
            }
            mooObj.touchend=function(evt){
              fn(evt);
              obj.removeEvent("touchend", mooObj.touchend);
              obj.addEvent("touchstart",mooObj.touchstart);
            }
          } else {
            mooObj.click= function(evt){
              fn(evt);
            }
          }
          break;
        case 'mousedown':
          if (isTouch){
            mooObj.touchstart=function(evt){
              fn(evt)
            }
          } else {
            mooObj.mousedown=function(evt){
              fn(evt)
            }
          }
          break;
        case 'mouseup':
          if (isTouch){
            mooObj.touchend=function(evt){
              fn(evt)
            }
          } else {
            mooObj.mouseup=function(evt){
              fn(evt)
            }
          }
          break;
        }
      break;
      case 'strict':
          switch(defEvent){
            case 'click':
              mooObj.click=function(evt){
              fn(evt)
            }
            break;
            case 'mousedown':
            case 'click':
              mooObj.mousedown=function(evt){
              fn(evt)
            }
            break;
            case 'mouseup':
              mooObj.mouseup=function(evt){
              fn(evt)
            }
            break;
            case 'touchstart':
              if (isTouch){
                mooObj.touchstart=function(evt){
                  fn(evt)
                }
              }
            break;
            case 'touchmove':
              if (isTouch){
                mooObj.touchmove=function(evt){
                  fn(evt)
                }
              }
            break;
            case 'touchend':
              if (isTouch){
                mooObj.touchend=function(evt){
                  fn(evt)
                }
              }
            break;
          }
       break;
     }
     return mooObj;
   },

	addEvent: function(obj, type, fn) {
    obj=LibJavascript.DOM.Ctrl(obj);
    var eventsObj={};
    var isTouch = 'ontouchstart' in window;
		if (obj.addEventListener){
			if(!isTouch)
        obj.addEventListener(type, fn, false);
      else{
        switch(type){
          case 'click' :
            eventsObj.touchstart=function(event){
              obj.addEventListener("touchmove",eventsObj.touchmove);
              obj.addEventListener("touchend", eventsObj.touchend);
            }
            eventsObj.touchmove=function(event){
              obj.removeEventListener("touchend", eventsObj.touchend);
            }
            eventsObj.touchend=function(event){
              fn(event);
              obj.removeEventListener("touchend", eventsObj.touchend);
              obj.addEventListener("touchstart",eventsObj.touchstart);
            }
            obj.addEventListener("touchstart",eventsObj.touchstart);
          break;
          case 'mousedown':
            obj.addEventListener('touchstart',fn,false)
          break;
          case 'mouseup':
             obj.addEventListener('touchend',fn,false)
          break;
          default:
            obj.addEventListener(type,fn,false);
          break;
        }
      }
    }
		else if (obj.attachEvent) {
      var e_id='e'+ type + fn;
      obj.detachEvent('on'+ type, obj[e_id] || new Function);
      obj.attachEvent('on'+ type, obj[e_id] = fn);
      if('unload'==type) return;
      LibJavascript.Events._evts[e_id]={obj: obj, type: type, fn: fn};
		}
	},
	removeEvent: function(obj, type, fn) {
    obj=LibJavascript.DOM.Ctrl(obj);
		if (obj.removeEventListener)
			obj.removeEventListener(type, fn, false);
		else if (obj.detachEvent) {
      var e_id='e'+ type + fn;
      obj.detachEvent('on'+ type, obj[e_id]);
      obj[e_id] = null;
      try{
        delete obj[e_id];
      }catch(e){
          if(e_id in obj) {
            try  {
              obj.removeAttribute(e_id);
            } catch(e){
            }
          }
      }finally{
        delete LibJavascript.Events._evts[e_id];
      }
		}
  },
  addOrientationChangeEvent : function (obj, fn) {
    var orientationWrapper = navigator.userAgent.match(/Linux;.*Android \d\.\d\.\d/i) && navigator.platform.match(/Linux/i);
    if (orientationWrapper) {
      function resizeFn() {
        LibJavascript.Events.removeEvent(obj,'resize',resizeFn);
        fn();
      }
      function orientationFn() {
        LibJavascript.Events.addEvent(obj,'resize',resizeFn);
      }
      LibJavascript.Events.addEvent(obj,'orientationchange',orientationFn);
      return orientationFn;
    } else {
      LibJavascript.Events.addEvent(obj,'orientationchange',fn);
      if ( !('orientation' in obj) && obj.matchMedia && !obj.i_OrientationMatchMedia) {
        obj.i_OrientationMatchMedia = obj.matchMedia("(orientation: portrait)");
        obj.i_OrientationMatchMedia.addListener(function(m) {
          window.GetOrientation.browser_ref = "UNKNOWN"; //inizializzo
          var orientationEvent = obj.document.createEvent('Event');
          orientationEvent.initEvent('orientationchange', true, false);
          obj.document.dispatchEvent( orientationEvent );
        });
      }
      return fn;
    }
  },
  _cleanUp: function(){
    var libE=LibJavascript.Events,evts=libE._evts,o;
    for(var e_id in evts){
      o=evts[e_id];
      libE.removeEvent(o.obj, o.type, o.fn);
    }
    libE._evts=null;
  }
}}
LibJavascript.DOM=function(){
  var _this
    , res =
      { init: function () {
          _this=this;
        }
      , isNode: function ( el ) {
          return !!( el && el.nodeType );
        }
      , _CtrlById: function (id) {
          // return document.getElementById(id);
          return id != null ? ( id.substr ?  document.getElementById( id ) : id ) : id ;
        }
      , Ctrl: function (el) {//id o rif
          if ( el !=null && el.substr ) {
            var c;
            if(c=document.getElementById(el))return c;
            c=document.getElementsByName(el);
            return c.length==1?c[0]:(c.length?c:null);
          } else {
            return el;
          }
          // return IsA(el,'C') ? _this._CtrlById(el) : el;
          // return _this.isNode( el ) ?  el : _this._CtrlById( el );
          // return  el != null ? ( el.substr ?  _this._CtrlById( el ) : el ) : el ;
        }
      , CtrlByIdx: function (parent, idx) {
          parent = _this._CtrlById(parent);
          if ( !parent || !IsA(idx,'N') || !(idx in parent.childNodes) ) return;
          return parent.childNodes[idx];
        }
      , ElementByIdx: function (parent, idx) {
          parent = _this._CtrlById(parent);
          if ( !parent || !IsA(idx,'N') || !(idx in parent.children) ) return;
          return parent.children[idx];
        }
      , indexOf: function (parent, el) {
          parent = _this._CtrlById(parent);
          el = _this._CtrlById(el);
          if ( !parent || ! el ) return -1;
          return LibJavascript.Array.indexOf(parent.childNodes,el);
        }
      , indexOfElement: function (parent, el) {
          parent = _this._CtrlById(parent);
          el = _this._CtrlById(el);
          if ( !parent || ! el ) return -1;
          return LibJavascript.Array.indexOf(parent.children,el);
        }
      , addNode: function (parent ,el) {
          parent=_this._CtrlById(parent);
          el=_this._CtrlById(el);
          if(!parent || !el) return;
          _this.removeNode(el);
          parent.appendChild(el);
          return [parent,el];
        }
      , insertNode: function (parent, position, el) {
          parent=_this._CtrlById(parent);
          el=_this._CtrlById(el);
          if(!parent || !el || !IsA(position,'N') || position<0 ) return;
          var children=parent.childNodes;
          if(position>=children.length){
            return _this.addNode(parent,el) ? children.length-1 : null ;
          }else{
            parent.insertBefore(el,children[position]);
            return el==children[position] ? position : null ;
          }
        }
      , insertElement: function (parent, position, el) {
          parent=_this._CtrlById(parent);
          el=_this._CtrlById(el);
          if(!parent || !el || !IsA(position,'N') || position<0 ) return;
          var children=parent.children;
          if(position>=children.length){
            return _this.addNode(parent,el) ? children.length-1 : null ;
          }else{
            parent.insertBefore(el,children[position]);
            return el==children[position] ? position : null ;
          }
        }
      , removeNode: function(el){
          el=_this._CtrlById(el);
          if(!el){
            return;
          }
          if(!el.parentNode){
            return el;
          }
          return el.parentNode.removeChild(el);
        }
      , getComputedStyle: function (el, prop) {
          el=_this._CtrlById(el);
          if(!el){
            return;
          }
          prop = prop.replace(/-\D/g, function(match){
            return match.charAt(1).toUpperCase();
          })
          if ( document.defaultView && document.defaultView.getComputedStyle ) {
            return document.defaultView.getComputedStyle(el, null)[prop];
          } else if ( el.currentStyle ) {
            return el.currentStyle[prop];
          } else {
            return el.style[prop];
          }
        }
      , getAbsolutePos: function (aTag) {
          var leftpos = aTag.offsetLeft-aTag.scrollLeft
            , toppos = aTag.offsetTop-aTag.scrollTop
            , quirksMode = document.compatMode == 'BackCompat'
            , pos = LibJavascript.DOM.getComputedStyle( aTag, "position" )
            , relativeMode = pos == "relative",pos_float=null
            ;
          if (!quirksMode && !relativeMode && pos=="static" && aTag.parentNode.tagName=="TD") {
            leftpos+=aTag.parentNode.offsetLeft-aTag.parentNode.scrollLeft;
            toppos+=aTag.parentNode.offsetTop-aTag.parentNode.scrollTop;
          }
          do{
            aTag=aTag[quirksMode ? 'offsetParent' : 'parentNode'];
            pos = LibJavascript.DOM.getComputedStyle(aTag,"position");
            pos_float=LibJavascript.DOM.getComputedStyle(aTag,"float");
            if (pos=="absolute" || pos=="relative" || pos_float!="none")//non devo escluderlo se e' relative
              relativeMode=false;
            if ( aTag.scrollTop || aTag.scrollLeft ||
              (aTag.tagName!='THEAD' && aTag.tagName!='TBODY' && aTag.tagName!='TFOOT' && aTag.tagName!='TD' && aTag.tagName!='TR' && //se sei in una tabella
              !relativeMode ||
              quirksMode)) {
              leftpos+=aTag.offsetLeft-aTag.scrollLeft;
              toppos+=aTag.offsetTop-aTag.scrollTop;
              if (!quirksMode && !relativeMode && pos=="static" && aTag.parentNode.tagName=="TD") {
                leftpos+=aTag.parentNode.offsetLeft-aTag.parentNode.scrollLeft;
                toppos+=aTag.parentNode.offsetTop-aTag.parentNode.scrollTop;
              }
            }
            if (pos=="relative") relativeMode=true;
          } while(aTag.tagName!="BODY")
          return {x: leftpos, y:toppos};
        }
        ,getPosFromFirstRel: function (nearTo,ctrl) {
          /* Funzione che ritorna il posizionamento di "nearTo" da assegnare a ctrl  */
          var absolutePos=nearTo.getBoundingClientRect();//func js che identifica la posizione assoluta
          while(ctrl.parentNode && ctrl.tagName!="BODY" && ctrl.parentNode.tagName!="BODY"){
            ctrl=ctrl.parentNode;
            var pos = LibJavascript.DOM.getComputedStyle(ctrl,"position");
            var pos_float=LibJavascript.DOM.getComputedStyle(ctrl,"float");
            if (pos=="absolute" || pos=="relative" || (pos_float!="none" && (pos=="absolute" || pos=="relative")))//ho trovato un elemento con posizione
              return {x:absolutePos.left-ctrl.getBoundingClientRect().left,y:absolutePos.top-ctrl.getBoundingClientRect().top};
          }
          return {x:absolutePos.left,y:absolutePos.top};
        }

      , isAncestor: function (ancestor, descendant) {
          ancestor = _this._CtrlById( ancestor );
          descendant = _this._CtrlById( descendant );
          while ( descendant.parentNode && !_this.isParentOf( ancestor, descendant) ) {
            descendant = descendant.parentNode;
          }
          return !!descendant.parentNode;
        }
      , isParentOf: function (parent, child) {
          parent = _this._CtrlById( parent );
          child = _this._CtrlById( child );
          return child.parentNode && child.parentNode === parent;
        }
      , getTextDimensions: function (txt,className, padding, margin) {
          var dimensions, text;
          marginWidth=0,marginHeight=0;
          text = document.createElement( 'div' );
          text.style.display = 'inline-block';
          text.style.border = '0px solid transparent';
          text.style.boxSizing = 'border-box';
          text.style.color = 'transparent';
          text.style.whiteSpace = 'pre';
          text.style.position = 'absolute';
          text.style.visibility = 'hidden';
          text.style.height = text.style.width = 'auto';
          text.className=className;
          text.textContent = txt;
          document.body.appendChild( text );
          if (!padding)
            text.style.padding = '0px';
          if (!margin)
            text.style.margin = '0px';
          else {
            marginWidth+=parseFloat(LibJavascript.DOM.getComputedStyle( text, "marginRight" ))+parseFloat(LibJavascript.DOM.getComputedStyle( text, "marginLeft" ))
            marginHeight+=parseFloat(LibJavascript.DOM.getComputedStyle( text, "marginTop" ))+parseFloat(LibJavascript.DOM.getComputedStyle( text, "marginBottom" ))
          }
          dimensions = { w: ( text.clientWidth + 1 + marginWidth )
                       , h: ( text.clientHeight + 1 + marginHeight)
                       };
          document.body.removeChild( text );
          return dimensions;
        }
      , buildIcon: function(obj) { //obj{type,id,aId,className,style,events,image, image_attr,title,text}
        var tag=obj.type;
        var str='';
        if( obj.image && obj.image.indexOf('{') > -1 ) { //fontImage
          if(tag=='img') {
            str += '<a ';
          } else {
            str += '<'+obj.type+' ';
          }
          str += (obj.id ? ' id="'+obj.id+'"' : '');
          str += (obj.attr?' '+obj.attr:"")
          str += (obj.title?' title="'+obj.title+'"':"");
          str += ' class="'+( obj.className ? obj.className : '' );
          str += ' iconFont"';
          str += (obj.style ? 'style="'+obj.style+'"' : '' );
          str += obj.events ? ' '+ obj.events : '';
          str += '>'+(obj.text ? ' '+ obj.text : '')
          if(tag=='img')
            str +='</a>';
          else
            str +='</'+obj.type+'>';
        } else {
          if(tag=='img')
            str += obj.events ? ' <a id="'+obj.id+'_a" '+ obj.events+'>' : '';
          str += '<'+obj.type+' ';
          str += obj.id ? ' id="'+obj.id+'"' : '';
          str += (obj.attr?' '+obj.attr:"")
          str += (obj.title?' title="'+obj.title+'"':"");
          str += (obj.alt?' alt="'+obj.alt+'"':"");
          str += ' class="'+( obj.className ? obj.className : '' )+'"';
          if(tag=='img'){
            str += obj.style ? ' style="'+obj.style+'"' : '';
            str+=' src="'+obj.image+'"';
            str += " />";
            str += obj.events ? '</a>' : '';
          }else{
            str += obj.events ? ' '+ obj.events : '';
            str += ' style="'+(obj.style ? obj.style + ';' : '');
            str += obj.image ? (' background:url('+obj.image+')' + obj.image_attr +';') : '';
            str += "\">"+(obj.text ? ' '+ obj.text : '');
            str += "</"+obj.type+">";
          }
        }
        return str;
      }
      , GenerateIcon: function(/*String*/ image,/*String*/ imageStyle,/*String*/ aStyle,/*String*/ aAttr,/*String*/ imageAttr) {
        var html = "";
        if( image[0]=="{" ) { //fontIcon
          j = JSON.parse(image);
          var style = Empty(j.Size) ? "" : "font-size:" + j.Size + "px;";
          style += Empty(j.Height)? "" : "height:" + j.Height + "px;";
          style += Empty(j.Width)? "" : "width:" + j.Width + "px;";
          style += Empty(j.FontName)? "" : "font-family:" + j.FontName +";";
          style += Empty(j.FontWeight)? "" : "font-weight:" + j.FontWeight +";";
          style += Empty(j.Color)? "" : "color:" + j.Color +";";
          html = '<a '+(aAttr||'')+' style="text-decoration: none;'+style+(aStyle||'')+'" class="iconFont">'+ String.fromCharCode(j.Char) +'</a>';
        } else { //image
          html = '<a '+(aAttr||'')+' style="'+(aStyle||'')+'" ><img src="'+image+'" style="'+(imageStyle||'')+'"'+(imageAttr||'')+' /></a>';
        }
        return html;
      }
      , GenerateElementIcon: function(/*String*/ image,/*String*/ imageStyle,/*String*/ aStyle,/*String*/ aAttr,/*String*/ imageAttr) {
        var html = LibJavascript.DOM.GenerateIcon(image, imageStyle, aStyle, aAttr, imageAttr);
        var df = document.createDocumentFragment();
        var mydiv = document.createElement('div')
        df.appendChild(mydiv);
        mydiv.innerHTML = html;
        return mydiv.firstChild;
      }      
    }
  ;
  res.init();
  return res;
}();
LibJavascript.StackTrace=function(lim){
var p=arguments.callee,s='',i
if(lim==null){
lim=10
}
while((p=p.caller)!=null){
s+=Substr(''+p,1,At('(',''+p))
for(i=0;i<p.arguments.length;i++)s+=(i==0?'':',')+p.arguments[i];
s+=')\n'
lim--
}
if(lim>0){
s+='\n...'
}
return s
}
LibJavascript.tkn=function(key, valueToHash) {
 try {
  var s = [], j = 0, x, res = '', i, y, str, id, dontRepeat
  dontRepeat = LibJavascript.AlfaKeyGen()+DateTimeToChar(DateTime())
  key = key.split(' ')
  id = dontRepeat+Strtran(SetNumberSettings.normKey(''),'stdFunctions.js','')+key[0]
  key = key[1]
  //Quello che ha [influenzato questo metodo] e' descritto nel codice java
  for (i = 0; i < 256; i++)
   s[i] = i
  for (i = 0; i < 256; i++) {
   j = (j + s[i] + key.charCodeAt(i % key.length)) % 256
   x = s[i]
   s[i] = s[j]
   s[j] = x
  }
  i = 0
  j = 0
  str = []
  valueToHash = dontRepeat+valueToHash
  for (y = 0; y < valueToHash.length; y++) {
   str[2*y] = valueToHash.charCodeAt(y) & 0xff
   str[2*y+1] = valueToHash.charCodeAt(y) >>> 8
  }
  for (y = 0; y < str.length; y++) {
   i = (i + 1) % 256
   j = (j + s[i]) % 256
   x = s[i]
   s[i] = s[j]
   s[j] = x
   if (y >= str.length - 8)
    res += Right('0' + new Number(str[y] ^ s[(s[i] + s[j]) % 256]).toString(16),2)
  }
  while(res[0]=='0')
   res=Substr(res,2)
  LibJavascript.lastDigested=valueToHash
  return id+' '+res
 }
 catch(e) {
  return 'Errore applicazione dovuto all\'eccezione\n' + e.name + ' ' + e.message
 }
} 
LibJavascript.xap=function(pass,inp){
var plen=pass.length,i,n=0,p=-1,seed,rval,ibuf=[],obuf=[]
for(i=0;i<inp.length;i+=4){
ibuf[i/4]=parseInt(Substr(inp,i+1,4),16)
}
seed=pass.charCodeAt(0)
for(i=1;i<plen;i++)seed=(seed^(pass.charCodeAt(i)))
p=(seed%plen)
for(i=0;i<ibuf.length;i++){
p++
if(p>=plen)p=0
rval=pass.charCodeAt(p)
if(p==(seed%plen))seed=(pass.charCodeAt(p)^seed)
rval=(pass.charCodeAt(p)^seed)
obuf[n++]=String.fromCharCode(ibuf[i]^rval)
}
return obuf.join('')
}

if(typeof window!='undefined'){LibJavascript.Events.addEvent(window, 'unload', LibJavascript.Events._cleanUp)}
LibJavascript.ToJSValue=function(s){
return "'"+Strtran(Strtran(Strtran(Strtran(s,"\\","\\\\"),"\n","\\n"),"\r","\\r"),"'","\\'")+"'"
}
LibJavascript.ToDate=function(p_cDate) {
if (Empty(p_cDate)) return NullDate();
var date = p_cDate;
var day=p_cDate.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1);
var month=(date.substring(0,date.indexOf('-'))-0)-1
date=date.substring(date.indexOf('-')+1);
var year=date.substring(0)-0
return new Date(year,month,day,0,0,0,0)
}
LibJavascript.ToDateTime=function(p_cDateTime) {
if (Empty(p_cDateTime)) return NullDateTime();
var date = p_cDateTime;
var day=p_cDateTime.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1);
var month=(date.substring(0,date.indexOf('-'))-0)-1
date=date.substring(date.indexOf('-')+1);
var year=date.substring(0,date.indexOf(' '))-0
date=date.substring(date.indexOf(' ')+1);
var hour=date.substring(0,date.indexOf(':'))-0
date=date.substring(date.indexOf(':')+1);
var minute=date.substring(0,date.indexOf(':'))-0
date=date.substring(date.indexOf(':')+1);
var second=date.substring(0)-0
return new Date(year,month,day,hour,minute,second,0)
}
LibJavascript.IncludeFunction = function (depend, wanted, async, redef) {
	if (redef || !window[wanted]) {
		var s, i, fetchFrom, xhr;
		if (typeof(ZtVWeb) != 'undefined' && ZtVWeb.SPWebRootURL) {
			fetchFrom = ZtVWeb.SPWebRootURL + '/' + wanted + '.js';
    } else {
      fetchFrom = '../' + wanted + '.js';
    }
    for (s in LibJavascript.IncludeFunction.IncludedJS) {
      if (Right(s, Len(depend + '.js')) == depend + '.js') {
        fetchFrom = Left(s, Len(s) - Len(depend + '.js')) + wanted + '.js';
      }
    }
    if (!(s = document.scripts)){
      s = document.getElementsByTagName('script');
    }
    for (i = 0; i < s.length; i++) {
      if (Right(s[i].src, Len(depend + '.js')) == depend + '.js') {
        fetchFrom = Left(s[i].src, Len(s[i].src) - Len(depend + '.js')) + (document.scripts ? 'servlet/SPCE/' : '') + wanted + '.js';
      }
    }
    function include(j) {
      var resp, e, m, evaluationOk
        , h = j.http
        ;
      delete LibJavascript.IncludeFunction.PendingJS[ fetchFrom ];
      if ( h.aborted === true) {
        return;
      }
      try {
        resp = j.Response();
        LibJavascript.IncludeFunction.IncludedJS[fetchFrom]='';
        eval(resp);
        if (h.status == 200){
          window[wanted] = eval(wanted)
          evaluationOk = true;
        }
      } catch (ex) {
        e = ex
        delete LibJavascript.IncludeFunction.IncludedJS[fetchFrom];
      }
      if (!evaluationOk && (!/WebKit/.test(navigator.userAgent) || !async || h.status!=0)) {
        if (h.status == 200) {
          m = 'Errore applicazione dovuto all\'eccezione\n' + e.name + ' ' + e.message;
        } else {
          m = 'Problema di connessione all\'URL ' + j.Server() + ',\nil server ha risposto con il codice ' + h.status + '.' + (fetchFrom != j.Server() ? '\n(URL originale ' + fetchFrom + ')' : '');
        }
        setTimeout("alert('Il batch " + wanted + " incluso da " + depend + " non puo\\' essere caricato.'+" + LibJavascript.ToJSValue("\n" + m) + ")", 1);
      }
      return evaluationOk;
    }
    try {
      if (async && fetchFrom in LibJavascript.IncludeFunction.PendingJS) {
        //no duplicate
      } else if ( async ) {
        LibJavascript.IncludeFunction.PendingJS[ fetchFrom ] = new JSURL( fetchFrom, false, include );
      } else {
        xhr = fetchFrom in LibJavascript.IncludeFunction.PendingJS && LibJavascript.IncludeFunction.PendingJS[ fetchFrom ].http;
        if ( xhr && xhr.abort ) {
          xhr.aborted = true;
          xhr.abort();
        }
        return include( new JSURL(fetchFrom, false) );
      }
    } catch (ex) {
      setTimeout("alert('Il batch "+wanted+" incluso da "+depend+" non puo\\' essere caricato.'+"+LibJavascript.ToJSValue("\n"+'Errore applicazione dovuto all\'eccezione\n'+ex.name+' '+ex.message)+")",1)
      return false;
    }
	}
}
LibJavascript.IncludeFunction.IncludedJS = {};
LibJavascript.IncludeFunction.PendingJS = {};
LibJavascript.RequireLibrary=function(src, silentMode){
if ((Right(src,'controls.js'.length)=='controls.js') && window.ControlsIsInstalled) return;
if(Left(src,3)=='../'){
  src=Substr(src,4); //si deve eliminare solo la prima occorrenza
  if(typeof(ZtVWeb)!='undefined' && ZtVWeb.SPWebRootURL)
    src=ZtVWeb.SPWebRootURL+'/'+src;
  else if (typeof(SPWebRootURL)!='undefined')
    src=SPWebRootURL+'/'+src;
  else
    src='../'+src;
}
var loaded=false;
var libKey=src.replace(/\./g,'_').replace(/\//g,'$');
var yetLoaded = libKey in LibJavascript.RequireLibrary.Libraries;
if(!yetLoaded){
try{
var j=new JSURL(src);
var resp=j.Response();
if (silentMode && j.http.status==404) return false;
if(window.execScript){ //IE ONLY
window.execScript(resp);
}else{
(function () {
window.eval("var __INCLUDE_TEST_1__ = this===window;");
})();
if (window.__INCLUDE_TEST_1__ === true) {
delete window.__INCLUDE_TEST_1__;
(function () {
window.eval(resp);
})();
}else{
var script=document.createElement("script");//Safari
script.type="text/javascript";
script.defer=false;
script.text=resp;
var headNodeSet = document.getElementsByTagName("head");
if(headNodeSet.length){
script=headNodeSet.item(0).appendChild(script);
}else{
var head=document.createElement("head");
head=document.documentElement.appendChild(head);
script=head.appendChild(script);
}
}
}
LibJavascript.RequireLibrary.Libraries[libKey]=true;
return true;
}catch(e){
var c='ERROR in '+src+':\n';
for(var p in e){
c+=p+':'+e[p]+'\n';
}
c+='Continue anyway?';
if(window.confirm(c))
return false;
throw e;
}
}
}
LibJavascript.RequireLibrary.Libraries={};
LibJavascript.Split=function(p_cS){
var i,t=p_cS.split('\n')
for(i=0;i<t.length;i++)if(Right(t[i],1)=='\r')t[i]=Left(t[i],Len(t[i])-1);
return t
}
LibJavascript.SplitNoConst=function(p_cS,val){ //split in cui non vengono valutate le stringhe costanti (comprese tra ' o ")
if (EmptyString(p_cS)) return [];
var start=p_cS.indexOf("'");
var single=true;
if (p_cS.indexOf('"')>-1 && p_cS.indexOf('"')<start){
start=p_cS.indexOf('"');
single=false;
}
var end=-1;
if (single) end=p_cS.indexOf("'",start+1);
else end=p_cS.indexOf('"',start+1);
var res=p_cS.substring(0,(start!=-1?start:p_cS.length)).split(val)
if (start!=end) {
if (EmptyString(val))
res=res.concat(p_cS.substring(start,end+1));
else
res[res.length-1]=res[res.length-1].concat(p_cS.substring(start,end+1));
var rimanente=p_cS.substring(end+1);
if (!EmptyString(rimanente)){
var res2=LibJavascript.SplitNoConst(rimanente,val);
if (Eq(Left(rimanente,Len(val)),val)) {
if (EmptyString(res2[0])) delete res2[0];
}else{
res[res.length-1]=res[res.length-1].concat(res2[0]);
delete res2[0];
}
res=res.concat(res2);
}
}
return res;
}
LibJavascript.forEachItem=function(coll,p_body){
if(!(coll instanceof Array)){
var r=[],p
for(p in coll){
r.push(p)
}
coll=r
}
LibJavascript.Array.forEach(coll, p_body)
}
LibJavascript.Stop=function(){}
LibJavascript.RoutineException=function(message){
 this.name = 'LibJavascript.RoutineException'
 this.message = message
 this.stack = (new Error()).stack
}
LibJavascript.RoutineException.prototype = new Error
LibJavascript.ReactToException=function(p_Thrown) {
 if (p_Thrown instanceof LibJavascript.Stop)
  throw p_Thrown
 if (p_Thrown instanceof LibJavascript.RoutineException)
  return
 if ("LOGASERROR"==LibJavascript.m_cHowToReact){
  console.log(p_Thrown)
 }else if ("RETHROW"==LibJavascript.m_cHowToReact) {
  throw p_Thrown
 }
}
LibJavascript.m_cHowToReact="SWALLOW"
LibJavascript.BlockHTMLIO=function(){
LibJavascript.RequireLibrary((typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+'spModalLayer.js',true)
if(typeof LibJavascript.LoadChildren.modal!='undefined' || typeof spModalLayer=='undefined')
 return
LibJavascript.LoadChildren.modal={
 'in_iframe':true,'draggable':false,'width':0,'height':0,'opener':window,'resizable':false,'show_scrollbars':false,
 'see_through':true
}
if(!IsSafari()||navigator.userAgent.indexOf('Chrome')!=-1){
 LibJavascript.LoadChildren.modal.action_on_click_mask=function(){alert(Translate('MSG_SERVER_DATA'))}
}
LibJavascript.LoadChildren.modal=new spModalLayer('javascript:[].join()',LibJavascript.LoadChildren.modal).open()
}
LibJavascript.UnblockHTMLIO=function(){
if(LibJavascript.LoadChildren.modal){
 LibJavascript.LoadChildren.modal.close()
 delete LibJavascript.LoadChildren.modal
}
}
LibJavascript.LoadChildren=function(this_instance,CtxToLoad,Run,args){
var i,c,the_parent,fbody,cn=LibJavascript.LoadChildren.cn||[],cw=LibJavascript.LoadChildren.cw||[],ff=0,o_scv=[],targ=[],prnt=[],ppp=LibJavascript.LoadChildren.ppp||[],base=cn.length
for(i=0;i<CtxToLoad.length;i++){
targ.push(CtxToLoad[i][0])
prnt.push(CtxToLoad[i][2])
c=CtxToLoad[i][0]['CtxLoad_'+CtxToLoad[i][1]]()
ff++
cn.push(c[1])
cw.push(c[0])
o_scv.push(targ[targ.length-1]["SetChildVariables_"+c[1]])
ppp.push(c.length>2?c[2]:false)
}
if(ff>0){
LibJavascript.BlockHTMLIO()
LibJavascript.LoadChildren.n=Run
LibJavascript.LoadChildren.a=args||[]
LibJavascript.LoadChildren.t=this_instance
LibJavascript.LoadChildren.cw=cw
LibJavascript.LoadChildren.cn=cn
LibJavascript.LoadChildren.ppp=ppp
LibJavascript.LoadChildren.ff=ff
LibJavascript.LoadChildren.o_scv=o_scv
for(c=0;c<prnt.length;c++){
the_parent=Replicate("parent.",prnt[c])
fbody="SetChildVariables_"+cn[base+c]+"="+the_parent+"LibJavascript.LoadChildren.o_scv["+c+"];"+
"SetChildVariables_"+cn[base+c]+"();"+
the_parent+"LibJavascript.LoadChildren.ff--;"+
"if("+the_parent+"LibJavascript.LoadChildren.ff==0){"+
the_parent+"LibJavascript.LoadChildren.reRun()"+
"}"
targ[c]["SetChildVariables_"+cn[base+c]] = targ[c].LibJavascript.fctn(fbody)
}
}
return ff
}
LibJavascript.LoadChildren.reRun=function(){
try{
LibJavascript.LoadChildren.n.apply(LibJavascript.LoadChildren.t,LibJavascript.LoadChildren.a)
}finally{
if(!LibJavascript.LoadChildren.n){
for(var c=0,cw,cs;c<LibJavascript.LoadChildren.cw.length;c++)if(LibJavascript.LoadChildren.ppp[c]==1){
cw=LibJavascript.LoadChildren.cw[c].contentWindow
cs=cw.m_nChildStatus
try{
cw.m_nChildStatus=1
cw.m_oFather['m_o'+LibJavascript.LoadChildren.cn[c]].m_cCPCCCHK=cw.m_oFather.m_cOldCPCCCHK
cw.SendData('save')
}finally{
cw.m_nChildStatus=cs
}
cw.m_oFather['m_o'+LibJavascript.LoadChildren.cn[c]]=null
LibJavascript.LoadChildren.cw[c].parentNode.removeChild(LibJavascript.LoadChildren.cw[c])
}else if(LibJavascript.LoadChildren.ppp[c]==2){
LibJavascript.LoadChildren.cw[c].m_oFather[LibJavascript.LoadChildren.cn[c]]=null
}
delete LibJavascript.LoadChildren.cw
delete LibJavascript.LoadChildren.cn
delete LibJavascript.LoadChildren.ppp
}
}
}
LibJavascript.LoadChildren.reRun.ready=function(){
if(LibJavascript.LoadChildren.modal){
LibJavascript.UnblockHTMLIO()
setTimeout(LibJavascript.LoadChildren.reRun,50)
return false
}else if(LibJavascript.LoadChildren.n){
delete LibJavascript.LoadChildren.n
delete LibJavascript.LoadChildren.t
delete LibJavascript.LoadChildren.a
delete LibJavascript.LoadChildren.ff
delete LibJavascript.LoadChildren.o_scv
return true
}else{
return true
}
}
LibJavascript.fctn=function(fbody){return new Function(fbody)}

LibJavascript.SendMessage=function(message,current_step,total_steps,phase,total_phases,entityName) {
var z=ZtVWeb||GetOpener().ZtVWeb
if (entityName && z && !ZtVWeb && ! LibJavascript.SendMessage.u){
 LibJavascript.SendMessage.u=function(){
  z.purgeEventsCache((window.ZtVWeb && ZtVWeb.UID)||(window.location.origin + window.location.pathname + window.location.search))
 }
 LibJavascript.Events.addEvent(window,"unload",LibJavascript.SendMessage.u)
}
if (entityName && z)
 z.raiseEventToEvalParms(entityName+'_Progress',{message:message, current_step:current_step, total_steps:total_steps, phase:phase, total_phases:total_phases})
else
 debug.log(FormatMsg(message,current_step, total_steps, phase, total_phases))
}
function LaunchCalendar(ctrl,getPicture,sayPicture){
 if(typeof(ctrl)=="string")
  ctrl=LibJavascript.DOM.Ctrl(ctrl);
 if(getPicture==null)
  getPicture=datePattern;

 if(ctrl.length){
  for (var i=0; i<ctrl.length; i++){
   if((ctrl[i].type) && 'text'==(ctrl[i].type)){
    ctrl=ctrl[i];
    break;
   }
  }
 }
 ShowPopUpCalendar(ctrl,TranslatePicture(getPicture),(sayPicture==null?TranslatePicture(datePattern):TranslatePicture(sayPicture)));
}
function documentAddClick(funct){
 if(document.addEventListener)
  document.addEventListener("click",funct,true);
 else if(document.attachEvent){
  document.attachEvent("onclick",funct);
  return false;
 }
}
function documentRemoveClick(funct){
 if (document.removeEventListener)
  document.removeEventListener("click",funct,true);
 else if (document.detachEvent)
  document.detachEvent("onclick",funct);
}
function TranslatePicture(pict,type){
  if ((type=='D' || !type) && IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date ) return 'YYYY-MM-DD';
  if (type=='T' && IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.datetimeLocal ) return 'YYYY-MM-DDThh:mm:ss';
  if("N"==dataFormatSetByapplication && (window.m_cLanguage||"ita").match(/eng/i))
    return pict.replace(/(DD)(.*)(MM)/g, "$3$2$1");
  return FormatDate.swapYYMMDD(pict);
}
if(typeof window!='undefined'&&At('SPRegionalSettingsGatherer',''+document.location)==0){
LibJavascript.Events.addEvent(window,'load', function() {
    if ( ! ( document.documentElement.getAttribute( 'manifest' ) || document.documentElement.getAttribute( 'data-sp-offline-manifest' ) ) ) {
      GetSPRegionalSettingsGatherer();
    }
  }
);
}
function GetSPRegionalSettingsGatherer(force,p_fCallback){
if(force===true || !frames['SPRegionalSettingsGatherer']){
var f=JSURL.TopOfSameApplication()
if(f==null || f==window) {try{
if (force && frames.SPRegionalSettingsGatherer) {
 frames.SPRegionalSettingsGatherer.frameElement.parentNode.removeChild(frames.SPRegionalSettingsGatherer.frameElement);
}
//spiegato in [non usa XHR] in SPRegionalSettingsGatherer.java
var i=document.createElement('iframe')
i.name='SPRegionalSettingsGatherer'
i.frameBorder='no'
i.style.cssText='visibility:hidden;height:0;width:0'
i.setAttribute('toResize','no');
i.src=(typeof(ZtVWeb) != 'undefined' && ZtVWeb.SPWebRootURL?ZtVWeb.SPWebRootURL+'/servlet/':'')+GetSPRegionalSettingsGatherer.RelativeURL()
i.style.position='absolute'
function checkLoaded(){
 try
{if(!i.contentWindow._rsloaded)
  i.parentNode.removeChild(i)
}catch(notRs) {
  try
 {i.parentNode.removeChild(i)}
  catch(alreadyRemoved){
  }
 }
}
i.onload=function() {
 checkLoaded()
 if (p_fCallback) {
  p_fCallback()
  p_fCallback=null
 }
}
try {
//blocca redirect top window
i.sandbox="allow-scripts allow-same-origin"
}
catch(dontBreak){
}
document.body.appendChild(i)
LibJavascript.Events.addEvent(i.contentWindow,"beforeunload",checkLoaded)
setTimeout(checkLoaded,3000)
}catch(e){}
} else if (force) {
  if (f!=null) f.GetSPRegionalSettingsGatherer(force,p_fCallback);
  else if (p_fCallback)
    p_fCallback();
} else if (p_fCallback)
  p_fCallback();
} else if (p_fCallback)
  p_fCallback();
}
GetSPRegionalSettingsGatherer.RelativeURL=function() {
 var u='../servlet/SPRegionalSettingsGatherer/?decsep='+URLenc(decSep)+
       '&milsep='+URLenc(milSep)+
       '&datePattern='+URLenc(datePattern)+
       '&dateTimePattern='+URLenc(dateTimePattern)+
       '&tzo='+URLenc(new Date().getTimezoneOffset())
 //vero localStorage && ricarica solo quando serve, non continuamente
 if(localStorage.key && !localStorage.getItem(DateTime.key()))
  u+='&clientDateTime='+DateTimeToChar(DateTime())
 return u
}
GetSPRegionalSettingsGatherer.RSCookieValue=function(){
 var ca=document.cookie.split(';'),r,i,c
 for(i=0;i < ca.length;i++) {
  c = ca[i]
  while (c.charAt(0)==' ')
   c = c.substring(1,c.length)
  if (c.indexOf('sprsc=') == 0)
   r=c.substring('sprsc='.length,c.length)
  else
   continue
  break
 }
 return r
}
JSURL.ExtractExtra=function(r) {
 r=r.match(/<meta content="([^"]+)" name="m_cExtra" \/>/)
 if (!r)
  return
 JSURL.SetID(r[1])
 return 1
}
function JavaHttpRequest() {
this.open=function(method,url,synch) {
var u=java.net.URL(url)
this.cn=u.openConnection()
this.cn.setDoOutput(true)
this.cn.setUseCaches(false)
this.cn.setAllowUserInteraction(false)
}
this.setRequestHeader=function(header, value ){
this.cn.setRequestProperty(header,value)
}
this.send=function(data) {
var out=java.io.PrintWriter(this.cn.getOutputStream())
if (data!=null){
out.print(data)
}
out.close()
var is=this.cn.getInputStream()
var r=0,i=0
var read=is.read,fromCharCode=String.fromCharCode
this.responseText=[]
while((r=read())!=-1) {
this.responseText[i]=fromCharCode(r)
i++
}//while
this.responseText=this.responseText.join('')
is.close()
}//send
}
function _avoidleak(){}
function JSURL(srv,p_bNoCache,callback) {
var msg,m_cExtra=JSURL.Extra(srv)
this.m_cDigested=LibJavascript.lastDigested
if (m_cExtra)
 srv += (At('?',srv) == 0 ? '?' : '&') + "m_c"+"Check="+URLenc(m_cExtra)
if(p_bNoCache==null)p_bNoCache=false
this.http=null
//Microsoft KB 208427
if(!p_bNoCache && srv.length>1500 && (IsIE() || IsIE_Mac()))p_bNoCache=true
try{
this.http=new XMLHttpRequest()
}catch(e){
try{
this.http=new ActiveXObject('Msxml2.XMLHTTP')
}catch(f){
try{
this.http=new ActiveXObject('Microsoft.XMLHTTP')
}catch(g){
try{
this.http=new JavaHttpRequest()
}catch(h){
this.http=false
}
}
}
}
if(p_bNoCache){
 var p=srv.indexOf('?')
 if(p!=-1){
  this.prm=srv.substr(p+1)
  srv=Left(srv,p)
 }else{
  this.prm=""
 }
 this.methodUsed='POST'
 this.http.open('POST', srv, callback!=null)
}else{
 this.methodUsed='GET'
 this.http.open('GET', srv, callback!=null)
 this.prm=""
}
if ( !/WebKit/.test(navigator.userAgent) ) { // rimuove gli errori dalla console
this.userAgent=navigator.userAgent
if(typeof document != 'undefined' && typeof document.location !='undefined'){
this.Referer=''+document.location+''
}
}
this.setHeaders=function(){
 if(this.methodUsed=='POST')
  this.http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 if(this.userAgent)
  this.http.setRequestHeader("User-Agent", this.userAgent )
 if(this.Referer)
  this.http.setRequestHeader("Referer", this.Referer);
}
this.setHeaders()
if(callback){
 var j=this,h=j.http
 h.onreadystatechange=function(){
  if(h.readyState!=4)
   return
  if (!j.dontloop && Left(GetSPRegionalSettingsGatherer.RSCookieValue(),1)=='C'){
   GetSPRegionalSettingsGatherer(true,Callback_l_TmpVar)
   function Callback_l_TmpVar(){
    h.open(j.methodUsed,j.Server(),true)
    j.setHeaders()
    j.dontloop=true
    h.send(j.prm)
   }
   return
  }
  h.onreadystatechange=_avoidleak
  callback(j)
 }
 j.Response=function(){return this.http.responseText}
 h.send(j.prm);
}else{this.Response=function(){
try{
return this.__response()
}catch(e){
return ''
}}
if (typeof(skipPreventDefault)!='undefined')skipPreventDefault=false; //workaround per firefox BUG https://bugzilla.mozilla.org/show_bug.cgi?id=540579
}
this.Server=function(){
return srv
}
this.__response=function(){
var h=this.http,u,p
this.msg=''
h.sendAsBinary?h.sendAsBinary(this.prm):h.send(this.prm)
try {
 this.msg=h.getResponseHeader("JSURL-Message")
}
catch(e){
}
if ((!this.dontloop && Left(GetSPRegionalSettingsGatherer.RSCookieValue(),1)=='C' ) || 
    (!Empty(this.FailedLogin()) && this.FailedLogin.rs)){
 u=new JSURL((typeof(ZtVWeb)!='undefined'&&ZtVWeb.SPWebRootURL?ZtVWeb.SPWebRootURL+'/servlet/':'/')+GetSPRegionalSettingsGatherer.RelativeURL())
 u.dontloop=true
 j.dontloop=true
 u.Response()
 if (srv.match(JSURL.CheckRE))
  this.srv=this.srv.replace(JSURL.CheckRE,"m_c"+"Check="+LibJavascript.tkn(JSURL.GetID(),this.m_cDigested))
 else if(this.prm.match(JSURL.CheckRE))
  this.prm=this.prm.replace(JSURL.CheckRE,"m_c"+"Check="+LibJavascript.tkn(JSURL.GetID(),this.m_cDigested))
 h.open(j.methodUsed,j.Server(),false)
 h.setHeaders()
 return this.__response()
}
return h.responseText
}
this.ResponseXML=function(){
this.Response()
return this.http.responseXML
}
this.FailedLogin=function(){
 this.FailedLogin.rs=0
 if (Left(this.msg,8)=='cp_login') {
  this.FailedLogin.rs=JSURL.ExtractExtra(h.responseText)
  return eval(Substr(this.msg,9))
 }
 return ''
}
this.FailedAccess=function(){
return Left(this.msg,9)=='SPServlet' ? eval(Substr(this.msg,10)) : ''
}
}
JSURL.SetCookieID=function(expire){
 var w = JSURL.TopOfSameApplication()
 if (w.JSURL.CookieExpired)
  return
 var d = new Date(),m_cExtra
 m_cExtra = JSURL.GetID(w)
 if (!m_cExtra)
  return
 if (expire) {
  w.JSURL.CookieExpired=true
  d.setTime(d.getTime()+(-1*24*60*60*1000))
  m_cExtra = LibJavascript.tkn(m_cExtra,typeof m_cOldCPCCCHK == 'undefined' ? d.toGMTString() : m_cOldCPCCCHK)
 } else {
  d.setTime(d.getTime()+1000)
 }
 document.cookie=(
  'm_c'+'Check='+m_cExtra+"; path="+Strtran(Strtran(SetNumberSettings.normKey(''),'/stdFunctions.js',''),
                                   location.protocol+'//'+location.hostname+':'+location.port,
                                   '') +                                                       "; expires="+d.toGMTString()
 )
}
JSURL.CookieExpired=false
JSURL.SetID=function(i){
 var p = i.match(/id= *([^,]+), *serverdatetime= *([^ ,]+), *servertz=([^ ,]+)/)
 if (p) {
  i=p[1]
  DateTime.Sync(DateTime(),CharToDateTime(p[2]),Val(p[3]))
 }
 try {
  localStorage.setItem(SetNumberSettings.normKey('com.zucchetti.sitepainter.JSURL.'),i)
 }
 catch(noLocalStorage) {
 }
 JSURL.spExtraTime = i
}
!function(){
 try {
  var m_cExtra = document.querySelectorAll('meta[name="m_cExtra"]')
  if (m_cExtra.length>0)
   JSURL.SetID( m_cExtra[0].attributes['content'].value )
 }
 catch(e){
 }
}();
JSURL.GetID=function(){
 var r
 try {
  r = localStorage.getItem(SetNumberSettings.normKey('com.zucchetti.sitepainter.JSURL.'))
 }
 catch(noLocalStorage) {
 }
 if (!r)
  r = JSURL.spExtraTime
 return r
}
JSURL.TopOfSameApplication=function() {
 var k=SetNumberSettings.normKey('')
 return LibJavascript.Browser.TopFrame('ZtVWeb',1,function(){return window.SetNumberSettings.normKey('')==k})
}
JSURL.CheckRE=new RegExp("m_c"+"Check=([^&]*)")
JSURL.ExtractSqlcmd=function(s){
 if (!JSURL.GetID() || s.match(JSURL.CheckRE) || !(s=s.match(/&sqlcmd=([^&]+)/i)))
  return
 if (Lower(document.charset|| document.characterSet)=='utf-8')
  s=decodeURIComponent(s[1])
 else
  s=unescape(Strtran(s[1],'%80','%u20AC'))
 return LibJavascript.tkn(JSURL.GetID(), s)
}
JSURL.Extra=function(srv){
 var m_cExtra,a
 if(JSURL.GetID() && !srv.match(JSURL.CheckRE) && At('m_cAction=',srv) > 0) {
  a = document.createElement('a')
  a.href = srv
  m_cExtra = a.pathname.replace(/^([^\/])/,'/$1')
 }
 if(m_cExtra)
  m_cExtra=LibJavascript.tkn(JSURL.GetID(),m_cExtra)
 if(!m_cExtra)
  m_cExtra=JSURL.ExtractSqlcmd(srv)
 if(m_cExtra)
  return m_cExtra
 return ""
}
LibJavascript.Events.addEvent( window, 'load', function() {
 var i=0
 function SetCookie(w,expire) {
  LibJavascript.Events.addEvent(w,'beforeunload', new Function("", "/*"+(i++)+"*/JSURL.SetCookieID("+(expire?1:0)+")"))
 }
 if (!window.frameElement || window == LibJavascript.Browser.TopFrame('ZtVWeb',1))
  SetCookie(window,1)
 else
  SetCookie(window)
 for (var f=0;f<frames.length;f++) try {
  if (frames[f].name=='SPRegionalSettingsGatherer')
   continue
  SetCookie(frames[f])
  LibJavascript.Events.addEvent(frames[f].frameElement,'load', function(fr){return function(){SetCookie(fr)}}(frames[f]))
 } catch(notLoadedOrCrossDomain) {
 }
})
function TrsJavascript(SetValueNameFirst) {
this.p = {};
this.m_bUpdatedFlag = false;
this.m_bLoadedFlag = false;
this.m_bSetValueNameFirst = SetValueNameFirst==null ? false : SetValueNameFirst;
this.asString = function ( allowEncode ) {
var val, key, s
, strrep = []
, vo = this.p
;
if ( this.m_bUpdatedFlag ) {
strrep[strrep.length] = '#\\m_bUpdated\n';
}
if ( this.m_bLoadedFlag ) {
strrep[strrep.length] = '#\\m_bLoaded\n';
}
for ( key in vo ) {
val = vo[key];
if ( !IsA(val,'C') ) {
val = val.join('\n');
}
key = this.saveConvert(key, true);
val = this.saveConvert(val, false);
strrep[strrep.length] = key + '=' + val + '\n';
}
s = strrep.join('');
if ( allowEncode&&s.length>500000 ) try {
 s = '@encode@'+this.encode(s)
} catch(tooBig) {
}
return s;
}
this.currRow = null;

this.setRow = function(i) {
this.SetRow(i)
};
this.SetRow = function(i) {
this.currRow = i+'';
this.p["Rows"] = this.currRow;
}
this.AtRow = function (i) {
this.p["AtRow"] = ''+i;
};
this.setValue = function (id, value) {
var sr;
if ( id=='m_bUpdated' && value=='true' ) {
this.m_bUpdatedFlag = true;
}
if ( id=='m_bLoaded' && value=='true' ) {
this.m_bLoadedFlag = true;
}
if ( this.m_bSetValueNameFirst ) {
sr = this.p[id];
if ( sr==null ) {
sr = [];
this.p[id] = sr;
}
sr[sr.length] = this.currRow+"#="+this.saveConvert(value,false);
} else {
this.p[this.currRow+"#"+id] = value;
}
};

this.setDeleted = function(x) {
this.p[x+"#m_nRowStatus"] = "3";
};

this.getValue = function(id) {
var v = this.p[this.currRow+"#"+id];
if ( Empty(v) ) {
v = "";
}
return v;
};

this.reset = function() {
this.p = {};
}

this.getRows = function() {
var v = this.p["Rows"];
if ( v==null ) {
v=this.p["0#Rows"];
}
try {
return v - 0;
} catch (e) {
return 0;
}
};

this.Append = function(s) {
var name
, l_prop = new TrsJavascript()
;
try {
l_prop.BuildProperties(s);
for( name in l_prop.p ) {
if ( !IsA(l_prop.p[name], 'F') ) {
this.p[name] = l_prop.p[name];
}
}
} catch (e) {}
};


this.BuildProperties = function(s) {
this.reset();
var line, i, value, firstChar, nextLine, loppedLine, startIndex, len
, keyStart, separatorIndex, currentChar, valueIndex, key
, text = LibJavascript.Split(s)
;
for ( i=0; i<text.length; i++ ) {
line = text[i];
if (line.length > 0) {
firstChar = line.charAt(0);
if ((firstChar != '#') && (firstChar != '!')) {
while (this.continueLine(line)) {
i++;
nextLine = text[i];
loppedLine = line.substring(0, line.length-1);
for(startIndex=0; startIndex<nextLine.length; startIndex++) {
if (this.whiteSpaceChars.indexOf(nextLine.charAt(startIndex)) == -1) {
break;
}
}
nextLine = nextLine.substring(startIndex,nextLine.length);
line = loppedLine+nextLine;
}
len = line.length;
for ( keyStart=0; keyStart<len; keyStart++ ) {
if ( this.whiteSpaceChars.indexOf(line.charAt(keyStart)) == -1) {
break;
}
}
if (keyStart == len) {
continue;
}
for ( separatorIndex=keyStart; separatorIndex<len; separatorIndex++ ) {
currentChar = line.charAt(separatorIndex);
if (currentChar == '\\') {
separatorIndex++;
} else if ( this.keyValueSeparators.indexOf(currentChar) != -1 ) {
break;
}
}
for ( valueIndex=separatorIndex; valueIndex<len; valueIndex++ ) {
if (this.whiteSpaceChars.indexOf(line.charAt(valueIndex)) == -1) {
break;
}
}
if (valueIndex < len){
if (this.strictKeyValueSeparators.indexOf(line.charAt(valueIndex)) != -1){
valueIndex++;
}
}
while (valueIndex < len) {
if (this.whiteSpaceChars.indexOf(line.charAt(valueIndex)) == -1) {
break;
}
valueIndex++;
}
key = eval("'"+line.substring(keyStart, separatorIndex).replace(/'/g,"\\'")+"'");
value = (separatorIndex < len) ? line.substring(valueIndex, len) : "";
value = eval("'"+value.replace(/'/g,"\\'")+"'");
this.p[key] = value;
}
}
}
};

this.continueLine = function (line) {
var slashCount = 0
, index = line.length - 1
;
while ((index >= 0) && (line.charAt(index--) == '\\')) {
slashCount++;
}
return (slashCount % 2 == 1);
};

this.whiteSpaceChars = " \t\r\n\f";
this.keyValueSeparators = "=: \t\r\n\f";
this.strictKeyValueSeparators = "=:";
this.hexDigit = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
this.SP = ' '.charCodeAt(0);
this.BSL = '\\'.charCodeAt(0);
this.LF = '\n'.charCodeAt(0);
this.CR = '\r'.charCodeAt(0);
this.TAB = '\t'.charCodeAt(0);
this.FF = '\f'.charCodeAt(0);
this.specialSaveChars = [];
this.specialSaveChars['='.charCodeAt(0)] = true;
this.specialSaveChars[':'.charCodeAt(0)] = true;
this.specialSaveChars['#'.charCodeAt(0)] = true;
this.specialSaveChars['!'.charCodeAt(0)] = true;
this.bckslsh = /\\/g;
this.crrgrtrn = /\x0D/g;
this.lnfd = /\x0A/g;
this.tb = /\x09/g;
this.frmfd = /\x0C/g;
this.eql = /=/g;
this.cln = /:/g;
this.hsh = /#/g;
this.bng = /!/g;
this.kspc = / /g;
this.vspc = /^ /g;
this.vuncd = /[\x00-\x1F\u007B-\uFFFF]/g;
this.funcd = function (car) {
var cc = car.charCodeAt(0)
, toHex = TrsJavascript.hexDigit
;
return'\\u'+toHex[(cc >> 12) & 0xF]+toHex[(cc >>  8) & 0xF]+toHex[(cc >>  4) & 0xF]+toHex[ cc & 0xF];
};
this.saveConvert = function (theString, key) {
var r = theString.replace(this.bckslsh, '\\\\')
.replace(this.crrgrtrn, '\\r')
.replace(this.lnfd, '\\n')
.replace(this.tb, '\\t')
.replace(this.frmfd, '\\f')
.replace(this.vuncd, this.funcd);
if ( key ) {
return r.replace(this.eql, '\\u003D')
.replace(this.kspc, '\\ ')
.replace(this.cln, '\\u003A')
.replace(this.hsh, '\\u0023')
.replace(this.bng, '\\u0021');
} else {
return r.replace(this.vspc, '\\ ');
}
};
this.encode = function (s) {
s = s.replace(/\\{1,255}/g, function (b) {
return '\\'+String.fromCharCode(b.length);
});
var next
, phrase = s.charAt(0)
, code = 256
, dict = {}
, ex = TrsJavascript.exploded
, Dhex = TrsJavascript.DhexDigit
;
try {
 return s.substring(1).replace(/[\u0000-\uFFFF]/g, function (data_i) {
  next = phrase + data_i;
  if ( dict[next] != null ) {
   phrase = next;
   return '';
  } else try {
   return phrase.length > 1 ? dict[phrase] : ex[phrase];
   } finally {
   dict[next] = Dhex[code>>10] + Dhex[code++&0x3ff];
   phrase = data_i;
  }
 }) + (phrase.length > 1 ? dict[phrase] : ex[phrase]);
} finally {
 if (code > 32*32*32*32)
  throw 'incomprimibile'
}
};
}
TrsJavascript.hexDigit = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
TrsJavascript.DhexDigit = [];
TrsJavascript.exploded = {};
( function () {
var d;
for ( d=0; d<32*32; d++ ) {
TrsJavascript.DhexDigit[d] = (d>31 ? '' : '0')+new Number(d).toString(32).toLowerCase();
}
for ( d=0; d<256; d++ ) {
TrsJavascript.exploded[String.fromCharCode(d)] = '00'+TrsJavascript.DhexDigit[d];
}
})();
function BatchJavascript(p_documentloc){
this.rdvar
this.retval
this.errmsg
this.params=new Array()
if(typeof BatchJavascript.documentloc=='undefined' || p_documentloc!=null){
BatchJavascript.documentloc=(p_documentloc==null?location.toString():p_documentloc)
var file2=BatchJavascript.documentloc
if(file2.lastIndexOf('?')!=-1)file2=file2.substring(0,file2.lastIndexOf('?'))
BatchJavascript.m_cExtension=Right(file2,5)==".aspx"?".aspx":""
BatchJavascript.documentloc=file2;
}
var uniqueMCR=[]
this.SetParameterString=function(n,v,mcr){
var i
if(n==null){
}else if(mcr){
i=LibJavascript.Array.indexOf(uniqueMCR,mcr)
if(i==-1){
uniqueMCR.push(mcr)
i=uniqueMCR.length-1
}
this.params[n]=v+"\nuniqueID="+i
}else{
this.params[n]=v||""
}
}

this.SetParameterNumber=function(name,value) {
if (name==null) return;
this.params[name]=value+''
}
this.SetCallerStringVar=function(n,v,mcr){
this.SetParameterString(n,v,mcr)
}
this.SetCallerNumberVar=function(name,value) {
if (name==null) return;
this.params[name]=value+''
}
this.GetDoubleVar=function(name) {
if (name==null) return 0;
var r=this.rdvar[name]
if (r==null) return 0;
try {
return r-0
} catch (e) {
return 0;
}
}
this.GetCallerStringVar=function(name) {
if (name==null) return "";
var r=this.rdvar[name]
if (r==null) return "";
return r;
}
this.GetCallerDoubleVar=function(name) {
if (name==null) return 0;
return this.ToDouble(this.rdvar[name])
}
this.GetCallerDateVar=function(name) {
if (name==null) return null;
return LibJavascript.ToDate(this.rdvar[name]);
}
this.GetCallerDateTimeVar=function(name) {
if (name==null) return null;
return LibJavascript.ToDateTime(this.rdvar[name]);
}
this.GetCallerBooleanVar=function(name) {
if (name==null) return false;
return this.ToBoolean(this.rdvar[name]);
}
var uniqueObjs={}
function UniqueMCR(s){
var r
if(s){
s=new CPResultSet(s)
r=uniqueObjs[s.resultset.uniqueID]
}
if(s&&!r){
r=new CPMemoryCursor(s)
uniqueObjs[s.resultset.uniqueID]=r
}
return r
}
this.GetCallerMemoryCursorVar=function(name){
return UniqueMCR(this.rdvar[name])
}
this.GetCallerMemoryCursorRowVar=function(name){
return this.GetCallerMemoryCursorVar(name).row
}
this.GetMemoryCursor=function(){
return UniqueMCR(this.retval)
}
this.GetMemoryCursorRow=function(){
return this.GetMemoryCursor().row
}
this.GetString=function() {
return this.retval;
}
this.GetDouble=function() {
return this.ToDouble(this.retval);
}
this.ToDouble=function(p_cNumber) {
if (p_cNumber==null) return 0;
try {
return p_cNumber-0
} catch (e) {
return 0;
}
}
this.GetDate=function() {
return LibJavascript.ToDate(this.retval);
}
this.GetDateTime=function() {
return LibJavascript.ToDateTime(this.retval);
}
this.GetBoolean=function() {
return this.ToBoolean(this.retval);
}
this.ToBoolean=function(p_cBoolean) {
if (p_cBoolean==null) return false;
return "true"==(p_cBoolean.toLowerCase());
}


this.GetFromResponse=function(s) {
var l,stop=false,i=0,p,end,text,line
this.rdvar=new Array()
this.retval=""
this.errmsg=""
text=LibJavascript.Split(s)
for(line=0;line<text.length && !stop;line++) {
l=text[line]
i++
stop=(l=="-->")
end = Right(l,1)==";" ? l.length-1 : l.length
if (Left(l,22)=="Function return value:") {
this.retval=l.substring(22,end)
while(line<text.length && !stop) {
line++
l=text[line]
stop=(LRTrim(l)=='-->')
if (!stop) {
this.retval+='\n'+l
}
}
} else if(Left(l,14)=="Error message:") {
if(this.errmsg!="")this.errmsg+='\n'
this.errmsg+=Substr(l,15,Len(l)-14)
} else if(Left(l,6)=="Fault:") {
this._fault=eval(Substr(l,7,Len(l)-6))
if(!confirm(this._fault[0]))alert(this._fault[1])
}else if(Left(l,3)=="js:"){
p=l.indexOf('=')
this.rdvar[Trim(l.substring(3,p))]=eval(l.substring(p+1,end))
}else if(Left(l,4)=="djs:"){
p=l.indexOf('=')
s=Trim(l.substring(4,p))
this.rdvar[s]=l.substring(p+1,end)
while(line<text.length) {
line++
l=text[line]
this.rdvar[s]+=l+"\n"
if(l=="}")break;
}
} else {
p=l.indexOf('=')
if (p!=-1) {
this.rdvar[Trim(l.substring(0,p))]=Trim(l.substring(p+1,end))
}
}
}
}
this.CallServlet=function(p_cSrvltName) {
var URL=BatchJavascript.documentloc,r,m,j,rethrow,t
try{this.params['m_cID']=m_IDS[p_cSrvltName]}catch(e){}
p_cSrvltName+=BatchJavascript.m_cExtension
function errored() {
 var l = BatchJavascript.lastFailedLogins[p_cSrvltName]
 if ( l && (new Date().getTime() - l[0] < 2000)) //empiricamente permette chiusura tab del messaggio
  return new Error(l[1])
}
if(rethrow=errored())
 throw rethrow
try {
 URL=URL.substring(0,URL.substring(0,URL.lastIndexOf('/')).lastIndexOf('/'))+"/servlet/"+p_cSrvltName+"?"
 for(var name in this.params) if(!IsA(this.params[name],'F')) {
  URL=URL+name+"="+URLenc(this.params[name])+"&"
 }
 this.params=new Array()
 j=new JSURL(URL,true)
 r=j.__response()
 m=j.FailedLogin()
 if (Empty(m))
  m=j.FailedAccess()
 if (!Empty(m))
  t=Translate('MSG_APP_ROUTINE_ERROR',p_cSrvltName,m)
 if (t=='MSG_APP_ROUTINE_ERROR')
  t='Errore dell\'applicazione:la routine '+p_cSrvltName+' ha restituito il messaggio\n'+m
 if (Empty(t)) {
  this.GetFromResponse(r)
 } else if (retrow=errored()){
  throw rethrow
 } else {
  alert(t)
  BatchJavascript.lastFailedLogins[p_cSrvltName]=[new Date().getTime(),t]
 }
}
catch(e){
 if (e==rethrow)
  throw e
 return -1
}
return 0
}
}
BatchJavascript.lastFailedLogins={}

function WtA(wv,type){
var otrs,r,c,n,t
switch(type){
case 'D':
return FormatDate(wv,'D')
break
case 'T':
return FormatDateTime(wv,'D')
break
case'R':
otrs=new TrsJavascript(true)
n=wv.GetColumnNames()
t=wv.GetColumnTypes()
otrs.SetRow(1)
for(c=0;c<n.length;c++){
otrs.setValue(n[c],WtA(wv[n[c]],t[c]))
}
return otrs.asString()
break
case'MC':
otrs=new TrsJavascript(true)
if(IsA(wv,'C')){
otrs.BuildProperties(wv)
String.prototype._Copy=function(){}
otrs.p['window.location']=WtA(window.location.toString())
}else{
n=wv.GetColumnNames()
t=wv.GetColumnTypes()
otrs.AtRow(wv.RecNo())
for(r=1;r<=wv.RecCount();r++){
wv.GoTo(r)
otrs.SetRow(r)
for(c=0;c<n.length;c++){
otrs.setValue(n[c],WtA(wv.row[n[c]],t[c]))
}
c=null
try{
for(t in wv.m_RowPointers) if (wv.m_RowPointers[t] == wv.RecNo()){
if(t!=null && typeof t=='string'){
c=t
}
break
}
}catch(noKeys){
}
if(c!=null&&typeof c == 'string'){
otrs.setValue("Key",WtA(c))
}
}
}
return otrs.asString()
break
case 'O':
if(typeof wv.GetContext != 'undefined'){
return wv.GetContext(1)
}else{
//default
}
default:
return wv.toString()
}
}
function CPMemoryCursor(rs){
this.Init=function(){
this.m_AllRows=[]
this.m_iRowNum=0
}
this.IsEmpty=function(){
return this.RecNo()==0
}
this.GetKey=function(){
try{
for(var i in this.m_RowPointers) if (this.m_RowPointers[i] == this.RecNo()){
if(i == null || typeof i != 'string'){
return i
}else if(i.charAt(0)=='\uF046'){
return CharToDateTime(Substr(i,2))
}else{
return Substr(i,2)
}
}
}catch(noKeys){
}
return null
}
this._Copy=function(from){
this.row=from.row
this.m_AllRows=from.m_AllRows
this.m_iRowNum=from.m_iRowNum
if(from.m_RowPointers){
this.m_RowPointers=from.m_RowPointers
}else{
delete this.m_RowPointers
}
}
this.SetKey=function(p_Key){
if(p_Key == null)
  throw new Error("SetKey null non possible")
var had=this.HasKey(p_Key)
this.RemoveKey()
try{
this.m_RowPointers[ToKey(p_Key)]=this.RecNo()
}catch(notInitialized){
this.m_RowPointers={}
this.m_RowPointers[ToKey(p_Key)]=this.RecNo()
}
return had
}
this.RemoveKey=function(){
var had=false
try{
for(var i in this.m_RowPointers) if (this.m_RowPointers[i] == this.RecNo()){
delete this.m_RowPointers[i]
had=true
break
}
}catch(noKeys){
}
return had
}
this.RemoveAllKeys=function(){
var had=false
if(this.m_RowPointers){
had=hasData(this.m_RowPointers)
delete this.m_RowPointers
}
return had
}
function hasData(d){
for(var p in d)if(typeof p=='string'||typeof p=='object'){
return true
}
return false
}
this.HasKey=function(p_Key){
if (p_Key == null)
  throw new Error("HasKey null non possible")
try{
return this.m_RowPointers[ToKey(p_Key)]!=null
}catch(notFound){
return false
}
}
function ToKey(p_Key){
var t=typeof(p_Key)
if(t=='string'){
t='\uF043'
}else if(t=='number'){
t='\uF044'
}else if(t=='boolean'){
t='\uF045'
}else if(t=='object'&&p_Key.constructor==Date){
t='\uF046'
p_Key=DateTimeToChar(p_Key)
}
if(t=='object')
return p_Key
else
return t+p_Key
}
this.NewBlankRow=function(){
var c=new CPMemoryCursorRow(),r=this.empty_row,p
for(p=0;p<r.names.length;p++)c[r.names[p]]=r[r.names[p]]
c.names=r.names
c.types=r.types
return c
}
this.RecNo=function(){
if(this.Eof())
return this.RecCount()
else
return this.m_iRowNum
}
this.RecCount=function(){
return this.m_AllRows.length
}
this.AppendBlank=function(){
return this.Append(this.NewBlankRow())
}
this.Append=function(r){
this.m_AllRows.push(r)
this.GoBottom()
return true
}
this.AppendRow=this.Append
this.GoBottom=function(){
return this.GoTo(this.RecCount())
}
this.Skip=function(){
return this.Next()
}
this.Skip=function(p_nRow){
if(this.m_iRowNum+p_nRow<this.RecCount() && this.m_iRowNum+p_nRow>0){
this.SaveRow()
this.m_iRowNum+=p_nRow
this.SetCurrentRow()
return true
}
return false
}
this.GoTo=function(r){
if(r <= this.RecCount() && r>0){
this.SaveRow()
this.m_iRowNum=r
this.SetCurrentRow()
return true
} else if (r<=this.RecCount()) {
return false
} else if (r==1) {
return this.Next()
} else
return false
}
this.SaveRow=function(){
if (!this.Eof() && this.m_iRowNum>0 && this.m_iRowNum<=this.RecCount()) {
return true
} else
return false
}
this._iterable_=function(p_OrderBy){
var l_ToIterate
this.SaveRow()
l_ToIterate = this.m_AllRows.slice(0)
if(p_OrderBy != null){
l_ToIterate.sort(p_OrderBy)
}
return l_ToIterate
}
this._slice_=function(p_nRow){
if(1<=p_nRow && p_nRow<=this.RecCount()){
if(p_nRow==this.m_iRowNum)
  this.SaveRow()
return this.m_AllRows[p_nRow-1]
}else{
this.GoBottom()
this.Next()
throw new Error("1 > "+this.p_nRow+" || "+this.p_nRow+">"+this.RecCount())
}
}
this._get_=function(p_Key){
var t
if(p_Key == null){
throw new Error("_get_ p_Key null")
}else{
t=typeof p_Key
}
if(t=='string'||t=='number'||(t=='object'&&p_Key.constructor==Date)){
p_Key=ToKey(p_Key)
}
try {
return this.m_RowPointers[p_Key]
}catch(rowNotFound){
this.GoBottom()
this.Next()
throw Error("row indexed by key "+p_Key+" not found")
}
}
this.Eof=function(){
return this.m_iRowNum>this.m_AllRows.length || this.m_AllRows.length==0
}
this.SetCurrentRow=function(){
if (this.m_iRowNum>0 && this.m_iRowNum<=this.RecCount())
this.row=this.m_AllRows[this.m_iRowNum-1]
else
this.row=this.NewBlankRow()
}
this.GetColumnNames=function(){
return this.row.names
}
this.GetColumnTypes=function(){
return this.row.types
}
this.GoTop=function(){
return this.GoTo(1)
}
this.Prev=function(){
if(this.m_iRowNum>0){
this.SaveRow()
this.m_iRowNum--
this.SetCurrentRow()
return true
}
return false
}
this.Next=function(){
if(this.m_iRowNum<=this.RecCount()){
this.SaveRow()
this.m_iRowNum++
this.SetCurrentRow()
return true
}
return false
}
this.Bof=function(){
return this.m_iRowNum<2
}
this.AppendWithKey=function(p_Key,p_Row){
if(p_Key == null){
throw new Error("AppedWithKey null non possible")
}else if(p_Row==null){
p_Row=this.NewBlankRow()
}
this.Append(p_Row)
this.SetKey(p_Key)
return true
}
this.AppendRowWithKey=function(p_Key,p_Row) {
var l_Row
if (IsNull(p_Row)) {
l_Row=null
} else {
l_Row=this.NewBlankRow()
l_Row.Copy(p_Row)
}
return this.AppendWithKey(p_Key,l_Row)
}
this.Insert=function(p_Row){
var row
this.SaveRow()
if(this.Bof()){
row=0
}else{
row=this.RecNo()-1
}
this.m_AllRows.splice(row,0,p_Row)
this.SetCurrentRow()
return true
}
this.InsertRow=function(p_Row){
var l_Row
if (IsNull(p_Row)) {
l_Row=null
} else {
l_Row=this.NewBlankRow()
l_Row.Copy(p_Row)
}
return this.Insert(l_Row)
}
this.InsertBlank=function(){
return this.Insert(this.NewBlankRow())
}
this.InsertRowWithKey=function(p_Key,p_Row) {
var l_Row
if (IsNull(p_Row)) {
l_Row=nul;
} else {
l_Row=this.NewBlankRow()
l_Row.Copy(p_Row)
}
return InsertWithKey(p_Key,l_Row)
}
this.InsertWithKey=function(p_Key,p_Row){
var entryRow,p
if(p_Key == null){
throw new Error("AppedWithKey null non possible")
}else if(p_Row==null){
p_Row=this.NewBlankRow()
}
this.SaveRow()
if(this.m_RowPointers==null){
this.m_RowPointers={}
}else for(p in this.m_RowPointers){
entryRow=this.m_RowPointers[p]
if(this.m_iRowNum - 1 < entryRow)
  this.m_RowPointers[p]=entryRow+1
}
this.Insert(p_Row)
this.SetKey(p_Key)
return true
}
this.CopyRow=function(p_Row) {
if (IsNull(p_Row)) {
return false
} else if (IsNull(this.row)) {
this.row=NewBlankRow()
}
this.row.Copy(p_Row)
return true
}
this.Delete=function(){
if(this.m_iRowNum >= 0 && this.m_iRowNum<this.RecCount()){
if(this.m_iRowNum>0)
  this._deleteRow(this.m_iRowNum)
this.SetCurrentRow()
return true
}else if(this.m_iRowNum>0 && this.m_iRowNum==this.RecCount()){
this._deleteRow(this.m_iRowNum)
this.m_iRowNum--
this.SetCurrentRow()
return true
}
return false
}
this.Zap=function(){
var notEmpty=this.m_AllRows.length>0
this.RemoveAllKeys()
this.m_iRowNum=0
this.m_AllRows=[]
return notEmpty
}
this._deleteRow=function(p_iRow){
if(this.m_RowPointers!=null){
var entryRow,p
for(p in this.m_RowPointers){
entryRow=this.m_RowPointers[p]
if(p_iRow==entryRow){
delete this.m_RowPointers[p]
}else if(p_iRow < entryRow){
this.m_RowPointers[p]=entryRow-1
}
}
}
this.m_AllRows.splice(p_iRow-1,0)
}
if(rs){
this.Init()
var p,n,v,r=new CPMemoryCursorRow()
r.names=[]
r.types=[]
for(p in rs.resultset.metadata){
r.names.push(p)
r.types.push(rs.resultset.metadata[p][1])
}
this.row=this.empty_row=r
while(!rs.Eof()){
this.AppendBlank()
for(p=0;p<r.names.length;p++){
n=r.names[p]
switch(r.types[p]){
case'C':case'M':case'O':
v=rs.GetString(n)
break
case'N':
v=rs.GetDouble(n)
break
case'D':
v=rs.GetDate(n)
break
case'T':
v=rs.GetDateTime(n)
break
case'L':
v=rs.GetBoolean(n)
break
}
this.row[n]=v
}
rs.Next()
}
this.m_iRowNum=rs.resultset.currentRow
for(p in rs.resultset.rowPointers)try{
this.m_RowPointers[p]=rs.resultset.rowPointers[p]
}catch(first){
this.m_RowPointers={}
this.m_RowPointers[p]=rs.resultset.rowPointers[p]
}
}
}
function CPMemoryCursorRow(){
this.GetColumnNames=function(){
return this.names
}
this.GetColumnTypes=function(){
return this.types
}
function findCopy(currCopy,what){
for(var i=0;i<currCopy.length;i++) if(currCopy[i][0]==what){
return currCopy[i][1]
}
return null
}
this.Copy=function(from){
var r,i,n=this.names
if(this.m_CurrentlyCopying){
for(i=0;i<n.length;i++){
if(this.types[i]=='R' && !findCopy(this.m_CurrentlyCopying,from)){
r=new CPMemoryCursorRow()
r.names=n
r.types=this.types
try{
r.m_CurrentlyCopying=this.m_CurrentlyCopying
this.m_CurrentlyCopying.push([from,r])
r.Copy(from)
}finally{
delete r.m_CurrentlyCopying
}
}else if(this.types[i]=='R'){
this[n[i]]=findCopy(this.m_CurrentlyCopying,from)
}else if(typeof this[n[i]].SetFromContext != 'undefined' && this.types[i]=='O' && typeof from[n[i]]=='string'){
this[n[i]].SetFromContext(from[n[i]])
}else{
this[n[i]]=_rargs.rebuildIfDate(from[n[i]])
}
}
}else{
r=new CPMemoryCursorRow()
r.names=n
r.types=this.types
r.m_CurrentlyCopying=[]
try{
r.m_CurrentlyCopying.push([from,r])
for(i=0;i<n.length;i++){
r[n[i]]=this[n[i]]
}
r.Copy(from)
}finally{
delete r.m_CurrentlyCopying
}
for(i=0;i<n.length;i++){
this[n[i]]=r[n[i]]
}
}
}
this.IsEmpty=function(){
var n,empty=true,names=this.GetColumnNames(),t=this.types
for(n=0; empty && n<names.length; n++){
switch(t[n]){
case'R':
case'MC':
empty=this[names[n]].IsEmpty()
break
case'O':
empty=this[names[n]]==null
break
default:
empty=Empty(this[names[n]])
}
}
return empty
}
}
function _rargs(a,o,s,BL){
var r=[],i,h,v,t
s = s==null?1:s
o.eval('if(!m_Caller){m_Caller=new Caller(window,"w_");m_Caller.__first=true}')
if(a.length>0 && a[0] instanceof Array){
 o.eval('typeof i_BlankParameters=="function" && i_BlankParameters()')
 a=a[0]
 h=new Caller(o)
 for(i=0;i<a.length;i++){
  v=a[i][1]
  t=typeof v
  if(t=='string'){
   h.SetString(a[i][0],"C",0,0,v)
  }else if(t=='number'){
   h.SetNumber(a[i][0],"N",0,0,v)
  }else if(t=='boolean'){
   h.SetLogic(a[i][0],"L",0,0,v)
  }else if(t!='object'){
  }else if(typeof ZtVWeb!='undefined' &&  ZtVWeb.MemoryCursorCtrl && v instanceof ZtVWeb.MemoryCursorCtrl){
   h.SetMemoryCursorCtrl(a[i][0],"O",0,0,v)
  }else if(typeof v.GetContext=='undefined' && v.constructor!=CPMemoryCursor && v.constructor!=CPMemoryCursorRow){
   h.SetDateTime(a[i][0],"T",0,0,v)
  }else if(v.constructor==CPMemoryCursor || v.constructor==CPMemoryCursorRow || !s){
   h.SetMemoryCursor(a[i][0],"O",0,0,v)
  }else if(s&&typeof v.FillWv=='function'){
   h.SetString(a[i][0],"C",0,0,v.GetContext(1))
  }else if(s){
   alert('Using a business object as a parameter is supported only while editing, not viewing data.')
  }
 }
}else if(BL){
 throw alert('Passing a business object to routine '+BL+' called from anything but links/buttons is blocked for stability reasons.\nStacktrace :'+LibJavascript.StackTrace())
}else for(i=0;i<a.length;i++){
 h=a[i]
 if(typeof h=='object' && h.cllr){
  o.eval('m_Caller=new Caller(arguments[1])',h.cllr)
 }else{
  try{
  h=_rargs.rebuildIfDate(h)
  }
  catch(nodate){
  }
  r.push(h)
 }
}
return r
}
_rargs.rebuildIfDate=function(h){
try{
return new Date(h.getFullYear(),h.getMonth(),h.getDate(),h.getHours(),h.getMinutes(),h.getSeconds(),h.getMilliseconds())
}catch(nodate){
return h
}
}
function Alert(m){return confirm(m)?1:0}

debug={
  log: function(ss,pos){
    if(window.console && window.console.log) {
      window.console.log(ss);
      return;
    }else if(window['opera'] && opera.postError){
      opera.postError(ss);
      return;
    }
    var s=document.createElement('div')
    s.innerHTML=(ss+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s.style.borderBottom='1px dashed red';
    var l=this._getlogwnd(pos);
    l.appendChild(s);
  },
  clear: function(){
    this._getlogwnd().innerHTML='';
  },
  _getlogwnd: function(pos){//[nesw]
    var d=document.getElementById('wndlog');
    if(!d){
      d=document.createElement('div')
      d.id='wndlog'
      var ds=d.style;
      ds.zIndex='1000';
      ds.position='absolute';
      ds.border='1px solid blue';
      var v= pos && pos.indexOf('n')>-1 ? 'top' : 'bottom';
      var h= pos && pos.indexOf('w')>-1 ? 'left' : 'right';
      ds[v]='0px';
      ds[h]='0px';
      document.body.appendChild(d);
    }
    return d;
  }
}
function SetLocationHref(l,url,fn) {
var s=url.match(/(\?|&)m_cID=/g)==null ? url.match(/([^\/]+)\?/) : null,m_cExtra=JSURL.Extra(url)
s=s?s[1]:s
if(s && typeof m_IDS!='undefined' && typeof m_IDS[s]!='undefined'){
url+=(At('?',url)>0?'&':'?')+'m_cID='+m_IDS[s]
}
if (m_cExtra)
 url+=(At('?',url)>0?'&':'?')+'m_c'+'Check='+URLenc(m_cExtra)
try {
if(l){
}else if(frames[fn]==null){
 if(GetOpener()){
  if(GetOpener().SetLocationHref)
   GetOpener().SetLocationHref(null,url,fn)
 } else if(window!=parent && parent.SetLocationHref)
  parent.SetLocationHref(null,url,fn)
 else
  l=parent.frames[fn].location
} else
 l=frames[fn].location
if(l)l.href=CompleteWithRegionalSettings(url)
}
catch(e){
}
}
function CompleteWithRegionalSettings(url,targetdoc) {
if (typeof(document.FSender)!='undefined' &&
    typeof(document.FSender.m_cRegionalSettings)!='undefined') {
if (targetdoc==null) {
if (url.indexOf('?')==-1) {
url+='?'
} else {
url+='&'
}
url+="m_cRegionalSettings="+URLenc(document.FSender.m_cRegionalSettings.value)
}else{
targetdoc.write("<input type=hidden name=m_cRegionalSettings value="+ToHTMLValue(document.FSender.m_cRegionalSettings.value)+"></input>")
}
}
return url
}
function adjustContainer(containerName){   // Funzione chiamata dai control che si allungano in esecuzione (Es Grid o treeView)
  var containerCtrl=document.getElementById(containerName)
  if (containerCtrl!=null){
    if(containerCtrl.tagName.toLowerCase()=='iframe' && containerCtrl.getAttribute("toResize")!='no'){
      var content=containerCtrl.contentWindow.document.body;
      var scroll_h=parseInt(content.scrollHeight);
      if(navigator.userAgent.match(/MSIE [4-7]\./))
        scroll_h=scroll_h+4;
      if(Math.abs(containerCtrl.offsetHeight - scroll_h) > 1) {
        containerCtrl.style.height =  scroll_h+'px';
        if( !IsDeviceMobile() ) {
          containerCtrl.parentNode.style.height=content.scrollHeight+'px';
        }
        if(window[containerCtrl.getAttribute('portlet_id')]) window[containerCtrl.getAttribute('portlet_id')].adjustHeight();
      }
    }
  }
}
function GetWindowSize() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return {w:myWidth,h:myHeight};
}
LibJavascript.GetWindowTopBorder=function() {
 if ( 'm_lIPadWithoutStatusBase' in window && m_lIPadWithoutStatusBase ) {
  return 20;
 } else {
  return 0;
 }
}
LibJavascript.GetWindowTopBorderColor=function() {
 if ( 'm_lIPadWithoutStatusBase' in window && m_lIPadWithoutStatusBase ) {
  return 'black';
 } else {
  return '';
 }
}
function IsMobile(){
  return IsMobile.value===true;
}
function SearchInArgs(args,cname){
  if(typeof(args)=='string'){
    var start_prop = args.indexOf(cname,0)
    if (start_prop>=0){
      var end_prop = args.indexOf(',',start_prop+cname.length);
      return args.substring(start_prop+cname.length,(end_prop==-1 ? args.length : end_prop));
    }
  }
  return null;
}
function layerOpenForeground(url, name, args, opt_width_pref, opt_height_pref, opt_resizable_pref,force,entryPoint,cinema_morph_ms) {
  /*
  force==1 --> sempre layer
  force==2 --> sempre popup
  force==altro --> default (Controlla variabile di Skin..)
  */
  if (!url || (Empty(layerOpenForeground.ln) && layerOpenForeground.linkOpened(name))) { // se il controllo non è già stato fatto
   return
  }
  var SPTheme = window.SPTheme || {};
  if (window.SPMobileLib) SPMobileLib.hideKeyboard();
  var isMobile = IsDeviceMobile() || (typeof ZtVWeb!='undefined' && ZtVWeb.IsMobile())
    , hide_close_btn = (SPTheme.navigablePopups || SPTheme.overlaingPopups) ? true : null
    , prepare_iframe = (SPTheme['activateModalPopup']||false)
    , modal = (prepare_iframe || SPTheme['activateModalZoom'])
    , border_width = ( (SPTheme.navigablePopups || SPTheme.overlaingPopups)
      ? (
          (( typeof(opt_width_pref) == 'number' && typeof(opt_height_pref) == 'number' )
            || ( SearchInArgs(args,'height') && SearchInArgs(args,'width') ))
          ? SPTheme.modalZoomBorderWidth
          : 0
        )
      :
        SPTheme.modalZoomBorderWidth
      )
    , topFrameworkWnd = LibJavascript.Browser.TopFrame( 'LibJavascript' )
    ,border_color=(SPTheme.modalZoomBorderColor?SPTheme.modalZoomBorderColor:'#FFFFFF')
    ;
  modal =(force==1 || (modal && !navigator.userAgent.match(/MSIE [4-7]\./) && (!topFrameworkWnd.modalLayerOpened || modal))) && force!=2;
  if ( modal ) {
    var modalLayer, width, height, p_d_b, currentpath
      , prnt = window
      , lib = (prnt.LibJavascript ? prnt.LibJavascript : null)
      , modalLayer = prnt.spModalLayer
      ;
    if (!SPTheme.navigablePopups) {
      do {
        var newprnt = prnt.parent;
        try {
          if (newprnt && (newprnt.LibJavascript || newprnt.spModalLayer) && !newprnt.portalStudioContainer) {
            lib = newprnt.LibJavascript;
            modalLayer = newprnt.spModalLayer;
            prnt = newprnt;
          } else {
            break;
          }
        } catch (e) {
          break;
        }
      } while( prnt!=prnt.parent && prnt!=topFrameworkWnd );

    }
    p_d_b=prnt.document.body;

    var objModal = {}
    objModal.modalLayerPopup = false;
    var pws = prnt.GetWindowSize();
    objModal.w = pws.w;
    objModal.h = pws.h;
    var margin = {
      left: SPTheme.modalZoomLeft ? SPTheme.modalZoomLeft : 0,
      right: SPTheme.modalZoomRight ? SPTheme.modalZoomRight : 0,
      top: SPTheme.modalZoomTop ? SPTheme.modalZoomTop : 0,
      bottom: SPTheme.modalZoomBottom ? SPTheme.modalZoomBottom : 0
    }

    if ('m_nWindowHeight' in prnt) {
      objModal.h=Math.max(prnt.m_nWindowHeight,objModal.h - LibJavascript.GetWindowTopBorder());
    }
    if ((typeof ZtVWeb!='undefined' && ZtVWeb.IsMobile()) && typeof( prnt.innerHeight ) == 'number' && prnt.innerHeight<prnt.outerHeight) {
      prnt.scrollTo(0,0);
    }
    width = SearchInArgs(args,'width=');
    height = SearchInArgs(args,'height=');
    if (SPTheme.navigablePopups || SPTheme.overlaingPopups ) {
      var forcedDimension = typeof(opt_width_pref)=='number' ||  Val(width)!=0 || typeof(opt_height_pref)=='number' || Val(height)!=0;
      opt_width_pref = (typeof(opt_width_pref)=='number'?
                          opt_width_pref :
                          ( Val(width)!=0 ?
                            Val(width) :
                            objModal.w - (margin.left + margin.right)
                          )
                        );
      opt_height_pref =(typeof(opt_height_pref)=='number'?
                          opt_height_pref :
                          ( Val(height)!=0 ?
                            Val(height):
                            objModal.h - (margin.top + margin.bottom)
                          )
                        );
      /* massimizzato da skin ma vengono forzate le dimensioni */
      if( opt_height_pref < pws.h && opt_width_pref < pws.w && forcedDimension ){
        margin = null;
        hide_close_btn = false;
      }
    } else {
      //calcolo larghezza layer
      opt_width_pref = (typeof(opt_width_pref)=='number'?
                           (opt_width_pref>objModal.w ?
                               resizeLayerWindow(objModal,'w') :
                                 opt_width_pref):
                           (Val(width)!=0 ?
                               (Val(width)>objModal.w ?
                                   resizeLayerWindow(objModal,'w') :
                                   Val(width)) :
                               (SPTheme.modalZoomWidth>objModal.w ?
                                   resizeLayerWindow(objModal,'w') :
                                   SPTheme.modalZoomWidth)
                           )
                       )
      //calcolo altezza layer
      opt_height_pref = (typeof(opt_height_pref)=='number'?
                           (opt_height_pref>objModal.h ?
                               resizeLayerWindow(objModal,'h') :
                                 opt_height_pref):
                           (Val(height)!=0 ?
                               (Val(height)>objModal.h ?
                                   resizeLayerWindow(objModal,'h') :
                                   Val(height)) :
                               (SPTheme.modalZoomHeight>objModal.h ?
                                   resizeLayerWindow(objModal,'h') :
                                   SPTheme.modalZoomHeight)
                           )
                       )
    }

    modal = modal ||(opt_width_pref<(p_d_b.clientWidth>0 ? p_d_b.clientWidth : p_d_b.offsetWidth) &&
                                 opt_height_pref<(p_d_b.clientHeight>0 ? p_d_b.clientHeight : p_d_b.offsetHeight));
    if ( modal ) {
      if (!modalLayer) {
        lib.RequireLibrary((typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+'spModalLayer.js',true);
        modalLayer = prnt.spModalLayer;
      }
      if (modalLayer && (!objModal.modalLayerPopup || force==1)) {
        var atOfQuestion = At('?',url),m_cExtra
        var s = Substr(url,1,(atOfQuestion>0?atOfQuestion-1:url.length));
        s = Substr(s,RAt('/',s)+1);
        if  ( (url.match(/(\?|&)m_cID=/g)==null)&&(typeof m_IDS!='undefined'&&typeof m_IDS[s]!='undefined') ) {
          url += (atOfQuestion>0 ? '&' : '?') +'m_cID='+m_IDS[s];
          atOfQuestion = At('?',url)
        }
        currentpath = window.location.pathname
        currentpath = currentpath.substring(0,currentpath.lastIndexOf('/')+1);
        if (Left(url,3)=='../' || url.match(/^[^\/]+\?/) ) {
          url = currentpath + url;
        }
        m_cExtra=JSURL.Extra(url)
        if (m_cExtra)
          url += (atOfQuestion>0 ? '&' : '?') +'m_c'+'Check='+URLenc(m_cExtra)
        currentSPModalLayer=new modalLayer(url,{
          'in_iframe':true,
          'ancestor':prnt,
          'bg_color':SPTheme.modalZoomBgColor,
          'bg_img':SPTheme.modalZoomBgImage,
          'bg_pos':SPTheme.modalZoomBgPos,
          'bg_rep':SPTheme.modalZoomBgRep,
          'border_color':SPTheme.modalZoomBorderColor,
          'border_width':border_width,
          'close_on_click_mask':SPTheme.modalMaskClickClose,
          'draggable':SPTheme.modalZoomDrag,
          'height':opt_height_pref,
          'hide_close_btn':hide_close_btn,
          'iframe_name':name,
          'iframe_padding':SPTheme.modalMaskIframePadding,
          'mask_color':SPTheme.modalMaskBgColor,
          'mask_opacity':(SPTheme.modalMaskOpacity/100),
          'multiple_instances':prnt.modalLayerOpened,
          'opener':window,
          'prepare_iframe':prepare_iframe,
          'resizable':(typeof(opt_resizable_pref)!='undefined'? opt_resizable_pref : SPTheme.modalZoomResize ),
          'show_scrollbars':SPTheme.modalMaskScrollbars,
          'width':opt_width_pref,
          'margin': margin,
          'entryPoint':entryPoint,
          'cinema_morph_ms':cinema_morph_ms
        }).open();
        if ( window.SPStatusManager ) {
          window.SPStatusManager.routeTracker.push(
            { name : name
            , opener : window.name
            , url : url
            }
          );
        }
        if ( prepare_iframe ) {
          return prnt;
        }else{
          return;
        }
      }
    }
  }
  delete layerOpenForeground.names[name]
  SPTheme['activateModalPopup']=false
  try {
  layerOpenForeground.lo=0
  var r=windowOpenForeground(url, name, args)
  if (prepare_iframe)
   return r
  }finally{
  SPTheme['activateModalPopup']=prepare_iframe
  }
}
layerOpenForeground.linkOpened=function(name){
 layerOpenForeground.names=layerOpenForeground.names||{}
 layerOpenForeground.lo=layerOpenForeground.lo||0
 layerOpenForeground.ln=layerOpenForeground.ln||''
 name=name||''
 var now=new Date().getTime()
 if (layerOpenForeground.ln.match(/^linkview_/) && (now - layerOpenForeground.lo) < 500)
  return true
 if(name.match(/^linkview_/) && (name in layerOpenForeground.names) && (now - layerOpenForeground.names[name]) < 500)
  return true
 layerOpenForeground.ln=name
 layerOpenForeground.lo=now
 layerOpenForeground.names[name]=layerOpenForeground.lo
 return false
}
function SPOpenModalLayer(url,in_iframe,ancestor,bg_color,bg_img,bg_pos,bg_rep,border_color,border_width,close_on_click_mask,
        draggable,height,hide_close_btn,iframe_name,iframe_padding,mask_color,mask_opacity,multiple_instances,opener,
        prepare_iframe,resizable,show_scrollbars,width,manualOverlaing,entryPoint,cinema_morph_ms){
  if (typeof(url)=='object'&& arguments.length==1) {
    in_iframe = url.in_iframe; ancestor = url.ancestor; bg_color=url.bg_color; bg_img=url.bg_img; bg_pos = url.bg_pos; bg_rep = url.bg_rep;
    border_color = url.border_color; border_width = url.border_width; close_on_click_mask = url.close_on_click_mask; draggable = url.draggable;
    height = url.height; hide_close_btn = url.hide_close_btn; iframe_name = url.iframe_name; iframe_padding = url.iframe_padding; mask_color = url.mask_color;
    mask_opacity = url.mask_opacity; multiple_instances = url.multiple_instances; opener = url.opener; prepare_iframe = url.prepare_iframe;
    resizable = url.resizable; show_scrollbars = url.show_scrollbars; width = url.width; manualOverlaing = url.manualOverlaing;
    url = url.url;
  }
  if(Empty(ancestor)) ancestor=window;
  var modalLayer = ancestor.spModalLayer;
  if(!modalLayer){
    ancestor.LibJavascript.RequireLibrary((typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+'spModalLayer.js',true);
    modalLayer = ancestor.spModalLayer;
  }
  return new modalLayer(url,{'in_iframe':in_iframe,
        'ancestor':ancestor,
        'bg_color':bg_color,
        'bg_img':bg_img,
        'bg_pos':bg_pos,
        'bg_rep':bg_rep,
        'border_color':border_color,
        'border_width':border_width,
        'close_on_click_mask':close_on_click_mask,
        'draggable':draggable,
        'height':height,
        'hide_close_btn':hide_close_btn,
        'iframe_name':iframe_name,
        'iframe_padding':iframe_padding,
        'mask_color':mask_color,
        'mask_opacity':mask_opacity,
        'multiple_instances':multiple_instances,
        'opener':opener,
        'prepare_iframe':prepare_iframe,
        'resizable':resizable,
        'show_scrollbars':show_scrollbars,
        'width':width,
        'manualOverlaing':manualOverlaing ? manualOverlaing : false,
        'entryPoint':entryPoint,
        'cinema_morph_ms':cinema_morph_ms
        }).open();
}

function GetDate(n){return GetDate.g(n,NullDate)}
GetDate.g=function(n,d){
var v
try{
if(Left(n,2)!='w_')n='w_'+n
v=window[n]
}catch(e){
v=d()
}
if(v==undefined)
v=d()
else
return v
}
function GetString(n){return GetDate.g(n,Str)}
function GetNumeric(n){return GetDate.g(n,Val)}
function GetLogic(n){return GetDate.g(n,function(){return false})}
function GetDateTime(n){return GetDate.g(n,NullDateTime)}
function GetChild(n){return window[n]||window['m_o'+n]}
function LastErroMessage(){return m_cLastMsgError}
function IsUpdated(){
try{
return m_bHeaderUpdated||m_bUpdated
}catch(e){
return m_bUpdated
}
}
function IsNew(){return !m_bLoaded}
function IsLoaded(){return !IsNew()}
function LastErrorMessage(){return m_cLastMsgError}
function GetElementsByClassName(cl) {
  return LibJavascript.CssClassNameUtils.getElementsByClassName( cl );
}

//Funzione che restituisce l'orientamento del device
function GetOrientation(){
  try {
    if ( window.top.ProvideOrientation /* simulator */ ) {
      return window.top.ProvideOrientation();
    }
  } catch (e) { }
  if ( GetOrientation.browser_ref == "UNKNOWN" ) {
    GetOrientation.init();
  }
  return (!('orientation' in window)) || (window.orientation % 180) == 0 ? GetOrientation.browser_ref : GetOrientation.flipped_state( GetOrientation.browser_ref );
}

GetOrientation.flipped_state = function(state){

  return state == GetOrientation.LANDSCAPE ? GetOrientation.PORTRAIT : GetOrientation.LANDSCAPE;
}
GetOrientation.init = function(){
  var start_ref;
  if (window.matchMedia) {
    start_ref = matchMedia("(orientation: landscape)").matches ? GetOrientation.LANDSCAPE : GetOrientation.PORTRAIT ;
  } else { //per i browser che non supportano la funzione matchMedia
    var orientation = document.getElementById("orientation");
    if (!orientation) {
      var orientation = document.createElement("div");
      orientation.innerHTML = 'orientation_div'
      orientation.id="orientation";
      document.body.appendChild(orientation);
    }
    var orientation_css = document.getElementById("orientation_css");
    if (!orientation_css) {
      var orientation_css = document.createElement("style");
      orientation_css.id="orientation_css";
      var css_txt = "#orientation { display: none; font-size: 10px; }";
      css_txt += "@media only screen and (orientation:landscape){#orientation {font-size: 11px;background-color:blue;}}";
      css_txt += "@media only screen and (orientation:portrait){#orientation {font-size: 14px;background-color:red;}}";
      var rules = document.createTextNode( css_txt );
      orientation_css.type = 'text/css';
      if ( orientation_css.styleSheet ) {
          orientation_css.styleSheet.cssText = rules.nodeValue;
      } else {
        orientation_css.appendChild(rules);
      }
      document.getElementsByTagName('head')[0].appendChild(orientation_css);
    }
    start_ref = getComputedStyle(orientation,null).getPropertyValue("font-size").indexOf("11px") > -1 ? GetOrientation.LANDSCAPE : GetOrientation.PORTRAIT;
  }
  var l_ProvideDeviceFactoryOrientation = null;
  try {
    l_ProvideDeviceFactoryOrientation = window.top.ProvideDeviceFactoryOrientation; /* simulator */
  } catch (e) {}
  GetOrientation.browser_ref = (function () {
    if (isNaN( window.orientation ) ) {
      if ( l_ProvideDeviceFactoryOrientation ) { /* simulator */
        return l_ProvideDeviceFactoryOrientation();
      } else {
        return start_ref;
      }
    } else {
      if ( (window.orientation % 180) == 0 ) {
        return start_ref;
      } else {
        return GetOrientation.flipped_state(start_ref);
      }
    }
  })();
}

GetOrientation.LANDSCAPE = "landscape";
GetOrientation.PORTRAIT = "portrait";
GetOrientation.browser_ref = "UNKNOWN";

function NoClickDelay(el,fn, preventClick) {
	this.element = el;
  this.fn = fn;
	if("ontouchstart" in window ) {
    this.element.addEventListener('touchstart', this, false);
    //this.element.addEventListener('click', function(e){e.preventDefault();}, false);
  } else {
    el.addEventListener('click', fn, false);
  }
}

NoClickDelay.prototype = {
	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
		}
	},

	onTouchStart: function(e) {
		//e.preventDefault();
		this.moved = false;

		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);
	},

	onTouchMove: function(e) {
		this.moved = true;
	},

	onTouchEnd: function(e) {
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);

		if( !this.moved ) {
      this.fn.call(this.element,e);
		}
	}
};
function CPResultSetOffline(resultset){
this.resultset=resultset
this.currow=0
this.FieldsLowerCase=null;
this.columnName=null;
this.Close=function(){}
this.SetRow=function(row){this.currow=row}
this.Next=function(){this.currow++}
this.Rows=function(){return this.resultset.rows.length||0}
this.Eof=function(){return !this.resultset || this.resultset.message || this.currow>=this.resultset.rows.length || this.resultset.rows.length==0}
this.ErrorMessage=function(){return this.resultset.message || "";}
this.Datum=function(cname){
if (this.FieldsLowerCase==null){
  this.FieldsLowerCase={};
  for (var fld in this.resultset.rows.item(0)) {//ciclo sulla prima riga del resultset
    this.FieldsLowerCase[Lower(fld)]=fld;
  }
}
if (this.FieldsLowerCase.hasOwnProperty(Lower(cname)))
 return this.resultset.rows.item(this.currow)[this.FieldsLowerCase[Lower(cname)]];
else if (this.resultset.rows.item(this.currow).hasOwnProperty(cname))
  return this.resultset.rows.item(this.currow)[cname];
else if (this.resultset.rows.item(this.currow).hasOwnProperty(Lower(cname)))
  return this.resultset.rows.item(this.currow)[Lower(cname)];
return null;
}
this.GetDate=function(cname){
var d=this.Datum(cname)
return d==null?NullDate():this.coerce(d,'D')
}
this.GetDateTime=function(cname){
var d=this.Datum(cname)
return d==null?NullDateTime():this.coerce(d,'T')
}
this.GetString=function(cname){
var d=this.Datum(cname)
return d==null?'':this.coerce(d,'C')
}
this.GetInt=this.GetDouble=function(cname){
var d=this.Datum(cname)
return d==null?0:this.coerce(d,'N')
}
this.GetBoolean=function(cname){
var d=this.Datum(cname)
return d==null?false:this.coerce(d,'L')
}
this.coerce=function(value,p_desired) {
var original
switch(typeof value) {
case 'string':
original='C';break
case 'number':
original='N';break
case 'boolean':
original='L';break
}
if (original==p_desired)
return value
else {
if(original=='C') {
switch(p_desired) {
case'N':return Val(value)
case'D':
if (!Empty(value)){
var date=value;
var year=date.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1);
var month=date.substring(0,date.indexOf('-'))-0
date=date.substring(date.indexOf('-')+1)+' ';
var day=date.substring(0,date.indexOf(' '))-0
return new Date(year,month-1,day,0,0,0,0)
} else
return NullDate();
case'T':
if (!Empty(value)){
var date = value;
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
case'L':return !Empty(value) && 'false'!==value;
}
} else if(original=='N') {
switch(p_desired){
case'C':return ''+value
case'L':return !Empty(value);
}
}
}
return value
}
this.RowsAffected=function(){return this.resultset.rowsAffected || -1;}
this.GetColumnCount=function(){
this.CreateColumnName();
return this.columnName.length;
}
this.GetColumnName=function(i){
this.CreateColumnName();
return this.columnName[i];
}
this.CreateColumnName=function(){
if (!this.columnName){
this.columnName=[]
var i=0;
if (this.resultset.rows && this.resultset.rows.length>0){
for (el in this.resultset.rows.item(0)) {
this.columnName[i]=el;i++;}
}
}
}
}

function TrsJavascriptOffline () {
  this.parameters = {};
}
TrsJavascriptOffline.prototype.setValue = function (id, value) {
  this.parameters[ id ] = value;
};
TrsJavascriptOffline.prototype.asString = function () {
  var key
    , res = []
    ;
  for ( key in this.parameters ) {
    res.push( [ key, encodeURIComponent( this.parameters[key] ) ].join('=') );
  }
  return res.join('&');
};
TrsJavascriptOffline.prototype.getValue = function (id) {
  var v = this.parameters[id];
  return Empty(v) ? '' : v;
};
TrsJavascriptOffline.prototype.reset = function () {
  this.parameters = {};
}
function iframeOpen(url,args,split,attributes){
 var outer,inner,iframe,toppx,widthpx,form,ct,src='../servlet/'+url
 function ce(s){
  return document.createElement(s)
 }
 if(At("//",split)){
  outer=split.split("//")
  inner=outer[1]
  outer=outer[0]
 }else if(At("\\\\",split)){
  outer=split.split("\\\\\\\\")
  inner=outer[0]
  outer=outer[1]
 }else{
  inner=split
 }
 if(!outer){
 }else if(window.iframeElement){
  window.iframeElement.name=outer
 }else{
  window.name=outer
 }
 if(args && args.length > 0 && typeof ZtVWeb!='undefined')
   form=ZtVWeb.getPortlet(args[0])
 if(form){
  iframe=ce('div')
  iframe.id='screen_flow_'+inner
  document.body.appendChild(iframe)
  iframe.top=form.height+'px'
  iframe.width=form.width+'px'
  ;(function(){
   this[inner]=new ZtVWeb.IframeCtrl(this,iframe.id,'screen_flow_'+inner,toppx,0,widthpx,0,inner,'true',src,'','left')
  }).call(form)
 }else{
try{iframe=ce('<iframe name="'+inner+'">')}
   catch(nonIE){
    iframe=ce('iframe')
    iframe.name=inner
   }
  if(window.m_nPreferredHeight)
   toppx=m_nPreferredHeight+1
  iframe.frameBorder='no'
  iframe.style.cssText='position:absolute;top:'+toppx+'px;left:0px;width:'+widthpx+'px'
  iframe.setAttribute('toResize','no')
  iframe.src=src
  document.body.appendChild(iframe)
 }
}
function windowOpenForeground(url, name, args, varnames, varvalues, doc,force_popup,force_tab,tab_name,layer_to_tab) {
  if(((typeof SPTheme != 'undefined' && SPTheme.forceOpenTab)) || force_tab){
    if(typeof(getPagelet)!='undefined'){
      var res_tab=window.appendTab(getPagelet().id,null,tab_name,url,tab_name,true,name,layer_to_tab); 
      if(res_tab)
        return;
      if(name=='tab')//compatibilità con sistema senza tab
        name='main';
        
    }
  }
  var layerOpenForeground = window['layerOpenForeground']
  var in_iframe = ((window.SPTheme && SPTheme['activateModalPopup']||false) && document.getElementsByName(name).length < 1 && !force_popup && name != "_self")
  function notEmptyName() {
   return (Empty(name)||name=='_blank')?(''+new Date().getTime()):name
  }
  if(url==null || (layerOpenForeground && layerOpenForeground.linkOpened(name))) {
   return null
  } else if (layerOpenForeground && in_iframe) {
   name=notEmptyName()
   var r=layerOpenForeground(url,name,args)
   if (r.document.getElementsByName(name).length > 0)
    return r.document.getElementsByName(name)[0].contentWindow
   else
    return r
  }
  var atOfQuestion = At('?',url);
  var s = Substr(url,1,(atOfQuestion>0?atOfQuestion-1:url.length));
  s = Substr(s,RAt('/',s)+1);
  var popupWin,eq,f,i,fname,d=document;
  function ce(t) {
    return d.createElement(t);
  }
  function barc(c,a) {
    d.body[(a?'append':'remove')+'Child'](c);
  }
  function popup(u) {
    var h,pname,m,m_cExtra=JSURL.Extra(u)
    if (m_cExtra)
     u+=(atOfQuestion>0?'&':'?')+'m_c'+'Check='+URLenc(m_cExtra)
    if (u && u.match(/(\?|&)outputFormat=CSV/gi)==null) {
      h=ce("a");
    }
    if (h && (h.addBehavior || h.msGetInputContext)) {
     pname=notEmptyName()
      popupWin=window.open('',pname,args);
    } else {
      popupWin=window.open(u,name,args);
    }
    if (pname&&popupWin) {
      h.href=u;
      h.target=pname;
      popupWin.setInterval("document.body.innerHTML=document.body.innerHTML+'.'",500);
      barc(h,1);
      h.click();
      barc(h);
      popupWin.name=name;
    }
    if (popupWin) {
      popupWin.focus()
    } else try {
      m='MSG_POPUP_BLOCKED';
      m=Translate(m);
    }
    catch(e) {
    }
    if (m=='MSG_POPUP_BLOCKED') {
      alert('Popup are blocked. For the correct functioning of the application enable popups for this domain.');
    } else if (m) {
      alert(m);
    }
  }
  if (doc==null&&varnames==null&&url.length<=1500/*Microsoft Knowledge Base Article - 208427*/&&(url.match(/(\?|&)m_cID=/g)==null)&&(typeof m_IDS=='undefined'||typeof m_IDS[s]=='undefined')) {
    popup(url);
    return popupWin;
  } else {
    if (varnames==null) {
      var p=url.indexOf('?'),m_cExtra=JSURL.Extra(url)
      if (p!=-1) {
        varnames=url.substr(p+1).split('&');
        varvalues=[];
        var e=Lower(document.charset|| document.characterSet)
        var decodeParameterValue = (e=='utf-8'?decodeURIComponent:function(s) { return unescape(Strtran(s,'%80','%u20AC'));} )
        for (var n=0; n<varnames.length; n++) {
          eq=varnames[n].indexOf('=');
          varvalues[n]=decodeParameterValue(varnames[n].substr(eq+1));
          varnames[n]=Left(varnames[n],eq);
        }
        url=Left(url,p);
      } else {
        varnames=[];
        varvalues=[];
      }
    }
    if (LibJavascript.Array.indexOf(varnames,'m_cID')==-1&&typeof m_IDS!='undefined'&&typeof m_IDS[s]!='undefined') {
      varvalues[varvalues.length]=m_IDS[s];
      varnames[varnames.length]='m_cID';
    }
    if (m_cExtra) {
      varvalues[varvalues.length]=m_cExtra
      varnames[varnames.length]='m_c'+'Check'
    }
    if (doc==null) {
      fname=name;
      name || ( name = ''+new Date().getTime() );
      popup('');
      if ( !popupWin ) {
        return;
      }
    } else {
      d=doc;
    }
    f=ce("form");
    f.method='post';
    f.action=url;
    if (doc==null) {
      f.target=name;
    }
    for (var n=0; n<varnames.length; n++) {
      i=ce("textarea");
      i.name=varnames[n];
      i.value=varvalues[n];
      f.appendChild(i);
    }
    barc(f,1);
    if (popupWin) {
      f.onsubmit=function(){
        if (name!=fname) {
          popupWin.name=fname;
        }
      }
    }
    f.submit();
    barc(f);
    if (popupWin)
      return popupWin;
  }
}

function ReportLinkReceiver(event) {
  if ( event.origin == window.location.origin ) {
    var par = JSON.parse(event.data);
    if ( par.type == 'ReportLinkValue' ) {
      var l_bResult = false;
      if(typeof ReportLinkValue!='undefined' && ReportLinkValue(par.uid,par.value)){
        l_bResult = true;
      }else if(typeof ZtVWeb!='undefined' && ZtVWeb.ReportLinkValue(par.uid,par.value,par.formid)){
        l_bResult = true;
      }
      event.source.postMessage(JSON.stringify( {type:'closePopup',managed:l_bResult}) ,window.location.origin);
    }
  }
}
function IsDeviceMobile() {
  var ua = self.navigator.userAgent;
  return ua.indexOf('Mobile') != -1 || ua.indexOf('iPad') != -1 || ua.indexOf('Android') != -1 ;
}
function AddMobileLinkListener(){
  LibJavascript.Events.addEvent(window, 'message', ReportLinkReceiver);
  window.AddMobileLinkListener = function(){};
}
function GetOpener() {
  if(window.opener) return window.opener;
  try {
  if(window.parent.spModalLayer && window.frameElement && window.parent.spModalLayer[window.frameElement.id])return window.parent.spModalLayer[window.frameElement.id].getOpenerRef();
  } catch (e) { }
  return null;
}
function WindowClose() {
  if(window.parent.spModalLayer && window.frameElement && window.parent.spModalLayer[window.frameElement.id])
    window.parent.spModalLayer[window.frameElement.id].close();
  else
    window.close();
}
function resizeLayerWindow(objModal,d){
  if(SPTheme['exceptionModalLayerOnPopup'])
    objModal.modalLayerPopup = true;
  return objModal[d]-100
}
LibJavascript.Browser = {
  TopFrame : function (symbolToFind,top,topCondition) {
    symbolToFind || ( symbolToFind = 'window');
    var wnd = window, topToFind = window
    try{
     while( wnd.frameElement && wnd.parent && (top || (symbolToFind in wnd.parent)) && (wnd!=wnd.parent)) {
      if(symbolToFind in wnd.parent && (!topCondition || topCondition()))
       topToFind = wnd.parent
      wnd = wnd.parent;
     }
    }catch( e ){}
    if(top)
      return topToFind
    else
      return symbolToFind in wnd ? wnd : null;
  },
  ParseURL : function (url){
    function queryString2map(str){
      if (str===null) {
        return null;
      }

      return str.split('&').reduce(function(params,nameValue){
        if (nameValue) {
          var splitted = nameValue.split('='),
              name = splitted[0],
              value = splitted.hasOwnProperty(1) ? decodeURIComponent(splitted[1]) : null ;
          params[name]=value;
        }
        return params;
      }, {} );
    }

    var urlSplit, queryString=null, hashString=null,
        result = {
          path : null,
          parameters : {
            client: null,
            server: null
          }
        };
    if (url===null) {
      return result;
    }
    if (url.match(/\?/)) {
      urlSplit = url.split('?');
      result.path = urlSplit[0];
      var queryStringAndHash = urlSplit[1]||'';
      if (queryStringAndHash.match(/#/)) {
        var queryStringAndHashSplit = queryStringAndHash.split('#');
        queryString = queryStringAndHashSplit[0];
        hashString = queryStringAndHashSplit[1]||'';
      } else {
        queryString = queryStringAndHash;
      }
    } else if(url.match(/#/)){
      urlSplit = url.split('#');
      result.path = urlSplit[0];
      hashString = urlSplit[1]||'';
    } else {
      result.path = url; // keeps null;
    }

    result.parameters.client = queryString2map(hashString);
    result.parameters.server = queryString2map(queryString);

    return result;
  },
  MakeURL : function (urlProps) {
    function map2queryString(params) {
      if (params===null){
        return null;
      }
      return Object.keys(params).map(function (paramName) {
        var paramValue = params[paramName];
        if (paramValue===null){
          return paramName;
        }
        return paramName + '=' + encodeURIComponent(paramValue);
      }).join('&');
    }

    var result = urlProps.path;
    if (result) {
      var queryStringServer = map2queryString( urlProps.parameters.server ),
          queryStringClient = map2queryString( urlProps.parameters.client );
      if (queryStringServer!==null){
        result += '?' + queryStringServer;
      }
      if (queryStringClient!==null){
        result += '#' + queryStringClient;
      }
    }
    return result;
  }
}
LibJavascript.GetScrollbarSize = function() {
  var div = document.createElement('div');
  div.style.overflow = 'scroll';
  div.style.width = '0px';
  div.style.height = '0px';
  div.style.padding = '0px';
  div.style.border = 'none';
  div.style.margin = '0px';
  div.style.opacity = '0';
  div.style.position = 'absolute';
  document.body.appendChild(div);
  var size = { y: -div.scrollHeight, x: -div.scrollWidth};
  document.body.removeChild(div);
  return size;
}

LibJavascript.HTML5Tests = { InputTypes : {} };
( function (InputTypes) {
  function test (type) {
    var testStr
      , input = document.createElement( "input" )
      ;
    input.setAttribute( 'type', type );
    if ( input.type !== 'text' ){
      testStr = "not a valid " + type;
      input.value = testStr;
      input.style.cssText = 'position: absolute; visibility: hidden;';
      return input.value != testStr;
    } else {
      return false;
    }
  }
  InputTypes.date = test( 'date' );
  InputTypes.datetimeLocal = test( 'datetime-local' );
} )( LibJavascript.HTML5Tests.InputTypes );

function TestReady(){
 if(typeof document.readyState!='undefined' && document.readyState!='complete'){
  event.cancelBubble=true;
  event.returnValue=false;
  if(typeof m_bAlreadySubmitted=='undefined' || !m_bAlreadySubmitted){
   var msg='Prego attendere il completo caricamento della pagina';
   if(typeof m_cLanguage!='undefined'){
    switch(m_cLanguage){
     case 'ENG':
      msg='Please wait page loading completion';
      break;
     default:
    }
   }
   alert(msg);
  }else{
   alert(Translate('MSG_SERVER_DATA'));
  }
 }
}

SetNumberSettings()

//From Controls

function InstTR(){
 document.onmousedown=TestReady;
 document.onkeydown=TestReady;
}
var c_cIE='IE',c_cNetscape="Netscape",c_cOpera="Opera",c_cMozilla="Mozilla",c_cIE_MAC='IE_MAC',c_cSafari="Safari"/*Chrome*/

function getBrowserType(){
 if(navigator.userAgent.toLowerCase().indexOf('netscape')!=-1) return c_cNetscape;
 if(navigator.userAgent.toLowerCase().indexOf('opera')!=-1) return c_cOpera;
 if(navigator.userAgent.toLowerCase().indexOf('safari')!=-1) return c_cSafari;
 if(navigator.userAgent.toLowerCase().indexOf('gecko/')!=-1) return c_cMozilla;
 return c_cIE;
}
/* Restituisce la versione di Internet Explorer utilizzata. */
function getInternetExplorerVersion() {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
  }
  return rv;
}
function IsIE(){
 if(typeof(m_cBrowser)=='undefined'){m_cBrowser=getBrowserType()}
 return m_cBrowser==c_cIE;
}
function IsNetscape(){
 if(typeof(m_cBrowser)=='undefined'){m_cBrowser=getBrowserType()}
 return Eq(m_cBrowser,c_cNetscape);
}
function IsOpera(){
 if(typeof(m_cBrowser)=='undefined'){m_cBrowser=getBrowserType()}
 return Eq(m_cBrowser,c_cOpera);
}
function IsMozilla(){
 if(typeof(m_cBrowser)=='undefined'){m_cBrowser=getBrowserType()}
 return Eq(m_cBrowser,c_cMozilla);
}
function IsIE_Mac(){
 return Eq(m_cBrowser,c_cIE_MAC);
}
function IsSafari(){
 if(typeof(m_cBrowser)=='undefined'){m_cBrowser=getBrowserType()}
 return Eq(m_cBrowser,c_cSafari);
}
function GetKeyCode(e){
 if(IsNetscape() || IsMozilla())
  return e.which;
 else
  return e.keyCode;
}
function eventPos(ev) {
  if(ev.pageX || ev.pageY) {
		return { x: ev.pageX, y: ev.pageY };
	}
	return {
		x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y: ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}
function dragToolbar(e,obj) {
 e=e?e:window.event
 obj=document.getElementById(obj)
 if(obj) dragObj.css=obj.style
 if(!e || !dragObj.css) return
 //bring to top of stack
 dragObj.css.zIndex=++dragObj.zIndex
 //Save mousedown location
 var pos = eventPos(e);
 dragObj.downX=pos.x;
 dragObj.downY=pos.y;
 if(document.addEventListener){
  document.addEventListener("mousemove",dragStart,true)
  document.addEventListener("mouseup",dragEnd,true)
  e.preventDefault()
 } else if(document.attachEvent) {
  document.attachEvent("onmousemove",dragStart)
  document.attachEvent("onmouseup",dragEnd)
  return false
 }
}
function dragStart(e) {
  e = e ? e : window.event;
  var pos = eventPos(e),
      deltaX = pos.x - dragObj.downX,
      deltaY = pos.y - dragObj.downY,
      left = parseInt(dragObj.css.left),
      top = parseInt(dragObj.css.top);

  if ( !dragObj.resize ) {
    dragObj.css.left = (left+deltaX)+"px";
    dragObj.css.top = (top+deltaY)+"px";
  } else if ( dragObj.resize=='nw' ) {
    var width = parseInt(dragObj.css.width),
        height = parseInt(dragObj.css.height);
    if ( width-deltaX > dragObj.minW ) {
      dragObj.css.width = (width-deltaX)+"px";
      dragObj.css.left = (left+deltaX)+"px";
    }
    if ( height-deltaY > dragObj.minH ) {
      dragObj.css.height = (height-deltaY)+"px";
      dragObj.css.top = (top+deltaY)+"px";
    }
  }

  dragObj.downX = pos.x;
  dragObj.downY = pos.y;

  if(e.preventDefault)e.preventDefault()
  else return false
}
function dragEnd(e) {
 dragObj.resize='';
 dragObj.css = null;
 dragObj.deltaX = 0;
 dragObj.deltaY = 0;
 // Stop capturing mousemove and mouseup events.
 if(document.removeEventListener){
  document.removeEventListener("mousemove",dragStart,true)
  document.removeEventListener("mouseup",dragEnd,true)
 }else if(document.detachEvent){
  document.detachEvent("onmousemove",dragStart)
  document.detachEvent("onmouseup",dragEnd)
 }
}
function GetModDecPict(pict){
var s=Strtran(pict,',','')
var intPart,decPart
var decSepPos=At('.',s)
if (decSepPos==0) return [s.length,0]
if (decSepPos==s.length) return [decSepPos-1,0]
return [decSepPos-1,s.length-decSepPos]
}
function CheckNum(e){ //BUG in mozilla o netscape: evidezia e digita. Non cancella. Inserisce
 var keyCode,res,v,field;
 e=e?e:window.event;
 keyCode=GetKeyCode(e);
 field=GetEventSrcElement(e);
 if (field.readOnly || field.disabled) return true;
 if (e.ctrlKey) return true;
 if (field.type=="number")
  return true;
 if(IsNetscape() || IsMozilla() || IsOpera()){
  if(Eq(keyCode,0) || Eq(keyCode,8) || Eq(keyCode,13)){
   return true;
  }
 }
 v=field.value;
 res=IsNumber(keyCode);
 if(keyCode==44 || keyCode==46){
  res=(At(decSep,v)==0);
  if(res){
   if(IsIE() || IsIE_Mac()){
    e.keyCode=decSep.charCodeAt(0);
   }else{
    e.preventDefault();
    field.value=field.value+decSep;
   }
  }
 }
 return(res)
}
function CheckNumWithPict(e,mod_dec,dec){
 if(typeof(dec)=='undefined'){
  var mod=mod_dec[0];
  dec=mod_dec[1];
 }else{
  var mod=mod_dec;
 }
 var keyCode,res,v,field;
 if(typeof(e)!='undefined' && typeof(e.rootEvent)!='undefined'){
  keyCode=e.keyCode;
  e=e.rootEvent;
 }else{
  if(typeof(e)=='undefined' && (IsIE() || IsIE_Mac())){
   e=window.event;
  }
 }
 if(typeof(keyCode)=='undefined'){
  keyCode=GetKeyCode(e);
 }
 field=GetEventSrcElement(e);
 if (field.readOnly || field.disabled) return true;
 if (e.ctrlKey) return true;
 if (field.type=="number")
  return true;
 if(IsNetscape() || IsMozilla()){
  if(Eq(keyCode,0)){
   return true;
  }
 }
 v=field.value;
 var selStart=getSelectionStart(field);
 var selEnd=getSelectionEnd(field);
 var numb=Strtran(v,milSep,'');
 var numbLen=numb.length;
 var commaPos=At(decSep,numb);
 var minusPos=At('-',numb);
 if(keyCode==13) return true;
 if(IsDigit(keyCode)){
  if(selEnd==selStart){
   if(commaPos==0){
    if((numbLen-minusPos)<mod){
     return true;
    }else if(dec>0){
     if(selStart==numbLen){
      addText(field,decSep);
     }else{
      setSelection(field,mod-1,mod-1);
      addText(field,decSep);
      setSelection(field,selStart,selStart);
     }
     return true;
    }else{
     return false;
    }
   }else if(selStart<commaPos){
    if((commaPos-minusPos-1)<mod){
     return true;
    }else if((numbLen-minusPos-commaPos)<dec){
     if(selStart==commaPos-1){
      setSelection(field,commaPos,commaPos);
     }else{
      field.value=Strtran(field.value,decSep,'');
      setSelection(field,commaPos-2,commaPos-2);
      addText(field,decSep);
      setSelection(field,selStart,selStart);
     }
     return true;
    }else{
     return false;
    }
   }else{
    return (numbLen-commaPos)<dec;
   }
  }else if(selStart==0 && selEnd==numbLen){
   return true;
  }else if(commaPos==0){
   return true;
  }else if(selStart<commaPos && selEnd>=commaPos){
   return (numbLen-minusPos-selEnd+selStart)<mod;
  }else if(selStart<commaPos){
   return true;
  }else{
   return (numbLen-commaPos)<=dec;
  }
 }else if(dec>0 && (keyCode==44 || keyCode==46)){
  var res,zero='';
  if(selEnd==selStart){
   if(commaPos==0 && selStart==minusPos){
    zero='0';
    res=true;
   } else {
    res=commaPos==0;
   }
  }else if(selStart==0 && selEnd==numbLen){
   zero='0';
   field.value='';
   selEnd=0;
   res=true;
  }else{
   res=commaPos==0 || (selStart<commaPos && selEnd>=commaPos);
   if(selStart==0){
    zero='0';
   }
  }
  if(res){
   addText(field,zero+decSep);
   field.value=field.value.substr(0,selStart)+field.value.substr(selEnd);
   setSelection(field,selStart+(zero+decSep).length,selStart+(zero+decSep).length);
   if(e.preventDefault) e.preventDefault();
   else e.keyCode=null;
  }
  return res;
 }else if(keyCode==45){
  if(selEnd==selStart){
   if(selStart-minusPos>0 && typeof(mod_dec[2])=='undefined'){
    ShowPopUpCalculator(field,keyCode,mod,dec,window);
   }else{
    ChangeMarkField(field,selStart,selEnd);
   }
   return false;
  }else if(selStart==0 && selEnd==numbLen){
   return true;
  }else{
   return minusPos==0 && selStart==0;
  }
 }else if(keyCode==-1 || keyCode==8){
  var block=false;
  var delFrom=0,delTo=0;
  var toInsert='';
  var caretPos=0;
  if(commaPos!=0){
   if(selStart==0){
    if(selEnd==numbLen){
     block=false;
    }else if(selEnd>=commaPos){
     if(numbLen-minusPos-selEnd+selStart<=mod){
      block=false;
     }else{
      block=true;
      delFrom=selStart;
      delTo=selEnd;
      toInsert='0'+decSep;
      caretPos=0;
     }
    }else if(selEnd==(commaPos-1)){
     block=true;
     delFrom=selStart;
     delTo=selEnd;
     toInsert='0';
     caretPos=0;
    }else if(selEnd==selStart){
     block=false;
    }else{
     block=true;
     delFrom=selStart;
     delTo=selEnd;
    }
   }else if(selEnd==numbLen){
    block=false;
   }else if(minusPos==1 && selStart==minusPos && selEnd==commaPos-1){
    block=true;
    delFrom=selStart;
    delTo=selEnd;
    toInsert='0';
    caretPos=1;
   }else if(selStart<commaPos-1){
    if(selEnd<=commaPos-1){
     block=false;
    }else{
     if(numbLen-minusPos-selEnd+selStart>mod){
      block=true;
      delFrom=selStart;
      delTo=selEnd;
      caretPos=selStart;
      toInsert=decSep;
     }
    }
   }else if(selStart==commaPos-1){
    var wantToDelComma=true;
    if(selStart==selEnd)
     keyCode==-1 ? selEnd+=1 : wantToDelComma=false;
    if(wantToDelComma && numbLen-minusPos-selEnd+selStart>mod){
     block=true;
     delFrom=selStart;
     delTo=selEnd;
     caretPos=selStart;
     toInsert=decSep;
    }
   }else if(selStart==commaPos && keyCode==8 && selStart==selEnd){
    selStart-=1;
    if(numbLen-minusPos-selEnd+selStart>mod){
     block=true;
     caretPos=selEnd;
    }
   }else{
    block=false;
   }
  }
  if(block){
   field.value=field.value.substr(0,delFrom)+field.value.substr(delTo);
   setSelection(field,selStart,selStart);
   addText(field,toInsert);
   setSelection(field,caretPos,caretPos);
   if(IsIE() || IsIE_Mac()){
    e.keyCode=null;
   }else{
    if(keyCode==-1){
     addText(field,' ');
     setSelection(field,caretPos,caretPos);
    }
    e.preventDefault();
    return false;
   }
  }
 }else if(keyCode==42 || keyCode==43 || keyCode==47){
  ShowPopUpCalculator(field,keyCode,mod,dec,window);
  return false;
 }else{
  return false;
 }
}
function addText(input,insText){
 input.focus();
 if("setSelectionRange" in input){ //std
  var len=input.selectionEnd;
  input.value=input.value.substr(0,len)+insText+input.value.substr(len);
  input.setSelectionRange(len+insText.length, len+insText.length);
 }else if(input.createTextRange){ //IE legacy
  document.selection.createRange().text+=insText;
 }
}
function getSelectionStart(input){
 if("selectionStart" in input){ //std
  return input.selectionStart;
 }
 //IE legacy
 var pos,selectedRange=document.selection.createRange().duplicate();
  selectedRange.moveEnd("character",input.value.length);
 pos=input.value.lastIndexOf(selectedRange.text);
 if(selectedRange.text==""){
   pos=input.value.length;
 }
  return pos;
}
function getSelectionEnd(input){
 if("selectionEnd" in input){ //std
  return input.selectionEnd;
 }
 //IE legacy
 var pos,selectedRange=document.selection.createRange().duplicate();
  selectedRange.moveStart("character",-input.value.length);
 pos=selectedRange.text.length;
  return pos;
}
function setSelection(input,selectionStart,selectionEnd){
 if ( "setSelectionRange" in input ) { // std
  input.setSelectionRange(selectionStart,selectionEnd);
 } else if( input.createTextRange ) { //IE legacy
  var range=input.createTextRange();
  range.collapse(true);
  range.moveEnd('character',selectionStart);
  range.moveStart('character',selectionEnd);
  range.select();
 }
}
function GetStyleVariable(varname, defaultvalue, clonename) {
  var result = defaultvalue;
  if (typeof(SPTheme)!='undefined') {
    if (clonename) {
        if (SPTheme[clonename] && SPTheme[clonename][varname])
          result = SPTheme[clonename][varname];
    } else {
      if (SPTheme[varname])
        result = SPTheme[varname];
    }
  }
  return result;
}
function SPCallback(onSuccess,notAlreadyRemoved) {
  var length=0;
  if (notAlreadyRemoved) length=1;
  if (SPCallback.stack.length>length) { //dentro un try
    return function(res) {
      try {
        onSuccess(res);
      } catch (e) {
        SPCallback(SPCallback.stack[0],true)(e);
      }
    }
  } else {
    return onSuccess;
  }
}
SPCallback.stack=[];
SPCallback.PushStack=function(errorCallback) {
  SPCallback.stack.splice(0, 0, errorCallback);
}
SPCallback.PopStack=function(errorCallback,checkExist) {
  if (checkExist) {
    if (SPCallback.stack.length>0 && SPCallback.stack[0]==errorCallback) {
      SPCallback.stack.splice(0, 1);
    }
  } else {
    if (SPCallback.stack[0]!=errorCallback) {
      console.log("SPCallback.PopStack: errorCallback is not the same function of the last PushStack");
    }
    SPCallback.stack.splice(0, 1);
  }
}

function isServerOnline (p_nTimeout, p_fCallback) {
  var ex = new Error( "This function is asynchronous. Please revise your application." )
    , defaultTimeout = 1 * 1000; // 1 sec
    ;

  if ( !arguments.length ) { // nessun parametro
    throw ex;
  } else if ( arguments.length == 1 ) { // 1 solo parametro
    if ( p_nTimeout.call ) { // callback passata come primo parametro
      p_fCallback = p_nTimeout;
      p_nTimeout = defaultTimeout;
    } else {
      throw ex;
    }
  } else {
    if ( p_nTimeout == null ) {
      p_nTimeout = defaultTimeout;
    } else {
      if ( p_nTimeout.abs ) { // num
        if ( p_nTimeout <= 0 ) {
          p_nTimeout = defaultTimeout;
        }
      } else {
        throw ex;
      }
    }
  }

  isServerOnline.callbacks.push( p_fCallback );
  if ( isServerOnline.currentStatus === isServerOnline.status.IDLE ) {
    isServerOnline.currentStatus = isServerOnline.status.BUSY;
    requestServerAck( p_nTimeout, onServerUp, onServerDown );
  }
  function dispatchCallbacks (isLogged) {
    while( isServerOnline.callbacks.length ) {
      isServerOnline.callbacks.splice( 0, 1 )[0]( isLogged===true );
    }
    isServerOnline.currentStatus = isServerOnline.status.IDLE;
  }
  function onServerUp (xhr) {
    var SPOfflineLib = window.SPOfflineLib;
    if ( SPOfflineLib ) {
      SPOfflineLib.checkServerAndLogin( dispatchCallbacks );
    } else {
      dispatchCallbacks( true );
    }

  }
  function onServerDown (xhr) {
    dispatchCallbacks( false );
  }
  return ex;
}
isServerOnline.status = { BUSY : 'BUSY'
                        , IDLE : 'IDLE'
                        };
isServerOnline.currentStatus = isServerOnline.status.IDLE;
isServerOnline.callbacks = [];

function requestServerAck (p_nTimeout, p_fOnServerUp, p_fOnServerDown) {
  /* test di raggiungibilita' del server */
  var timeoutID
    , xhr = new XMLHttpRequest
    , useTimeout = p_nTimeout > 0
    , canHandleTimeout = 'timeout' in xhr
    , finished = false
    , SPOfflineLib = window.SPOfflineLib
    ;

  if ( SPOfflineLib && !SPOfflineLib.isOnline() ) {
    p_fOnServerDown( null );
    return;
  }

  xhr.open( "GET", "../servlet/gsso_ftestaccess?"+(+new Date), true );
  if ( useTimeout ) {
    if ( canHandleTimeout ) { // IE, Geko
      xhr.timeout = p_nTimeout;
      xhr.ontimeout = ontimeout;
    } else { // fallbacks to setTimeout w/ abort
      xhr.onabort = onabort;
      timeoutID = setTimeout( doabort, p_nTimeout );
    }
  }

  xhr.onreadystatechange = onreadystatechange;
  xhr.onerror = onerror;
  xhr.send( +new Date );

  /* Event handlers */
  function onreadystatechange (e) {
    if ( finished ) {
      return;
    }
    if ( xhr.readyState === 2 ) { // headers received... so there's a kind of response!
      finished = true;
      if ( useTimeout && !canHandleTimeout ) {
        clearTimeout( timeoutID );
      }
      // console.log(["called onreadystatechange", e]);
      p_fOnServerUp( xhr );
    }
  }

  function doabort () {
    // console.log(["called doabort"]);
    if ( finished ) {
      return;
    }
    xhr.abort();
  }

  function onabort (e) {
    // console.log(["called onabort", e]);
    if ( finished ) {
      return;
    }
    ontimeout( e );
  }

  function ontimeout (e) {
    // console.log(["called ontimeout", e]);
    if ( finished ) {
      return;
    }
    finished = true;
    if ( useTimeout && !canHandleTimeout ) {
      clearTimeout( timeoutID );
    }
    p_fOnServerDown( xhr );
  }

  function onerror (e) {
    // console.log(["called onerror", e]);
    if ( finished ) {
      return;
    }
    ontimeout( e );
  }

}

if(typeof(localStorage)==="undefined"){
  localStorage = function(){
    if (window.console)
    console.log('localStorage not supported');
    var localStorage = {};
    localStorage.setItem = function(){};
    localStorage.getItem = function(){return null};
    return localStorage;
  }
};


( function (html, cssLib) {
  cssLib.addClass( html, 'hoverable' );
})( this.document.getElementsByTagName('html')[0], LibJavascript.CssClassNameUtils );

/* Inclusione della libreria calculator.mobile.js nella top window */
LibJavascript.Events.addEvent( window, 'load',  function () {
  var s,
   lib = "calculator.mobile.js";
  if (!(s = document.scripts)){
    s = document.getElementsByTagName('script');
  }
  for (i = 0; i < s.length; i++) {
    if ( s[i].src.match( lib )) {
      LibJavascript.Browser.TopFrame( 'LibJavascript').LibJavascript.RequireLibrary(s[i].src);
      return;
    }
  }
})
// apply a fading effect to an object
// by applying changes to its style
// @o = object style
// @b = begin opacity
// @e = end opacity
// @d = duration (millisec)
// @f = function (optional)
var FadingId=null;
function setFading(o,b,e,d,f){
 //setOpacity(o,0);
  FadingId=setInterval(
    function(){
      b=stepFX(b,e,2);
      setOpacity(o,b/100);
      if(b==e){
        if(FadingId){clearInterval(FadingId);FadingId=null;}
        if(typeof f=='function'){f();}
        o.style.display='none';
      }
    },d/50
  );
}
// set opacity for element
// @e element
// @o opacity
function setOpacity(e,o){
  // for IE
  e.style.filter='alpha(opacity='+o*100+')';
  // for others
  e.style.opacity=o;
}
// increment/decrement value in steps
// checking for begin and end limits
//@b begin
//@e end
//@s step
function stepFX(b,e,s){
  return b>e?b-s>e?b-s:e:b<e?b+s<e?b+s:e:b;
}
function checkImgsLoaded(container,callback){
  var notLoaded
      , imgs = container.querySelectorAll( "img:not([src=''])" /* tutte le immagini con src non vuoto*/ )
      ;
    notLoaded = Array.prototype.filter.call( imgs, function (img) {
      /* immagine non ancora caricata */
      return img.naturalHeight == 0 && img.naturalWidth == 0;
    } );
    function checkImg (ev) {
      checkImg.loaded++;
      if ( checkImg.loaded==notLoaded.length ) {
        callback();
      }
    }
    checkImg.loaded = 0;
    notLoaded.forEach( function (img) {
      img.addEventListener('load', checkImg);
      img.addEventListener('error', checkImg);
    });
    if(notLoaded.length==0)
      callback();
}
var PSAlert=new function(){
  this.t=null;
  return {
    alert:
      function(m,t){ // tempo in secondi
        var w=this.main;
        var d=this.main.document;
        var b;
        if(Ctrl("PSAlert")){
          b = Ctrl("PSAlert");
          b.style.display='block';
          setOpacity(b,0.8);
        }else{
          b=d.createElement('div');
          b.id='PSAlert';
          // insert in to body
          b=d.body.insertBefore(b,d.body.firstChild);
          b.className='notimoo';
          b.style.cssText='position:absolute;';
          b.style.textAlign='center';
          b.style.width='20%';
          b.style.marginLeft='40%';
          b.style.marginRight='40%';
          b.style.top='50%';
          b.style.zIndex='1001';
          setOpacity(b,0.8);
          // classname not passed, set defaults
          if(b.className.length==0){
            b.style.padding='8px 8px';
            b.style.border='1px solid #888888';
            b.style.backgroundColor='#FFFFFF';
            b.style.fontFamily='lucida grande,Verdana,taohma';
            b.style.fontWeight='bold';
            b.style.color='#888888';
            b.style.fontSize='12px';
            b.style.lineHeight='24px';
            b.style.display='block';
          }
        }
        // write HTML fragment to it
        b.innerHTML="<div style='background:URL(../portalstudio/images/warning.png) no-repeat;height:24px;width:24px;margin-left:auto;margin-right:auto'></div> ";
        b.innerHTML+="<div>"+m+"</div>";
        // fadeout block if supported
        this.b=b;
        if(this.t)clearTimeout(this.t);
        if(FadingId)clearInterval(FadingId);
        if (typeof(t)!='number') t = 2000;
        else t = t * 1000;
        this.t=setTimeout("setFading(PSAlert.b,80,0,700,'function(){PSAlert.main.document.body.removeChild(PSAlert.b);}')",t);
      }  ,
    init:
      function(w,s){
        // save window
        this.main=w;
        this.classname=s||'';
      }
    // shutdown Alert object
    /*
    shut:
      function(){
        // if redifine set
        if(this._alert!=null){
          // restore old alert function
          this.main.alert=this._alert;
          // unset placeholder
          this._alert=null;
        }
      }
    */
  };
};

// Polyfill for Element.prototype.firstElementChild etc ie8
!function(undef){
	if( document.createElement('div').firstElementChild===undef ){
		Object.defineProperty(Element.prototype, 'firstElementChild', {
			get : function () { // faster then this.children[0]
				var el = this.firstChild;
				do {
					if(el.nodeType===1){
						return el;
					}
					el = el.nextSibling;
		        } while(el);
		        return null;
			}
		});
		Object.defineProperty(Element.prototype, 'lastElementChild', {
			get : function () {
				var el = this.lastChild;
				do {
					if(el.nodeType===1){
						return el;
					}
					el = el.previousSibling;
		        } while(el);
		        return null;
			}
		});
		Object.defineProperty(Element.prototype, 'nextElementSibling', {
			get : function () {
				var el = this.nextSibling;
				while(el) {
					if(el.nodeType===1){
						return el;
					}
					el = el.nextSibling;
		        };
		        return null;
			}
		});
		Object.defineProperty(Element.prototype, 'previousElementSibling', {
			get : function () {
				var el = this.previousSibling;
				while(el){
					if(el.nodeType===1){
						return el;
					}
					el = el.previousSibling;
		        };
		        return null;
			}
		});
	}
}();
// For IE9/10 polyfill
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();