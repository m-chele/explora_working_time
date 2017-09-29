//---Start function: Alert_err
function librarygtl_Alert_err(res) {
  if(!res)
    alert(m_cErrorFromRoutine)
  return res;
}
//---End function

//---Start function: ChangeCheck
function librarygtl_ChangeCheck(nm_campo) {
    var campo=nm_campo.split(",");
    var n=campo.length;
    if(n==0) return false;
    var res=false;
    for(var i=0;i<n;i++){
        var t_campo=LRTrim(campo[i])
        if(!Empty(t_campo)){
            try{
                if(eval('Ne(o_'+t_campo+',w_'+t_campo+')')) {
                    return true;
                }
            }
            catch(e){
                return false;
            }
        }
        else{
            return false;
        }
    }
    return res;
}
//---End function

//---Start function: Check_cfg
function librarygtl_Check_cfg(ent_n, box_name, test) {
  var nm_campi=box_name.split(",");
  var n=nm_campi.length;
  var n = (1<=n && n<=9) ? n : 0;
  if(n==0) return "";
  nm_campi.splice(0,0,'');
  var nm_livello=LRTrim(nm_campi[ent_n]);
  if(!test){
    librarygtl_Alert_err(test);
  }
    return librarygtl_Focus_cfg(nm_livello, test)    
}
//---End function

//---Start function: DaysDescription
function librarygtl_DaysDescription(num) {
  if(num==1){
    return 'Dom'
  }else if (num==2){
    return 'Lun'
  }else if (num==3){
    return 'Mar'
  }else if (num==4){
    return 'Mer'
  }else if (num==5){
    return 'Gio'
  }else if (num==6){
    return 'Ven'
  }else if (num==7){
    return 'Sab'
  }else{
    return ''
  }
}
//---End function

//---Start function: Delete_cfg
function librarygtl_Delete_cfg(h_ghost, box_name) {
  try{
  var nm_campi=box_name.split(",");
  var n=nm_campi.length;
  var n = (1<=n && n<=9) ? n : 0;
  if(n==0) return -1;
  nm_campi.splice(0,0,'');
  var id_livello_h=GetLayerID(h_ghost);
  var liv_contenitore=Ctrl(id_livello_h);
  for(var i=1;i<=9;i++){
    var nm_livello=LRTrim(nm_campi[i]);
    var id_livello=GetLayerID(nm_livello);
    var liv_campo_div=Ctrl(id_livello+'_DIV');
    var liv_campo=Ctrl(id_livello);
    if(liv_contenitore && liv_campo){
      liv_contenitore.appendChild(liv_campo_div)
      liv_campo.style.display='none'
      liv_campo.setAttribute('status', 'close')
    }
  }
  return 0;
  }
  catch(err){return -1;}
}
//---End function

//---Start function: FieldNext
function librarygtl_FieldNext(editvar, nextvar) {
  try{
    var x = Ctrl(editvar);
    var y = Ctrl(nextvar)
    y.focus();
    y.select();
    return 0;
  }
  catch(e){
    return -1;
  }
}
//---End function

//---Start function: Focus_cfg
function librarygtl_Focus_cfg(field, error) {
  var campo=document.getElementsByName(field)[0];
  SetControlFocus(campo.id)
  var res = eval("w_"+field);
  if(!error){
    res = "";
    SetErrorField(campo,!error)
  }
    return res;
}
//---End function

//---Start function: Get_lastgg
function librarygtl_Get_lastgg(anno, mese) {
  var result = 0;
  if(mese == 1 || mese == 3 || mese == 5 || mese == 7 || mese == 8 || mese == 10 || mese == 12){
      result = 31;
  }
  if(mese == 4 || mese == 6 || mese == 9 || mese == 11){
      result = 30;
  }
  if(mese == 2){
      if(Mod(anno,4) == 0 && (Mod(anno,100) != 0 || Mod(anno,400) == 0)){
          result = 29;
      }
      else{
          result = 28;
      }
  }
  return result;
}
//---End function

//---Start function: HourChar
function librarygtl_HourChar(hours, tpexit) {
  var res  = ''
  var LenObj = Len(LRTrim(hours))
  if (tpexit == 'C') var fl = ',';else var fl = ':';
  if (LenObj <= 4) {
    var res = Right('0000' + LRTrim(hours));
    return Left(res,2) + fl + Right(res,2)
  }else{
    return Left(LRTrim(res),LenObj-2) + fl + Right(res,2)
  }
}
//---End function

