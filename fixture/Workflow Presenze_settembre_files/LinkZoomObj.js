if ( !("LinkZoomCtrl" in ZtVWeb) ) {
ZtVWeb.LinkZoomCtrl=function(form,ctrlid,name,x,y,w,h,table,servlet,linkedField,readfields,readFieldsType,intovars,looselylinked,n_criteria,keyfixedfilters,fixedvars,Link_Id_Hash,fillemptykeys,zoomtitle,configname,sendkeystozoomonzoom,searchingfunction,defaultsfunction,defaultsfunction_zoom,queryparams,anchor,spztl, offline, linkedusingvars){
  this.form=form;
  this.name=name;
  this.Ctrl=document.getElementById(ctrlid);
  this.setCtrlPos(this.Ctrl,x,y,w,h,anchor||'',form.width,form.height,false,true);
  this.setCtrlStdMethods(this);
  this.addToForm(this.form,this);
  this.offline=offline;
  this.linkedFieldCtrl=this.form[linkedField];
  if ( this.linkedFieldCtrl ){
    this.linkedFieldCtrl.addObserver('linkedFieldCtrl', this);
  }
  if(!window.m_IDS) window.m_IDS={};
  this.Ctrl.onclick=function(){
    if (LinkZoom.Ctrl.disabled!="true")
      LinkZoom.OpenZoom();
  }
  function GetZoomBaseLink(offline) {
    if (portletObj[LinkZoom.name+'_GetZoomLink']) {
      var lz = portletObj[LinkZoom.name+'_GetZoomLink'](offline);
      if (!EmptyString(lz)) {
        return lz;
      }
    }
    if (offline) {
      return ZtVWeb.SPWebRootURL+'/spofflineapp/SPPortalZoomLink_' + SPOfflineLib.getEntryPointName() + '.jsp#'
    } else {
      return ZtVWeb.SPWebRootURL+'/jsp/SPPortalZoomLink.jsp?'
    }
  }
  this.OpenZoom=function(){
    if( IsDeviceMobile() )
      AddMobileLinkListener();
    layerOpenForeground(GetZoomBaseLink(LinkZoom.offline) + LinkZoom.LOpt_ZOOM(), 'linkview_'+LibJavascript.AlfaKeyGen(3), 'toolbar=0,menubar=0,directories=0,resizable=1,scrollbars=yes');
    this.dispatchEvent('ZoomOpened');
    return;
  }
  var LinkZoom = this,
      portletObj = this.form,
      readfield_array = readfields.split(','),
      intovars_array = intovars.split(','),
      readFieldsType_array = readFieldsType.split(','),
      keyfixedfilters_array = keyfixedfilters.split(","),
      fixedvars_array = fixedvars.split(","),
      queryparams_array = queryparams.split(","),
      old_value,
      prefix='';
      
  this.addLinkedUsingVars=function() {
    if ( !Empty(linkedusingvars) ) {
      var linkedusingvars_array = linkedusingvars.split(",");
      LibJavascript.Array.forEach(linkedusingvars_array, function(ctrlName,i){
        portletObj[ctrlName].addObserver('linkedUsing'+i, this);
        this['linkedUsing'+i+'_onChange']=function(){
          if ( this._execReadvar_onChange )
            this.DoLink(ctrlName);
        }
      }, this);
    }
  }
  this.addObserverFixedVars=function(){
    if ( !Empty(fixedvars) ) {
      LibJavascript.Array.forEach(fixedvars_array, function(ctrlName){
        portletObj[ctrlName].addObserver('keyvar', LinkZoom);
      });
      this.keyvar_onChange=function(){
        if ( this._execKeyvar_onChange && !Empty(this.linkedFieldCtrl.Value()) )
          this.DoLink();
      }
    }
  };
  this.linkedFieldCtrl_onChange=function(){
    if ( this._execReadvar_onChange )
      this.DoLink();
  }
  this.linkedUsingCtrl_onChange=function(){
    if ( this._execReadvar_onChange )
      this.DoLink();
  }
  this._execKeyvar_onChange=true;
  this._execReadvar_onChange=true;
  function fncSetKey(type){
    switch ( type ) {
      case 'N': return 'SetDoubleKey';
      case 'D': return 'SetDateKey';
      case 'T': return 'SetDateTimeKey';
      case 'L': return 'SetBooleanKey';
      default:  return 'SetStringKey';
    }
  }
  function fncGetValue(type){
    switch ( type ) {
      case 'N': return 'GetDoubleValue';
      case 'D': return 'GetDateValue';
      case 'T': return 'GetDateTimeValue';
      case 'L': return 'GetBooleanValue';
      default:  return 'GetStringValue';
    }
  }
  function getQueryParms(){
    var res = '';
    if ( queryparams_array.length ) {
      for(var i=0,nome1,nome2,ctrlName;i<queryparams_array.length;i++){
        ctrlName=queryparams_array[i];
        if(ctrlName.indexOf('=')>-1){
          nome1=Trim(LTrim(ctrlName.substring(0,ctrlName.indexOf('='))));
          nome2=Trim(LTrim(ctrlName.substring(ctrlName.indexOf('=')+1)));
        }else{
          nome2=nome1=Trim(LTrim(ctrlName));
        }
        if ( portletObj[prefix+nome2] && portletObj[prefix+nome2].Value )
          res += nome1+'='+URLenc(ZtVWeb.valueToStr(portletObj[prefix+nome2].Value(),portletObj[prefix+nome2].type))+',';
      }
    }
    return res;
  }
  this.setQueryParamPrefix=function(_prefix){
    prefix=_prefix;
  };
  var GetField=function(fld) {
    return (Right(fld,1)=='*'?Left(fld,Len(fld)-1):fld);
  }
  this._putFieldValue=function(l_Appl, ctrlName) {
    if (ctrlName) {
      var index=0;
      for(var i=1; index==0 && i<readfield_array.length; i++){
        if (intovars_array[i] === ctrlName) {
          index=i;
        }
      }      
      l_Appl[fncSetKey(readFieldsType_array[index])](readfield_array[0],this.form[intovars_array[index]].Value(),0,0);//Campo linkato
    } else {
      l_Appl[fncSetKey(readFieldsType_array[0])](readfield_array[0],this.linkedFieldCtrl.Value(),0,0);//Campo linkato
    }
  }
  this.DoLink=function(ctrlName){
    var Link_Id = portletObj[linkedField].Ctrl_input.id;
    window.m_IDS[Link_Id] = [Link_Id_Hash];
    var l_bResult = true,
        l_nRec = 0,
        l_Appl = (offline ? new LinkJavascriptOffline(ZtVWeb.SPWebRootURL+'/servlet/')
                          : new LinkJavascript(ZtVWeb.SPWebRootURL+'/servlet/'));
    if ( fillemptykeys ) {
      l_Appl.FillEmptyKey();
    }
    if(!Empty(keyfixedfilters)){
      for(var keyItem,i=0; i<keyfixedfilters_array.length; i++){
        keyItem = portletObj[fixedvars_array[i]];
        l_Appl[fncSetKey(keyItem.type)](keyfixedfilters_array[i],keyItem.Value(),0,0);
      }
    }

    this._putFieldValue(l_Appl,ctrlName);
    // l_Appl[fncSetKey(readFieldsType_array[0])](readfield_array[0],portletObj[linkedField].Value(),0,0);//Campo linkato

    l_Appl.SetFields(readfields);//LinkedFields
    l_Appl.SetTypes(readFieldsType);//Tipi dei LinkedFields
    l_Appl.LinkTable(table); // Tabella
    l_Appl.SetLinkzoom(servlet);// Gestione
    if (!Empty(searchingfunction))
      l_Appl.SetSearchingFunction(searchingfunction); //Searching function
    if (looselylinked && !Empty(defaultsfunction))
      l_Appl.SetDefaultsFunction(defaultsfunction); //Defauts function
    l_Appl.SetID(Link_Id);//Id del campo principale linkato
    var l_bDoLinkResult = l_Appl.DoLink(n_criteria,function(l_bResult) {
        AtEndLink.call(LinkZoom,l_bResult)
      }); //search Criteria
    if (typeof(l_bDoLinkResult)!='undefined')
      return AtEndLink.call(LinkZoom,l_bDoLinkResult);

    function AtEndLink(l_nRec) {
      l_bResult = l_nRec!=0;
      if ( l_nRec==1 ) {
        this._execReadvar_onChange=false;
        for(var i=0; i<readfield_array.length; i++){
          portletObj[intovars_array[i]].Value(l_Appl[fncGetValue(readFieldsType_array[i])](GetField(readfield_array[i]),0,0));
        }
        this._execReadvar_onChange=true;
        if ( fillemptykeys && !Empty(keyfixedfilters) ) {
          this._execKeyvar_onChange=false;
          for(var i=0,keyItem; i<keyfixedfilters_array.length; i++){
            keyItem = portletObj[fixedvars_array[i]];
            keyItem.Value(l_Appl[fncGetValue(keyItem.type)](keyfixedfilters_array[i],0,0));
          }
          this._execKeyvar_onChange=true;
        }
        this.dispatchEvent(Empty(portletObj[linkedField].Value()) ? 'LinkBlanked' : 'LinkExecuted');
      } else {
        this._execReadvar_onChange=false;
        var i = looselylinked ? 1 : 0; // quando looselylinked non blanka il campo linkato
        for( ; i < readfield_array.length; i++){
          portletObj[intovars_array[i]].Value('');
        }
        this._execReadvar_onChange=true;
        if ( looselylinked ) {
          l_bResult = Empty(defaultsfunction) ? true : ( l_Appl.GetDefaultRoutineResult()!=0 ? true : l_bResult );
        } else {
          if (portletObj[intovars_array[0]].SetFocus)
            portletObj[intovars_array[0]].SetFocus()
        }
      }
      if ( l_nRec==2 ) {
        if( IsDeviceMobile() )
          AddMobileLinkListener();
        layerOpenForeground(GetZoomBaseLink(LinkZoom.offline)+LinkZoom.LOpt_ZOOM()+'&FieldFilter='+URLenc(l_Appl.GetWhereFieldExprUnencoded()), 'linkview_'+LibJavascript.AlfaKeyGen(3), 'toolbar=0,menubar=0,directories=0,width=640,height=480,resizable=1,scrollbars=yes');  
        this.dispatchEvent('ZoomOpened');
        m_nLastError = -2;
      } else if ( !l_bResult ) {
        m_nLastError = 3;
        if ( l_nRec<0 ) {
          m_cLastMsgError = Translate('MSG_CONNECT_SERVER');
        }
        this.dispatchEvent('LinkFailed',m_nLastError,window.m_cLastMsgError);
      }
      return l_bResult;
    }
  };

  this.LOpt_ZOOM = function() {
    var filters = '',
        l_oWv = "";//InitWvApplet();
    l_oWv+='Table='+WtA(table,'C');
    l_oWv+='&Linkzoomprg='+WtA(servlet,'C');
    l_oWv+='&Linkzoom='+WtA(true,'L');
    l_oWv+='&Caption='+URLenc(WtA((Empty(zoomtitle)?(Empty(servlet)?table:servlet):zoomtitle),'C'));
    if (!Empty(configname))
      l_oWv+='&ConfigName='+WtA(configname,'C');
    l_oWv+='&PKFields='+WtA((Empty(keyfixedfilters)?'':keyfixedfilters+',')+readfield_array[0],'C');
    if ( fillemptykeys ) {
      l_oWv+='&FillEmptyKey='+WtA('true','C');
    }
    l_oWv+='&LinkedField='+WtA(readfield_array[0]+(fillemptykeys&&!Empty(keyfixedfilters)?','+keyfixedfilters:''),'C');
    if ( looselylinked && !Empty(defaultsfunction) ) {
        l_oWv += '&DefaultsRoutine='+URLenc(defaultsfunction);
    }
    if ( !Empty(keyfixedfilters) ) {
      var filterurl='',
          filterkeys='', i;
      for(i=0; i<keyfixedfilters_array.length; i++){
        if ( !fillemptykeys || !Empty(portletObj[fixedvars_array[i]].Value()) ) {
          filters+=(filters.length>0?" and ":"")+_flt_(keyfixedfilters_array[i],portletObj[fixedvars_array[i]].Value(),portletObj[fixedvars_array[i]].type,true);
          if (sendkeystozoomonzoom) {
            filterurl+=keyfixedfilters_array[i]+'='+URLenc(AsAppletValue(portletObj[fixedvars_array[i]].Value()))+'&';
            filterkeys+=keyfixedfilters_array[i]+',';
          }
        }
      }

      if ( looselylinked && !Empty(defaultsfunction) && defaultsfunction_zoom ) {
          l_oWv += URLenc('||FixedFilter||'+filters)+'&FixedFilter=';
      } else {
        l_oWv+='&FixedFilter='+URLenc(filters);
      }
      if (sendkeystozoomonzoom) {
        l_oWv+='&FixedFilterURL='+filterurl+'m_cMode=hyperlink&m_cParameterSequence='+filterkeys;
      }
    }
    l_oWv+='&UID='+(fillemptykeys && !Empty(fixedvars) ? fixedvars+',' : '')+linkedField;
    l_oWv+='&SPZTL='+spztl;
    l_oWv+='&QueryParms='+URLenc(getQueryParms());
    l_oWv+='&OpenerFormId='+portletObj.formid;
    return l_oWv;
  };  
};
ZtVWeb.LinkZoomCtrl.prototype=new ZtVWeb.StdControl;
}