//---Start function: HourCheck
function librarygtl_HourCheck(pORA, pTIPO) {
  var cora;
  var contatore, conta, check, contasegno, separatore, procedi;
  contasegno=0;
  contatore=Len(LRTrim(pORA))
  conta=1
  while(conta<=contatore){
    check=At(Substr(pORA, conta, 1), '0123456789')
    if(check==0){
      contasegno++;
      separatore=conta;
    }
    conta++
  }
  if(contasegno==1){
    cora=LRTrim(Right('00' + LRTrim(Substr(pORA,1,separatore-1)),2)) + LRTrim(Left(LRTrim(Substr(pORA,separatore+1,(contatore-separatore))) + '00',2))
  }else if(contasegno==0){
    if(Len(LRTrim(pORA))<=2){
      cora=Right('00' + LRTrim(pORA),2) + '00'
    }else{
      if(Len(LRTrim(pORA))==3)
        cora=Left(LRTrim(pORA),2) + Right(LRTrim(pORA),1) + '0'
      else
        cora=Left(LRTrim(pORA),2) + Right(LRTrim(pORA),2)
    }
  }else{
    procedi=false
    //ora non valida
    return procedi;
  }
  if(pTIPO=='E'){
    if(Val(LRTrim(Left(cora,2))) == 24)
      var test=(Val(LRTrim(Right(cora,2))) == 0);
    else
      var test=(Val(LRTrim(Right(cora,2))) >= 0 && Val(LRTrim(Right(cora,2))) <= 59)
    if(Val(LRTrim(Left(cora,2))) >= 0 && Val(LRTrim(Left(cora,2))) <= 24 && test){
      procedi=true;
    }else{
      procedi=false;
      //ora non valida
      return procedi;
    }
  }else{
    if(Val(LRTrim(Left(cora,2))) == 24)
      var test=(Val(LRTrim(Right(cora,2))) == 0)
    else
      var test=(Val(LRTrim(Right(cora,2))) >= 0 && Val(LRTrim(Right(cora,2))) <= 99)
    if(Val(LRTrim(Left(cora,2))) >= 0 && Val(LRTrim(Left(cora,2))) <= 24 && test){
      procedi=true;
    }else{
      procedi=false
      //ora non valida
      return procedi;
    }
  }
  return procedi;
}
//---End function

//---Start function: HourFormat
function librarygtl_HourFormat(hours, tpexit) {
	var LenObj = Len(LRTrim(hours))
	var CntSgn = 0
	var Sgn = 0
  if (LenObj>0){
    if (tpexit == 'C') var fl = ',';else var fl = ':';
    for (var ii=1;ii<=LenObj;ii++){
      if (At(Substr(hours,ii,1),'0123456789') == 0){
        Sgn = ii
        CntSgn = CntSgn + 1
      }
    }
    if (CntSgn > 1){
      alert('Valore non ammesso')
      return '';
    }else if (CntSgn == 1){
      return LRTrim(Right('00' + LRTrim(Substr(hours,1,Sgn-1)),2)) + fl + LRTrim(Left(LRTrim(Substr(hours,Sgn+1,(LenObj-Sgn))) + '00',2))
    }else{
      if (LenObj<=2){
        return Right('00' + LRTrim(hours),2) + fl + '00';
      }else if(LenObj==3){
        return Left(LRTrim(hours),2) + fl + Right(LRTrim(hours),1)+'0'
      }else{
        return Left(LRTrim(hours),2) + fl + Right(LRTrim(hours),2)
      }
    }
  }else{
    return ''
  }  
}
//---End function

//---Start function: HourFormatQT
function librarygtl_HourFormatQT(hours, tpexit) {
	var LenObj = Len(LRTrim(hours))
	var CntSgn = 0
	var Sgn = 0
  if (LenObj>0){
    if (tpexit == 'C') var fl = ',';else var fl = ':';
    for (var ii=1;ii<=LenObj;ii++){
      if (At(Substr(hours,ii,1),'0123456789') == 0){
        Sgn = ii
        CntSgn = CntSgn + 1
      }
    }
    if (CntSgn > 1){
      alert('Valore non ammesso')
      return '';
    }else if (CntSgn == 1){
      if(LRTrim(Substr(hours,1,Sgn-1))=='') var lft = '0';else var lft = LRTrim(Substr(hours,1,Sgn-1));
      return LRTrim(LRTrim(lft) + fl + LRTrim(Left(LRTrim(Substr(hours,Sgn+1,(LenObj-Sgn))) + '00',2)))
    }else{
      if (LenObj<=2){
        return LRTrim(Substr(hours,1,LenObj)) + fl + '00';
      }else if(LenObj==3){
        return Left(LRTrim(hours),2) + fl + Right(LRTrim(hours),1)+'0';
      }else{
        return Left(LRTrim(hours),2) + fl + Right(LRTrim(hours),2);
      }
    }
  }else{
    return ''
  }  
}
//---End function

//---Start function: HourQta
function librarygtl_HourQta(hours, tpexit, dec) {
    try{
        tpexit = (tpexit=="C") ? "," : ":"
        var conta = 0
        var lung = Len(hours)
        for(var i=lung;i>1;i--){
            var tmp_str = Substr(hours, i, 1)
            if(isNaN(tmp_str)){
                hours = Strtran(hours, tmp_str, tpexit)
                conta++
            }
        }
        var tmp_str = Substr(hours, 1, 1)
        if(conta>1 || (isNaN(tmp_str) && LRTrim(tmp_str)!='-' && LRTrim(tmp_str)!='+'))
            hours = '0'
        //***
        hours = Strtran(hours, tpexit, ".")
        hours = LRTrim(Str(Round(Val(hours),dec), Len(hours)+Len(tpexit)+dec, dec))
        hours = Strtran(hours, ".", tpexit)
    }
    catch(e){
        hours = ""
    }
    return hours
}
//---End function

//---Start function: HourToMin
function librarygtl_HourToMin(hours, tpexist) {
  //var nHour = Val(LRTrim(Left(hours,2) + Right(hours,2)))
  if (At(':',hours) > 0 || At(',',hours) > 0 )
    var nHour = Val(LRTrim(Left(LRTrim(hours),Len(hours)-3) + Right(LRTrim(hours),2)));
  else
    var nHour = Val(LRTrim(Left(LRTrim(hours),Len(hours)-2) + Right(LRTrim(hours),2)));
  var HH = parseInt(nHour / 100);
  var MM = (nHour - (HH*100))
  if (tpexist == 'C') MM= Round((MM*60)/100,0);
  return ((HH * 60) + MM)
}
//---End function

//---Start function: Init_cfg
function librarygtl_Init_cfg(box_name) {
  var nm_campi=box_name.split(",");
  var n=nm_campi.length;
  var n = (1<=n && n<=9) ? n : 0;
  if(n==0) return -1;
  nm_campi.splice(0,0,'');
  w_entlist=parent.w_entlist;
  for(var i=1;i<=n;i++){    
    try {
      eval('w_ent_'+i+'=parent.w_ent_'+i)
      eval('w_desc_ent_'+i+'=parent.w_desc_ent_'+i)
      //eval('w_ANFIXEDFILTER_'+i+'=parent.w_ANFIXEDFILTER_'+i)
    }catch(err){ }
  }  
  var res = 0;
  return res;
}
//---End function

//---Start function: MakeIdx
function librarygtl_MakeIdx(table, nomeIdx, nomeFld, unique, m_Ctx) {
  var res = 0;
  return res;
}
//---End function

//---Start function: Make_cfg
function librarygtl_Make_cfg(box_ghost, box_name, gtabindex, field_name) {
  try{
    var nm_campi = box_name.split(",");
    var n = nm_campi.length; 
    nm_campi.splice(0,0,'');
    var n = (1<=n && n<=9) ? n : 0;
    if(n==0) return -1;
    var h_container=0;
    var ent_n=0;
    //indipendente (controlla ghost)
    var id_livello_g = GetLayerID(box_ghost);
    var liv_contenitore = Ctrl(id_livello_g);
    //dipendente
    //********************************************************
    var vettabs=new Array()
    vettabs[0] = 0
    //var j=0;
    //********************************************************
    //dichiara
    var nm_field ='';
    var nf = 0;
    //valorizza
    if(Empty(field_name)){
        nm_field = nm_campi;
        nf = n;
    }
    else{
        nm_field = field_name.split(",");
        nf = nm_field.length;
        nm_field.splice(0,0,'');
    }
    //********************************************************
    for(var i=1;i<=n;i++){
      ent_n=eval('parseInt(w_ent_'+i+')');
      if(ent_n>0){
        var nm_livello = LRTrim(nm_campi[ent_n]);
        var id_livello=GetLayerID(nm_livello);
        var liv_campo_div=Ctrl(id_livello+'_DIV');
        var liv_campo=Ctrl(id_livello);
        if(liv_contenitore && liv_campo){
          var l_position=liv_campo.style.position;
          var l_height=liv_campo.style.height;
          var l_overflow=liv_campo.style.overflow;
          h_container+=parseInt(l_height)
          //append
          liv_contenitore.appendChild(liv_campo_div)
          //style
          liv_campo.removeAttribute('style')
          liv_campo.style.position = l_position
          liv_campo.style.height = l_height
          liv_campo.style.overflow = l_overflow
          //***
          liv_campo.setAttribute('status', 'open')
        }
      }
    }
    liv_contenitore.setAttribute('band_height', (h_container+5))
    liv_contenitore.style.height=(h_container+5)+'px';
    for(var i=1, j=0;i<=nf;i++){
        var nm_input = LRTrim(nm_field[i]);
        var campo=Ctrl(nm_input);
        if(campo){
            if(gtabindex==0){
                campo.tabIndex=0;
                campo.setAttribute('curTabIndex', ''+0)
            }
            else{
                vettabs[j] = parseInt(campo.getAttribute('tabindex'));
                j++;
            }
        }
    }
    //***gestione tabIndex
    if(gtabindex==1){
        vettabs.sort(function(a,b){return a - b})
        var j=0;
        for(var i=1;i<=n;i++){
            ent_n=eval('parseInt(w_ent_'+i+')');
            for(var m = ent_n, k=0;k<(nf/9);k++){
                    if(ent_n>0){
                    var nm_input=LRTrim(nm_field[m]);
                    var campo=Ctrl(nm_input);
                    campo.tabIndex=vettabs[j]
                    campo.setAttribute('curTabIndex', ''+vettabs[j])
                    }
                    j++;
                    m += 9;
            }
        }
    }
    //***
    return 0;
  }
  catch(err){
    return -1;
  }
}
//---End function

//---Start function: MinToHour
function librarygtl_MinToHour(minutes, tpexit) {
  if (tpexit == 'C') var fl = ',';else var fl = ':';
  var HH = parseInt(minutes / 60)
  var MM = (minutes%60)
  if (tpexit == 'C') MM= Round((MM*100)/60,0);
  var hours = (HH*100) + MM
  hours = LRTrim(Str(hours))
  if (Len(hours)<4){
    hours = Right ('000' + hours,3)
    return Left(hours,1) + fl + Right(hours,2);
  }else{
    return Left(hours,Len(hours)-2) + fl + Right(hours,2);
  }
}
//---End function

//---Start function: MinToHour2
function librarygtl_MinToHour2(minutes, tpexit) {
    var fl = "";
    var c_hours = "";
    var res = "";
    var c_opm = "";
    var HH, MM, hours, opm, abs_min;
    if (Eqr(tpexit,"C")) {
        fl = ",";
    } 
    else {
        fl = ":";
    }
    opm = Round(1,0);
    c_opm = ""
    if (Lt(minutes,0)) {
        opm = Round(-1,0);
        c_opm = "-"
    }
    abs_min = (minutes*opm)
    HH = Round(Int(abs_min/60),0);
    MM = Round(Mod(abs_min,60),0);
    if (Eqr(tpexit,"C")) {
        MM = Round(Round((MM*100)/60,0),0);
    }
    hours = Round(((HH*100)+MM),0);
    c_hours = LRTrim(Str(hours));
    if (Lt(Len(c_hours),4)) {
        c_hours = Right("000"+c_hours,3);
        res = Left(c_hours,1)+fl+Right(c_hours,2);
    } 
    else {  
        res = Left(c_hours,Len(c_hours)-2)+fl+Right(c_hours,2);
    }
    return c_opm+res;
}
//---End function

//---Start function: QueryColumnTotals
function librarygtl_QueryColumnTotals(cFieldName) {
  WorkToTrs();
  var res = 0;
  for (var ii=0;ii<m_nRows;ii++){
     //res = res + parseInt(eval('m_oTrsFW['+ii+'][\''+cFieldName+'\']'))
     try{ res = res + parseInt(eval('m_oTrsFW['+ii+'][\''+cFieldName+'\']')) }catch (Error){}
  }
  return res;
}
//---End function

//---Start function: QueryHourFormat
function librarygtl_QueryHourFormat(obj, name, tpexit) {
	var result = obj.value
	var LenObj = Len(LRTrim(result))
	var CntSgn = 0
	var Sgn = 0
  if (LenObj>0){
    if (tpexit == 'C') var fl = ',';else var fl = ':';
    for (var ii=1;ii<=LenObj;ii++){
      if (At(Substr(result,ii,1),'0123456789') == 0){
        Sgn = ii
        CntSgn = CntSgn + 1
      }
    }
    if (CntSgn > 1){
      eval('Set_'+LRTrim(name)+'(\'\')')
      alert('Valore non ammesso')
    }else if (CntSgn == 1){
      result = LRTrim(Right('00' + LRTrim(Substr(result,1,Sgn-1)),2)) + fl + LRTrim(Left(LRTrim(Substr(result,Sgn+1,(LenObj-Sgn))) + '00',2))
      eval('Set_'+LRTrim(name)+'(\''+result+'\')')
    }else{
      if (LenObj<=2){
        result = Right('00' + LRTrim(result),2) + fl + '00';
      }else if(LenObj==3){
        result = Left(LRTrim(result),2) + fl + Right(LRTrim(result),1)+'0'
      }else{
        result = Left(LRTrim(result),2) + fl + Right(LRTrim(result),2)
      }
      eval('Set_'+LRTrim(name)+'(\''+result+'\')')
    }
  }else{
    eval('Set_'+LRTrim(name)+'(\'\')')
  }  
}
//---End function

//---Start function: ZoomMove
function librarygtl_ZoomMove(nmvar, nmzoom) {
  try{
    var arr=Ctrl(Ctrl(nmvar).id)
    var zoom=Ctrl(Ctrl(nmzoom).id+'_ZOOM')
    zoom.style.top=arr.offsetTop+'px'
    zoom.style.left=arr.offsetLeft+arr.offsetWidth+(1)+'px'
    return 0;
  }catch(e){
    return -1;
  }
}
//---End function

//---Start function: addEvent
function librarygtl_addEvent(element, event, pcallback) {
	 if (arguments && arguments.length>3) {
		 var vals='';
		 var pars='';
		 for (var ii=3; ii<arguments.length; ii++) {
			 pars += ',p'+ii;
			 vals += ',arguments[' + ii + ']';
		 }
		 pars = pars.substr(1);
		 vals = vals.substr(1);
     callback = eval('(function(' + pars + '){ return function(){ pcallback(' + pars + '); } })(' + vals + ')')
	 } else {
		 callback = pcallback;
	 }
   if (element.addEventListener) {
     element.addEventListener(event, callback, false);
   } else if (element.attachEvent) {
     element.attachEvent('on' + event, callback);
   } else {
     element[event] = callback;
   }
}
//---End function

//---Start function: getFilter
function librarygtl_getFilter(fields) {
  try{
    var nm_campi = fields.split(',');
    var n = nm_campi.length; 
    nm_campi.splice(0,0,'');
    for(var ii=1;ii<=n;ii++){
      var cField = LRTrim(nm_campi[ii])
      LibraryGTL.addEvent(Ctrl(Ctrl(LRTrim(cField)).id+'_ZOOM'), 'click',function(event){RunFilterFunc()});
      LibraryGTL.addEvent(Ctrl(Ctrl(LRTrim(cField)).id), 'focus', function(event){RunFilterFunc()});
      LibraryGTL.addEvent(Ctrl(Ctrl(LRTrim(cField)).id), 'blur', function(event){RunFilterFunc()});
    }
    return 0;
  }
  catch(err){
    return -1;
  }
}
//---End function

//---Start function: MakeLibraryGTL
function MakeLibraryGTL() {
  this.Alert_err=librarygtl_Alert_err
  this.ChangeCheck=librarygtl_ChangeCheck
  this.Check_cfg=librarygtl_Check_cfg
  this.DaysDescription=librarygtl_DaysDescription
  this.Delete_cfg=librarygtl_Delete_cfg
  this.FieldNext=librarygtl_FieldNext
  this.Focus_cfg=librarygtl_Focus_cfg
  this.Get_lastgg=librarygtl_Get_lastgg
  this.HourChar=librarygtl_HourChar
  this.HourCheck=librarygtl_HourCheck
  this.HourFormat=librarygtl_HourFormat
  this.HourFormatQT=librarygtl_HourFormatQT
  this.HourQta=librarygtl_HourQta
  this.HourToMin=librarygtl_HourToMin
  this.Init_cfg=librarygtl_Init_cfg
  this.MakeIdx=librarygtl_MakeIdx
  this.Make_cfg=librarygtl_Make_cfg
  this.MinToHour=librarygtl_MinToHour
  this.MinToHour2=librarygtl_MinToHour2
  this.QueryColumnTotals=librarygtl_QueryColumnTotals
  this.QueryHourFormat=librarygtl_QueryHourFormat
  this.ZoomMove=librarygtl_ZoomMove
  this.addEvent=librarygtl_addEvent
  this.getFilter=librarygtl_getFilter
}
//---End function

var LibraryGTL = new MakeLibraryGTL()
