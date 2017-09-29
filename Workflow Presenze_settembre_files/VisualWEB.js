//libreria VisualWEB
if (typeof(ZtVWeb)=='undefined'){
  if( 'ontouchstart' in window ){ //controlla la presenza in un dispositivo che gestisce i touch events
    // alert("to fix")
    (function(){
      var fixer = function(){},
          container = document.getElementsByTagName("html")[0];
      // alert(container);
      container.addEventListener('touchstart',fixer,false);
      container.removeEventListener('touchstart',fixer);
      container.addEventListener('touchend',fixer,false);
      container.removeEventListener('touchend',fixer);
    }());
  }
  var ZtVWeb=new function(){
    // this.dragObj = {zIndex:999,resize:false,iW:0,minW:280,minH:30}
    this.dragObj = window.dragObj;
    // funzioni a disposizione dei portlet----------------
    this.UID = ( function () {
        var state;
        if ( window.SPStatusManager ) {
          state = window.SPStatusManager.getWindowState( window );
          return ( state.ZtVWeb && state.ZtVWeb.UID ) || LibJavascript.AlfaKeyGen( 10 );
        }
        return LibJavascript.AlfaKeyGen( 10 );
    } )();
    var portletId=[];
    var portletName=[];
    var portletIndex=0;
    var portletsObj={}
    var portletsId={}
    this.iframeref;
    this.Translate=function(){
      return window.Translate.apply(window,arguments);
    }
    this.AddTranslation=function(orig,translated) {
      if (window.TransDict == undefined)window.TransDict={};
      window.TransDict[orig]=translated;
    }
    this.IsOffline=function(){
      var test_offline=new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL+"/blank.htm?x="+LibJavascript.AlfaKeyGen(10),false);
      var res=test_offline.Response();
      if(test_offline.http.status==200)
        return false;
      return true;
    }
    this.AdjustContainer=function(){
      if(ZtVWeb.isInContainer() && IsA(parent.adjustContainer,'F') && !(window.frameElement.getAttribute('toResize') == 'no')){
        if (typeof(CalculateAndResizeEntityHeight)=='function') {
          CalculateAndResizeEntityHeight();
        }
        parent.adjustContainer(window.frameElement.id);//Fa il resize dell'Iframe contenitore
        parent.ZtVWeb.AdjustContainer();
      }
    };
    this._rsztm=null

    LibJavascript.Events.addEvent(window,'resize', function(event){ZtVWeb.queueWindowResized(event)});
    LibJavascript.Events.addEvent(window,'load', function(){ZtVWeb.adjustPortletSteps()});

    this.queueWindowResized=function(e){
      clearTimeout(this._rsztm)
      this._rsztm=setTimeout("ZtVWeb.windowResized()",10)
    }
    this.windowResized=function(){
      var pn,p;
      for(pn in portletsId) {
        p=portletsId[pn]
        if (p.queueAdjustHeight && typeof(p.formid)=='string') {
          try{
            //Alla resize controlla se il portlet è in uno step position predefinito
            //this.adjustPortletSteps(true);
            if (p.setFormStep)
              p.setFormStep(true);
            p.queueAdjustHeight(200);
          }catch(e){}
        }
      }
    }
    this.adjustPortletSteps=function(anim){
      for(var pn in portletsId) {
        var p=portletsId[pn];
        if (typeof(p.formid)=='string') {
          try{
            p.setFormStep(anim);
          }catch(e){}
        }
      }
    }
    this.addPortlet=function(id,name){
      portletId[portletIndex]=id;
      portletName[portletIndex]=name;
      portletIndex++;
    }
    this.addPortletObj=function(id,name,obj){
      if (!('win_id' in obj)) { //portlet vecchi in cui non c'e
        try {
          if ('UID' in obj.Ctrl.ownerDocument.defaultView.ZtVWeb)
            obj.win_id=obj.Ctrl.ownerDocument.defaultView.ZtVWeb.UID;
          else {
            obj.win_id=obj.Ctrl.ownerDocument.defaultView.ZtVWeb.makeStdCell('eval:ZtVWeb.UID=UID');
          }
        }catch(e){}
      }
      if(this.isInContainer())
        parent.ZtVWeb.addPortletObj(id,name,obj);
      if(name in portletsObj){
        if(!IsA(portletsObj[name],'A')){
          //var p=portletsObj[name];
          //portletsObj[name]=[obj];
          portletsObj[name]=[portletsObj[name]];
        }
        portletsObj[name].push(obj);
      }else
        portletsObj[name]=obj;

      if(id in portletsId) {
        if('win_id' in portletsId[id]){ // e' un portlet
          var prevPtl =  portletsId[id];
          portletsId[id] = {};
          portletsId[id][prevPtl.win_id] = prevPtl;
        }
        portletsId[id][obj.win_id] = obj;
      }else{
        // portletsId[id+'_'+obj.win_id]=obj; // per il caso di portlet con lo stesso id assegno anche UID del ZtVWeb corrente
        portletsId[id]=obj; // per il caso di portlet con lo stesso id assegno anche UID del ZtVWeb corrente
      }
    }
    this.removePortletObj=function(name,zuid){
      var zUID=zuid || ZtVWeb.UID;
      if(this.isInContainer())
        parent.ZtVWeb.removePortletObj(name,zUID);
      //else
      if(name in portletsObj){
        if(IsA(portletsObj[name],'A')){ // nel caso ci siano piu' portlet con lo stesso nome
          //for(var i=0, p; p=portletsObj[name][i++] && portletsObj[name][i++]['win_id']==ZtVWeb.UID; delete portletsId[p.formid]);
          var i=0,p;
          while (i < portletsObj[name].length) {
            p = portletsObj[name][i];
            if (p['win_id'] == zUID) {
              if ('win_id' in portletsId[p.formid]) {
                delete portletsId[p.formid];
              } else if (zUID in portletsId[p.formid]) {
                delete portletsId[p.formid][zUID];
                var ii = 0,
                pp;
                for (pp in portletsId[id]) {
                  if (portletsId[id].hasOwnProperty(pp)) {
                    ii++;
                  }
                  if (ii > 1)
                    break;
                }
                if (ii == 1) { //rimasto 1 portlet in una finestra
                  portletsId[id] = portletsId[id][pp];
                }
              }
              //delete portletsId[p.formid];
              LibJavascript.Array.remove(portletsObj[name], i);
            } else {
              i++;
            }
          }
          if (portletsObj[name].length==1) {
            portletsObj[name] = portletsObj[name][0];
          } else if (portletsObj[name].length==0) {
            delete portletsObj[name];
          }
        }else{
          delete portletsId[portletsObj[name].formid];
          delete portletsObj[name];
        }
        if ( ZtVWeb.UID == zUID ) {
          var ii=0;
          while( ii < portletName.length ) {
            if(portletName[ii]==name){
              LibJavascript.Array.remove(portletId,ii);
              LibJavascript.Array.remove(portletName,ii);
            } else {
              ii++;
            }
          }
        }
      }
    }
    this.removePortletId=function(id,zuid){
      var zUID=zuid || ZtVWeb.UID;
      if(this.isInContainer()){
          (( window.frameElement && ( window.frameElement.ownerDocument.defaultView || window.frameElement.ownerDocument.parentWindow )) /*IE + WebKit*/
          || window.parent /*FF*/
        ).ZtVWeb.removePortletId(id,zUID);
    }
      // id+='_'+zUID;
      if( id in portletsId){
        var pName = portletsId[id].portletname || portletsId[id][zUID].portletname;
        if(IsA(portletsObj[pName],'A')){ // nel caso co siano piu portlet con lo stesso nome
        //if ( portletsObj[pName].length > 0 ) {
          var i, pIdx = -1;
          for ( i=0; i < portletsObj[pName].length; i++ ) {
            if ( portletsObj[pName][i].formid == id && portletsObj[pName][i].win_id == zUID ) {
              pIdx = i;
              break;
            }
          }
          if ( pIdx != -1 ) {
            portletsObj[pName].splice(pIdx,1);
            if ( portletsObj[pName].length == 1 ) {
              portletsObj[pName] = portletsObj[pName][0];
            }
          }
        } else {
          delete portletsObj[pName];
        }

        if('win_id' in portletsId[id]) {
          delete portletsId[id];
        } else if(zUID in portletsId[id]) {
          delete portletsId[id][zUID]
          var i=0,p;
          for(p in portletsId[id]){
            if(portletsId[id].hasOwnProperty(p)){
              i++;
            }
            if(i>1) break;
          }
          if (i==1) {  //rimasto 1 portlet in una finestra
            portletsId[id] = portletsId[id][p];
          }
        }
        if ( ZtVWeb.UID == zUID ) {
          var ii=0;
          while( ii < portletName.length ) {
            if(portletName[ii]==name){
              LibJavascript.Array.remove(portletId,ii);
              LibJavascript.Array.remove(portletName,ii);
            } else {
              ii++;
            }
          }
        }
      }
    }
    this.removePortlets=function(){
      for(var p in portletsId){
        this.removePortletId(p);
      }
    }
    this.getPortlet=function(name){
      var id;
      if(ZtVWeb.isInContainer())
        return parent.ZtVWeb.getPortlet(name);
      if(!name)
        return portletsObj;//restituisce un oggetto contenente tutti i portlet
      //restituisce il portlet specificato
      if(portletsObj[name]!=null) return portletsObj[name]
      for(var i=0, currname; currname=portletName[i]; i++){
        if(currname==name){
          id=portletId[i];
          break;
        }
      }
      return window[id];
    }
    this.getPortletWindow=function(name){ //ritorna il portlet di quella window con quel nome
      var array = this.getPortlet(name);
      if ( array && !array.formid) { //array
        for (var i=0;i<array.length;i++){
          if (array[i].Ctrl.ownerDocument==window.document) {
            return array[i];
            break;
          }
        }
      }else if(array && array.Ctrl.ownerDocument==window.document) {
        return array;
      } else {
        return null;
      }
    }
    this.getPortletsById=function(){
      return portletsId;
    }
    this.getPortletById=function(id,wndid){
      if(!wndid){
        return portletsId[id];
      }else{
        var res = portletsId[id];
        if (res) {
          if(res.wnd_id == wndid)  return res  //e' un portlet
          return res[wndid] //il portlet della wnd
        }
      }
    }
    this.queryPortlets = function (filterFnc) {
      if ( !filterFnc ) {
        return [];
      }
      var result = [];
      Object.keys( portletsObj ).forEach( function (portletId) {
        var portletCandidate = portletsObj[portletId];
        if ( portletCandidate instanceof Array ) {
          portletCandidate.filter( filterFnc ).forEach( function (portlet) {
            result.push( portlet );
          } );
        } else {
          if ( filterFnc( portletCandidate ) ) {
            result.push( portletCandidate );
          }
        }
      } );
      return result;
    };
    var pageletsIds = []
      , pagelets = {};
    this.addPagelet=function(pageletId, pageletObj, pageletName, includerPageletId){
      if( pageletsIds.indexOf(pageletId) == -1 ){
        this.pageletIncludedLoaded(pageletName, includerPageletId, pageletId);
        pageletsIds.push(pageletId);
        pagelets[pageletId] = pageletObj;
      }
    }
    this.removePagelet=function(pageletId){
      if( pageletsIds.indexOf(pageletId) == -1 ){
        pageletsIds.splice(pageletsIds.indexOf(pageletId),1);
        delete pagelets[pageletId];
      }
    }
    this.removePagelets=function(){
      pageletsIds = [];
      pagelets = {};
    }
    this.getPageletsIds=function(){
      return pageletsIds;
    }
    this.getPageletById=function(pageletId){
      return pagelets[pageletId];
    }
    /* Funzioni per la gestione del pedigree
    *  Parent Object Model
    */

    var pom = function(){
      /* @override */
      this.indexOf = function( ID ){
        /* search in local POM */
        var idx = -1;
        var f = function(el, i, arr){
          if( "ID" in el && el.ID == ID ){
            idx = i;
            return true; /* si ferma alla prima istanza di ID */
          }
        }
        this.some( f );
        return idx;
      }

      this.item = function( objID,parentObjID, type, name){
        this.ID = objID;
        this.parentID = parentObjID;
        this.type = type;
        this.name = name;
        this.childIDs = [];
        this.getParentObj = function(){
          return ZtVWeb.POM.getObjByID( this.parentID );
        }
        this.getChildObj = function(){
          return ZtVWeb.POM.getChildObj( this.ID );
        }
        this.isDescendantOf = function( ancestorID ){
          return ZtVWeb.POM.isDescendantOf( this.ID, ancestorID );
        }
        this.getDescendantObj = function(){
          return ZtVWeb.POM.getDescendantObj( this.ID );
        }
      }

      this.addObj = function( objID, name, type, parentObjID ){
        /* if parentObjID == null childID is the root */

        if( Empty( parentObjID ) ){
          /* search iframe attribute spparentobjid */
          if( ZtVWeb.isInContainer() ){
            /* search iframe element */
            var iframe = window.frameElement;
            if( iframe && iframe.getAttribute( "spparentobjid" ) )
              parentObjID = iframe.getAttribute( "spparentobjid" );
          }
        }
        if( !this.getObjByID( objID ) )
          this.push( new this.item( objID, parentObjID, type, name ) );
        if( !Empty( parentObjID ) ){
          if( this.getObjByID( parentObjID ) ){
            var p = this.getObjByID( parentObjID );
            if( p.childIDs.indexOf( objID ) == -1 )
              p.childIDs.push( objID );
          }
        }

        /* if parent have ZtVWeb */
        if( ZtVWeb.isInContainer() )
          parent.ZtVWeb.POM.addObj( objID, name, type, parentObjID );

      }

      this.removeObj = function( objID ){
        /* local POM search */
        var i = this.indexOf( objID );
        if( i > -1 ){
          /* remove child */
          this[i].childIDs.forEach( function( o, i, c ){ this.removeObj( o ); }, this );
          this.splice( i, 1 );
        }
        if( ZtVWeb.isInContainer() )
          (( window.frameElement && ( window.frameElement.ownerDocument.defaultView || window.frameElement.ownerDocument.parentWindow )) /*IE + WebKit*/
          || window.parent /*FF*/
          ).ZtVWeb.POM.removeObj( objID );
      }

      this.getObjByID = function( objID ){
        var i, obj = null;
        /* Search in root's POM */
        if( ZtVWeb.isInContainer() ){
          obj = parent.ZtVWeb.POM.getObjByID( objID );
        } else {
          i = this.indexOf( objID )
          if( i > -1 )
            obj = this[i];
        }
        return obj;
      }

      this.getParentObj = function( objID ){
        var p = null;
        var o = this.getObjByID( objID );
        if( o )
          p = this.getObjByID( o.parentID );
        return p;
      }

      this.getChildObj = function( objID ){
        var s = [];
        var o = this.getObjByID( objID );
        if( o ){
          // s = o.childIDs.slice(0);
          // s.forEach( function( o, i, s ){ s[i] = this.getObjByID( o ); }, this );
          s = o.childIDs.map( function( cId, i, s ){ return this.getObjByID( cId ); }, this);
        }
        return s;
      }

      this.isDescendantOf = function( objID, parentObjID ){
        var p = this.getParentObj( objID );
        while( p!= null && p.ID != parentObjID ){
          p = this.getParentObj( p.ID );
        }
        return p!=null;
      }

      this.getDescendantObj = function( objID ){
        var c = this.getChildObj( objID ),
          cc = c;
        for( var i = 0; i < c.length; i++ ){
          cc = cc.concat( this.getDescendantObj( c[i].ID ) );
        }
        return cc;
      }

      this.purge = function(){
        /* Remove top POM referrer  POM */
        this.forEach( function( o ){ this.removeObj(o.ID); }, this);
      }
    };
    pom.prototype = new Array();
    this.POM = new pom();


    /* Fine gestione pedigree */
    this.AdjustPortletHeight=function(id,zuid){
      var zUID=zuid||ZtVWeb.UID;
      var ptl = ZtVWeb.getPortletById(id,zUID)
      if (ptl) ptl.adjustHeight();
    }
    this.isLoading=function(pgId){
      if(pgId){
       if(typeof(window[pgId+"_pagelet_loading"])!='undefined')
          return window[pgId+"_pagelet_loading"];
      }else{
        var pgl;
        if(typeof(getPagelet) != 'undefined' && (pgl=getPagelet()) &&typeof(window[pgl.id+"_pagelet_loading"])!='undefined')
          return window[getPagelet().id+"_pagelet_loading"]
      }
      if(ZtVWeb.isInContainer())
        return parent.ZtVWeb.isLoading(pgId);
      return false;
    }
    this.isInContainer=function(){
      try{
        if(window.parent && window!=window.parent && window.parent.ZtVWeb )
          return true;
        else
          return (window.frameElement!=null && window!=window.frameElement.ownerDocument.defaultView  && window.frameElement.ownerDocument.defaultView.ZtVWeb);
      } catch(e) {
        return false;
      }
    }
    this.getPortletName=function(){return portletName}
    this.getPortletId=function(){return portletId}
    this.getParentPortlet=function(id){
      var TagNode=document.getElementById(id).parentNode;
      while(TagNode!=null){
        if(TagNode.tagName && TagNode.tagName.toUpperCase()=='DIV' && TagNode.getAttribute("portlet_id")){
          return window[TagNode.id];
        }
        TagNode=TagNode.parentNode;
      }
      return null;
    }
    this.getPortletInc=function(id,portletName){
      var el = LibJavascript.DOM.Ctrl(id), div, portlet_id;
      if (el.querySelector) {
        if (Empty(portletName)){
          div = el.querySelector('div[portlet_id]');
          if (portlet_id = div.getAttribute("portlet_id"));
            return window[portlet_id];
        }
        else {
          var divs=el.querySelectorAll('div[portlet_id]');
          for(var i=0; div=divs[i++]; ){
            if((portlet_id=div.getAttribute("portlet_id")) && window[portlet_id].portletname==portletName){
              return window[portlet_id];
            }
          }
        }
      } else {
        var divs=LibJavascript.DOM.Ctrl(id).getElementsByTagName("div");
        for(var i=0; div=divs[i++]; ){
          if((portlet_id=div.getAttribute("portlet_id")) && (Empty(portletName) || window[portlet_id].portletname==portletName)){
            return window[portlet_id];
          }
        }
      }
    }
    this.MakePortletWrapper=function(form, elementHandler) {
      var suffix = '_wrapper';
      var position = "static";
      var el;
      if (elementHandler) {
        el = elementHandler;
      } else {
        el = form.Ctrl;
      }
      while (el.tagName!='BODY') {
        if (el.style.position=='fixed') {
          suffix += '_fixed';
          position = 'fixed';
          break;
        }
        el = el.parentNode;
      }
      var ptl_wrapper = LibJavascript.DOM.Ctrl(form.formid+suffix);
      if (ptl_wrapper==null) {
        ptl_wrapper=document.createElement("div");//portlet
        ptl_wrapper.style.margin="0";
        ptl_wrapper.style.position=position;
        ptl_wrapper.style.top="0";
        ptl_wrapper.style.left="0";
        ptl_wrapper.style.width="0";
        ptl_wrapper.style.height="0";
        ptl_wrapper.style.border="0";
        ptl_wrapper.style.padding="0";
        ptl_wrapper.style.zIndex=""+(++ZtVWeb.dragObj.zIndex);
        ptl_wrapper.className=form.class_name+' '+form.portletname+'_portlet';
        ptl_wrapper.id=form.formid+suffix;
        document.body.appendChild(ptl_wrapper);
      }
      return ptl_wrapper;
    }
    this.CheckFormExist=function(id,func){
      if(typeof(eval(id))=='undefined' || eval(id).tagName=='DIV')
        setTimeout("ZtVWeb.CheckFormExist('"+id+"','"+func+"')",200)
      else
        setTimeout(id+'.'+func+'()',200)
    }
    this.getOpener=function(){
      return GetOpener();
    }

    //metodo che definisce il punto di entrata nel plan, se si e' passati per la %page%_DEVICE_IPAD (per esempio)
    this.DESKTOP=0; this.TABLET=1; this.SMARTPHONE=2;
    this._viewType=0;
    this.ViewType=function(_vT) {
      if(typeof(_vT)!='undefined'){
        this._viewType=_vT;
      }
      return this._viewType;
    }
    this._isMobile;
    this.IsMobile=function(isM) {
      if(typeof(isM)!='undefined'){
        this._isMobile=isM;
      }
      if(typeof(this._isMobile)!='undefined')
        return this._isMobile;
      else if(typeof(this._viewType)!='undefined')
        return this._viewType == this.TABLET || this._viewType == this.SMARTPHONE;
      else
        return false;
    }
    this.Language='';
    this.SetLanguage=function(lan){
      this.Language=lan;
      this.defaultDatePict=this.applyLocaleToDatePicture(datePattern);
      this.defaultDateTimePict=this.applyLocaleToDatePicture(dateTimePattern);
    }
    this.Libraries={};
    this.RequireLibrary=function(src, silentMode){
      return LibJavascript.RequireLibrary(src,silentMode);
    }
    this.CSSs={};
    this.Fonts={};
		this.SPWebRootURL='..';
		this.SetWebRootURL=function(url){
		  this.SPWebRootURL=url;
		}
    this.SetTheme=function(theme){
      this.theme=theme;
      if(!this.isInContainer() || !window.parent.SPTheme){
        this.RequireLibrary(ZtVWeb.SPWebRootURL+'/'+theme+'/styleVariables.js');
      }
      else if(window.parent.SPTheme){
        window.SPTheme=window.parent.SPTheme;
      }
    }


    this.RemoveCSS=function(src){
      var cssKey=src.replace(/\./g,'_').replace(/\//g,'$');
      var found = cssKey in this.CSSs;
      if(found) {
        delete this.CSSs[cssKey];
        var loadedCss = document.querySelector('link[rel=stylesheet][href*="'+src+'"]');
        loadedCss.parentNode.removeChild(loadedCss);
      }
    }
    this.RemoveThemedCSS=function(src){
      if(window.SPOfflineLib==undefined)
        this.RemoveCSS(src);
      this.RemoveCSS(src.replace(/(\.*\/*)/,'$1'+this.theme+'/'));/**/
    }
    this.RequireCSS=function(src){
      var loaded=false;
      var cssKey=src.replace(/\./g,'_').replace(/\//g,'$');
      var yetLoaded = cssKey in this.CSSs;
      if(!yetLoaded){
        var l=document.createElement('link');
        l.rel="StyleSheet";
        l.type="text/css";
        l.href=ZtVWeb.SPWebRootURL+'/'+src;
        document.getElementsByTagName('head')[0].appendChild(l);
        this.CSSs[cssKey]='';
      }
    }
    this.RequireThemedCSS=function(src){
      if(window.SPOfflineLib==undefined)
        this.RequireCSS(src);
      this.RequireCSS(src.replace(/(\.*\/*)/,'$1'+this.theme+'/'));/**/
    }
    this.RequireFont=function(font,font_path){
      var yetLoaded = font in this.Fonts;
      if(!yetLoaded){
        font = font.replace(".ttf","")
        var cssStr = "../fonts/"+ ( !Empty(font_path) ? font_path + "/" : "" ) + font;
        var newStyle = document.createElement('style');
        newStyle.type = 'text/css';
        var css_txt = "\
          @font-face {\
              font-family: '" + font + "';\
              src:url('"+cssStr+".eot');\
              src: url('"+cssStr+".eot#"+font+"') format('embedded-opentype'),\
               url('"+cssStr+".svg#"+font+"') format('svg'),\
               url('"+cssStr+".woff') format('woff'),\
               url('"+cssStr+".ttf') format('truetype');\
          }\
        ";
        var rules = document.createTextNode( css_txt );
        if ( newStyle.styleSheet ) {
          newStyle.styleSheet.cssText = rules.nodeValue;
        } else {
          newStyle.appendChild( rules );
        }
        document.getElementsByTagName( 'head' )[0].appendChild( newStyle );
        this.Fonts[font]='';
      }
    }

    //funzione fittizzia per fix del touchstart
    this.Fixer=function(){}
    this.IncludeFromString=function(res,container,p_fReplacer){
      var docFrag=document.createDocumentFragment();
      var docFrag_div = document.createElement("div");
      docFrag_div.innerHTML="&nbsp;"+res;//&nbsp; serve altrimenti nonvengono letti gli script
      docFrag.appendChild(docFrag_div);
      var lib_urls=[];
      if(docFrag.getElementsByTagName){  // Ie 7
        var scripts=docFrag.scripts;
        for(var i=0;i<scripts.length;i++){
          if(scripts[i].src) lib_urls.push(scripts[i].src);
        }
      }else{
        var scripts=docFrag.querySelectorAll('script[src]');
        for(var i=0;i<scripts.length;i++)
          lib_urls.push(scripts[i].src);
      }
      docFrag=null;
      /*
      //raccolta librerie
      var libs=res.match(/<script.*src=.*\.js/ig)||[],
          lib_urls=[], i;
      for(i=0; i<libs.length; i++){
        lib_urls.push(libs[i].replace(/.*=['"]?/, ''));
      }
      //toglie le librerie dal html
      res=res.replace(/<script.*src=.*\.js<\/script>/ig, '');
      */
      //funzione per valutazione JS
      function eval_js(){
        //valutazione JS
        for(var i=0, js=res.split('/*JS_MARKER_START*/'), l=js.length, idx, js_trunk; i<l; i++){
          js_trunk=js[i];
          idx=js_trunk.indexOf('/*JS_MARKER_END*/');
          if(idx!=-1){
            js_trunk = js_trunk.substr(0,idx);
            new Function( p_fReplacer ? p_fReplacer(js_trunk) : js_trunk )();
          }
        }
      }
      //funzione per iniezione HTML
      function inject_html(){
        if(container){
          if(IsA(container,'C')) {
            container=document.getElementById(container);
          }
          //controllo della presenza dell'evento touch sul container
          // alert('ontouchstart' in window)
          // if( 'ontouchstart' in window ){ //controlla la presenza in un dispositivo che gestisce i touch events
            // if (!(container.hasAttribute('ontouchstart') || container.hasAttribute('onclick') || container.hasAttribute('ontouchmove'))){
              // alert("fixed for "+container.id+" in "+window.name)
              // container.addEventListener('touchstart',ZtVWeb.Fixer,false);
              // container.removeEventListener('touchstart',ZtVWeb.Fixer);
            // }
          // }
          // alert("injected for "+container.id+" in "+window.name)
          container.innerHTML = p_fReplacer ? p_fReplacer(res) : res;
        }
      }
      //importazione librerie + iniezione html + valutazione js
      for(i=0; i<lib_urls.length; i++){
        this.RequireLibrary(lib_urls[i]);
      }
      inject_html();
      eval_js();
    }
    this.Include=function(src,container,noCache,p_fReplacer){
      if(!noCache) noCache=false;
      var JSURLObj= new ZtVWeb.JSURL(src+( src.indexOf("?")>-1 ? '&' : '?' )+"clientsideinclusion=true",noCache);
      var res=JSURLObj.Response();
      var status=JSURLObj.http.status;
      ZtVWeb.IncludeFromString(res,container,p_fReplacer);
      return status;
    }

    this.SPParameterSource = function () {
      /* INIZIO funzioni copiate da controls.js */
      function HtmlToWork_Date(strDate){
        if(strDate=='' || strDate=='  -  -'){
          return new Date(100,0,1,0,0,0,0);
        }
        var dat,month, year, eng;
        // if ( LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date ){
          // // YYYY-MM-DD
          // year=strDate.substr(0,4)-0;
          // month=strDate.substr(5,2)-0;
          // day=strDate.substr(8,2)-0;
        // }else{
          eng = window.m_cLanguage=='eng' && "N"==dataFormatSetByapplication;
          day=strDate.substr((eng?3:0),2)-0;
          month=strDate.substr((eng?0:3),2)-0;
          year=strDate.substr(6,4)-0;
        // }
        return new Date(year,month-1,day);
      }
      function HtmlToWork_DateTime(strDate){
        if(strDate=='' || strDate=='  -  -'){
          return new Date(100,0,1,0,0,0,0);
        }
        var eng = window.m_cLanguage=='eng' && "N"==dataFormatSetByapplication
          , day=strDate.substr((eng?3:0),2)-0
          , month=strDate.substr((eng?0:3),2)-0
          , year=strDate.substr(6,4)-0
          , h=strDate.substr(11,2)-0
          , m=strDate.substr(14,2)-0
          , s=strDate.substr(17)-0
          , objDate=new Date(year,month-1,day,h,m,s);
        return objDate;
      }
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
            // return HtmlToWork_Date(ApplyPictureToDate(obj,'DD-MM-YYYY'));
            return HtmlToWork_Date(ZtVWeb.applyPicture(obj,'D',0,"DD-MM-YYYY"));
            break;
          case 'T':
            // return HtmlToWork_DateTime(ApplyPictureToDateTime(obj,'DD-MM-YYYY hh:mm:ss'));
            return HtmlToWork_DateTime(ZtVWeb.applyPicture(obj,'T',0,'DD-MM-YYYY hh:mm:ss'));
            break;
        }
      }
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
      /* FINE funzioni copiate da controls.js */
      function url_args_decode() {
        var args_enc, el, i, nameval, ret;
        ret = {};
        // strip off initial ? on search and split
        args_enc = document.location.search.substring(1).split('&');
        for (i = 0; i < args_enc.length; i++) {
          // convert + into space, split on =, and then decode
          args_enc[i].replace(/\+/g, ' ');
          nameval = args_enc[i].split('=');
          if ( nameval[0] ) {
            var myname = nameval.splice(0,1);
            ret[decodeURIComponent(myname)] = decodeURIComponent(nameval.join('='));
          }
        }
        // strip off initial # on search and split
        args_enc = document.location.hash.substring(1).split('&');
        for (i = 0; i < args_enc.length; i++) {
          // convert + into space, split on =, and then decode
          args_enc[i].replace(/\+/g, ' ');
          nameval = args_enc[i].split('=');
          if ( nameval[0] ) {
            var myname = nameval.splice(0,1);
            ret[decodeURIComponent(myname)] = decodeURIComponent(nameval.join('='));
          }
        }

        return ret;
      };

      this.params = url_args_decode();
      this.GetInclusionParameter=function(name, servervalue) {
        if ( !Empty(servervalue) ) {
          return servervalue;
        } else {
          return this.GetParameter(name, servervalue);
        }
      }
      this.GetParameter=function(name, defaultvalue) {
        if (typeof (this.params[name])!='undefined') return AtW(this.params[name],getTypeFromValue(defaultvalue));
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
    }

   this.DoLinkZoom=function(uid,value,formid){
      var call = (window.opener? window.opener: (window.caller? window.caller:null))
      var mobile = IsDeviceMobile();
      if (call !=null) {
        if( mobile){
          call.postMessage( JSON.stringify( {uid:uid,value:value,type:'ReportLinkValue',formid:formid}) , location.origin );
          function receiver(event) {
            if (event.origin == location.origin) {
              var par = JSON.parse(event.data);
              if (par.type == 'closePopup') {
                if (!par.managed)
                  alert(((ZtVWeb.GridTranslations||{})["Cannot_report_zoom_value"])||'E'+String.fromCharCode(39)+' impossibile riportare il valore selezionato')
                if (self.closeFrame) self.closeFrame();
                else {
                  self.close();
                }
              }else {
                alert(event.data);
              }
            }
          }
          window.addEventListener('message', receiver, false);
        }else{
          if(typeof call.ReportLinkValue!='undefined' && call.ReportLinkValue(uid,value,window)){ //non serve fare nulla
          }else if(typeof call.ZtVWeb!='undefined' && call.ZtVWeb.ReportLinkValue(uid,value,formid)){ //non serve fare nulla
          }else{
            alert(((ZtVWeb.GridTranslations||{})["Cannot_report_zoom_value"])||'E'+String.fromCharCode(39)+' impossibile riportare il valore selezionato')
          }
          if (!(window.parent.spModalLayer && window.frameElement && window.parent.spModalLayer[window.frameElement.id])) //non e' modal layer
            call.focus()
        }
      }

      if( !mobile ){
        if (self.closeFrame) self.closeFrame();
        else self.close();
      }
    }

    this.ReportLinkValue=function(uid,value,formid){ //Dato in arrivo da un Visualzoom
      var uids=uid.split(',')
      var form, bResult=false;
      if(formid && formid in window) form=window[formid];
      for(var i=0;i<uids.length;i++){
        if(form && form[uids[i]]){
          form[uids[i]].Value(Trim(IsA(value,'O')?value[i]:value))
          if(i==0) {
            bResult=true;
            if (form[uids[i]].SetFocus)
              form[uids[i]].SetFocus();
          }
        }else if(document.getElementById(uids[i])){
          document.getElementById(uids[i]).value=Trim(IsA(value,'O')?value[i]:value)
          if(i==0){
            bResult=true;
            if ( (!window.SPMobileLib || !window.SPMobileLib.isPlatformMobile())) {
              document.getElementById(uids[i]).focus();
              document.getElementById(uids[i]).select();
            }
          }
        }
      }
      return bResult;
    }

    this.valueToStr=function(value,type){
      var str=''
      if (type==null)
        type=this.getTypeFromValue(value)
      switch(type){
        case 'M' : case 'C':
           str=value
           break
        case 'N':
           str=value.toString()
           break
        case 'D':
           //str=ZtVWeb.applyPicture(value,'D',0,this.defaultDatePict)
           str=ZtVWeb.applyPicture(value,'D',0,"YYYY-MM-DD")
           break
        case 'T':
           //str=ZtVWeb.applyPicture(value,'T',0,this.defaultDateTimePict)
           str=ZtVWeb.applyPicture(value,'T',0,"YYYY-MM-DD hh:mm:ss")
           break
        case 'L':
           str=value.toString()
           break
      }
      return str;
    }

    this.strToValue=function(str,type,pict){
     if(typeof(str)!='string') return str;
     if(typeof(pict)=='undefined')pict=null
      // pict DEVE essere null o contenere il formato utilizzato per la scrittura o l' input della stringa
      switch(type){
        case 'N':
         if (pict!=null){
           str=Strtran(str,milSep,'')
           str=Strtran(str,decSep,'.')
         }
         return str-0
        case 'D':
           if(str.indexOf(" ")>-1) str=str.substr(0,str.indexOf(" "))
           return(ZtVWeb.strToDate(str,pict))
        case 'T':
           return(ZtVWeb.strToDateTime(str,pict))
        case 'L':
          return ("1TYS".indexOf(str.charAt(0).toUpperCase())!=-1 && str!='')
      }
      return str;
    }

    this.strToDate=function(str,pict){
      var date=null;
      var p=str.indexOf(' ')  //toglie l' eventuale time
      if (p>-1) str=str.substr(0,p)
      var datearray
      // divido le varie componenti
      if((str.indexOf('/')>-1 || str.indexOf('-')>-1)) {
        if(str.indexOf('/')>-1) datearray=str.split('/')
        if(str.indexOf('-')>-1) datearray=str.split('-')
      }else if(str.length==6) {
        datearray=[str.substr(0,2),str.substr(2,2),str.substr(4,2)]
      } else if(str.length==8 && pict!=null) {
        if (pict.substr(0,2)=="YY") // l' anno e' davanti
          datearray=[str.substr(0,4),str.substr(4,2),str.substr(6,2)]
        else
          datearray=[str.substr(0,2),str.substr(2,2),str.substr(4,4)]
      }
      // se sono riuscito a dividere la data, ora cerco di attribuire il significato corretto
      if (datearray!=null && datearray.length==3){
        var d0=datearray[0]-0
        var d1=datearray[1]-0
        var d2=datearray[2]-0
        if (!isNaN(d0) && !isNaN(d1) && !isNaN(d2)){
          if (d0>=100) { // anno in testa il formato e' sempre YYYY-MM-DD
            if (d0<9999 && d1>0 && d1<13 && d2>0 && d2<32) {
              if (LibJavascript.Date.CheckDate(d2,d1,(d0<100?2000+d0:d0)))
                date=new Date((d0<100?2000+d0:d0),d1-1,d2)
            }
          } else {
            // l' anno e' sicuramente in coda, dobbiamo capire se in testa ho il mese o il giorno
            //if (EmptyString(pict)) pict=this.defaultDatePict
            if (pict!=null && pict.substr(0,2)=="DD"  || (pict==null && d2<=9999 && d1>0 && d1<13 && d0>0 && d0<32)) {
              if (d2<=9999 && d1>0 && d1<13 && d0>0 && d0<32)
                if (LibJavascript.Date.CheckDate(d0,d1,(d2<100?2000+d2:d2)))
                  date=new Date((d2<100?2000+d2:d2),d1-1,d0)
            } else if (pict!=null && pict.substr(0,2)=="MM" || (pict==null && d2<=9999 && d0>0 && d0<13 && d1>0 && d1<32)) {
              if (d2<=9999 && d0>0 && d0<13 && d1>0 && d1<32)
                if (LibJavascript.Date.CheckDate(d1,d0,(d2<100?2000+d2:d2)))
                  date=new Date((d2<100?2000+d2:d2),d0-1,d1)
            }
          }
        }
      }
      return date
    }
    this.strToDateTime=function(str,pict){
      // if val is datetime => return date with hh:mm:ss
      // if val is date => return date with 00:00:00
      var date=null;
      var adate=str.split(' ');
      if(adate.length==1 && adate[0].length==14){
        //return CharToDateTime(adate[0]);//accetta DDMMYYYYHHMMSS
        date=this.strToDate(adate[0].substr(0,8),pict);
        if(date==null) return str;
        date.setHours(adate[0].substr(8,2));
        date.setMinutes(adate[0].substr(10,2));
        date.setSeconds(adate[0].substr(12,2));
        return date;
      }
      date=this.strToDate(adate[0],pict);
      if (date!=null && adate.length>1) {
        try {
          var atime=adate[1].split(':');
          if(atime.length==1) return null;//ci devono essere i :
          date.setHours(atime.length < 1 ? 0: atime[0]);
          date.setMinutes(atime.length < 2 ? 0: atime[1]);
          date.setSeconds(atime.length < 3 ? 0: atime[2]);
        } catch (e) {};
      }
      return date;
    }
    // ------- funzioni di gestione della picture
    this.applyLocaleToDatePicture=function(pict){ //traduco la picture nel caso sia inglese
      if((this.Language||"ita").match(/eng/i) && "N"==dataFormatSetByapplication)
        return pict.replace(/(DD)(.*)(MM)/g, "$3$2$1");
      return pict
    }
    this.getTypeFromPict=function(pict){
      var type='C';
      if(!EmptyString(pict)){
        if(pict.indexOf('9')>-1)
          type='N';
        else if(pict.indexOf('DD')>-1)
          if(pict.indexOf('hh')==-1)
            type='D';
          else
            type='T';
        else if("MW!mw".indexOf(pict)>-1)
          type='C';
      }
      return type
    }

    this.getTypeFromValue=function(value){
      var type="C";
      if (typeof(value)=="string"){
        type="C"
      } else if (typeof(value)=="number") {
        type="N"
      } else if (typeof(value)=="boolean") {
        type="L"
      } else if (IsA(value,"D")){
        type=((value.getHours()==0 && value.getMinutes()==0 && value.getSeconds()==0)?'D':'T')
      }
      return type
    }
    //
    this.defaultDatePict="DD-MM-YYYY";
    this.defaultDateTimePict='DD-MM-YYYY hh:mm:ss';
    //
    this.applyPicture=function(value,type,len,pict){ //per creare una stringa formattata
      /*si aspetta valori o stringhe nel formato restituito da SQLDataProvider*/
      var str;
      if(value==null) return '';
      pict=pict?Strtran(Strtran(Strtran(pict,"|",","),"'",""),'"',''):null;
      if(type==null || EmptyString(type)){
         type=this.getTypeFromPict(pict);
         if(type==null){
            type=this.getTypeFromValue(value);
            if(type==null)
              return value.toString();
         }
      }
      switch(type){
        case 'M': case 'C':
          if(!EmptyString(pict)&& (pict.substr(0,1)=='!' || pict.substr(0,1)=='M' || pict.substr(0,1)=='W'))
            str=value.toUpperCase();
          else if(!EmptyString(pict)&& (pict.substr(0,1)=='m' || pict.substr(0,1)=='w'))
            str=value.toLowerCase();
          else
            str=""+value; //trasformo qualsiasi tipo di dato in stringa
          break;
        case 'N':
          if(!EmptyString(pict)&&pict.substr(0,1)=='9')
            str=FormatNumber(value-0,len,0,pict);
          else
            str=Strtran(value.toString(),'.',decSep);
          break;
        case 'L':
          str=value.toString();
          break;
        case 'D':
          if(typeof(value)=="string") value=ZtVWeb.strToValue(value,'D',((EmptyString(pict)||pict==null)?this.defaultDatePict:pict));
          str=FormatDate(value,((EmptyString(pict)||pict==null)?this.defaultDatePict:pict));
          break;
        case 'T':
          if(typeof(value)=="string") value=ZtVWeb.strToValue(value,'T');
          str=FormatDateTime(value,((EmptyString(pict)||pict==null)?this.defaultDateTimePict:pict));
          break;
      }
      return str;
    }
    this.checkInput=function(str,type,pict,showErrMsg,ctrl){
      var res=true, translated;
      if(!EmptyString(str)){
        switch(type){
          case 'N':
            str=Strtran(str,',','.');
            res=!isNaN(str);
            if( !res && ctrl) ctrl.Ctrl_input.value='';
            if( !res && ctrl && ctrl.form[ctrl.name+'_Error']) {
              ctrl.form[ctrl.name+'_Error']('Invalid number');
            }else if (!res && showErrMsg!=null && showErrMsg) {
              translated = ZtVWeb.Translate('MSG_WRONG_NUMBER');
              if (translated=='MSG_WRONG_NUMBER') translated='Invalid number';
              alert(translated);
            }
            break;
          case 'D':
            if (EmptyString(pict)) {
              pict=this.defaultDatePict
            } else {
              pict=FormatDate.swapYYMMDD(pict)
            }
            res=ZtVWeb.strToDate(str,pict)!=null
            if( !res && ctrl) ctrl.Ctrl_input.value='';
            if( !res && ctrl && ctrl.form[ctrl.name+'_Error']) {
              ctrl.form[ctrl.name+'_Error']('Invalid date');
            }else if (!res && showErrMsg!=null && showErrMsg) {
              translated = ZtVWeb.Translate('MSG_WRONG_DATE');
              if (translated=='MSG_WRONG_DATE') translated='Invalid date';
              alert(translated);
            }
            break;
          case 'T':
            if (EmptyString(pict)) {
              pict=this.defaultDatePict
            } else {
              pict=FormatDate.swapYYMMDD(pict)
            }
            res=ZtVWeb.strToDateTime(str,pict)!=null
            if( !res && ctrl) ctrl.Ctrl_input.value='';
            if( !res && ctrl && ctrl.form[ctrl.name+'_Error']) {
              ctrl.form[ctrl.name+'_Error']('Invalid datetime');
            }else if (!res && showErrMsg!=null && showErrMsg) {
              translated = ZtVWeb.Translate('MSG_WRONG_DATE');
              if (translated=='MSG_WRONG_DATE') translated='Invalid datetime';
              alert(translated);
            }
            break;
        }
      }
      return res;
    }
    this.FormatDecSep=function(e,obj){
       var keyCode
       if (navigator.userAgent.toLowerCase().indexOf('msie')!=-1){
         if(Empty(e))
           e=window.event
         keyCode=e.keyCode;
       }else
         keyCode=e.which;
      if(keyCode==110 || keyCode==190 || keyCode==188){// trasformo il . o , in separatore corrente dei decimali
         e.cancelBubble=true;
        if(e.stopPropagation) e.stopPropagation();
        e.returnValue=false;
        if(e.preventDefault)e.preventDefault();
        obj.value+=decSep;
      }
    };
    this.formatAsPrm=function(value,type){
      return ZtVWeb.valueToStr(value,type)
    }

    this.toSQL=function(v,type,op){
      //if(isLike==null) isLike=false;
      var tmp;
      try{
        switch(type) {
          case 'C': case 'M':
            if(op=='like')
              v="'"+Strtran(v,"'","''")+"%"+"'";
            else if(op=='contains')
              v="'"+"%"+Strtran(v,"'","''")+"%"+"'";
            else
              v="'"+Strtran(v,"'","''")+"'";
          break
          case 'D':
            tmp = this.applyPicture(v,'D',0,"YYYY-MM-DD");
            if (tmp!="") v="{d '"+tmp+"'}"
            else v = "NULL"
          break
          case 'T':
            tmp = this.applyPicture(v,'T',0,"YYYY-MM-DD hh:mm:ss");
            if (tmp!="") v="{ts '"+tmp+"'}"
            else v = "NULL"
          break
          case 'L':
            if(typeof(v)=='string')
              v=CharToBool(v)===true?"1":"0";
            else
              v=v===true?"1":"0";
          break
        }
      }catch(e){}
      return v
    }
    this.EditTool=function(Pname){
      window.open(ZtVWeb.SPWebRootURL+"/visualweb/editor.htm?id="+URLenc(Pname),"portleteditor", "status=no,toolbar=no,menubar=no,location=no");
    }
    this.AddPortletToEdit=function(name, id, profiled, roles){
      var isMobile=ZtVWeb.IsMobile();
      if (isMobile)
        return;
      var portletList=LibJavascript.Browser.TopFrame('ZtVWeb').ZtVWeb.getPortletsById()
      var topFrame=LibJavascript.Browser.TopFrame('ZtVWeb').document;
      var editing_tool=topFrame.getElementById("aaa_editing_tool")
      if (!editing_tool){
        editing_tool=document.createElement('div')
        editing_tool.id="aaa_editing_tool"
        editing_tool.style.position='fixed'
        editing_tool.style.top='3px';
        editing_tool.style.right='3px';
        editing_tool.style.cursor='pointer';
        editing_tool.style.zIndex=20000
        editing_tool.style.maxHeight='200px'
        editing_tool.style.height='auto'
        var innerHTML="<div class='portlet' style='overflow-y:hidden; width:50px;'><img id='aaa_editing_tool_img' src='../visualweb/images/gear_grey.png' border='0' style='position:absolute; right:3px;'/>"
        innerHTML+="<ul id='aaa_editing_tool_ul' style='display:none; text-align:right; list-style-type:none; padding:3px; margin:0; margin-top:16px; height:auto; max-height:200px; overflow-y:auto; overflow-x:hidden; padding-top:15px;'></ul></div>"
        editing_tool.innerHTML+=innerHTML;
        topFrame.body.appendChild(editing_tool)
        topFrame.getElementById('aaa_editing_tool_img').onclick=function(){
          if (editing_tool_ul.style.display=='none'){
            this.parentNode.parentNode.style.backgroundColor="#fff"
            this.parentNode.parentNode.style.opacity="0.9"
            editing_tool_ul.style.display='block';
            editing_tool_ul.parentNode.style.width='auto';
            editing_tool_ul.parentNode.style.width=editing_tool_ul.scrollWidth+40+'px'
          }
          else{
            this.parentNode.parentNode.style.backgroundColor="transparent"
            this.parentNode.parentNode.style.opacity="1"
            editing_tool_ul.style.display='none';
          }
        }
      }
      var editing_tool_ul=topFrame.getElementById('aaa_editing_tool_ul');

      //elimino quelli in +
      var listLi=editing_tool_ul.children
      var idList=[], idToDelete=[]
      for (var i=0; i<listLi.length; i++){
        var _id=Strtran(listLi[i].id,"aaa_editing_tool_li_","");
        if (!Empty(portletList[_id]))
          idList.push(_id)
        else{
          idToDelete.push(_id);
        }
      }
      for (var i=0; i<idToDelete.length; i++){
        var node=topFrame.getElementById("aaa_editing_tool_li_"+idToDelete[i])
        node.parentNode.removeChild(node)
      }

      if (idList.indexOf(id)==-1){
        var li=document.createElement('li')
        li.className='label'
        li.id="aaa_editing_tool_li_"+id
        editing_tool_ul.appendChild(li)
        var inner="<span style='padding-right:5px;'>"+name+"</span><img id='aaa_editPortlet_"+id+"' src='../visualweb/images/grid_edit.png' style='padding-right:"+(profiled?"0px":"16px")+"'/>";
        if (profiled){
          inner+="<img id='aaa_editSecurity_"+id+"' src='../images/spadministration_document_search.png'/>";
        }
        li.innerHTML=inner;
        if (profiled){
          topFrame.getElementById("aaa_editSecurity_"+id).onclick=function(){
            ZtVWeb.EditSecurity(name,roles);
          }
        }
        topFrame.getElementById("aaa_editPortlet_"+id).onclick=function(){
          ZtVWeb.EditTool(name);
        }
        li.onmouseover=function(){
          this.style.fontWeight='bold'
          var element=document.getElementById(id)
          var hover=document.createElement('div')
          element.parentNode.insertBefore(hover, element.nextSibling);
          hover.id='aaa_editing_tool_hover'
          hover.style.position='absolute'
          hover.style.top=element.offsetTop+'px';
          hover.style.left=element.offsetLeft+'px';
          hover.style.width=element.offsetWidth+'px'
          hover.style.height=element.offsetHeight+'px'
          hover.style.backgroundColor="#4470BD"
          hover.style.opacity="0.5"
          hover.style.zIndex=20000;
          element.scrollIntoView(false)
        }
        li.onmouseout=function(){
          this.style.fontWeight=''
          var hover=document.getElementById('aaa_editing_tool_hover')
          hover.parentNode.removeChild(hover)
        }
        if (editing_tool_ul.style.display!='none'){
          editing_tool_ul.parentNode.style.width='auto';
          editing_tool_ul.parentNode.style.width=editing_tool_ul.scrollWidth+40+'px'
        }
      }
    }
    this.EditSecurity=function(Pname,roles){
      window.open(ZtVWeb.SPWebRootURL+"/servlet/SPManageProcedureSecurity?progname="+URLenc("ps/"+Pname)+"&roles_for_entity="+URLenc(Strtran(roles||'',',',', ')),"securityeditor", "status=no,toolbar=no,menubar=no,location=no,resizable=yes");
    }
    this.makeStdLink=function(txt,idx,datasource,rs,form){
      txt=txt.replace(/\|/g,',')
      if(txt.indexOf('function:')>-1) {
        txt=txt.replace(/function:/g,'');
        txt='javascript:'+form.formid+'.'+ZtVWeb.fmtPctFldPct(txt,idx,datasource,rs,form,false,true);
        return txt;
      }else if(txt.indexOf('javascript:')>-1){
        txt=ZtVWeb.fmtPctFldPct(txt,idx,datasource,rs,form,false,true);
        return txt;
      }
      if(txt.indexOf('SPLink:')>-1) {
        var action_tmp='';
        txt=txt.replace(/SPLink:/,'');
        if(txt.indexOf(":")>-1) {
          action_tmp=txt.substring(txt.indexOf(":")+1);
          txt=txt.substring(0,txt.indexOf(":"))
        }
        if(datasource!=null)
          txt='javascript:'+form.formid+'.'+txt+'.Link(\''+datasource.name+'\','+(IsAny(idx)?idx:"null")+',null,\''+action_tmp+'\')';
      }
      txt=ZtVWeb.fmtPctFldPct(txt,idx,datasource,rs,form,true,false) //formatta i %campo%
      /*
      var fld_par,pos,pos_int,txt_par,txt_split;
      txt_par=txt;
      pos=txt_par.indexOf('?',0)
      if(pos>-1) {
        txt_par=Substr(txt,pos+2)
        txt=Left(txt,pos+1)
        if(window.SPOfflineLib!=undefined){
          pos=txt_par.indexOf('#',0)
          if(pos>-1){
            txt=txt+makeURLenc(Left(txt_par,pos),'#')
            txt_par=Substr(txt_par,pos+2)
          }
        }
        txt_split=txt_par.split('&')
        for(var i=0;i<txt_split.length;i++) {
          fld_par=txt_split[i];
          txt=txt+makeURLenc(fld_par,(i!=txt_split.length-1?'&':''))
        }
      }*/
      return txt;
    }
    /*
    function makeURLenc(str_URLenc,chr_next){
      var pos=str_URLenc.indexOf('=',0)
      return Left(str_URLenc,pos+1)+URLenc(Substr(str_URLenc,pos+2))+chr_next
    }*/

    this.makeStdExpr=function(txt,form){
      if(txt.indexOf('var:')>-1){
        txt=txt.replace(/var:/g,'');
        return form[txt].Value();
      }else
        txt=ZtVWeb.fmtPctFldPct(txt,0,null,null,form,false,false);
      return txt;
    }

    function isExpr(txt){
      return txt.match(/^%|(function|var|image|javascript|checkbox|combobox|html|eval|bar):/);
    }
    this.isExpr = isExpr;
    function isCheckbox(f){
      return f.indexOf('checkbox:')>-1;
    }
    this.isCheckbox = isCheckbox;

    this.makeStdCell=function(txt,idx,datasource,rs,form,urlenc,picture,toJS/*default true*/){
      if(isExpr(txt)){
        txt=txt.replace(/\|/g, ",");//compatibilita' vecchia
        txt=txt.replace(/\$/g, ",");
        txt=txt.replace(/javascript:/g,'');
        txt=txt.replace(/html:/g,'');
        txt=ZtVWeb.fmtPctFldPct(txt,idx,datasource,rs,form,urlenc,toJS); //formatta i %campo%
        txt=ZtVWeb.makeStdExpr(txt,form);
        if(typeof(txt)!='string') return txt;
        var alt;
        if (txt.indexOf('function:')>-1){
          txt=txt.replace(/function:/g,'');
          txt=txt.replace(/"/g, '\"');
          var txtHT=Trim(ToHTag(txt));
          txt=eval( (form && IsA(form[txt.substr(0, txt.indexOf('(') )], 'F') ? 'form.' : '') +txtHT);
          if(picture!=null)
            txt=this.applyPicture(txt,null,0,picture);
        }else if(txt.indexOf('image:')>-1){
          var src_tmp=txt.replace(/image:/g,'');
          alt='',indexalt=src_tmp.indexOf(":");
          var protocols = ["cdvfile", "http", "https"];
          LibJavascript.Array.forEach(protocols, function(protocol){
            if(src_tmp.indexOf(protocol + ":") > -1) {
              // trovo l'indice dei :, escludendo quelli del protocollo
              indexalt = src_tmp.substr(protocol.length + 1).indexOf(":");
              if(indexalt > -1) {
                // se trovati, aggiungo la lunghezza del protocollo e dei : rimossi
                indexalt += protocol.length + 1;
              }
            }
          }, this);
          if(indexalt>-1) {
            alt=src_tmp.substr(indexalt+1);
            src_tmp=src_tmp.substr(0,indexalt);
          }
          if (!Empty(src_tmp))
            txt='<img src="'+src_tmp+'" alt="'+alt+'" title="'+alt+'" border="0">';
          else
            txt='';
        } else if (txt.indexOf('checkbox:')>-1) {
          txt=txt.replace(/checkbox:/g,'');
          txt=txt.replace(/"/g, '\"');
          alt='';
          if(txt.indexOf(":")>-1) {
            alt=txt.substr(txt.indexOf(":")+1);
            txt=txt.substr(0,txt.indexOf(":"));
          }
          if (datasource && (datasource.getFldIdx(txt))!=-1) {
            txt=datasource.getValue(idx,txt);
          }
          var chk=this.getCheckForCheckbox(txt)
          txt="<div><div style='position:absolute;width:20px;height:20px;background:#ff0000;z-index:10;filter:alpha(opacity=0);opacity:0;'>&nbsp;</div><input type=checkbox "+(chk?"checked":"")+" disabled='disabled'  title='"+alt+"'/></div>"
        } else if (txt.indexOf('eval:')>-1) {
          txt=txt.replace(/eval:/g,'');
          txt=txt.replace(/"/g, '\"');
          txt=eval(txt);
        }else if(txt.indexOf('bar:')>-1){
          txt=txt.replace(/bar:/g,'');
          txt=ZtVWeb.fmtPctFldPct(txt,idx,datasource,rs,form,false);
          var bar_v=0,bar_from=0,bar_to=100,bar_vs=txt.split(','),bar_bg='#cccccc',bar_color='#ff0000',bar_class;
          bar_v=parseInt(bar_vs[0]);
          if(bar_vs.length>1)bar_from=parseInt(bar_vs[1]);
          if(bar_vs.length>2)bar_to=parseInt(bar_vs[2]);
          if(bar_vs.length>3)bar_bg=bar_vs[3];
          if(bar_vs.length>4)bar_color=bar_vs[4];
          if(bar_vs.length>5)bar_class=bar_vs[5];
          if(bar_v>bar_to)bar_v=bar_to;
          if(bar_v<bar_from)bar_v=bar_from;
          var bar_per=(bar_v-bar_from)*100/(bar_to-bar_from);
          txt="<div style='width:100%;"+(Empty(bar_class)?"height:12px;background:"+bar_bg+";border-radius:5px 3px 3px 5px;)' ":"' ")+(!Empty(bar_class)?"class="+bar_class:"")+"><div style='width:"+bar_per+"%;height:100%;"+(Empty(bar_class)?" background:"+bar_color+";border-radius:3px'":"' ")+"title='"+bar_per+"%'>&nbsp;</div></div>"
        }else if(txt.indexOf('combobox:')>-1){
          if(datasource){
            var fld=clearField(txt),type;
            txt=datasource.getValue(idx,fld);
            if(datasource.fieldstypearray!=null) {
              type=datasource.fieldstypearray[datasource.getFldIdx(fld)]
            }
            if(!EmptyString(picture) || type!=null){
              txt=this.applyPicture(txt,type,0,picture);
            }
          }
        }
      }else if(rs && txt in rs){
        txt=rs[txt]
        if (!EmptyString(picture)) txt=this.applyPicture(txt,type,0,picture);
        return txt;
      }else if(datasource && datasource.ToDateCurrentlyValid && txt.toLowerCase()=='cptodate' && Format(datasource.getValue(idx,txt),'DD-MM-YYYY')==datasource.ToDateCurrentlyValid){
        txt=''
      }else if(datasource){
        var fld=txt,type;
        txt=datasource.getValue(idx,fld);
        if(datasource.fieldstypearray!=null) {
          type=datasource.fieldstypearray[datasource.getFldIdx(fld)]
        }
        if(!EmptyString(picture) || type!=null){
          txt=this.applyPicture(txt,type,0,picture);
        }
      }
      return txt;
    }
    this.getCheckForCheckbox=function(val){
      if (val==false || typeof(val)=='undefined') return false;
      if (val==0) return false;
      if (val=='n' || val=='N' || val=='F' || val=='f' || val=='0' || val=='false' || val=='') return false;
      var n=parseInt(val)
      if (!isNaN(n) && n==0) return false;
      return true;
    }
    this.fmtPctFldPct=function(txt,idx,datasource,rs,form,urlenc,toJs){ //formatta i %campo%
      var notfound=false;
      if(typeof(toJs)=='undefined') {
        toJs=true;
      }
      var prev,txt_par=txt.split('%');
      for(var fldname,fldval,i=1,l=txt_par.length; i<l;/*spostato in fondo al ciclo in base se si trova il campo oppure no*/){
        notfound=false;
        prev = txt_par[ i-1 ];
        fldname=txt_par[i];
        if(Right(prev,7)=='&Popup=') {
          fldval = fldname
        } else {
          fldval = (datasource && datasource.hasField(fldname) ? datasource.getStr(idx,fldname) :
                     ( (rs && fldname in rs) ? rs[fldname] :
                       (form[fldname]?
                         form[fldname].Value():
                         (function(){notfound=true;return '';}())
                       )
                     )
                   );
          fldval = Trim(fldval.toString());
          if(toJs){ // solo per il JS
            fldval=fldval.replace(/\\/g,"\\\\")
            fldval=fldval.replace(/\'/g,"\\'")
          }
          if ( urlenc ) {
            var prevChr = Right( prev, 1 );
            /*
             Secondo la conclusione raggiunta da RAMALE, SILDAV e BOLSTE:

             1 Espressioni del tipo
              - [qualcosa]=%campo%
             allora il valore assunto da "campo" VA codificato (si assume che l'intero valore di "campo" rappresenti l'intero valore del parametro che precede il carattere =).

             2 Espressioni del tipo
              - [qualcosa]&%campo%
              - [qualcosa]?%campo%
              - [qualcosa]#%campo%
             allora il valore assunto da "campo" NON VA codificato (si assume codificato all'origine).

             3 Espressioni del tipo
              - [qualcosa]%campo%
             allora il valore assunto da "campo" VA codificato solo se NON sembra rappresentare un'url ossia se...
               INIZIA PER 'http://' o 'https://' o '../' o 'javascript:'
             oppure
              CONTIENE '?' (e/o '#' quando offline) seguito da '='

             MORALE: codifichiamo solo quando il '%campo%' e' preceduto dal carattere '=' perche' assumiamo
                     che sia il valore di un parametro da passare tramite url
            */

            if ( prevChr == '=' /* 1 */ ) {
              fldval = URLenc( fldval );
            }
          }
        }
        if(!notfound) {
          txt=Strtran(txt,'%'+fldname+'%',fldval);
          i+=2;
        } else {
          i++;
      }
      }
      return txt;
    }
    //Solo per MSIE 7
    this.resizeCtrlsBox=function(id,id_input,cnt){
      var ctrl=document.getElementById(id);
      var ctrl_input=document.getElementById(id_input);
      if(Empty(ctrl)) return;
      if(ctrl.offsetWidth==0 && ctrl.offsetHeight==0 && (cnt==null || cnt<100))
        setTimeout('ZtVWeb.resizeCtrlsBox("'+id+'","'+id_input+'",'+(cnt==null?0:cnt+1)+')',100);
      if(ctrl.offsetWidth>0 && !Empty(ctrl.style.width) && ctrl.style.width.indexOf("%")==-1 ){
        var el_style_w= parseInt(ctrl.style.width);
        var difW;
        if(ctrl_input!=null)
          difW = ctrl_input.offsetWidth - el_style_w;
        else
          difW = ctrl.offsetWidth - el_style_w;
        var newWidth = parseInt(el_style_w-difW) < 0 ? 0 : parseInt(el_style_w-difW);
        ctrl.style.width=newWidth+'px';
      }
      if(ctrl.offsetHeight>0 && !Empty(ctrl.style.height) && ctrl.style.height.indexOf("%")==-1){
        var el_style_h= parseInt(ctrl.style.height);
        var difH;
        if(ctrl_input!=null)
          difH = ctrl_input.offsetHeight - el_style_h;
        else
          difH = ctrl.offsetHeight - el_style_h;
        var newHeight = parseInt(el_style_h-difH) < 0 ? 0 : parseInt(el_style_h-difH);
        if(ctrl_input!=null)
          ctrl_input.style.height=newHeight+'px';
        else
          ctrl.style.height=newHeight+'px';
      }
    }

    //------------------------------------------------------------
    this.newForm=function(form,id,nome,w,h,class_name,offline,wizard,pageletId,steps,adaptive,title_id,fixed_top,layout_steps_values,title_block){
      StdEventSrc.call(form);
      // form.setAsEventSrc(form);
      form.addObserver('this', form);
      form.Ctrl=document.getElementById(id); // html
      form.Ctrl_container=document.getElementById(id+'_container'); // html
      form.formid=id;
      form.win_id=ZtVWeb.UID;
      form.portletname=nome;
      form.height=h;
      form.width=w;
      form.currentPage = 1;
      form.maxPageVisited=1;
      form.adaptive=adaptive;
      form.Steps=(steps?steps.split(','):[]);
      form.Step="";form.Step_old="";
      form.class_name=class_name||"portlet";
      if(form.floatingPositions) {
        form.Ctrl.style.height='';
        form.Ctrl.style.minHeight=h+'px';
        form.Ctrl.style.overflow = "hidden";
        //form.Ctrl.style.cssFloat = "left";
        //form.Ctrl.style.styleFloat = "left";
      }
      //document.getElementById(id+'_ext').style.width='1024px';
      form.offline=offline;
      form.wizard=wizard;
      form.fixed_top=(fixed_top?fixed_top:'false');
      form.title_block=title_block||false;
      form.pageletId=pageletId;
      form.layout_steps_values=layout_steps_values;
      form.ctrls=new Array() // contiene tutti gli oggetti control
      form.ctrls.pages = [];
      if ( window[id+'_tabstrip'] ) {
        var child, re=new RegExp(form.formid+'_page_(\\d+)'),match, pages;
        for (var ii=form.Ctrl.children.length-1; ii>=0; ii--) {
          if ( ( child = form.Ctrl.children[ii] ).id && ( match = child.id.match(re) ) ) {
             pages = parseInt( match[1], 10 );
             for (var kk=0;kk<pages;kk++) {
               form.ctrls.pages.push({});
             }
            break;
          }
        }
      } else {
        form.ctrls.pages.push({});
      }

      form.getPagelet = function(){
        if(this.pageletId)
          return ZtVWeb.getPageletById(this.pageletId);
        return null;
      }

      form.getPortlet = function(name_portlet){
        return ZtVWeb.getPortlet(name_portlet);
      }

      form.hideTitle = function(){
        document.getElementById(this.getTitlePortletId()+"_title_container").style.display = "none" ;
        if (form.title_block)
          form.ResetTitleOnTop();
      }

      form.showTitle = function(){
        document.getElementById(this.getTitlePortletId()+"_title_container").style.display = "" ;
        if (form.title_block)
          form.FixTitleOnTop();
      }

      form.editHTML = function(ctrlname){
        window.open(ZtVWeb.SPWebRootURL+"/pageeditor/index.jsp?t=1&ctrl="+ctrlname+"&name="+form.portletname, "htmleditor", "status=no,toolbar=no,menubar=no,location=no");
      }
      form.queuedAdjustWidthAndHeight=null
      form.queueAdjustHeight=function(ms){
        clearTimeout(form.queuedAdjustWidthAndHeight);
        //this.queuedAdjustHeight=setTimeout("try{"+this.formid+".adjustHeight()}catch(e){console.log(e)};",(ms==null?200:ms));
        this.queuedAdjustWidthAndHeight=setTimeout(this.formid+".adjustHeight();"+this.formid+".adjustWidth();"+this.formid+".refreshForm();",(ms==null?200:ms));
      }
      form.setFormStep=function(bFromResize){
        if(form.Steps.length==0) return;
        form.Steps=form.Steps.sort(function(a,b){
          if(parseInt(a)>parseInt(b))
            return 1;
          else if(parseInt(a)==parseInt(b))
            return 0;
          else
            return -1;
          //return parseInt(a)>parseInt(b);
        });
        var pw=this.Ctrl_container.offsetWidth;
        var step = LibJavascript.Array.indexOf(form.Steps, pw, function(el){
          return ( pw < parseInt(el) );
        })-1;
        if(step==-2) step=form.Steps.length-1; // se non trova niente sei nello step oltre il piu grande
        if(step==-1) step=0;
        this.Step=form.Steps[step];
        if(this.Step_old!=this.Step){
          //nuova impostazione degli Steps con l'attributo nello Style
          this.Ctrl.setAttribute("Data-step",form.Steps[step]);
          this.setCtrlsStepPos(step,bFromResize);
          this.Step_old=this.Step;
          this.dispatchEvent("StepChanged",this.Step);
          if(!bFromResize)
            this.queueAdjustHeight(50);
        }
      }
      /* Metodo al cambio di step delle dimensioni */
      form.setCtrlsStepPos=function(step,bFromResize){
        var Step=this.Steps[step];
        var formLayoutStep=(this.layout_steps_values?JSON.parse(this.layout_steps_values):{})[Step];
        this.height = formLayoutStep && typeof(formLayoutStep.h)!='undefined'?parseInt(formLayoutStep.h) :this.height;

        this.width = parseInt(Step);
        var fw_tmp = (formLayoutStep && typeof(formLayoutStep.w)!='undefined')?formLayoutStep.w : null;
        if (fw_tmp!=null && fw_tmp.indexOf('%')) {
          fw_tmp=Strtran(fw_tmp,"%","");
          this.width = this.width*parseInt(fw_tmp)/100;
        } else if (fw_tmp!=null && !isNaN(parseInt(fw_tmp))) {
          this.width = parseInt(fw_tmp);
        }
        for(var i=0;i<this.ctrls.length;i++){
          var ctrl=this.ctrls[i];
          if(ctrl.layout_steps_values && Object.keys(ctrl.layout_steps_values).length>0){
            if(!ctrl.layout_steps_values[Step]) step=0;//faccio vedere il default
            if(ctrl.layout_steps_values[Step]){
              var Ctrl_tmp=(!ctrl.GetCtrl?ctrl.Ctrl:ctrl.GetCtrl());
              var noInlineStyle =(Empty(Ctrl_tmp.style.left) && Empty(Ctrl_tmp.style.right));//il ctrl ha tutto nello <style>
              ctrl.setCtrlPos(Ctrl_tmp,ctrl.layout_steps_values[Step].x,ctrl.layout_steps_values[Step].y,ctrl.layout_steps_values[Step].w,ctrl.layout_steps_values[Step].h,ctrl.layout_steps_values[Step].anchor,this.width,this.height,bFromResize,noInlineStyle);
            }
          }
          //metodo generico se presente nel ctrl
          if(ctrl.setCtrlStep && ctrl.layout_steps_values[Step])
            ctrl.setCtrlStep(ctrl.layout_steps_values[Step]);
        }
      }
      /* Metodo chiamato per ridisegnare il form:
       *   in caso di cambio ti tab con contenuto gia caricato
      */
      form.refreshForm=function(){
        for(var i=0;i<this.ctrls.length;i++){
          var ctrl=this.ctrls[i];
          if(form.ctrls.pages[form.currentPage-1] && form.ctrls.pages[form.currentPage-1][i]===true){
            if( ctrl._refresh )
              ctrl._refresh();
          }
        }
      }

      form.adjustHeight=function() {
        if(form.floatingPositions || fixed_top=='true'){
          if(this.Ctrl!=null && this.Ctrl.style['opacity']==0.001)this.Ctrl.style['opacity']=1;
          if(window.ztvwoptrk)ztvwoptrk();
          return;
        }//Se i ctrs sono generati in float non avviene la resize
        if (!form.Ctrl || form.Ctrl.offsetHeight==0){
          if(this.Ctrl!=null && this.Ctrl.style['opacity']==0.001)this.Ctrl.style['opacity']=1;
          return;
        }//se il portlet e' nascosto non ricalcolo la sua altezza
        if ( window[id+'_tabstrip'] ) {
          var child, re=new RegExp(form.formid+'_page_(\\d+)'),match, pages;
          for (var ii=0; ii<form.Ctrl.children.length; ii++) {
            if ( ( child = form.Ctrl.children[ii] ).id && ( match = child.id.match(re) ) && child.style.display!='none') {
               form.currentPage = parseInt( match[1], 10 );
              break;
            }
          }
        }
        // trovo le bande
        var bande=[],rh,i,j;
        var oldOffsetHeight=this.Ctrl.offsetHeight;
        for(i=0;i<form.ctrls.length;i++){ //sposta tutti gli elementi al di sotto
          if (form.ctrls.pages[form.currentPage-1] && form.ctrls.pages[form.currentPage-1][i]===true) {
            var ctl=form.ctrls[i];
            if (ctl.getRenderHeight && ctl.getRenderHeight!=null  && (rh=ctl.getRenderHeight())!=null && ctl.Ctrl.style.position!='relative'){
              var ctl_b=ctl.topposition+ctl.controlheight;
              var ctl_d=rh-ctl.controlheight;
              bande.push({top:ctl.topposition,bottom:ctl_b,delta:ctl_d,delta_eff:0,eccesso:0,shrinkable:((ctl.shrinkable && ctl.shrinkable=='true')?true:false)});
            }
          }
        }
        // sorto le bande
        bande.sort( function(a,b){ return a.bottom - b.bottom;} );
        /* per ogni banda:
        *   delta: differenza tra altezza disegnata e altezza renderizzata
        *   eccesso: lo scostamento dovuto alle bande precedenti in caso di bande intersecanti
        *   scostamento: la variazione che dovuta alla differenza di altezza della banda corrente tenendo conto delle variazioni
        *     delle bande precedenti
        *   delta_eff: il rimensionamento finale che subitra' il portlet che viene modificato dalla singola banda
        */
        var current, next, delta, eccesso, scostamento;
        for(i=0;i<bande.length;i++){
          current = bande[i];
          delta = current.delta;
          eccesso = current.eccesso;
          scostamento = ((!current.shrinkable && delta<eccesso) ? 0 : delta-eccesso);
          current.delta_eff = current.delta_eff + scostamento;
          for( j=i+1; j<bande.length; j++){
            next = bande[j];
            next.delta_eff=current.delta_eff; // aggiunge il delta della banda corrente a tutte le bande che seguono
            /* controllo sei le due bande si intersecano:
            *  essendo bande ordinato per bottom, basta controllare che il top della banda
            *  successiva sia minore del bottom della banda corrente ( il bottom della banda successiva
            *  sara' minore del bottom della banda corrente).
            */
            if ( next.top < current.bottom ) {
              /* se c'e' intersezione e devo fare una contrazione il delta effettivo deve essere il minore  */
              if( next.delta >= 0 || next.delta > scostamento) {
                /* se la banda intersecante cresce oppure
                  si contrae meno rispetto della banda corrente
                */
                next.eccesso += scostamento; // aggiunge il delta in eccesso
              }else {
                /* la banda intersecante si contrae maggiormente rispetto alla banda corrente
                  quindi bisogna mantenere lo scostamento della banda precedente:
                  il prossimo ciclo lo scostamento dovuto a questa banda sara' 0
                */
                next.eccesso= next.delta;
              }
            }
          }
        }
        // li riposiziono, cercando tutti quelli piu' in alto che si sono spostati
        for(i=0;i<form.ctrls.length;i++){
          if (form.ctrls.pages[form.currentPage-1] && form.ctrls.pages[form.currentPage-1][i]===true) {
            var ctl_tmp=form.ctrls[i],ctl_html_tmp
            if(typeof(ctl_tmp.topposition)!='undefined'){
              for (j=bande.length-1;j>=0;j--){
                if (bande[j].bottom<=ctl_tmp.topposition)
                  break;
              }
              if(ctl_tmp.anchor.indexOf("bottom")==-1){
                if(ctl_tmp.GetCtrl)
                  ctl_html_tmp=ctl_tmp.GetCtrl();
                else
                  ctl_html_tmp=ctl_tmp.Ctrl;
                ctl_html_tmp.style.top=ctl_tmp.topposition+(j>=0?bande[j].delta_eff:0)+'px';
              }
            }
          }
        }
        if(this.Ctrl.style.height!='100%'){
          this.Ctrl.style.height=(this.height+((bande.length>0)?bande[bande.length-1].delta_eff:0))+'px';
          if (this.__contentPortlet)
            this.__contentPortlet.adjustTitleMargin();
        }
        if(this.Ctrl.parentNode.id.indexOf("_content")>-1 && this.Ctrl.parentNode.style.height!="") {
          var tabStripHeight = (document.getElementById(this.formid+"_tabcontainer")?document.getElementById(this.formid+"_tabcontainer").offsetHeight:0);
          var titleHeight = (this.isPortletTitled() ? document.getElementById(this.getTitlePortletId()+"_title_container").offsetHeight : 0);
          this.Ctrl.parentNode.style.height=(this.Ctrl.offsetHeight+tabStripHeight+titleHeight)+'px';
        }
        if(oldOffsetHeight!=this.Ctrl.offsetHeight){ //se cambia l'altezza di un form deve far ripartire i calcoli di tutti i portlet
          var pp=ZtVWeb.getParentPortlet(form.formid)
          if(pp!=null && pp.queueAdjustHeight) pp.queueAdjustHeight(50);
        }
        if(this.Ctrl!=null && this.Ctrl.style['opacity']==0.001)this.Ctrl.style['opacity']=1;
        if(window.ztvwoptrk)ztvwoptrk();
        this.AdjustContainer()
        if( ZtVWeb.IsMobile() ){
          var mobileIcons = document.getElementsByClassName("mobileIco");
          for( var i=0; i< mobileIcons.length; i++){
            var innerDiv;
            if( LibJavascript.CssClassNameUtils.getElementsByClassName("touchEffect_off",mobileIcons[i]).length == 0 ){
              innerDiv = document.createElement("div");
              innerDiv.setAttribute('class',"touchEffect_off");
              innerDiv.setAttribute('ontouchstart',"this.className = 'touchEffect_on';");
              innerDiv.setAttribute('ontouchend',"this.className = 'touchEffect_delay touchEffect_off';");
              mobileIcons[i].appendChild( innerDiv )
            }
          }
        }
      }
      form.AdjustContainer=function(){
        if (this.container) {
          this.container[this.ctrl_name+"_ctrl"].measureCtrl()
        }else
          ZtVWeb.AdjustContainer()
        // this.setFormStep();
      }
      //Parte per l'allargamento
      form.adjustWidth=function(delta,x) {
        // this.Ctrl.style.width=this.Ctrl.offsetWidth+(delta) //resize width del form
        // for(var i=0;i<form.ctrls.length;i++){
          // if (form.ctrls[i].leftposition>x && form.ctrls[i].anchor.indexOf('right')==-1){
            // form.ctrls[i].Ctrl.style.left=form.ctrls[i].Ctrl.offsetLeft+delta+'px'
          // }
        // }
        for(i=0;i<form.ctrls.length;i++){ //sposta tutti gli elementi al di sotto
          var ctl=form.ctrls[i];
          if (ctl.resizeCtrl && ctl.resizeCtrl!=null) ctl.resizeCtrl();
        }
      }
      form.setContainer=function(container,ctrl_name){
        if(IsAny(container))
          form.container=container;
        if(IsAny(ctrl_name))
          form.ctrl_name=ctrl_name;
      }
      form.raiseEvent=function(){
        var args=arguments;
        var name_event=args[0];
        var newArgs=new Array(args.length-1);
        for (var i=1;i<args.length;i++)
          newArgs[i-1]=args[i];
        form.raiseEventD(name_event,newArgs)
      }
      form.raiseEventD=function(){
        var args=arguments;
        var name_event=args[0];
        var pageletId=args[2];
        var broadcast=args[3];
        if(form.container && name_event){
          if(form.container[form.ctrl_name+'_'+name_event]){
            form.container[form.ctrl_name+'_'+name_event].apply(form.container,args[1]);
          }
        }
        ZtVWeb.raiseEvent(name_event,args[1],null,null,pageletId,broadcast);
      }
      form.raiseCaptionChange=function(caption, callback) {
        ZtVWeb.raiseCaptionChange(caption, callback);
      }
      form.raiseStatusChange=function(status, callback) {
         ZtVWeb.raiseStatusChange(status, callback);
      }
      form.PageOpened=function(name){
        form.currentPage=Strtran(name,'page','');
        form.maxPageVisited=(form.currentPage>form.maxPageVisited?form.currentPage:form.maxPageVisited);

      }
      form.CurrentPage=function(){
        return form.currentPage;
      }
      form.EnablePage=function(n){
        var disable=false;
        if(form.wizard){
          if( form.currentPage ==(n-1)){ //abilita il successivo
            form.ZtTabs.SetDisable('page'+(n),false);
          }else{
            if(form.maxPageVisited < (n-1)){ // Disabilita sempre i tab successivi n+2
            //if(form.currentPage <(n-1)){ // Disabilita sempre i tab successivi n+2
            //if(n>1 && form.ZtTabs.IsDisabled(n-1)){ // Disabilita i tab successivo se il precedente è disabilitato
              disable=true;
              form.ZtTabs.SetDisable('page'+(n),true);
            }
          }
        }
        if( form['this_EnablePage'+n] ) { //se e' definita this_EnablePageX nel portlet abilita o disabilita il tab X
          if( !form['this_EnablePage'+n]()){
            form.ZtTabs.SetDisable('page'+(n),true);
            form.maxPageVisited=n-1;
            disable=true;
          }else{
            if(!disable)
              form.ZtTabs.SetDisable('page'+(n),false);
          }
        }
        /* Abilitazione dei pushbutton con type_wizard forward o back */
        if(form.wizard && form.currentPage == (n-1) ){
          for(i=0;i<form.ctrls.length;i++){
            if (form.ctrls.pages[form.currentPage-1] && form.ctrls.pages[form.currentPage-1][i]===true) {
              var ctl=form.ctrls[i];
              if(ctl instanceof ZtVWeb.PushBtnCtrl && ctl.type_wizard == "forward" ){
                if( disable ){
                  ctl.Disabled();
                } else {
                  ctl.Enabled();
                }
              }
            }
          }
        }
      }
      form.ValidateChangePage=function(to){
        if( form["this_ValidatePageChange"+form.currentPage] )
          return form["this_ValidatePageChange"+form.currentPage].call(form,to);
        return true;
      }
      form.ValidateCtrlsPage=function(){
        for(var i=0;i<form.ctrls.length;i++){
          if (form.ctrls.pages[form.currentPage-1] && form.ctrls.pages[form.currentPage-1][i]===true) {
            var ctl=form.ctrls[i];
            if(form[ctl.name+'_Validate'] && !form[ctl.name+'_Validate'](null,(ctl.Value?ctl.Value():null))){
              ctl.dispatchEvent('Error');
              return false;
            }
          }
        }
        return true;
      }
      form.AddCloseButtonToTitle=function(action){
        var image = window.SPTheme.CloseTitle || "../images/portalstudio_closetitle.gif";
        var target = "_blank";
        var title = "Close";
        var tooltip = "Close";
        window[this.getTitlePortletId()].AddButton(image, action, target, title, tooltip);
      }
      form.getTitlePortletId = function (){
        return form.isPortletTitled() ? this.formid + '_' + title_id : '';
      }
      form.isPortletTitled = function () {
        return !!title_id;
      }
      form.getTitlePortlet=function(){
        return ZtVWeb.getPortletById(this.getTitlePortletId())
      }
      form.__isAlive__=function(){};
      form.ZtTabs=window[id+'_tabstrip'];//eval('window.'+id+'_tabstrip');
      form.FixTitleOnTop=function(){
        var titleContainer = document.getElementById(form.getTitlePortletId()+"_title_container") ;
        if (titleContainer) {
          titleContainer.style.zIndex = '999';
          var el = document.getElementById(this.formid+"_tabcontainer");
          if (this.Ctrl_container.parentNode.tagName=='BODY') {
            if (!el) {
              el = this.Ctrl_container;
            }
            el.style.marginTop = titleContainer.offsetHeight+'px';
            titleContainer.style.top = titleContainer.getBoundingClientRect().top+'px';
            titleContainer.style.position = 'fixed';
          } else {
            var offsetTop = titleContainer.offsetHeight;
            if (el) {
              offsetTop += el.offsetHeight;
            }
            this.Ctrl_container.style.height = 'calc(100% - '+offsetTop+'px)';
            this.Ctrl_container.style.overflow = 'auto';
          }
        }
      }
      form.ResetTitleOnTop=function(){
        var titleContainer = document.getElementById(form.getTitlePortletId()+"_title_container") ;
        if (titleContainer) {
          var el = document.getElementById(this.formid+"_tabcontainer");
          if (this.Ctrl_container.parentNode.tagName=='BODY') {
            if (!el) {
              el = this.Ctrl_container;
            }
            el.style.marginTop = '';
            titleContainer.style.top = '';
            titleContainer.style.position = '';
          } else {
            this.Ctrl_container.style.height = '';
            this.Ctrl_container.style.overflow = '';
          }
        }
      }
      form.adjustTitleMargin = function() {
        var titleContainer = document.getElementById(form.getTitlePortletId() + '_title_container');
        if (titleContainer) {
          var el = document.getElementById(this.formid + '_tabcontainer');
          if (this.Ctrl_container.parentNode.tagName == 'BODY') {
            if (!el) {
              el = this.Ctrl_container;
            }
            el.style.marginTop = titleContainer.offsetHeight + 'px';
          } else {
            var offsetTop = titleContainer.offsetHeight;
            if (el) {
              offsetTop += el.offsetHeight;
            }
            this.Ctrl_container.style.height = 'calc(100% - ' + offsetTop + 'px)';
          }
        }
      }
      if (form.title_block) {
        form.FixTitleOnTop();
        if (form.isPortletTitled()){
          var p=form.getTitlePortlet();
          p.__contentPortlet=form;
        }
      }
    }
    this.LinkedList=function(){
      var head={prev:null,next:null, value: "HEAD"};
      var tail={prev:null,next:null, value: "TAIL"};
      tail.prev=head;
      head.next=tail;
      this.getLastNode=function(){
        return tail.prev;
      }
      this.getFirstNode=function(){//undefined se vuota
        var node=head.next;
        if(node==tail)
          return void(0);
        return node;
      }
      this.push=function(el){//aggiunge in coda
        var node={value:el};
        var last=this.getLastNode();
        last.next=node;
        node.prev=last;
        node.next=tail;
        tail.prev=node;
        return node;
      }
      this.remove=function(node){
        var prev=node.prev;
        var next=node.next;
        prev.next=next;
        next.prev=prev;
        return node;
      }
      this.toString=function(){
        var sequence=[];
        var curr_node=this.getFirstNode();
        while(curr_node && curr_node.next){
          sequence.push(""+curr_node.value);
          curr_node=curr_node.next;
        }
        return "["+sequence.toString()+"]";
      }
    }
    var this_LinkedList=this.LinkedList;
    this.LRUCache=function(max_size){
      var MAX_SIZE = max_size || 10;
      var size=0;
      var nodes={};
      var list=new this_LinkedList();
      this.getFirstNode=function(){
        return list.getFirstNode();
      }
      this.put=function(key, el){
        var node;
        if(key in nodes){
          node=nodes[key];
          list.remove(node);
        }else{
          if(size<MAX_SIZE){
            size++;
          }else{
            delete nodes[list.remove(list.getFirstNode()).key];
          }
        }
        nodes[key]=list.push(el);
        nodes[key].key=key;
      }
      this.remove=function(key){
        var node=nodes[key];
        if(!node)
          return void(0);
        list.remove(node);
        delete nodes[key];
        size--;
        return node.value;
      }
      this.toString=function(){
        var all_keys=[];
        for(var k in nodes){
          all_keys.push(k);
        }
        return "{size: "+size+", keys: ["+all_keys+"], list: "+list.toString()+"}"
      }
      this.removeAll=function(){
        for(var k in nodes){
          this.remove(k);
        }
      }
    }
    var eventsCache=new this.LRUCache(50);//default 50
    this.raiseEventToEvalParms=function(name_event,parms,force,caller_id){
      this.raiseEvent(name_event,eval(parms),force,caller_id);
    }
    this.raiseEvent=function(name_event,parms,force,caller_id,pageletId,broadcast){
      caller_id=caller_id||ZtVWeb.UID;
      if(this.isInContainer()){
        parent.ZtVWeb.raiseEvent(name_event,parms,force,caller_id,pageletId,broadcast);
      }else{
        if(ZtVWeb.isLoading( pageletId ) && !force){
          eventBufferLoading.push([name_event,parms,caller_id,pageletId,broadcast]);
        }else{
          eventsCache.put(name_event,[name_event,parms,caller_id]);
          var portlets=ZtVWeb.getPortletsById();
          for(var pname in portlets){
            if('win_id' in portlets[pname]){ // è un portlet
              //if(broadcast!='pagelet' || portlets[pname].pageletId==pageletId)//se c'è il pageletId deve appartenere alla stessa pagelet
              if(broadcast!='pagelet' || ZtVWeb.POM.isDescendantOf( portlets[pname].formid, pageletId ))//se c'è il pageletId deve appartenere alla stessa pagelet
                ZtVWeb.raiseEventSinglePortlet(portlets[pname],pname,name_event,parms);
              else
                continue;
            }else // ce ne sono piu di uno quindi c'è l oggetto
              for(var r in portlets[pname]){
                ZtVWeb.raiseEventSinglePortlet(portlets[pname][r],pname,name_event,parms);
              }
          }
          var pagelets=ZtVWeb.getPageletsIds();
          LibJavascript.Array.forEach(pagelets,function(pagid){
            ZtVWeb.raiseEventPagelet(ZtVWeb.getPageletById(pagid),pagid,name_event,parms);
          },this);
        }
      }
    }
    this.raiseEventSinglePortlet=function(portlet,pname,name_event,parms){
      var func
      if(func=(portlet && portlet["on_"+name_event])){
        var portletStillAlive=true;
        try{
          portlet.__isAlive__();
        }catch(e){portletStillAlive=false;}
        if(portletStillAlive)
          func.call(portlet,parms);
        else
          ZtVWeb.removePortletId(pname);
      }
    }
    this.raiseEventPagelet=function(pagelet,pname,name_event,parms){
      var func
      if(func=pagelet["on_"+name_event]){
        var pageletStillAlive=true;
        try{
          pagelet.__isAlive__();
        }catch(e){pageletStillAlive=false;}
        if(pageletStillAlive)
          func.apply(pagelet,parms);
        else
          ZtVWeb.removePagelet(pname);
      }
    }
    this.purgeEventsCache=function(caller_id){
      caller_id=caller_id||ZtVWeb.UID;
      if(this.isInContainer()){
        (( window.frameElement && ( window.frameElement.ownerDocument.defaultView || window.frameElement.ownerDocument.parentWindow )) /*IE + WebKit*/
          || window.parent /*FF*/
        ).ZtVWeb.purgeEventsCache(caller_id);
      }else{
        var cacheNode=eventsCache.getFirstNode();
        var next;
        while(cacheNode && cacheNode.next){
          next=cacheNode.next;
          if(caller_id==cacheNode.value[2]){
            eventsCache.remove(cacheNode.value[0]);
          }
          cacheNode=next;
        }
      }
    }
    this.raiseCaptionChange=function(caption, callback,w) {
      w = w || window;
      var isInModalLayer;
      try {
        isInModalLayer = !!(w.frameElement && w.parent.spModalLayer && w.parent.spModalLayer[w.frameElement.id]);
      } catch (e) {isInModalLayer=false;}
      var captionChanged = false;
      var rccuid = LibJavascript.AlfaKeyGen(10);
      var foo = function(){
        if( callback )
          callback.call();
        ZtVWeb.purgeEventsCache(rccuid);
        captionChanged = true;
      }
      this.raiseEvent("caption_change", [caption, foo, isInModalLayer, isInModalLayer ? w.parent.spModalLayer[w.frameElement.id] : null ],null,rccuid);
      return captionChanged;
    }
    this.raiseStatusChange=function(status, callback, w) {
      w = w || window;
      var isInModalLayer;
      try {
        isInModalLayer = !!(w.frameElement && w.parent.spModalLayer && w.parent.spModalLayer[w.frameElement.id]);
      } catch (e) {isInModalLayer=false;}
      var statusChanged = false;
      var rccuid = LibJavascript.AlfaKeyGen(10);
      var foo = function(){
        if( callback )
          callback.call();
        ZtVWeb.purgeEventsCache(rccuid);
        statusChanged = true;
      }
      this.raiseEvent("status_change", [status, foo, isInModalLayer, isInModalLayer ? w.parent.spModalLayer[w.frameElement.id] : null ],null,rccuid);
      return statusChanged;
    }
    this.portletLoaded=function(portlet,pname,fromParent){
      if( !fromParent && ! Empty( portlet.pageletId ) && this.portletIncludedLoaded ){
        this.portletIncludedLoaded(pname,portlet.pageletId,portlet.formid,window);
      }
      if(this.isInContainer()){
        parent.ZtVWeb.portletLoaded(portlet,pname,true);
      }else {
        portlet.dispatchEvent('Loaded');
      }
      var cacheNode=eventsCache.getFirstNode();
      while(cacheNode && cacheNode.next){
        ZtVWeb.raiseEventSinglePortlet(portlet,pname,cacheNode.value[0],cacheNode.value[1]);
        cacheNode=cacheNode.next;
      }
      if (portlet.setFormStep)
        portlet.setFormStep();
      portlet.queueAdjustHeight(50);
      this.DragDropHtml5.initEvents(portlet.formid);
    }
    this.this_StepChanged=function(){
      throw new Error('Shouldn\'t be called....');
      if (portlet.setFormStep)
        portlet.setFormStep();
      portlet.queueAdjustHeight(50);
    }

    this.DragDropHtml5= new function(){
      var fromEle=null;
      var fromCtrl=null;
      var dragIcon=null;
      var dragStart=function(event){
        this.addEventListener("dragend", dragEnd, false);
        event.dataTransfer.effectAllowed='copy';
        fromEle=GetEventSrcElement(event);
        fromCtrl=getContainerFromItem(event);
        //Html visibile durante il drag
        var form=window[fromCtrl.getAttribute("formid")]
        if(event.dataTransfer.setDragImage && form.setDragHTML){
          dragIcon=form.setDragHTML();
          dragIcon.style.position='absolute';
          dragIcon.style.left='-1000px';
          document.body.appendChild(dragIcon);
          if(event.dataTransfer.setDragImage)
            event.dataTransfer.setDragImage(dragIcon, -10, -10);
          // else
          //   document.body.appendChild(dragIcon);
        }
        var ctrl_drag = window[fromCtrl.getAttribute("formid")][fromCtrl.getAttribute("ps-name")];
        var obj = ctrl_drag.getDragObj();
        obj['data-transfer']=fromCtrl.getAttribute("data-transfer");
        // if(event.dataTransfer.items && event.dataTransfer.items.length==0) //Chrome, Ie Edge in poi
          // event.dataTransfer.items.add(JSON.stringify(obj),'text/plain');
        // else
        event.dataTransfer.setData('text',JSON.stringify(obj));
      }
      var dragEnd=function(event){
        var drag_item=getContainerFromItem(event);
        var ctrl_drag = window[drag_item.getAttribute("formid")][drag_item.getAttribute("ps-name")] ;
        ctrl_drag.DragCancel();
        //if(dragIcon!=null && event.dataTransfer.setDragImage) event.dataTransfer.setDragImage("");
        if(dragIcon!=null) {
          dragIcon.parentNode.removeChild(dragIcon);
          dragIcon=null;
        }
      }
      var dropHandler=function(event){
        //Elimino l'evento di drag end in quanto ha fatto il drop
        fromEle.removeEventListener("dragend", dragEnd);
        doNothing(event);
        if(checkDataTransferName(event)){
          if(event.dataTransfer.items && event.dataTransfer.items.length>0){
          //var drag_attribute = event.dataTransfer.getData('text');
            event.dataTransfer.items[0].getAsString(function(s){
              getTransferData(event,s);
            });
          }else{
            var drag_attribute = event.dataTransfer.getData('text');
            getTransferData(event,drag_attribute);
          }
        }
        //if(dragIcon!=null && event.dataTransfer.setDragImage) event.dataTransfer.setDragImage("");
        if(dragIcon!=null) {
          dragIcon.parentNode.removeChild(dragIcon);
          dragIcon=null;
        }
      }
      var getContainerFromItem=function(event){
        var item = GetEventSrcElement(event);
        while(!item.getAttribute("formid") && !item.getAttribute("ps-name") && item.tagName.toLowerCase() != 'body'){
          item = item.parentNode;
        }
        return item;
      }
      var getTransferData=function(event,s){
        var j =JSON.parse(s);
        var  target;
        var drop_target = GetEventSrcElement(event);
        while( !drop_target.getAttribute("data-transfer-accept") )
          drop_target = drop_target.parentNode;
        target = drop_target;
        while(!target.getAttribute("formid") && !target.getAttribute("ps-name") && target.tagName.toLowerCase() != 'body'){
          target = target.parentNode;
          if(target==null)return;
        }
        var ctrl_drop = window[target.getAttribute("formid")][target.getAttribute("ps-name")] ;
        //var ctrl_drag = window[j.formid][j['ps-name']];
        ctrl_drop.Drop(j,drop_target);
      }
      var checkDataTransferName=function(event){
        if(fromCtrl) {
          var fromName=fromCtrl.getAttribute("data-transfer");
          var target = GetEventSrcElement(event);
          while( !target.getAttribute("data-transfer-accept") )
            target = target.parentNode;
          var accept = target.getAttribute("data-transfer-accept");
          return fromName == accept;
        }
        return false;
      }
      // Prevents the event from continuing so our handlers can process the event.
      var doNothing=function(event){
        if(event.stopPropagation){
          //event.stopPropagation();
          event.preventDefault();
        }else{
         // event.cancelBubble=true
          event.returnValue=false;
        }
      }
      var dragOver=function(event){
        doNothing(event);
        if(!checkDataTransferName(event)){
          event.dataTransfer.dropEffect='none';
        }
      }
      var dragLeave=function(event){
        var item=getContainerFromItem(event);
        var ctrl_drop = window[item.getAttribute("formid")][item.getAttribute("ps-name")] ;
        ctrl_drop.DragLeave(event.srcElement);
      }
      var dragEnter=function(event){
        var item=getContainerFromItem(event);
        var ctrl_drop = window[item.getAttribute("formid")][item.getAttribute("ps-name")] ;
        ctrl_drop.DragEnter(event.srcElement);
      }

      this.initEvents=function(ctrl_id){
        var drags = document.querySelectorAll((!Empty(ctrl_id) ? "#"+ctrl_id : "" )+" [draggable=true]");
        [].forEach.call( drags, function(it){
          it.removeEventListener("dragstart", dragStart, false);
          it.addEventListener("dragstart", dragStart, false);
        });
        var drops= document.querySelectorAll((!Empty(ctrl_id) ? "#"+ctrl_id : "" )+" [data-transfer-accept]");
        [].forEach.call( drops,  function(it){
          it.removeEventListener("drop", dropHandler);
          it.addEventListener("drop", dropHandler, false);
          it.removeEventListener("dragover", dragOver);
          it.addEventListener("dragover", dragOver, false);
          it.removeEventListener("dragenter", dragEnter);
          it.addEventListener("dragenter", dragEnter, false);
          it.removeEventListener("dragleave", dragLeave);
          it.addEventListener("dragleave", dragLeave, false);
        });
      }
    }
    var eventBufferLoading=[];
    this.FinalDispatchEvents=function(){
      var name_event,parms,force=true,caller_id,pageletId,broadcast;
      for(var i=0, func,buff_el;i<eventBufferLoading.length;i++){
        buff_el=eventBufferLoading[i];
        name_event = buff_el[0];
        parms = buff_el[1];
        caller_id = buff_el[2];
        pageletId = buff_el[3];
        broadcast = buff_el[4];
        ZtVWeb.raiseEvent(name_event,parms,force,caller_id,pageletId,broadcast);
      }
      eventBufferLoading=[];
    };
    this.IsSQLDataProvider=function(ds) {
      return ds instanceof ZtVWeb.SQLDataProvider;
    }
    function StdEventSrc () {
      this.setAsEventSrc=function(obj){
        if(obj){
          this._evtobservers=[];
        }
      }
      this.addObserver=function(prefix,listener){
        if( listener ) {
          this._evtobservers.push({'obj':listener, 'prefix':prefix+'_'});
          if(listener==this.form && prefix==this.name) this._defaultFormListenerAdded=true;
        }
      }
      this.dispatchEvent=function(evtName){
        if(!this._defaultFormListenerAdded && this.form && this.name){
          this.addObserver(this.name, this.form);
          this._defaultFormListenerAdded=true;
        }
        var args=[], i, l, listener;
        for(i=1,l=arguments.length; i<l; args.push(arguments[i++]));
        var listeners=this._evtobservers, fnc=null, managed=false;
        for(i=0; listener=listeners[i++];){
          fnc=listener.obj[listener.prefix+evtName];
          if(fnc){
            fnc.apply(listener.obj,args);
            managed = true;
          }
        }
        return managed;
      }
      this._evtobservers=[];
    }
    this.StdEventSrc = StdEventSrc;
    this.HideCtrl=function(cond,c){if(c!=null){if(cond){c.Hide();}else{c.Show();}}}
    this.EditCtrl=function(cond,c){if(c!=null){if(cond){c.Enabled();}else{c.Disabled();}}}
    this.CalcCtrl=function(cal,c){if(c!=null){if(c.Set){c.Set(cal);}else{c.Value(cal);}}}
    this.InitCtrl=function(init,c){if(c!=null){if(c.Init){c.Init(init);}}}
    this.StdControl=function() {
      //Posizionamento col lo style inline
      this.setCtrlPos=function(ctrl,x,y,w,h,anchor,fw,fh,bFromResize,noInlineStyle){
        if(ctrl==null) return;
        this.ctrl=ctrl;
        var style = ctrl.style;
        this.topposition=y;
        this.leftposition=x;
        this.controlwidth=w;
        this.controlheight=(h==null?this.h:h);
        this.minheight=(this.shrinkable=='true'?'':( h==null?this.minheight:h));//imposto qui la minheight per gli step
        this.anchor=(anchor==null?'':anchor);
        if(anchor == "top-right-bottom-left") {this.anchor='';}
        LibJavascript.CssClassNameUtils.addClass(this.ctrl,this.name+'_ctrl');
        if(this.form.floatingPositions){
          if(noInlineStyle) return;
          //Posizionamento Float
          var name=(this.name?this.name:ctrl.id.substr(ctrl.id.indexOf("_")+1,ctrl.id.length));
          //La generazioen float non è compatibile con lo stretch dell'anchor
          if(this.anchor == "top-left-right"){
              style.display= "block";
              style.cssFloat = "none";
              style.styleFloat = "none";
              style.width = null;
              style.marginRight = parseInt(fw-x-w)+"px";
          }else{
              style.position="static";
              style.cssFloat = "left";
              style.styleFloat = "left";
          }
          var ctrlFloatProps = this.form.floatingPositions[name];
          if(ctrlFloatProps['c'] || ctrlFloatProps['clearBoth'])
            style.clear ="both";
          style.marginLeft =(ctrlFloatProps['marginLeft']?ctrlFloatProps['marginLeft']:ctrlFloatProps['l'])+'px';
          style.marginTop =(ctrlFloatProps['marginTop']?ctrlFloatProps['marginTop']:ctrlFloatProps['t'])+'px';
          if(ctrlFloatProps['b'] || ctrlFloatProps['marginBottom'])
            style.marginBottom =(ctrlFloatProps['marginBottom']?ctrlFloatProps['marginBottom']:ctrlFloatProps['b'])+'px';
          if(EmptyString(this.anchor)){
            this.anchor='top-left';
          }
          if (w!=null && (this.anchor.indexOf('right')==-1 || this.anchor.indexOf('left')==-1)) style.width=w+((""+w).indexOf("%")>-1?'':'px');
          if (h!=null && (this.anchor.indexOf('top')==-1 || this.anchor.indexOf('bottom')==-1)) {
            if(ctrlFloatProps['e']){
              style.height='';style.minHeight=h+'px';
            } else {
              style.height=h+'px';
            }
          }
        }else{
          //Posizinamento classico
          //Aggiungo le transition
          if(bFromResize && this.form.Steps.length>0){
            style.transition = "all 0.2s";
          }
          if(noInlineStyle) return;
          if(x==null || y==null){ //passando le coordinate null, l'elemento diventa relative
            x=0;y=0;
            style.position='relative';
          }
          else
            style.position='absolute';
          // this.topposition=y;
          // this.leftposition=x;
          // this.controlwidth=w;
          // this.controlheight=h;
          // setta la posizione di un control
          style.top='';style.left='';
          style.width='auto';
          style.height='';
          if(style.display!='none')style.display = "inline-block";
          if(EmptyString(this.anchor)){
            if(this.form.adaptive=='adaptive')
              this.anchor='top-left(%)-right(%)';
            else
            this.anchor='top-left'
          }
          if (this.anchor.indexOf('top')!=-1) style.top=(y)+'px';
          if (this.anchor.indexOf('left')!=-1) style.left=(x)+'px';
          if (this.anchor.indexOf('left(%)')!=-1) style.left=(x*100/fw)+'%';
          if (this.anchor.indexOf('right')!=-1) style.right=(fw-x-w)+'px';
          if (this.anchor.indexOf('right(%)')!=-1) style.right=((fw-x-w)*100/fw)+'%';
          if (this.anchor.indexOf('bottom')!=-1){(h==null?h=ctrl.offsetHeight:h);style.bottom=(fh-y-h)+'px';}
          if (this.anchor.indexOf('center')!=-1){style.left='50%';style.marginLeft=(x-w/2)+'px';}
          if (w!=null && (this.anchor.indexOf('right')==-1 || this.anchor.indexOf('left')==-1)) style.width=w+((""+w).indexOf("%")>-1?'':'px');
          if (h!=null && (this.anchor.indexOf('top')==-1 || this.anchor.indexOf('bottom')==-1)) style.height=h+'px';
          if(navigator.appVersion.indexOf("MSIE 7")>-1 && document.compatMode!="BackCompat"){
            ZtVWeb.resizeCtrlsBox(ctrl.id);
          }
        }
        //Per DocType Transitional
        style.WebkitBoxSizing = style.MozBoxSizing = style.boxSizing = "border-box";
      }
      //Nuovo metodo nel caso di generazione dei posizionamenti nello <Style>
      this.setCtrlVars=function(x,y,w,h,anchor){
        this.anchor=anchor;
        this.topposition=y;
        this.leftposition=x;
        this.controlwidth=w;
        this.controlheight=h;
      }
      this.setCtrlStdMethods=function(ctrl,ctrlHtml){
        // aggiunge al control i metodi standard
        this._setCtrlStdMethods(ctrl,ctrlHtml)
        // ctrl.setAsEventSrc(this);
      }
      this._setCtrlStdMethods=function(ctrl,ctrlHtml){
        var Ctrl=ctrlHtml;
        if(ctrlHtml==null) Ctrl=this.Ctrl;
        ctrl.SetFocus=function(){Ctrl.focus();}
        ctrl.Hide=function(){Ctrl.style.visibility='hidden';Ctrl.style.display='none';if(ctrl.adjustFormHeight)ctrl.adjustFormHeight();}
        ctrl.Show=function(){Ctrl.style.visibility='visible';Ctrl.style.display='block';if(ctrl.adjustFormHeight)ctrl.adjustFormHeight();}
        ctrl.IsHidden=function(){return Ctrl.style.visibility=='hidden' || Ctrl.style.display=='none';}
        ctrl.SetFadeEffects=function(time){
          var time = time || 300;
          if ( Ctrl ){
            Ctrl.style.transition = "opacity "+time+"ms";
            ctrl.FadeIn=function(){
              if(this.FadeTimer) clearTimeout(this.FadeTimer);
              if(this.IsHidden()){
                Ctrl.style.display = "";
              }
              Ctrl.style.opacity = 1;
            };
            ctrl.FadeOut=function(callback){
              if(!this.IsHidden()){
                //var _this = this;
                Ctrl.style.opacity = 0;
                this.FadeTimer = setTimeout( function(){
                  Ctrl.style.display = "none";
                  if(callback)
                    callback.call();
                }, time);
              }
            };
          }
        }
        ctrl.Enabled=function(){Ctrl.disabled=null;}
        ctrl.Disabled=function(){Ctrl.disabled='true';}
        ctrl.Init=function(v){
           ctrl.allowOnChange=false;
           ctrl.Value(v);
           ctrl.allowOnChange=true;
        }
        ctrl.GetCtrl=function(){
          return Ctrl;
        }
      }
      this.addToForm=function(form,ctrl){
        if(form) {
          var page = 1;
          if (!form.ctrls.pages) {
            form.ctrls.pages=[{}];
          } else if (form.ctrls.pages.length>1) { //ciclo nel dom solo se ho un array con piu pagine
            var re=new RegExp(form.formid+'_page_(\\d+)'), prnt = ctrl.ctrl && ctrl.ctrl.parentNode, match;
            while (prnt && prnt!=form.Ctrl) {
              if ( prnt.tagName=='DIV' && ( match = prnt.id.match(re) ) ) {
                page = parseInt( match[1], 10 );
                break;
              }
              prnt = prnt.parentNode;
            }
          }
          var index = form.ctrls.push(ctrl);
          form.ctrls.pages[page-1][index-1]=true;
        }
        StdEventSrc.call( ctrl );
      }
      this.DraggerObj=null;


      this.getDragObj=function(){
        //in questo modo il this è l'oggetto ctrl
        if(!this.DraggerObj)
         //Oggetto drag data generico
         this.DraggerObj={'formid': this.ctrl.getAttribute("formid"),'name': this.ctrl.getAttribute('ps-name'),'value':(this.Value?this.Value():null)};
        return this.DraggerObj;
      }
      if(!this.Drop){
        this.Drop=function(j,drop_item,drag_item){
          this.dispatchEvent('Drop',j,drop_item,drag_item);
        }
      }
      if(!this.DragCancel){
        this.DragCancel=function(){
          this.dispatchEvent('DragCancel');
        }
      }
      if(!this.DragEnter){
        this.DragEnter=function(o){
          this.dispatchEvent('DragEnter',o);
        }
      }
      if(!this.DragLeave){
        this.DragLeave=function(o){
          this.dispatchEvent('DragLeave',o);
        }
      }
    }
    // this.StdControl.prototype=new this.StdEventSrc();
    this.StdControl.prototype.AddListenerToHTMLEvent=function(htmlEvent, listenerFnc, htmlCtrl){
    //Memory Leaks
      var Ctrl = htmlCtrl||this.Ctrl, fn=this.form.formid,cn=this.name;
      var prev_f = Ctrl[htmlEvent];
      var pf= "";
      if(prev_f!=null) {
        pf=prev_f.toString();
        pf=Strtran(pf,"\n","\\n");
        pf=Strtran(pf,"\"","\'");
        //pf=Strtran(pf,"\"",'\\"');
        if (pf.substr(0,9)=="function ")
          pf="var f="+pf+";f();";
      }
      Ctrl[htmlEvent]=new Function("evt","eval(\"{"+pf+
        "if(window."+fn+"."+cn+"){"+
          "window."+fn+"."+cn+".dispatchEvent('"+listenerFnc+"',evt||window.event);"+
        "}else{"+
          "setTimeout("+
            "function(){"+
              "window."+fn+"."+cn+".dispatchEvent('"+listenerFnc+"',evt||window.event);"+
            "},"+
          "0);"+
        "}}\");");
    }
    // ridimensiona l'iframe nel parent
    this.ResizeIframe=function(){
      //parent[this.iframeref].frameloaded(); //this.iframeref potrebbe essere composto da idportlet.framename
      eval('parent.'+this.iframeref+'.frameloaded()')
    }
    this.EventReceiverCtrl=function(form,name,parmsNames,objsValues,actObjs,actTypes,broadcast){
      this.name=name;
      this.form=form;
      this.broadcast = broadcast||'all';
      this.pageletId=form.pageletId;
      this.actions=(function(objs, types, values){
        var res={};
        for(var i=0, l=types.length, type, obj, val; i<l; i++){
          type=types[i];
          obj=objs[i];
          val=values[i];
          switch(type){
            case 'var':
              res[obj]=new Function("evt","this."+obj+".Value(evt."+Strtran(val,'|',',')+")");
              break;
            case 'func':
              res[obj||LibJavascript.AlfaKeyGen(10)]=new Function("evt",Strtran(val,'|',','));
              break;
            case 'dataobj':
              res[obj]=new Function("evt",'this.'+obj+'.Query();');
              break;
            case 'event':
            //res[obj]=new Function("evt",'this.raiseEvent('+obj+');');
              break;
            default:
              alert('Event receiver "'+name+'": unknown action type "'+type+'" for "'+obj+'".')
          }
        }
        return res;
      })(actObjs.split(','), actTypes.split(','), objsValues.split(','));
      this.receiveFnc=function(parmObj){
        if(broadcast=='pagelet'){
          if(this.pageletId!=parmObj.srcPageletId && !ZtVWeb.POM.isDescendantOf(parmObj.srcPageletId,this.pageletId))//se c'è il pageletId deve appartenere alla stessa pagelet
            return;
        }
        for(var obj in this.actions)
          this.actions[obj].call(this.form,parmObj);
        this.dispatchEvent("Received");
      };
      this.addToForm(this.form,this);
      // this.setAsEventSrc(this);
    }
    this.EventReceiverCtrl.prototype=new this.StdControl();
    this.EventEmitterCtrl=function(form,name,parmsNames,parmsValues,parmsTypes,eventsObjs,eventsNames,broadcast){
      this.name=name;
      this.form=form;
      this.parms={};
      this.pageletId=null;
      this.broadcast = broadcast||'all';
      this.pageletId=form.pageletId;
      this.setParms=function(){
        var res={};
        var names=Trim(parmsNames).split(','), values=parmsValues.split(','), types=parmsTypes.split(',');
        for(var i=0,type,value,toCall,ctx,name; name=names[i]; i++){
          type=types[i];
          value=values[i];
          switch(type){
            case "var":
              toCall=this.form[value].Value;
              ctx=this.form[value];
            break;
            case "dataobj":
              var dObj_fName=value.split('.');//'dataobj.fieldName'
              var dataobj=dObj_fName[0], fieldName=dObj_fName[1];
              //toCall=new Function("return this.getField('"+fieldName+"');");
              toCall=new Function("return this.rs."+fieldName);
              ctx=this.form[dataobj];
            break;
            case "func":
              toCall=new Function("return "+Strtran(value,'|',','));//foo(1|2|3)=>foo(1,2,3)
              ctx=this.form;
            break;
            case "const":
              toCall=new Function("return "+value);
              ctx=window;
            break;
          }
          res[name]={fnc:toCall, context:ctx};
        }
        this.parms=res;
      };
      this.events=(function(names,values){
        var res=[];
        for(var i=0, name; name=names[i]; i++) {
          res.push({ctrlname:name,evtname:values[i]});
        }
        return res;
      })(eventsObjs.split(','),eventsNames.split(','));
      this.addToForm(this.form,this);
      // this.setAsEventSrc(this);
      this.addObservers=function(){
        this.setParms();
        var objNames={};
        for(var i=0;i<this.events.length;i++){
          var obj = this.events[i].ctrlname;
          if (!objNames[obj]) {
            this.form[obj].addObserver(obj, this);
            objNames[obj]=true;
          }
          this[obj+'_'+this.events[i].evtname]=this.Emit;
        }
      };
      this.Emit=function(){
        var parmObj={};
        for(var prop in this.parms){
          parmObj[prop]=this.parms[prop].fnc.call(this.parms[prop].context);
        }
        if(!('srcPortletId' in parmObj) && this.form.formid) parmObj.srcPortletId = this.form.formid;
        if(!('srcPageletId' in parmObj) && this.form.pageletId) parmObj.srcPageletId = this.form.pageletId;
        this.form.raiseEventD(this.name,parmObj,this.pageletId,this.broadcast);
        //this.dispatchEvent('Emitted');
      };
    }
    this.EventEmitterCtrl.prototype=new this.StdControl();
    // Label ----------------------------------------------------------------------------------------------------------------
    this.LabelCtrl=function(form,name,ctrlid,text,x,y,w,h,font,font_size,font_color,font_weight,href,target,anchor,help_tips,picture,enable_HTML,heading,server_side,nowrap,layout_steps_values,shrinkable){
      this.x=x;
      this.y=y;
      this.w=w;
      this.h=h;
      this.form=form;
      this.href=href;
      this.name=name;
      this.picture=picture;
      this.enable_HTML=enable_HTML;
      this.text=ZtVWeb.makeStdExpr(text,this.form);
      if(!enable_HTML && !EmptyString(this.text)) this.text=ToHTML(this.text);
      this.text=ToHTag(this.text);
      if(!Empty(heading) && !Empty(this.text)) this.text = "<" + heading + ">" + this.text + "</" + heading + ">";
      this.ctrlid=ctrlid;
      this.help_tips=help_tips;
      this.Ctrl=document.getElementById(ctrlid);
      this.minheight=(this.shrinkable=='true'?'':h);
      this.lastRenderHeight=null;
      this.nowrap = nowrap || 'false';
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.shrinkable=shrinkable || 'false';
      this.adjustFormHeight=function(cnt){
        if(!(this.form.formid in window)|| window[this.form.formid].tagName=='DIV'){
        //if(typeof(eval('window.'+this.form.formid))=='undefined' || eval('window.'+this.form.formid).tagName=='DIV'){
          ZtVWeb.CheckFormExist('window.'+this.form.formid,this.name+'.adjustFormHeight');
          return;
        }
        if (this.form.Ctrl && this.form.Ctrl.offsetHeight==0 && (cnt==null || cnt<10)) {
          setTimeout('window.'+this.form.formid+'.'+this.name+'.adjustFormHeight('+(cnt==null?0:cnt+1)+')',200)
        } else {
          var oh=this.lastRenderHeight
          if (oh!=this.getRenderHeight()){
            this.form.queueAdjustHeight(50)
          }
        }
      }
      this.getRenderHeight=function(){
        if (this.Ctrl!=null){
          this.Ctrl.style.height='auto';
          var h=this.Ctrl.offsetHeight;
          this.Ctrl.style.height='';
          if(this.layout_steps_values && this.layout_steps_values[this.form.Step])
            this.minheight=this.layout_steps_values[this.form.Step].h;
          this.lastRenderHeight=( (this.shrinkable=='true' ||h>this.minheight)?h:null)
        } else {
          this.lastRenderHeight=null
        }
        return this.lastRenderHeight
      }
      if(!EmptyString(this.href))
        this.Ctrlhref=document.getElementById(this.ctrlid+'href');
      else
        this.Ctrltbl=document.getElementById(this.ctrlid+'tbl');
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,null,anchor,form.width,form.height,false,noInlineStyle);
      }
      //this.setCtrlPos(this.Ctrl,x,y,w,null,anchor,form.width,form.height,false,false);
      this._setCtrlPos(true);
      this.addToForm(this.form,this);
      if(!EmptyString(this.href)){
        if (this.text!='') {this.Ctrlhref.innerHTML=ZtVWeb.applyPicture(this.text,null,0,this.picture);this.adjustFormHeight();}
        if(Trim(target)=='') target='_self'
        this.Ctrlhref.target=target
      }else{
      if (this.text!='') {this.Ctrltbl.innerHTML=ZtVWeb.applyPicture(this.text,null,0,this.picture);this.adjustFormHeight();}
      }
      if(!EmptyString(this.href)){
        // if(!EmptyString(font)) this.Ctrlhref.style.fontFamily=font
        // if(!EmptyString(font_size)) this.Ctrlhref.style.fontSize=font_size
        // if(!EmptyString(font_color)) this.Ctrlhref.style.color=font_color
        // if(!EmptyString(font_weight)) this.Ctrlhref.style.fontWeight=font_weight
        var _this=this;
        if(target=='_blank' || target=='_new'){
          this.Ctrlhref.onclick=function(e){ZtVWeb.Popup(ZtVWeb.makeStdLink(_this.href,0,null,null,this.form,false),"",e)};
        }else
          this.Ctrlhref.href=ZtVWeb.makeStdLink(this.href,0,null,null,this.form,true);

        if(Trim(this.help_tips)!='') this.Ctrlhref.title=this.help_tips
        // if(this.nowrap=="true"){
          // this.Ctrlhref.style.whiteSpace ="nowrap";
          // this.Ctrlhref.style.overflow = "hidden";
          // this.Ctrlhref.style.textOverflow = "ellipsis";
        // }
      }else{
        // if(!EmptyString(font)) this.Ctrltbl.style.fontFamily=font
        // if(!EmptyString(font_size)) this.Ctrltbl.style.fontSize=font_size
        // if(!EmptyString(font_color)) this.Ctrltbl.style.color=font_color
        // if(!EmptyString(font_weight)) this.Ctrltbl.style.fontWeight=font_weight
        if(Trim(this.help_tips)!='') this.Ctrltbl.title=this.help_tips
        // if(this.nowrap=="true"){
          // this.Ctrltbl.style.whiteSpace ="nowrap";
          // this.Ctrltbl.style.overflow = "hidden";
          // this.Ctrltbl.style.textOverflow = "ellipsis";
        // }
      }
      this.Value=function(v){
        if(typeof(v)!='undefined'){
          v=ZtVWeb.applyPicture(v,null,0,this.picture)
          if ((typeof(v)=="number") || (typeof(v)=="boolean"))
            v=v.toString();
           //v=Strtran(v,'&lt;','<');
           //v=Strtran(v,'&gt;','>');
          if(!enable_HTML && !EmptyString(v)){
            v=ToHTML(v);
          }
          if(Trim(this.href)!=''){
            this.Ctrlhref.innerHTML=(!Empty(heading)?"<"+heading+">"+ToHTag(v)+"</"+heading+">":ToHTag(v));
          }else{
            this.Ctrltbl.innerHTML=(!Empty(heading)?"<"+heading+">"+ToHTag(v)+"</"+heading+">":ToHTag(v));
          }
          this.adjustFormHeight()
        }else{
          if(Trim(this.href)!='')
            return Trim( ((enable_HTML)?this.Ctrlhref.innerHTML:ToHTML(this.Ctrlhref.innerHTML)));
          else
            return Trim(((enable_HTML)?this.Ctrltbl.innerHTML:ToHTML(this.Ctrltbl.innerHTML)));
        }
      }
      //Metodo al cambio di step dei font %
      this.setCtrlFont=function(f){
        if(!EmptyString(this.href))
          document.getElementById(this.ctrlid+'href').style.fontSize=f;
        else
          document.getElementById(this.ctrlid+'tbl').style.fontSize=f;
      }
      //Metodo al cambio di step dei font %
      this.setNCol=function(n){
        this.Ctrltbl.style.columnCount=n;
        this.Ctrltbl.style.MozColumnCount=n;
        this.Ctrltbl.style.WebkitColumnCount=n;
      }

      this.HasCssClass=function(v){
        return LibJavascript.CssClassNameUtils.hasClass(this.Ctrl,v);
      };
      this.AddCssClass=function(v){
        LibJavascript.CssClassNameUtils.addClass(this.Ctrl,v);
        if ( Trim(this.href) ) {
          LibJavascript.CssClassNameUtils.addClass(this.Ctrlhref,v);
        }
      };
      this.RemoveCssClass=function(v){
        LibJavascript.CssClassNameUtils.removeClass(this.Ctrl,v,false);
        if ( Trim(this.href) ) {
          LibJavascript.CssClassNameUtils.removeClass(this.Ctrlhref,v);
        }
      };
      this.Href=function(v){
        var old_href;
        if(!EmptyString(v)){
          old_href = this.href;
          if(!EmptyString(this.href)) {
            this.href=v;
            this.Ctrlhref.href= ZtVWeb.makeStdLink(this.href,0,null,null,this.form,true);
          }
          return old_href;
        }
        else {
          return this.href;
        }
      }
      // this.setCtrlStep=function(obj){
        // if(Empty(obj.n_col)) obj.n_col=1;
        // this.setNCol(obj.n_col);
      // }
      this.setCtrlStdMethods(this);
      this.EditCtrl=function(cond){
        if(!cond){
          this.Ctrlhref.removeAttribute('href');
        }else{
          this.Ctrlhref.href=ZtVWeb.makeStdLink(this.href,0,null,null,this.form,true);
        }
      }
      if (server_side=='true' && Empty(this.form.floatingPositions)) {
        this.adjustFormHeight();
      }
      this.AddListenerToHTMLEvent('onclick', 'Click');
    }
    this.LabelCtrl.prototype= new this.StdControl();
    this._LC=this.LabelCtrl;
    // Layer ----------------------------------------------------------------------------------------------------------------
    this.Layer=function(){
      // this.setAsEventSrc(this);
      StdEventSrc.call(this);
    };
    this.Layer.prototype=new this.StdControl();
    this.Layer.prototype.contentHTML=function(html,append){
      if(!Empty(html)){
        if(append)
          this.container.innerHTML+=html;
        else
          this.container.innerHTML+=html;
      }
      return this.container.innerHTML;
    };
    this.Layer.prototype.Hide=function(){
      this.container.style.display='none';
      this.genericDispatcher("Hide",arguments);
    };
    this.Layer.prototype.Show=function(){
      this.container.style.display='';
      this.genericDispatcher("Show",arguments);
    };
    this.Layer.prototype.Visible=function(){
      return this.container.style.display=='none';
    };
    this.Layer.prototype.genericDispatcher=function(evtName, args){
      var a=[evtName];
      for(var i=0,l=args.length; i<l; a.push(args[i++]));
      this.dispatchEvent.apply(this,a);
    };
    this.Layer.prototype.SetContainer=function(container){
      this.container=container;
    };
    this.Layer.getAbsolutePos=function(el){
      var r = { x: el.offsetLeft, y: el.offsetTop };
      if(el.offsetParent){
        var tmp = ZtVWeb.Layer.getAbsolutePos(el.offsetParent);
        r.x+=tmp.x;
        r.y+=tmp.y;
      }
      return r;
    };
    // Variable ---------------------------------------------------------------------------------------------------------------
    this.VariableCtrl=function(form,name,ctrlid,typevar,value){
      this.form=form;
      this.name=name;
      this.allowOnChange=true;
      if (ctrlid) {
        this.Ctrl=document.getElementById(ctrlid);
      }
      this.typevar=typevar;
      this.type= this.typevar=='datetime' ? 'T' : this.typevar.substr(0,1).toUpperCase();
      if (this.type=='D') this.picture=ZtVWeb.defaultDatePict
      if (this.type=='T') this.picture=ZtVWeb.defaultDateTimePict
      this.addToForm(this.form,this);
      // this.setAsEventSrc(this);
      if(IsAny(value))this.Value(value);
      this.Set=function(v){
        var old_value=this.Value();
        if(old_value!=v){
          this.allowOnChange=false;
          this.Value(v);
          if(this.form[this.name+'_Validate'] && !this.form[this.name+'_Validate'](old_value,v)){
            this.dispatchEvent('Error');
            this.Value(old_value);
          }else{
            this.dispatchEvent('onChange');
            this.form.dispatchEvent('Calc');
            this.form.dispatchEvent('Calculate');
            this.form.dispatchEvent('HideUnderCondition');
            this.form.dispatchEvent('EditUnderCondition');
          }
          this.allowOnChange=true;
        }
      }
      this.Init=function(v){
        this.allowOnChange=false;
        this.Value(v);
        this.allowOnChange=true;
      }
    }
    this.VariableCtrl.prototype=new this.StdControl();
    this.VariableCtrl.prototype.Ctrl=null;
    this.VariableCtrl.prototype.picture="";
    this.VariableCtrl.prototype.Value=function(v){
      if(arguments.length){
        if(typeof(v)=='string'){
          v=Strtran(v,'&lt;','<');
          v=Strtran(v,'&gt;','>');
        }
        var old_value = this._value;
        this._value = ZtVWeb.applyPicture(v,this.type,0,this.picture);
        if (this.Ctrl)
          this.Ctrl.value=this._value;
        if ( this.allowOnChange && this._value!=old_value ) {
          this.dispatchEvent('onChange');
        }
      }
      return ZtVWeb.strToValue(this._value,this.type,this.picture);
    };
    this._VC=this.VariableCtrl;
    // Textbox ----------------------------------------------------------------------------------------------------------------
    this.TextCtrl=function(form,name,ctrlid,x,y,w,h,anchor,help_tips,typevar,picture,value,zerofilling,maxlength,layout_steps_values){
      this.form=form;
      this.name=name;
      this.help_tips=help_tips;
      this.typevar=typevar;
      this.type= this.typevar=='datetime' ? 'T' : this.typevar.substr(0,1).toUpperCase();
      this.picture=picture;
      this.maxlength=(Empty(maxlength)?10:maxlength);
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      var _this=this;
      if (this.type!='D'){
      } else if(EmptyString(picture)) {
        this.picture=ZtVWeb.defaultDatePict
      } else {
        this.picture=FormatDate.swapYYMMDD(picture)
      }
      if (this.type!='T') {
      } else if (EmptyString(picture)) {
        this.picture=ZtVWeb.defaultDateTimePict
      } else {
        this.picture=FormatDate.swapYYMMDD(picture)
      }
      if(this.type=='D')
        this._value=FormatDate(ZtVWeb.strToDate(value,this.picture),this.picture)
      else if(this.type=='T')
        this._value=FormatDateTime(ZtVWeb.strToDateTime(value,this.picture),this.picture)
      else if(this.type=='C')
        this._value=ZtVWeb.applyPicture(value,this.type,0,this.picture);
      else
        this._value=value.toString();
      this.Ctrl=document.getElementById(ctrlid+'_wrp');
      this.Ctrl_input=document.getElementById(ctrlid);
      if(this.type=='N' && ZtVWeb.IsMobile() && !this.Ctrl_input.readOnly){
        if (!window.ControlsIsInstalled ) {
          ZtVWeb.RequireLibrary(ZtVWeb.SPWebRootURL+'/controls.js');
        }
        LibJavascript.RequireLibrary(ZtVWeb.SPWebRootURL+'/'+ZtVWeb.theme+'/calculator.mobile.js');
        // ZtVWeb.RequireLibrary(ZtVWeb.SPWebRootURL+'/'+ZtVWeb.theme+'/calculator.mobile.js');
        this.Ctrl_input.style.display='inline-block';
        var aTag = document.createElement('a');
        aTag.addEventListener( 'click', function (evt) {
          if ( !_this.Ctrl_input.disabled ) {
            LibJavascript.Browser.TopFrame( 'LibJavascript').ShowPopUpCalculator( ctrlid, null, milSep, decSep, window );
          }
          evt.preventDefault();
        }, false );

        var img = document.createElement( 'img' );
        img.style.zIndex = 1;
        img.style.position = 'absolute';
        img.style.left = '100%';
        img.style.top = '0px';
        img.border = '0';

        aTag.appendChild( img );

        this.Ctrl.appendChild(aTag);

        img.addEventListener( 'load', CalculateATop, false );
        img.src = "../"+ZtVWeb.theme+"/formPage/calculator_enabled.png";

        function CalculateATop () {
          img.style.top = Math.floor(-(img.height-parseInt( LibJavascript.DOM.getComputedStyle(_this.Ctrl, 'height'), 10 ))/2) + 'px';
        }
      }
      //Input di tipo data se possibile
      if(this.type=='D' && ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date)
        this.Ctrl_input.type='date';
      // this.Ctrl_input.style.boxSizing = "border-box";
      // this.Ctrl_input.style.MozBoxSizing = "border-box";
      // this.Ctrl_input.style.WebkitBoxSizing = "border-box";
      // this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true);
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,noInlineStyle);
      }
      this._setCtrlPos(true);
      if(navigator.appVersion.indexOf("MSIE 7")>-1  && document.compatMode!="BackCompat"){
        ZtVWeb.resizeCtrlsBox(this.Ctrl.id,this.Ctrl_input.id);
      }
      this.addToForm(this.form,this);
      this.setCtrlStdMethods(this);
      if(!EmptyString(this.help_tips)){
        this.Ctrl.title=this.help_tips;
      }
      if(this.type=='N'){
        this.Ctrl_input.style.textAlign='right';
      }
			if(!EmptyString(this.picture)&& (this.picture.substr(0,1)=='!' || this.picture.substr(0,1)=='M' || this.picture.substr(0,1)=='W'))
			  this.Ctrl_input.style.textTransform="uppercase";
      this.on_blur=function(){
        if(this.typevar=='character' && zerofilling && this.Ctrl_input.value!='') this.Ctrl_input.value=zeroFill(this.Ctrl_input.value,this.maxlength);
        if(ZtVWeb.checkInput(this.type=='N'?Strtran(Strtran(this.Ctrl_input.value,milSep,''),decSep,'.'):this.Ctrl_input.value,this.type,this.picture,true,this)){
          //Operazioni di Validate e Calculate del campo
          if(this.form[this.name+'_Validate'] && !this.form[this.name+'_Validate'](this._value,this.Ctrl_input.value)){
           this.Ctrl_input.value='';
            if(!this.dispatchEvent("Error")){
              this.SetFocus();
            }
            return;
          }
          var tmp_value=this.Ctrl_input.value;
          this.form.dispatchEvent('Calc');
          this.form.dispatchEvent('Calculate');
          this.form.dispatchEvent('HideUnderCondition');
          this.form.dispatchEvent('EditUnderCondition');
          if(!(this.type=='D' && ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date)){
            var newvalue=this.Ctrl_input.value;
            if(this.type=='D')
              newvalue=FormatDate(ZtVWeb.strToDate(newvalue,this.picture),this.picture)
            else if(this.type=='T')
              newvalue=FormatDateTime(ZtVWeb.strToDateTime(newvalue,this.picture),this.picture)
            else if(this.type=='C')
              newvalue=ZtVWeb.applyPicture(newvalue,this.type,0,this.picture);
            else if(this.type=='N'){
              newvalue=Strtran(Strtran(newvalue,milSep,''),decSep,'.');
              newvalue=ZtVWeb.applyPicture(newvalue,this.type,0,this.picture);
            }
            if (newvalue!=this.Ctrl_input.value) {
              this.Ctrl_input.value=newvalue;
            }
          }
          var old_value=this._value;
          if(!Eq(this.Value(),ZtVWeb.strToValue(this._value,this.type,this.picture))) {
            this._value=tmp_value;
            this.dispatchEvent('onChange',old_value);
          }
          this.dispatchEvent("Lostfocus",old_value,this._value);
        }else{
          if(!this.form[this.name+'_Error']){
            this.SetFocus();
          }
        }
      };
      var IsChromeOver54 = ( parseInt((navigator.userAgent.match('Chrome/([0-9]+)')||[])[1])>=54 );
      this.Ctrl_input.onblur=function(){
        var handler = this.onblur;
        var _emptyfunction_ = function(){};
        this.onblur=_emptyfunction_;
        if (IsMozilla()) //in Firefox se il testo era selezionato e si fa focus con il mouse rimuove la selezione
          setSelection(this,0,0);
        _this.on_blur();
        if (IsChromeOver54) {
          var src=this;
          setTimeout(function() {
            if (src.onblur===_emptyfunction_) {
              src.onblur = handler;
            }
          },0);
        } else {
          this.onblur = handler;
        }
      }
      var onfocusListener=function(){
        if ( _this.CanFocus() ) {
          if(_this.type!='M')
            this.select();
          _this.dispatchEvent("Gotfocus");
        }
      }
      this.Ctrl_input.onfocus=onfocusListener;
      if(this.type=='N'){
        this.Ctrl_input.onkeypress=function(event){
          if(!Empty(_this.picture))
            return CheckNumWithPict(event,GetModDecPict(_this.picture));
          else
            return CheckNum(event);
        }
      }
      this.valueWhenNull=null;
      this.SetValueWhenNull=function(v){
        this.valueWhenNull=v;
      }
      this.Value=function(v){
        if(arguments.length){
          if(typeof(v)=='string'){
            v=Strtran(v,'&lt;','<');
            v=Strtran(v,'&gt;','>');
          }
          var pict = this.picture;
          if(this.type=='D' && ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date)
            pict='YYYY-MM-DD';
          else if (this.type=='T' && IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.datetimeLocal )
            pict='YYYY-MM-DDThh:mm:ss';
          this.Ctrl_input.value=ZtVWeb.applyPicture(v,this.type,0,pict);
          var tmp_value=this.Ctrl_input.value;
          if (!Eq(v,ZtVWeb.strToValue(this._value,this.type,pict))) {
            this._value =tmp_value ;
            if ( this.allowOnChange ) {
              this.dispatchEvent('onChange');
            }
          }
        }
        var value=ZtVWeb.strToValue(this.Ctrl_input.value, this.type, this.picture);
        if (value==null)
          value=this.valueWhenNull;
        return value;
      };
      this.Set=function(v){
        if(!Eq(this.Value(),v)){
          this.allowOnChange=false;
          this.Value(v);
          if(this.form[this.name+'_Validate'] && !this.form[this.name+'_Validate'](this._value,this.Ctrl_input.value)){
            this.dispatchEvent('Error');
            this.Value(this._value);
            this.allowOnChange=true;
          }else{
            this.allowOnChange=true;
            this.dispatchEvent('onChange');
            this.form.dispatchEvent('Calc');
            this.form.dispatchEvent('Calculate');
            this.form.dispatchEvent('HideUnderCondition');
            this.form.dispatchEvent('EditUnderCondition');
          }
        }
      }
      this.SetFocus=function(){
        if ( !this.CanFocus() )
          return false;
        try {
          /*senza timeout permette tastiera su iOS,
          ma per retrocompatibilita' non voglio scatenare l'ascoltatore
          associato all'evento.
          L'ascoltatore sara' invocato direttamente dopo.
          */
          _this.Ctrl_input.onfocus=null;//toglie ascoltatore
          this.Ctrl_input.focus();
          setTimeout(
            function(){
              //riassegna ascoltatore
              _this.Ctrl_input.onfocus=onfocusListener;
              //esegue il listener che rimosso prima del lancio della focus()
              _this.Ctrl_input.onfocus();
            }
          );
          return true;
        } catch(e){
          return false;
        }
      }
      this.CanFocus=function(){
        return this.IsVisible() && !this.Ctrl_input.disabled;
      }
      this.IsVisible=function(){
        return this.Ctrl.style.display!='none' && this.Ctrl.style.visibility!='hidden';
      }
      this.Disabled=function(){
        this.Ctrl_input.disabled=true;
      }
      this.Enabled=function(){
        this.Ctrl_input.disabled=false;
      }
      this.ReadOnly=function(v){
        var res=this.Ctrl_input.readOnly;
        if(IsA(v,'L')){
          this.Ctrl_input.readOnly=v;
        }
        return res;
      }
      this.allowOnChange=true;
      if(IsAny(value))this.Value(value);
    }
    this.TextCtrl.prototype=new this.StdControl();
    this._TC=this.TextCtrl;
    // Checkbox ----------------------------------------------------------------------------------------------------------------
    this.CheckboxCtrl=function(form,name,ctrlid,x,y,w,h,anchor,help_tips,typevar,checked_value,unchecked_value,layout_steps_values,label_text){
      this.form=form
      this.name=name;
      this.typevar=typevar!=null?typevar:'logic';
      this.type=this.typevar.substr(0,1).toUpperCase();
      this.change=false;
      this.help_tips=help_tips
      this.Ctrl=document.getElementById(ctrlid);
      this.CtrlDiv=document.getElementById(ctrlid+'_div');
      this.checked_value= checked_value!=null?checked_value:'true';
      this.unchecked_value= unchecked_value!=null?unchecked_value:'false';
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.allowOnChange=true;
      this.label_text=label_text;
      if(Trim(this.help_tips)!='') this.Ctrl.title=this.help_tips;
      // if(!Empty(this.label_text))
        // this.setCtrlPos(this.CtrlDiv,x,y,w,h,anchor,form.width,form.height);
      // else
        // this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height);
      this._setCtrlPos=function(noInlineStyle){
        if(!Empty(this.label_text))
          this.setCtrlPos(this.CtrlDiv,x,y,w,h,anchor,form.width,form.height);
        else
          this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height);
      }
      this._setCtrlPos();
      //i checkbox non devono avere il boxsizing borderbox, piu' piccoli
      this.Ctrl.style.WebkitBoxSizing = this.Ctrl.style.MozBoxSizing = this.Ctrl.style.boxSizing = "";
      this.addToForm(this.form,this)
      this.Value=function(v){
        var res=this.Ctrl.checked;
        // if(IsA(v,'C')) v=!!v.match(/^true$/i);
        if(typeof(v)!='undefined'){
          if (this.typevar=='logic')
            if (v=='S' || v=='T' || v=='1' || v=='Y')
              v=true;
          if (typeof(v)=='string')
            v=(ZtVWeb.strToValue(v,this.type)===ZtVWeb.strToValue(this.checked_value,this.type));
          else v=(v===ZtVWeb.strToValue(this.checked_value,this.type));
          if(this.Ctrl.checked!=v){
            this.Ctrl.checked=v;
            this.change=true;
            if ( this.allowOnChange )
              this.dispatchEvent('onChange');
          }
        }
        if (res)
          return ZtVWeb.strToValue(this.checked_value,this.type);
        return ZtVWeb.strToValue(this.unchecked_value,this.type);
      }
      this.Set=function(v){
        if(this.Value()!==v){
        this.Value(v);
        if(this.change)
          this.DispatchEvents();
        }
      }
      this.setCtrlStdMethods(this,this.CtrlDiv);
      //ridefiniti i metodi che devono lavorare sul INPUT e non sul DIV contenitore
      this.SetFocus=function(){this.Ctrl.focus();}
      this.Enabled=function(){this.Ctrl.disabled=null;}
      this.Disabled=function(){this.Ctrl.disabled='true';}

      this.Ctrl__onChange=function(){
        this.dispatchEvent('onChange');
        this.DispatchEvents();
      };
      this.AddListenerToHTMLEvent('onclick', '_onChange');
      this.addObserver('Ctrl', this);

      this.DispatchEvents=function(){
				this.form.dispatchEvent('Calc');
				this.form.dispatchEvent('Calculate');
				this.form.dispatchEvent('HideUnderCondition');
				this.form.dispatchEvent('EditUnderCondition');
      }
    }
    this.CheckboxCtrl.prototype=new this.StdControl
    // Combobox ----------------------------------------------------------------------------------------------------------------
    this.ComboboxCtrl=function(form,ctrlid,name,x,y,w,h,anchor,textlist,valuelist,isdatap,typevar,picture,visible,disabled,empty_value,init_par,layout_steps_values){
      this.form=form;
      this.name=name;
      this.isdatap=isdatap;
      this.typevar=typevar;
      this.picture=picture;
      this.type = this.typevar=='datetime' ? 'T' : this.typevar.substr(0,1).toUpperCase();
      if(this.type=="D" && (EmptyString(picture)||picture==null)) this.picture=ZtVWeb.defaultDatePict;
      if(this.type=="T" && (EmptyString(picture)||picture==null)) this.picture=ZtVWeb.defaultDateTimePict;
      this.Ctrl=document.getElementById(ctrlid);
      // this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height);
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height);
      }
      this._setCtrlPos();
      this.addToForm(this.form,this);
      this.valuelist=valuelist;
      this.textlist=textlist;
      this.valori=this.valuelist.split(',');
      this.testi=this.textlist.split(',');
      this.datasource=null;
			this.visible=visible;
			this.disabled=disabled;
      this.empty_value=empty_value!=null?empty_value:true;
      this.dontupdate=false;
      this.change=false;
      this.firstFill=true;
      this.emptyLabel='-';
      this.charToReplace='';
      this.allowOnChange=true;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.FillDataStatic=function(values,labels){
        this.valori=values.split(',');
        this.testi=labels.split(',');
        this.FillData(null,null);
      };
      this.Text=function(v){
        return this.Ctrl.options[this.Ctrl.selectedIndex].text;
      };
      this.UpdateCurRec=function(datasource){
        this.FillData(datasource)
      };
      this.SetCurRec=function(newCurRec){
        newCurRec = IsAny(newCurRec) ? newCurRec : (!empty_value?this.Ctrl.selectedIndex+1:this.Ctrl.selectedIndex);
        if(newCurRec==0)return;
        var oldCurRec = this.datasource.curRec;
        if ( oldCurRec!=newCurRec ) {
          this.datasource.curRec = newCurRec;
          this.dontupdate = true;
          this.datasource.refreshConsumers(false);
          this.dontupdate = false;
        }
      };
      this.Value=function(v){
        if(IsAny(v)){
          var old_v = this.Ctrl.value;
          if (v!=old_v) {
            this.Ctrl.value = v;
            this.change=true;
            if (this.allowOnChange)
              this.dispatchEvent('onChange');
            if (v != this.Ctrl.value)
              this.Ctrl.value = old_v;
          }
        }
        return ZtVWeb.strToValue(this.Ctrl.value,this.type,this.picture);
      }
      this.Set=function(v){
        if(this.Value()!=v){
          this.Value(v);
          if(this.change)
            this.DispatchEvents();
        }
      }
      this.Refresh=function(keep){
        if (this.datasource){
          this.keepValue=(keep?true:false);
          this.datasource.Query();
        }
      }
      this.FillData=function(datasource,s){
        if (this.keepValue){
          s=this.Ctrl.value;
          this.keepValue=false;
        }
        this.datasource=datasource
        if (this.dontupdate) return;
        this.Ctrl.innerHTML="";
        var i, nRecs, opt;
        if (this.empty_value){
          opt=new Option();
          opt.text=this.emptyLabel;
          opt.value='';
          this.Ctrl.options[0] = opt;
        }
        if (this.isdatap && this.datasource!=null){
          for(i=0,nRecs=datasource.getRecCount(); i<nRecs; i++){
            opt=new Option();
            opt.text=Trim(ZtVWeb.applyPicture(datasource.getValue(i,this.testi[0]),(this.type=='N' && isNaN(this.testi[0])?'C':this.type),0,this.picture));
            opt.value=ZtVWeb.applyPicture(datasource.getValue(i,this.valori[0]),this.type,0,this.picture);
            this.Ctrl.options[this.Ctrl.options.length] = opt;
            if(s!=null && Trim(this.Ctrl.options[this.Ctrl.options.length-1].value)==s){
              this.Ctrl.options[this.Ctrl.options.length-1].selected='selected';
              this.datasource.curRec = i;
            }
          }
        }else{
          for(i=0;i<this.testi.length;i++){
            opt=new Option();
            if (!Empty(this.charToReplace)){
              opt.text=Strtran(Strtran(this.testi[i],'&#44;',','),this.charToReplace,',') //se la label contiene una virgola in formatto HTML, la trasformo in virgola
              if(Trim(this.valori[i])=='')
                opt.value=Strtran(this.testi[i],this.charToReplace,',')
              else
                opt.value=Strtran(this.valori[i],this.charToReplace,',')
            }
            else {
              opt.text=Strtran(this.testi[i],'&#44;',',')//se la label contiene una virgola in formatto HTML, la trasformo in virgola
              if(Trim(this.valori[i])=='')
                opt.value=this.testi[i]
              else
                opt.value=this.valori[i]
            }
            opt.text = Strtran(this.testi[i], ' ', '\xA0'); // se la label contiene uno spazio lo trasformo in HTML
            this.Ctrl.options[this.Ctrl.options.length] = opt
            if(s!=null && Trim(this.Ctrl.options[this.Ctrl.options.length-1].value)==s)
              this.Ctrl.options[this.Ctrl.options.length-1].selected='selected'
          }
        }
        this.prev=this.Ctrl.selectedIndex;
        if (this.firstFill && !Empty(init_par)) this.Value(init_par);
        this.firstFill=false
        this.dispatchEvent("Rendered");
      }
      this.Ctrl_change=function(){this.dispatchEvent('onChange');this.DispatchEvents();}
      this.setCtrlStdMethods(this);
      this.addObserver('Ctrl', this);
      if ( !this.isdatap ) this.FillData();
      this.DispatchEvents=function(){
        //this.dispatchEvent('onChange');
				this.form.dispatchEvent('Calc');
				this.form.dispatchEvent('Calculate');
				this.form.dispatchEvent('HideUnderCondition');
				this.form.dispatchEvent('EditUnderCondition');
      }
      this.AddListenerToHTMLEvent('onchange', 'change', this.Ctrl_input);
      this.AddListenerToHTMLEvent('onfocus', 'Gotfocus', this.Ctrl_input);
      this.SetEmptyLabel=function(v,refreshData){
        this.emptyLabel=v;
        if (refreshData)
          this.FillData();
      }
      this.ReplaceChar=function(v,refreshData){
        this.charToReplace=v;
        if (refreshData)
          this.FillData();
      }
    }
    this.ComboboxCtrl.prototype=new this.StdControl
    // Radio
    this.RadioCtrl=function(form,ctrlid,name,x,y,w,h,anchor,captionsList,valuesList,typevar,picture,visible,disabled,orientation,layout_steps_values,tabindex){
      this.form=form;
      this.name=name;
      this.typevar=typevar;
      this.picture=picture;
      this.type = this.typevar=='datetime' ? 'T' : this.typevar.substr(0,1).toUpperCase();
      this.Ctrl=document.getElementById(ctrlid);
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,noInlineStyle);
      }
      this._setCtrlPos(true);
      this.minheight=h;
      this.addToForm(this.form,this);
      this.valuesList=valuesList;
      this.captionsList=captionsList;
      this.values=this.valuesList.split(',');
      this.captions=this.captionsList.split(',');
      this.visible=visible;
      this.disabled=disabled;
      this.change=false;
      this.tabindex=tabindex;
      this.allowOnChange=true;
      this.orientation=orientation;
      this.lastRenderHeight=null;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      var radio_name = ctrlid+'_radio';
      this.FillData=function(valueToSelect){
        var selectValue = 1 in arguments // tests if passed valueToSelect
          , radioContainerTag = this.orientation=='vertical' ? 'div' : 'span';
        LibJavascript.Array.forEach(this.values, function(value,idx){
          var radioContainer = document.createElement(radioContainerTag)
            , caption = (idx in this.captions && this.captions[idx]!=null) ? this.captions[idx] : value
            , radio_id = radio_name+'_'+idx
            , lbl_id = radio_id+'_lbl';
          radioContainer.innerHTML = "<label id='"+lbl_id+"'>"
                                   + "<input type='radio' value='"+value+"' name='"+radio_name+"' id='"+radio_id+"' "+(value==valueToSelect?'checked':'')+(!Empty(this.tabindex)?" tabindex="+this.tabindex:"")+">"
                                   + caption
                                   + "</label>";
          this.Ctrl.appendChild(radioContainer);
        },this);
        this.adjustFormHeight();
        this.dispatchEvent("Rendered");
      };
      this.FillDataStatic=function(labels,values){
        this.values=labels.split(',');
        this.captions=values.split(',');
        this.Ctrl.innerHTML='';
        this.FillData();
        LibJavascript.Array.forEach( get_radios(), function(radio){
        this.AddListenerToHTMLEvent('onclick', 'click', radio);
        this.AddListenerToHTMLEvent('onchange', 'change', radio);
        }, this);
      };
      this.adjustFormHeight=function(cnt){
        if (this.Ctrl.offsetHeight==0 && (cnt==null || cnt<10)) {
          setTimeout('window.'+this.form.formid+'.'+this.name+'.adjustFormHeight('+(cnt==null?0:cnt+1)+')',200);
        } else {
          var oh=this.lastRenderHeight;
          if (oh!=this.getRenderHeight()){
            this.form.queueAdjustHeight(50);
          }
        }
      }
      this.getRenderHeight=function(){
        var ctrl=this.Ctrl;
        if (ctrl!=null){
          var h=ctrl.offsetHeight;
          if(this.layout_steps_values && this.layout_steps_values[this.form.Step])
            this.minheight=this.layout_steps_values[this.form.Step].h;
          this.lastRenderHeight=(h>this.minheight?h:null)
        } else {
          this.lastRenderHeight=null
        }
        return this.lastRenderHeight
      }
      function get_radios(){
        return document.getElementsByName(radio_name);
      }
      function get_currentIdx(){
        for ( var i=0, radios=get_radios(); i < radios.length; i++ ) {
          if ( radios[i].checked == true ) {
            return i;
          }
        }
        return -1;
      }
      function get_current(){
        for ( var i=0, radios=get_radios(); i < radios.length; i++ ) {
          if ( radios[i].checked == true ) {
            return radios[i];
          }
        }
      }
      this.Text=function(){
        var idx;
        if ( (idx = get_currentIdx()) != -1 ) {
          return this.captions[idx];
        }
      };
      this.Value=function(v){
        var current = get_current();
        if ( 0 in arguments ) {
          if ( !current || v != current.value ) {
            for ( var i=0, radios=get_radios(); i < radios.length; i++ ) {
              if ( radios[i].value == v ) {
                radios[i].checked = true;
                this.change = true;
                if (this.allowOnChange)
                  this.dispatchEvent('onChange');
                break;
              }
            }
          }
          return ZtVWeb.strToValue(v,this.type,this.picture);
        } else if ( current ) {
          return ZtVWeb.strToValue(current.value,this.type,this.picture);
        }
      }
      this.Set=function(v){
        if ( (0 in arguments) && this.Value() != v ) {
          this.Value(v);
          if ( this.change )
            this.DispatchEvents();
        }
      }
      this.Ctrl_click = function(){
        /*
        fix per ottenere corretto onChange in IE 7/8
        http://stackoverflow.com/questions/208471/getting-jquery-to-recognise-change-in-ie
        non applicato solo ad IE perche' cosi' funziona la navigazione da tastiera anche con gli altri browser
        (che in IE funziona)
        */
        var curr;
        if ( curr = get_current() ) {
          curr.blur();
          curr.focus();
        }
      }
      this.Ctrl_change = function(){
        this.dispatchEvent('onChange');
        this.DispatchEvents();
      }
      this.FillData();
      LibJavascript.Array.forEach( get_radios(), function(radio){
        this.AddListenerToHTMLEvent('onclick', 'click', radio);
        this.AddListenerToHTMLEvent('onchange', 'change', radio);
      }, this);
      // this.AddListenerToHTMLEvent('onchange', 'change');
      this.setCtrlStdMethods(this);
      this.Disabled = function() {
        LibJavascript.Array.forEach( get_radios(), function(radio){
          radio.disabled = 'true';
        });
      }
      this.Enabled = function() {
        LibJavascript.Array.forEach( get_radios(), function(radio){
          radio.disabled = null;
        });
      }
      if(this.disabled) this.Disabled();
      this.addObserver('Ctrl', this);
      this.DispatchEvents=function(){
				this.form.dispatchEvent('Calc');
				this.form.dispatchEvent('Calculate');
				this.form.dispatchEvent('HideUnderCondition');
				this.form.dispatchEvent('EditUnderCondition');
      }
    }
    this.RadioCtrl.prototype=new this.StdControl
    // Box ------------------------- ---------------------------------------------------------------------------------------
    this.BoxCtrl=function(form,name,id,x,y,w,h,bg_color,stretch,border_weight,border_color,anchor,layout_steps_values,shrinkable){
      this.form=form
      this.name=name;
      this.ctrlid=id;
      this.minheight=h;
      this.Ctrl=document.getElementById(id);
      this.shrinkable = shrinkable;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      // if(Trim(border_weight)!='')
        // this.Ctrl.style.border=border_weight+'px solid '+Trim(border_color)
      this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true);
      this.addToForm(this.form,this)
      //if(Trim(bg_color)!='') this.Ctrl.style.backgroundColor=bg_color
      if(stretch=='true'){
        this.Ctrl.style.width='100%'
        this.Ctrl.style.left='0px'
      }
      this.getRenderHeight=function(){
        var h=this.Ctrl.scrollHeight
        if(this.shrinkable=='true' || h>this.minheight)
          this.lastRenderHeight=h;
        else
          this.lastRenderHeight=null;
        return this.lastRenderHeight
      }
      this.setCtrlStdMethods(this)
    }
    this.BoxCtrl.prototype=new this.StdControl
    this.tmpobj={}
    // Portlet included ------------------------- ---------------------------------------------------------------------------------------
    this.PortletCtrl=function(form,ctrlid,name,x,y,w,h,anchor){
      this.form=form
      this.ctrlid=ctrlid
      this.name=name
      this.Ctrl=document.getElementById(this.ctrlid)
      this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true)
      this.addToForm(this.form,this)
      this._setCtrlStdMethods(this)
      this.lastRenderHeight=null
      this.minheight=h
      this.adjustFormHeight=function(cnt){
        if (this.form.Ctrl.offsetHeight==0 && (cnt==null || cnt<10)) {
           setTimeout(function(_this_,_cnt_){return function(){_this_.adjustFormHeight((_cnt_==null?0:_cnt_+1))}}(this,cnt),200)
        } else {
          var oh=this.lastRenderHeight
          if (oh!=this.getRenderHeight())
            this.form.queueAdjustHeight(50)
        }
      }

      this.getRenderHeight=function(){
        var h=this.Ctrl.scrollHeight
        this.lastRenderHeight=(h>this.minheight?h:null)
        return this.lastRenderHeight
      }
      this.measureCtrl=function(){
        this.Ctrl.style.height=this.minheight+'px'
        var ol=this.lastRenderHeight
        var h=this.getRenderHeight()
        if (h!=null) {
          this.lastRenderHeight=null
          this.Ctrl.style.height=h+'px'
          this.adjustFormHeight()
        } else if (ol!=null){
          this.lastRenderHeight=0
          this.Ctrl.style.height=this.minheight+'px'
          this.adjustFormHeight()
        }
      }
      this.form[this.name+"_Validate"]=function(){
        //Se VDM
        //if(this[name].portletname=='SPMaskParameters')
          return this[name].ValidateCtrlsPage();
        //else
        //  return true;
      }
      this.measureCtrl()

    }
    this.PortletCtrl.prototype=new this.StdControl
    // PushButton ----------------------------------------------------------------------------------------------------------------
    this.PushBtnCtrl=function(form,name,ctrlid,text,x,y,w,h,anchor,help_tips,type_wizard,layout_steps_values){
      this.form=form;
      this.name=name;
      this.text=ZtVWeb.makeStdExpr(text,this.form)
      this.ctrlid=ctrlid;
      this.help_tips=help_tips
      this.Ctrl=document.getElementById(ctrlid)
      this.Ctrl.value=this.text
      if(!EmptyString(this.help_tips)) this.Ctrl.title=this.help_tips;
      // this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true);
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,noInlineStyle);
      }
      this._setCtrlPos(true);
      this.addToForm(this.form,this)
      this.setCtrlStdMethods(this)
      this.type_wizard = type_wizard;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.Value=function(v){
        var res=this.Ctrl.value;
        if(IsAny(v))
          this.Ctrl.value=v;
        return res;
      }
      this.Submit=function(action){
        var formobj=document.getElementById(this.form.formid+'_form')
        formobj.action=action
        formobj.submit()
      }
      this.Reset=function(){
        var formobj=document.getElementById(this.form.formid+'_form')
        formobj.reset();
      }

      this.AddListenerToHTMLEvent('onfocus', 'Gotfocus');
      if( !Empty(type_wizard) ) {
        this.Ctrl.addEventListener('click', function(){
          var tabs = form.ZtTabs;
          if ( !tabs ) { //possibile tab di gruppo di pagelet
            for(var item in window[form.pageletId+'_pagelet_structure'] ){
              if( window[form.pageletId+'_pagelet_structure'][item].type == "group" && window[form.pageletId+'_pagelet_structure'][item].tabs && form.portletname == "wizard_footer" ){
                tabs = window[form.pageletId][window[form.pageletId+'_pagelet_structure'][item].name].tabContainer;
              }
            }
          }
          if( tabs ){
            if( type_wizard == "forward" )
              tabs.Next();
            if( type_wizard == "back" )
              tabs.Prev();
          }
        });
      } else {
        this.AddListenerToHTMLEvent('onclick', 'Click');
      }
      this.AddListenerToHTMLEvent('onblur', 'Lostfocus');
    }
    this.PushBtnCtrl.prototype=new this.StdControl();
    this._BC=this.PushBtnCtrl;
    // Image ----------------------------------------------------------------------------------------------------------------
    this.ImageCtrl=function(form,name,ctrlid,x,y,w,h,anchor,help_tips,href,src,srchover,target,alt,img_type,font_color,font_color_hover,server_side,layout_steps_values,keepProportions){
      this.form=form;
      this.name=name;
      this.ctrlid=ctrlid;
      this.help_tips=help_tips;
      this.alt=alt;
      this.href=href; //if not server_side
      this.target=target;
      this.minheight=h;
      this.src=ZtVWeb.makeStdExpr(src,this.form);
      this.srchover=ZtVWeb.makeStdExpr(srchover,this.form);
      this.server_side = server_side;
      this.Ctrl=document.getElementById(ctrlid+'_img');
      this.Ctrlhref=document.getElementById(ctrlid+"href");//if not font icon
      this.CtrlDiv=document.getElementById(ctrlid);
      this.lastRenderHeight=null;
      this.font_color = font_color;
      this.font_color_hover = font_color_hover;
      this.img_type = img_type;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.keepProportions = keepProportions;
      if ( typeof this.keepProportions === 'undefined' ) { /*B61 compat. Remove after B62*/
        this.keepProportions = LibJavascript.DOM.getComputedStyle( this.Ctrl, 'height' ) === 'auto';
      }
      var _this =  this;

      function isServerSide () {
        return server_side == 'true' || /* legacy */( EmptyString( src ) && EmptyString( srchover ) );
      }

      this.GetSrc = function () {
        var res = Empty( this.src ) && isServerSide() ? this.Ctrl.getAttribute( 'src' ) || this.Ctrl.innerHTML : this.src;
        if ( Empty( this.src ) ) {
          this.src = res;
        }
        return res;
      };

      this.GetSrcHover = function () {
        var res = Empty( this.srchover ) && isServerSide() ? (
          function () {
            var hover = ( ( _this.Ctrlhref || _this.Ctrl ).getAttribute( 'onmouseover' ) || '' ).toString().match( /\.src='(.*)';}/ )
            return hover && hover[1];
          } () ) : this.srchover;
        if ( Empty( this.srchover ) ) {
          this.srchover = res;
        }
        return res;
      }

      if( this.img_type == "font icon" ){ //font icon src,srchover are char
        this.Ctrl=document.getElementById(ctrlid);
        if(!EmptyString(this.srchover)) {
          LibJavascript.Events.addEvent( this.Ctrl, 'mouseover', function (evt) {
            _this.Ctrl.innerHTML = _this.srchover;
            if ( !EmptyString( _this.font_color_hover ) ) {
              _this.Ctrl.style.color = _this.font_color_hover;
            }
            _this.dispatchEvent( 'OnLoad' );
          } );

          LibJavascript.Events.addEvent( this.Ctrl, 'mouseout', function (evt) {
            _this.Ctrl.innerHTML = _this.src;
            if ( !EmptyString( _this.font_color ) ) {
              _this.Ctrl.style.color = _this.font_color;
            }
            _this.dispatchEvent( 'OnLoad' );
          } );

          LibJavascript.Events.addEvent( this.Ctrl, 'focus', function (evt) {
            _this.Ctrl.innerHTML = _this.srchover;
            if ( !EmptyString( _this.font_color_hover ) ) {
              _this.Ctrl.style.color = _this.font_color_hover;
            }
            _this.dispatchEvent( 'OnLoad' );
          } );

          LibJavascript.Events.addEvent( this.Ctrl, 'blur', function (evt) {
            _this.Ctrl.innerHTML = _this.src;
            if ( !EmptyString( _this.font_color ) ) {
              _this.Ctrl.style.color = _this.font_color;
            }
            _this.dispatchEvent( 'OnLoad' );
          } );
        }
        setHref( this.Ctrl );
      } else {
        setSrcHoverImg();
        setHref( this.Ctrlhref );
      }

      function setSrcHoverImg () {
        if ( !EmptyString( _this.srchover ) ) {
          var obj_src = _this.Ctrlhref || _this.Ctrl;
          LibJavascript.Events.addEvent( obj_src, 'mouseover', function (evt) {
            _this.Ctrl.src = _this.srchover;
          } );
          LibJavascript.Events.addEvent( obj_src, 'mouseout', function (evt) {
            _this.Ctrl.src = _this.src;
          } );
          LibJavascript.Events.addEvent( obj_src, 'focus', function (evt) {
            _this.Ctrl.src = _this.srchover;
          } );
          LibJavascript.Events.addEvent( obj_src, 'blur', function (evt) {
            _this.Ctrl.src = _this.src;
          } );
        }
      }

      function setHref (ctrl) {
        if ( !EmptyString( _this.href ) ) {
          if(target=='_blank' || target=='_new'){
            ctrl.onclick = function ( evt ) {
              ZtVWeb.Popup( ZtVWeb.makeStdLink( _this.href, 0, null, null, _this.form, false ), "", evt );
            };
          } else if(ctrl.hasAttribute('href') ){
            ctrl.href = ZtVWeb.makeStdLink( _this.href, 0, null, null, _this.form, true );
          }
          else {
            ctrl.onclick = function ( evt ) {
              var a = document.createElement('a');
              document.body.appendChild(a);
              a.href = ZtVWeb.makeStdLink( _this.href, 0, null, null, _this.form, true );
              a.click();
              document.body.removeChild(a);
            }
          }
        }
      }

      this.setCtrlPos(this.CtrlDiv,x,y,w,h,anchor,form.width,form.height,false,true);
      this.addToForm(this.form,this);
      if(!EmptyString(this.help_tips))
        this.Ctrl.title=this.help_tips;
      this.alt=ZtVWeb.makeStdExpr(this.alt,this.form);
      if(!EmptyString(this.alt))
        this.Ctrl.alt=this.alt;

      this._valueCheckIcon = function(src,srchover) {
        if(IsAny(src) || IsAny(srchover)){
          if ( typeof(src) == 'string' && src.indexOf('{') == -1 )
            return this.Value(src,srchover);
          else {
            this.img_type = "font icon";
            if(typeof(src) == 'string' && src.indexOf('{') > -1)  // str | {fontFamily,size,value,color} | {FontName|Size|Char|Color|FontWeight}
              src = JSON.parse(src);
            ZtVWeb.RequireFont(src.fontFamily||src.FontName);
            this.font_color = src.color||src.Color;
            this.Ctrl=document.getElementById(ctrlid);
            this.Ctrl.style.width = 'auto';
            this.Ctrl.style.fontFamily = src.fontFamily||src.FontName;
            if ( !EmptyString( this.font_color ) ) {
                this.Ctrl.style.color = this.font_color;
            }
            var fontWeight = src.fontWeight||src.FontWeight;
            if ( !EmptyString( fontWeight ) ) {
                this.Ctrl.style.fontWeight = fontWeight;
            }
            var fontSize = src.Size||src.size;
            if ( !EmptyString( fontSize ) ) {
                this.Ctrl.style.fontSize = parseInt(fontSize)+"px";
            }
            if ( !EmptyString( _this.href ) ) this.Ctrl.style.cursor='pointer';
            setHref( this.Ctrl );
            return this.Value(src.value||(src.Char ? String.fromCharCode(src.Char):''), this.srchover)
          }
        }
        else {
          return this.GetSrc();
        }
      }

      this.Value=function(src,srchover){
        if(IsAny(src) || IsAny(srchover)){
          this.src=src;
          this.srchover=srchover;
            if(this.img_type == "font icon"){
              this.Ctrl.innerHTML=this.src;
              this.dispatchEvent( 'OnLoad' );
          } else {
            if ( isServerSide() ) {
              this.Ctrl.removeAttribute( 'onmouseover' );
              this.Ctrl.removeAttribute( 'onmouseout' );
              setSrcHoverImg();
            }
            this.Ctrl.src=src;
         }
        }else {
          return this.GetSrc();
        }
      }

      this.EditCtrl=function(cond){
        var ctrl=this.Ctrlhref || this.Ctrl;
        if(!cond){
          ctrl.removeAttribute('href');
        }else{
          setHref(ctrl);
        }
      }
      this.getRenderHeight=function(){
        var h=this.Ctrl.offsetHeight;
        if(this.layout_steps_values && this.layout_steps_values[this.form.Step])
          this.minheight=this.layout_steps_values[this.form.Step].h;
        this.lastRenderHeight=(h>this.minheight?h:null)
        return this.lastRenderHeight
      }
      this.Resize=function(w,h){
        this.controlwidth = w;
        this.controlheight = h;
        this.Ctrl.style.width=w+'px';
        this.Ctrl.style.height=h+'px';
        this.form.queueAdjustHeight(50);
        if( this.img_type == "font icon" ) {
          this.Ctrl.style.fontSize = Math.min(w,h)+"px";
        }
      }
      this.SetHelpTips=function(v){
        this.help_tips=v;
        this.Ctrl.title=v;
      }
      this.SetAlt=function(v){
        this.alt=v;
        this.Ctrl.alt=v;
      }
      this.setCtrlStdMethods(this,this.CtrlDiv);
      if(!EmptyString(this.href)) {
        this.SetFocus = function () {
          ( this.Ctrlhref || this.Ctrl ).focus();
        };
        this.Enabled = function () {
          ( this.Ctrlhref || this.CtrlDiv ).disabled = null;
        };
        this.Disabled = function () {
          ( this.Ctrlhref || this.CtrlDiv ).disabled = 'true';
        }
      }
      this.Hide = function () {
        this.CtrlDiv.style.visibility = 'hidden';
        this.CtrlDiv.style.display = 'none';
      };
      this.Show = function () {
        this.CtrlDiv.style.visibility = 'visible';
        this.CtrlDiv.style.display = 'block';
      }

      this.Submit=function(action){
        var formobj=document.getElementById(this.form.formid+'_form')
        formobj.action=action
        formobj.submit()
      }
      this.Reset=function(){
        var formobj=document.getElementById(this.form.formid+'_form')
        formobj.reset()
      }
      this.CenterHorizontally = function () {
        this.CtrlDiv.style.left = '50%';
        this.CtrlDiv.style.marginLeft = -this.Ctrl.offsetWidth/2 + 'px';
      }
      this.AddListenerToHTMLEvent('onclick', 'Click',this.CtrlDiv);
      this.AddListenerToHTMLEvent('onload', 'OnLoad');
      this.AddListenerToHTMLEvent('onerror', 'OnError');
      if ( this.img_type != 'font icon' ) {
        if ( this.Ctrl && this.Ctrl.src && this.Ctrl.complete ) { // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement
          var dispatch;
          if ( this.Ctrl.naturalWidth && this.Ctrl.naturalHeight ) {
            dispatch = function (evt) {
              this.dispatchEvent( 'OnLoad' );
            };
          } else {
            dispatch = function (evt) {
              this.dispatchEvent( 'OnError' );
            };
          }
          dispatch.bind( this );
          this.form.addObserver( 'form', this );
          this.form_Loaded = dispatch;
        }
        if ( this.keepProportions === 'bounded' ) {
          this.addObserver( 'self', this );
          this.self_OnLoad = function (evt) {
            var d1 =this.Ctrl.naturalHeight/this.Ctrl.naturalWidth  ;
            var d2 = this.controlheight/this.controlwidth  ;
            if ( d1 < d2 ) {
              this.Ctrl.style.width = '100%';
              this.Ctrl.style.height = 'auto';
            } else {
              this.Ctrl.style.width = 'auto';
              this.Ctrl.style.height = '100%';
            }
          }.bind( this );
        }
      }
    }
    this.ImageCtrl.prototype=new this.StdControl
    this._IC=this.ImageCtrl;

   // Chart ----------------------------------------------------------------------------------------------------------------
    this.ChartCtrl = function(form,id,name,x,y,w,h,query,parms,label_field,value_fields,def,title,anchor,label_series,subtitle,x_label,y_label,help_tips,formula_name,formula,urlType,url,seriesname,categoryname,valuename,target,popup,popup_height,popup_width,isdatap,
    percent_label,multi_key_field,multi_label_field,key_start,data_order,other_chart,enable_change_order,legend,tick_unit,value_labels,dataload_datelimit,min_value,max_value,downloadlist,ismulti,chartNavbar,chartNavbarFirstlast,chartNavbarChangepage,
    chartNavbarLastpage,dsetFunct,titleSeries,enable_download,gendataset,focuskey,chartW,chartH,chartType,x_field,y_field,z_field,xyz_series_field,min_field,max_field,val_field,measure_series_field,
    labelKey_field,xKey_field,measureKey_series_field,categoryKeyName,positionMenu,zfshow,zftype,zfupdate,zfseries,multi_autochange,exclSer,othlimits,othlabel,legendlimit,geo_0_field,geo_1_field,geo_value_field,geo_dom_field,geo_view,multi_scale,layout_steps_values,rangebands,
    chartNavbarPagepanel,chartNavbarAddRemove,valuezname,enable_menu_sel,exportFileName,geo_level,selclicks,exclicks) {
      this.isdatap=isdatap;
      this.form=form;
      this.name=name;
      this.def=def;
      this.help_tips=help_tips;
      this.Ctrl=document.getElementById(id);
      this.ctrlid = id;
      this.subtitle=subtitle;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.x_label=x_label;
      this.y_label=y_label;
      this.label_series=label_series;
      this.parms=parms;
      this.query=query;
      this.formula=formula;
      this.formula_name=formula_name;
      this.value_fields=value_fields;
      this.label_field=label_field;
      this.legend=(legend=="default" || Empty(legend) || legend=="null" || legend=="undefined")?"a":legend;
      this.tick_unit=tick_unit;
      this.value_labels = (value_labels == "hide") ? "0" : value_labels;
      this.dataload_datelimit=dataload_datelimit;
      this.min_value=min_value;
      this.max_value=max_value;
      this.urlType=urlType;
      this.url=url;
      this.seriesname = seriesname;
      this.categoryname = categoryname;
      this.valuename = valuename;
      this.target=target;
      this.popup=popup;
      this.popup_height=popup_height;
      this.popup_width=popup_width;
      this.dontupdate=false;
      this.focuskey=focuskey;
      this.propertyValue=[];
      this.percent_label=percent_label;
      this.multi_key_field=multi_key_field;
      this.multi_label_field=multi_label_field;
      this.key_start=key_start;
      this.data_order=data_order;
      this.other_chart=other_chart;
      this.enable_change_order=enable_change_order;
      this.objConfig={};
      this.datasource;
      this.linkObj={};
      this.chartType=chartType;
      this.x_field=x_field;
      this.y_field=y_field;
      this.z_field=z_field;
      this.xyz_series_field=xyz_series_field;
      this.min_field=min_field;
      this.max_field=max_field;
      this.val_field=val_field;
      this.measure_series_field=measure_series_field;
      this.chartW=chartW;
      this.chartH=chartH;
      this.title=title;
      this.linkObj.categoryKeyName=categoryKeyName;
      this.exclSeries = exclSer;
      this.datasourceStructure="";
      this.enable_download = CharToBool(""+enable_download);
      this.downloadlist = downloadlist;
      this.ismulti = CharToBool(""+ismulti);
      this.dsetFunct = dsetFunct;
      this.chartNavbar = CharToBool(""+chartNavbar);
      this.chartNavbarFirstlast = CharToBool(""+chartNavbarFirstlast);
      this.chartNavbarChangepage = CharToBool(""+chartNavbarChangepage);
      this.chartNavbarLastpage = CharToBool(""+chartNavbarLastpage);
      this.chartNavbarLastpage = CharToBool(""+chartNavbarLastpage);
      this.chartNavbarPagepanel = CharToBool(""+chartNavbarPagepanel);
      this.chartNavbarAddRemove = CharToBool(""+chartNavbarAddRemove);
      this.titleSeries = titleSeries;
      this.gendataset = CharToBool(""+gendataset);
      var global_js_id = 'window.'+this.form.formid+'.'+this.name;
      this.Translations = ZtVWeb.ChartTranslations||ZtVWeb.GridTranslations||{};
      this.rows;
      this.curRec=1;
      this.class_nav_bar = 'grid_navbar';
      this.menuPosition = positionMenu;
      var _this=this;
      if (typeof(this.navbar_mode)=='undefined') this.navbar_mode={};
      if (typeof(this.navbar_mode.firstlast )=='undefined') this.navbar_mode.firstlast = this.chartNavbarFirstlast;
      if (typeof(this.navbar_mode.addremove )=='undefined') this.navbar_mode.addremove = this.chartNavbarAddRemove;
      if (typeof(this.navbar_mode.changepage)=='undefined') this.navbar_mode.changepage= this.chartNavbarChangepage;
      if (typeof(this.navbar_mode.lastpage  )=='undefined') this.navbar_mode.lastpage  = this.chartNavbarLastpage;
      if (typeof(this.navbar_mode.pagepanel )=='undefined') this.navbar_mode.pagepanel = this.chartNavbarPagepanel;
      this.w=w;
      this.h=h;
      this.minheight=h;
      this.setCtrlPos(this.Ctrl,x,y,this.w,this.h,anchor,form.width,form.height,false,true);
      if(Trim(this.help_tips)!='') this.Ctrl.title=this.help_tips;
      this.addToForm(this.form,this);
      this.setCtrlStdMethods(this);
      this.ztcharitem = null;
      this.zoomFilter={};
      this.language=ZtVWeb.Language;
      this.multi_autochange=CharToBool(""+multi_autochange);
      this.noDrawing = false;
      this.othlimits = othlimits;
      this.othlabel = othlabel;
      this.legendlimit = legendlimit;
      this.geo_0_field = geo_0_field;
      this.geo_1_field = geo_1_field;
      this.geo_value_field = geo_value_field;
      this.geo_dom_field = geo_dom_field;
      this.geo_view = geo_view;
      this.multi_scale = multi_scale;
      this.rangebands = rangebands;
      this.rowsToAdd = 5;
      this.valuezname = valuezname;
      this.enable_menu_sel = enable_menu_sel;
      this.exportFileName = exportFileName;
      this.geo_level = geo_level;
      this.selclicks = CharToBool(selclicks + "");
      this.exclicks = CharToBool(exclicks + "");

      // GESTIONE CTRL: POSIZIONI E SIZE
      this.getRenderHeight = function () {
        var h = 0;
        if(this.chartConfig && this.chartConfig.globalSettings)
          h=this.chartConfig.globalSettings.height;
        if (this.chartNavbar && document.getElementById(this.Ctrl.id+"_chartNavBar"))
          h+=document.getElementById(this.Ctrl.id+"_chartNavBar").offsetHeight;
        this.lastRenderHeight=(h>this.minheight?h:null)
        return this.lastRenderHeight;
      }
      this.adjustFormHeight = function (cnt) {
        if (this.form.Ctrl.offsetHeight==0 && (cnt==null || cnt<10)) {
           setTimeout(function(_this_,_cnt_){return function(){_this_.adjustFormHeight((_cnt_==null?0:_cnt_+1))}}(this,cnt),200)
        } else {
          var oh=this.lastRenderHeight
          if (oh!=this.getRenderHeight())
            this.form.queueAdjustHeight(50)
        }
      }
      this.setSize=function(_w,_h){
        // valutare se deprecato
        if (!Empty(_w)){
          this.w=_w;
          this.Ctrl.style.width=_w+'px'
        }
        if (!Empty(_h)){
          this.h=_h;
          this.Ctrl.style.height=_h+'px'
        }
      }
      this.setChartSize=function(w,h){
        // valutare se deprecato
        this.setSize(w,h);
        this.chartConfig.globalSettings.width = this.w;
        this.chartConfig.globalSettings.height = this.h;
        if (this.ztChart){
          this.ztChart.updateDraw(this.chartConfig);
        }
      }
      this._refresh = function () {
        if (!this.chartConfig || this.chartConfig.error || Empty(this.chartConfig.globalSettings))
          return;
        if (!this.refreshChart)
          return;
        if (this.refreshChart && (this.Ctrl.offsetWidth == 0 && this.Ctrl.offsetHeight == 0))
          return;
        this.chartConfig.globalSettings.width = this.Ctrl.offsetWidth || this.w;
        this.chartConfig.globalSettings.height = this.Ctrl.offsetHeight || this.h;
        this.ztChart.updateDrawCallback(this.chartConfig,null,null,true);
        delete this.refreshChart;
      }
      this.setCtrlStep = function(curStepObj) {
        if (!this.chartConfig || this.chartConfig.error || Empty(this.chartConfig.globalSettings))
          return;
        if (CharToBool(curStepObj.hide + ""))
          return;
        if (Empty(this.chartW) && Empty(this.chartH)) {
          this.w = parseFloat(this.Ctrl.offsetWidth);
          this.h = parseFloat(this.Ctrl.offsetHeight);
          this.chartConfig.globalSettings.width = this.w;
          this.chartConfig.globalSettings.height = this.h;
          this.ztChart.updateDraw(this.chartConfig);
        }
        else if(Empty(this.chartW) && !Empty(this.chartH)){
          this.w = parseFloat(this.Ctrl.offsetWidth);
          this.chartConfig.globalSettings.width = this.w;
          this.ztChart.updateDraw(this.chartConfig);
        }
        else if(!Empty(this.chartW) && Empty(this.chartH)){
          this.h = parseFloat(this.Ctrl.offsetHeight);
          this.chartConfig.globalSettings.height = this.h;
          this.ztChart.updateDraw(this.chartConfig);
        }
      }

      // GESTIONE EVENTO ON CLICK
      this.Ctrl.onmouseover = function (evt) {
        _this.ztcharitem = null;
        if (_this.name + '_onClick' in _this.form) {
          if (!Empty(_this.ztChart) && typeof(window[_this.ztChart.getChartId() + 'Click']) == 'undefined') {
            window[_this.ztChart.getChartId()+'Click'] = function (item) {
              _this.ztcharitem = item;
            }
          }
        }
      }
      this.Ctrl.onclick = function (evt) {
        if (_this.name + '_onClick' in _this.form) {
          _this.dispatchEvent('onClick', evt, _this.ztcharitem);
        }
      }

      // GESTIONE DATI E CAMPI
      this.makePropertyName = function (chartType, labelKey_field, measureKey_series_field, xKey_field) {
        if (Empty(chartType) || chartType=='category'){
          this.propertyName=this.label_field.split(',').concat(this.value_fields.split(','));
          if(!Empty(labelKey_field)){
            this.objConfig.keyField=labelKey_field;
            this.propertyName.splice(0,0,labelKey_field);
          }
        }
        else if (chartType=='measure'){
          this.propertyName=[this.min_field,this.max_field,this.val_field,this.measure_series_field];
          if(!Empty(measureKey_series_field)){
            this.objConfig.keyField=measureKey_series_field;
            this.propertyName.splice(0,0,measureKey_series_field);
          }
        }
        else if (chartType=='xyz'){
          this.propertyName=[this.x_field,this.y_field,this.z_field,this.xyz_series_field];
          if(!Empty(xKey_field)){
            this.objConfig.keyField=xKey_field;
            this.propertyName.splice(0,0,xKey_field);
          }
        }
        else if(chartType=='geo'){
          this.propertyName=[this.geo_0_field,this.geo_1_field,this.geo_value_field];
          if(!Empty(Trim(this.geo_dom_field)))
            this.propertyName.push(this.geo_dom_field);
        }
      }
      this.makePropertyName(chartType, labelKey_field, measureKey_series_field, xKey_field);

      this.FillData = function (datasource) {
        this.dontupdate = false; // force to draw - can be call by dataprovider
        this.datasource=datasource;
        this.dataobj=this.datasource.name;
        this.isSqlDataProvider=ZtVWeb.IsSQLDataProvider(this.datasource);
        if (this.chartConfig){
          if (!this.gendataset && datasource!=null){
            var multiDimensionalKeyList=[];
            var multiDimensionalLabelList=[];
            if (this.ismulti && !Empty(this.multi_key_field)){
              this.propertyValue={};
              if(this.multi_key_field.indexOf(",")==-1 && this.multi_key_field.indexOf(":")==-1){
                if (Empty(this.multi_label_field))
                  this.multi_label_field=this.multi_key_field;
                this.propertyValue={}
                for(i=0;i<datasource.getRecCount(); i++){
                  var key=datasource.getValue(i,this.multi_key_field);
                  if (Empty(this.propertyValue[key])){
                    var label=datasource.getValue(i,this.multi_label_field);
                    this.propertyValue[key]=[];
                    multiDimensionalKeyList.push(key)
                    multiDimensionalLabelList.push(label)
                  }
                  var tmp=[]
                  for (var j=0; j<this.propertyName.length; j++){
                    tmp.push(datasource.getValue(i,this.propertyName[j]));
                  }
                  this.propertyValue[key].push(tmp)
                }
                this.objConfig.multiDimensionalKeyList=multiDimensionalKeyList.toString();
                this.objConfig.multiDimensionalLabelList=multiDimensionalLabelList.toString();
              }
              else {
                if(this.multi_key_field.indexOf(",")>=0){
                  this.objConfig.multiDimensionalKeyList=this.multi_key_field;
                  if(Empty(this.multi_label_field))
                    this.objConfig.multiDimensionalLabelList=this.multi_key_field;
                  else
                    this.objConfig.multiDimensionalLabelList=this.multi_label_field;
                }
                else { // funzione
                  var f = this.multi_key_field;
                  if(!Empty(f)){
                    if(f.indexOf('function:')>-1) {
                      f=f.replace(/function:/g,'');
                      f=this.form.formid+'.'+f;
                    }
                    else if(f.indexOf('javascript:')>-1){

                    }
                    this.multi_key_field = eval(f);
                    this.objConfig.multiDimensionalKeyList=this.multi_key_field;
                    if(Empty(this.multi_label_field))
                      this.objConfig.multiDimensionalLabelList=this.multi_key_field;
                    else{
                      f = this.multi_label_field;
                      if(f.indexOf('function:')>-1) {
                        f=f.replace(/function:/g,'');
                        f=this.form.formid+'.'+f;
                        this.multi_label_field = eval(f);
                      }
                      else if(f.indexOf('javascript:')>-1){
                        this.multi_label_field = eval(f);
                      }
                      this.objConfig.multiDimensionalLabelList=this.multi_label_field;
                    }
                  }

                }
              }
            }
            else  {
              this.propertyValue=[];
              this.rows=this.datasource.nRows;
              for(i=0;i<datasource.getRecCount(); i++){
                this.propertyValue[i]=[];
                for (var j=0; j<this.propertyName.length; j++){
                  this.propertyValue[i][j]=datasource.getValue(i,this.propertyName[j]);
                }
              }
            }
          }
          this.ztChart=null;
          if (this.propertyValue.length!=0 && !this.noDrawing)
            this._drawChart();
          this.curRec=this.rows;
        }
      }

      // DISEGNO E UPDATE PARAMS
      this.drawChart=function(seriesColorList){
        if (this.Ctrl.offsetWidth == 0 && this.Ctrl.offsetHeight == 0)
          this.refreshChart = true;

        ZtVWeb.RequireLibrary(ZtVWeb.SPWebRootURL + '/HamburgerMenuObj.js');
        ZtVWeb.RequireCSS('AdditionalFonts.css');
        ZtVWeb.RequireCSS('ZtMask.css');
        if (Empty(document.title))	// forzo la scrittura del title della pagina web, perchè Chrome recuperava il primo tag title come titolo documento
          document.title = "";
        if (this.dontupdate) return;
        if (!this.gendataset) {
          var projectUrl = new JSURL("../servlet/SPCHTProxy?m_cAction=load&m_cConfigName=" + this.def, true);
          this.chartConfig = JSON.parse(projectUrl.Response());
          if (!this.chartConfig || this.chartConfig.error || Empty(this.chartConfig.globalSettings))
            return;
          this.chartConfig.globalSettings.width = this.Ctrl.offsetWidth || this.w;
          this.chartConfig.globalSettings.height = this.Ctrl.offsetHeight || this.h;
          if(!Empty(seriesColorList))
            this.chartConfig.graphSettings.colorSeries = seriesColorList;
          if (!Empty(this.datasource))
            this.FillData(this.datasource);
        }
        else {
          var strparms='' // parametri della query
          var valpar;
          var aparms=this.parms.split(',')
          for(var i=0,nome1,nome2;i<aparms.length;i++){
            if(Trim(aparms[i])!=''){
              if(aparms[i].indexOf('=')>-1){
                nome1=Trim(aparms[i].substring(0,aparms[i].indexOf('=')))
                nome2=Trim(aparms[i].substring(aparms[i].indexOf('=')+1))
              }
              else{
                nome1=Trim(aparms[i])
                nome2=Trim(nome1)
              }
              valpar=this.form[nome2].Value();
              //valpar=eval('this.form.'+nome2+'.Value()')
              strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))
            }
          }
          var parameters='?rows=1000&sqlcmd='+this.query+'&def='+this.def+'&title='+title+strparms+'&width='+this.w+'&height='+this.h;
          parameters+="&propertyName="+this.propertyName.toString();
          if(this.multi_key_field.indexOf(",")==-1 && this.multi_key_field.indexOf(":")==-1){
            parameters+="&multiKey="+this.multi_key_field;
            parameters+="&multiLabel="+this.multi_label_field;
          }

          parameters+="&legend="+this.legend;

          var propertyValue,chartConfig,multiKeyList,multiLabelList;
          var urlchart = new JSURL(ZtVWeb.SPWebRootURL+'/servlet/RPGenChartMap'+parameters, true)
          eval(urlchart.Response());
          this.chartConfig=chartConfig;
          if (!this.chartConfig || this.chartConfig.error || Empty(this.chartConfig.globalSettings))
            return;
          this.chartConfig.globalSettings.width = this.Ctrl.offsetWidth || this.w;
          this.chartConfig.globalSettings.height = this.Ctrl.offsetHeight || this.h;
          if (!Empty(multiKeyList)){
            this.objConfig.multiDimensionalKeyList=multiKeyList.toString();
            this.objConfig.multiDimensionalLabelList=multiLabelList.toString();
          }
          if (!Empty(propertyValue)){
            this.ztChart=null;
            this.propertyValue=propertyValue;
            if(!Empty(seriesColorList))
                this.chartConfig.graphSettings.colorSeries = seriesColorList;
            this._drawChart();
          }
        }
      }
      this._drawChart=function(){
        if (this.dontupdate) return;
        if (this.CtrlDiv)
          this.CtrlDiv.innerHTML='';
        this._updateParams();
        if(!Empty(this.ztChart)){
          this.ztChart.updateDraw(this.chartConfig,this.objConfig.otherChart);
          return;
        }
        var f=this.dsetFunct;
        var fobj={};
        if(!Empty(f)){
          if(f.indexOf('function:')>-1) {
            f=f.replace(/function:/g,'');
            f=this.form.formid+'.'+f;
          }
          else if(f.indexOf('javascript:')>-1){

          }
        }
        if(Empty(f)) fobj={}
        else {
          fobj={
            getData:function(key){return eval(f+'('+key+')')}
          }
        }
        if(this.linkObj.urlType=='script'){
          var url = this.linkObj.url;
          if(url.indexOf('function:')>-1) {
            url = url.replace(/function:/g,'');
            url = "window['" + this.form.formid + "']." + url;
            var urlsplit = url.split(",");
            url = "";
            for(var i=0; i<urlsplit.length - 1; i++)
              url += LRTrim(urlsplit[i]) + ",";
            url += LRTrim(urlsplit[urlsplit.length - 1]);
            this.linkObj.url = url;

            var zz = LibJavascript.AlfaKeyGen(5);
            var sname = this.linkObj.seriesname + zz + "_series_";
            var cname = this.linkObj.categoryname + zz + "_categories_";
            var vname = this.linkObj.valuename + zz + "_values_";
            var zname = this.linkObj.valuezname + zz + "_valuesz_";
            url = Strtran(url, ",", zz + ",");
            url = Strtran(url, ")", zz + ")");
            url = Strtran(url, this.linkObj.seriesname, sname);
            url = Strtran(url, this.linkObj.categoryname, cname);
            url = Strtran(url, this.linkObj.valuename, vname);
            url = Strtran(url, this.linkObj.valuezname, zname);
            url = Strtran(url,zz+",",",");
            url = Strtran(url,zz+")",")");
            this.linkObj.url = url;
            this.linkObj.seriesname = sname;
            this.linkObj.categoryname = cname;
            this.linkObj.valuename = vname;
            this.linkObj.valuezname = zname;
          }
        }
        if (!this.CtrlDiv){
          this.CtrlDiv=document.createElement("div");
          this.CtrlDiv.style.width="100%";
          this.CtrlDiv.style.height="100%";
          this.Ctrl.appendChild(this.CtrlDiv);
        }
        if(Empty(document.getElementById(this.Ctrl.id+"_chartNavBar"))){
          var mydiv = document.createElement("div");
          mydiv.setAttribute("id",this.Ctrl.id+"_chartNavBar");
          this.Ctrl.appendChild(mydiv);
          mydiv.style.width = this.Ctrl.offsetWidth+"px";
          mydiv.style.margin='1px 0 0 0';
          // mydiv.style.left = this.Ctrl.offsetLeft+"px";
          // mydiv.style.position='absolute';
        }
        else
          var mydiv = document.getElementById(this.Ctrl.id+"_chartNavBar");
        this._addNavBar(mydiv);
        this.objConfig.changeFields = false;
        this.objConfig.menuPosition = this.menuPosition;
        var chart = new ZtChart(this.chartConfig,this.objConfig,this.propertyName,this.propertyValue,this.CtrlDiv,fobj,this.linkObj, this.Ctrl.id+"_zchart");
        var ztmask = new ZtMask(chart,this,this.datasourceStructure);
        chart.ztmask = ztmask.id;
        chart.setLanguage(this.language);

        var cssLinks = document.getElementsByTagName('head')[0].getElementsByTagName("link");

        for(var i=0; i<cssLinks.length && !chart.applySpTheme; i++){
          if(cssLinks[i].href.indexOf("portalstudio.css")>=0)
            chart.applySpTheme=true;
        }

        if ((this.chartConfig.graphSettings.chartType=='SCATTER' || this.chartConfig.graphSettings.chartType=='BUBBLE') && (this.chartType!='xyz' || Empty(this.objConfig.labelSeries)))
          chart.setIsNewXYZ(false);

        // eventuale zoomfilter prima della draw
        if(!Empty(this.zoomFilter)){
          if(this.name+'_onFilterAction' in this.form){
            this.zoomFilter.dispatchFnc = function(e,action,start,end){ return _this.dispatchEvent("onFilterAction",e,action,start,end);};
          }
          chart.setZFObject(chart.dataSet,this.zoomFilter);
        }

        // eventuali serie da escludere in draw
        this.ztChart = chart;
        this.SetExcludedSeries(this.exclSeries);
        chart.drawThemeMenu = true;
        if(this.zoomFilter.show!="zoom")
          chart.draw();
        else
          chart.drawZoomFilter(this.CtrlDiv,0,0,chart.chartConfig.globalSettings.width,chart.chartConfig.globalSettings.height,chart.ZFObjConfig);
        this.ztChart.parentCtrl = this;
        this.adjustFormHeight();
      }
      this._updateParams=function(){
        // RECUPERO ELENCO CAMPI DATASOURCE
        var myQuery;
        if(this.gendataset)
          myQuery=this.query;
        else
          myQuery=this.datasource.cmd;
        this.datasourceStructure = getQueryFields(myQuery);
        // AGGIORNAMENTO objConfig
        this.objConfig = getObjConfigFromChartCtrl(this,true);
        // AGGIORNAMENTO chartConfig
        this.chartConfig = getChartConfigFromChartCtrl(this,this.chartConfig);
        // AGGIORNAMENTO linkObj
        this.linkObj.urlType = this.urlType;
        this.linkObj.url = this.url;
        this.linkObj.seriesname = this.seriesname;
        this.linkObj.categoryname = this.categoryname;
        this.linkObj.valuename = this.valuename;
        this.linkObj.valuezname = this.valuezname;
        this.linkObj.target = this.target;
        this.linkObj.popup = this.popup;
        this.linkObj.popup_height = this.popup_height;
        this.linkObj.popup_width = this.popup_width;
        // AGGIORNAMENTO zoomFilter
        this.zoomFilter.show = zfshow;
        this.zoomFilter.type = zftype;
        this.zoomFilter.update = CharToBool(""+zfupdate);
        this.zoomFilter.series = zfseries;
      }

      // NAVBAR
      this.Eof=function(){
        if(typeof(this.datasource.root) =='undefined') { // SQLDataProvider
          var tempRow=this.datasource.getRecCount();
          if(this.datasource.eof && (this.curRec > (tempRow-this.rows)))
            return true
          else
            return false
        }
        else //XMLDataProvider
          return (this.datasource.curRec+this.rows>this.datasource.getRecCount());
      }
      this.Bof=function(){
        if(typeof(this.datasource.root) =='undefined') { // SQLDataProvider
          if(this.datasource.Bof() && this.curRec==1){
            return true
          }
          else{
            return false
          }
        }
        else { //XMLDataProvider
          return this.datasource.Bof();
        }
      }
      this.GetPages=function(){
        return Math.max(1,Math.ceil(this.datasource.getAllRecsCount()/this.rows))
      }
      this.GetCurPage=function(){
        return Math.ceil(this.datasource.getGlobalCurRec()/this.rows)
      }
      this.EopReached=function(){
        return this.datasource.getEofReached()
      }
      this.Eop=function(){ //End of pages
        return(this.GetCurPage()>=this.GetPages() && this.EopReached())
      }
      this.Bop=function(){ //Begin of pages
        return this.GetCurPage()==1
      }
      this._addNavBar=function(mydiv){
        var src_array="";
        var SPTheme=window.SPTheme["grid"]||window.SPTheme;
        if(!this.gendataset && this.chartNavbar && !(this.Eop() && this.Bop()) ){
          // if(this.colspan==0) this.colspan=this.titles.length;
          var cell_bg_color= "";//EmptyString(title_color) ? this.row_color : title_color;
          var font_color,font,font_size;
          src_array = src_array.concat('<div><table id="tbl'+this.ctrlid+'_navbar" class="'+this.class_nav_bar+'"'+
          ( this.navbarStyle == 'stretch' ? ' width="100%"' : "") +
          'border="0" cellspacing="0" cellpadding="0" style="text-decoration:none;'+(cell_bg_color?'background-color:'+cell_bg_color+';':'')+(font_color?'color:'+font_color+';':"")+(font?'font-family:'+font+";":"")+
          (font_size?"font-size:"+font_size+';':"")+'"><tr><td nowrap align="left" style=";">');
          if(this.Bop()) {
            if (this.navbar_mode.firstlast)
              src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_first_dis"
                , image : (SPTheme.grid_img_navbar_first_dis?SPTheme.grid_img_navbar_first_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_first_dis.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , title : this.Translations["First_page"]
                , alt : "First page"
                })
              );

            src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
              , className : "grid_prev_dis"
              , image : (SPTheme.grid_img_navbar_prev_dis?SPTheme.grid_img_navbar_prev_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_prev_dis.png")
              , image_attr : "no-repeat center center"
              , style : 'vertical-align:middle;border:0;'
              , title : this.Translations["Previous_page"]
              , alt : "Previous page"
              })
            );
          }
          else{
            if (this.navbar_mode.firstlast)
              src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_first"
                , image : (SPTheme.grid_img_navbar_first?SPTheme.grid_img_navbar_first:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_first.png")
                , image_attr : "no-repeat center center"
                , events : 'onclick="'+global_js_id+'.FirstPage();"'
                , style : 'vertical-align:middle;border:0;cursor:pointer;'
                , title : this.Translations["First_page"]
                , alt : "First page"
                })
              );

            src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
              , className : "grid_prev"
              , image : (SPTheme.grid_img_navbar_prev?SPTheme.grid_img_navbar_prev:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_prev.png")
              , image_attr : "no-repeat center center"
              , events : 'onclick="'+global_js_id+'.PrevPage();"'
              , style : 'vertical-align:middle;border:0;cursor:pointer;'
              , title : this.Translations["Previous_page"]
              , alt : "Previous page"
              })
            );
          }
          if (this.navbar_mode.addremove || this.navbar_mode.pagepanel)
            src_array = src_array.concat("</td><td style='width:98%;text-align:center;vertical-align:middle;'>");

          if (this.navbar_mode.addremove)
            src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
              , className : "grid_minus"
              , image : (SPTheme.grid_img_navbar_rem_rows?SPTheme.grid_img_navbar_rem_rows:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_minus.png")
              , image_attr : "no-repeat center center"
              , events : 'onclick="'+global_js_id+'.RemoveRows();"'
              , style : 'vertical-align:middle;border:0;cursor:pointer;'
              , title : this.Translations["Remove_rows"]
              , alt : "Remove Rows"
              })
            );

          if (this.navbar_mode.pagepanel){
            src_array = src_array.concat('<span id="'+this.ctrlid+'_page_numbers"'+(this.navbar_mode.changepage?' title="'+(this.Translations["Change_page"]||"Change page")+'"':'')+' >'+this.Translations["Page"]+"&nbsp;"+
            (this.navbar_mode.changepage?"<input id='"+this.ctrlid+"_PageSelector' type='text' value='"+this.GetCurPage()+"' size='"+(""+this.GetCurPage()).length+"' onblur='javascript:"+global_js_id+".GoToPage()' onKeydown='javascript:"+global_js_id+".selector_keydown(event)' class='grid_navbar_curpage_input'/>":this.GetCurPage())+"&nbsp;"+
            (this.navbar_mode.lastpage ? this.Translations["Of"]+"&nbsp;"+
            (this.navbar_mode.changepage?"<input type='text' readonly class='grid_navbar_totpages_input' value='"+this.GetPages()+(this.EopReached()?"":"+")+"'/>":this.GetPages()+(this.EopReached()?"":"+")) : "")+
            '</span>');
          }
          if (this.navbar_mode.addremove)
            src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
              , className : "grid_plus"
              , image : (SPTheme.grid_img_navbar_add_rows?SPTheme.grid_img_navbar_add_rows:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_plus.png")
              , image_attr : "no-repeat center center"
              , events : 'onclick="'+global_js_id+'.AddRows(event);"'
              , style : 'vertical-align:middle;border:0;cursor:pointer;'
              , title : this.Translations["Add_rows"]
              , alt : "Add Rows"
              })
            );

          src_array = src_array.concat("</td><td nowrap align='right' style=';'>");
          if(this.Eop()) {
            src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
              , className : "grid_next_dis"
              , image : (SPTheme.grid_img_navbar_next_dis?SPTheme.grid_img_navbar_next_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_next_dis.png")
              , image_attr : "no-repeat center center"
              , style : 'vertical-align:middle;border:0;'
              , title : this.Translations["Next_page"]
              , alt : "Next page"
              })
            );

            if (this.navbar_mode.firstlast)
              src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_last_dis"
                , image : (SPTheme.grid_img_navbar_last_dis?SPTheme.grid_img_navbar_last_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_last_dis.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , title : this.Translations["Last_page"]
                , alt : "Last page"
                })
              );
          } else {
            src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
              , className : "grid_next"
              , image : (SPTheme.grid_img_navbar_next?SPTheme.grid_img_navbar_next:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_next.png")
              , image_attr : "no-repeat center center"
              , events : 'onclick="'+global_js_id+'.NextPage();"'
              , style : 'vertical-align:middle;border:0;cursor:pointer;'
              , title : this.Translations["Next_page"]
              , alt : "Next page"
              })
            );
            if (this.navbar_mode.firstlast) {
              if(this.datasource.querycount==-1)
                src_array =src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_last_dis"
                  , image : (SPTheme.grid_img_navbar_last_dis?SPTheme.grid_img_navbar_last_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_last_dis.png")
                  , image_attr : "no-repeat center center"
                  , style : 'vertical-align:middle;border:0;'
                  , title : this.Translations["Last_page"]
                  , alt : "Last page"
                  })
                );
              else
                src_array = src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_last"
                  , image : (SPTheme.grid_img_navbar_last?SPTheme.grid_img_navbar_last:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_last.png")
                  , image_attr : "no-repeat center center"
                  , events : 'onclick="'+global_js_id+'.LastPage();"'
                  , style : 'vertical-align:middle;border:0;cursor:pointer;'
                  , title : this.Translations["Last_page"]
                  , alt : "Last page"
                  })
                );
            }
          }
          src_array = src_array.concat("</td></tr></table></div>");
          mydiv.className="grid";
          mydiv.innerHTML=src_array;
        }
      }
      this.SetCurRec=function(newCurRec){
        var oldCurRec=this.datasource.curRec;
        if(oldCurRec!=newCurRec){
          this.dispatchEvent('BeforeRowChange',oldCurRec,newCurRec);
          this.datasource.curRec=newCurRec;
          this.datasource.refreshConsumers(false);
          this.dispatchEvent('AfterRowChange',newCurRec,oldCurRec);
        }
      }
      this.NextPage=function(){
        var rows=this.rows
        var changed=false
        if(typeof(this.datasource.root)=='undefined'){ //SQLDataProvider
          if(Math.ceil(this.curRec/rows)==Math.ceil(this.datasource.getRecCount()/rows)){
            this.dispatchEvent('BeforeRowChange',this.curRec,1);
            if(!this.datasource.NextPage()){
              this.SetCurRec(this.curRec)
            }
            this.dispatchEvent('AfterRowChange',this.curRec,1);
          }
          else{
            this.SetCurRec(Math.floor(((this.curRec+rows)-1)/rows)*rows+1)
          }
          if(this.datasource.Bof()) this.startRows++;
        }
        else { //XMLDataProvider
          if(this.datasource.curRec+this.rows<=this.datasource.GetQueryCount()){
            this.datasource.curRec+=this.rows;
            changed=true
          }
          else if(!this.datasource.eof && this.datasource.curRec+this.rows!=this.datasource.GetQueryCount()){
            this.datasource.curRec=this.datasource.GetQueryCount()
            changed=true
          }
          this.datasource.refreshConsumers(false);
        }
        if(parent.effectOpenClose) parent.effectOpenClose(this.form.portletname+"_portlet.jsp",true)
        return(changed)
      }
      this.PrevPage=function(){
        var rows=this.rows
        var changed=false
        if(typeof(this.datasource.root)=='undefined') { //SQLDataProvider
          if (this.curRec>rows){
            this.SetCurRec( Math.floor(((this.curRec-rows)-1)/rows)*rows+1)
          }
          else {
            if(this.curRec!=1 || !this.datasource.Bof()){
              this.atEndRender='prevpage'
              this.datasource.atQueryEnd="lastpage "+rows
              this.dispatchEvent('BeforeRowChange',this.curRec,1);
              this.datasource.PrevPage();
              this.dispatchEvent('AfterRowChange',this.curRec,1);
              changed=true
            }
          }
        }
        else { //XMLDataProvider
          if(this.datasource.curRec-rows<1)
            this.datasource.curRec=1;
          else {
            this.datasource.curRec-=rows;
            changed=true
          }
          this.datasource.refreshConsumers(false);
        }
        if(parent.effectOpenClose) parent.effectOpenClose(this.form.portletname+"_portlet.jsp",true)
        return(changed)
      }
      this.FirstPage=function(){
        this.dispatchEvent('BeforeRowChange',this.curRec,1);
        this.datasource.FirstPage();
        this.dispatchEvent('AfterRowChange',this.curRec,1);
      }
      this.LastPage=function(){
        if(typeof(this.datasource.root)=='undefined'){ //SQLDataProvider
          this.datasource.atQueryEnd="lastpage "+this.rows;
          this.dispatchEvent('BeforeRowChange',this.curRec,1);
          this.datasource.LastPage()
          this.dispatchEvent('AfterRowChange',this.curRec,1);
        }
        else{//XMLDataProvider
          while(!this.datasource.Eof()){
            this.NextPage()
          }
        }
      }
      this.GoToPage=function(){
        var input = LibJavascript.DOM.Ctrl(this.ctrlid+"_PageSelector");
        var page=parseInt(input.value,10);
        if (isNaN(page) || page<1) {
          input.value=this.GetCurPage();
          input.focus();
          input.select();
          return;
        }
        if (page!=this.GetCurPage()){
          var rows=this.rows;
          var curRec = this.curRec=rows*parseInt((page-1),10)+1;
          this.dispatchEvent('BeforeRowChange',this.curRec,1);
          this.datasource.GoToPage(this.curRec);
          this.dispatchEvent('AfterRowChange',this.curRec,1);
          if(curRec>this.datasource.getAllRecsCount()) {
            this.LastPage()
            return;
          }
          curRec=curRec-(this.datasource.nStartRow||0);
          this.SetCurRec(curRec)
        }
      }
      this.AddRows=function(event){
        var rows=this.rows+this.rowsToAdd;
        var mult=this.datasource.nRows/this.rows;
        var actual=this.datasource.getGlobalCurRec();
        if (typeof(this.datasource.nRows)!='undefined') {
          this.datasource.nRows=this.datasource.nRows+this.rowsToAdd*mult;
          this.datasource.nStartRow=(Math.ceil(actual/this.datasource.nRows)-1)*this.datasource.nRows;
        }
        this.rows=rows;
        this.datasource.curRec=actual-(this.datasource.nStartRow||0);
        this.preserveData=true;
        this.datasource.keepCurRec=true;
        this.Refresh();
        this.dispatchEvent('RowsChanged',rows);
      }
      this.RemoveRows=function(){
        var rows=Math.max(this.rows-this.rowsToAdd,1);
        var mult=this.datasource.nRows/this.rows;
        var actual=this.datasource.getGlobalCurRec();
        if (typeof(this.datasource.nRows)!='undefined') {
          this.datasource.nRows=this.datasource.nRows-this.rowsToAdd*mult;
          if(this.datasource.nRows<=0) this.datasource.nRows=mult;
          this.datasource.nStartRow=(Math.ceil(actual/this.datasource.nRows)-1)*this.datasource.nRows;
        }
        this.rows=rows;
        this.datasource.curRec=actual-(this.datasource.nStartRow||0);
        this.datasource.keepCurRec=true;
        this.preserveData=true;
        this.Refresh();
        this.dispatchEvent('RowsChanged',rows);
      }
      this.Refresh=function(keep){
				this.datasource.keepCurRec=(keep?true:false);
        this.datasource.Query(true);
      }
      this.selector_keydown=function(e){
        var keyCode
        if (navigator.userAgent.toLowerCase().indexOf('msie')!=-1)
          keyCode=window.event.keyCode
        else
          keyCode=e.which
        if(keyCode==13) LibJavascript.DOM.Ctrl(this.ctrlid+"_PageSelector").onblur()
      }

      // GESTIONE FUNZIONI ESPOSTE
      this.Draw = function (query) {
        this.SetQuery(query);
        this.drawChart();
      }
      this.DontUpdate = function (dontupdate) {
        if (arguments.length) {
          this.dontupdate = dontupdate;
        }
        return this.dontupdate;
      }
      this.SetChartLanguage = this.setChartLanguage = function (lang, dontDraw) {
        this.ztChart.setLanguage(lang);
        if (!dontDraw)
          this._drawChart();
      }
      this.SetChartDef = this.setDef = function (defname) {
        if (!Empty(defname))
          this.def = defname;
      }
      this.SetQuery = function (query, parms) {
        if(!query) return;
        if (!this.gendataset) {
          this.gendataset = true;
          // molto probabilmente è settato anche un dsource
          this.datasource = null;
          this.dataobj = null;
        }
        this.query = query;
        this.parms = parms;
      }
      this.SetDataProvider = function (datapObj) {
        if(!datapObj) return;
        if (this.gendataset) {
          this.gendataset = false;
          // molto probabilmente è settato anche un dsource
          this.query = null;
          this.parms = null;
        }
        this.datasource = datapObj;
        this.dataobj = datapObj.name;
      }
      this.SetMultiDataset = function (keyList, labelList, keyStart, getDataFunc) {
        this.ismulti = true;
        this.multi_key_field = keyList;
        this.multi_label_field = labelList;
        this.key_start = keyStart;
        this.dsetFunct = getDataFunc;
      }
      this.SetFieldsCategoryChart = this.setFieldsCategoryChart = function (domainFld, valuesFld, seriesFld, keyFld) {
        this.label_field = domainFld;
        this.value_fields = valuesFld;
        this.label_series = seriesFld;
        this.labelKey_field = keyFld;

        this.propertyName = [];
        this.makePropertyName(this.chartType, this.labelKey_field);
      }
      this.SetFieldsXYZChart = this.setFieldsXYZChart = function (xFld, yFld, zFld, seriesFld, keyFld) {
        this.x_field = xFld;
        this.y_field = yFld;
        this.z_field = zFld;
        this.xyz_series_field = seriesFld;
        this.xKey_field = keyFld;

        this.propertyName = [];
        this.makePropertyName(this.chartType, null, null, this.xKey_field);
      }
      this.SetFieldsMeasureChart = this.setFieldsMeasureChart = function (domainFld, valuesFld, minFld, maxFld, keyFld) {
        this.min_field = minFld;
        this.max_field = maxFld;
        this.val_field = valuesFld;
        this.measure_series_field = domainFld;
        this.measureKey_series_field = keyFld;

        this.propertyName = [];
        this.makePropertyName(this.chartType, null, this.measureKey_series_field);
      }
      this.SetFieldsGeoChart = this.setFieldsGeoChart = function (countryFld, countrySubFld, valuesFld, seriesFld, geoLevel, geoView) {
        this.geo_0_field = countryFld;
        this.geo_1_field = countrySubFld;
        this.geo_value_field = valuesFld;
        this.geo_dom_field = seriesFld;
        if (geoLevel) {
          switch (geoLevel) {
            case "country":
              this.geo_level = "0";
              break;
            case "first":
              this.geo_level = "1";
              break;
            case "second":
              this.geo_level = "2";
              break;
            case "third":
              this.geo_level = "3";
              break;
            case "local":
              this.geo_level = "loc";
              break;
          }
        }
        this.geo_view = geoView;
        this.propertyName = [];
        this.makePropertyName(this.chartType);
      }
      this.SetTitles = function (title, subtitle, legendTitle) {
        this.title = title;
        this.subtitle = subtitle;
        this.titleSeries = legendTitle;
      }
      this.SetAxisTitles = function (xaxis, yaxis, percaxis) {
        this.x_label = xaxis;
        this.y_label = yaxis;
        this.percent_label = percaxis;
      }
      this.HideLegend = this.hideLegend = function () {
        this.legend = "hide";
        this._drawChart();
      }
      this.ShowLegend = function (position) {
        this.legend = position;
        this._drawChart();
      }
      this.SetLegendLimit = function (limit) {
        this.legendlimit = limit;
      }
      this.HideValueLabels = this.hideValueLabels = function () {
        this.value_labels = "0";
        this._drawChart();
      }
      this.ShowValueLabels = this.showValueLabels = function () {
        this.value_labels = "1";
        this._drawChart();
      }
      this.SetValueAxisParameters = function (min, max, tick) {
        if (min)
          this.setMinimumValue(min);
        if (max)
          this.setMaximumValue(max);
        if (tick)
          this.setTickUnit(tick);
      }
      this.SetDataLoadDateLimit = this.setDataLoadDateLimit = function (value) {
        this.dataload_datelimit = value;
        this._drawChart();
      }
      this.SetFocusKey = this.setFocusKey = function (key) {
        this.focuskey = key;
      }
      this.SetRealChartSize = function (width, height) {
        if (!Empty(width))
          this.chartW = width;
        if (!Empty(height))
          this.chartH = height;
      }
      this.HideChartMenu = function () {
        this.menuPosition = "hide";
      }
      this.ShowChartMenu = function (position) {
        this.menuPosition = position;
      }
      this.HasAggregateData = this.haveAggregateData = function () {
        if(!Empty(this.ztChart))
          return this.ztChart.haveOthersData();
        return false;
      }
      this.SetAggregateData = function (limits, labels) {
        this.othlimits = limits;
        this.othlabel = labels;
      }
      this.GetAggregateData = this.getAggregateData = function (vFields) {
        if(!Empty(this.ztChart))
          return this.ztChart.getOthersData(vFields);
        return [];
      }
      this.SetDataOrder = function (dorder) {
        this.data_order = dorder;
      }
      this.ChangeDataOrderOnChart = function (enable) {
        this.enable_change_order = false;
        if (enable)
          this.enable_change_order = true;
      }
      this.VisualEffectOnClick = function (enable) {
        this.selclicks = CharToBool(enable + "");
        if(!Empty(this.ztChart)){
          this.ztChart.setEnableClick(this.selclicks);
          this.ztChart.setEnableLegendClick(this.selclicks);
        }
      }
      this.ExcludingOnDoubleClick = function (enable) {
        this.exclicks = CharToBool(enable + "");
        if(!Empty(this.ztChart)){
          this.ztChart.setEnableExclude(this.exclicks);
        }
      }
      this.SetOtherChartTypes = function (list) {
        this.other_chart = list;
      }
      this.SetDownloadFile = function (exts, name) {
        this.exportFileName = name;
        this.downloadlist = exts;
      }
      this.SetExcludedSeries = function (list) {
        this.exclSeries = list;
        if (!Empty(this.ztChart) && !Empty(this.exclSeries))
          this.ztChart.setExcludedSeries(this.exclSeries);
      }
      this.AddRangeBand = this.addRangeBand = function (label, minValue, maxValue, color, isPercent, imgPath) {
        if(!Empty(this.ztChart)) this.ztChart.addRangeBand(label, minValue, maxValue, color, isPercent, imgPath);
        else {
          if(!this.objConfig.rangeBands || Empty(this.objConfig.rangeBands))
            this.objConfig.rangeBands = [];
          var rb = {
            label: lab || "",
            minValue: min || null,
            maxValue: max || null,
            color: col || "",
            percent: perc || false,
            imageUrl: img || ""
          };
          this.objConfig.rangeBands.push(rb);
        }
      }
      this.ClearRangeBands = this.clearRangeBands = function () {
        if(!Empty(this.ztChart)) this.ztChart.clearRangeBands();
        else
          this.objConfig.rangeBands = [];
      }
      this.RemoveRangeBands = this.removeRangeBands = function () {
        if(!Empty(this.ztChart)) this.ztChart.removeRangeBands();
      }
      this.GetCSVdata = this.getCSVdata = function (getSelection) {
        if(!Empty(this.ztChart))
          return this.ztChart.getCSVdata(getSelection);
        else
          return "";
      }
      this.GetXMLdata = this.getXMLdata = function (getSelection) {
        if(!Empty(this.ztChart))
          return this.ztChart.getXMLdata(getSelection);
        else
          return "";
      }
      this.GetPngB64 = this.getPngB64 = function () {
        if(!Empty(this.ztChart))
          return this.ztChart.getPngB64();
        else
          return "";
      }
      this.GetJpegB64 = this.getJpegB64 = function () {
        if(!Empty(this.ztChart))
          return this.ztChart.getJpegB64();
        else
          return "";
      }
      this.GetPdfB64 = this.getPdfB64 = function () {
        if(!Empty(this.ztChart))
          return this.ztChart.getPdfB64();
        else
          return "";
      }
      this.SetScriptHyperlink = function (urlFnc, categoryname, valuename, valuezname, seriesname, catkeyname) {
        this.linkObj.urlType = this.urlType = "script";
        this.linkObj.url = this.url = urlFnc;
        this.linkObj.seriesname = this.seriesname = seriesname;
        this.linkObj.categoryname = this.categoryname = categoryname;
        this.linkObj.valuename = this.valuename = valuename;
        this.linkObj.valuezname = this.valuezname = valuezname;
        this.linkObj.categoryKeyName = catkeyname;
        this.linkObj.target = this.target = null;
        this.linkObj.popup = this.popup = null;
        this.linkObj.popup_height = this.popup_height = null;
        this.linkObj.popup_width = this.popup_width = null;
      }
      this.SetLinkHyperlink = function (urlFnc, categoryname, valuename, valuezname, seriesname, catkeyname, target, popup, ph, pw) {
        this.linkObj.urlType = this.urlType = "link";
        this.linkObj.url = this.url = urlFnc;
        this.linkObj.seriesname = this.seriesname = seriesname;
        this.linkObj.categoryname = this.categoryname = categoryname;
        this.linkObj.valuename = this.valuename = valuename;
        this.linkObj.valuezname = this.valuezname = valuezname;
        this.linkObj.categoryKeyName = catkeyname;
        this.linkObj.target = this.target = target;
        this.linkObj.popup = this.popup = popup;
        this.linkObj.popup_height = this.popup_height = ph;
        this.linkObj.popup_width = this.popup_width = pw;
      }
      this.GetSelectedItems = function () {
        if (!Empty(this.ztChart))
          return this.ztChart.getSelectedItems();
        else
          return [];
      }
      this.GetExcludedCategories = function () {
        var ret = [];
        if (!Empty(this.ztChart))
          ret = this.ztChart.getExclusions().categories;
        return ret;
      }
      this.GetExcludedSeries = function () {
        var ret = [];
        if (!Empty(this.ztChart))
          ret = this.ztChart.getExclusions().series;
        return ret;
      }
      // METODI ESPOSTI-DEPRECATI MA MANTENUTI X COMPATIBILITA'
      this.setFields = function (domain, values, series, keyFld) {
        switch (this.chartType) {
          case "xyz":
            var varr = values.split(",");
            this.setFieldsXYZChart(domain, varr[0], varr[1], series, keyFld);
            break;
          case "measure":
            var varr = values.split(",");
            this.setFieldsMeasureChart(domain, varr[2], varr[0], varr[1], keyFld);
            break;
          case "geo":
            var darr = domain.split(",");
            this.setFieldsGeoChart(darr[0], darr[1], values, series);
            break;
          default:
            this.setFieldsCategoryChart(domain, values, series, keyFld);
            break;
        }
      }
      this.showLegendLeft = function () {
        this.legend = "left";
        this._drawChart();
      }
      this.showLegendRight = function () {
        this.legend = "right";
        this._drawChart();
      }
      this.showLegendTop = function () {
        this.legend = "top";
        this._drawChart();
      }
      this.showLegendBottom = function () {
        this.legend = "bottom";
        this._drawChart();
      }
      this.setMinimumValue = function (value) {
        this.min_value = value;
        this._drawChart();
      }
      this.setMaximumValue = function (value) {
        this.max_value = value;
        this._drawChart();
      }
      this.setTickUnit = function (value) {
        this.tick_unit = value;
        this._drawChart();
      }
      this.setChartConfig=function(){
        // valutare se deprecare
        var projectUrl = new JSURL("../servlet/SPCHTProxy?m_cAction=load&m_cConfigName=" + this.def, true);
        this.chartConfig = JSON.parse(projectUrl.Response());
      }
    }
    this.ChartCtrl.prototype = new this.StdControl;

    // Tabs------------------------------------------------------------------------------------------------------------
    this.TabsCtrl=function(form,id,x,y,w,h,font,font_size,font_color,bg_color,selected_color,vertical,cell_distr,links,href,target,anchor,name,selected_item,font_weight,class_Css,class_Css_2){
      if(Trim(selected_color)=='')
        selected_color=bg_color
      this.Num=5
      this.name=name
      this.id=id
      this.form=form
      this.links=links
      this.href=href
      this.target=target
      this.vertical=vertical
      this.bg_color=bg_color
      this.selected_item=selected_item
      this.class_Css=class_Css
      this.class_Css_2=class_Css_2
      this.selected_color=selected_color
      this.vertical=vertical
      this.Ctrl=document.getElementById(this.id)
      this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height)
      this.setCtrlStdMethods(this)
      this.addToForm(this.form,this)
      var targetlink='_self'
      //funzione di disegno tabs
      this.FillTabs=function(){
        if(this.links.indexOf('javascript:')>-1){
          var linkfunc=Strtran(this.links,'javascript:',''),
              hreffunc=Strtran(this.href,'javascript:',''),
              targetfunc=Strtran(this.target,'javascript:','');
          if(linkfunc.indexOf('ZtVWeb.')>-1){links=eval(linkfunc)}else{links=eval('this.form.'+linkfunc)}
          if(hreffunc.indexOf('ZtVWeb.')>-1){this.href=eval(hreffunc)}else{this.href=eval('this.form.'+hreffunc)}
          if(targetfunc.indexOf('ZtVWeb.')>-1){target=eval(targetfunc)}else{target=eval('this.form.'+targetfunc)}
          links=links.split(',')
          href=this.href.split(',')
          target=target.split(',')
        }else{
          links=this.links.split(',')
          href=this.href.split(',')
          target=this.target.split(',')
        }
        this._links=links;
        var src;
        if(this.vertical=='false'){
          src="<table id='"+this.id+"tab' height=100% width=100% border=0 cellspacing=2 cellpadding=0><tr>"
          var _w=cell_distr=='equispaced' ? 'width:'+Math.floor((100/links.length))+'%;' : '';
          for(var ii=0;ii<links.length;ii++){
            //separatore | di variabili nella chiamata funzioni nell'href
          if(typeof(href[ii])!='undefined'){
            while(href[ii].indexOf('|')>-1)
              href[ii]=href[ii].replace('|',',')
            }
            if(typeof(target[ii])=='undefined' || target[ii]==' ')
              targetlink='_self'
            else
              targetlink=target[ii]
            src+="<td align=center class='"+class_Css+"' style='"+_w+(this.bg_color?"background-color:"+this.bg_color:"")+"'><a href=\""+ZtVWeb.makeStdLink(href[ii],0,null,null,this.form,true)+" \" target='"+targetlink+"' onclick='"+'window.'+this.form.formid+"."+this.name+".selectedColor(event,\""+this.selected_color+"\",\""+this.bg_color+"\",\"false\")' style=\"text-decoration:none;"+(font_color?"color:"+font_color+";":"")+(font_weight?"font-weight:"+font_weight+";":"")+(font?"font-family:"+font+";":"")+(font_size?"font-size:"+font_size+";":"")+"\">"+links[ii]+"</a></td>"
          }
          src+="</tr></table>"
        }else{
          src="<table  id='"+this.id+"tab' height=100% width=100% border=0 cellspacing=2 cellpadding=0>"
          for(ii=0;ii<links.length;ii++){
            //separatore | di variabili nella chiamata funzioni nell'href
            if(typeof(href[ii])!='undefined'){
              while(href[ii].indexOf('|')>-1)
                href[ii]=href[ii].replace('|',',')
            }
            if(typeof(target[ii])=='undefined' || target[ii]==' ')
              targetlink='_self'
            else
             targetlink=target[ii]
            src+="<tr><td align=center class='"+class_Css+"' style='"+(this.bg_color?"background-color:"+this.bg_color:"")+"'><a href=\""+href[ii]+" \" target='"+targetlink+"' onclick='"+'window.'+this.form.formid+"."+this.name+".selectedColor(event,\""+this.selected_color+"\",\""+this.bg_color+"\",\"true\")' style=\"text-decoration:none;"+(font_color?"color:"+font_color+";":"")+(font_weight?"font-weight:"+font_weight+";":"")+(font?"font-family:"+font+";":"")+(font_size?"font-size:"+font_size+";":"")+"\">"+links[ii]+"</a></td></tr>"
          }
          src+="</table>"
        }
        this.Ctrl.innerHTML=src
        if(Trim(this.selected_item)!='')
          this.Select(this.selected_item)
      }

      this.selectedColor=function(e,selectcolor,bg_color,vertical){
      	var td=GetEventSrcElement(e).parentNode,
            table=td.parentNode.parentNode.parentNode, j;
        if(vertical=='false'){
          this.selected_lnk=td.cellIndex;
          for(j=0;j<table.rows[0].cells.length;j++){
            if(!Empty(bg_color))
              table.rows[0].cells[j].style.backgroundColor=bg_color;
            else
              table.rows[0].cells[j].className=this.class_Css;
             if(!Empty(bg_color))
               table.rows[0].cells[j].firstChild.style.backgroundColor=bg_color;
          }
          td=GetEventSrcElement(e).parentNode
          if(!Empty(selectcolor)) td.style.backgroundColor=selectcolor;
            else td.className=this.class_Css_2
          if(!Empty(selectcolor))
            td.firstChild.style.backgroundColor=selectcolor;
        }else{
          this.selected_lnk=td.parentNode.rowIndex;
          for(j=0;j<table.rows.length;j++){
            if(!Empty(selectcolor))
              table.rows[j].cells[0].style.backgroundColor=bg_color;
            else
              table.rows[j].cells[0].className=this.class_Css;
            if(!Empty(selectcolor))
              table.rows[j].cells[0].firstChild.style.backgroundColor=bg_color;
          }
          td=GetEventSrcElement(e).parentNode
          if(!Empty(selectcolor))
            td.style.backgroundColor=selectcolor;
          else
            td.className=this.class_Css_2
          if(!Empty(selectcolor))
            td.firstChild.style.backgroundColor=selectcolor;
        }
      }
      this.GetSelectedLink=function(){
        return this._links[this.selected_lnk];
      }
      this.Select=function(n){
        var table=document.getElementById(this.id+"tab");
        if(table!=null){
          var td,j,
              found=false;
          if(this.vertical=='false'){
            for(j=0;j<table.rows[0].cells.length;j++){
              if(!EmptyString(this.bg_color)) {
                table.rows[0].cells[j].style.backgroundColor=this.bg_color;
                // table.rows[0].cells[j].firstChild.style.backgroundColor=this.bg_color;
              }
              if(Empty(this.bg_color)) {
                table.rows[0].cells[j].className=this.class_Css;
                // table.rows[0].cells[j].firstChild.className=this.class_Css;
              }
              if(j==(n-1)){
                td=table.rows[0].cells[j]
                if(Empty(this.selected_color)) {
                  td.className=this.class_Css_2;
                  // td.firstChild.className=this.class_Css_2;
                } else {
                  td.style.backgroundColor=this.selected_color;
                  td.firstChild.style.backgroundColor=this.selected_color;
                }
              }
            }
          }else{
            for(j=0;j<table.rows.length;j++){
              if(!EmptyString(this.bg_color)) {
                table.rows[j].cells[0].style.backgroundColor=this.bg_color;
              table.rows[j].cells[0].firstChild.style.backgroundColor=this.bg_color;
              }
              if(Empty(this.bg_color)) {
                table.rows[j].cells[0].className=this.class_Css;
              // table.rows[j].cells[0].firstChild.className=this.class_Css;
              }
              if(j==(n-1)){
                td=table.rows[j].cells[0]
                if(Empty(this.selected_color)) {
                  td.className=this.class_Css_2;
                  // td.firstChild.className=this.class_Css_2;
                }else {
                  td.style.backgroundColor=this.selected_color;
                  td.firstChild.style.backgroundColor=this.selected_color;
                }
              }
            }
          }
          if(found){
          	this.selected_lnk=n-1;
          }
        }else{
          this.selected_item=n+''
        }
      }
    }
    this.TabsCtrl.prototype=new this.StdControl

    // Iframe------------------------------------------------------------------------------------------------------------
    this.IframeCtrl=function(form,id,name,x,y,w,h,name_iframe,auto_resize,default_portlet,border,anchor,layout_steps_values){
      if (Empty(default_portlet))
        default_portlet="javascript:[].join()";
      else if(default_portlet.indexOf('http://')==-1 && default_portlet.indexOf('https://')==-1)
        default_portlet = ZtVWeb.SPWebRootURL+"/jsp/" + default_portlet
      this.id=id
      this.name=name
      this.name_iframe=name_iframe
      this.form=form
      this.Ctrl=document.getElementById(id)
      this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true);
      this.setCtrlStdMethods(this);
      this.addToForm(this.form,this)
      this.height=h
      this.oldheight=h
      this.minheight=h
      this.oldwidth=w
      this.auto_resize=auto_resize;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
	    this.execOnLoad;
      var _this=this;
      //this.leftposition=x+w
      var src = "<iframe name='"+name_iframe+"' id='"+id+"_iframe' marginwidth=0 marginheight=0 allowtransparency='true' frameborder=0 spparentobjid='"+this.form.formid+"' ";
      if (this.auto_resize=='true'){
        src += "style='width:100%;height:1px;vertical-align:top;' scrolling=no portlet_id='"+this.form.formid+"'></iframe>"
      }else
        src += "style='width:100%;height:100%' toResize='no'></iframe>"
      this.Ctrl.innerHTML=src;
      this.iframe=document.getElementById(id+'_iframe');
      if(ZtVWeb.IsMobile()){
        this.iframe.style.WebkitOverflowScrolling = "touch";
      }
      this.checkExtUrl=function(){
        if(this.iframe.src.indexOf('http://')>-1 || this.iframe.src.indexOf('https://')>-1){
          return this.iframe.src.indexOf(window.location.origin)!=0;
        }
        return false;
      }
      if(!Empty(default_portlet))
        this.iframe.src=default_portlet;
      if (border=='true')
        this.iframe.style.border='1px ridge gray'
      else
        this.iframe.style.border='none';
      //carica nel frame corrente l'url specificato
      this.Load=function(url){
        if(url.indexOf('http://')>-1 || url.indexOf('https://')>-1)
          this.iframe.src=url
        else
          this.iframe.src=ZtVWeb.SPWebRootURL+'/jsp/'+url
        if (this.simulateonload) setTimeout('window.'+this.form.formid+'.'+this.name_iframe+'.simulateonloadfunc()',200);
      }
      this.lastRenderHeight=null;

      this.setExecOnLoad=function(txt){
      txt=txt.replace(/\|/g,',')
      if(txt.indexOf('function:')>-1) {
        txt=txt.replace(/function:/g,'');
        txt='javascript:'+this.form.formid+'.'+txt;
      }
      this.execOnLoad=txt;
      }

      this.adjustFormHeight=function(cnt){
        if (this.form.Ctrl.offsetHeight==0 && (cnt==null || cnt<10)) {
          setTimeout('window.'+this.form.formid+'.'+this.name_iframe+'.adjustFormHeight('+(cnt==null?0:cnt+1)+')',200);
        } else {
          var oh=this.lastRenderHeight;
          if (oh!=this.getRenderHeight()){
            this.form.queueAdjustHeight(50);
          }
        }

      }
    this.getRenderHeight=function(){
      var ctrl=this.iframe;
      if (ctrl!=null){
        var h=ctrl.offsetHeight
        this.lastRenderHeight=(h>this.minheight?h:null)
      } else {
        this.lastRenderHeight=null
      }
      return this.lastRenderHeight
    }
    //fa il reload del frame corrente
    this.Reload=function(){
      this.iframe.src=this.iframe.src
      if (this.simulateonload) setTimeout('window.'+this.form.formid+'.'+this.name_iframe+'.simulateonloadfunc()',200)
    }
    //fa il resize forzato del frame corrente
    this.Resize=function(h,w){
      this.iframe.style.height=h+'px'
      this.iframe.style.width=w+'px'
      this.adjustFormHeight();
    }
    this.MoveTo=function(t,l){
     this.setCtrlPos(this.Ctrl,l,t,this.oldwidth,this.height,this.anchor,this.form.width,this.form.height);
    }
    //--------------Cotrolli-dopo-il-caricamento------------------------------------------------------------
    this.frameloaded = function (oldh) {
      this.dispatchEvent('Loaded');
      this.frameresize(oldh);
      if (this.execOnLoad)
        eval(this.execOnLoad);
    }
    this.frameresize = function(oldh){
      var iframe = this.iframe; //document.getElementById(id+'_iframe');
      if (this.auto_resize != 'true')
        return;
      if ('m_nPreferredHeight' in iframe.contentWindow) { // e' una servlet dentro l'IFRame
        var obj_size = iframe.contentWindow.GetWindowPreferredSize()
          iframe.style.height = obj_size.h + 'px';
        //Implementazione Alberto
        iframe.style.width = (obj_size.w == '100%' ? obj_size.w : obj_size.w + 'px');
        if (obj_size.h != this.minheight || iframe.style.width == '100%')
          this.adjustFormHeight();
      } else {
        var isie = navigator.userAgent.indexOf("MSIE") != -1
          try {
            //
            iframe.style.height = "1px";
            //resettare prima l'altezza per forzare l'aggiornamento delle variabili offset-scroll/Height
            var newh = iframe.contentWindow.document.body.scrollHeight;
            if (newh != oldh) {
              setTimeout('window.' + this.form.formid + '.' + this.name_iframe + '.frameloaded(' + newh + ')', 10)
            } else {
              //setto la variabile iframeref nel portlet all'interno dell iframe
              var strr = this.form.formid + '.' + name_iframe
                if (typeof(iframe.contentWindow.ZtVWeb) != 'undefined')
                  iframe.contentWindow.ZtVWeb.iframeref = strr;
                if (this.minheight < newh) {
                  iframe.style.height = newh + 'px'
                    iframe.parentNode.style.height = newh + 'px'
                } else { //iframe con altezza minore dell'iframe disegnato nel portlet.
                  iframe.style.height = this.minheight + 'px'
                    iframe.parentNode.style.height = this.minheight + 'px'
                }
                this.adjustFormHeight();
              iframe.style.width = '100%'
            }
          } catch (e) {
            iframe.style.height = this.height + 'px';
          }
      }
      this.dispatchEvent('Resized');
    }
      function frameloadedAttr(){
        if(!_this.checkExtUrl())
        _this.frameloaded();
      }
      if ( this.iframe.addEventListener ) {
        this.iframe.addEventListener( 'load', frameloadedAttr, false );
      } else {
        this.iframe.attachEvent( 'onload', frameloadedAttr );
      }

      this.simulateonloadfunc=function(){
        if (this.iframe.readyState=='complete' && this.iframe.location!=this.oldhref){
          this.oldhref=this.iframe.src
          this.frameloaded()
        }
        setTimeout('window.'+this.form.formid+'.'+this.name_iframe+'.simulateonloadfunc()',1000)
      }
      if (this.iframe.onload!=null && document.all) {
         this.oldhref=''
      }
      // this.setAsEventSrc(this);
    }
    this.IframeCtrl.prototype=new this.StdControl

    this.SPToolbarCtrl=function(form,id,name,x,y,w,h,anchor,bg_color,menu_bg_color,iconWidth,layout_steps_values, cssClass, maxItem){
      var _this=this;
      this.Ctrl=document.getElementById(id);
      this.Ctrl.style.overflowY='hidden';
      this.form=form;
      this.addToForm(this.form,this);
      this.setCtrlStdMethods(this);
      this.name=name;
      this.ctrlid=id;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      this.listButtons=document.getElementById(id+'_listButtons');
      // this.listButtons.style.position='absolute';
      this.listButtons.style.top='0';
      this.listButtons.style.right='0';
      this.openMenuHandler=document.getElementById(id+'_openMenuHandlerDiv');
      this.openMenuHandlerImg=document.getElementById(id+'_openMenuHandlerImg');
      this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,true);
      this.width=this.Ctrl.offsetWidth;
      this.cssClass=cssClass||"sptoolbar";
      var isHamburgerMenu=false;
      var toolbarWidth=0;
      var SPTheme = window.SPTheme[this.cssClass]||window.SPTheme
      var maxItem=maxItem||parseInt(SPTheme.toolbar_max_item)||100;
      this.labelPosition=SPTheme.toolbar_title_visibility||'hidden';
      this.onlyIcon=false;
      function setHamburgerMenuMode() {
        if (this.width<iconWidth){ // non ci sta nemmeno un icona sulla toolbar
          LibJavascript.CssClassNameUtils.removeClass(this.openMenuHandlerImg,this.cssClass+'_3dots_handler')
          LibJavascript.CssClassNameUtils.addClass(this.openMenuHandlerImg,this.cssClass+'_hamburger_handler')
          isHamburgerMenu=true;
          // this.openMenuHandler.style['float']='left'
        } else {
          LibJavascript.CssClassNameUtils.addClass(this.openMenuHandlerImg,this.cssClass+'_3dots_handler')
          LibJavascript.CssClassNameUtils.removeClass(this.openMenuHandlerImg,this.cssClass+'_hamburger_handler')
          isHamburgerMenu=false;
        }
      }
      setHamburgerMenuMode.call(this);
      this.IconWidth=function(newIconWidth) {
        var oldIconWidth = iconWidth;
        if (typeof(newIconWidth)=='number') {
          iconWidth = newIconWidth;
          setHamburgerMenuMode.call(this);
        }
        return oldIconWidth;
      }
      var buttons_actions=[];
      var toolbarStructure=[];
      var menuStructure=[];
      LibJavascript.Events.addEvent(this.openMenuHandlerImg,'click',function(){
        if (_this.menuContent.style.display=='none'){
          _this.dispatchEvent('BeforeMenuOpen');
          _this.menuContent.style.display='block';
          // if (_this.anchor.indexOf('right')==-1 || Empty(_this.anchor)){
            _this.menuContent.style.right='inherit';
            _this.menuContent.style.left=(LibJavascript.DOM.getPosFromFirstRel(_this.Ctrl,document.body).x-(_this.menuContent.offsetWidth-_this.width))+'px'
          // }
          if (_this.anchor.search('bottom')>-1){
            _this.menuContent.style.top=(LibJavascript.DOM.getPosFromFirstRel(_this.Ctrl,document.body).y-_this.menuContent.offsetHeight)+'px';
          }
          else{
            _this.menuContent.style.top=(LibJavascript.DOM.getPosFromFirstRel(_this.Ctrl,document.body).y+(_this.Ctrl.offsetHeight))+'px'
          }
          LibJavascript.CssClassNameUtils.addClass(_this.openMenuHandler,'opened');
          LibJavascript.CssClassNameUtils.addClass(_this.openMenuHandlerImg,'opened');
          if (!Empty(menu_bg_color)){
            _this.openMenuHandler.style.backgroundColor=menu_bg_color;
            _this.menuContent.style.backgroundColor=menu_bg_color;
          }
          if (isHamburgerMenu)
            _this.Ctrl.style.backgroundColor=LibJavascript.DOM.getComputedStyle(_this.openMenuHandler,'background-color');
          _this.dispatchEvent('AfterMenuOpen');
        }
        else{
          _this.CloseMenu();
        }
      });
      this.CloseMenu=function(){
        if (this.menuContent){
          this.dispatchEvent('BeforeMenuClose');
          this.menuContent.style.display='none';
          LibJavascript.CssClassNameUtils.removeClass(this.openMenuHandler,'opened');
          LibJavascript.CssClassNameUtils.removeClass(this.openMenuHandlerImg,'opened');
          this.openMenuHandler.style.backgroundColor='';
          if (isHamburgerMenu)
            this.Ctrl.style.backgroundColor=LibJavascript.DOM.getComputedStyle(this.openMenuHandler,'background-color');
          this.dispatchEvent('AfterMenuClose');
        }
      }
      this.ClickItem=function(evt,id){
        if (buttons_actions[id]) {
          buttons_actions[id].action.call(buttons_actions[id].target,evt);
        }
        this.CloseMenu();
      }

      this._drawContainer=function(){
        if (!this.menuContent) {
          var ptl_wrapper = ZtVWeb.MakePortletWrapper(this.form);
          this.menuContent=document.createElement("div");//container
          this.menuContent.id=id+"_menuContent";
          this.menuContent.style.display='none';
          this.menuContent.style.zIndex=""+(++ZtVWeb.dragObj.zIndex);
          this.menuContent.className=this.cssClass+"_menu_container";
          this.menuContent.style.top=0;
          ptl_wrapper.appendChild(this.menuContent);
        }
      }

      function prepareAction(obj){
        var strAction="";
        if (obj.action){
          if (typeof(obj.action)=='string'){
            strAction="href='"+obj.action+"' target='"+(obj.target||'')+"' onclick=\""+_this.form.formid+"."+_this.name+".CloseMenu('"+obj.id+"')\"";
          }
          else if (typeof(obj.action)=='function'){
            buttons_actions[obj.id]={action:obj.action, target:obj.target};
            strAction="href='javascript:void(0)' onclick=\""+_this.form.formid+"."+_this.name+".ClickItem(event,'"+obj.id+"')\"";
          }
          else strAction="href='javascript:void(0)' onclick=\""+_this.form.formid+"."+_this.name+".CloseMenu('"+obj.id+"')\"";
        }
        else strAction="href='javascript:void(0)' onclick=\""+_this.form.formid+"."+_this.name+".CloseMenu('"+obj.id+"')\"";
        return strAction;
      }

      function generateToolbarElement(obj){
        var docfrag = document.createDocumentFragment();
        var fake_div = document.createElement("div");
        var dimension=getItemDimension(obj);
        var classItem=_this.cssClass+(((_this.labelPosition=='hidden' || Empty(obj.title) || _this.onlyIcon) && !Empty(obj.image))?'_icon_item':Empty(obj.image)?'_label_item':'_iconLabel_item')
        var inner="<a "+prepareAction(obj)+" id='"+_this.form.formid+"_"+_this.name+"_item_"+obj.id+"' class='"+_this.cssClass+"_item "+obj.cssClass+" "+classItem+"' "+
        " title='"+(obj.tooltip||obj.title)+"'>";
        if ((!_this.onlyIcon || Empty(obj.image)) && _this.labelPosition=='left' && !Empty(obj.title)){
          inner+="<span class='"+_this.cssClass+"_item_title' >"+obj.title+"</span>";
        }
        if (typeof(obj.image)=='string' &&  obj.image.indexOf('{') == -1 && !Empty(obj.image)){
          inner+="<div class='"+_this.cssClass+"_item_icon' style='width:"+iconWidth+"px; background-image:url("+obj.image+");'></div>";
        }
        else if (typeof(obj.image)=='object' || obj.image.indexOf('{') > -1 ){
          if( typeof(obj.image)== 'string')
            obj.image = JSON.parse(obj.image);
          var image ={
            font:obj.image.fontFamily||obj.image.FontName,
            color:obj.image.color||obj.image.Color,
            size:parseInt(obj.image.size||obj.image.Size),
            fontWeight:obj.image.fontWeight||obj.image.FontWeight
          }
          ZtVWeb.RequireFont(image.font);
          inner+="<div class='"+_this.cssClass+"_item_icon' style='"+(image.color?"color:"+image.color+";":"")+" width:"+iconWidth+"px;"+
          "font-family:"+image.font+"; "+(image.size?"font-size:"+image.size+"px;":"")+" "+(image.fontWeight?"font-weight:"+image.fontWeight+";":"")+ "'>"+String.fromCharCode(obj.image.value?parseInt(obj.image.value.substring(3,7),16):obj.image.Char)+"</div>";
        }
        if (!_this.onlyIcon && (_this.labelPosition=='right' || (_this.labelPosition=='hidden' && Empty(obj.image))) && !Empty(obj.title)){
          inner+="<span class='"+_this.cssClass+"_item_title' style='width:"+obj.titleWidth+"px; '>"+obj.title+"</span>";
        }
        inner+="</a>"
        docfrag.appendChild(fake_div);
        fake_div.innerHTML=inner;
        if (docfrag.getElementById)
          return docfrag.getElementById(_this.form.formid+"_"+_this.name+"_item_"+obj.id);
        else return docfrag.querySelector("#"+_this.form.formid+"_"+_this.name+"_item_"+obj.id);
      }

      function generateMenuElement(obj){
        var docfrag = document.createDocumentFragment();
        var fake_div = document.createElement("div");
        var inner="<a "+prepareAction(obj)+" id='"+_this.form.formid+"_"+_this.name+"_item_"+obj.id+"' class='"+_this.cssClass+"_menu_item' title='"+(obj.tooltip||obj.title)+"'>";
        if (typeof(obj.image)=='string' && obj.image.indexOf('{') == -1 && !Empty(obj.image)){
          inner+="<div class='"+_this.cssClass+"_menu_item_icon' style='width:"+iconWidth+"px; background-image:url("+obj.image+");"+
          "height:"+_this.controlheight+"px;'></div><span class='"+_this.cssClass+"_menu_item_title'>"+obj.title+"</span>";
        }
        else if (typeof(obj.image)=='object' || obj.image.indexOf('{') > -1 ){
          if( typeof(obj.image)== 'string' )
            obj.image = JSON.parse(obj.image);
          var image ={
            font:obj.image.fontFamily||obj.image.FontName,
            color:obj.image.color||obj.image.Color,
            size:parseInt(obj.image.size||obj.image.Size),
            fontWeight:obj.image.fontWeight||obj.image.FontWeight
          }
          ZtVWeb.RequireFont(image.font);
          inner+="<div class='"+_this.cssClass+"_menu_item_icon' style='"+(image.color?"color:"+image.color+";":"")+" width:"+iconWidth+"px;"+
          "font-family:"+image.font+"; "+(image.size?"font-size:"+image.size+"px;":"")+" "+(image.fontWeight?"font-weight:"+image.fontWeight+";":"")+ "'>"+String.fromCharCode(obj.image.value?parseInt(obj.image.value.substring(3,7),16):obj.image.Char)+"</div>"+
          "<span class='"+_this.cssClass+"_menu_item_title'>"+obj.title+"</span>";
        }
        else{
          inner+="<span class='"+_this.cssClass+"_menu_item_title'>"+obj.title+"</span>";
        }
        docfrag.appendChild(fake_div);
        fake_div.innerHTML=inner;
        if (docfrag.getElementById)
          return docfrag.getElementById(_this.form.formid+"_"+_this.name+"_item_"+obj.id);
        else return docfrag.querySelector("#"+_this.form.formid+"_"+_this.name+"_item_"+obj.id);
      }

      function getObjSchema(){
        return {
              id: function(){ return LibJavascript.AlfaKeyGen(10); },
              image: "",
              title: "",
              tooltip: "",
              action: "",
              cssClass: "",
              target: ""
            };
      }

      function getWidthMenuHandler(){
        this.menuHandlerWidth = this.menuHandlerWidth || (this.openMenuHandler.offsetWidth==0? 0:this.openMenuHandler.offsetWidth+ parseInt(LibJavascript.DOM.getComputedStyle( this.openMenuHandler, 'marginLeft' )) + parseInt(LibJavascript.DOM.getComputedStyle( this.openMenuHandler, 'marginRight' )) + 10);
        return this.menuHandlerWidth;
      }

      function hideMenuHandler(){
        toolbarWidth-=getWidthMenuHandler.call(this);
        this.openMenuHandler.style.display='none';
        // _this.listButtons.style.right='0';
      }

      function getItemDimension(obj,margin, showTitle){
        var dimension=0;
        if (!Empty(obj.image))
          dimension+=iconWidth;
        var title,classItem=_this.cssClass;
        if (showTitle){
          title=obj.title;
          classItem+=(Empty(obj.image)?'_label_item':'_iconLabel_item');
        }
        else if (showTitle==false){
          title=Empty(obj.image)?obj.title:''
          classItem+=(title?'_label_item':'_icon_item')
        }
        else {
          title=(_this.labelPosition!='hidden' && !_this.onlyIcon) || Empty(obj.image)?obj.title:'';
          classItem+=(_this.onlyIcon || (_this.labelPosition=='hidden' && !Empty(obj.image))?'_icon_item':Empty(obj.image)?'_label_item':'_iconLabel_item')
        }
        // if (_this.labelPosition!='hidden' || Empty(obj.image)){
          if (!obj.width){
            obj.totalWidth=LibJavascript.DOM.getTextDimensions(title,_this.cssClass+"_item_title "+classItem+" "+obj.cssClass,true,true).w
            obj.titleWidth=LibJavascript.DOM.getTextDimensions(title,_this.cssClass+"_item_title "+classItem+" "+obj.cssClass).w
          }
          if (margin)
            dimension+=obj.totalWidth;
          else dimension+=obj.titleWidth;
        // }
        return dimension;
      }

      this.moveLastItem=function(existMenu){
        var _obj=toolbarStructure.splice(toolbarStructure.length-1,1)[0]
        LibJavascript.DOM.removeNode(document.getElementById(this.form.formid+"_"+this.name+"_item_"+_obj.id));
        toolbarWidth-=_obj.itemWidth;
        if (menuStructure.length>0 || existMenu){
          LibJavascript.DOM.insertElement(this.menuContent,0,generateMenuElement(_obj))
          menuStructure.splice(0,0,_obj)
        }
        else
          this._AppendMenuItem(_obj)
      }

      this._AppendInPosition=function(obj,idx,isToolbar){
        obj = LibJavascript.JSONUtils.adjust(obj, getObjSchema());
        if (!document.getElementById(this.form.formid+'_'+this.name+'_item_'+obj.id)){
          var dimension=getItemDimension(obj,true);
          if (isToolbar!==false && idx<=toolbarStructure.length ){
            if (!toolbarStructure[idx]){
              if (isToolbar)
                return this.AppendToolbarItem(obj);
              else if (!this.AppendToolbarItem(obj))
                return this._AppendMenuItem(obj,0);
              return true;
            }
            else {
              var el=generateToolbarElement(obj);
              LibJavascript.DOM.insertElement(this.listButtons,idx,el);
              adjustItemHeight.call(this,el);
              obj.itemWidth=dimension;
              toolbarStructure.splice(idx,0,obj)
              toolbarWidth+=dimension;
              while (toolbarStructure.length>0 && (toolbarWidth+2>this.width || toolbarStructure.length>maxItem)){   // devo spostare un elemento
                this.moveLastItem();
              }
            }
          }
          else if (!isToolbar){ // lo metto in menu
            idx-=toolbarStructure.length;
            if (!menuStructure[idx]){
              return this._AppendMenuItem(obj);
            }
            else {
              this._drawContainer();
              LibJavascript.DOM.insertElement(this.menuContent,idx,generateMenuElement(obj))
              menuStructure.splice(idx,0,obj);
              return true;
            }
          }
          else return false;
        }
        else return false;
      }

      this.AppendToolbarItem=function(obj,idx){
        if (typeof(obj)=='object' && obj.constructor==Array) {
          var result = true;
          for (var i=0;i<obj.length;i++) {
            result = result && this.AppendToolbarItem(obj[i],idx);
          }
          return result;
        }
        if (idx!=null)
          this._AppendInPosition(obj,idx,true)
        obj = LibJavascript.JSONUtils.adjust(obj, getObjSchema());
        var dimension=getItemDimension(obj,true);

        if (toolbarStructure.length>=maxItem)
          return false;
        if (toolbarWidth+dimension<this.width && !document.getElementById(this.form.formid+'_'+this.name+'_item_'+obj.id)){
          var el=generateToolbarElement(obj)
          this.listButtons.appendChild(el);
          adjustItemHeight.call(this,el);
          obj.itemWidth=dimension;
          toolbarStructure.push(obj);
          toolbarWidth+=dimension;
          this._checkButton();
          return true;
        }
        else return false;
      }

      function adjustItemHeight(el){
        var margin=parseInt(LibJavascript.DOM.getComputedStyle( el, "marginTop" ))+parseInt(LibJavascript.DOM.getComputedStyle( el, "marginBottom" ));
        var padding=parseInt(LibJavascript.DOM.getComputedStyle( el, "paddingTop" ))+parseInt(LibJavascript.DOM.getComputedStyle( el, "paddingBottom" ));
        if (margin>0 || padding>0){
          el.style.height=(this.controlheight-margin-padding)+'px'
        }
      }

      this.AppendMenuItem=function(obj,idx){
        obj = LibJavascript.JSONUtils.adjust(obj, getObjSchema());
        if (this._AppendMenuItem(obj,idx)){
          if (!idx){
            menuStructure[menuStructure.length-1].alwaysInMenu=true;
          }
          else {
            idx= LibJavascript.Array.indexOf(menuStructure,obj.id,function(elem,id) {
              return elem.id==id;
            });
            menuStructure[idx].alwaysInMenu=true;
          }
        }
      }

      this._AppendMenuItem=function(obj,idx){
        this._drawContainer();
        if (typeof(obj)=='object' && obj.constructor==Array) {
          var result = true;
          for (var i=0;i<obj.length;i++) {
            result = result && this._AppendMenuItem(obj[i]);
          }
          return result;
        }
        if (idx!=null)
          return this._AppendInPosition(obj,idx+toolbarStructure.length,false)
        obj = LibJavascript.JSONUtils.adjust(obj, getObjSchema());
        if (!document.getElementById(this.form.formid+'_'+this.name+'_item_'+obj.id)){
          if (this.openMenuHandler.style.display!='table'){
            this.openMenuHandler.style.display='table';
            var margin=parseInt(LibJavascript.DOM.getComputedStyle( this.openMenuHandler, "marginTop" ))+parseInt(LibJavascript.DOM.getComputedStyle( this.openMenuHandler, "marginBottom" ));
            this.openMenuHandler.style.height=(this.controlheight-margin)+'px'
            this.menuContent.style.position='absolute';
            // if (this.anchor.search('top')>-1)
              // this.menuContent.style.top=(this.topposition+this.controlheight)+'px';
            if (LibJavascript.DOM.getComputedStyle(this.openMenuHandlerImg,'background-image')!='none')
              this.openMenuHandlerImg.style.width=iconWidth+'px';
            // this.listButtons.style.right=this.openMenuHandlerImg.offsetWidth+'px';
            toolbarWidth+=getWidthMenuHandler.call(this);
          }
          while (toolbarStructure.length>0 && toolbarWidth+2>this.width){ // devo spostare un elemento nel menu
            this.moveLastItem(true);
          }
          this.menuContent.appendChild(generateMenuElement(obj));
          menuStructure.push(obj);
          return true;
        }
        else return false;
      }
      this.Append=function(obj,idx){
        if (typeof(obj)=='object' && obj.constructor==Array) {
          var result = true;
          for (var i=0;i<obj.length;i++) {
            result = result && this.Append(obj[i],idx);
          }
          this._checkButton();
          return result;
        }
        if (idx==null){
          if (!this.AppendToolbarItem(obj)){
            this._checkButton();
            return this._AppendMenuItem(obj);
          }
          return true;
        }
        else return this._AppendInPosition(obj,idx,"");
      }

      this.UpdateItem=function(id,obj){
        var el=document.getElementById(this.form.formid+"_"+_this.name+"_item_"+id);
        if (el){
          var idx = LibJavascript.Array.indexOf(toolbarStructure,id,function(elem) {
            return elem.id==id;
          });
          if (idx!=-1){
            toolbarWidth-=toolbarStructure[idx].itemWidth;
            var structure=getObjSchema();
            for (var prop in obj){
              if (obj.hasOwnProperty(prop) && prop in toolbarStructure[idx]){
                toolbarStructure[idx][prop]=obj[prop];
              }
            }
            var newEl=generateToolbarElement(toolbarStructure[idx])
            el.parentNode.replaceChild(newEl,el);
            adjustItemHeight.call(this,newEl)
            var oldTitleDim=toolbarStructure[idx].itemWidth;
            toolbarStructure[idx].itemWidth=getItemDimension(toolbarStructure[idx]);
            toolbarWidth+=toolbarStructure[idx].itemWidth;
            if (!Empty(obj.title) && this.labelPosition!='hidden'){
              if (toolbarStructure[idx].itemWidth>oldTitleDim){
                while (toolbarStructure.length>0 && toolbarWidth+2>this.width){   // devo spostare un elemento
                  this.moveLastItem();
                }
              }
              else {
                this.moveFromMenuToToolbar();
              }
            }
          }
          else {
            idx = LibJavascript.Array.indexOf(menuStructure,id,function(elem) {
              return elem.id==id;
            });
            if (idx!=-1){
              for (var prop in obj){
                if (obj.hasOwnProperty(prop) && prop in menuStructure[idx]){
                  menuStructure[idx][prop]=obj[prop];
                }
              }
              el.parentNode.replaceChild(generateMenuElement(menuStructure[idx]),el);
            }
          }
        }
        this._checkButton();
      }

      this.setCtrlStep=function(obj){
        this.resizeCtrl();
      }

      this.moveFromMenuToToolbar=function(){
        if (toolbarStructure.length<maxItem){
          if (menuStructure.length>0){
            var _toolbarWidth=toolbarWidth+getItemDimension(menuStructure[0],true);
            var idx=0;
            while ( menuStructure.length>0 && idx<menuStructure.length && _toolbarWidth+2<this.Ctrl.offsetWidth && toolbarStructure.length<maxItem){
              if (!menuStructure[idx].alwaysInMenu){
                obj=menuStructure.splice(idx,1)[0];
                LibJavascript.DOM.removeNode(document.getElementById(this.form.formid+"_"+this.name+"_item_"+obj.id));
                if (!this.AppendToolbarItem(obj)) {
                  this._AppendMenuItem(obj);
                  break;
                }
                if (menuStructure.length>0)
                  _toolbarWidth=toolbarWidth+getItemDimension(menuStructure[0],true);
                if (menuStructure.length==1)
                  _toolbarWidth-=getWidthMenuHandler.call(this);
              }
              else idx++;
            }
            if (menuStructure.length==0){
              hideMenuHandler.call(this);
            }
          }
        }
      }

      this.calcVisibleButton=function(){
        var space=this.Ctrl.offsetWidth;
        var space2=this.Ctrl.offsetWidth;
        var nElementsWithText=0;
        var nElementsNoText=0;
        for (var i=0; i<toolbarStructure.length && nElementsNoText<maxItem; i++){
          if (space>0){
            space-=getItemDimension(toolbarStructure[i],true,true);
            if (space>0)
              nElementsWithText++;
          }
          if (space2>0){
            space2-=getItemDimension(toolbarStructure[i],true,false);
            if (space2>0)
              nElementsNoText++;
          }
        }
        if (space2>0){
          for (var i=0; i<menuStructure.length  && nElementsNoText<maxItem; i++){
            if (!menuStructure[i].alwaysInMenu){
              if (space>0){
                space-=getItemDimension(menuStructure[i],true,true);
                if (space>0)
                  nElementsWithText++;
              }
              if (space2>0){
                space2-=getItemDimension(menuStructure[i],true,false);
                if (space2>0)
                  nElementsNoText++;
              }
            }
          }
        }
        if (nElementsWithText<menuStructure.length+toolbarStructure.length)
          nElementsWithText--;
        if (nElementsNoText<menuStructure.length+toolbarStructure.length)
          nElementsNoText--;
        return {txt:nElementsWithText,noTxt:nElementsNoText};
      }

      this.transformButton=function(expandedWindow){
        this.width=this.Ctrl.offsetWidth;
        var newWidth=(menuStructure.length>0?getWidthMenuHandler.call(this):0)
        for (var i=0; i<toolbarStructure.length; i++){
          var el=document.getElementById(this.form.formid+"_"+this.name+"_item_"+toolbarStructure[i].id);
          var newEl=generateToolbarElement(toolbarStructure[i])
          toolbarWidth-=toolbarStructure[i].itemWidth;
          var dim=getItemDimension(toolbarStructure[i],true);
          toolbarWidth+=dim;
          toolbarStructure[i].itemWidth=dim;
          newWidth+=dim;
          el.parentNode.replaceChild(newEl,el);
          adjustItemHeight.call(this,newEl)
        }
        if (newWidth<this.width){
          this.moveFromMenuToToolbar();
        }
        else{
          if (!expandedWindow || !this.onlyIcon){
            while ( (toolbarStructure.length>0) && toolbarWidth+2>this.Ctrl.offsetWidth){
              this.moveLastItem();
            }
          }
        }
      }

      this._checkButton=function(){
        clearTimeout( this._checkButton.timeoutID );
        this._checkButton.timeoutID = setTimeout( function () {
          this.checkButton();
        }.bind( this ), 10 );
      }

      this.checkButton=function(){
        var onlyIcon=this.onlyIcon;
        if (this.labelPosition!='hidden'){
          var visibleButton=this.calcVisibleButton();
          if (visibleButton.txt<Math.min(visibleButton.noTxt,maxItem)/2)
            onlyIcon=true;
          else onlyIcon=false;
        }
        if (onlyIcon!=this.onlyIcon){
          this.onlyIcon=onlyIcon;
          this.transformButton(this.width<this.Ctrl.offsetWidth);
          return true;
        }
        return false;
      }

      this.resizeCtrl=function(){
        clearTimeout( this.resizeCtrl.timeoutID );
        this.resizeCtrl.timeoutID = setTimeout( function () {
          this.CloseMenu();
          if (this.checkButton()){
            setHamburgerMenuMode.call(this);
            return;
          }
          if (this.width<this.Ctrl.offsetWidth){
            this.width=this.Ctrl.offsetWidth;
            this.moveFromMenuToToolbar();
          }
          else{
            while ( (toolbarStructure.length>0) && toolbarWidth+2>this.Ctrl.offsetWidth){
              this.moveLastItem();
            }
            this.width=this.Ctrl.offsetWidth;
          }
          setHamburgerMenuMode.call(this);

        }.bind( this ), 10 );
      }
      this.Clean=function(){
        this.listButtons.innerHTML="";
        if (this.menuContent)
          this.menuContent.innerHTML="";
        hideMenuHandler.call(this);
        toolbarWidth=0;
        toolbarStructure = [];
        menuStructure = [];
      }
      this.Remove=function(id){
        LibJavascript.DOM.removeNode(document.getElementById(this.form.formid+"_"+this.name+"_item_"+id));
        var idx = LibJavascript.Array.indexOf(toolbarStructure,id,function(elem) {
          return elem.id==id;
        });
        if (idx!=-1){
          var _obj=toolbarStructure.splice(idx,1)[0];
          toolbarWidth-=_obj.itemWidth;
          if (!this.checkButton() && menuStructure.length>=2){
            var objToMove=menuStructure.splice(0,1)[0]
            LibJavascript.DOM.removeNode(document.getElementById(this.form.formid+"_"+this.name+"_item_"+objToMove.id))
            this.Append(objToMove);
            if (menuStructure.length==1){
              var dimension = getItemDimension(menuStructure[0],true);
              if (toolbarWidth+dimension<this.width){
                hideMenuHandler.call(this);
                objToMove=menuStructure.splice(0,1)[0]
                LibJavascript.DOM.removeNode(document.getElementById(this.form.formid+"_"+this.name+"_item_"+objToMove.id))
                this.Append(objToMove);
              }
            }
          }
        }
        else {
          idx = LibJavascript.Array.indexOf(menuStructure,id,function(elem) {
            return elem.id==id;
          });
          if (idx!=-1){
            menuStructure.splice(idx,1)
            if (menuStructure.length==0){
              hideMenuHandler.call(this);
            }
            else if (menuStructure.length==1 && !menuStructure[0].alwaysInMenu){ //metto il bottone nella toolbar
              hideMenuHandler.call(this);
              var objToMove=menuStructure.splice(0,1)[0]
              LibJavascript.DOM.removeNode(document.getElementById(this.form.formid+"_"+this.name+"_item_"+objToMove.id))
              this.Append(objToMove);
            }
          }
        }
        return idx!=-1
      }
      this.GetItems=function(){
        return menuStructure.concat(toolbarStructure)
      }

      this.AppendAfter=function(obj,id){
        var idx=LibJavascript.Array.indexOf(toolbarStructure,id,function(elem) {
          return elem.id==id;
        })
        if (idx==-1){
          idx=LibJavascript.Array.indexOf(menuStructure,id,function(elem) {
            return elem.id==id;
          });
          if (idx!=-1){
            return this.Append(obj,idx+toolbarStructure.length+1)
          }
          else
            return false;
        }
        else {
          return this.Append(obj,idx+1)
        }
      }
      this.AppendBefore=function(obj,id){
        var idx=LibJavascript.Array.indexOf(toolbarStructure,id,function(elem) {
          return elem.id==id;
        })
        if (idx==-1){
          idx=LibJavascript.Array.indexOf(menuStructure,id,function(elem) {
            return elem.id==id;
          });
          if (idx!=-1){
            return this.Append(obj,idx+toolbarStructure.length)
          }
          else
            return false;
        }
        else {
          return this.Append(obj,idx)
        }
      }
      this.IsInToolbar=function(id){
        return LibJavascript.Array.indexOf(toolbarStructure,id,function(elem) {
          return elem.id==id;
        })!=-1
      }
      this.IsInMenu=function(id){
        return LibJavascript.Array.indexOf(menuStructure,id,function(elem) {
          return elem.id==id;
        })!=-1
      }
    }
    this.SPToolbarCtrl.prototype=new this.StdControl;

    this.searchValue=function(callingform,par_name){
      var value,s
      s=par_name.split('.')
      if (s.length==1) {
        value=callingform[s[0]].Value()
      }else if(s.length==2) {
        value=eval("ZtVWeb.getPortlet('"+s[0]+"')."+s[1]+".Value()")
      }else if (s[0]=='parent' && s.length==3) {
        value=eval("parent.ZtVWeb.getPortlet('"+s[1]+"')."+s[2]+".Value()")
      }
      return value
    }

    this.Json2Dom=function(arr){//[{},{},...] oppure {}
      var isATree=!IsA(arr,'A') && IsA(arr,'O');
      if(isATree){
        arr=[arr];
      }
      var els=[];
      for(var i=0,l=arr.length,el,doc=window.document,o,properties,property,kids,p,k,kl; i<l; i++){
        o=arr[i];
        if(o.tag){// If the tag property is defined, create an HTML node
          el=doc.createElement(o.tag);
          if(o.properties){// If properties are defined for the node, set them
            properties=o.properties;
            if('class' in properties){// bug con tag A: non viene applicata la classe
              el.className=properties['class'];
              delete properties['class'];
            }
            for(p in properties){
              property=properties[p];
              if(IsA(property,'O')){// If the property is an Object, go through each sub-property and set them (such as style.border or style.fontWeight)
                for(k in property){
                  el[p][k]=property[k];
                }
              }else{// Property is not an Object, so it can be set normally
                el.setAttribute(p, property);
              }
            }
          }
          if(o.children){// If there are children nodes
            kids=ZtVWeb.Json2Dom(o.children);// Get the children nodes for this node
            for(k=0,kl=kids.length; k<kl; k++){
              el.appendChild(kids[k]);
            }
          }
          els.push(el);// Add the node to the array to be returned
        }else if(o.text){// If the text property is defined, create a text node
          els.push(document.createTextNode(o.text));
        }
      }
      return isATree ? els[0] : els;
    }

    this.Toolsbar=function(dock,containerStyle,SPTheme){
      if (typeof(SPTheme)=='undefined') SPTheme = window.SPTheme;
      var items=[],groups={},
          indexOf=LibJavascript.Array.indexOf,
          remove=LibJavascript.Array.remove,
          insert=LibJavascript.Array.insert,
          removeNode=LibJavascript.DOM.removeNode,
          addNode=LibJavascript.DOM.addNode,
          insertNode=LibJavascript.DOM.insertNode,
          Ctrl=LibJavascript.DOM.Ctrl,
          id="Tbar_"+LibJavascript.AlfaKeyGen(10),
          style = LibJavascript.JSONUtils.adjust(containerStyle,{paddingBottom:'1px'}),
      state={
        hidden:false
      },
      getHtmlDock=function(){
        return IsA(dock,'C') ? Ctrl(dock) : dock;
      },
      getToolsbarId=function(){
        return id;
      },
      getItemsDocksContinerId=function(){
        return getToolsbarId()+'items_docks_containter';
      },
      getItemId=function(itm){
        if(!IsAny(itm.name)){
          debugger;
          throw new Error("","");
        }
        return getToolsbarId()+'_itm_'+itm.name;
      },
      getItemDockId=function(itm){
        return getItemId(itm)+'_dock';
      },
      getItemContainerId=function(itm){
        return getItemId(itm)+'_container';
      },
      itemDockToJson=function(itm){
        return {
          tag:'div',
          properties:{
            id:getItemDockId(itm),
            style:{display:'none'}
          }};
      },
      itemContainerToJson=function(itm){
        return {
          tag:'span',
          properties:{
            id:getItemContainerId(itm),
            style:{padding:'0px',margin:'0px'}
          }};
      },
      readyToRender=function(){
        return IsAny(Ctrl(getToolsbarId()));
      },
      the_toolbar= {
        type_toolsbar:SPTheme.grid_link_type,
        CreateAndAddItem: function(oItmParms, position, groupName){//stessi prametri per Toolsbar.Item
          return this.AddItem(ZtVWeb.Toolsbar.Item.apply({},[oItmParms]), position, groupName);
        },
        AddItem: function(itm, position, groupName){//Toolsbar.Item
          var idx=this.GetItemIdx(itm.name);
          if(idx!=-1) throw new Error("ToolbarError: Duplicated item name:"+itm.name);
          if(itm.ownerToolsbar && itm.ownerToolsbar!=this && itm.ownerToolsbar.RemoveItem){
            itm.ownerToolbar.RemoveItem(itm.name);
          }
          if(IsA(groupName,'C')){
            if(!(groupName in groups)){
              groups[groupName]={};
            }
            groups[groupName][itm.name]=itm;
            itm.groupName=groupName;
          }
          itm.SetOwnerToolbar(this);
          itm.position=insert(items, IsA(position,'N') ? position : items.length, itm);
          if(readyToRender()){
            var itmContainerJson=itemContainerToJson(itm);
            itmContainerJson.children=[itm.ToJson()];
            var el = ZtVWeb.Json2Dom(itmContainerJson);
            el.innerHTML = el.innerHTML; //causa bug IE bisogna effettuare il refresh perche' "IE cannot set events via the DOM"
            insertNode(getToolsbarId(), itm.position, el);
            if(itm.use_dock){
              var json_dock=itemDockToJson(itm);
              itm.dockId=json_dock.properties.id;
              addNode(getItemsDocksContinerId(), ZtVWeb.Json2Dom(json_dock));
            }
            itm.Render(Ctrl(getItemDockId(itm)));
          }
          this[itm.name+'_Show']=function(){
            this.dispatchEvent(itm.name+'_Show');
            this.dispatchEvent('ChangedLayout');
          }
          this[itm.name+'_Hide']=function(){
            this.dispatchEvent(itm.name+'_Hide');
            this.dispatchEvent('ChangedLayout');
          }
          itm.addObserver(itm.name, this);
          this.dispatchEvent('ItemAdded');
          this.dispatchEvent('ChangedLayout');
          return itm;
        },
        RemoveItem: function(name){
          var idx=this.GetItemIdx(name);
          if(idx!=-1){
            var itm=items[idx];
            removeNode(getItemContainerId(itm));
            if(itm.use_dock){
              removeNode(itm.dockId);
            }
            this.dispatchEvent('ChangedLayout');
            if(itm.groupName && (itm.groupName in groups)){
              delete groups[itm.groupName][itm.name];
              delete itm.groupName;
            }
            itm.SetOwnerToolbar(null);
            return remove(items,idx);
          }
          return;
        },
        GetItems: function(){
          return items;
        },
        GetItemsByGroupName: function(groupName){
          if(IsAny(groupName)){
            var res=[];
            if(EmptyString(groupName)){//solo quelli che non hanno gruppo
              for(var i=0, itm, l=items.length; i<l; i++){
                itm=items[i];
                if(groupName==it.groupName){
                  res.push(itm);
                }
              }
            }else{
              for(var i in groups[groupName]){
                res.push(groups[groupName][i]);
              }
            }
            return res;
          }
          return this.GetItems();
        },
        GetItem: function(name){
          var idx=this.GetItemIdx(name);
          return idx==-1 ? null : items[idx];
        },
        GetItemIdx: function(name){
          return indexOf(items,name,function(a_item){
            return a_item.name==name;
          });
        },
        ToDOM: function(){
          return ZtVWeb.Json2Dom(this.ToJson());
        },
        ToJson: function(){
          var json_items=[], json_items_docks=[];
          for(var i=0,l=items.length,json_dock,itm;i<l;i++){
            itm=items[i];
            var itmContainerJson=itemContainerToJson(itm);
            itmContainerJson.children=[itm.ToJson()];
            json_items.push(itmContainerJson);
            if(itm.use_dock){
              json_dock=itemDockToJson(itm);
              itm.dockId=json_dock.properties.id;
              json_items_docks.push(json_dock);
            }
          }
          return [{
            tag: 'div',
            properties:{
              id:getToolsbarId(),
              'class':'Toolbar',
              style:style
            },
            children:json_items
          },{
            tag:'div',
            properties:{
              id:getItemsDocksContinerId()
            },
            children:json_items_docks
          }];
        },
        IsHidden: function(){
          return state.hidden;
        },
        Show: function(){
          state.hidden=false;
          var html=getHtmlDock();
          if(html){
            html.style.display='';
          }
          this.dispatchEvent("Show");
        },
        Hide: function(){
          state.hidden=true;
          var html=getHtmlDock();
          if(html){
            html.style.display='none';
          }
          this.dispatchEvent("Hide");
        },
        ToggleDisplay: function(){
          this[( this.IsHidden() ? 'Show' : 'Hide' )]();
        },
        Render: function(){
          var el_dock=getHtmlDock();
          if(!el_dock) return;
          var els=this.ToDOM()
          els[0].innerHTML = els[0].innerHTML; //causa bug IE bisogna effettuare il refresh perche' "IE cannot set events via the DOM"
          addNode(el_dock,els[0]);
          addNode(el_dock,els[1]);
          for(var i=0,l=items.length,itm; itm=items[i++]; itm.Render(Ctrl(getItemDockId(itm)))){}
        },
        IsEmpty: function(){
          return items.length==0;
        },
        NothingToShow:function(){
          return this.IsEmpty() || (function()/*almeno uno visibile*/{
            for(var i=0,l=items.length; i<l; i++){
              if(!items[i].IsHidden())
                return false;
            }
            return true;
          })();
        },
        EOF:null,debug:function(){debugger;this;}
      };
      StdEventSrc.call(the_toolbar);
      // the_toolbar.setAsEventSrc(the_toolbar);
      return the_toolbar;
    }
    this.Toolsbar.Item=function(oItm){
      var cssUtil=LibJavascript.CssClassNameUtils;
      var Ctrl=LibJavascript.DOM.Ctrl;
      var id="TbarItm_"+LibJavascript.AlfaKeyGen(10);
      var href_disabled='javascript:void(0)';
      var onclick_disabled='';
      var cssclass='toolsbar_item';
      var cssclass_icon=cssclass+'_icon';
      var cssclass_text=cssclass+'_text';
      var cssclass_enabled=cssclass+'_enabled';
      var cssclass_disabled=cssclass+'_disabled';
      var state={
        enabled:true,
        hidden:true,
        dock_hidden:true
      };

      var getItmId=function(){
        return id;
      }
      var getItmImgId=function(){
        return getItmId()+'_'+oItm.name+'_img';
      }
      var getItmAId=function(){
        return getItmId()+'_'+oItm.name+'_a';
      }
      var getItmTitleId=function(){
        return getItmId()+'_'+oItm.name+'_title';
      }
      var getItmButtonId=function(){
        return getItmId()+'_'+oItm.name+'_button';
      }
      var getItmHtmlEntity=function(){
        return Ctrl(getItmAId()) || Ctrl(getItmButtonId());
      }
      var updateTitle=function(){
        var title=getTitle(), s=null;
        if (s=Ctrl(getItmTitleId())) {
          for(var n,i=0; n=s.childNodes[i++]; ){
            if(n.nodeType==3){//textNode
              n.nodeValue=title;
              break;
            }
          }
        }
        if (Ctrl(getItmAId())) {
          Ctrl(getItmAId()).title=Ctrl(getItmImgId()).alt=title;
        } else if (Ctrl(getItmButtonId())) {
           Ctrl(getItmButtonId()).value=title;
        }
        updateHelp();
      }
      var updateHelp=function(){
        var help=getHelp();
        if (Ctrl(getItmAId())) {
          Ctrl(getItmAId()).title=Ctrl(getItmImgId()).title=help;
        } else if (Ctrl(getItmButtonId())) {
        Ctrl(getItmButtonId()).title=help;
        }
      }

      var the_item={
        name: oItm.name,
        image: oItm.image,
        imageposition: oItm.imageposition,
        title: oItm.title,
        help: oItm.help,
        href_disabled: oItm.href_disabled||href_disabled,
        href: oItm.href||href_disabled,
        onclick_disabled: oItm.onclick_disabled||onclick_disabled,
        onclick: oItm.onclick||onclick_disabled,
        target: oItm.target||'',
        use_dock: oItm.use_dock||false,
        hidden: true,
        ToDOM:function(){
          return ZtVWeb.Json2Dom(this.ToJson());
        },
        ToJson: function(){
          var this_itm=this;
          if (this.owner.type_toolsbar=="button")
          return {
            tag:'input',
            properties:{
              id:getItmButtonId(),
              'class': 'button '+cssclass+' '+(state.enabled ? cssclass_enabled : cssclass_disabled),
              onclick:this_itm[( state.enabled ? 'onclick' : 'onclick_disabled' )] + ';' + Strtran(this_itm[( state.enabled ? 'href' : 'href_disabled' )],'javascript:',''),
              type:'button',
              target:this_itm.target,
              title:getHelp(),
              value:this_itm.title
            },
            style:{
              display: this_itm[( state.hidden ? 'none' : '')]
            }
          };
          else {
            var children = [{
                tag:'span',
                properties:{
                  id:getItmTitleId(),
                  'class':cssclass_text,
                  style:{
                    verticalAlign: 'middle'
                  }
                },
                children:[{text:this_itm.title}]
              }];
            if (this_itm.image) {
              if (typeof(this_itm.image)=='object' || (typeof(this_itm.image)=='string' && Left(this_itm.image,1)=='{')) {
                if (typeof(this_itm.image)=='string') {
                  this_itm.image = JSON.parse(this_itm.image);
                }
                children.splice((this_itm.imageposition=='right'?1:0),0,{
                  tag:'span',
                  properties:{
                    border:0,
                    id:getItmImgId(),
                    'class':cssclass_icon,
                    style:{
                      fontFamily : this_itm.image.FontName,
                      fontSize : parseInt(this_itm.image.Size)+'px',
                      color : this_itm.image.Color,
                      fontWeight: this_itm.image.FontWeight,
                      verticalAlign: 'middle'
                    }
                  },
                  children:[{text:String.fromCharCode(this_itm.image.Char)}]
                });
              } else {
                children.splice((this_itm.imageposition=='right'?1:0),0,{
                  tag:'img',
                  properties:{
                    border:0,
                    id:getItmImgId(),
                    src:this_itm.image,
                    alt:getTitle(),
                    title:getHelp(),
                    'class':cssclass_icon,
                    style:{
                      verticalAlign: 'middle'
                    }
                  }
                });
              }
            }
            children.push();
            return {
              tag:'a',
              properties:{
                id:getItmAId(),
                'class': cssclass+' '+(state.enabled ? cssclass_enabled : cssclass_disabled),
                href:this_itm[( state.enabled ? 'href' : 'href_disabled' )],
                onclick:this_itm[( state.enabled ? 'onclick' : 'onclick_disabled' )],
                target:this_itm.target,
                title:getHelp()
              },
              style:{
                display: this_itm[( state.hidden ? 'none' : '')],
                verticalAlign: 'middle'
              },
              children:children
            };
          }
        },
        SetOwnerToolbar: function(tbowner){
          this.owner=tbowner;
        },
        Render: oItm.Render||ZtVWeb.Toolsbar.Item.EmptyFnc,
        SetImg: function(repl_img){
          this.image=repl_img;
          if (Ctrl(getItmImgId())) {
            Ctrl(getItmImgId()).src=repl_img;
          }
        },
        SetTitle: function(title){
          this.title=title;
          updateTitle();
        },
        SetHelp: function(help){
          this.help=help;
          updateHelp();
        },
        SetHref: function(href){
          this.href=href;
          if (Ctrl(getItmAId())) {
            Ctrl(getItmAId()).href=href;
          } else if (Ctrl(getItmButtonId())) {
            Ctrl(getItmButtonId()).onclick=href;
          }
        },
        SetTarget: function(target){
          this.target=target;
          if (Ctrl(getItmAId())) {
            Ctrl(getItmAId()).target=target;
          } else if (Ctrl(getItmButtonId())) {
            Ctrl(getItmButtonId()).target=target;
          }
        },
        IsHidden: function(){
          return state.hidden;
        },
        Show: function(){
          state.hidden=false;
          var html=getItmHtmlEntity();
          if(html){
            html.style.display='';
          }
          if(this.use_dock && this.GetItemDock() && !state.dock_hidden){
            this.ShowDock();
          }
          this.dispatchEvent("Show");
        },
        Hide: function(){
          state.hidden=true;
          var html=getItmHtmlEntity();
          if(html){
            html.style.display='none';
          }
          if(this.use_dock && this.GetItemDock() && !state.dock_hidden){
            this.HideDock();
            state.dock_hidden=false;
          }
          this.dispatchEvent("Hide");
        },
        ToggleDisplay: function(){
          this[( this.IsHidden() ? 'Show' : 'Hide' )]();
        },
        IsEnabled: function(){
          return state.enabled;
        },
        Enable: function(){
          state.enabled=true;
          var html=getItmHtmlEntity();
          if(html){
            html.href=this.href;
            cssUtil.swapClasses(html,cssclass_disabled, cssclass_enabled);
          }
        },
        Disable: function(){
          state.enabled=false;
          var html=getItmHtmlEntity();
          if(html){
            html.href=this.href_disabled;
            cssUtil.swapClasses(html,cssclass_disabled, cssclass_enabled);
          }
        },
        ToggleEnabled: function(){
          this[( this.IsEnabled() ? 'Disable' : 'Enable' )]();
        },
        GetItemDock:function(){
          return Ctrl(this.dockId);
        },
        DockIsHidden:function(){
          return state.dock_hidden;
        },
        ToggleDock:function(){
          this[( this.DockIsHidden() ? 'ShowDock' : 'HideDock' )]();
        },
        ShowDock:function(){
          state.dock_hidden=false;
          var dock=this.GetItemDock();
          if(dock){
            dock.style.display='';
          }
        },
        HideDock:function(){
          state.dock_hidden=true;
          var dock=this.GetItemDock();
          if(dock){
            dock.style.display='none';
          }
        },
        EOF:null,debug:function(){debugger;this;}
      };
      var getTitle=function(){
        return the_item.title||'';
      }
      var getHelp=function(){
        return the_item.help||getTitle();
      }
      StdEventSrc.call(the_item);
      // the_item.setAsEventSrc(the_item);
      return the_item;
    }
    this.Toolsbar.Item.EmptyFnc=function(){};
    this.GridServerSideCtrl=function(form,name,id,x,y,w,h,anchor,shrinkable){
      this.ctrlid=id;
      this.form=form;
      this.name=name;
      this.anchor=anchor;
      this.shrinkable=shrinkable;
      this.Ctrl=document.getElementById(id);
      this.Ctrl_tbl=document.getElementById('tbl'+id);
      this.minheight=h;
      //this.setCtrlPos(this.Ctrl,x,y,w,h,this.anchor,form.width,form.height);
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,noInlineStyle);
      }
      this._setCtrlPos(true);
      this.addToForm(this.form,this); //obbligatoria
      this.setCtrlStdMethods(this);
      this.getRenderHeight=function(){
        var h=this.Ctrl_tbl.offsetHeight;
        if(this.shrinkable=='true' || h>this.minheight)
          this.Ctrl.style.height=h+'px';
        return ((this.shrinkable=='true' || h>this.minheight)?h:null);
      }
		  this.lastRenderHeight=null
      this.adjustFormHeight=function(cnt){
        if(!(this.form.formid in window)|| window[this.form.formid].tagName=='DIV'){
        //if(typeof(eval('window.'+this.form.formid))=='undefined' || eval('window.'+this.form.formid).tagName=='DIV'){
          ZtVWeb.CheckFormExist('window.'+this.form.formid,this.name+'.adjustFormHeight');
          return;
        }
        if (this.form.Ctrl.offsetHeight==0 && (cnt==null || cnt<10)) {
          setTimeout('window.'+this.form.formid+'.'+this.name+'.adjustFormHeight('+(cnt==null?0:cnt+1)+')',200)
        } else {
          var oh=this.lastRenderHeight
          if (oh!=this.getRenderHeight())
            this.form.queueAdjustHeight(100)
        }
      }
      this.adjustFormHeight();
    }
    this.GridServerSideCtrl.prototype=new this.StdControl
    // Grid ----------------------------------------------------------------------------------------------------------------
    this.GridCtrl=function(form,name,ctrlid,x,y,w,h,font,font_color,font_size,font_weight,over_color,link_underlined,
      line_color,title_color,row_color,align,valign,anchor,cellspacing,cellpadding,recMark,row_color_odd,empty_rows,
      isorderby,nav_bar,dataobj,css_class_table,css_class_title,css_class_row,css_class_row_selected,css_class_nav_bar,
      css_class_row_odd,css_class_row_over,css_class_title_hover,show_filters,extensible,splinker,
      splinker_pos,checkbox,checkbox_fields,outDataObj,homogeneity_fields,hmg_as_filter,scroll_bars,
      keepMemCurs,preCheckbox_fld,render_totals,disabled_fld,navbar_mode,group_repeated,business_obj,show_btn_update,
      show_btn_delete,hide_empty_lines,print_result,floatRows,layout_steps_values,shrinkable,css_class_card_container){
      this.form=form
      this.name=name
      this.ctrlid=ctrlid
      this.datasource=null;
      this.Ctrl=document.getElementById(ctrlid)
      /* Se la classe e' di default grid allora forzo gridFloat altrimenti lascio la classe utente */
      var SPTheme=window.SPTheme[floatRows && css_class_table != "grid" ? "gridFloat" : css_class_table]||window.SPTheme;
      var global_js_id='window.'+this.form.formid+'.'+this.name;
      this._setCtrlPos=function(noInlineStyle){
        this.setCtrlPos(this.Ctrl,x,y,w,h,anchor,form.width,form.height,false,noInlineStyle);
      }
      this._setCtrlPos(true);
      this.setCtrlStdMethods(this);
      this.addToForm(this.form,this);
      this.minheight=h;
      this.recMark=recMark;
      this.row_color=row_color;
      this.row_color_odd=row_color_odd;
      this.nav_bar= ( ZtVWeb.IsMobile() ? false : nav_bar );
      this.navbarStyle = SPTheme.navbarStyle ? SPTheme.navbarStyle : "stretch";
      this.isorderby=(isorderby=="true");
      this.show_filters=show_filters;
      this.dataobj=dataobj;
      this.dontupdate=false;
      this.grid_filter_loaded=false;
      splinker=((splinker==null || splinker=='null')?' ':splinker).split(',');
      this.splinker=splinker[0];
      this.splinker_pos=EmptyString(splinker_pos) ? "left" : splinker_pos;
      this.parent_splinker=splinker[1];
      this.class_table=css_class_table
      this.class_title=css_class_title
      this.class_row=css_class_row
      this.css_class_card_container=css_class_card_container
      this.class_row_odd=css_class_row_odd
      this.class_row_selected=css_class_row_selected
      this.class_row_over=css_class_row_over
      this.class_nav_bar=css_class_nav_bar;
      this.class_title_over=css_class_title_hover
      this.extensible=extensible;
      this.scroll_bars=scroll_bars;
      this.showScrollBars=(/true|fixed-titles|infinite_scroll/).test(this.scroll_bars);
      if(this.scroll_bars=='infinite_scroll')this.nav_bar=false;
      this.floatRows=floatRows;
      this.shrinkable=shrinkable || 'false';
      this.existsExtensible=false;
      this.existsEditable=false;
      this.layout_steps_values = (layout_steps_values?JSON.parse(layout_steps_values):{});
      //this.extFields=EmptyString(extFields) ? [] : extFields.split(',');
      this.Filters=[];//I filtri applicati
      this.SPLinkerActions={N: new Boolean(true), E: new Boolean(true), V: new Boolean(true), D: new Boolean(true), P: new Boolean(true)};//azioni consentite se SPlinker
      this.Tools=[];//azioni aggiuntive
      //this.DraggerObj={};
      this.Tools.sort(function(a,b){
        if(a.CustomAction && b.CustomAction){
          return a.Title > b.Title
        }else if(a.CustomAction){
          return 1
        }else if(b.CustomAction){
          return 0
        }else return 0;
      });
      this.spl_html_toolsbars=[];//stinghe html delle toolsbar di splinker
      //this.AvailableOperators=["like","=","<","<=",">=",">","<>","empty"]; //,"is null","is not null","in"]; //di default vengono messi gli operatori dell'SQLDataProvider
      this.AvailableOperators=[{"op":"contains","caption":"Contains"},{"op":"like","caption":"Starts With"},"=","<","<=",">=",">","<>","empty"]; //,"is null","is not null","in"]; //di default vengono messi gli operatori dell'SQLDataProvider
      this.checkbox=(checkbox.indexOf("true")>-1);
      this.checkboxAll=(checkbox=="true-selectAll" || checkbox=="true-selectAllOfPage");
      this.checkboxAllOfPage=(checkbox=="true-selectAllOfPage");
      this.hasPrecheck=false
      this.preCheckbox_fld=preCheckbox_fld;
      this.disabled_fld=(disabled_fld==''?null:disabled_fld);
      this.hasPrecheck=(this.preCheckbox_fld!='' && this.preCheckbox_fld!=null);
      this.selectAll='unselectAll'
      //Proprieta' per il link zoom
      this.autozoom='';
      this.LinkValueUid;
      this.LinkValueField;
      this.LinkFillEmptyKey;
      this.LinkPKFields;
      this.Translations=ZtVWeb.GridTranslations||{};
      this.sel_fields=EmptyString(checkbox_fields)?[]:checkbox_fields.split(',');//elenco campi di selezione riga
      this.assigntypestocols=true // quando avra' i dati dalla query mettera' l' informazione sui tipi dei campi nelle colonne
      this.renderTotals=(render_totals=="true");
      this.rowsToAdd=5;
      this.hideMemoLayer=false;
      this.lengthMemoLayer=100;
      this.empty_rows=empty_rows;
      this.hide_empty_lines=hide_empty_lines;
      this.group_repeated=group_repeated;
      this.business_obj=business_obj;
      this.show_btn_update=show_btn_update;
      this.show_btn_delete=show_btn_delete;
      this.print_result=print_result;
      this.prev_row_flds=new Array();
      this.filterBEPosition = SPTheme.grid_img_filter_by_example_position ? SPTheme.grid_img_filter_by_example_position : 'left';
      if(!IsAny(cellpadding)){
        cellpadding=3;
      }
      if(!IsAny(cellspacing)){
        cellspacing=1;
      }
      var this_grid=this
      //this.row_height;
      //  this.disable_fields_conditions=[];
      this.homogeneity_fields=(EmptyString(homogeneity_fields)?[]:homogeneity_fields.split(','));
      if(this.homogeneity_fields.length>0) this.selectAll='no';
      this.hmg_as_filter=(hmg_as_filter=='true');
      this.homogeneity_filter=null
      this.outDataObj=outDataObj;//dataobj in cui viene copiato this.modified_data per la lettura esterna
      this.preserveData=false;//se false this.modified_data e' cancellato al FillData()
      this.keepMemCurs=(keepMemCurs=="true")
      this.hmg_filters_id=[];//tiene traccia dei filtri inseriti quando i campi di omogeneita' agiscono da filtro
      this.filterByExample=this.show_filters.match(/by-example/);
      if(ZtVWeb.IsMobile()){
        this.filterByExample = false;
        this.recMark = false;
      }
      this.printItm=null;
      this.HasDataSourceSqlDataprovider=function(ds) {
        return ZtVWeb.IsSQLDataProvider(ds || this.datasource);
      }
      this.isSqlDataProvider = this.HasDataSourceSqlDataprovider();
      this.fields_align=[];
      this.navbar_mode=navbar_mode;
      this.isZoom=false;
      this.showFilterPortlet=true;
      if (typeof(this.navbar_mode)=='undefined') this.navbar_mode={};
      if (typeof(this.navbar_mode.firstlast )=='undefined') this.navbar_mode.firstlast =true;
      if (typeof(this.navbar_mode.addremove )=='undefined') this.navbar_mode.addremove =true;
      if (typeof(this.navbar_mode.changepage)=='undefined') this.navbar_mode.changepage=true;
      if (typeof(this.navbar_mode.lastpage  )=='undefined') this.navbar_mode.lastpage  =true;
      if (typeof(this.navbar_mode.pagepanel )=='undefined') this.navbar_mode.pagepanel =true;
      this.TopToolsbarContainerId=function(){
        return this.ctrlid+'_tbar';
      };
      this.TopToolsbarContainer=function(){
        return document.getElementById(this.TopToolsbarContainerId());
      };
      if(ZtVWeb.IsMobile()){
        this.Ctrl.innerHTML='<div id="'+this.TopToolsbarContainerId()+'" class="mobile_box_title" style="display:none;"></div>'+'<div class="grid_table" '+(EmptyString(line_color) ? '' : ' style="width:100%;background-color:'+line_color+'"')+'><div id="__tbl_'+this.ctrlid+'_container" style="position:relative;z-index:1;">'+
          '<div id="tbl_'+this.ctrlid+'_container" style="position:relative;"></div></div>'+
        '</div>';
      }else{
         this.Ctrl.innerHTML='<div id="__tbl_'+this.ctrlid+'_container" class="grid_table" '+(EmptyString(line_color) ? '' : ' style="background-color:'+line_color+'"')+'>'+
          '<div id="'+this.TopToolsbarContainerId()+'" class="toolsbar" style="display:none;">'+
            '<div id="'+this.ctrlid+'_tbar_toggler" class="toolsbar_toggler" style="display:none;"><a href="javascript:'+global_js_id+'.ToggleTopToolsbar();"></a></div>'+
            '<div id="'+this.ctrlid+'_tbar_dock" class="toolsbar_items"></div>'+
            '<div id="'+this.ctrlid+'_tbar_helper" class="toolsbar_help"></div>'+
          '</div>'+
          '<div id="tbl_'+this.ctrlid+'_container" style="position:relative;"></div></div>';
      }
      this.TopToolsbar=new ZtVWeb.Toolsbar(this.ctrlid+'_tbar_dock',{},SPTheme);
      this.TopToolsbar.addObserver('TopToolsbar', this);//griglia osserva toolsbar
      this.addObserver('grid',this.TopToolsbar);//toolsbar osserva griglia
      this.MakeWrapper=function() {
        var ptl_wrapper = ZtVWeb.MakePortletWrapper(this.form);
        var grid_wrapper = LibJavascript.DOM.Ctrl(this.ctrlid+"_wrapper");
        if (grid_wrapper==null) {
          grid_wrapper=document.createElement("div");//grid
          grid_wrapper.style.margin="0";
          grid_wrapper.style.position="static";
          grid_wrapper.style.top="0";
          grid_wrapper.style.left="0";
          grid_wrapper.style.width="0";
          grid_wrapper.style.height="0";
          grid_wrapper.style.zIndex=""+(++ZtVWeb.dragObj.zIndex);;
          grid_wrapper.className=this.class_table;
          grid_wrapper.id=this.ctrlid+"_wrapper";
          ptl_wrapper.appendChild(grid_wrapper);
        }
      }
      this.Cols=[];//Array di oggetti colonna
      this.linesCount=1;
      this.setStructures=function(){
        this.Cols=[];
        this._rowLayer=[];
        this.isShowExtraTitles=false;
        var i,item,cf,l,col,indexOf=LibJavascript.Array.indexOf;
        if(link_underlined!="true")
          link_underlined="none";
        else
          link_underlined="underline";
        for(i=0,l=this.colProperties.length; i<l; i++){
          //Nuovo formato json in arrivo dal disegnatore per le colonne
          cf=this.colProperties[i];
          item={};
          item.id=LibJavascript.AlfaKeyGen(10);
          item.type='C';
          item.field= cf.field;
          item.title= cf.title||'';
          item.title_tooltip= cf.title_tooltip||'';
          if(!Empty(item.title)) this.renderTitles=true;
          item.link= cf.link||'';
          item.target= cf.target||'';
          item.onclick= cf.onclick||'';
          item.align= cf.align||'';
          item.picture= cf.picture||'';
          item.picture=Strtran(Strtran(item.picture,'$|$',','),'|',',');
          item.picture=Strtran(Strtran(item.picture,'"',''),"'","");
          item.col_class= cf['class'] || cf['col_class'] || '';
          item.font= cf.font_family||font||'';
          item.font_size= cf.font_size||font_size||'';
          item.font_size=(Lower(item.font_size).indexOf('px')==-1?item.font_size+'px':item.font_size)||'';
          item.font_color= cf.fg_color||font_color||'';
          item.font_weight= cf.font_weight||font_weight||'';
          item.bg_color= cf.bg_color||'';
          item.link_underlined=link_underlined||'';
          item.orderbyfld=(this.isorderby ? (Empty(cf.orderby_field) && !isExpr(cf.field) ? cf.field : cf.orderby_field):"")||'';
          item.orderbystatus= '';
          item.orderbyidx= 0;
          item.width= (cf.width && cf.width.indexOf("%")>-1?cf.width:((!Empty(cf.width) && Lower(cf.width).indexOf('px')==-1)?cf.width+'px':cf.width))||'';//min cell size
          item.maxwidth= (cf.maxwidth && cf.maxwidth.indexOf("%")>-1?cf.maxwidth:((!Empty(cf.maxwidth) && Lower(cf.maxwidth).indexOf('px')==-1)?cf.maxwidth+'px':cf.maxwidth))||'';//deprecated
          item.fixedwidth= (cf.fixedwidth && cf.fixedwidth.indexOf("%")>-1?cf.fixedwidth:((!Empty(cf.fixedwidth) && Lower(cf.fixedwidth).indexOf('px')==-1)?cf.fixedwidth+'px':cf.fixedwidth))||'';//cell size
          item.font_weight= cf.font_weight||font_weight||'';
          item.col_span= cf.ColSpan||0;
          item.row_span= cf.RowSpan||0;
          item.new_line=cf.newline||false;
          item.enable_HTML=cf.enable_HTML||false;
          item.editable=cf.isEditable||false;
          item.disable_condition=cf.disable_fields_conditions||'';
          item.inExtGrid=(cf.extensible?1:0);
          if(item.editable) this.existsEditable=true;
          if(item.inExtGrid==1) this.existsExtensible=true;
          item.droppable=cf.droppable||false;
          item.droppable_name=cf.droppable_name||'';
          item.title_align=cf.title_align||'';
          if(!Empty(item.maxwidth) && item.maxwidth==item.width) item.fixedwidth=item.width;
          if(EmptyString(cf.layer)){
            item.Layer=[];
          }
          item.hidden=cf.hidden||false;
          item.show_extra_title=cf.show_extra_title||false;
          if(item.show_extra_title) this.isShowExtraTitles=true;
          this.setColType(item);
          if(cf.layer=='column_layer'){
            if(EmptyArray(this.Cols)){
              throw new Error('Grid: '+this.name+'; Field: '+item.field+'; starting with columnlayer is denied.');
            }else{
              this.Cols[this.Cols.length-1].Layer.push(item);
            }
          }else if(cf.layer=='row_layer'){
            this._rowLayer.push(item);
          }else{
            this.Cols.push(item);
            if(item.new_line){
              this.linesCount++;
            }
          }
        }
        //setto la proprieta' editable a true se trovato nella lista dei campi editabili (da togliere in futuro mettendo il check nelle proprieta' del campo)
        /*
        for(i=0; col=this.Cols[i++]; ){
          var idx=indexOf(this.editable_fields, col.field);
          if(idx!=-1){
            col.editable=true;
            if(this.disable_fields_conditions.length>0)col.disable_condition=this.disable_fields_conditions[idx];
          }
          if((col.field.substr(0,9)=="checkbox:" ||col.field.substr(0,9)=="combobox:") && indexOf(this.editable_fields, col.field.split(':')[1])!=-1){
            col.editable=true;
            if(this.disable_fields_conditions.length>0)col.disable_condition=this.disable_fields_conditions[indexOf(this.editable_fields, col.field.split(':')[1])];
          }
        }*/
        this.LoadGridFilterPortlet()
      };

function getColSchema() {
function mandatoryPropertyError() {
throw new Error('Mandatory property error');
}
			  
return {
id: function() {
return LibJavascript.AlfaKeyGen(10);
},
field: mandatoryPropertyError,
type: function() {
return 'C';
},
title: '',
link: '',
target: '',
format: '',
onclick: '',
align: '',
picture: '',
width: '',
font: '',
font_size: '',
font_color: '',
font_weight: '',
bg_color: '',
col_span: '',
row_span: '',
enable_HTML: '',
Layer: function() {
return [];
},
new_line: false,
orderbyfld: function(itm) {
return isExpr(itm.field) ? '' : itm.field;
},
orderbystatus: '',
editable: false,
orderbyidx: 0,
title_align: '',
hidden: false,
show_extra_title: false,
inExtGrid: 0
};
}

      this.SetColumns=function(cols){
        this.Cols=[];
        this.assigntypestocols=true;
        cols = LibJavascript.JSONUtils.adjust(cols, getColSchema());
        this.linesCount=1;
        for(var i=0,col; col=cols[i++]; ){
          col.Layer = LibJavascript.JSONUtils.adjust(col.Layer, getColSchema());
          this.Cols.push(col);
          if (col.new_line)
            this.linesCount++;
          //this.pictures[this.Cols.length-1]=col.picture || "";
          //this.fields[this.Cols.length-1]=col.field || "";
        }
      }
      this.AddColumn=function(col,index){
        if (index==undefined) index=this.Cols.length;
        col = LibJavascript.JSONUtils.adjust(col, getColSchema());
        this.Cols.splice(index,0,col);
        //this.pictures.splice(index,0, col.picture || "");
        //this.fields.splice(index,0, col.field || "");
      }
      function getRowLayerColSchema(){
        function mandatoryPropertyError(){
          throw new Error("Mandatory property error");
        }
        var _;
        return {
              id: function(){ return LibJavascript.AlfaKeyGen(10); },
              field: mandatoryPropertyError,
              title: function(col){ return col.field; },
              link: "",
              target: "",
              format: "",
              onclick: "",
              align: "",
              picture: "",
              font: "",
              font_size: "",
              font_color: "",
              font_weight: "",
              bg_color: ""
            };
      }

      this.SetRowLayer=function(rlcols){
        if(IsA(rlcols,'U')){
          return this._rowLayer;
        }
        if(IsA(rlcols,'C')){
          var cols=[];
          var cl=rlcols.split(',');
          for(var i=0,l=cl.length,cf; i<l; i++){
            //caption:field:picture (ultimo opzionale)
            cf=cl[i];
            cf = cf.indexOf(':')>-1 ? cf.split(':') : ['',cf];
            cols.push({'field':cf[1],'title':cf[0],'picture':eval(cf[2]||'""')})
          }
          this._rowLayer = [];
          this._rowLayer = LibJavascript.JSONUtils.adjust(cols, getColSchema());
        }else if(IsA(rlcols,'A')){
          var copy=LibJavascript.Array.copy;
          this._rowLayer = [];
          this._rowLayer=copy(rlcols);
          this._rowLayer = LibJavascript.JSONUtils.adjust(this._rowLayer, getColSchema());
        }
        var title_grid = window[this.ctrlid+"_search"] || window[this.form.Zoomtitle];
        if (title_grid && title_grid.SetOtherFields) {
          title_grid.SetOtherFields(this._rowLayer);
          this._rowLayer=[];
        }
        return this._rowLayer;
      }
      this.CssClass=function(new_class_table) {
        var res = this.class_table;
        if (new_class_table) {
          this.class_table = new_class_table;
          SPTheme = window.SPTheme[new_class_table]||window.SPTheme;

          this.Ctrl.className = new_class_table;

          this.filterBEPosition = SPTheme.grid_img_filter_by_example_position ? SPTheme.grid_img_filter_by_example_position : 'left';
          var grid_wrapper = LibJavascript.DOM.Ctrl(this.ctrlid+"_wrapper");
          if (grid_wrapper) {
            grid_wrapper.className = new_class_table;
          }
        }
        return res;
      }
      this.GetColIdxById=function(colId){
        if(IsAny(colId)){
          return LibJavascript.Array.indexOf(this.Cols, colId, function(el){
            return el.id==colId;
          });
        }
        return -1;
      };
      this.GetColById=function(colId,all){
        if(IsAny(colId)){
          if(all){ // Cicla su tutti i campi anche layer e rowlayer
            for(var i=0;col=this.Cols[i]; i++){
              if(col.id==colId)
                return col;
              for(var j=0;j<col.Layer.length;j++){
                if(col.Layer[j].id==colId)
                  return col.Layer[j];
              }
            }
            for(var i=0;col=this._rowLayer[i]; i++){
              if(col.id==colId)
                return col;
            }
          }else{
            var idx=LibJavascript.Array.indexOf(this.Cols, colId, function(el){
              return el.id==colId;
            });
            if(idx!=-1){
              return this.Cols[idx];
            }
          }
        }
      };

      this.GetColByIdx=function(idx){
        if(IsAny(idx)){
          if(idx>-1 && idx<this.Cols.length){
            return this.Cols[idx];
          }
        }
      };

      this.collectFields=function(m_bCols, m_bRowLayer, m_bColumnLayers, m_bCollectExpr, m_bToLowerCase, m_oArrayCollector, m_oMapCollector){
        if(typeof arguments[0] == "object"){
          var args = arguments[0];
          m_bCols = args.m_bCols;
          m_bRowLayer = args.m_bRowLayer;
          m_bColumnLayers = args.m_bColumnLayers;
          m_bCollectExpr = args.m_bCollectExpr;
          m_bToLowerCase = args.m_bToLowerCase;
          m_oArrayCollector = args.m_oArrayCollector;
          m_oMapCollector = args.m_oMapCollector;
        }
        var fields_arr = m_oArrayCollector || [],
            fields_map = m_oMapCollector || {},
            _, i, col, field, layer;

        if(m_bCols){
          for(i=0; col=this.Cols[i++]; ){
            field = m_bToLowerCase ? col.field.toLowerCase() : col.field;
            if(m_bCollectExpr || !isExpr(field)){
              if(!(field in fields_map)){
                fields_map[field]=_;
                fields_arr.push(field);
              }
            }
            layer=col.Layer;
            if(m_bColumnLayers){
              for(var j=0; col=layer[j++]; ){
                field = m_bToLowerCase ? col.field.toLowerCase() : col.field;
                if(m_bCollectExpr || !isExpr(field)){
                  if(!(field in fields_map)){
                    fields_map[field]=_;
                    fields_arr.push(field);
                  }
                }
              }//for
            }
          }//for
        }

        if(m_bRowLayer){
          for(i=0; col=this._rowLayer[i++]; ){
            field = m_bToLowerCase ? col.field.toLowerCase() : col.field;
            if(m_bCollectExpr || !isExpr(field)){
              if(!(field in fields_map)){
                fields_map[field]=_;
                fields_arr.push(field);
              }
            }
          }//for
        }

        return {
          map: fields_map,
          array: fields_arr
        };
      };

      this._initMemCurs=function(){
        // lista dei campi da memorizzare
        this.mem_curs=new ZtVWeb.MemCurs()
        var i, c;
        for(i=0;i<this.sel_fields.length;i++){
          c=this.sel_fields[i];
          this.mem_curs.CreateFld(c,this.datasource.getType(c))
        }
        this.homogeneity_filter=null;
        var TmpHmg=EmptyString(homogeneity_fields)?[]:homogeneity_fields.split(',');
        for(i=0;i<TmpHmg.length;i++){
          c=TmpHmg[i]
          this.mem_curs.CreateFld(c,this.datasource.getType(c))
        }
        for(i=0;i<this.Cols.length;i++){
          if(this.Cols[i].editable){
            c=clearField(this.Cols[i].field);
            this.mem_curs.CreateFld(c+'_new',this.datasource.getType(c))
            this.mem_curs.CreateFld(c+'_old',this.datasource.getType(c))
          }
        }
        this.mem_curs.CreateFld("ps_rowstatus","C")
        if (this.hasPrecheck)
          this.mem_curs.CreateFld(this.preCheckbox_fld,"N")
      }
      this.initMemCurs=function(){
        this._initMemCurs()
        this._renderOutputDataObj();
        this.preserveData=true;
        this.FillData(this.datasource);
      }

      this.setRowsCols=function(rows,resizablecolumns,draggablecolumns,colProperties,draggable_row,hide_default_titles){
        this.rows= rows ? rows : 1000
        this.ordstatus=[];//status di ordinamento delle colonne (usato per disegnare la grid): [[field, c, indice in this.fieldTord],[..],..]
        this.fieldTord=[];//colonne da ordinare in ordine di priorita' (usato x creare la riga SQL): [[field, desc?,indice in this.ordstatus],[..],..]
        this.align=align;
        this.valign=valign;
        this.resizablecolumns=resizablecolumns;
        this.draggablecolumns=(draggablecolumns && !this.floatRows);
        this.draggable_row=draggable_row;
        this.colProperties=colProperties;
        this.hide_default_titles=hide_default_titles||false;
        this.setStructures();
        for(var i=0;i<this.colProperties.length && this.colProperties[i].picture;i++){
          var pct=this.colProperties[i].picture;
          var func=pct.indexOf('function:')
          if(func>-1) {
            pct=this.colProperties[i].picture.substr(func+9);
          } else if (pct.substr(0,1)!='"' && pct.substr(0,1)!="'"){
            pct="'"+pct+"'"
          }
          this.colProperties[i].picture=eval(Strtran(pct,'|',','));
        }
      }
      this.TopToolsbar_ChangedLayout=function(){
        if(this.TopToolsbar.NothingToShow()){
          this.HideTopToolsbarToggler();
        }else{
          this.ShowTopToolsbarToggler();
        }
      }
      this.SplinkerToolsPosition=function(new_pos){
        var pos=this.splinker_pos;
        if(IsAny(new_pos) && new_pos!=pos){
          this.splinker_pos=new_pos;
          this.AdjustTopToolsbarItems();
        }
        return pos;
      }
      this.AdjustTopToolsbarItems=function(){
        var grid=this;
        //items x splinker
        var newItm_id   ='splinker_new_itm'   , newItm   =grid.TopToolsbar.GetItem(newItm_id),
            viewItm_id  ='splinker_view_itm'  , viewItm  =grid.TopToolsbar.GetItem(viewItm_id),
            editItm_id  ='splinker_edit_itm'  , editItm  =grid.TopToolsbar.GetItem(editItm_id),
            deleteItm_id='splinker_delete_itm', deleteItm=grid.TopToolsbar.GetItem(deleteItm_id),
            i,l,itm,tool,id,tools;
        if(this.splinker_pos.match(/toolsbar/)){ //aggiunge solo se non esistono gia'
          //new
          if(!newItm){
            var get_href_new=function(){
              return "javascript:"+ (EmptyString(grid.parent_splinker) ? grid.form.formid+"."+grid.splinker+".Link(null,null,null,'"+(grid.SPLinkerActions.N.action||'new')+"');" : grid.form.formid+"."+grid.parent_splinker+".Link();");
            }
            newItm=this.TopToolsbar.CreateAndAddItem({
              name : newItm_id,
              title:grid.Translations["New"]||'New',
              image: SPTheme.grid_img_action_new||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_new.png",
              href : get_href_new()
            },0);
            newItm.grid_Rendered=function(){
              if(grid.SPLinkerActions.N.valueOf()){
                this.SetHref(get_href_new());
                this.Show();
              }else{
                this.Hide();
              }
            }
            grid.addObserver('grid',newItm);
          }
          //view
          if(!viewItm){
            var get_href_view=function(){
              return 'javascript:'+grid.form.formid+'.'+grid.splinker+".Link('"+grid.dataobj+"',null,null,'"+(grid.SPLinkerActions.V.action||'view')+"');";
            }
            viewItm=this.TopToolsbar.CreateAndAddItem({
              name : viewItm_id,
              title:grid.Translations["View"]||'View',
              image: SPTheme.grid_img_action_view||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_view.png",
              href : get_href_view()
            },1);
            viewItm.grid_Rendered=function(){
              if(grid.SPLinkerActions.V.valueOf() && !grid.datasource.IsEmpty()){
                this.SetHref(get_href_view());
                this.Show();
              }else{
                this.Hide();
              }
            }
            grid.addObserver('grid',viewItm);
          }
          //edit
          if(!editItm){
            var get_href_edit=function(){
              return 'javascript:'+grid.form.formid+'.'+grid.splinker+".Link('"+grid.dataobj+"',null,null,'"+(grid.SPLinkerActions.E.action||'edit')+"');";
            }
            editItm=this.TopToolsbar.CreateAndAddItem({
              name : editItm_id,
              title:grid.Translations["Edit"]||'Edit',
              image: SPTheme.grid_img_action_edit||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_edit.png",
              href : get_href_edit()
            },2);
            editItm.grid_Rendered=function(){
              if(grid.SPLinkerActions.E.valueOf() && !grid.datasource.IsEmpty()){
                this.SetHref(get_href_edit());
                this.Show();
              }else{
                this.Hide();
              }
            }
            grid.addObserver('grid',editItm);
          }
          //delete
          if(!deleteItm){
            var get_href_delete=function(){
              return 'javascript:void('+grid.form.formid+'.'+grid.splinker+".Link('"+grid.dataobj+"',null,null,'"+(grid.SPLinkerActions.D.action||'delete')+"'));";
            }
            deleteItm=this.TopToolsbar.CreateAndAddItem({
              name: deleteItm_id,
              title:grid.Translations["Delete"]||'Delete',
              image: SPTheme.grid_img_action_delete||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_delete.png",
              href: get_href_delete()
            },3);
            deleteItm.grid_Rendered=function(){
              if(grid.SPLinkerActions.D.valueOf() && !grid.datasource.IsEmpty()){
                this.SetHref(get_href_delete());
                this.Show();
              }else{
                this.Hide();
              }
            }
            grid.addObserver('grid',deleteItm);
          }
          //i tools aggiuntivi
          var compute_tool_href=function(tbar_item,tool){
            return function(){
              var url=ZtVWeb.makeStdLink(tool.URL, null, grid.datasource, null, grid.form, true);
              tbar_item.SetHref(url);
            }
          }
          for(i=0,tools=this.Tools||[],l=tools.length; i<l; i++){
            tool=tools[i];
            if (!Empty(tool.URL)) {
              id='custom_tool_'+i;
              itm=this.TopToolsbar.CreateAndAddItem({
                name: id,
                title: tool.Title,
                help: tool.Tooltip,
                image: tool.Img,
                target: tool.Target
              },4+i);
              itm.grid_Rendered=function(){
                if(!grid.datasource.IsEmpty()){
                  this.Show();
                }else{
                  this.Hide();
                }
              }
              grid.addObserver('grid',itm);

              itm.dataobj_RecordChanged=compute_tool_href(itm,tool);
              grid.form[grid.dataobj].addObserver('dataobj',itm);
            }
          }
        }else{//items da rimuovere dalla toolbar
          if(newItm)    grid.TopToolsbar.RemoveItem(newItm_id);
          if(viewItm)   grid.TopToolsbar.RemoveItem(viewItm_id);
          if(editItm)   grid.TopToolsbar.RemoveItem(editItm_id);
          if(deleteItm) grid.TopToolsbar.RemoveItem(deleteItm_id);
          for(i=0,tools=this.Tools||[],l=tools.length; i<l; i++){
            id='custom_tool_'+i;
            if(itm=grid.TopToolsbar.GetItem(id)){
              grid.TopToolsbar.RemoveItem(id);
            }
          }
        }
      }
      this.SetTopToolsbarItems=function(){
        var grid=this;
        this.AdjustTopToolsbarItems();
        //item dei filtri
        var filterItm=this.TopToolsbar.CreateAndAddItem({
          name: 'filter_itm',
          title:grid.Translations["Filters"]||'Filters',
          image: (SPTheme.grid_img_filter_open||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filters_add.png'),
          href:'javascript:'+grid.form.formid+"."+name+".ToggleFilterArea(\'"+grid.ctrlid+"\');",
          use_dock: true,
          Render: function(){
            var dock=this.GetItemDock();
            dock.style.zIndex=200;
            dock.innerHTML="<div id='"+grid.ctrlid+"_filters_panel' class='filters_panel' style='position:absolute; display:none; width:100%; height:130px; z-index:999' onclick='"+grid.form.formid+"."+name+".AddEmptyFilter(event);'>"+
                        "<div id='"+grid.ctrlid+"_filters' style='width:100%;height:130px;overflow:auto;'>&nbsp;</div>";
            grid.InitFiltersBar();
          }
        });
        filterItm.grid_Rendered=function(){
          if(grid.show_filters=='false'){
            this.Hide();
          }else{
            this.Show();
          }
        }
        grid.addObserver('grid',filterItm);
        //item x espandere/ridurre
        var extended=this.IsExtended();
        var expredItm=this.TopToolsbar.CreateAndAddItem({
          name: 'expandoreduce_itm',
          title: (extended ? grid.Translations["Reduce_grid"]||'Reduce grid' : grid.Translations["Expand_grid"]||'Expand grid'),
          image: this.GetExpandReduceImage(extended),
          href:'javascript:'+grid.form.formid+"."+name+".ExpandOReduce();"
        });
        expredItm.grid_Rendered=function(){
          var btn = LibJavascript.DOM.Ctrl(grid.ctrlid+'_row_layer_expandreduce');
          if(grid.extensible=='false' || !grid.existsExtensible || btn) {
            this.Hide();
          }else{
            this.Show();
          }
        }
        grid.addObserver('grid',expredItm);
        //Bottone di stampa
        if(this.print_result){
          grid.printItm=grid.TopToolsbar.CreateAndAddItem({
            name: 'print_itm_grid',
            title:grid.Translations["Print"]||"Print",
            image: (SPTheme.grid_img_action_print||'../visualweb/images/printer.png'),
            href:'javascript:'+global_js_id+".TogglePrintPanel();",
            use_dock: true,
          });
          grid.GetPrintData = function () {
            return { associatedTable:'' // Nome della gestione associata allo zoom
                   , fields: grid.GetFields()
                   , fieldstitle: ''
                   , fieldspicture: ''
                   , fieldsorderby: grid.GetFieldsOrderBy()
                   , VqrName: grid.form[grid.dataobj].cmd
                   , parms: grid.QueryParmsFunc()
                   , m_cVZMParamBlock: grid.VZMParamBlock() //Filtri presenti nella grid
                   , outputFormat: ""
                   , isSqlDataProvider: grid.isSqlDataProvider
                   , gridName: this.name
                   , fromGrid: true
                   }
                 ;
          };
          grid.TogglePrintPanel=function(){//funzione per gestione item
            if(grid.printItm.DockIsHidden() /*&& grid.isSqlDataProvider*/){
              var printManager = grid.getPrintManager();
              printManager.OnCinemaClick( function () {
                printManager.Close();
              } );
              printManager.SetPrintData( grid.GetPrintData() );
              printManager.Show();
            }
          }
          //NASCONDO il bottone se il dataprovider non è un SQLDataObj
          grid.printItm.grid_Rendered=function(){
            // commento perche' prevedo altri tipi di data provider
            // viene sempre visualizzato
            grid.isSqlDataProvider = grid.HasDataSourceSqlDataprovider();
            /*if (!grid.isSqlDataProvider){
              this.Hide();
            }else{*/
              this.Show();
            //}
          }
          grid.addObserver('grid',grid.printItm);
        }

        //per nascondere la toolbar se vuota
        this.TopToolsbar.Render();
      }; // SetTopToolsbarItems

      this.printPortlet="SPPortalZoomPrint";
      this.SetPrintPortlet=function(printPortlet){
        this.printPortlet=printPortlet;
      }

      this.getPrintManager = function () {
        var grid = this;
        if ( this.getPrintManager.singleton ) {
          return this.getPrintManager.singleton;
        }
        return this.getPrintManager.singleton = new function () {

          function getContainer () {
            var printCntID = grid.ctrlid + '_printManagerCnt'
              , printCnt = document.getElementById( printCntID )
              ;
            if ( !printCnt ) {
              printCnt = document.createElement( 'div' );
              printCnt.id = printCntID;
              printCnt.style.position = 'absolute';
              printCnt.style.width = '100%';
              printCnt.style.maxWidth = '500px';
              printCnt.className = 'toolsbar_items';
              getCinema().appendChild( printCnt );
            }
            return printCnt;
          } // getContainer

          function getCinema () {
            var printCinemaID = grid.ctrlid + '_printManagerCinema'
              , printCinema = document.getElementById( printCinemaID )
              ;
            if ( !printCinema ) {
              var printCinema = document.createElement( 'div' );
              printCinema.id = printCinemaID;
              printCinema.style.position = 'absolute';
              printCinema.style.width = '100%';
              printCinema.style.height = '100%';
              printCinema.style.zIndex = '3';
              LibJavascript.DOM.insertElement( grid.Ctrl.parentElement, 0, printCinema );
            }
            return printCinema;
          } // getCinema

          function getPrintPortlet () {
            return ZtVWeb.getPortletInc( getContainer(), grid.printPortlet );
          }; // getPrintPortlet

          this.Show = function () {
            var printPortlet
              , ForcedPortletUID = "__SPRANDOMPORTLETUID__"
              , printPortletUID = LibJavascript.AlfaKeyGen( 5 )
              , printCnt = getContainer()
              , containsAttr = 'data-sp-contains-print-portlet'
              , contansPrintPtl = !!printCnt.getAttribute( containsAttr )
              ;
            function replacer(str) {
              return str.replace( /(__SPRANDOMPORTLETUID__)/g, function() {
                return printPortletUID;
              });
            }
            if ( !contansPrintPtl ) {
              if ( 200 == ZtVWeb.Include( '../jsp-system/'+grid.printPortlet+'_portlet.jsp?ForcedPortletUID=' + ForcedPortletUID
                                        , printCnt
                                        , false
                                        , replacer
                                        )
                 ) {
                printCnt.setAttribute( containsAttr, 'true' );
              } else {
                throw new Error( 'Unable to include print portlet.' );
              }
            }
            getCinema().style.display = '';
            printPortlet = getPrintPortlet();
            printPortlet.addObserver( 'printPortlet', this );
            printPortlet.RcvPrintParms( this.GetPrintData() );
          }; // Show

          this.printPortlet_CloseRequest = function () {
            this.Close();
          }

          this.Close = function () {
            getCinema().style.display = 'none';
          }; // Close

          this.GetContainer = function () {
            return getContainer();
          }; // GetContainer

          this.IsVisible = function () {
            return getCinema().style.display == 'none';
          }; // IsVisible

          var _printData;
          this.SetPrintData = function (data) {
            _printData = data;
          }; // SetPrintData

          this.GetPrintData = function () {
            return _printData;
          }; // GetPrintData

          // this.Print = function () {
            // getPrintPortlet().RcvPrintParms( this.GetPrintData() );
            // this.Close();
          // }; // Print

          var onCinemaClick = this.Close;
          this.OnCinemaClick = function (fncDoOnClick) {
            onCinemaClick = fncDoOnClick;
          }; // OnCinemaClick

          getContainer().addEventListener( 'click', function (evt) {
            evt.stopPropagation();
          }, false );
          getCinema().addEventListener( 'click', function (evt) {
            return onCinemaClick( evt );
          }, false );
        };
      } // getPrintManager
      //Funzioni per avere i dati per la stampa della Grid
      this.VZMParamBlock=function(){
        var result=[];
        for(var i=0;i<this.Filters.length;i++){
          if (this.Filters[i].operator === "empty") {
            result.push({filter_field: this.Filters[i].field,
                            filter_type: this.Filters[i].type,
                            filter_value: "",
                            query_param: "",
                            filter_operation: "empty"});
          } else{
            var pict = this.Filters[i].picture;
            var exp;
            if(this.Filters[i].type=="D"){
              if(!IsAny(pict) || EmptyString(pict)) pict= ZtVWeb.defaultDatePict;
              exp = ZtVWeb.strToValue(this.Filters[i].expression,this.Filters[i].type,pict);
              exp = ZtVWeb.applyPicture(exp,'D',0,"YYYYMMDD");
            }
            else if(this.Filters[i].type=="T"){
              if(!IsAny(pict) || EmptyString(pict)) pict= ZtVWeb.defaultDateTimePict;
              exp = ZtVWeb.strToValue(this.Filters[i].expression,this.Filters[i].type,pict);
              exp = ZtVWeb.applyPicture(exp,'T',0,"YYYYMMDDhhmmss");
            }
            else{
              exp = (ZtVWeb.strToValue(this.Filters[i].expression,this.Filters[i].type,pict)).toString();
            }
            result.push({filter_field: this.Filters[i].field,
                            filter_type: this.Filters[i].type,
                            filter_value: exp,
                            query_param: "",
                            filter_operation: this.Filters[i].operator});
          }
        }
        if (result.length < 1) { return result;}
        return JSON.stringify(result);
      }
      this.QueryParmsFunc=function(sep){
        sep=sep||'&';
        var res="";
        if(Empty(this.form[this.dataobj].parms)) return res;
        var params=this.form[this.dataobj].parms.split(',');
        for(var i=0;i<params.length;i++){
          if(this.isZoom){
            if(params[i].substr(0,2)=="w_"){
              res+=params[i]+"="+URLenc(ZtVWeb.formatAsPrm(this.form[params[i]].Value()))+sep;
            }
          }else{
            var nome1,nome2;
            if(params[i].indexOf('=')>-1){
              nome1=Trim(LTrim(params[i].substring(0,params[i].indexOf('='))))
              nome2=Trim(LTrim(params[i].substring(params[i].indexOf('=')+1)))
            }else{
              nome1=Trim(LTrim(params[i]))
              nome2=Trim(LTrim(nome1))
            }
            if (Empty(this.form[this.dataobj].parms_source)){
              if (this.form[nome2])
                valpar=this.form[nome2].Value();
              else valpar=nome2;
              res+=nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))+sep;
            }else{
              //prende parametri misti sia dal Parms_source sia da textbox
              if((typeof(this.form[nome2]))=='undefined'){
                valpar=this.form[this.form[this.dataobj].parms_source].getParam(nome2);
                res+=nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))+sep;
              }else{
                valpar=this.form[nome2].Value();
                res+=nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))+sep;
              }
            }
          }
        }
        return res;
      }
      this.GetFields=function(){
        var temp_fields=[];
        var tmpFieldName;
        for (var i=0; i<this.Cols.length;i++){
          //if(this.Cols[i].isImage!=1 && this.Cols[i].checkbox!=1)
          if (!this.Cols[i].hidden){
            if(!ZtVWeb.isExpr(this.Cols[i].field))
              temp_fields.push({field_name: this.Cols[i].field,
                  field_title: (this.Cols[i].title ? this.Cols[i].title : " "),
                  field_picture: (this.Cols[i].picture ? this.Cols[i].picture : " "),
                  field_type: (this.Cols[i].type ? this.Cols[i].type : " "),
                  field_image: false
              });
            else
              if(!(At("image:", this.Cols[i].field) > 1 && At("image:", this.Cols[i].field) < 0 )){
                tmpFieldName = Strtran(this.Cols[i].field,"image:","");
                tmpFieldName = Strtran(tmpFieldName,"%","");//Si presume che ci sia una sintassi image:%field%
                if(!ZtVWeb.isExpr(tmpFieldName)){ //Impedisco l'inserimento di funzioni e altro.
                  tmpFieldName=((At(":",tmpFieldName)-1) > 0 ? Substr(tmpFieldName,1,At(":",tmpFieldName)-1) : tmpFieldName);
                  if (LibJavascript.DOM.Ctrl(this.ctrlid+"_0_"+i) && LibJavascript.DOM.Ctrl(this.ctrlid+"_0_"+i).getElementsByTagName("img").length > 0) {//Immagine caricata in griglia
                    temp_fields.push({field_name: tmpFieldName,
                        field_title: (this.Cols[i].title ? this.Cols[i].title : " "),
                        field_type: (At("%", this.Cols[i].field) > 0 ? "expression" : "constant"),
                        field_image: true,
                        field_image_width: LibJavascript.DOM.Ctrl(this.ctrlid+"_0_"+i).getElementsByTagName("img")[0].width,
                        field_image_height: LibJavascript.DOM.Ctrl(this.ctrlid+"_0_"+i).getElementsByTagName("img")[0].height
                    });
                  }
                }
              }
          }
        }
        return JSON.stringify(temp_fields);
      }
      this.GetFieldsOrderBy=function(){
        var temp_order="",
            temp_orderby=[], i;
        if(this.isorderby){
          for (i=0; i<this.Cols.length;i++){
            if(!ZtVWeb.isExpr(this.Cols[i].field))
              if(this.Cols[i].orderbyidx>0)
                if(this.Cols[i].orderbystatus=="" || this.Cols[i].orderbystatus=="asc")
                  temp_orderby[this.Cols[i].orderbyidx]=this.Cols[i].field;
                else
                  temp_orderby[this.Cols[i].orderbyidx]=this.Cols[i].field+" "+this.Cols[i].orderbystatus;
          }
          for (i=0; i<temp_orderby.length;i++){
            if(temp_orderby[i]!="" && temp_orderby[i]!=undefined)
              temp_order+=temp_orderby[i]+";";
          }
          if(temp_order.length>0) temp_order=temp_order.substr(0,(temp_order.length-1));
        }
        return temp_order;
      }
      this.GetSelectedDataAsTrsString=function(){
        var mCurs=this.mem_curs;
        var f,v,t
        var otrs=new TrsJavascript(true);
        for(var iRow=1;iRow<=mCurs.RecCount();iRow++){
          mCurs.GoTo(iRow)
          otrs.SetRow(iRow);
          for(var i=0;i<mCurs.flds.length;i++){
            f=mCurs.flds[i].name
            t=mCurs.flds[i].type
            v=mCurs.get(f)
            otrs.setValue(f,ZtVWeb.valueToStr(v,t));
          }
        }
        return otrs.asString();
      }
      this.GetSelectAllAsTrsString=function(){
        var v=this._PPKSelStat
        var SAstr = ""
        var flds=this._PPK.split(',')
        flds.push("selectAll");
        var otrs=new TrsJavascript(true);
        var nrow=1
        for(var i in v){
          otrs.SetRow(nrow++)
          var itmp=i.substr(1,i.length)
          var vfld=itmp.split(',');
          vfld.push(v[i]);
          for(var j=0;j<vfld.length;j++){
              otrs.setValue(flds[j],vfld[j])
          }
	      }
        return otrs.asString();
      }
      this.RowChecked=function(newValue){
        if(this.checkbox){
          var baserec=this.baseRec();
          var cur_row=this.datasource.curRec-baserec-1
          var ctrl=LibJavascript.DOM.Ctrl(this.ctrlid+'_checkbox_row_'+cur_row);
          if(ctrl==null) return false;
          if (newValue==null)
            return ctrl.checked;
          ctrl.checked=(newValue?"checked":"")
          this.SetCheckBox(newValue)
          return newValue;
        }else{
          return false
        }
      }

      this.AllChecked=function(newValue){
        if (newValue==null)
          return  this.selectAll=='selectAll';
        this.SetCheckBoxAll(newValue);
        return newValue;
      }

      this.SetMemoOptions=function(bViewLayer,nCharacter){
        this.hideMemoLayer=!bViewLayer;
        if (nCharacter>0) this.lengthMemoLayer=nCharacter;
      }

      this.CHGSetParent = function(cParentName){
        this._CHGSetParent(cParentName);
      }
      this.EmptyHomogeneityFields = function(){
        this.homogeneity_fields=[];
      }
      this.SetHomogeneityFields = function(hf){
        this.homogeneity_fields=hf.split(',');
      }
      this._PPKLast = '';
      this._PPKLastCond=null
      this._PPK=''
      this._PPKSelStat = {};
      this._PPKDelMemCurs=function(cond){
        //Ciclo sul memory Cursor per trovare gli indici per la cancellazione dei record
        var indArr = [];
        var p=this.mem_curs.Find(cond);
        while (p!=0) {
          indArr.push(p);
          p=this.mem_curs.Find(cond,p+1);
        }
        for(var i=indArr.length; i>0;i--){
          this.mem_curs.Remove(indArr[i-1]);
        }
      }

      this._PPKSet = function(ppk){
        this._PPK=ppk
      }

      this._PPKGet=function(){
        if (this._PPK!=''){
          var c=this._PPK.split(',')
          var k=''
          this._PPKLastCond=[]
          for(var i=0;i<c.length;i++){
            if (this.datasource.getRecCount()>0) {
              k+=','+this.datasource.getStr(0,c[i])
              this._PPKLastCond.push([c[i],this.datasource.getValue(0,c[i])])
            }
          }
          return k
        }
        return ''
      }
      this._CHG = '';
      this._CHGArr = [];
      this._CHGSetParent = function(cParentName){
        this._CHG=cParentName;
        var op=this.form[this._CHG];
        op._CHGArr.push(this.name);
        this._PPKSet(op.sel_fields.join(','));
      }

      this._RefreshChildsForSelection = function(){
        for(var i=0; i<this._CHGArr.length;i++){
          var child = this.form[this._CHGArr[i]];
          if(child.openRowRel>-1)child._CloseRow();
          child.FillData(); //child.datasource
        }
      }

      this._DeleteChildsForUnselection = function(isSelAll){
        var i;
        if(this._CHGArr.length != 0){
          var KeysVals = [];
          if(isSelAll){
            if(!Empty(this._PPK)){
              var arrPPK = this._PPK.split(",");
              for(i = 0; i<arrPPK.length; i++){
                KeysVals.push([arrPPK[i],this.datasource.getValue(this.curRec-1,arrPPK[i])]);
              }
            }
          }else{
            var arrSF = this.sel_fields;
            for(i = 0; i<arrSF.length; i++){
              var c = arrSF[i];
              KeysVals.push([c,this.datasource.getValue(this.curRec-1,c)]);
            }
          }
          for(i = 0; i<this._CHGArr.length;i++){
            var child = this.form[this._CHGArr[i]];
            child._DeleteMCForUnselection(KeysVals,isSelAll);
            child._DeleteChildsForUnselection(isSelAll);
          }
        }
      }

      this._DeleteMCForUnselection = function(KeysVals,isSelAll){
        var k='', j, i;
        for(i=0;i<KeysVals.length;i++){
        k+=","+KeysVals[i][1]
        }
        for(j in this._PPKSelStat){
        if(j.indexOf(k) != -1){
          this._PPKSelStat[j] = 'unselectAll';
        }
        }
        // cancello
        this._PPKDelMemCurs(KeysVals);
        this.preserveData=true;
        // notifico ai miei figli di cancellare
        for(i = 0; i<this._CHGArr.length;i++){
          var child = this.form[this._CHGArr[i]];
          child._DeleteMCForUnselection(KeysVals);
        }
        this.FillData(this.datasource);
        this._renderOutputDataObj();
      }
      this.isDuplSK=function(){
        var baserec=this.baseRec(),
            nRecs=this.datasource.getRecCount(),
            res=nRecs-baserec, i, j;
        if (res>this.rows)
          res=this.rows
        var curr=this.curRec-1
        var sk=[]
        for(i=0;i<this.sel_fields.length;i++){
          sk.push(this.datasource.getStr(curr,this.sel_fields[i]))
        }
        for(i=0;i<res;i++){
          var p=baserec+i
          if (p!=curr) {
            for(j=0;j<this.sel_fields.length;j++){
              if (sk[j]!=this.datasource.getStr(p,this.sel_fields[j])){
                break;
              }
            }
            if (j==this.sel_fields.length){
              return true;
            }
          }
        }
        return false;
      }
      this.SetCheckBoxAll=function(checked){
        if(this.checkboxAllOfPage){
          this.SetCheckBoxAllOfPage(checked);
          return;
        }
        if (checked){
          this.selectAll='selectAll'
        }else{
          this.selectAll='unselectAll'
        }
        if(!EmptyString(this._PPKLast)){
          this._PPKSelStat[this._PPKLast] = this.selectAll;
          this._PPKDelMemCurs(this._PPKLastCond)
        } else {
          this._initMemCurs()
        }
        this._renderOutputDataObj();
        this.preserveData=true
        this.FillData(this.datasource)
        this._RefreshChildsForSelection();
        if (!checked)  this._DeleteChildsForUnselection(true);
        this.dispatchEvent('SelectAllChange');
      }
      this.SetCheckBoxAllOfPage = function(checked){
        var oGrid = this;
        var recCount = this.datasource.getRecCount();
        var gridRows = oGrid.rows;
        var curRec = oGrid.curRec - (oGrid.curRec % oGrid.rows) + 1;
        var i = 0;
        while (true){
          oGrid.curRec = i + curRec;
          var ctrl = document.getElementById(oGrid.ctrlid + '_checkbox_row_' + i);
          if (!Empty(ctrl)){
            ctrl.checked = checked;
            oGrid.SetCheckBox(checked);
          }
          else{
            break;
          }
          i++;
        }
        oGrid.curRec = curRec;
      }
      this.SetCheckBox=function(checked){
        if(checked){
          if(this.form[this.name+'_ValidateRow'])
            if(!this.form[this.name+'_ValidateRow']()){
              this.RowChecked(false);
              return;
            }
        }
        // else{
          // if(this.form[this.name+'_Validate_Unselect']){  // se esiste nell' actioncode la funzione di Unselect
            // if(!this.form[this.name+'_Validate_Unselect']()){
              // this.RowChecked(true);
              // return;
            // }
          // }
        // }
        var srcdata=this.datasource;
        var repaint=false;
        if(this.curRec-1<srcdata.getRecCount()){
          var row_clicked=this.curRec-1;
          var bThrowEvent=false;
          if(checked){
            var iRowToUpd=this.findCurRowInMemCurs(row_clicked)
            if(iRowToUpd!=0){
              if (this.selectAll!="selectAll") {
                this.mem_curs.GoTo(iRowToUpd)
                if (this.mem_curs.get("ps_rowstatus")=="U"){
                  this.mem_curs.Remove(iRowToUpd)
                }
              } else {
                // devo togliere il record che era marcato come da deselezionare
                this.mem_curs.Remove(iRowToUpd)
              }
            } else {
              //la checkbox e' stata chekkata, inserisco il record
              this.appendRowInMemCurs(row_clicked,"S")
            }
            repaint=this.isDuplSK() // problema del check multiplo
          }else{
            //la checkbox e' stata dechekkata, cancello il record
            var iRowToDel=this.findCurRowInMemCurs(row_clicked)
            if (iRowToDel!=0){
              this.mem_curs.GoTo(iRowToDel);
              var oldstatus=this.mem_curs.get("ps_rowstatus")
              if (this.selectAll!="selectAll" && (!this.hasPrecheck || this.datasource.getValue(row_clicked,this.preCheckbox_fld)==0)) {
                if(this.form[this.name+'_Validate_Unselect']){  // se esiste nell' actioncode la funzione di Unselect
                  if(!this.form[this.name+'_Validate_Unselect']()){
                    this.RowChecked(true);
                    return;
                  }
                }
                this.mem_curs.Remove(iRowToDel)
              } else {
                if(this.form[this.name+'_Validate_Unselect']){  // se esiste nell' actioncode la funzione di Unselect
                  if(!this.form[this.name+'_Validate_Unselect']()){
                    this.RowChecked(true);
                    return;
                  }
                }
                this.mem_curs.set("ps_rowstatus","U")
                this.resetMemCursEdit(iRowToDel)
              }
              repaint=this.isDuplSK() // problema del check multiplo
              if (!repaint) {
                repaint=(oldstatus=='M') //deve ridisegnare i campi di edit portandoli al vecchio valore (possibile ottimizzazione)
              }
            } else {
              if (this.selectAll=="selectAll" || this.hasPrecheck) {
                if(this.form[this.name+'_Validate_Unselect']){  // se esiste nell' actioncode la funzione di Unselect
                  if(!this.form[this.name+'_Validate_Unselect']()){
                    this.RowChecked(true);
                    return;
                  }
                }
                this.appendRowInMemCurs(row_clicked,"U")
              }
              repaint=this.isDuplSK() // problema del check multiplo
            }
          }
          this.openRowRel=-1
          //--------------------------Criterio Omogeneita'
          if (this.homogeneity_fields.length>0) {
            var i;
            if(this.hmg_as_filter){
              if(checked && this.mem_curs.RecCount()==1){
                //e' appena stata chekkata la prima checkbox, devo inserire i filtri
                for(i=0;i<this.homogeneity_fields.length;i++){
                  var filter=this.MakeFilter(this.homogeneity_fields[i],'=',srcdata.getValue(row_clicked,this.homogeneity_fields[i]));
                  this.AddFilter(filter,false);
                  this.hmg_filters_id.push(filter.id);
                }
              }else if(this.mem_curs.RecCount()==0){
                //e' stato dechekkato l'ultimo checkbox, devo togliere tutti i filtri che ho messo
                for(i=0;i<this.hmg_filters_id.length;i++)
                  this.RemoveFilter(this.hmg_filters_id[i])
                this.hmg_filters_id=[];
              }
              this.preserveData=true;
              this.ApplyFilter();
            }else{
              if(checked && this.mem_curs.RecCount()==1){
                this.homogeneity_filter={}
                for(i=0;i<this.homogeneity_fields.length;i++){
                  this.homogeneity_filter[this.homogeneity_fields[i].toLowerCase()]=srcdata.getValue(row_clicked,this.homogeneity_fields[i])
                }
              }else if(this.mem_curs.RecCount()==0){
                this.homogeneity_filter=null
              }
              repaint=true
            }
          }
          //------------------------------------------------
          if (repaint){
            this.preserveData=true;
            this.FillData(srcdata);
            bThrowEvent=true;
          }
          this._renderOutputDataObj();
          if (checked && this.existsEditable){
            for(var i=0;i<this.Cols.length;i++){
              var col =this.Cols[i];
              if(col.editable && document.getElementById(this.get_td_id(i,row_clicked-this.baseRec())+'_input').disabled!=true && document.getElementById(this.get_td_id(i,row_clicked-this.baseRec())+'_input').readOnly!=true){
                this.toggleEditFields(row_clicked,true,col.field);
                if(col.field.indexOf('checkbox:')>-1)
                  this._CloseRow();
                break;
              }
            }
          }
          if(bThrowEvent)
            this.dispatchEvent('DataChange');
          this.dispatchEvent("SelectionChange",checked);
        }
        this._RefreshChildsForSelection();
        if (!checked)  this._DeleteChildsForUnselection(false);
      }
      this.GetSelectedData=function(){
        var flds=[], i, j, c;
        for(i=0;i<this.sel_fields.length;i++){
          flds.push(this.sel_fields[i]);
        }
        for(i=0;i<this.Cols.length;i++){
          if(this.Cols[i].editable){
            flds.push(clearField(this.Cols[i].field)+'_old')
            flds.push(clearField(this.Cols[i].field)+'_new')
          }
        }
        var mCurs=this.mem_curs
        var modified_data=[]
        for(i=1;i<=mCurs.RecCount();i++){
          var r=[]
          mCurs.GoTo(i)
          for(j=0;j<this.sel_fields.length;j++){
            c = this.sel_fields[j];
            r.push(ZtVWeb.valueToStr(mCurs.get(c),this.datasource.getType(c)))
          }
          for(j=0;j<this.Cols.length;j++){
            if(this.Cols[j].editable){
              c = clearField(this.Cols[j].field);
              r.push(ZtVWeb.valueToStr(mCurs.get(c+'_old'),this.datasource.getType(c)))
              r.push(ZtVWeb.valueToStr(mCurs.get(c+'_new'),this.datasource.getType(c)))
            }
          }
          modified_data.push(r)
        }
        var fldtypes="",cType
        for(j=0;j<this.sel_fields.length;j++){
          fldtypes+=this.datasource.getType(this.sel_fields[j])
        }
        for(j=0;j<this.Cols.length;j++){
          if(this.Cols[j].editable){
            cType=this.datasource.getType(clearField(this.Cols[j].field));
            fldtypes+=cType+cType;
          }
        }
        modified_data.push('tf,'+fldtypes+','+modified_data.length)
        return {Fields:flds,Data:modified_data}
      }
      this._renderOutputDataObj=function(){
        var outData=this.form[this.outDataObj];
        if(outData!=null && this.HasDataSourceSqlDataprovider(outData)){
          var mCurs=this.mem_curs,
              modified_data=[],
              totals_data={'Fields':[], 'Data':[]},
              i, j, c;
          for(i=1;i<=mCurs.RecCount();i++){
            var r=[]
            mCurs.GoTo(i)
            for(j=0;j<this.sel_fields.length;j++){
              c = this.sel_fields[j];
              r.push(ZtVWeb.valueToStr(mCurs.get(c),this.datasource.getType(c)))
            }
            for(j=0;j<this.Cols.length;j++){
              if(this.Cols[j].editable){
                c = clearField(this.Cols[j].field);
                r.push(ZtVWeb.valueToStr(mCurs.get(c+'_old'),this.datasource.getType(c)));
                r.push(ZtVWeb.valueToStr(mCurs.get(c+'_new'),this.datasource.getType(c)));
              }
            }
            if (this.hasPrecheck)
              r.push(mCurs.get(this.preCheckbox_fld))
            r.push(mCurs.get("ps_rowstatus"))
            modified_data.push(r)
          }
          var fldtypes="",cType;
          for(j=0;j<this.sel_fields.length;j++){
            fldtypes+=this.datasource.getType(this.sel_fields[j])
          }
          for(j=0;j<this.Cols.length;j++){
            if(this.Cols[j].editable){
              cType=this.datasource.getType(clearField(this.Cols[j].field))
              fldtypes+=cType+cType
            }
          }
          if (this.hasPrecheck)
            fldtypes+='N'
          modified_data.push('tf,'+fldtypes+'C,'+modified_data.length)
          var flds=[]
          for(i=0;i<this.sel_fields.length;i++){
            flds.push(this.sel_fields[i])
          }
          for(j=0;j<this.Cols.length;j++){
            if(this.Cols[j].editable){
              flds.push(clearField(this.Cols[j].field)+'_old')
              flds.push(clearField(this.Cols[j].field)+'_new')
            }
          }
          if (this.hasPrecheck)
            flds.push(this.preCheckbox_fld)
          flds.push("ps_rowstatus")
          //Crea i Totali
          if(!Empty(outData.totalizeParms)){
            var totAlias=outData.oldAliasTotalizer;
            var totFldTypeList='';
            var tt = []
            for(var k=0;k<totAlias.length;k++){
             totals_data.Fields.push(totAlias[k]);
             tt.push(mCurs.getTotal(totAlias[k]));
             totFldTypeList+=this.datasource.getType(Strtran(totAlias[k],'_new',''));
            }
            totals_data.Data.push(tt);
            totals_data.Data.push('tf,'+totFldTypeList+','+totals_data.Data.length)
          }
          var JSONObj={
            'Fields':flds,
            'Data':modified_data,
            'Totals':totals_data
          };
          outData.Empty();
          outData.nRows=modified_data.length-1;
          outData.RenderQuery(null,JSONObj);
          outData.isStaticDataProvider = true;
        }
      }
      this.appendRowInMemCurs=function(curRec,ps_rowstatus){
        var pos=this.mem_curs.AppendBlank(), iFld, c, v
        for(iFld=0;iFld<this.sel_fields.length;iFld++){
          c=this.sel_fields[iFld];
          this.mem_curs.set(c,this.datasource.getValue(curRec,c));
        }
        for(iFld=0;iFld<this.Cols.length;iFld++){
          if(this.Cols[iFld].editable){
            c=clearField(this.Cols[iFld].field);
            v=this.datasource.getValue(curRec,c)
            this.mem_curs.set(c+"_old",v);
            this.mem_curs.set(c+"_new",v);
          }
        }
        this.mem_curs.set("ps_rowstatus",ps_rowstatus)
        if (this.hasPrecheck)
          this.mem_curs.set(this.preCheckbox_fld,this.datasource.getValue(curRec,this.preCheckbox_fld))
        return pos;
      }
      this.findCurRowInMemCurs=function(cur_row){
        var cond=[]
        for(var iFld=0;iFld<this.sel_fields.length;iFld++){
          var c=this.sel_fields[iFld];
          cond.push([c,this.datasource.getValue(cur_row,c)]);
        }
        return this.mem_curs.Find(cond)
      }
      this.resetMemCursEdit=function(iPos){
        this.mem_curs.GoTo(iPos)
        for(var i=0,c;i<this.Cols.length;i++){
          if(this.Cols[i].editable){
            c=clearField(this.Cols[iFld].field);
            this.mem_curs.set(c+'_new',this.mem_curs.get(c+'_old'));
          }
        }
      }
      this.getInputCtrl=function(fld){
        if (this.curRec>0){
          var colIdx=this.findFieldInCols(fld);
          if (colIdx!=null){
            var ctrlName=this.get_td_id(colIdx,this.CurrRow());
            return document.getElementById(ctrlName+'_input');
          }
        }
        return null;
      }

      this.EditValue=function(fld,value){
        if (this.openRowRel!=-1){
          var colIdx=this.findFieldInCols(fld,true);
          if (colIdx!=null){
            var col=this.Cols[colIdx];
            var ctrl=this.getInputCtrl(fld);
            if (ctrl!=null){
              if(value!=null){
                if(this.RowValue(fld)!=value){
                  var txt=ZtVWeb.applyPicture(value,col.type,0,col.picture);
                  if(ctrl.type=='checkbox'){
                    if(ZtVWeb.getCheckForCheckbox(txt))
                      ctrl.checked='checked';
                    else
                      ctrl.checked='';

                  }else
                    ctrl.value=(col.type=='N' ? Strtran(txt,milSep,'') : txt )
                  this.dispatchEvent("Calculate",Strtran(fld,'checkbox:',''));
                  this.fld_editing=null;
                }
              }else{
                value=ZtVWeb.strToValue(ctrl.value,col.type,col.picture);
              }
              return value;
            }
          }
        }
        return null
      }
      this.RowCount=function(){
        var baserec=this.baseRec();
        var nRecs=this.datasource.getRecCount()
        var res=nRecs-baserec
        if (res>this.rows)
          res=this.rows
        return res
      }
      this.baseRec=function(){
        if(this.appendingData ||this.scroll_bars=='infinite_scroll')
          return 0;
        else
          return Math.floor((this.curRec-1)/this.rows)*this.rows;

      }
      this.CurrRow=function(newPos){
        var baserec=this.baseRec();
        if (newPos==null) {
          if (this.openRowRel!=-1)
            return this.openRowRel
          return this.datasource.curRec-baserec-1
        } else {
          this.SetCurRec(baserec+newPos+1,false)
          return newPos;
        }
      }
      this.RowValue=function(fld,n){
        if (n==null) n=this.CurrRow()
        var colIdx=this.findFieldInCols(fld);
        if (colIdx!=null) {
          var col=this.Cols[colIdx]
          var ctrl,txt;
          var isCheckbox=(col.field.indexOf('checkbox:')>-1);
          var ctrlName=this.get_td_id(colIdx,n);
          if (this.openRowRel==n) {
            ctrl=document.getElementById(ctrlName+'_input');
            if (ctrl!=null)
              if(isCheckbox){
                if(ctrl.checked)
                  txt='1';
                else
                  txt='0';
              }else
                txt=ctrl.value;
            else
              ctrl=document.getElementById(ctrlName+'_viewDiv')
          } else {
            ctrl=document.getElementById(ctrlName+'_viewDiv')
          }
          if (ctrl!=null) {
             if (txt==null) txt=ctrl.textContent;
             if (txt==null) txt=ctrl.innerText;
             return ZtVWeb.strToValue(txt,col.type,col.picture)
          }
        }
        return null
      }
      this.findFieldInCols=function(fld,onlyEditable){
        var fld_tmp
        for(var i=0;i<this.Cols.length;i++){
          fld_tmp=this.Cols[i].field
          if(onlyEditable && !this.Cols[i].editable) continue;
          if(fld_tmp.indexOf('checkbox:')>-1){
            fld_tmp=Strtran(fld_tmp,'checkbox:','');fld_tmp=Strtran(fld_tmp,'%','');
          }else if(fld_tmp.indexOf('combobox:')>-1){
             fld_tmp=clearField(fld_tmp);
          }
          if (fld_tmp==fld)
            return i
        }
        return null
      }
      this.openRow=-1;
      this.openRowRel=-1;
      this.fld_editing;
      this.getOpenRowRel=function(openRow, baserec){
        return openRow - baserec;
      }
      this.toggleEditFields=function(cur_row,open,targetfld,fromBlur){
        // console.log("toggleEditFields "+(open?"open":"close"));
        // console.log("ActiveElement: "+window.document.activeElement.id)
        if(this.openRowRel==-1) this.openRow=-1;
        if ((!open && this.openRowRel==-1)) {return;} // non deve chiudere righe chiuse
        if(open && this.openRowRel>-1) {return;} // non puo aprire una riga se ce n'e un'altra aperta
        if (open && cur_row!=(this.curRec-1)) {this.SetCurRec((cur_row+1),true);}
        if(targetfld!=null && targetfld.indexOf('checkbox:')>-1){
          targetfld=Strtran(targetfld,'checkbox:','');
        }
        if(targetfld!=null && targetfld.indexOf('combobox:')>-1){
          targetfld=clearField(targetfld);
        }
        if(open) this.fld_editing=targetfld;
        var baserec=this.baseRec();
        if(open){
          window.clearTimeout(this.editfld_timeoutid)
          //chiamata per mostrare i campi di input. controllo se ci sono gia' degli altri campi in un'altra riga che non sono ancora stati nascosti.
          //in questo caso mi richiamo piu' tardi
          if(this.openRow==cur_row){
            return false;
          }else if (this.openRow!=-1){
            this.toggleEditFields(this.openRow,false);
          }
          this.openRow=cur_row;
          this.openRowRel=this.getOpenRowRel(this.openRow,baserec);
        }
        var srcdata=this.datasource;
        //Validate Rown alla chiusura
        if (!open && this.form[this.name+'_ValidateRow'])
          if(!this.form[this.name+'_ValidateRow']()){
            var openrow_rel_tmp=this.openRowRel;
            this.openRow=-1
            this.openRowRel=-1
            if(!Empty(targetfld)){
              for(var i=0;i<this.Cols.length;i++){
                if(this.Cols[i].field==targetfld){
                  //document.getElementById(this.get_td_id(i,openrow_rel_tmp)+'_editDiv').firstChild.fireEvent('onclick');
                  //document.getElementById(this.get_td_id(i,openrow_rel_tmp)+'_editDiv').firstChild.focus();
                  break;
                }
              }
            }
            return;
          }

        var bThrowSelectionEvent=false,dataChanged=false;
        var repaint=false,renderOutput=false;
        var memCurPos = this.findCurRowInMemCurs(cur_row)
        for(var i=0;i<this.Cols.length;i++){
          var col=this.Cols[i];
          if (col.editable && col.inExtGrid==0) {
            var col_field=col.field,isCheckbox=false;
            if (col_field.substr(0,9)=="checkbox:") {
              col_field=col_field.substr(9);
              isCheckbox=true;
              //if(targetfld==col_field)
               // open=false; // Chiudi se è checkbox quello in edit
            } else if(col_field.substr(0,9)=="combobox:"){
             col_field=clearField(col_field);
              //if(targetfld==col_field)
              // open=false; // Chiudi se è combobox quello in edit
            }
            //partendo dai div contenente il dato visualizzato ottengo il riferimento al div contente il relativo campo di input
            var divId=this.get_td_id(i,this.openRowRel)
            var editDiv=document.getElementById(divId+'_editDiv');
            var viewDiv=document.getElementById(divId+'_viewDiv');
            var inputFld=document.getElementById(divId+'_input');
            if(open){// Apre la riga
              //devo mostrare il campo di input
              //viewDiv.style.display='none';
              //viewDiv.style.visibility='hidden';
              editDiv.style.display='block';
              editDiv.style.visibility='visible';
              if(col_field==targetfld && !isCheckbox){
                if(!inputFld.disabled){inputFld.focus();}
              }
            }else{// Chiude la riga
              //devo nascondere il campo di input e capire cosa farne del dato in esso
              //   viewDiv.style.display='block';
              //   viewDiv.style.visibility='visible';
              //   editDiv.style.display='none';
              //    editDiv.style.visibility='hidden';
              /* Errore con IE11+ se richiamo il blur in questo modo:
                  utilizzando il tab si passa dall'input editabile
                  al body invece che al seguente campo;
                 Richiamo la manageInputBlur direttamente senza forzare il blur
              */
              // if(!fromBlur)
               // inputFld.blur();
              // manageInputBlur(cur_row,target,colIdx);
              // this.manageInputBlur(cur_row,inputFld,i);
              if(!fromBlur)
                this.manageInputBlurInternal(cur_row,inputFld,i,fromBlur);
              if(this.openRowRel==-1) {return;}
              var old_val=srcdata.getValue(cur_row,col_field);
              var new_val
              if (isCheckbox) {
                 var new_c=inputFld.checked,old_c=ZtVWeb.getCheckForCheckbox(old_val);
                 if (new_c==old_c) new_val=old_val
                 else if (new_c) new_val='1';  //ZtVWeb.getCheckForCheckbox('1'); //
                 else new_val='0';   //ZtVWeb.getCheckForCheckbox('0');
              } else
                new_val=ZtVWeb.strToValue(inputFld.value,col.type,col.picture);
              // dobbiamo scriverlo nel memory cursor
              var updateHTML=false
              renderOutput=true
              if(this.isDiffOldNewVal(col.field)) {
                if(memCurPos>0) {
                  this.mem_curs.GoTo(memCurPos)
                  this.mem_curs.set(col_field+'_new',new_val)
                  dataChanged=true;
                  if (col.type.match("M")) new_val=ToHTag(new_val);
                  if (this.mem_curs.get("ps_rowstatus")=="U"){
                    bThrowSelectionEvent=true;
                    repaint=this.isDuplSK()
                    if (!repaint){
                      document.getElementById(this.ctrlid+'_checkbox_row_'+this.openRowRel).checked='checked'
                    }
                  } else {
                    repaint=this.isDuplSK(); // problema del check multiplo
                  }
                  this.mem_curs.set("ps_rowstatus","M")
                } else {
                  memCurPos=this.appendRowInMemCurs(cur_row,"M")
                  this.mem_curs.set(col_field+'_new',new_val)
                  if (col.type.match("M")) new_val=ToHTag(new_val);
                  bThrowSelectionEvent=true;dataChanged=true;
                  repaint=this.isDuplSK()
                  if (!repaint){
                    if(this.checkbox)
                      document.getElementById(this.ctrlid+'_checkbox_row_'+this.openRowRel).checked='checked'
                    this._RefreshChildsForSelection()
                  }
                }
              }
              updateHTML=true;
              if (updateHTML) {
                var txt=ZtVWeb.applyPicture(new_val,col.type,0,col.picture);
                var new_div=false;
                if (col.type.match("M") && !this.hideMemoLayer) {
                  var indice=txt.indexOf("<BR>");
                  if (indice>-1){
                    txt=txt.substr(0,indice);
                    if (viewDiv.childNodes.length==1)
                      viewDiv.innerHTML = this.MemoCellString(cur_row,col);
                    new_div=true;
                  } else viewDiv.innerHTML = "";
                }
                //if (isCheckbox)  viewDiv.childNodes[0].childNodes[1].checked=(ZtVWeb.getCheckForCheckbox(txt)?"checked":"")
                else if (viewDiv.childNodes.length==2) viewDiv.childNodes[1].nodeValue=txt;
                else if (new_div) viewDiv.innerHTML+=txt;
                else {
                  if(!(col.type=='D'&& ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date) &&
                     !(col.type=='T'&& ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.datetimeLocal)){
                    inputFld.value=txt;
                    viewDiv.innerHTML=txt;
                  }
                }
              }
            }
          }
        }
        if(repaint){
          this.preserveData=true;
          this.FillData(srcdata);
        }
        if(renderOutput)
          this._renderOutputDataObj();
        if(!open){
          this.openRow=-1;
          this.openRowRel=-1;
          if(bThrowSelectionEvent)
            this.dispatchEvent('SelectionChange',true);
          if(dataChanged)
            this.dispatchEvent('DataChange');
        }else{
          if(this.form[this.name+'_StartEdit'])
            this.dispatchEvent("StartEdit");
        }
      }
      this.SetFocus=function(fld){
        if (this.openRowRel!=-1){
          for(var i=0;i<this.Cols.length;i++){
            var col=this.Cols[i]
            if (col.editable) {
              var col_field=col.field,isCheckbox=false;
              if (col_field.substr(0,9)=="checkbox:") {
                col_field=col_field.substr(9);
                isCheckbox=true;
               }
              //partendo dai div contenente il dato visualizzato ottengo il riferimento al div contente il relativo campo di input
              var divId=this.get_td_id(i,this.openRowRel);
              var editDiv=document.getElementById(divId+'_editDiv');
              if(col_field==fld && !isCheckbox){
                if(!editDiv.firstChild.disabled){editDiv.firstChild.focus();return true;}
              }
            }
          }
        }
        return false;
      }
      this.OpenRow=function(n,fld){
        var fld_toEdit=(Empty(fld)?null:fld);
        var new_n=((!Empty(n) || n==0)?this.CurrRow(n):this.CurrRow());
        var baserec=this.baseRec();
        this.toggleEditFields(new_n+baserec,true,fld_toEdit);
      }
      this.isDiffOldNewVal=function(fld){
        var old_val,new_val;
        var isCheckbox=(fld.indexOf('checkbox:')>-1);
        if(isCheckbox)fld=Strtran(fld,'checkbox:','');
        if(fld!=null && fld.indexOf('combobox:')>-1)
          fld=clearField(fld);
        var colIdx=this.findFieldInCols(fld,true);
        var col=this.Cols[colIdx];
        var divId=this.get_td_id(colIdx,this.openRowRel);
        var input=document.getElementById(divId+'_input');
        var viewDiv=document.getElementById(divId+'_viewDiv');
        if (col.type.match("M")) {//memo oltre il limite di caratteri visibili
          new_val=Trim(ZtVWeb.strToValue(input.value,col.type,col.picture));
          old_val=ZtVWeb.strToValue(viewDiv.innerHTML,col.type,col.picture);
          old_val= Trim(ToHTag(old_val));
          if (old_val.substr(0,4).toUpperCase()=="<DIV") {
            //old_val=this.datasource.Data[this.openRow][colIdx];
            old_val=Trim(this.datasource.getValue(this.openRow,fld));
          }
        }else if(col.type.match("C")){
          new_val=Trim(ZtVWeb.strToValue(input.value,col.type,col.picture));
          old_val=Trim(FromHTML(ZtVWeb.strToValue(viewDiv.innerHTML,col.type,col.picture)));
        }else  {
          new_val=ZtVWeb.strToValue(input.value,col.type,col.picture);
          old_val=ZtVWeb.strToValue(viewDiv.innerHTML,col.type,col.picture);
        }
        if(isCheckbox){
          new_val=ZtVWeb.strToValue(input.checked,col.type,col.picture);
          old_val=ZtVWeb.strToValue(viewDiv.innerHTML,col.type,col.picture);
        }
        return !Eq(new_val,old_val);
      }
      this.CloseRow=function(){
        var rowId;
        if(this.openRowRel>-1){
          rowId=this.ctrlid+'_'+this.openRowRel+"_";
        }
        this._CloseRow();
        if(rowId!=null && document.activeElement && document.activeElement.id.indexOf(rowId)>-1)
          document.activeElement.blur();//Quando la chiamata è da action code bisogna forzare il blur
      }
      this._CloseRow=function(){
         if(this.openRowRel>-1){
           this.closingRow=true;
          //Lancio la Calculate di un eventuale campo prima della chiusura
          if(!Empty(this.fld_editing)){
            if(this.isDiffOldNewVal(this.fld_editing))
              this.dispatchEvent("Calculate",this.fld_editing);
          }
          var baserec=this.baseRec();
          this.toggleEditFields(this.openRowRel+baserec,false,null);
          this.fld_editing=null;
           this.closingRow=false;
        }
      }
      this.CloseChildsRow=function(){
        var Arr = LibJavascript.Array;
        Arr.forEach( this.datasource.paramconsumers, function (paramconsumer) { // Chiude tutte le righe aperte dei rowsconsumer
          if ( paramconsumer.rowsconsumers && paramconsumer.rowsconsumers.length ) {
            Arr.forEach( paramconsumer.rowsconsumers, function (rowsconsumer) {
              if ( rowsconsumer._CloseRow ) {
                rowsconsumer._CloseRow();
              }
            } );
          }
        } );
      }
      var noclick=function(){return false};
      this.DisableField=function(fld){
        var ctrl=this.getInputCtrl(fld);
        var calc=document.getElementById(ctrl.id+'_calc');
        var calendar=document.getElementById(ctrl.id+'_calendar');
        var calendar_a=document.getElementById(ctrl.id+'_calendar_a');
        if(calendar_a)calendar=calendar_a;
        if(ctrl) ctrl.disabled=true;
        if(calc) {
          calc._onclick=calc.onclick;
          calc.onclick=noclick;
        };
        if(calendar) {
          calendar._onclick=calendar.onclick;
          calendar.onclick=noclick;
        };
      }
      this.EnableField=function(fld){
        var ctrl=this.getInputCtrl(fld);
        var calc=document.getElementById(ctrl.id+'_calc');
        if(ctrl) ctrl.disabled=false;
        if(calc && calc._onclick && calc.onclick==noclick){
          calc.onclick=calc._onclick;
        }
      }

      this.UpdateBO=function(o,msg){
        if(!Empty(this.business_obj)){
          var operation=(!Empty(o)?o:'update');
          var URL = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL + '/servlet/spgridoperation?m_cID='+this.m_cID+'&entity_name='+this.business_obj+'&operation='+operation+'&serialized_memorycursor='+this.GetSelectedDataAsTrsString(), true);
          var url = URL.SetUnwrapMsg(false);
          var output=url.Response();
          var msgFailedLogin,msgFailedAccess;
          var err;
          if ( url.error) {
            err=url.errorCause;
          }
          if ( !EmptyString(msgFailedLogin = url.FailedLogin()) ) {
            err=msgFailedLogin;
          } else if ( !EmptyString(msgFailedAccess = url.FailedAccess()) ) {
            err = msgFailedAccess;
          } else {
            var KO = 'KO()',
                KO_IDX = output.indexOf(KO),
                error = KO_IDX>-1;
            if ( error ) {
              err =  eval("'"+ZtVWeb.JSURL.unwrap(output).substring(KO.length+1, output.length-1)); //aggiunto apice all'inizio perche' la substring toglie "'KO()"
            } else {
              err= ZtVWeb.JSURL.unwrap(output);
            }
          }
          if(this.form[this.name+'_UpdatedBO']){
            this.form[this.name+'_UpdatedBO'](operation,err);//Eventuale funzione in actioncode
            if(Empty(err)){
              this._initMemCurs();
              this._renderOutputDataObj();
              this.Refresh(true);
            }
            return;
          }
          if(operation=='update' && Empty(err)){ //Update
            if(Empty(msg)) msg=this.BOSavedOkMsg;
            if(Empty(msg)) msg=ZtVWeb.GridTranslations["Saved_ok"];
            alert(msg);
            this._initMemCurs();
            this._renderOutputDataObj();
            this.Refresh(true);
          }else if(operation=='delete' && Empty(err)){
            this._initMemCurs();
            this._renderOutputDataObj();
            this.Refresh(true);
          }else if(!Empty(err))
            alert(err);
        }
      }
      this.DeleteBO=function(msg){
        if(Empty(msg)) msg=this.confirmBODeleteMsg;
        if(Empty(msg)) msg=ZtVWeb.GridTranslations["Confirm_delete"];
        if(confirm(msg))
          this.UpdateBO('delete');
      }
      this.movingfocus=false;
      this.old_edit_val;
      this.manageInputBlurInternal=function(cur_row,target,colIdx,fromBlur){
        if (this.movingfocus) return; //{this.movingfocus=false;return}
        if ((this.closingRow && fromBlur) || typeof(this.openRowRel)=='undefined' || this.openRowRel==null || this.openRowRel==-1) return;
        var col=this.Cols[colIdx];
        var res=this.checkEditInput(cur_row,target,colIdx);
        var isCheckbox=(col.field.indexOf('checkbox:')>-1);
        if (!res) {
          // mentre sposta il fuoco non deve attivare la manageinput dell' eventuale campo su cui si e' portato il cursore
          if(isCheckbox){
            target.checked=(ZtVWeb.getCheckForCheckbox(this.old_edit_val)?"checked":"");
            //this._CloseRow()
          }else{
            target.value=ZtVWeb.applyPicture(this.old_edit_val,col.type,0,col.picture);
            target.focus();
          }
          this.movingfocus=true;
          var _this=this;
          var _target=target;
          // se il fuoco si era perso senza andare in un altro campo, bisogna azzerare la variabile che segnala il ritorno al campo il cui check e' fallito
          window.setTimeout(function(){if(!isCheckbox)_target.focus();_this.movingfocus=false;},100);
          return false;
        }
        return true;
      }
      this.manageInputBlur=function(cur_row,target,colIdx){
        var res =this.manageInputBlurInternal(cur_row,target,colIdx,true);
        if( !res )
          return false;
        this.toggleEditFields(cur_row,false,this.Cols[colIdx].field,true);
        return true;
      }
      this.checkEditInput=function(cur_row,target,colIdx){
        var col=this.Cols[colIdx];
        if(Empty(target)) return true;
        var res=true;
        if(col.field.indexOf('checkbox:')==-1)// se è check box non fa il controllo
          res=ZtVWeb.checkInput(col.type=='N'?Strtran(Strtran(target.value,milSep,''),',','.'):target.value,col.type,col.picture,true)
        var edited=false;
        var baserec=this.baseRec();
        this.openRowRel=this.getOpenRowRel(cur_row,baserec);
        if (res){
          edited=this.isDiffOldNewVal(col.field);
        }
        if(res && edited && this.form[this.name+'_Validate']){  // se esiste nell' actioncode la funzione di validazione
            res=this.form[this.name+'_Validate'](clearField(col.field));
        }
        if (res && edited && this.fld_editing){
          this.dispatchEvent("Calculate",this.fld_editing);
          this.fld_editing=null;
        }
        return res
      }

      this.parseProperties=function(cellproperties){
        cellproperties=cellproperties.split(' ')
        var propsarray;
        if(cellproperties.length>0) {
          var hasWeight=false, hasWidth=false
          propsarray=new Array()
          if(cellproperties[0].toLowerCase()=='bold' || cellproperties[0].toLowerCase()=='normal' || cellproperties[0].toLowerCase()=='italic'){
            propsarray[0]=cellproperties[0]
            hasWeight=true
          }else{
            propsarray[0]=''
          }
          if(isNaN(parseInt(cellproperties[cellproperties.length-1].replace('%','')))) {
            propsarray[2]=''
          } else {
            propsarray[2]=cellproperties[cellproperties.length-1]
            hasWidth=true
          }
          if (!hasWidth && !hasWeight) propsarray[1]=cellproperties[0]
          else if (hasWidth && !hasWeight && cellproperties.length==2 ) propsarray[1]=cellproperties[0]
          else if (!hasWidth && hasWeight && cellproperties.length==2 ) propsarray[1]=cellproperties[1]
          else if (hasWidth && hasWeight && cellproperties.length==3 ) propsarray[1]=cellproperties[1]
          else  propsarray[1]=''
        } else {
          propsarray=new Array('','','')
        }
        return propsarray
      }
      this.getTableHeight=function() {
        return document.getElementById('__tbl_'+this.ctrlid+'_container').offsetHeight;
      }
      this.adjustRowsHeight=function(){
        var t=document.getElementById('tbl'+this.ctrlid);
        if(!t)return;
        var tHeadHeight=0;
        var tFootHeight=0;
        if(t.tHead)
          tHeadHeight=t.tHead.offsetHeight;
        if(t.tFoot)
          tFootHeight=t.tFoot.offsetHeight;
        /*Controllo della minRowHeight*/
        var tr_count=t.rows.length;
        var rowMinHeight = this.rowMinHeight ? this.rowMinHeight : ( SPTheme.grid_row_min_height ? SPTheme.grid_row_min_height : 0) ;
        var row_height = this.rows==1000 ? 0 : Math.max(rowMinHeight||0, Math.floor((this.minheight-tHeadHeight-tFootHeight-this.TopToolsbarContainer().offsetHeight)/(this.rows*this.linesCount))-cellspacing);
        var tRows=t.tBodies[0].rows;
        for(var i=0;i<tRows.length;i++){
          var tr=tRows[i];
          tr.style.height=row_height+'px';
        }
      }
      this.adjustFormHeight=function(cnt,h){ //controlla che la griglia sia stata completamente renderizata
        if(!this.floatRows)
          this.adjustRowsHeight();
        if(!this.showScrollBars){
          var tblcont = this.getTableHeight();
          var divcont = document.getElementById(this.ctrlid).style.display;
          if((Empty(h) && divcont!='none') || tblcont>h) {
            setTimeout(global_js_id+'.adjustFormHeight('+(Empty(cnt)?0:cnt+1)+','+tblcont+')',200)
          } else {
             if(ZtVWeb.IsMobile())
              this.form.queueAdjustHeight(200)
            else
              this.form.queueAdjustHeight(50)
          }
        }else{
          var divcont = document.getElementById(this.ctrlid);
          divcont.style.transition = "";
          var scroller =  document.getElementById("tbl"+this.ctrlid + "_scroller");
          //parte con la minHeight ma se ci sono bordi nel contenitore sono da rimuovere
          var container = document.getElementById('__tbl_'+this.ctrlid+'_container');
          //
          if(h!=null){
            divcont.style.height=h+'px';
            container.style.height=h+'px';
          }
          var h1 = divcont.offsetHeight;
          if(h1==0)return;
          divcont.style.height = "auto";
          var h2 = divcont.offsetHeight;
          var deltah = h2 - h1 ;
          divcont.style.height = h1 +"px";
          if(deltah<0)deltah=0;
          container.style.height = h1 - deltah +"px";
          if(scroller)
            scroller.style.height = h1 - deltah - this.TopToolsbarContainer().offsetHeight +"px";
          if(this.form.Steps.length>0)
            divcont.style.transition = "all 0.2s";
        }
      }
      this._refresh=function(){
        if(this.scroll_bars=='fixed-titles' || this.scroll_bars=='infinite_scroll')
          this.queueFixTitleTotal();
      }
      this.setCtrlStep=function(obj){
        this.adjustFormHeight(null,obj.h);
      }
      this.getRenderHeight=function(){
        var h=this.getTableHeight();
        if(this.layout_steps_values && this.layout_steps_values[this.form.Step])
            this.minheight=this.layout_steps_values[this.form.Step].h;
        if(this.shrinkable=='true' || h>this.minheight)
          this.Ctrl.style.height=h+'px';
        /* chiamata per aggiornare i titoli della griglia con fixTitle in caso il portlet venga richiamato */
        return ((this.shrinkable=='true' || h>this.minheight)?h:null);
      }
      this.contextMenu=function(e){
        if(name+'_onContextMenu' in this.form){
          this.form[name+'_onContextMenu'](e);
          e.returnValue=false
          return false
        }
      }
      function str_js(s,rounder){
        rounder=rounder||"'";
        return rounder+s+rounder;
      }
      var td_id_prefix=this.ctrlid
      function get_customFilter_root_id(){
        return td_id_prefix+'_customFilter';
      }
      function get_customFilter_remove_all_id(){
        return td_id_prefix+'_customFilter_remove_all';
      }

      //----------------------------------------FUNZIONI NUOVI TITOLI-------------------------------------------------------------------------------
      //Titoli delle colonne
      this.buildFirstTitlesColumns=function(src_array){//funzione x render colone iniziali (sx)
        if(this.hasRecMark){
          src_array.concat('<td'+
            ( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )+
            ' class="'+this.class_title+' grid_cell_title no-print" style="'+(title_color?'background-color:'+title_color+';':'')+(font_color?"color:"+font_color+';':"")+'width:10px;"'+'>');
          var grdRefreshTD = "";
          if (this.form[this.name+'_GridRefreshContent']) {
            grdRefreshTD = this.form[this.name+'_GridRefreshContent']();
          }
          if (grdRefreshTD) {
            src_array.concat(grdRefreshTD);
          } else {
            if(EmptyString(this.form.Zoomtitle)) {
              src_array.concat(
                LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "refresh"
                  , image : (SPTheme.grid_img_refresh?SPTheme.grid_img_refresh:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_refresh.png")
                  , image_attr : "no-repeat center center"
                  , events : 'onclick="'+global_js_id+'.Refresh()"'
                  , style : 'vertical-align:middle;border:0;cursor:pointer;'
                  , title : this.Translations["Refresh"]
                  , alt : "Refresh"
                })
              );
            }else{
              src_array.concat('&nbsp;');
            }
          }
          src_array.concat("</td>");
          this.colspan++;
        }
        if(!Empty(this.LinkValueUid)){
          src_array.concat('<td'+(this.linesCount>1?' rowspan='+this.linesCount:'')+' class="'+this.class_title+' grid_cell_title" style="'+(title_color?'background-color:'+title_color+";":"")+(font_color?"color:"+font_color+";":"")+'width:10px;">');
          src_array.concat('&nbsp;');
          src_array.concat("</td>");
          this.colspan++;
        }
        if(this.checkbox){
          src_array.concat('<td'+
                          ( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )+
                          ' class="'+this.class_title+' grid_cell_title no-print" align="center"'+
                          ' style="'+(title_color?'background-color:'+title_color+";":"")+(font_color?"color:"+font_color+';':'')+(! ZtVWeb.IsMobile() ? 'width:10px;':'')+'"'+
                          '>');
          if (this.checkboxAll){
            src_array.concat('<input type="checkbox" id="selectAll"  '+(this.selectAll=='selectAll'?'checked="checked"':"")
                            +' onclick="'+global_js_id+'.SetCheckBoxAll(this.checked);"'
                            +(this._CHG !='' ? (!(this.form[this._CHG].RowChecked()) ? 'disabled="disabled"' : "") : "")+'>');
          }else{
            src_array.concat('&nbsp;')
          }
          src_array.concat('</td>');
          this.colspan++;
        }
        if(this.renderSPLinker_column && this.splinker_pos.match(/left/)){
          this.newSplinkerCell(src_array);
        }
      }

      this.buildLastTitlesColumns=function(src_array){//funzione x render colone finali (dx)
        if(this.renderSPLinker_column && this.splinker_pos.match(/right/)){
          this.newSplinkerCell(src_array);
        }
        if(this.hasRowLayer){
          src_array.concat("<td"+( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )+' id="'+this.ctrlid+'_row_layer_column" class="'+this.class_title+' grid_cell_title" style="'+(title_color?'background-color:'+title_color+';':'')+(font_color?'color:'+font_color+';':"")+(! ZtVWeb.IsMobile() ? 'width:10px;':'')+'">');
          if(this.extensible=='false' || !this.existsExtensible){
            src_array.concat("&nbsp;");
          } else {
            if (SPTheme.grid_link_type=="button")
              src_array.concat('<input id="'+this.ctrlid+'_row_layer_expandreduce" class="button" onclick="'+this.form.formid+'.'+this.name+'.ExpandOReduce();" type="button" title="'+(this.IsExtended()? "Reduce Grid": "Extend Grid")+'" value="'+(this.IsExtended()? "&lt;": "&gt;")+'"></img>');
            else
              src_array.concat('<a id="'+this.ctrlid+'_row_layer_expandreduce" href="javascript:'+this.form.formid+'.'+this.name+'.ExpandOReduce();"><img src="'+this.GetExpandReduceImage(this.IsExtended()) +'"></img></a>');
          }
          src_array.concat("</td>");
          this.colspan++;
        }
      }

      this.buildFieldsTitlesColumns=function(src_array){//funzione x render colone dei campi
        var maxColsPerRow=0,rowcols=0;
        for(var i=0,col,firstLine=true; col=this.Cols[i]; i++){
          if((i in this.extFieldsIdx && this.reduced) ||col.hidden){
            continue;
          }
          if(col.new_line){
            maxColsPerRow = Math.max(maxColsPerRow, rowcols);
            rowcols = 1;
            if(firstLine){//colonne finali con rowspan se a capo
              this.buildLastTitlesColumns(src_array);
              firstLine=false;
            }
            src_array.concat('</tr><tr class="'+this.class_title+' grid_cell_title">');
          }else
            rowcols++;
          var th_id=this.ctrlid+'_cell_'+col.id;
          if(col.type =='M' && Empty(col.width)) col.width=(ZtVWeb.IsMobile()?'150px':'300px');
          src_array.concat('<td id="'+th_id+'" '+
            'class="'+(LibJavascript.Array.indexOf(this.Filters,col.field,function(e1,e2){return e1.field.toLowerCase()==e2.toLowerCase()})!=-1?"grid_cell_title_filter ":"")+this.class_title+' grid_cell_title" align="'+this.align+'" valign="'+this.valign+'" style="vertical-align:middle;'+
            ((!Empty(col.fixedwidth))?'width:'+col.fixedwidth+';':((!Empty(col.width)?'min-width:'+col.width+';':'')))+
            (title_color?'background-color:'+title_color+';':'')+(font_color?'color:'+font_color+';':"")+'"'+
            ( col.row_span>1 ? ' rowspan='+col.row_span : '' )+
            ( col.col_span>1 ? ' colspan='+col.col_span : '')+
            '>');
          this.BuildTitlesCellContent(src_array,col,i);
          src_array.concat("</td>");
        }
        this.colspan+=Math.max(maxColsPerRow, rowcols);
      }
      this.BuiltTitleImagesObj=function(){
        return{
              dn:(SPTheme.grid_img_orderby_desc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_dn.gif'),
              ord_menu_layer : (SPTheme.grid_ico_filter_by_example||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_orderby.png'),
              edn:(SPTheme.grid_img_orderby_desc_sel||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_edn.gif'),
              up:(SPTheme.grid_img_orderby_asc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_up.gif'),
              eup:(SPTheme.grid_img_orderby_asc_sel||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_eup.gif'),
              minus:(SPTheme.grid_img_ord_minus||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_minus.gif'),
              minus_hv:(SPTheme.grid_img_ord_minus_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_minus.gif'),
              plus:(SPTheme.grid_img_ord_plus||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_plus.gif'),
              opt_ord_asc:(SPTheme.grid_img_ord_plus||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_plus.gif'),
              opt_ord_asc_type:'plus',
              opt_ord_desc:(SPTheme.grid_img_ord_plus||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_plus.gif'),
              opt_ord_desc_type:'plus',
              opt_ord_asc_hv:(SPTheme.grid_img_ord_plus_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_plus.gif'),
              opt_ord_desc_hv:(SPTheme.grid_img_ord_plus_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_plus.gif'),
              img_ord_asc:(SPTheme.grid_img_orderby_asc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_up.gif'),
              img_ord_desc:(SPTheme.grid_img_orderby_desc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_dn.gif'),
              img_ord_hov_asc:(SPTheme.grid_img_orderby_hover_asc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_eup.gif'),
              img_ord_hov_desc:(SPTheme.grid_img_orderby_hover_desc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_edn.gif'),
              ico_ord_find : (SPTheme.grid_ico_orderby_find||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filter_by_example.png'),
              ico_ord_filters : (SPTheme.grid_img_filter_by_example_values||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filter_by_example.png'),
              ico_ord_asc:(SPTheme.grid_ico_orderby_asc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_up.png'),
              ico_ord_add_asc:(SPTheme.grid_ico_orderby_add_asc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_up_add.png'),
              ico_ord_desc:(SPTheme.grid_ico_orderby_desc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_down.png'),
              ico_ord_add_desc:(SPTheme.grid_ico_orderby_add_desc||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_down_add.png'),
              ico_ord_del:(SPTheme.grid_ico_orderby_del||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_delete.png'),
              img_ord_status: '',
              ico_hide_column : (SPTheme.grid_img_hide_column||ZtVWeb.SPWebRootURL+'/visualweb/images/remove_from_grid.png'), //ZtVWeb.SPWebRootURL+'/'+ZtVWeb.theme+'/images/zoom/remove_from_grid.png'
              ico_filters_del : (SPTheme.grid_img_filter_by_example_delete||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_by_example_delete.png")
              };

      }
      this.BuildTitlesCellContent=function(src_array,col,i){
        if(!Empty(col.title)) col.title=ZtVWeb.fmtPctFldPct(col.title,0,null,null,this.form,false,false); //formatta i %titolo%
        var th_id=this.ctrlid+'_cell_'+col.id;
        if(this.draggablecolumns){
          src_array.concat('<table cellspacing="0" cellpadding="0" border="0" style="width:100%"><tr><td id="'+th_id+'_swap_left" valign="middle" class="grid_cell_title_swap_left" style="width:1px;">&nbsp;</td><td>');
        }
        if(!this.isorderby) col.orderbyfld=''; //se si imposta che non si puo' ordinare bisogna eliminare l'orderbyfield
        var filterIdx=-1;
        for(var j=0;j<this.Filters.length && filterIdx==-1;j++){
          if (this.Filters[j].field.toLowerCase()==col.field.toLowerCase() && !this.Filters[j].fixed && this.Filters[j].visible) {
            filterIdx=j;
            break;
          }
        }
        var activeTitle=(!Empty(col.orderbyfld) || ((this.show_filters.indexOf('true')>-1 || filterIdx>-1) && !isExpr(col.field)));
        var asc_ord_ctrl='',
            desc_ord_ctrl='',
            ord_menu='',
            title='';
        if(activeTitle){
          col.orderbyImgObj=this.BuiltTitleImagesObj();
              var up_arr_visibility=false,
              dn_arr_visibility=false;
          if(!Empty(col.orderbystatus)){
            var num,
                num_hv,
                num_mob=col.orderbyidx;
            switch(col.orderbyidx){
              case 1:
                num=SPTheme.grid_img_ord_one||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_one.gif';
                num_hv=SPTheme.grid_img_ord_one_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_one.gif';
                break;
              case 2:
                num=SPTheme.grid_img_ord_two||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_two.gif';
                num_hv=SPTheme.grid_img_ord_two_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_two.gif';
                break;
              case 3:
                num=SPTheme.grid_img_ord_three||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_three.gif';
                num_hv=SPTheme.grid_img_ord_three_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_three.gif';
                break;
              case 4:
                num=SPTheme.grid_img_ord_four||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_four.gif';
                num_hv=SPTheme.grid_img_ord_four_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_four.gif';
                break;
              case 5:
                num=SPTheme.grid_img_ord_five||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_five.gif';
                num_hv=SPTheme.grid_img_ord_five_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_five.gif';
                break;
              default:
                num_mob='';
                num=num_hv='';
            }
            if(col.orderbystatus=='desc'){
              col.orderbyImgObj.img_ord_desc=col.orderbyImgObj.edn;
              col.orderbyImgObj.opt_ord_asc=num;
              col.orderbyImgObj.opt_ord_asc_type='idx';
              col.orderbyImgObj.opt_ord_asc_hv=num_hv;
              col.orderbyImgObj.opt_ord_desc=col.orderbyImgObj.minus;
              col.orderbyImgObj.opt_ord_desc_type='minus';
              col.orderbyImgObj.opt_ord_desc_hv=col.orderbyImgObj.minus_hv;
              up_arr_visibility=true;
              col.orderbyImgObj.img_ord_status=col.orderbyImgObj.edn;
            }else{
              col.orderbyImgObj.img_ord_asc=col.orderbyImgObj.eup;
              col.orderbyImgObj.opt_ord_asc=col.orderbyImgObj.minus;
              col.orderbyImgObj.opt_ord_asc_type='minus';
              col.orderbyImgObj.opt_ord_asc_hv=col.orderbyImgObj.minus_hv;
              col.orderbyImgObj.opt_ord_desc=num;
              col.orderbyImgObj.opt_ord_desc_type='idx';
              col.orderbyImgObj.opt_ord_desc_hv=num_hv;
              dn_arr_visibility=true;
              col.orderbyImgObj.img_ord_status=col.orderbyImgObj.eup;
            }
          }
          /* gestione dell'ordinamento delle colonne con dispositivi mobile touch */
          if(col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv || col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv || ZtVWeb.IsMobile()){
            /*immagini per visualizzare lo stato di ordinamento*/
            /*Titolo con controllo per l'ordinamento*/
            ord_menu += '<td valign="middle" style="padding:0px;vertical-align:middle;'+
              (!SPTheme.orderby_menu_button_position || SPTheme.orderby_menu_button_position == 'left' ? 'width:1px;' : '')+
              '" border="0" cellspacing="0" cellpadding="0" class="no-print">'+
              LibJavascript.DOM.buildIcon({ type : 'div'
                            , className : "grid_orderby_ico menu "+(col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv ? "asc" : ( col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv ? "desc" : ""))
                            , style : ""
                            , text : (col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv || col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv ? ("<div class=\"grid_orderby_ico text\">"+num_mob+"</div>") : '' )
                            , image : !Empty(col.orderbyImgObj.img_ord_status) ? col.orderbyImgObj.img_ord_status : col.orderbyImgObj.ord_menu_layer
                            , events : 'onclick="return '+global_js_id+'.toggleOrderbyList(event,\''+th_id+'\',\''+col.id+'\',\''+num_mob+'\','+(filterIdx>-1)+',\''+Strtran(col.field,'\'','\\\'')+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                            , image_attr : "no-repeat center top"
                            }) +
              '</td>';
          }

        }
        if(activeTitle)
          title +='<td align="'+this.align+'" valign="'+this.valign+'" id="'+th_id+'_title_cell" '
        if(activeTitle)
          title+=( ZtVWeb.IsMobile()
            ? 'onclick="window.'+global_js_id+'.Search(\''+col.id+'\',\''+th_id+'\');" '
            : 'onclick="return '+global_js_id+'.toggleOrderbyList(event,\''+th_id+'\',\''+col.id+'\',\''+num_mob+'\','+(filterIdx>-1)+',\''+Strtran(col.field,'\'','\\\'')+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();" '
            )
        if(activeTitle){
          title+=(!Empty(col.title_tooltip)?" title=\""+col.title_tooltip+"\" ":"")+
            'style="vertical-align:middle;'+
            (activeTitle?'cursor:pointer;':'')+
            (title_color?'background-color:'+title_color+';':'')+
            (font_color?'color:'+font_color+';':"")+
            (font?'font-family:'+font+';':"")+
            (font_size?'font-size:'+font_size:"")+'"'+
            (!Empty(col.title_tooltip)?" title=\""+col.title_tooltip+"\" ":"")+'>'+
            //aggiunto onclick="void(0)" per evitare di far partire il drag and drop con il codice scritto in zdnd_commons
            ( filterIdx>-1 ? '<div class="grid_title_filtered" onclick="void(0)">'+col.title+'</div><div id="'+th_id+'_title_value" onclick="void(0)">' + (this.Filters[filterIdx].operator=="empty" ? "("+ZtVWeb.GridTranslations["Empty"]+")" : this.Filters[filterIdx].expression) +'</div>': col.title) +
          '</td>';
        }
        src_array.concat('<table cellspacing="0" cellpadding="0" border="0" class="grid_cell_title_table" style="'+
//          (!Empty(col.orderbyfld) ? ' onmouseout="'+global_js_id+'.ManageColTitleHover(this,'+i+',event); this.style.cursor=\'\';"' : '')+
          // (!SPTheme.orderby_menu_button_position || SPTheme.orderby_menu_button_position == 'left' ? 'width:100%;' : '')+
          (col.title_align=='right' ? 'margin-left:auto;' : ( col.title_align=='center' ? 'margin-left:auto;margin-right:auto;': '') ) +
          '"><tr>');
        /* orderby_menu_button_position e' una variabile definita da skin che imposta la posizione del bottone di
         * apertura del menu di ordinamento nella riga di titolo della colonna
        */
        if( SPTheme.orderby_menu_button_position && SPTheme.orderby_menu_button_position == 'right' ) {
          src_array.concat( title );
          src_array.concat( ord_menu );
        } else {
          src_array.concat( ord_menu );
          src_array.concat( title );
        }

        if(!activeTitle){ // Il titolo semplice
          var title_click='';
          title_click+='onclick="return '+global_js_id+".columnClick(\'"+col.id+"\','title',"+global_js_id+'.datasource,event);" ';
          src_array.concat( !Empty(col.orderbyfld) ?'':('<td align="'+this.align+'" valign="'+this.valign+'" id="'+th_id+'_title_cell" '+(!Empty(col.title_tooltip)?" title=\""+col.title_tooltip+"\" ":"")+
            (!Empty(col.orderbyfld) ? 'onmouseover="LibJavascript.CssClassNameUtils.addClass(this,\'grid_titlehover\');" onmouseout="LibJavascript.CssClassNameUtils.removeClass(this,\'grid_titlehover\');" ' : '')+
            title_click+' style="vertical-align:middle;'+(title_color?'background-color:'+title_color+';':'')+(font_color?'color:'+font_color+';':"")+(font?'font-family:'+font+';':"")+(font_size?'font-size:'+font_size:"")+'">'+col.title+'</td>'));
        }

        if (filterIdx>-1 && !ZtVWeb.IsMobile()){
          src_array.concat('<td width="26px"><div>'+
                  '<a href="javascript:'+global_js_id+'.RemoveFiltersField(\''+col.field+'\');">'+
                  LibJavascript.DOM.buildIcon({type : 'span'
                    , className : "rem_filter"
                    , image : (SPTheme.grid_img_filter_by_example_delete?SPTheme.grid_img_filter_by_example_delete:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_by_example_delete.png")
                    , image_attr : "no-repeat center center"
                    , style : 'vertical-align:middle;border:0;'
                    , title : this.Translations["Remove_Filters"]
                    , alt : "Remove Filters"
                  })+
                  '</a>'+
                '</div></td>');
        }
        src_array.concat('</tr></table>');
        if(this.draggablecolumns){
          src_array.concat('</td><td id="'+th_id+'_swap_right" class="grid_cell_title_swap_right" style="width:1px;vertical-align:middle;">&nbsp;</td></tr></table>');
        }
      }

      //Titoli per le righe in modalita float
      this.buildFloatTitlesColumns=function(src_array){
        src_array.concat("<div id='"+this.ctrlid+"_titles_cont' class='grid_card_title_container'>");
        var grdRefreshTD = "";
        if (this.form[this.name+'_GridRefreshContent']) {
          grdRefreshTD = this.form[this.name+'_GridRefreshContent']();
        }
        if (grdRefreshTD) {
          src_array.concat(grdRefreshTD);
        }
        this.ExtraCols=[];
        for(var i=0;col=this.Cols[i]; i++){
          if(i in this.extFieldsIdx && this.reduced){
            continue;
          }
          if(Empty(col.title))
            continue;
          if(!this.isShowExtraTitles || col.show_extra_title) //Se non ci sono show_extra_title selezinati le faccio vedere tutti nel caso di floatingRows
            this.ExtraCols.push(col);

          for(var j=0;j<col.Layer.length;j++){
            if(!this.isShowExtraTitles || col.Layer[j].show_extra_title) //Se non ci sono show_extra_title selezinati le faccio vedere tutti nel caso di floatingRows
              this.ExtraCols.push(col.Layer[j]);
          }
        }
        for(var i=0;col=this._rowLayer[i]; i++){
          if(!this.isShowExtraTitles || col.show_extra_title) //Se non ci sono show_extra_title selezinati le faccio vedere tutti nel caso di floatingRows
            this.ExtraCols.push(col);
        }
        //Ordino per indice
        this.ExtraCols.sort(function(c1,c2){//ordino l'array temp in base all'idx
          var res=c1.extracolidx-c2.extracolidx;
          return res;
        });
        //Ciclo finale per il render della secondary bar
        for(var i=0;col=this.ExtraCols[i]; i++){
          if(!isExpr(col.field) || !Empty(col.orderbyfld))
            buildFloatCellTitle(col,src_array,this);
        }
       //Cicla tutti i campi anche i layer
       /*
        for(var i=0;col=this.Cols[i]; i++){
          if(i in this.extFieldsIdx && this.reduced){
            continue;
          }
          if(Empty(col.title))
            continue;
          if(!this.isShowExtraTitles || col.show_extra_title) //Se non ci sono show_extra_title selezinati le faccio vedere tutti nel caso di floatingRows
            buildFloatCellTitle(col,src_array,this);
          for(var j=0;j<col.Layer.length;j++){
            if(!this.isShowExtraTitles || col.Layer[j].show_extra_title) //Se non ci sono show_extra_title selezinati le faccio vedere tutti nel caso di floatingRows
              buildFloatCellTitle(col.Layer[j],src_array,this);
          }
        }
        for(var i=0;col=this._rowLayer[i]; i++){
          if(!this.isShowExtraTitles || col.show_extra_title) //Se non ci sono show_extra_title selezinati le faccio vedere tutti nel caso di floatingRows
            buildFloatCellTitle(col,src_array,this);
        }
        */
        // for(var i=0;i<this.Cols.length; i++){
           // if(i in this.extFieldsIdx && this.reduced){
            // continue;
           // }
           // if(Empty(col.title) || isExpr(col.field))
            // continue;
          // var col=this.Cols[i];
          // buildFloatCellTitle(col,src_array)
        // }

        function buildFloatCellTitle(col,src_array,grid){
          if(!Empty(col.title)) col.title=ZtVWeb.fmtPctFldPct(col.title,0,null,null,grid.form,false,false); //formatta i %titolo%
          var th_id=grid.ctrlid+'_extra_'+col.id;
          if(col.type=='M' && !ZtVWeb.IsMobile()){
            col.orderbyfld='';
          }
          if(!grid.isorderby) col.orderbyfld=''; //se si imposta che non si puo' ordinare bisogna eliminare l'orderbyfield
           var filterIdx=-1;
          for(var j=0;j<grid.Filters.length && filterIdx==-1;j++){
            if (grid.Filters[j].field.toLowerCase()==col.field.toLowerCase() && !grid.Filters[j].fixed && grid.Filters[j].visible) {
              filterIdx=j;
              break;
            }
          }
          var activeTitle=(!Empty(col.orderbyfld) || ((grid.show_filters.indexOf('true')>-1 || filterIdx>-1) && !isExpr(col.field)));
          var asc_ord_ctrl='',
              desc_ord_ctrl='',
              ord_menu='';
              title=''
          if(activeTitle){
            col.orderbyImgObj=grid.BuiltTitleImagesObj();
                var up_arr_visibility=false,
                dn_arr_visibility=false;
            if(!Empty(col.orderbystatus)){
              var num,
                  num_hv,
                  num_mob=col.orderbyidx;
              switch(col.orderbyidx){
                case 1:
                  num=SPTheme.grid_img_ord_one||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_one.gif';
                  num_hv=SPTheme.grid_img_ord_one_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_one.gif';
                  break;
                case 2:
                  num=SPTheme.grid_img_ord_two||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_two.gif';
                  num_hv=SPTheme.grid_img_ord_two_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_two.gif';
                  break;
                case 3:
                  num=SPTheme.grid_img_ord_three||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_three.gif';
                  num_hv=SPTheme.grid_img_ord_three_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_three.gif';
                  break;
                case 4:
                  num=SPTheme.grid_img_ord_four||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_four.gif';
                  num_hv=SPTheme.grid_img_ord_four_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_four.gif';
                  break;
                case 5:
                  num=SPTheme.grid_img_ord_five||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_five.gif';
                  num_hv=SPTheme.grid_img_ord_five_hv||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_order_five.gif';
                  break;
                default:
                  num_mob='';
                  num=num_hv='';
              }
              if(col.orderbystatus=='desc'){
                col.orderbyImgObj.img_ord_desc=col.orderbyImgObj.edn;
                col.orderbyImgObj.opt_ord_asc=num;
                col.orderbyImgObj.opt_ord_asc_type='idx';
                col.orderbyImgObj.opt_ord_asc_hv=num_hv;
                col.orderbyImgObj.opt_ord_desc=col.orderbyImgObj.minus;
                col.orderbyImgObj.opt_ord_desc_type='minus';
                col.orderbyImgObj.opt_ord_desc_hv=col.orderbyImgObj.minus_hv;
                up_arr_visibility=true;
                col.orderbyImgObj.img_ord_status=col.orderbyImgObj.edn;
              }else{
                col.orderbyImgObj.img_ord_asc=col.orderbyImgObj.eup;
                col.orderbyImgObj.opt_ord_asc=col.orderbyImgObj.minus;
                col.orderbyImgObj.opt_ord_asc_type='minus';
                col.orderbyImgObj.opt_ord_asc_hv=col.orderbyImgObj.minus_hv;
                col.orderbyImgObj.opt_ord_desc=num;
                col.orderbyImgObj.opt_ord_desc_type='idx';
                col.orderbyImgObj.opt_ord_desc_hv=num_hv;
                dn_arr_visibility=true;
                col.orderbyImgObj.img_ord_status=col.orderbyImgObj.eup;
              }
            }
            /* gestione dell'ordinamento delle colonne con dispositivi mobile touch */
              /*immagini per visualizzare lo stato di ordinamento*/
              /*Titolo con controllo per l'ordinamento*/
            if(col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv || col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv || ZtVWeb.IsMobile()){
              ord_menu+='<td valign="middle" style="padding:0px;vertical-align:middle;" border="0" cellspacing="0" cellpadding="0" class="grid_cell_extra_title" class="no-print">'+
                LibJavascript.DOM.buildIcon({ type : 'div'
                              , className : "grid_orderby_ico menu "+(col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv ? "asc" : ( col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv ? "desc" : ""))
                              , style : ""
                              , text : (col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv || col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv ? ("<div class=\"grid_orderby_ico text\">"+num_mob+"</div>") : '' )
                              , image : !Empty(col.orderbyImgObj.img_ord_status) ? col.orderbyImgObj.img_ord_status : col.orderbyImgObj.ord_menu_layer
                              , events : 'onclick="return '+global_js_id+'.toggleOrderbyList(event,\''+th_id+'\',\''+col.id+'\',\''+num_mob+'\','+(filterIdx>-1)+',\''+Strtran(col.field,'\'','\\\'')+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                              , image_attr : "no-repeat center top"
                              }) +
                '</td>';
            }
            title +='<td align="'+grid.align+'" class="grid_cell_extra_title" valign="'+grid.valign+'" id="'+th_id+'_title_cell" '+
            ( ZtVWeb.IsMobile()
              ? 'onclick="window.'+global_js_id+'.Search(\''+col.id+'\',\''+th_id+'\');" '
              : 'onclick="return '+global_js_id+'.toggleOrderbyList(event,\''+th_id+'\',\''+col.id+'\',\''+num_mob+'\','+(filterIdx>-1)+',\''+Strtran(col.field,'\'','\\\'')+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();" '
            )+
            (!Empty(col.title_tooltip)?" title=\""+col.title_tooltip+"\" ":"")+
                // 'onclick="return '+global_js_id+'.toggleOrderbyList(\''+th_id+'_orderBy_list\',\''+i+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();" '+
                'style="vertical-align:middle;cursor:pointer;'+
                (title_color?'background-color:'+title_color+';':'')+
                (font_color?'color:'+font_color+';':"")+
                (font?'font-family:'+font+';':"")+
                (font_size?'font-size:'+font_size:"")+'">'+
                //aggiunto onclick="void(0)" per evitare di far partire il drag and drop con il codice scritto in zdnd_commons
                ( filterIdx>-1 ? '<div class="grid_title_filtered" onclick="void(0)">'+col.title+'</div><div id="'+th_id+'_title_value" onclick="void(0)">' + (grid.Filters[filterIdx].operator=="empty" ? "("+ZtVWeb.GridTranslations["Empty"]+")" : grid.Filters[filterIdx].expression) +'</div>': col.title) +
              '</td>';
          }
          src_array.concat('<div id="'+grid.ctrlid+'_extra_'+col.id+'" style="display:inline-block" class="'+(LibJavascript.Array.indexOf(grid.Filters,col.field,function(e1,e2){return e1.field.toLowerCase()==e2.toLowerCase()})!=-1?"grid_cell_title_filter ":"")+grid.class_title+'"><table class="grid_cell_title_table" cellspacing="0" cellpadding="0" border="0"'+
            // /*(!Empty(col.orderbyfld) ? */ ( ZtVWeb.IsMobile() ? '' : ' onmouseover="'+global_js_id+'.ManageColTitleHover(this,'+i+',event); this.style.cursor=\''+(!Empty(col.orderbyfld)?'pointer':'default')+'\';" onmouseout="'+global_js_id+'.ManageColTitleHover(this,'+i+',event);'+' this.style.cursor=\'\';"') /*: '')*/+
  //          (!Empty(col.orderbyfld) ? ' onmouseout="'+global_js_id+'.ManageColTitleHover(this,'+i+',event); this.style.cursor=\'\';"' : '')+
            ' style="width:100%"><tr>');
          // src_array.concat( ZtVWeb.IsMobile() ? ord_ctrl : (asc_ord_ctrl+desc_ord_ctrl));
          /* orderby_menu_button_position e' una variabile definita da skin che imposta la posizione del bottone di
           * apertura del menu di ordinamento nella riga di titolo della colonna
          */
          if( SPTheme.orderby_menu_button_position && SPTheme.orderby_menu_button_position == 'right' ) {
            src_array.concat( title );
            src_array.concat( ord_menu );
          } else {
            src_array.concat( ord_menu );
            src_array.concat( title );
          }
          if(!activeTitle){ // Il titolo semplice
            var title_click='';
            title_click+='onclick="return '+global_js_id+".columnClick(\'"+col.id+"\','title',"+global_js_id+'.datasource,event);" ';
            src_array.concat( !Empty(col.orderbyfld) ?'':('<td align="'+grid.align+'" valign="'+grid.valign+'" id="'+th_id+'_title_cell" class="grid_cell_extra_title" '+(!Empty(col.title_tooltip)?"title=\""+col.title_tooltip+"\" ":"")+
              (!Empty(col.orderbyfld) ? 'onmouseover="LibJavascript.CssClassNameUtils.addClass(grid,\'grid_titlehover\');" onmouseout="LibJavascript.CssClassNameUtils.removeClass(grid,\'grid_titlehover\');" ' : '')+
              title_click+' style="vertical-align:middle;'+(title_color?'background-color:'+title_color+';':'')+(font_color?'color:'+font_color+';':"")+(font?'font-family:'+font+';':"")+(font_size?'font-size:'+font_size:"")+'">'+col.title+'</td>'));
          }
          if (filterIdx>-1 && !ZtVWeb.IsMobile()){
            src_array.concat('<td width="26px" class="grid_cell_extra_title"><div>'+
                    '<a href="javascript:'+global_js_id+'.RemoveFiltersField(\''+col.field+'\');">'+
                    LibJavascript.DOM.buildIcon({type : 'span'
                      , className : "rem_filter"
                      , image : (SPTheme.grid_img_filter_by_example_delete?SPTheme.grid_img_filter_by_example_delete:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_by_example_delete.png")
                      , image_attr : "no-repeat center center"
                      , style : 'vertical-align:middle;border:0;'
                      , title : grid.Translations["Remove_Filters"]
                      , alt : "Remove Filters"
                    })+
                    '</a>'+
                  '</div></td>');
          }
          src_array.concat('</tr></table></div>');

        }
        src_array.concat("</div>");
      }

      this.newSplinkerCell=function(src_array){
        src_array.concat('<td width="1px"'
          +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
          +' class="'+this.class_title+' grid_cell_title no-print" style="'+(title_color?'background-color:'+title_color+";":"")+(font_color?"color:"+font_color+';':"")+'"'
          //+(! ZtVWeb.IsMobile() ? 'width:'+cellSizes.width+'px;':'')+'"'
          +'nowrap >');
        if((!this.form[this.name+'_GridRenderNewSplinker'] || this.form[this.name+'_GridRenderNewSplinker']() )){
          var spl_html_new_link="&nbsp;";
          var spl_new_link = !EmptyString(this.parent_splinker) ? "window."+this.form.formid+"."+this.parent_splinker+".Link();" : "window."+this.form.formid+"."+this.splinker+".Link(null,null,null,'"+(this.SPLinkerActions.N.action||'new')+"');";
          if (SPTheme.grid_link_type=="button"){
            spl_html_new_link = this.SPLinkerActions.N.valueOf() ? '<input type="button" class="button buttonMask" value="' + this.Translations["New"] +'" onclick="javascript:'+spl_new_link+'" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();">' : "&nbsp;";
          } else {
            if(ZtVWeb.IsMobile()){
              spl_html_new_link = this.SPLinkerActions.N.valueOf() ?
              LibJavascript.DOM.buildIcon({type : 'img'
                , className : "mobileIco add"
                , image : (SPTheme.grid_img_action_new?SPTheme.grid_img_action_new:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_new.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , events : 'onclick="'+spl_new_link+'"'
                , title : this.Translations["New"]
                , alt : "New"
              }) : "&nbsp;";
            }else{
              spl_html_new_link = this.SPLinkerActions.N.valueOf() ?
              LibJavascript.DOM.buildIcon({type : 'img'
                , className : "add"
                , image : (SPTheme.grid_img_action_new?SPTheme.grid_img_action_new:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_new.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;cursor:pointer;'
                , events : 'onclick="'+spl_new_link+'"'
                , title : this.Translations["New"]
                , alt : "New"
              }) : "&nbsp;";
            }
          }
          src_array.concat(spl_html_new_link);
          if(this.autozoom!='')
            if (SPTheme.grid_link_type=="button"){
              src_array.concat('<input type="button" class="button buttonMask" value="<-" alt="'+(this.Translations["Query"]||"Query")+'" title="'+(this.Translations["Query"]||"Query")+'" onclick="window.location=\'../servlet/'+this.autozoom+'\'"');
            } else {
              if(ZtVWeb.IsMobile()){
                src_array.concat('<a style= "margin:0 3px;display:block;width:40px;height:40px;background: transparent url("'+(SPTheme.grid_img_action_query?SPTheme.grid_img_action_query:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_query.png")+') no-repeat center center;" href="javascript:window.location=\'../servlet/'+this.autozoom+'\'" alt="'+(this.Translations["Query"]||"Query")+'" title="'+(this.Translations["Query"]||"Query")+'";></a>');
              }else{
                src_array.concat('<a style="padding:0 3px 0 3px;display:inline;" href="javascript:window.location=\'../servlet/'+this.autozoom+'\'"><img src="'+(SPTheme.grid_img_action_query||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_query.png")+'" border="0" alt="'+(this.Translations["Query"]||"Query")+'" title="'+(this.Translations["Query"]||"Query")+'"></a>');
              }
            }
        }else {
          var grdnewSplinkerTD = "";
          if (this.form[this.name+'_GridNewSplinkerContent']) {
            grdnewSplinkerTD = this.form[this.name+'_GridNewSplinkerContent']();
          }
          if (grdnewSplinkerTD) {
            src_array.concat(grdnewSplinkerTD);
          } else {
            if (ZtVWeb.IsMobile()) {
              // riproduco lo spazio sottostante dell'splinker
              src_array.concat('<div style= "margin:0 0 0 3px; width:40px;height:40px;display:block;background:transparent;"></div>');
            } else {
              src_array.concat('&nbsp;');
            }
          }
        }
        src_array.concat('</td>');
        this.colspan++;
      }

      this.setColType=function(col){
        var t,field;
        field=clearField(col.field);
        if(this.datasource && (t=this.datasource.getType(field))!=null)
          col.type=t;
        else
          col.type=ZtVWeb.getTypeFromPict(col.picture);
        if(col.type=="D" && (EmptyString(col.picture)||col.picture==null)) col.picture=ZtVWeb.defaultDatePict;
        if(col.type=="T" && (EmptyString(col.picture)||col.picture==null)) col.picture=ZtVWeb.defaultDateTimePict;
      }

      this.hasRec=function(recIdx){
        return recIdx<this.datasource.getRecCount();
      }

      this.isDisabled=function(recIdx,cond){
        if(this._PPK && !this.form[this._CHG].RowChecked()){
          return true;
        }
        if(this.disabled_fld!=null){
          if (this.datasource.getValue(recIdx,this.disabled_fld)==1)
            return true;
        }
        if(this.homogeneity_filter!=null){
          for(var i=0; i<this.homogeneity_fields.length; i++){
            var fld=this.homogeneity_fields[i]
            if(!Eq(this.datasource.getValue(recIdx,fld),this.homogeneity_filter[fld.toLowerCase()])){
              return true;
            }
          }
        }
        if(cond)
          return ZtVWeb.makeStdCell(cond,recIdx,this.datasource,null,this.form,null,null);
        return false;
      }

      var eventsContainer={};

      function storeEvent(elementId, evtType, strFunction){
        if(EmptyString(strFunction)){
          return;
        }
        var el;
        if(!(el=eventsContainer[elementId])){
          eventsContainer[elementId]=el={};
        }
        el[evtType]=strFunction;
      }

      this.attachEvents = function (){
        var domElement,
            objEvents,
            Ctrl=LibJavascript.DOM.Ctrl;
        for(var id in eventsContainer){
          domElement=Ctrl(id);
          objEvents=eventsContainer[id];
          for(var evtName in objEvents){
            domElement[evtName]=new Function('evt',objEvents[evtName]);
          }
        }
        eventsContainer={};
      }
      this.buildFirstRowsCells=function(src_array,i,recIdx,hasRec,memCursPos){//funzione x render colonne iniziali (sx)
        if(this.hasRecMark){
          if(this.sum_colspan){
            this.colspan++;
          }
          src_array.concat('<td'+( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )+
            //(this.draggable_row=='true'?" draggable='true' ":"")+
            ' class="grid_cell no-print" id="'+this.ctrlid+'_rek'+i+'" a>' +
            ((hasRec && recIdx+1==this.curRec) ?
              LibJavascript.DOM.buildIcon({ type : 'img'
                , className : "grid_img_recMark_sel"
                , image : (SPTheme.grid_img_recMark_sel?SPTheme.grid_img_recMark_sel:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_recMark.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
              }) : (SPTheme.grid_img_recMark?  //Riga non selezionata
                LibJavascript.DOM.buildIcon({ type : 'img'
                  , className : "grid_img_recMark"
                  , image : (SPTheme.grid_img_recMark?SPTheme.grid_img_recMark:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_recMark.png")
                  , image_attr : "no-repeat center center"
                  , style : 'vertical-align:middle;border:0;'
                }):
                  ''
              )
            )
          );
          src_array.concat("</td>");
        }
        if(!Empty(this.LinkValueUid)){
          if(this.sum_colspan){
            this.colspan++;
          }
          src_array.concat('<td'+(this.linesCount>1 ? ' rowspan='+this.linesCount : '')+' class="grid_cell grid_report_link" id="'+this.ctrlid+'_report'+i+'">');
          if(hasRec){
            var aAttr = 'id="'+this.ctrlid+'_link_'+i+'" href="javascript:void(0);" onclick="ZtVWeb.DoLinkZoom(\''+this.LinkValueUid+'\',';
            if(this.LinkFillEmptyKey){
              aAttr+=('[');
              var linkFields=this.LinkPKFields.split(',');
              for(var j=0;j<linkFields.length;j++){
                if(j>0) aAttr+=(',');
                aAttr+=('\'');
                switch(this.datasource.getType(linkFields[j])){
                  case 'D':
                    aAttr+=(FormatDate(this.datasource.getValue(recIdx,linkFields[j])));
                    break;
                  case 'T':
                    aAttr+=(FormatDateTime(this.datasource.getValue(recIdx,linkFields[j])));
                    break;
                  case 'C':
                    aAttr+=(Strtran(Strtran(this.datasource.getValue(recIdx,linkFields[j]),"'","'+String.fromCharCode(39)+'"),'"','&#34'));
                    break;
                  case 'N':
                    aAttr+=(Strtran(this.datasource.getValue(recIdx,linkFields[j]).toString(),".",decSep));
                    break;
                  default:
                    aAttr+=(this.datasource.getValue(recIdx,linkFields[j]));
                    break;
                }
                aAttr+=('\'');
              }
              aAttr+=(']');
            }
            else {
              aAttr+=('\'');
              switch(this.datasource.getType(this.LinkValueField)){
                case 'D':
                  aAttr+=(FormatDate(this.datasource.getValue(recIdx,this.LinkValueField)));
                  break;
                case 'T':
                  aAttr+=(FormatDateTime(this.datasource.getValue(recIdx,this.LinkValueField)));
                  break;
                case 'C':
                  aAttr+=(Strtran(Strtran(this.datasource.getValue(recIdx,this.LinkValueField),"'","'+String.fromCharCode(39)+'"),'"','&#34'));
                  break;
                case 'N':
                  aAttr+=(Strtran(this.datasource.getValue(recIdx,this.LinkValueField).toString(),".",decSep));
                  break;
                default:
                  aAttr+=(this.datasource.getValue(recIdx,this.LinkValueField));
                  break;
              }
              aAttr+=('\'');
            }
            aAttr+=((this.form.OpenerFormId?',\''+this.form.OpenerFormId.Value()+'\'':'')+')"');
            var imageAttr = 'title="Select" border="0"';
            src_array.concat(LibJavascript.DOM.GenerateIcon((SPTheme.grid_img_action_select||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_report_link.png'), '', '', aAttr, imageAttr));
          }
          else
            src_array.concat("&nbsp;");
          src_array.concat("</td>");
        }
        if(this.checkbox){
          if(this.sum_colspan){
            this.colspan++;
          }
          this.checkboxCell(src_array,i,recIdx,hasRec,memCursPos);
        }
        if(this.renderSPLinker_column && this.splinker_pos.match(/left/)){
          if(this.sum_colspan){
            this.colspan++;
          }
          this.splinkerCell(src_array,hasRec,i,recIdx);
        }
      }

      this.buildFirstTotalsCells=function(src_array,i,title){
        if(this.hasRecMark){
          src_array.concat('<td'+( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )+
            ' class="'+(title?'grid_cell_title title_totalizer no-print':'grid_cell grid_totalizer no-print')+'" id="'+this.ctrlid+'_rekTotals'+i+'" >');
          src_array.concat("&nbsp;");
          src_array.concat("</td>");
        }
        if(this.checkbox){
          src_array.concat('<td '
                          +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
                          +' class="'+(title?'grid_cell_title title_totalizer no-print':'grid_cell grid_totalizer no-print')+'"'
                          +' id="'+this.ctrlid+'_checkbox'+i+'"'
                          +' valign="middle"'
                          +' >&nbsp;</td>');

        }
        if(this.renderSPLinker_column && this.splinker_pos.match(/left/)){
          src_array.concat('<td'
          +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
          +' class="'+(title?'grid_cell_title title_totalizer no-print':'grid_cell grid_totalizer no-print')+'" '
          +'>&nbsp;</td>');
        }
      }

      this.turnonRow=function(rowId){
        var addClass=LibJavascript.CssClassNameUtils.addClass,
        Ctrl=LibJavascript.DOM.Ctrl;
        addClass(Ctrl(rowId),this.class_row_over);
        for(var i=1,tr,tr_id_sub=rowId+'_sub_'; tr=Ctrl(tr_id_sub+i); i++){
          addClass(tr, this.class_row_over);
        }
      }
      this.turnoffRow=function(rowId){
        var removeClass=LibJavascript.CssClassNameUtils.removeClass,
        Ctrl=LibJavascript.DOM.Ctrl;
        removeClass(Ctrl(rowId), this.class_row_over);
        for(var i=1,tr,tr_id_sub=rowId+'_sub_'; tr=Ctrl(tr_id_sub+i); i++){
          removeClass(tr, this.class_row_over);
        }
      }

      this.buildLastRowsCells=function(src_array,i,recIdx,hasRec){//funzione x render colone finali (dx)
        if(this.renderSPLinker_column && this.splinker_pos.match(/right/)){
          if(this.sum_colspan){
            this.colspan++;
          }
          this.splinkerCell(src_array,hasRec,i,recIdx);
        }
        if(this.renderRowLayer()){
          if(this.sum_colspan){
            this.colspan++;
          }
          this.rowlayerCell(src_array,i,recIdx,hasRec);
        }
      }

      this.buildLastTotalsCells=function(src_array,i,title){
        if(this.renderSPLinker_column && this.splinker_pos.match(/right/)){
          src_array.concat('<td'
            +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
            +' class="'+(title?'grid_cell_title title_totalizer no-print':'grid_cell grid_totalizer no-print')+'" style="width:10px;"'
            +'>&nbsp;</td>');
        }
        if(this.renderRowLayer()){
          this.rowlayerTotalCell(src_array,i,title);
        }
      }

      this.IsVisibleRow=function(recIdx) {

        var rowsToView=[];
        var col, isVisible=false;
        for (var i=0; i<this.Cols.length; i++) {
          col = this.Cols[i];
          if (col.new_line) {
            rowsToView.push(isVisible);
            isVisible=false;
          }
          if (!isVisible) {
            var txt = this.datasource.getValue(recIdx,this.Cols[i].field);
            if(this.group_repeated=='true')
              if(this.prev_row_flds.length>0 && this.prev_row_flds[i]==txt){
                txt='';
              }
            isVisible = !Empty(txt);
          }
        }
        rowsToView.push(isVisible);
        return rowsToView;
      }

      this.buildFieldsRowsCells=function(src_array,row,recIdx,hasRec,memCursPos){//funzione x render colone dei campi
        // ricaviamo la posizione di questa riga nel cursore dei valori dei campi editati
        var maxColsPerRow=0,
            rowcols=0, currentLineView=true,firstLineClosed=false;
        for(var ii=0,col,currentLine=0; col=this.Cols[ii]; ii++){
          currentLineView=(this.hide_empty_lines=='true'?this.rowsToView[currentLine]:true);
          if(col.hidden)
            continue;
          if (!currentLineView) {
            if (col.new_line)
              currentLine++;
            else
              continue;
          }
          if(ii in this.extFieldsIdx && this.reduced){
              continue;
            }
          if(col.new_line){
            if(this.sum_colspan){
              maxColsPerRow = Math.max(maxColsPerRow, rowcols);
              rowcols = 1;
            }
            if(!firstLineClosed && currentLineView){//colonne finali con rowspan se a capo
              this.buildLastRowsCells(src_array,row,recIdx,hasRec);
              currentLine++;
              firstLineClosed=true
            }
            if (currentLineView) {
              src_array.concat("</tr>");
              firstLineClosed=true;
              }
            if (firstLineClosed)
            this.buildOpenFieldsRow(src_array,row,recIdx,hasRec,true)
          }else if(this.sum_colspan){
            rowcols++;
          }
          this.buildFieldCell(src_array,row,recIdx,ii,col,hasRec,memCursPos);
        }
        if(this.sum_colspan){
          this.colspan+=Math.max(maxColsPerRow, rowcols);
        }
      }
      this.buildFieldsTotalsCells=function(src_array,row,title){//funzione x render colonne dei totali
        // ricaviamo la posizione di questa riga nel cursore dei valori dei campi editati
        for(var ii=0,col,firstLine=true; col=this.Cols[ii]; ii++){
          if((ii in this.extFieldsIdx && this.reduced) || col.hidden){
              continue;
            }
          if(col.new_line){
            if(firstLine){//colonne finali con rowspan se a capo
              this.buildLastTotalsCells(src_array,row,title);
              firstLine=false;
            }
            src_array.concat("</tr>");
            this.buildOpenTotalsRow(src_array,row,title)
          }
          if (this.Totals[row][col.field])
            this.buildTotalCell(src_array,row,ii,col,true,title);
          else
            this.buildTotalCell(src_array,row,ii,col,false,title);
        }
      }
      this.buildOpenFieldsRow=function(src_array,i,recIdx,hasRec,newLine){
        if(newLine){
          this.buildOpenFieldsRow.subCounter++;
        }else{
          this.buildOpenFieldsRow.subCounter=0;
        }
        var class_row_str= this['class_row'+( ((i%2) == 0 && !EmptyString(this.class_row_odd)) ? '_odd' : '' )]+
                            (recIdx+1==this.curRec ? ' '+this.class_row_selected : ''),
            row_color = this['row_color'+( ((i%2) == 0 && !EmptyString(this.row_color_odd)) ? '_odd' : '' )],
            row_mousedown= hasRec ? global_js_id+'.SetCurRec('+(recIdx+1)+',true);' : '',
            rowId=this.ctrlid+"_row"+i,
            over_str="",
            out_str="";
          if(this.filterByExample){
            over_str+=global_js_id+'.LookUpFieldsCells(this);';
          }
          if(!EmptyString(this.class_row_over)){
            over_str+=global_js_id+'.turnonRow("'+rowId+'");';
            out_str=global_js_id+'.turnoffRow("'+rowId+'");';
          }
        if(this.buildOpenFieldsRow.subCounter>0){
          rowId+='_sub_'+this.buildOpenFieldsRow.subCounter;
        }
        storeEvent(rowId, 'onmousedown', row_mousedown); //memorizza l'evento di mousedown x la selezione della riga
        storeEvent(rowId, 'onmouseover', over_str); //memorizza l'evento di mouseover x evidenziare la riga
        storeEvent(rowId, 'onmouseleave', out_str); //memorizza l'evento di mouseout x "spegnere" la riga
        if(this.floatRows && !newLine)
          src_array.concat('<div style="'+(i==0?"clear:left;":"")+'float:left;" class="grid_card_container'+(!Empty(this.css_class_card_container)?' '+this.css_class_card_container:'')+'"><table border="0" cellspacing="0" cellpadding="0" style="width:100%"><tr '
                            +(hasRec || (i==0)? 'lookupcells="1"' : '')
                            +' id="'+rowId+'"'
                            +(this.draggable_row=='true'?" draggable='true' ":"")
                            +' class="'+class_row_str+'" '
                            +' style="'+(font?'font-family:'+font+';':'')+(font_size?'font-size:'+font_size+';':"")+(row_color?'background-color: '+row_color+';':'')+'"'
                            +' onContextmenu="return '+this.form.formid+'.'+this.name+'.contextMenu(event);">');

        else
          src_array.concat('<tr '
                            +(hasRec || (i==0)? 'lookupcells="1"' : '')
                            +' id="'+rowId+'"'
                            +(this.draggable_row=='true'?" draggable='true' ":"")
                            +' class="'+class_row_str+'" '
                            +' style="'+(font?'font-family:'+font+';':'')+(font_size?'font-size:'+font_size+';':"")+(row_color?'background-color: '+row_color+';':'')+'"' //+'height:'+this.row_height+'px;"'
                            +'  onContextmenu="return '+this.form.formid+'.'+this.name+'.contextMenu(event);">');
      }

      this.buildOpenTotalsRow=function(src_array,i,newLine,title){
        this.buildOpenFieldsRow.subCounter=0;
        var rowId=this.ctrlid+"_rowTotals"+i;
        src_array.concat('<tr '
                          +' id="'+rowId+'"'
                          +' class="'+(title?'grid_cell_title title_totalizer':this['class_row'+( ((i%2) == 0 && !EmptyString(this.class_row_odd)) ? '_odd' : '' )]
                          +' grid_totalizer')+'" '
                        +'>');
      }

      this.buildFieldCell=function(src_array,row,recIdx,colIdx,col,hasRec,memCursPos){
        var tdId=this.get_td_id(colIdx,row),
          notIsExpr=!isExpr(col.field)
          bg_color=(isExpr(col.bg_color)?ZtVWeb.makeStdCell(col.bg_color,recIdx,this.datasource,null,this.form,null,picture):col.bg_color),
          f_color=(isExpr(col.font_color)?ZtVWeb.makeStdCell(col.font_color,recIdx,this.datasource,null,this.form,null,picture):col.font_color);
          //cell_tabindex = colIdx + 2 + ( (this.Cols.length + 1 ) * row); // 1 e' il tabindex del checkbox
          if(col.type =='M' && Empty(col.width)) col.width=(ZtVWeb.IsMobile()?'150px':'300px');
          if(!Empty(col.maxwidth) && col.maxwidth==col.width) col.fixedwidth=col.width;
          src_array.concat('<td id="'+tdId+'" align="'+this.align+'" valign="'+this.valign+'"'
            +( col.row_span>1 ? ' rowspan="'+col.row_span+'"' : '' )
            +( col.col_span>1 ? ' colspan="'+col.col_span+'"' : '' )
            +( ((hasRec || row==0) && this.filterByExample && notIsExpr) ? ' lookup="1" fldname="'+col.field+'" ' : '' )
            //+' class="grid_cell'+(!Empty(col.col_class)?' '+ZtVWeb.fmtPctFldPct(col.col_class,recIdx,this.datasource,null,this.form,false):'')+'"'
            +' class="grid_cell'+(!Empty(col.col_class)?' '+(isExpr(col.col_class)?ZtVWeb.makeStdCell(col.col_class,recIdx,this.datasource,null,this.form,null,picture):col.col_class):'')+'"'
            +((col.droppable && !col.editable && !Empty(col.droppable_name)) ?" data-transfer-accept='"+col.droppable_name+"' ":"")
            +' style="'+(col.font?'font-family:'+col.font+';':'')+(col.font_size?'font-size:'+col.font_size+';':"")+(col.font_weight?'font-weight:'+col.font_weight+';':"")+(col.font_weight=='italic'?'font-style:italic;':'')+(f_color?'color:'+f_color+';':"")+(bg_color?'background-color:'+bg_color+';':'')
            //(col.width?'min-width:'+col.width+';':'')+(col.maxwidth?'max-width:'+col.maxwidth+';':'')+'"'
            +((!Empty(col.fixedwidth) )?'width:'+col.fixedwidth+';':((!Empty(col.width)?'min-width:'+col.width+';':'')))+'"'
            +(col && col.type && col.type.match("D|T")?'nowrap':'')+'>');
        if(hasRec){
          var type = col.type,
              isData = this.isSqlDataProvider && notIsExpr && type.match("D|T"),
              isMemo = false || type.match("M"),
              divId=tdId+'_viewDiv',
              modified_rec=false,
              edit_col=col.editable,
              disable_condition=col.disable_condition,
              isEditable =edit_col && !this.isDisabled(recIdx,col.disable_condition),
              keypress,
              //keydown=(type=='N'?"onkeydown=\"ZtVWeb.FormatDecSep(event,this)\"":""),
              input_div,
              txt,
              col_has_align=EmptyString(col.align),
              picture=col.picture;
              if(!Empty(col.picture))
                keypress=(type=='N'?"onkeypress=\"return CheckNumWithPict(event,GetModDecPict(\'"+col.picture+"\'));\"":"");
              else
                keypress=(type=='N'?"onkeypress=\"return CheckNum(event);\"":"");
          //con layer di colonna creo una tabella interna
          if(IsA(col.Layer,'A') && col.Layer.length>0) {
            var class_row_str= this['class_row'+( ((row%2) == 0 && !EmptyString(this.class_row_odd)) ? '_odd' : '' )];
            src_array.concat("<table height='100%' width='100%' cellpadding=0 cellspacing=0><tr class='"+class_row_str+"' style='padding:0;margin:0;border:0;'><td style='padding:0;margin:0;border:0;' align='"+this.align+"' valign='"+this.valign+"'>")
          }
          if (memCursPos>0)
            this.mem_curs.GoTo(memCursPos)
          if(edit_col){
            var col_field=col.field,isCheckbox=false,isCombobox=false,col_Dataprovider;
            if(col_field.substr(0,9)=="checkbox:") {
              col_field=col_field.substr(9)
              isCheckbox=true
            }
            if(col_field.substr(0,9)=="combobox:") {
              var combo_Tmp=col_field.split(':');
              var value_fld,label_fld,emptyVal=true;
              col_field=combo_Tmp[1];
              col_Dataprovider=combo_Tmp[2];
              if(col_Dataprovider.indexOf("[")>-1){
                var col_Datap_tmp=col_Dataprovider;
                col_Dataprovider={};
                col_Datap_tmp=Strtran(col_Datap_tmp,";",",");
                col_Dataprovider['Data']=eval(col_Datap_tmp);
                if(combo_Tmp.length==4)emptyVal=CharToBool(combo_Tmp[3]);
              }else{
                value_fld=combo_Tmp[3];
                label_fld=combo_Tmp[4];
                if(combo_Tmp.length==6)emptyVal=CharToBool(combo_Tmp[5]);
                if(this.form[col_Dataprovider])
                  col_Dataprovider=this.form[col_Dataprovider];
              }
              isCombobox=true
            }
            if (!isCheckbox && !isCombobox) {
              if (type=='D' && ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date && !isCombobox) picture='YYYY-MM-DD';
              else if (type=='T' && ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.datetimeLocal ) picture='YYYY-MM-DDThh:mm:ss';
            }
            txt=ZtVWeb.applyPicture((memCursPos>0? this.mem_curs.get(col_field+"_new"): this.datasource.getValue(recIdx,col_field)),type,0,picture);
            if(isCombobox) {
              input_div='<div id="'+tdId+'_editDiv" style="display:block;margin:0;padding:2px;'
                +(col_has_align ? '' : 'text-align:'+col.align+';')+'"';
              input_div+='><select id="'+tdId+'_input" class="grid_input_field" '+((!isEditable)?'disabled':'')+'>';
              if(emptyVal){
                if(type=='N')
                  input_div+='<option value="0">-</option>';
                else
                  input_div+='<option value="">-</option>';
              }
              if(col_Dataprovider.getValue){ // dati da dataProvider
                for(var i=0;i<col_Dataprovider.getRecCount();i++){
                  var value= ZtVWeb.applyPicture( col_Dataprovider.getValue(i,value_fld),type,0,picture);
                  var label=ZtVWeb.Translate(ZtVWeb.applyPicture( col_Dataprovider.getValue(i,label_fld),type,0,picture));
                  input_div+='<option '+(txt==value?'selected':'')+' value="'+value+'">'+label+'</option>';
                }
              }else{
                for(var i=0;i<col_Dataprovider.Data.length;i++){
                  var value=col_Dataprovider.Data[i][0];
                  var label=ZtVWeb.Translate(col_Dataprovider.Data[i][1]);
                  input_div+='<option '+(txt==value?'selected':'')+' value="'+value+'">'+label+'</option>';
                }
              }
              input_div+='</select>';
              //storeEvent(tdId+'_input', 'onfocus', global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");'+global_js_id+'.onEditFldFocus(this,'+colIdx+');');
              if(isEditable){
                 storeEvent(tdId+'_input', 'onchange', global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");'+global_js_id+'.manageInputBlur('+(recIdx)+',this,"'+colIdx+'");');
              }
            }else if(isCheckbox) {
              input_div='<div id="'+tdId+'_editDiv" style="display:block;margin:0;padding:2px;'
                        +(col_has_align ? '' : 'text-align:'+col.align+';')+'"';
                        //if(isEditable)
                        //  input_div+=' onclick="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\')"'
                        input_div+='><input id="'+tdId+'_input" class="grid_input_field"  type="checkbox"'
                        //+' onfocus="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\');'+global_js_id+'.onEditFldFocus(this,'+colIdx+');"'
                        +(ZtVWeb.getCheckForCheckbox(txt)?" checked ":"")
                        + ((!isEditable)?' disabled':'')
                        //if(isEditable)
                        //  input_div+=' onclick="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\');'+global_js_id+'.manageInputBlur('+(recIdx)+",false,this,'"+colIdx+'\');" '
                        +'/></div>';
                //storeEvent(tdId+'_input', 'onfocus', global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");'+global_js_id+'.onEditFldFocus(this,'+colIdx+');');
              if(isEditable){
                //storeEvent(tdId+'_editDiv', 'onclick', global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");');
                storeEvent(tdId+'_input', 'onclick',global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");'+global_js_id+'.manageInputBlur('+(recIdx)+',this,"'+colIdx+'");');
                storeEvent(tdId+'_input', 'onmousedown',global_js_id+'.onEditFldFocus(this,'+colIdx+');');
              }
            } else if (type.match("M")){
              input_div='<div id="'+tdId+'_editDiv" style="display:block;margin:0;padding:2px;'
                      +(col_has_align ? '' : 'text-align:'+col.align+';')
                      +'"><textarea class="grid_input_field" id="'+tdId+'_input" type="text"'
                      +' onfocus="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\');'+global_js_id+'.onEditFldFocus(this,'+colIdx+');"'
                      +' onblur="'+global_js_id+'.manageInputBlur('+(recIdx)+",this,'"+colIdx+'\');" '
                      + keypress
                      +'style="'+((col_has_align ? '' : 'text-align:'+col.align+';'))+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')
                      + 'width:100%;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;"'
                      + ((!isEditable)?' disabled':'')
                      +'>'+ToHTML(txt)+'</textarea>'
                      +'</div>';
            }else if(isData && (!navigator.userAgent.match(/MSIE [4-7]\./))){
              if(Empty(picture)) picture=ZtVWeb.defaultDatePict;
              input_div='<div id="'+tdId+'_editDiv" style="display:block;margin:0;padding:2px;'
                      +(col_has_align ? '' : 'text-align:'+col.align+';')
                      +'"><div><input class="grid_input_field" id="'+tdId+'_input"'

                      +( ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date?' type="date"':
                         (ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.datetimeLocal?' type="datetime-local"':'type="text"')
                      )
                      //+' onfocus="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\');'+global_js_id+'.onEditFldFocus(this,'+colIdx+');"'
                      //+' onblur="'+global_js_id+'.manageInputBlur('+(recIdx)+",false,this,'"+colIdx+'\');" '
                      + keypress
                      //+'style="'+((col.width.indexOf('%')>-1 || Empty(col.width))?'':('width:100%;'))+(col_has_align ? '' : 'text-align:'+col.align+';')+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')+'"'
                      +'style="display:inline-block;vertical-align:middle;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;'+(col_has_align ? '' : 'text-align:'+col.align+';')+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')+'"'
                      + ((!isEditable)?' disabled':'')
                      +' value="'+ToHTML(txt)+'"/>'
                      +(!(ZtVWeb.IsMobile() && LibJavascript.HTML5Tests &&  LibJavascript.HTML5Tests.InputTypes && LibJavascript.HTML5Tests.InputTypes.date) ?
                       LibJavascript.DOM.buildIcon({
                          id   : tdId+'_input_calendar',
                          type : 'img',
                          className : "calendar-image",
                          image : (window.SPTheme.zoom_calendar_image?window.SPTheme.zoom_calendar_image:'../'+ZtVWeb.theme+'/formPage/zoom_calendar_enabled.gif'),
                          events : (isEditable?'onclick="LaunchCalendar(\''+tdId+'_input\',\''+picture+'\',\''+picture+'\');"':''),
                          image_attr : "no-repeat center center",
                          style : 'vertical-align:middle;display:inline-block;border:0;cursor:pointer;'
                        })
                        : "");
                      +'</div></div>';
                storeEvent(tdId+'_input', 'onfocus', global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");'+global_js_id+'.onEditFldFocus(this,'+colIdx+');');
                storeEvent(tdId+'_input', 'onblur',  global_js_id+'.manageInputBlur('+(recIdx)+',this,"'+colIdx+'");');
            } else {
              if(type.match("N") && ZtVWeb.IsMobile()){
                input_div='<div id="'+tdId+'_editDiv" style="display:block;margin:0;padding:2px;'
                      +(col_has_align ? '' : 'text-align:'+col.align+';')
                      +'"><div style="display:table-row"><input class="grid_input_field" id="'+tdId+'_input" type="text"'
                      //+' onfocus="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\');'+global_js_id+'.onEditFldFocus(this,'+colIdx+');"'
                      //+' onblur="'+global_js_id+'.manageInputBlur('+(recIdx)+",false,this,'"+colIdx+'\');" '
                      + keypress
                      //+'style="'+((col.width.indexOf('%')>-1 || Empty(col.width))?'':('width:100%;'))+(col_has_align ? '' : 'text-align:'+col.align+';')+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')+'"'
                      +'style="display:table-cell;width:100%;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;'+(col_has_align ? '' : 'text-align:'+col.align+';')+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')+'"'
                      + ((!isEditable)?' disabled':'')
                      +' value="'+ToHTML(txt)+'"/>'
                      //+'<a id="'+tdId+'_input_calc" style="display:table-cell;" onclick="'+global_js_id+'.OpenRow();'+(isEditable?'LibJavascript.Browser.TopFrame( \'LibJavascript\').ShowPopUpCalculator(\''+tdId+'_input\',null,\''+milSep+'\',\''+decSep+'\',window)':'')+'"><img  style="z-index:1;vertical-align:middle" src="../'+ZtVWeb.theme+'/formPage/calculator_enabled.png" border="0"></a>'
                      +'</div>';
                      +'</div>';

              }else{
                input_div='<div id="'+tdId+'_editDiv" style="display:block;margin:0;padding:2px;'
                      +(col_has_align ? '' : 'text-align:'+col.align+';')
                      +'"><input class="grid_input_field" id="'+tdId+'_input" type="text"'
                      +((col.droppable && !Empty(col.droppable_name)) ?" data-transfer-accept='"+col.droppable_name+"' ":"")
                      //+' onfocus="'+global_js_id+'.toggleEditFields('+recIdx+',true,\''+col.field+'\');'+global_js_id+'.onEditFldFocus(this,'+colIdx+');"'
                      //+' onblur="'+global_js_id+'.manageInputBlur('+(recIdx)+",false,this,'"+colIdx+'\');" '
                      + keypress
                      //+'style="'+((col.width.indexOf('%')>-1 || Empty(col.width))?'':('width:100%;'))+(col_has_align ? '' : 'text-align:'+col.align+';')+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')+'"'
                      +'style="width:100%;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;'+(col_has_align ? '' : 'text-align:'+col.align+';')+((type.match(/M|C/) && !EmptyString(picture) && picture.substr(0,1).match(/[!MW]/))?'text-transform:uppercase;':'')+'"'
                      + ((!isEditable)?' disabled':'')
                      +' value="'+ToHTML(txt)+'"/>'
                      +'</div>';
              }
              if(type.match("N") && ZtVWeb.IsMobile())
                storeEvent(tdId+'_input', 'onfocus', (isEditable?'LibJavascript.Browser.TopFrame( \'LibJavascript\').ShowPopUpCalculator(\''+tdId+'_input\',null,\''+milSep+'\',\''+decSep+'\',window);':'')+global_js_id+'.OpenRow();');
              else
                storeEvent(tdId+'_input', 'onfocus', global_js_id+'.toggleEditFields('+recIdx+',true,"'+col.field+'");'+global_js_id+'.onEditFldFocus(this,'+colIdx+');');

              storeEvent(tdId+'_input', 'onblur',  global_js_id+'.manageInputBlur('+(recIdx)+',this,"'+colIdx+'");');
            }
            src_array.concat(input_div)
          }
          src_array.concat('<div'
            +(modified_rec ? ' class="grid_uncommitted_field" ' : (isEditable ? ' class="grid_editablefield" ' : ' '))
            +' id="'+divId+'" '
            +' style="'
            +(edit_col?'display:none;':'')
            +( ZtVWeb.IsMobile() ? 'padding-left: 8px;' : '' )
            +(col_has_align ? '' : ('text-align:'+col.align+';'))
            +(isData ? 'white-space: nowrap;':'')
            +'">');
          if(col.field.indexOf("image:")>-1 || col.field.indexOf("html:")>-1 || col.field.indexOf("checkbox:")>-1 || col.field.indexOf("combobox:")>-1){ col.enable_HTML=true;}
          if(isCheckbox){
            if(ZtVWeb.getCheckForCheckbox(this.datasource.getValue(recIdx,clearField(col.field))))
              txt='1';
            else
              txt='0';
          }else
            txt=ZtVWeb.makeStdCell(col.field,recIdx,this.datasource,null,this.form,null,picture);
          txt=RTrim(txt+'');
          if(this.group_repeated=='true')
            if(this.prev_row_flds.length-1<=colIdx)
              this.prev_row_flds[colIdx]=txt;
            else if(this.prev_row_flds.length>0 && this.prev_row_flds[colIdx]==txt){
              this.prev_row_flds[colIdx]=txt;
              txt='';
            }else{
              this.prev_row_flds[colIdx]=txt;
              for(var i = colIdx+1;i<this.prev_row_flds.length;i++)
                this.prev_row_flds[i]='';
            }
          var indice;
          if (isMemo && !this.hideMemoLayer && this.lengthMemoLayer>0) {
            indice=(this.lengthMemoLayer>0?this.lengthMemoLayer:100);//txt.indexOf("<BR>");
            if (txt.length>indice){
              txt=txt.substr(0,indice)+ " ...";
              this.MemoCell(src_array,recIdx,col);
            }
          }
          if(!EmptyString(txt)) {
            if (!col.enable_HTML) txt=ToHTML(txt);
            else txt=ToHTag(txt);
          }
          if(edit_col && memCursPos>0){
            if (col.field.indexOf("checkbox:")==-1){
              txt=ZtVWeb.applyPicture(this.mem_curs.get(col.field+"_new"),type,0,picture);
              if (isMemo && !this.hideMemoLayer && this.lengthMemoLayer>0) {
                txt=RTrim(txt+'');
                indice=(this.lengthMemoLayer>0?this.lengthMemoLayer:100);//txt.indexOf("<BR>");
                if (txt.length>indice){
                  txt=txt.substr(0,indice)+ " ...";
                this.MemoCell(src_array,recIdx,col);
                }
              }
            } else {
              var col_fld_tmp=col.field;
              var alt='';
              if (col_fld_tmp.indexOf('checkbox:')>-1) {
                col_fld_tmp=col_fld_tmp.replace(/checkbox:/g,'');
                col_fld_tmp=col_fld_tmp.replace(/"/g, '\"');
              }
              var chk=ZtVWeb.getCheckForCheckbox(this.mem_curs.get(col_fld_tmp+"_new"))
              txt="<div><div style='position:absolute;width:20px;height:20px;background:#ff0000;z-index:10;filter:alpha(opacity=0);opacity:0;'>&nbsp;</div><input type=checkbox "+(chk?"checked":"")+" disabled='disabled'  title='"+alt+"'/></div>"
            }
            src_array.concat(txt);
          }else{
            if(EmptyString(col.link) && EmptyString(col.onclick)){
              src_array.concat(txt||'&nbsp;');
            }else{
              if(EmptyString(col.link) && !EmptyString(col.onclick)) col.link="javascript:void(0)";
              var links=ZtVWeb.makeStdLink(col.link,recIdx,this.datasource,null,this.form,false)
              var target_link=ZtVWeb.fmtPctFldPct(Trim(col.target)||'_self', recIdx, this.datasource, null,this.form, false)
              if(EmptyString(links))
                src_array.concat(txt||'&nbsp;');
              else{
                if(!EmptyString(txt)){
                  var onClick=col.onclick;
                  var on_click_str='';
                  if(!EmptyString(onClick)){
                    onClick = ZtVWeb.makeStdLink(onClick, recIdx, this.datasource, null, this.form, false);
                    on_click_str='onclick="'+onClick+'"';
                  }
                  if(col.target=='_blank' || col.target=='_new'){
                    on_click_str="onclick='"+(Empty(onClick)?'':onClick+';')+"ZtVWeb.Popup(this.href,\"\",event);return false;'";
                  } else if ( navigator.standalone && (col.target=='_self' || col.target=='') ) {
                    on_click_str="onclick='"+(Empty(onClick)?'':onClick+';')+"location.href=this.href;return false;'";
                  }
                   src_array.concat('<a '+on_click_str+' href="'+ToHTML(links)+'" title="'+(col.tooltip?ToHTML(ZtVWeb.fmtPctFldPct(Trim(col.tooltip), recIdx, this.datasource, null,this.form, false, false)):"")+'" style="'+(col.font?'font-family:'+col.font+';':'')+(col.font_size?'font-size:'+col.font_size+';':"")+(col.font_weight?'font-weight:'+col.font_weight+';':"")+(col.font_weight=='italic'?'font-style:italic;':'')+(f_color?'color:'+f_color+';':"")+' text-decoration:'+col.link_underlined+';" target="'+target_link+'">'+(txt||'&nbsp;')+'</a>');
                }else
                  src_array.concat('&nbsp;');
              }
            }
          }
          src_array.concat("</div>");
          if(IsA(col.Layer,'A') && col.Layer.length>0) {
            src_array.concat("</td><td style='padding:0;margin:0;border:0;width:1px;'>")
            this.columnlayerCell(src_array,recIdx,col);
            src_array.concat("</td></tr></table>")
          }
        }else{
          src_array.concat('&nbsp;');
        }
        src_array.concat("</td>");
      }

      this.buildTotalCell=function(src_array,row,colIdx,col,hasRec,title){
        var tdId=this.get_td_id(colIdx,row)+"_totals",
            notIsExpr=!isExpr(col.field);
        if(!Empty(col.maxwidth) && col.maxwidth==col.width) col.fixedwidth=col.width;
        src_array.concat('<td id="'+tdId+'" align="'+this.align+'" valign="'+this.valign+'"'
                            +( col.row_span>1 ? ' rowspan="'+col.row_span+'"' : '' )
                            +( col.col_span>1 ? ' colspan="'+col.col_span+'"' : '' )
                            // +' min-width="'+col.width+'"'
                            +' class="'+(title?'grid_cell_title title_totalizer':'grid_cell grid_totalizer')+'"'
                            +' style="'+(col.font_weight?'font-weight:'+col.font_weight+";":"")+(col.font_weight=='italic'?'font-style:italic;':'')+(col.font_color?'color:'+col.font_color+";":"")+(col.bg_color?'background-color:'+col.bg_color+';':'')
                            //+(col.width?'min-width:'+col.width+';':'')+(col.maxwidth?'max-width:'+col.maxwidth+';':'')+'"'
                            +((!Empty(col.fixedwidth))?'width:'+col.fixedwidth+';':((!Empty(col.width)?'min-width:'+col.width+';':'')))+'"'
                            +(col && col.type && col.type.match("D|T")?'nowrap':'')
                          +'>');

        if(hasRec){
          var type = col.type,
              isData = this.isSqlDataProvider && notIsExpr && type.match("D|T"),
              divId=tdId+'_viewDiv',
              picture=col.pict_total,
              txt,
              col_has_align=EmptyString(col.align);
          if (picture) type = "";
          else picture=col.picture;
          src_array.concat('<div'
            +' id="'+divId+'" '
            +' style="'
              +(col_has_align ? '' : ('text-align:'+col.align+';'))
              +( ZtVWeb.IsMobile() ? 'padding-left: 8px;' : '' )
              +(isData ? 'white-space: nowrap;':'')
            +'">');
          if(this.Totals[row][col.field]) txt=(title?this.Totals[row][col.field]:ZtVWeb.applyPicture(ZtVWeb.strToValue(this.Totals[row][col.field],type),type,0,picture));
          else txt='&nbsp;'
          src_array.concat(txt);
          src_array.concat("</div>");
        }else{
          src_array.concat('&nbsp;');
        }
        src_array.concat("</td>");
      }


      this.checkboxCell=function(src_array,i,recIdx,hasRec,memCursPos){
        src_array.concat('<td '
                          +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
                          +' class="grid_cell no-print"'
                          +' id="'+this.ctrlid+'_checkbox'+i+'"'
                          +' valign="middle"'
                          +' style="width:1px;">');
        var check_html='&nbsp;';
          //cell_tabindex=i*(this.Cols.length+1)+1;
        if(hasRec){
          var checkBoxId=this.ctrlid+'_checkbox_row_'+i,
              fields_num=this.sel_fields.length,
              bDisabled=this.isDisabled(recIdx);

          var chk=false
          if(memCursPos==0) {
            // non c'e' nel cursore, prende il default
            chk=(((this.selectAll=='selectAll') || (this.datasource.getValue(recIdx,this.preCheckbox_fld)!=0)));
          } else {
            //c'e' nel cursore!
            this.mem_curs.GoTo(memCursPos)
            chk=(this.mem_curs.get("ps_rowstatus")=="S" || this.mem_curs.get("ps_rowstatus")=="M")
          }
          check_html='<input type="checkbox" id="'+checkBoxId+'"   '
                    +' name="'+this.ctrlid+'_checkbox"'
                    +((chk)? ' checked="checked"' : '')
                    //+' onfocus="'+global_js_id+'.toggleEditFields('+recIdx+',true,null);"'
                    +' onclick="'+global_js_id+'.toggleEditFields('+recIdx+',true,null);'+global_js_id+'.SetCheckBox(this.checked);"'
                    +(bDisabled ? ' disabled="disabled"' : '')
                    +'>'
        }
        src_array.concat(check_html);
        src_array.concat('</td>');
      }
      this.ExecuteLink=function(recIdx, action) {
        this.form[this.splinker].Link(this.datasource.name,recIdx,null,action);
        if(this.activetoolbar){
          this.ToggleToolsBar();
        }
      }
      this.BuildSplinkerLink=function(recIdx, action) {
        return this.form[this.splinker].BuildLinkUrl(this.datasource.name,recIdx,null,action);
      }
      this.buildSplinkerLayer = function (recIdx) {
        function gethref(action) {
          return 'onclick="' + global_js_id + '.ExecuteLink(' + recIdx + ',' + "'" + action + "');event.preventDefault();" + '" href="'+this.BuildSplinkerLink(recIdx,action)+'"';
        }
        var spl_html_links = "";
        if (ZtVWeb.IsMobile()) {
          spl_html_links += (this.SPLinkerActions.V.valueOf()
             ? LibJavascript.DOM.buildIcon({
              type : 'a',
              className : "mobileIco view",
              image : (SPTheme.grid_img_action_view ? SPTheme.grid_img_action_view : ZtVWeb.SPWebRootURL + "/visualweb/images/grid_view.png"),
              events : gethref.call(this, this.SPLinkerActions.V.action || 'view'),
              image_attr : "no-repeat center center",
              text : '<div class="touchEffect_off" ontouchstart="this.className = \'touchEffect_on\';"ontouchend="this.className = \'touchEffect_delay touchEffect_off\';"></div>',
              style : 'vertical-align:middle;'
            })
             : "");
          spl_html_links += (this.SPLinkerActions.E.valueOf()
             ? LibJavascript.DOM.buildIcon({
              type : 'a',
              className : "mobileIco edit",
              image : (SPTheme.grid_img_action_edit ? SPTheme.grid_img_action_edit : ZtVWeb.SPWebRootURL + "/visualweb/images/grid_edit.png"),
              events : gethref.call(this, this.SPLinkerActions.E.action || 'edit'),
              image_attr : "no-repeat center center",
              text : '<div class="touchEffect_off" ontouchstart="this.className = \'touchEffect_on\';"ontouchend="this.className = \'touchEffect_delay touchEffect_off\';"></div>',
              style : 'vertical-align:middle;'
            })
             : "");
          spl_html_links += (this.SPLinkerActions.D.valueOf()
             ? LibJavascript.DOM.buildIcon({
              type : 'a',
              className : "mobileIco delete",
              image : (SPTheme.grid_img_action_delete ? SPTheme.grid_img_action_delete : ZtVWeb.SPWebRootURL + "/visualweb/images/grid_delete.png"),
              events : gethref.call(this, this.SPLinkerActions.D.action || 'delete'),
              image_attr : "no-repeat center center",
              text : '<div class="touchEffect_off" ontouchstart="this.className = \'touchEffect_on\';"ontouchend="this.className = \'touchEffect_delay touchEffect_off\';"></div>',
              style : 'vertical-align:middle;'
            })
             : "");
          for (var t, xx = 0, tools = this.Tools || []; t = tools[xx++]; ) {
            if (!Empty(t.URL)) {
              var on_click_str = '';
              var links = ZtVWeb.makeStdLink(t.URL, recIdx, this.datasource, null, this.form, true);
              if (t.Target == '_blank' || t.Target == '_new') {
                on_click_str = "onclick='ZtVWeb.Popup(this.href,\"\",event);return false;'";
              }
              if (!t.CustomAction || !this.splinker_pos.match(/layer/)) {
                spl_html_links += '<a style="margin:0 3px;vertical-align:middle;background:transparent url(' + t.Img + ') no-repeat center center;"' +
                'class="item_toolbar_layer mobileIco" ' + on_click_str + ' href="' + links + '" target="' + t.Target + '" alt="' + t.Tooltip + '" title="' + t.Tooltip + '">' +
                '<div class="touchEffect_off" ontouchstart="this.className = \'touchEffect_on\';"ontouchend="this.className = \'touchEffect_delay touchEffect_off\';"></div></a>';
              } else {
                var img = t.Img;
                if ( typeof(img)=='string' && img.indexOf('{') > -1 ){
                  img = JSON.parse(img);
                  img = {
                    font:img.fontFamily||img.FontName,
                    color:img.color||img.Color,
                    size:parseInt(img.size||img.Size),
                    fontWeight:img.fontWeight||img.FontWeight,
                    value:img.value,
                    Char:img.Char
                  }
                }
                spl_html_links += '<a style="margin:0 3px;display: block; width: 100%;text-decoration:none;background:transparent;border:0;" ' +
                'class="item_toolbar_layer mobileIco" ' + on_click_str + ' href="' + links + '" target="' + t.Target + '" alt="' + t.Tooltip + '" title="' + t.Tooltip + '">' +
                (typeof(img)=='string' ? '<img src="' + img + '" border="0" >' : "<span style='"+(img.color?"color:"+img.color+";":"")+
          "font-family:"+img.font+"; "+(img.size?"font-size:"+img.size+"px;":"")+" "+(img.fontWeight?"font-weight:"+img.fontWeight+";":"")+ "'>"+String.fromCharCode(img.value?parseInt(img.value.substring(3,7),16):img.Char)+"</span>")+
                '<span style="margin-left:5px;">' + t.Title + '</span>' +
                '<div class="touchEffect_off" ontouchstart="this.className = \'touchEffect_on\';"ontouchend="this.className = \'touchEffect_delay touchEffect_off\';"></div></a>';
              }
            }
          }

        } else {
          spl_html_links += '<div style="display: flex;">';
          spl_html_links += (this.SPLinkerActions.V.valueOf()
             ? LibJavascript.DOM.buildIcon({
              type : 'img',
              className : "view",
              image : (SPTheme.grid_img_action_view ? SPTheme.grid_img_action_view : ZtVWeb.SPWebRootURL + "/visualweb/images/grid_view.png"),
              events : gethref.call(this, this.SPLinkerActions.V.action || 'view'),
              image_attr : "no-repeat center center",
              style : 'vertical-align:middle;border:0;flex: auto;',
              title : this.Translations.View,
              alt : "View"
            })
             : "");
          spl_html_links += (this.SPLinkerActions.E.valueOf()
             ? LibJavascript.DOM.buildIcon({
              type : 'img',
              className : "edit",
              image : (SPTheme.grid_img_action_edit ? SPTheme.grid_img_action_edit : ZtVWeb.SPWebRootURL + "/visualweb/images/grid_edit.png"),
              events : gethref.call(this, this.SPLinkerActions.E.action || 'edit'),
              image_attr : "no-repeat center center",
              style : 'vertical-align:middle;border:0;flex: auto;',
              title : this.Translations.Edit,
              alt : "Edit"
            })
             : "");
          spl_html_links += (this.SPLinkerActions.D.valueOf()
             ? LibJavascript.DOM.buildIcon({
              type : 'img',
              className : "delete",
              image : (SPTheme.grid_img_action_delete ? SPTheme.grid_img_action_delete : ZtVWeb.SPWebRootURL + "/visualweb/images/grid_delete.png"),
              events : gethref.call(this, this.SPLinkerActions.D.action || 'delete'),
              image_attr : "no-repeat center center",
              style : 'vertical-align:middle;border:0;flex: auto;',
              title : this.Translations.Delete,
              alt : "Delete"
            })
             : "");
          spl_html_links += '</div>';

          for (var t, xx = 0, tools = this.Tools || []; t = tools[xx++]; ) {
            if (!Empty(t.URL)) {
              var on_click_str = '';
              var links = ZtVWeb.makeStdLink(t.URL, recIdx, this.datasource, null, this.form, true);
              if (t.Target == '_blank' || t.Target == '_new') {
                on_click_str = "onclick='ZtVWeb.Popup(this.href,\"\",event);return false;'";
              }
              if (!t.CustomAction || !this.splinker_pos.match(/layer/)) {
                spl_html_links += '<a class="item_toolbar_layer" ' + on_click_str + ' href=' + ToHTMLValue(links) + ' target="' + t.Target + '"><img style="vertical-align:middle;" src="' + t.Img + '" border="0" alt="' + t.Tooltip + '" title="' + t.Tooltip + '"></a>';
              } else {
                var img = t.Img;
                if ( typeof(img)=='string' && img.indexOf('{') > -1 ){
                  img = JSON.parse(img);
                  img = {
                    font:img.fontFamily||img.FontName,
                    color:img.color||img.Color,
                    size:parseInt(img.size||img.Size),
                    fontWeight:img.fontWeight||img.FontWeight,
                    value:img.value,
                    Char:img.Char
                  }
                }
                spl_html_links += '<a class="item_toolbar_layer no-print"' +
                                  on_click_str + ' href=' + ToHTMLValue(links) + ' target="' + t.Target + '" title="' + t.Tooltip + '">';
                if( img!=''){
                  if( typeof(img)=='string' )  {
                   spl_html_links +='<img style="vertical-align:middle;" src="' + img + '" border="0" alt="' + t.Tooltip + '" title="' + t.Tooltip + '">';
                  } else {
                    spl_html_links +="<span class='item_toolbar_layer_img' style='"+(img.color?"color:"+img.color+";":"")+ "font-family:"+img.font+";"+(img.size?"font-size:"+img.size+"px;":"")+(img.fontWeight?"font-weight:"+img.fontWeight+";":"")+ "'>"+String.fromCharCode(img.value?parseInt(img.value.substring(3,7),16):img.Char)+"</span>";
                  }
                }
                spl_html_links +='<span class="item_toolbar_layer_text">' + t.Title + '</span>' +
                '</a>';
              }
            }
          }
        }
        if (EmptyString(spl_html_links)) {
          spl_html_links = "&nbsp;";
        }
        return spl_html_links;
      }

      this.splinkerCell=function(src_array,hasRec,i,recIdx){
          var onlyOne = (this.SPLinkerActions.V.valueOf() ? 1 : 0 )+(this.SPLinkerActions.E.valueOf() ? 1 : 0 )+(this.SPLinkerActions.D.valueOf() ? 1 : 0 )+(this.Tools && this.Tools.length ? this.Tools.length+1 /*voglio sempre layer anche se e' solo un tool */ :0);
        var showInLayer = ( ( this.splinker_pos.match(/layer/) || ZtVWeb.IsMobile() ) && onlyOne > 1 )
        if(this.renderSPLinker_new){
          var spl_new_link = !EmptyString(this.parent_splinker) ? "window."+this.form.formid+"."+this.parent_splinker+".Link();" : "window."+this.form.formid+"."+this.splinker+".Link(null,null,null,'"+(this.SPLinkerActions.N.action||'new')+"');",
              spl_html_new_layerCell="&nbsp;",
              spl_html_new_link = this.SPLinkerActions.N.valueOf() ?
              LibJavascript.DOM.buildIcon({type : 'img'
                , className : "add"
                , image : (SPTheme.grid_img_action_new?SPTheme.grid_img_action_new:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_new.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , events : 'onclick="'+spl_new_link+'"'
                , title : this.Translations["New"]
                , alt : "New"
              }) : spl_html_new_layerCell;
        }
        var spl_cellId=this.ctrlid+'_spk'+i,
            spl_html_begin='<td '
              +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
              +' class="grid_cell no-print grid_layer_anchor_nearTo grid_splinker"' // grid_splinker
              +' valign="'+this.valign+'"'
              +' id="'+spl_cellId+'"'
              +' style=";">',
            spl_html_layerCell,
            spl_html_links="",
            spl_html_end="";
        if(this.renderSPLinker_column){
          if(hasRec){ //se n sei arrivato alla fine
            spl_html_begin+='<span style="white-space:nowrap;">';
            spl_html_end='</span>';
          }
          spl_html_end+="</td>";
          if( showInLayer ) {
            if(hasRec){
              var toolsbar_id=this.ctrlid+'_spk_tools'+i
              if(ZtVWeb.IsMobile()){
                spl_html_layerCell = LibJavascript.DOM.buildIcon({type : 'a'
                  , className : "mobileIco grid_layer_anchor"
                  , image : (SPTheme.grid_img_tbarLayer_closed ? SPTheme.grid_img_tbarLayer_closed : ZtVWeb.SPWebRootURL+"/visualweb/images/grid_tools.gif")
                  , events : 'href="javascript:'+global_js_id+".ToggleToolsBar('"+toolsbar_id+'\',\''+spl_cellId+'\');"'
                  , image_attr : "no-repeat center center"
                })
              }else{
                spl_html_layerCell=LibJavascript.DOM.buildIcon({
                    type : 'img'
                  , className : "grid_img_tbarLayer_closed"
                  , image : (SPTheme.grid_img_tbarLayer_closed?SPTheme.grid_img_tbarLayer_closed:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_tools.png")
                  , image_attr : "no-repeat center center"
                  , events : 'onclick='+global_js_id+".ToggleToolsBar('"+toolsbar_id+'\',\''+spl_cellId+'\')'
                  , style : 'vertical-align:middle;border:0;cursor:pointer;'
                })
              }
            }
          }
        }

        if(!this.splinker_pos.match(/layer/) || onlyOne < 2 /* && !ZtVWeb.IsMobile() */){
          var spl_html_links =  hasRec ? this.buildSplinkerLayer(recIdx): "" ;
          src_array.concat(spl_html_begin+spl_html_links+spl_html_end);
        }else if(this.splinker_pos.match(/layer/)){
          if(spl_html_layerCell)
            src_array.concat(spl_html_begin+spl_html_layerCell+spl_html_end);
          else
            src_array.concat(spl_html_begin);
        }
      }

      this.rowlayerCell=function(src_array,i,recIdx,hasRec){
        var spanId=this.ctrlid+'_row_layer_'+i,
            cell_bg_color=this['row_color' + (((i%2) == 0 && !EmptyString(this.row_color_odd)) ? '_odd' : '')];
        var layerInGrid=!this.reduced;
        for (var j=0;j<this._rowLayer.length && !layerInGrid;j++){
          if (!this._rowLayer[j].inExtGrid)
            layerInGrid=true;
        }
        src_array.concat('<td '
          +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
          +' class="grid_cell no-print" valign="bottom" style="'+( EmptyString(cell_bg_color) ? '' : 'background-color: '+ cell_bg_color +';padding:0;')+'">'
          +'<span id="'+spanId+'" style="width:100%;height:100%;" '
          +(hasRec && !EmptyArray(this._rowLayer) && (layerInGrid) ?
              'class="layer_activator"'
              +'>'
              +LibJavascript.DOM.buildIcon({type : 'img'
                             , className : "picker_grid_img_layer"
                             , image : (SPTheme.grid_img_layer||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_placeHolder_rowLayer.gif")
                             , style : (SPTheme.grid_img_layer && SPTheme.grid_img_layer.indexOf('{') > -1 ? '': 'visibility:hidden;')+'border:0;'
                             })
              //+'<img src="'+(SPTheme.grid_img_layer||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_placeHolder_rowLayer.gif")+'" border="0" style="visibility:hidden;">'
            :
              '>&nbsp;'
          )
          +'</span></td>');
        if(!EmptyArray(this._rowLayer)  && hasRec){//non inserisce gli eventi nei rowlayer delle righe vuote della grid
          storeEvent(spanId, 'onclick', global_js_id+".ToggleRowLayer('"+spanId+"',"+recIdx+');');
          storeEvent(spanId, 'onmouseover', global_js_id+".HoverRowLayer('"+spanId+"',"+recIdx+');');
        }
      }

      this.rowlayerTotalCell=function(src_array,i,title){
        src_array.concat('<td '
          +( this.linesCount>1 ? ' rowspan='+this.linesCount : '' )
          +' class="'+(title?'grid_cell_title title_totalizer no-print':'grid_cell grid_totalizer no-print')+'" valign="middle">&nbsp;'
          +'</td>');
      }


      this.columnlayerCell=function(src_array,recIdx,col){
        var layerInGrid=!this.reduced;
        for (var j=0;j<col.Layer.length && !layerInGrid;j++){
          if (!col.Layer[j].inExtGrid)
            layerInGrid=true;
        }
        if(!EmptyArray(col.Layer) && layerInGrid){
          var divId=this.getColumnLayerDivId(col,recIdx);
          src_array.concat('<div'
            +' class="layer_activator"'
            +' id="'+divId+'"'
            +'>'
            +LibJavascript.DOM.buildIcon({type : 'img'
                             , className : "picker_grid_img_layer picker_grid_img_layer_column"
                             , image : (SPTheme.grid_img_layer||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_placeHolder_columnLayer.gif")
                             , style : (SPTheme.grid_img_layer && SPTheme.grid_img_layer.indexOf('{') > -1 ? '': 'visibility:hidden;border:0;')+'vertical-align:bottom'
                             })
              // +'<img src="'
                // +(SPTheme.grid_img_layer||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_placeHolder_columnLayer.gif")
                // +'" border="0" align="bottom" style="visibility:hidden; vertical-align:bottom;"'
              // +'>'
          +'</div>');
          storeEvent(divId, 'onclick', global_js_id+".ToggleColumnLayer(evt,'"+col.id+"','"+divId+"',"+recIdx+');');
          storeEvent(divId, 'onmouseover', global_js_id+".HoverColumnLayer('"+col.id+"','"+divId+"',"+recIdx+');');
        }
      };

      this.MemoCell=function(src_array,recIdx,col){
        if(ZtVWeb.IsMobile()) return;
        var divId=this.getMemoDivId(col,recIdx);
        src_array.concat('<div'
          +' class="memo_viewer"'
          +' id="'+divId+'"'
          +'>'
            +'<img src="'
              +(SPTheme.grid_img_memo||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_dn_blue.gif")
              +'" border="0" align="bottom" style="visibility:hidden; vertical-align:bottom;"'
            +'>'
        +'</div>');
        storeEvent(divId, 'onclick', global_js_id+".ToggleMemoLayer(evt,'"+col.id+"','"+divId+"',"+recIdx+');');
        storeEvent(divId, 'onmouseover', global_js_id+".HoverMemo('"+col.id+"','"+divId+"',"+recIdx+');');
      };
      this.MemoCellString=function(recIdx,col){
        var divId=this.getMemoDivId(col,recIdx);
        var html ='<div'
          +' class="memo_viewer"'
          +' onmouseover="'+global_js_id+".HoverMemo('"+col.id+"','"+divId+"',"+recIdx+')"'
          +' onclick="'+global_js_id+".ToggleMemoLayer(evt,'"+col.id+"','"+divId+"',"+recIdx+')"'
          +' id="'+divId+'"'
          +'>'
            +'<img src="'
              +(SPTheme.grid_img_memo||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_dn_blue.gif")
              +'" border="0" align="bottom" style="visibility:hidden; vertical-align:bottom;"'
            +'>'
        +'</div>';
        return html;
      };
      this.getMemoDivId=function(col,recIdx){
        return this.ctrlid+'_memo_'+col.id+'_row_'+recIdx;
      }

      this.getColumnLayerDivId=function(col,recIdx){
        return this.ctrlid+'_column_layer_'+col.id+'_row_'+recIdx;
      }
      this.HideFieldList = function() {
        var container = LibJavascript.DOM.Ctrl(this.ctrlid+'_search_fields_list');
        if (container) {
          container.style.display = "none";
        }
      }
      this.ShowFieldList = function(JSONObj,colId,thId) {
        if (JSONObj && JSONObj.Fields.length==1) {
          if (document.activeElement) document.activeElement.blur();
          var col =this.GetColById(colId,true);

          if(col){
            var container = LibJavascript.DOM.Ctrl(this.ctrlid+'_search_fields_list');
            if (!container) {
              container=document.createElement("div");
              container.style.position='absolute';
              container.id=this.ctrlid+'_search_fields_list';
              container.style.zIndex='200';
              container.style.right='auto';
            }
            var title = LibJavascript.DOM.Ctrl(thId);
            var pos=LibJavascript.DOM.getPosFromFirstRel(title,container);
            container.style.top=(pos.y+title.offsetHeight)+'px';
            container.style.left=(pos.x)+'px';
            container.style.display = "";
            var maxHeight = Int((this.Ctrl.offsetHeight - title.offsetHeight));
            maxHeight = Int( (Min(maxHeight , GetWindowSize().h - pos.y)) / 100 * 75 );
            var src_arr=new LibJavascript.String.Chainer();
            src_arr.concat('<div class="search_fields_ul_pin"></div>');
            src_arr.concat('<ul class="search_fields_ul" style="max-height:'+maxHeight+'px; -webkit-overflow-scrolling:touch; overflow-y:scroll; overflow-x:hidden; width:auto;" ontouchstart="event.stopPropagation();" ontouchmove="event.stopPropagation();">');
            src_arr.concat('<li class="search_fields_li" data-value="__ALLVALUES__" onclick="'+global_js_id+'.filterByExample_fromLI(event,this,\''+col.field+'\')">'+ZtVWeb.GridTranslations["All"]+'</li>');
            for (var i=0;i<JSONObj.Data.length-1;i++){
              var val = ZtVWeb.strToValue(JSONObj.Data[i][0],col.type);
              var txt;
              if (Empty(val)) {
                txt = '';
              } else {
                txt = ZtVWeb.applyPicture(val,col.type,0,col.picture);
              }
              src_arr.concat('<li class="search_fields_li" data-value="'+ToHTML(txt)+'" onclick="'+global_js_id+'.filterByExample_fromLI(event,this,\''+col.field+'\')">'+(Empty(val) ? '('+ZtVWeb.GridTranslations["Empty"]+')' : txt)+'</li>');
            }
            src_arr.concat('</ul>');
            container.innerHTML=src_arr.toString();
            this.MakeWrapper();
            var grid_wrapper = LibJavascript.DOM.Ctrl(this.ctrlid+"_wrapper");
            grid_wrapper.appendChild(container);
            this.HideOrderbyList();
          }
        }
      }
      this.filterByExample_fromLI=function(event,el,field) {
        var removed=false;
        for (var i=this.Filters.length-1;i>=0;i--) {
          if (this.Filters[i].field.toLowerCase()==field.toLowerCase()) {
            this.RemoveFilter(this.Filters[i].id);
            removed = true;
          }
        }
        var value = el.getAttribute("data-value");
        var type = this.datasource.fieldstypearray[this.datasource.Fields.indexOf(field.toLowerCase())];
        var op = ( type == "C" || type =="M" ? "like" : "=");
        if (Empty(value)) {
          op = "empty";
          value = "";
        }
        if (value=="__ALLVALUES__" && !removed) {
          var container = LibJavascript.DOM.Ctrl(this.ctrlid+'_search_fields_list');
          container.style.display = "none";
        } else {
          if (value=="__ALLVALUES__") value="";
          this.FilterByExample(field,op,value);
        }
      }
      this.LoadGridFilterPortlet=function() {
        if(this.Cols && this.Cols.length>0 && !this.grid_filter_loaded && ZtVWeb.IsMobile() && this.show_filters.indexOf('true')>-1 && this.showFilterPortlet){
          var _ForcedPortletUID = "__SPRANDOMPORTLETUID__";
          var _gridName="__GRIDNAME__";
          var _portletid="__PORTLETID__";
          var ForcedPortletUID=this.ctrlid+"_search";
          var gridName=this.name;
          var portletid=this.form.formid;
          var parFromContainer= ( document.location.search ? "&"+(document.location.search.substring(1)) : '');
          LibJavascript.CssClassNameUtils.addClass( LibJavascript.DOM.Ctrl(this.TopToolsbarContainerId()), 'no-print' )
          this.grid_filter_loaded=200==ZtVWeb.Include(ZtVWeb.SPWebRootURL+"/"+ZtVWeb.theme+"/jsp-decorators/grid_filter_portlet.jsp?ForcedPortletUID="+_ForcedPortletUID+"&grid="+_gridName+"&portletid="+_portletid+parFromContainer,this.TopToolsbarContainerId(),false,function(str){
            str= str.replace( /(__SPRANDOMPORTLETUID__)/g, function() {
              return ForcedPortletUID;
            });
            str= str.replace( /(__GRIDNAME__)/g, function() {
              return gridName;
            });
            str= str.replace( /(__PORTLETID__)/g, function() {
              return portletid;
            });
            return str;
          }
          );
          var title_grid = window[this.ctrlid+"_search"] || window[this.form.Zoomtitle];
          if (title_grid && title_grid.SetOtherFields) {
            title_grid.SetOtherFields(this._rowLayer);
            this._rowLayer=[];
          }
        }
      }
      this.DisplayGridFilterPortlet=function() {
        if (ZtVWeb.IsMobile() && this.show_filters.indexOf('true')>-1 && this.showFilterPortlet) {
          this.TopToolsbarContainer().style.display='';
          var title_grid = window[this.ctrlid+"_search"] || window[this.form.Zoomtitle];
          if (title_grid && title_grid.SetOtherFields)
            title_grid.SetOtherFields();
        }
      }
      //Costruzione griglia ------------------------------------------FILLDATA-------------------------------------------------
      this.FillData=function(datasource){
        this.datasource=datasource||this.datasource;
        if(this.appendingData && !this.dontupdate){
          this.AppendData();
          return;
        }
        this.reduced=this.extensible.match(/reduced/);
        this.extFieldsIdx=[];
        this.prev_row_flds=[];
        var extFieldIdx, extfld, indexOf=LibJavascript.Array.indexOf, k, l;
        if(this.reduced){
          for(var k=0;k<this.Cols.length; k++){
            if(this.Cols[k].inExtGrid==1 || this.Cols[k].inExtGrid==true){
              extfld=this.Cols[k].field;
              extFieldIdx=indexOf(this.Cols, extfld.toLowerCase(),function (e1,e2){return e1.field.toLowerCase()==e2.toLowerCase();});
              if(extFieldIdx!=-1){
                this.extFieldsIdx[extFieldIdx]=null;
              }
            }
          }

        }
        if(this.dontupdate){
          return;
        }
        if(this.floatRows) LibJavascript.CssClassNameUtils.addClass(this.Ctrl,"gridFloat");
        this.InvalidateHtmlReferences();
        this.isSqlDataProvider = this.HasDataSourceSqlDataprovider();
        if (this.datasource.AvailableOperators)
          this.AvailableOperators = this.datasource.AvailableOperators;
        else //if (this.isSqlDataProvider)
          this.AvailableOperators=[{op:"contains",caption:ZtVWeb.Translate('MSG_CONTAINS')},{op:"like",caption:ZtVWeb.Translate('MSG_STARTS_WITH')},"=","<","<=",">=",">","<>",{op:"empty",caption:ZtVWeb.GridTranslations["Empty"]}]; //,"is null","is not null","in"];
        // else //XMLDataProvider
          // this.AvailableOperators=["=","<","<=",">=",">","<>","empty"]; //,"is null","is not null","in"];
        var i, field, flds, col;
        if(EmptyArray(this.colProperties) && this.Cols.length==0){
          //this.fields=[];
          this.colProperties=[];
          for(i=0, flds=this.datasource.Fields; field=flds[i++]; ){
            if(field!='cpccchk'){
              this.colProperties.push({'field':field,'title':field});
            }
          }
          this.setStructures();
        }
        if(this.assigntypestocols){
          this.assigntypestocols=false
          for(i=0; col=this.Cols[i]; i++){
            this.setColType(col)
            for(var j=0;j<col.Layer.length;j++){
              this.setColType(col.Layer[j])
            }
          }
          for(i=0; col=this._rowLayer[i]; i++){
            this.setColType(col)
          }
          this._initMemCurs()
          this._renderOutputDataObj()
        }else if(!this.preserveData && !this.keepMemCurs) {
          this._initMemCurs()
          this._renderOutputDataObj()
        }


        k=this._PPKGet()
        if (!EmptyString(this._PPK)){
            if (k in this._PPKSelStat){
              this.selectAll=this._PPKSelStat[k];
          } else {
            this.selectAll='unselectAll';
          }
        }
        this._PPKLast=k
        this.preserveData=false
        this.activetoolbar=null;
        this.hasRowLayer = this.renderRowLayer();
        var nRecs=this.datasource.getRecCount(),
            src_array=new LibJavascript.String.Chainer();
        /*Controllo della minRowHeight*/
        //var rowMinHeight = this.rowMinHeight ? this.rowMinHeight : ( SPTheme.grid_row_min_height ? SPTheme.grid_row_min_height : 0) ;
        // if(this.showScrollBars){
          // this.row_height = this.rows==1000 ? 0 : Math.max(rowMinHeight||0, Math.round((h-(!this.renderTitles ? 25 : 0 )-(this.nav_bar=='true' || this.nav_bar=='always'? 25 : 0 ))/((this.rows*this.linesCount)+ (this.renderTitles ? 1 : 0 ))));
        // }else{
          // this.row_height = this.rows==1000 ? 0 : Math.max(rowMinHeight||0, Math.round(h/((this.rows*this.linesCount)+ (this.renderTitles ? 1 : 0 ))));
        // }
        //if(this.filterByExample){
        if(this.show_filters!='false'){
          src_array.concat('<div id="'+this.ctrlid+'_filterByExample_container"  style="position:absolute;top:0;left:0;z-index:1;"></div>');
        }
        src_array.concat("<div id='tbl" + this.ctrlid + "_scroller' " + "style='" + (this.showScrollBars ? ( "height:" + this.minheight + "px;overflow:auto;") : "position:relative;overflow-x:auto;") + "-webkit-overflow-scrolling: touch;' >");
        if(this.floatRows)
          src_array.concat("<div style='display:flex;'><div id='tbl"+this.ctrlid+"' class='grid_cards_container' style='"+(font?"font-family:"+font+";":"")+(font_size?"font-size:"+font_size+";":"")+"'>");
        else
          src_array.concat("<table id='tbl"+this.ctrlid+"' width='100%' border='0' cellspacing='"+cellspacing+"px' cellpadding='"+cellpadding+"px' style='"+(font?"font-family:"+font+";":"")+(font_size?"font-size:"+font_size+";":"")+"'>");
        //ciclo dei record da visualizzare----------------------------------------
        this.curRec=this.datasource.curRec;
        this.colspan=0;
        this.sum_colspan=true;
        this.hasRecMark = this.recMark=='true';
        this.hasSPLinker = !EmptyString(this.splinker);
        this.renderSPLinker_new = this.hasSPLinker && this.SPLinkerActions.N.valueOf();
        this.renderSPLinkers_inline = this.hasSPLinker && (this.SPLinkerActions.V.valueOf() || this.SPLinkerActions.E.valueOf() || this.SPLinkerActions.D.valueOf() || !EmptyArray(this.Tools));
        this.renderSPLinker_new_inCheckbox_th = !this.hasRecMark && this.checkbox && this.renderSPLinker_new && !this.renderSPLinkers_inline;
        this.renderSPLinker_column = this.renderSPLinkers_inline || (this.renderSPLinker_new && ((this.splinker_pos.match(/left/)  && !this.renderSPLinker_new_inCheckbox_th) || (this.splinker_pos.match(/right/) && this.hasRowLayer)));
        this.rowsrc_static_spl_linkFnc='<a href="javascript:void(window.'+this.form.formid+'.'+this.splinker+".Link('"+this.datasource.name+"',"; // attenzione, inserire una ) in piu' per il void(
        this.get_td_id=function(colIdx,rowIdx){
          return td_id_prefix+'_'+rowIdx+'_'+colIdx;
        }

        //----------------------------------------FUNZIONI NUOVE RIGHE-------------------------------------------------------------------------------
        /*
          funzioni per l'assegnazione differita delle funzioni di gestione degli eventi perche' in IE fare l'innerHTML con gli eventi gestiti
          (onmouseXXX=ZtVWeb.SPWebRootURL+"..." ecc) rallenta tantissimo la fase di rendering.
        */
        this.buildOpenFieldsRow.subCounter=0; //NON SPOSTARE
        //------------------------------RENDER TITOLI----------------------------------------
        if(this.renderTitles){
          if(this.floatRows){
            this.buildFloatTitlesColumns(src_array);
          }else{
            if(this.isShowExtraTitles){ //Si vogliono i titoli Extra flottanti anche nella grid standard
              src_array.concat('<thead><tr class="'+this.class_title+' grid_cell_title"><td colspan="100">');
              this.buildFloatTitlesColumns(src_array);
              src_array.concat("</tr></thead>");
            }
            if(!this.hide_default_titles){
              src_array.concat('<thead><tr id="'+this.ctrlid+'_titles_row" class="'+this.class_title+' grid_row_title">');
              this.buildFirstTitlesColumns(src_array);
              this.buildFieldsTitlesColumns(src_array);
              if(this.linesCount==1){//colonne finali se tutto in una riga
                this.buildLastTitlesColumns(src_array);
              }
              this.sum_colspan=false;
              src_array.concat("</tr></thead>");
            }
          }
        }
        //--------------------------RENDER RIGHE--------------------------------------------------------------------------------------------
        if(!this.floatRows)
          src_array.concat("<tbody>");
        src_array = this.buildTbody( src_array );
        if(!this.floatRows)
          src_array.concat("</tbody>");
        //Controlli per generazione <tfoot>

        if(this.floatRows){
          src_array.concat("</div><div>");
          var grdRefreshTD = "";
          if (this.form[this.name+'_GridRefreshContent']) {
            grdRefreshTD = this.form[this.name+'_GridRefreshContent']();
          }
          if (grdRefreshTD) {
            src_array.concat(grdRefreshTD);
          }
          src_array.concat("</div></div>");
        }

        if(this.nav_bar=='always' || this.datasource.getRecCount()>0){
          if((this.nav_bar=='always' || (this.nav_bar=='true' && !(this.Eop() && this.Bop()))) || (this.renderTotals && this.Totals) || (!Empty(this.business_obj) && (this.show_btn_update=='true' || this.show_btn_delete=='true'))){
            if(!this.floatRows)
              src_array.concat('<tfoot id="'+this.ctrlid+'_footer_row" align="center">');
            else
              src_array.concat('<div id="'+this.ctrlid+'_footer_row" class="grid_card_footer_container" style="clear:both;" align="center"><table>');
          }
          if(this.datasource.getRecCount()>0 && !Empty(this.business_obj) && (this.show_btn_update=='true' || this.show_btn_delete=='true')){
            src_array.concat('<tr height="0" align="right"><td height="0" colspan="'+this.colspan+
              '" style="padding:0;'+(this.row_color?'background-color:'+this.row_color+";":"")+(font_color?"color:"+font_color+";":"")+'">');
              if(this.show_btn_update=='true')
                src_array.concat(
                  LibJavascript.DOM.buildIcon({type : 'img'
                    , className : "grid_save"
                    , image : (SPTheme.grid_img_action_save?SPTheme.grid_img_action_save:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_save.png")
                    , image_attr : "no-repeat center center"
                    , events : 'onclick="'+global_js_id+'.UpdateBO()"'
                    , style : 'vertical-align:middle;border:0;cursor:pointer;'
                    , title : this.Translations["Save"]
                    , alt : "Save"
                  })
                );

              if(this.show_btn_delete=='true'){
                src_array.concat(
                  LibJavascript.DOM.buildIcon({type : 'img'
                    , className : "delete"
                    , image : (SPTheme.grid_img_action_delete?SPTheme.grid_img_action_save:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_delete.png")
                    , image_attr : "no-repeat center center"
                    , events : 'onclick="'+global_js_id+'.DeleteBO()"'
                    , style : 'vertical-align:middle;border:0;cursor:pointer;'
                    , title : this.Translations["Delete"]
                    , alt : "Delete"
                  })
                );
              }
              src_array.concat('</td></tr>');
          }
          if(this.nav_bar=='always' || (this.nav_bar=='true' && !(this.Eop() && this.Bop()))){
            if(this.colspan==0 && !this.floatRows) this.colspan=this.titles.length;
            var cell_bg_color= EmptyString(title_color) ? this.row_color : title_color;
            src_array.concat('<tr height="0"><td height="0"colspan="'+this.colspan+
              '" style="padding:0;'+(cell_bg_color?'background-color:'+cell_bg_color+";":"")+(font_color?"color:"+font_color+";":"")+'"><table id="tbl'+this.ctrlid+'_navbar" class="'+this.class_nav_bar+
              '" width="100%" border="0" cellspacing="0" cellpadding="0" style="text-decoration:none;'+(cell_bg_color?'background-color:'+cell_bg_color+';':'')+(font_color?'color:'+font_color+';':"")+(font?'font-family:'+font+";":"")+
              (font_size?"font-size:"+font_size+';':"")+'"><tr><td nowrap align="left" style=";">');
            if(this.Bop()) {
              if (this.navbar_mode.firstlast)
                src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_first_dis"
                  , image : (SPTheme.grid_img_navbar_first_dis?SPTheme.grid_img_navbar_first_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_first_dis.png")
                  , image_attr : "no-repeat center center"
                  , style : 'vertical-align:middle;border:0;'
                  , title : this.Translations["First_page"]
                  , alt : "First page"
                  })
                );

              src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_prev_dis"
                , image : (SPTheme.grid_img_navbar_prev_dis?SPTheme.grid_img_navbar_prev_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_prev_dis.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , title : this.Translations["Previous_page"]
                , alt : "Previous page"
                })
              );
            } else{
              if (this.navbar_mode.firstlast)
                src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_first"
                  , image : (SPTheme.grid_img_navbar_first?SPTheme.grid_img_navbar_first:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_first.png")
                  , image_attr : "no-repeat center center"
                  , events : 'onclick="'+global_js_id+'.FirstPage();"'
                  , style : 'vertical-align:middle;border:0;cursor:pointer;'
                  , title : this.Translations["First_page"]
                  , alt : "First page"
                  })
                );

              src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_prev"
                , image : (SPTheme.grid_img_navbar_prev?SPTheme.grid_img_navbar_prev:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_prev.png")
                , image_attr : "no-repeat center center"
                , events : 'onclick="'+global_js_id+'.PrevPage();"'
                , style : 'vertical-align:middle;border:0;cursor:pointer;'
                , title : this.Translations["Previous_page"]
                , alt : "Previous page"
                })
              );
            }
            if (this.navbar_mode.addremove || this.navbar_mode.pagepanel)
              src_array.concat("</td><td style='width:98%;text-align:center;vertical-align:middle;'>");
            if (this.navbar_mode.addremove)
              src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_minus"
                , image : (SPTheme.grid_img_navbar_rem_rows?SPTheme.grid_img_navbar_rem_rows:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_minus.png")
                , image_attr : "no-repeat center center"
                , events : 'onclick="'+global_js_id+'.RemoveRows();"'
                , style : 'vertical-align:middle;border:0;cursor:pointer;'
                , title : this.Translations["Remove_rows"]
                , alt : "Remove Rows"
                })
              );

            if (this.navbar_mode.pagepanel) {
              src_array.concat('<span id="'+this.ctrlid+'_page_numbers"'+(this.navbar_mode.changepage?' title="'+(this.Translations["Change_page"]||"Change page")+'"':'')+' >'+this.Translations["Page"]+"&nbsp;"+
                (this.navbar_mode.changepage?"<input id='"+this.ctrlid+"_PageSelector' type='text' value='"+this.GetCurPage()+"' size='"+(""+this.GetCurPage()).length+"' onblur='javascript:"+global_js_id+".GoToPage()' onKeydown='javascript:"+global_js_id+".selector_keydown(event)' class='grid_navbar_curpage_input'/>":this.GetCurPage())+"&nbsp;"+
                (this.navbar_mode.lastpage ? this.Translations["Of"]+"&nbsp;"+
                (this.navbar_mode.changepage?"<input type='text' readonly class='grid_navbar_totpages_input' value='"+this.GetPages()+(this.EopReached()?"":"+")+"'/>":this.GetPages()+(this.EopReached()?"":"+")) : "")+
                '</span>');
            }
            if (this.navbar_mode.addremove)
              src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_plus"
                , image : (SPTheme.grid_img_navbar_add_rows?SPTheme.grid_img_navbar_add_rows:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_plus.png")
                , image_attr : "no-repeat center center"
                , events : 'onclick="'+global_js_id+'.AddRows(event);"'
                , style : 'vertical-align:middle;border:0;cursor:pointer;'
                , title : this.Translations["Add_rows"]
                , alt : "Add Rows"
                })
              );

            src_array.concat("</td><td nowrap align='right' style=';'>");
            if(this.Eop()) {
              src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_next_dis"
                , image : (SPTheme.grid_img_navbar_next_dis?SPTheme.grid_img_navbar_next_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_next_dis.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , title : this.Translations["Next_page"]
                , alt : "Next page"
                })
              );

              if (this.navbar_mode.firstlast)
                src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_last_dis"
                  , image : (SPTheme.grid_img_navbar_last_dis?SPTheme.grid_img_navbar_last_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_last_dis.png")
                  , image_attr : "no-repeat center center"
                  , style : 'vertical-align:middle;border:0;'
                  , title : this.Translations["Last_page"]
                  , alt : "Last page"
                  })
                );
            }else{
              src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                , className : "grid_next"
                , image : (SPTheme.grid_img_navbar_next?SPTheme.grid_img_navbar_next:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_next.png")
                , image_attr : "no-repeat center center"
                , events : 'onclick="'+global_js_id+'.NextPage();"'
                , style : 'vertical-align:middle;border:0;cursor:pointer;'
                , title : this.Translations["Next_page"]
                , alt : "Next page"
                })
              );
              if (this.navbar_mode.firstlast) {
                if(this.datasource.querycount==-1)
                  src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                    , className : "grid_last_dis"
                    , image : (SPTheme.grid_img_navbar_last_dis?SPTheme.grid_img_navbar_last_dis:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_last_dis.png")
                    , image_attr : "no-repeat center center"
                    , style : 'vertical-align:middle;border:0;'
                    , title : this.Translations["Last_page"]
                    , alt : "Last page"
                    })
                  );
                else
                  src_array.concat(LibJavascript.DOM.buildIcon({type : 'img'
                    , className : "grid_last"
                    , image : (SPTheme.grid_img_navbar_last?SPTheme.grid_img_navbar_last:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_last.png")
                    , image_attr : "no-repeat center center"
                    , events : 'onclick="'+global_js_id+'.LastPage();"'
                    , style : 'vertical-align:middle;border:0;cursor:pointer;'
                    , title : this.Translations["Last_page"]
                    , alt : "Last page"
                    })
                  );
              }
            }
            // if(this.floatRows)
              // src_array.concat("</div></td></tr><");
            // else
            src_array.concat("</td></tr></table></td></tr>");
            if(this.floatRows)
              src_array.concat("</table>"); //Chiude tabella navbar
          }
        }
        if (this.renderTotals && this.Totals && this.datasource.getRecCount()>0){
        //if(!(this.nav_bar=='always') && !(this.nav_bar=='true' && !(this.Eop() && this.Bop()))) {
        //  src_array.concat('<tfoot>');
        //}
          if(this.floatRows){
            src_array.concat('<table>');//tabella totali
          }
          j=0;
          var titles=false;
          for (var temp in this.Totals[this.Totals.length-1]) {
            titles=true;
            break;
          }
          if(titles){
            this.buildOpenTotalsRow(src_array,this.Totals.length-1,true,true);
            this.buildFirstTotalsCells(src_array,this.Totals.length-1,true,true);
            this.buildFieldsTotalsCells(src_array,this.Totals.length-1,true,true);
            if(this.linesCount==1){//colonne finali se tutto in una riga
              this.buildLastTotalsCells(src_array,this.Totals.length-1,true);
            }
          }
          for(j=0; j<this.Totals.length-1;j++){
            this.buildOpenTotalsRow(src_array,j,false);
            this.buildFirstTotalsCells(src_array,j,false);
            this.buildFieldsTotalsCells(src_array,j,false);
            if(this.linesCount==1){//colonne finali se tutto in una riga
              this.buildLastTotalsCells(src_array,j,false);
            }
            src_array.concat('</tr>');
          }
          if(this.floatRows){
            src_array.concat('</table>');
          }
        }
        if((this.datasource.getRecCount()>0) &&((this.nav_bar=='always' || (this.nav_bar=='true' && !(this.Eop() && this.Bop()))) || (this.renderTotals && this.Totals) || (!Empty(this.business_obj) && (this.show_btn_update=='true' || this.show_btn_delete=='true')))){
          if(!this.floatRows) {
            src_array.concat('</tfoot>');
          } else {
            src_array.concat('</div>');//Chiusura navbar e totali
          }
        }
        if(!this.floatRows)
          src_array.concat('</table>');
        src_array.concat("</div>");
        if(this.draggablecolumns){
          src_array.concat('<div id="'+this.ctrlid+'_draggablecolumns_container" class="draggablecolumns_container"></div>');
        }
        var Ctrl=LibJavascript.DOM.Ctrl;
        this.injectHTML(src_array);
        var c //svuoto wrapper di moschina, column e row layer
        if (c=Ctrl(this.ctrlid+'_wrapper')) c.innerHTML='';
        this.attachEvents();
        if(SPTheme.grid_img_filter_by_example && SPTheme.grid_img_filter_by_example.indexOf('{')!=0)
          this.preloadIcons(SPTheme.grid_img_filter_by_example||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_by_example.png");
        if(this.draggablecolumns && ! this.hide_default_titles){
          this.SetupDraggableColumns();
        }
        if(!this.keephiddentoptoolsbar && !ZtVWeb.IsMobile()){
          Ctrl(this.ctrlid+'_tbar_toggler').style.display=''
        }

        if(!ZtVWeb.IsMobile() && (this.scroll_bars=='fixed-titles' || this.scroll_bars=='infinite_scroll')){
          this.gridStartRow=0;
          checkImgsLoaded(document.getElementById('tbl'+this.ctrlid),function(grid){
            return function(){
              grid.buildScrollTable();
            }
          }(this));
          if(this.scroll_bars=='infinite_scroll'){
            this.canscroll=true;
            this.continueScrollLoading();
          }
        }
        this.DisplayGridFilterPortlet();
        this.adjustFormHeight();
        this.dispatchEvent("Rendered");
        //Cancello il portlet di print se c'è il Default Title
        if(this.print_result){
          if (!EmptyString(window[this.form.Zoomtitle])){
            this.printItm.Hide();
          }
        } else if (this.printItm) {
          this.printItm.Hide();
        }
        ZtVWeb.DragDropHtml5.initEvents(this.Ctrl.id);
      }
      //End FillData
      this.AppendData=function(){
        var gridtbl=document.getElementById("tbl"+this.ctrlid);
        var src_array=new LibJavascript.String.Chainer();
        this.gridStartRow+=this.rows;
        var gridrows=this.buildTbody(src_array,this.gridStartRow,this.gridStartRow).toString();
        if(this.floatRows){
          var docFrag=document.createDocumentFragment();
          var docFrag_div = document.createElement("div");
          docFrag.appendChild(docFrag_div);
          docFrag_div.innerHTML=gridrows;
          var nodesLength=docFrag_div.children.length;
          var tFoot=document.getElementById(this.ctrlid+'_footer_row');
          while(docFrag_div.children && docFrag_div.children[0]){
            if(tFoot)
              gridtbl.insertBefore(docFrag_div.children[0], tFoot);
            else
              gridtbl.appendChild(docFrag_div.children[0]);
          }
          docFrag=null;
        }else{
          var tbody = document.createElement('tbody');
          tbody.id = this.ctrlid+'_tbody_'+this.gridStartRow;
          if(tFoot){
            gridtbl.insertBefore(tbody, tFoot);
          }else{
            document.getElementById( "tbl"+this.ctrlid ).appendChild(tbody);
          }
          tbody.innerHTML+=gridrows;
        }
        this.attachEvents();
        this.continueScrollLoading();
      }
      this.continueScrollLoading=function(){
        //Controllo se caricare altri dati
        var scroller= document.getElementById("tbl" + this.ctrlid + "_scroller");
        var grid = document.getElementById("tbl" + this.ctrlid);
        //querycount=-2 quando arriva configurazione di zoom
        var gridContentHeight = 0;
        if(this.floatRows){
          var elements=grid.querySelectorAll(".grid_card_container");
          if(elements.length>0){
            var last=grid.querySelectorAll(".grid_card_container")[grid.querySelectorAll(".grid_card_container").length-1];
            gridContentHeight = (last ? last.offsetTop + last.offsetHeight : 0);
          }
        } else {
          gridContentHeight = grid.offsetHeight;
        }
        if(this_grid.datasource.GetQueryCount()!="-2" && this_grid.canscroll && this.scroll_bars=='infinite_scroll' && (scroller.offsetHeight>=gridContentHeight || this_grid.datasource.nStartRow>this_grid.gridStartRow)){
          if(this_grid.gridStartRow+this_grid.rows < this_grid.datasource.getRecCount() ||  (!(this_grid.datasource.getRecCount() == this_grid.datasource.GetQueryCount() && this_grid.datasource.GetQueryCount()>-1)) ) {
            this_grid.canscroll=false;
            this_grid.NextPage();
          } else {
            this.appendingData=false;
            this.datasource.appendingData=false;
          }
        } else {
          this.appendingData=false;
          this.datasource.appendingData=false;
        }
        this_grid.canscroll=true;
      }
      this.preloadIcons=function(src){
        var img_tmp=document.createElement("img");
        document.body.appendChild(img_tmp);
        img_tmp.src=src;
        img_tmp.style.display='none';
        document.body.removeChild(img_tmp);
      }
      this.buildScrollTable=function(){
        var tbid='tbl'+this.ctrlid;
        var t=document.getElementById(tbid);
        var navbar=document.getElementById('tbl'+this.ctrlid+'_navbar');
        var scroller=document.getElementById("tbl" + this.ctrlid + "_scroller");
        //Sistemazione dei titoli fissi
        if(this.floatRows){
          var tcont=document.getElementById(this.ctrlid+'_titles_cont');
          if(tcont && tcont.children[0]){
            tcont.style.position='absolute';
            tcont.style.top='0px';
            tcont.style.left='0px';
            if(t.childNodes.length>1){
              var h=tcont.clientHeight;
              t.style.marginTop=h+'px';
              var tf=document.getElementById(this.ctrlid+"_footer_row");
              if(tf){
                tf.style.position='absolute';
                t.style.marginBottom=tf.offsetHeight+'px';
                tf.style.bottom='0px';
                tf.style.left='0px';
                tf.style.zIndex=2;
              }
            }
          }
        }else{
          if(t.tHead){
            var th=t.tHead;
            var tb=t.tBodies[0];
            var tf=t.tFoot;
            th.style.marginTop='';
            t.style.marginTop='';
            th.setAttribute('fixed','false');
            var _this=this;
            window.setTimeout(function(){_this.fixTitleTotal();},200);
            LibJavascript.Events.addEvent(window,'resize', function(){_this.queueFixTitleTotal();});
          }
        }
        scroller.addEventListener("scroll",function(){
          if(this_grid.canscroll && this_grid.scroll_bars=='infinite_scroll' && (scroller.offsetHeight + scroller.scrollTop >= (scroller.scrollHeight*95/100))) {
            this_grid.datasource.keepCurRec=true;
            if( this_grid.gridStartRow+this_grid.rows < this_grid.datasource.getRecCount() ||  (!(this_grid.datasource.getRecCount() == this_grid.datasource.GetQueryCount() && this_grid.datasource.GetQueryCount()>-1)) ) {
              this_grid.canscroll=false;
              this_grid.NextPage();
            }
          }
        })
        if(navbar!=null && this.navbarStyle == "stretch" ) navbar.style.width=tb.offsetWidth+'px';

      }
      this._rszFixedTitles=null;
      this.queueFixTitleTotal=function(){
        var _this=this;
        clearTimeout(this._rszFixedTitles)
        this._rszFixedTitles=setTimeout(function(){_this.fixTitleTotal(true);},200)
      }
      this.fixTitleTotal=function(force){
        this.fixTitle(force);
        if(this.renderTotals)
          this.fixTotals(force);
      }
      this.fixTitle=function(force){
        var tbid='tbl'+this.ctrlid;
        var t=document.getElementById(tbid);
        if(!t || !t.tHead) return;
        var th=t.tHead;
        th.style.position='relative';
        if(!force && th.getAttribute('fixed')=='true') return;
        //var thr=th.children[0];
        var thr=document.getElementById(this.ctrlid+"_titles_row");
        var tb=t.children[1];
        var thc,tbc,tbr;
        var i,r,h;
        var a=new Array()
        for(i=0;i<thr.childElementCount;i++){
          a.push(thr.children[i].clientWidth)
        }
        h=thr.children[0].clientHeight
        for(i=0;i<thr.childElementCount;i++){
          thc=thr.children[i]
          thc.style.width=a[i]+'px'
        }
        tbr=tb.children[0];
        for(i=0;i<tbr.childElementCount;i++){
          tbc=tbr.children[i]
          tbc.style.width=a[i]+'px'
        }
        th.style.position='absolute';
        t.style.marginTop=th.offsetHeight+'px';
        th.style.top='0px';
        th.style.width=tb.offsetWidth+'px';
        th.style.zIndex=2;
      }
      this.fixTotals=function(){
        var tbid='tbl'+this.ctrlid;
        var t=document.getElementById(tbid);
        if(!t || !t.tHead) return;
        var tb=t.children[1];
        var th=t.tHead;
        var tf=t.tFoot;
        tf.style.position='relative';
        var thr=document.getElementById(this.ctrlid+"_footer_row");
        var tfr=document.getElementById(this.ctrlid+"_rowTotals0");
        if(tfr==null) return;
        var a=new Array();
        for(var i=0;i<tfr.childElementCount;i++){
          a.push(tfr.children[i].clientWidth)
        }
        for(var i=0;i<tfr.childElementCount;i++){
          tfc=tfr.children[i];
          tfc.style.width=a[i]+'px';
        }
        tf.style.position='absolute';
        t.style.marginBottom=tf.offsetHeight+'px';
        tf.style.bottom='0px';
        tf.style.width=tb.offsetWidth+'px';
        tf.style.zIndex=2;
      }
      this.addScroll = function(){};
      this.buildTbody = function( src_array, start_row, base_recIdx ) {
        if(!start_row)
          start_row = 0;
        if(!base_recIdx)
          base_recIdx = 0;
        var maxRows=this.rows,
            baserec=this.baseRec(),
            nRecs=this.datasource.getRecCount();
        if(this.empty_rows!='true' && maxRows>nRecs-base_recIdx-baserec){
          maxRows=nRecs-base_recIdx-baserec;
        }
        if(maxRows==0){
          src_array.concat("<tr><td align='center' colspan='"+this.colspan+"' class='grid_cell grid_row'><div class='grid_no_data'>"+this_grid.Translations["Empty_data"]+"</div></td></tr>");
          return src_array;
        }
        //this.sum_colspan=true; //(this.nav_bar=='true' || this.nav_bar=='always');
        var recIdx, hasRec, originLinesCount=this.linesCount;
        for(var i=0; i<maxRows; i++){
          recIdx=baserec+i;
          // trova la riga sul cursone dei dati modificati
          hasRec=this.hasRec(base_recIdx + recIdx);
          var memCursPos=0
          if (hasRec && this.sel_fields.length>0){
            memCursPos=this.findCurRowInMemCurs(base_recIdx + recIdx)
          }
          this.rowsToView=[];
          if(this.hide_empty_lines=='true'){
            if(hasRec)this.rowsToView = this.IsVisibleRow(base_recIdx + recIdx);
            this.linesCount=LibJavascript.Array.filter(this.rowsToView,function(v) {return v;}).length;
          }
          this.buildOpenFieldsRow(src_array,start_row + i,base_recIdx + recIdx,hasRec) // <TR
          this.buildFirstRowsCells(src_array,start_row + i,base_recIdx + recIdx,hasRec,memCursPos);
          this.buildFieldsRowsCells(src_array,start_row + i,base_recIdx + recIdx,hasRec,memCursPos);
          if(this.linesCount==1){//colonne finali se tutto in una riga
            this.buildLastRowsCells(src_array,start_row + i,base_recIdx + recIdx,hasRec);
          }
          if(this.floatRows)
            src_array.concat("</tr></table></div>");
          else
            src_array.concat("</tr>");
          this.linesCount=originLinesCount;
          this.sum_colspan=false;
        }
        return src_array
      }
      this.injectHTML = function( src_array ) {
        var s=src_array.toString();
        //log.innerHTML=new Date().getTime();
        //Inserimento html della tabella
        LibJavascript.DOM.Ctrl('tbl_'+this.ctrlid+'_container').innerHTML=s;
      };
      this.LookUpFieldsCells=function(tr){
        if(tr.getAttribute("lookupcells") && parseInt(tr.getAttribute("lookupcells"))){
          var addEvent=LibJavascript.Events.addEvent,
              tds=tr.cells;
          for(var i=0,td; td=tds[i];i++ ){
            if(td.getAttribute("lookup")=="1"){

              addEvent(td, 'mouseover', new Function(global_js_id+'.HoverFilterByExample(arguments[0]||event,"'+td.id+'","'+(td.fldname||td.getAttribute("fldname"))+'")'));
              addEvent(td, 'mouseleave', new Function(global_js_id+'.OutFilterByExample(arguments[0]||event,"'+td.id+'","'+(td.fldname||td.getAttribute("fldname"))+'")'));
              addEvent(td, 'click', new Function(global_js_id+'.ShowFilterByExample(arguments[0]||event,"'+td.id+'","'+(td.fldname||td.getAttribute("fldname"))+'")'));
              if(this.filterBEPosition == 'left')
                addEvent(td, 'mousemove', new Function(global_js_id+'.MagnifyFilterByExample(arguments[0]||event,"'+td.id+'","'+(td.fldname||td.getAttribute("fldname"))+'")'));
            }
          }
          tr.setAttribute("lookupcells",0);
        }
      };
      this.curEditFldCtrl=null
      this.curEditFldColIdx=0
      this.onEditFldFocus=function(ctrl,colIdx){
         window.clearTimeout(this.editfld_timeoutid);
         var col=this.Cols[colIdx]
         //Fisso l'old value
         this.old_edit_val=this.RowValue(clearField(col.field));
         if(col.field.indexOf('checkbox:')>-1)
            this.fld_editing==Strtran(col.field,'checkbox:','');
          else if(col.field.indexOf('combobox:')>-1)
            this.fld_editing==clearField(col.field);
          else
           this.fld_editing=col.field;
         if(ctrl.select)ctrl.select();
         this.curEditFldCtrl=ctrl;
         this.curEditFldColIdx=colIdx;
      }
      this.QueryFilter=function(){
        return this.datasource.queryfilter;
      }
      function get_filterByExample_handler_id(){
        return td_id_prefix+'_filterByExample_handler';
      }
      function get_filterByExample_mask_container_id(){
        return td_id_prefix+'_filterByExample_mask';
      }
      function get_FilterByExample_handler(){
        var Ctrl=LibJavascript.DOM.Ctrl,
          filterByExample_handler_id=get_filterByExample_handler_id(),
          the_handler=Ctrl(filterByExample_handler_id);
        if(!the_handler){
          var iconFont = SPTheme.grid_img_filter_by_example && SPTheme.grid_img_filter_by_example.indexOf("{")>-1 ? JSON.parse(SPTheme.grid_img_filter_by_example) : null;
          if(iconFont){
            ZtVWeb.RequireFont(iconFont.FontName);
          }
          var filterBEPosition = SPTheme.grid_img_filter_by_example_position ? SPTheme.grid_img_filter_by_example_position : 'left';
          function preloadImg(src){
            var img = document.createElement('img');
            img.onload = function(){
              the_handler.setAttribute('handlerImgSize', JSON.stringify({x: this.naturalWidth, y:this.naturalHeight}));
              img.style.width = this.naturalWidth*60/100+'px';
            }
            img.src = src;
            img.setAttribute('filterByExample_handler', "");
            the_handler.querySelector('a').appendChild(img);
          }
          Ctrl(this_grid.ctrlid+'_filterByExample_container').innerHTML=''+
            '<div id="'+filterByExample_handler_id+'" class="filterByExampleHandler '+filterBEPosition+'">'+
              '<input id="'+get_customFilter_root_id()+'_tdId" type="hidden">'+
              '<input id="'+get_customFilter_root_id()+'_fldName" type="hidden">'+
              '<a href="javascript:'+global_js_id+'.ToggleDetailFilterByExample();"></a>'+
            '</div>';//+

          the_handler=Ctrl(filterByExample_handler_id);
          if(iconFont){
            the_handler.querySelector('a').innerHTML = '<span filterByExample_handler style="font-family:'+iconFont.FontName+';font-size:'+parseInt(iconFont.Size)+'px;color:'+iconFont.Color+'; fontWeight:'+iconFont.FontWeight+';">&nbsp;'+String.fromCharCode(iconFont.Char)+'&nbsp;</span>';
            the_handler.setAttribute('handlerImgSize', JSON.stringify({x: iconFont.Size, y:iconFont.Size}));
          } else {
            preloadImg(SPTheme.grid_img_filter_by_example||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_by_example.png");
          }
          this_grid.MakeWrapper();
          var filter_container = Ctrl(get_filterByExample_mask_container_id());
          if (filter_container==null) {
            var grid_wrapper = Ctrl(this_grid.ctrlid+"_wrapper");
            filter_container=document.createElement("div");//container
            filter_container.className="filter_mask_container";
            filter_container.style.position="absolute";
            filter_container.style.display="none";
            filter_container.id=get_filterByExample_mask_container_id();
            grid_wrapper.appendChild(filter_container);
          }
          LibJavascript.Events.addEvent(the_handler, "mouseout", new Function(global_js_id+'.OutFilterByExample(arguments[0]||event,this.getAttribute("tdId"))'));
          if( filterBEPosition == 'left')
            LibJavascript.Events.addEvent(the_handler, "mouseover", new Function(global_js_id+'.MagnifyFilterByExample(arguments[0]||event,this.getAttribute("tdId"))'));
        }
        return the_handler;
      }
			this.fltbyex_show=null
			this.HoverFilterByExample=function(event,tdId,fldName){
			  window.clearTimeout(this.fltbyex_show);
        if (this.filterByExampleMask_IsVisible()) {
					return
				}
				this.fltbyex_show=window.setTimeout(
          function(grid,event,tdId,fldName){
            return function(){
              grid.ShowFilterByExample(event,tdId,fldName);
            }
          }(this,event,tdId,fldName)
        ,300)
		  }
			this.OutFilterByExample=function(event,tdId){
        var to = GetEventDestinationElement(event); //punto di arrivo
        var frm = GetEventSrcElement(event); //sorgente dell'evento
        var handle_id = get_filterByExample_handler_id();
        var td = LibJavascript.DOM.Ctrl(tdId);
        while( to && !(/^BODY/).test(to.tagName) && to.id != handle_id && to.id != tdId) {
          to = to.parentElement;
        };
        /* ciclo che verifica che la sorgente dell'evento differisce dall
         * elemento di arrivo anche nel caso in cui ci sia un overflow dell'handler
        */
        while( frm && !(/^BODY/).test(frm.tagName) && frm.id != handle_id && frm.id != tdId) {
          frm = frm.parentElement;
        }
        // console.log([event.relatedTarget.getAttribute('filterByExample_handler')!=null, to.id == tdId, frm.id != to.id ])
        if((this.filterByExampleHandle_IsVisible() ||
              (GetEventDestinationElement(event)&& GetEventDestinationElement(event).getAttribute('filterByExample_handler')!=null) || //entro nella moschina
              (to && to.id == tdId)) &&  //dalla mochina entro nel td
            (frm && to && frm.id != to.id) //esco dalla moschina ma sono nel suo parent overflow
          )
        {
					return;
				}
     	  window.clearTimeout(this.fltbyex_show);
        if(GetEventSrcElement(event).id!=get_filterByExample_handler_id())
          this._OutFilterByExample(tdId);
  		}
			this._OutFilterByExample=function(tdId){
        if(this.filterByExampleMask_IsVisible()){
          return;
        }
				var filterByExample_handler_id=get_filterByExample_handler_id()
			  var the_handler=document.getElementById(filterByExample_handler_id)
				if (the_handler!=null)
          LibJavascript.CssClassNameUtils.removeClass( the_handler, 'show');
			}
      this.deltaFilterPos = null;
      this.ShowFilterByExample=function(event,tdId,fldName){
        var handler=get_FilterByExample_handler(),
          DOM=LibJavascript.DOM,
          Ctrl=DOM.Ctrl,
          td=Ctrl(tdId);
        if( this.filterByExampleHandle_IsVisible() && handler.getAttribute(tdId) == tdId ){
          return;
        }
        if(!td /*|| !td.firstElementChild*/) return;  //se il mouse passa sopra una cella mentra la grid sta ricaricando, il td non esiste piu' o è vuoto
        var colLayer=LibJavascript.CssClassNameUtils.getElementsByClassName("layer_activator",td,'div'),
          colLayerW=0;
        if(colLayer.length){
          colLayerW=colLayer[0].offsetWidth;
        }

        Ctrl(get_customFilter_root_id()+'_tdId').value=tdId;
        Ctrl(get_customFilter_root_id()+'_fldName').value=fldName;
        this.deltaFilterPos = handler.parentElement.getBoundingClientRect();
        var pos=LibJavascript.DOM.getPosFromFirstRel(td,handler);
        /* moschina sotto */
        if( this.filterBEPosition == 'bottom' ){
          handler.style.top = pos.y + td.offsetHeight +'px';
          handler.style.left = pos.x +'px';
          handler.style.width = td.offsetWidth +'px';
        } else { /* moschina a lato */
          handler.style.top = pos.y +'px';
          handler.style.left = pos.x + td.offsetWidth - colLayerW + 'px';
        }
        LibJavascript.CssClassNameUtils.addClass( handler, 'show');
        handler.setAttribute("tdId",tdId);
        if( this.filterBEPosition != 'bottom' ){
          this.MagnifyFilterByExample(event,tdId,fldName,true);
        }
      }
      this.MagnifyFilterByExample=function(event,tdId,fldName,quick){
        if ( ! this.filterByExampleHandle_IsVisible() ) {
					return
				}
        var DOM = LibJavascript.DOM,
          Ctrl = DOM.Ctrl,
          td = Ctrl(tdId),
          handler = get_FilterByExample_handler(),
          hbr = handler.getBoundingClientRect(),
          originalSize = JSON.parse(handler.getAttribute('handlerImgSize')),
          handlerImg = handler.querySelector("*[filterByExample_handler]"),
          pos = LibJavascript.DOM.getPosFromFirstRel(td,handler);
        // console.log([hbr,JSON.stringify(pos)]);
        if( quick )
          handlerImg.style.transitionDuration = "0s";
        else
          handlerImg.style.transitionDuration = '';
        if( !handlerImg || !LibJavascript.CssClassNameUtils.hasClass(handler,'show'))
          return;
        if( originalSize ){
          if( hbr.left - (event.clientX /* - this.deltaFilterPos.left */) < 50 ){
            if(handlerImg.tagName == 'IMG')
              handlerImg.style.width = originalSize.x+'px';
            else
              handlerImg.style.fontSize = originalSize.x+'px';
          } else {
            if(handlerImg.tagName == 'IMG')
              handlerImg.style.width = originalSize.x*60/100+'px';
            else
              handlerImg.style.fontSize = originalSize.x*60/100+'px';
          }
        }

      }

      var getTdText=function(tdId){
        tdId=LibJavascript.DOM.Ctrl(tdId+'_viewDiv');
        if (tdId)
          return LibJavascript.String.stripTags(tdId.innerHTML).replace(/[\t\n\r\f\v]/g,'');
        else
          return "";
      }

      this.FilterByExample=function(field,operator,expression,tdId){
        if(!IsAny(expression)){
          expression=getTdText(tdId);
        }
        var first_filter = document.getElementById(get_customFilter_root_id()+'_first_filter');
        if(Empty(first_filter) || first_filter.style.display!='none'){ //non aggiungo il filtro se è nascosto
          this.AddFilter(this.MakeFilter(field,operator,expression));
        }
        var res=this.filter_change;
        this.ApplyFilter();
        return res;
      };

      function get_inlineCustomFilterMask(){
        var Ctrl=LibJavascript.DOM.Ctrl,
          customFilter_root_id=get_customFilter_root_id(),
          the_mask=Ctrl(customFilter_root_id);
        if(!the_mask){
          var operators=function() {
            var filterOperatorsCombo='';
            //html per la combo con gli operatori
            for(var j=0,operator,caption; j<this_grid.AvailableOperators.length; j++){
              if(typeof(this_grid.AvailableOperators[j])=='string'){
                operator=this_grid.AvailableOperators[j];
                caption=operator;
              }else{
                operator=this_grid.AvailableOperators[j].op;
                caption=this_grid.AvailableOperators[j].caption;
              }
              filterOperatorsCombo+='<option value="'+operator+'">'+caption+'</option>';
            }
            return filterOperatorsCombo;
          }
          var the_mask_container=Ctrl(get_filterByExample_mask_container_id());
          var link_type=SPTheme.grid_link_type;
          var str='<div class="filter_mask_top" style="cursor:move;" onMouseDown="javascript:ZtVWeb.dragInGrid(event,\''+get_filterByExample_mask_container_id()+'\',\''+this_grid.ctrlid+'\')"></div>'+
            '<div class="filter_mask_content" id="'+customFilter_root_id+'_tbar_filters" style=";">'+
			    '<div style="position:absolute; top:7px; left:15px;"><span class="toplabel">'+this_grid.Translations["Search_filters"]+'</span></div>'+
            '<div style="position:absolute; " class="buttonMaskContainer">'+
          (link_type=="button"?'<input type="button" class="button buttonMask" value="' + this_grid.Translations["Apply_Filters"] +'" onclick="javascript:'+global_js_id+'.FilterByExample_custom('+str_js(customFilter_root_id)+');" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();">'
                : LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_img_filter_apply buttonMask"
                  , image : (SPTheme.grid_img_filter_apply||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filters_apply.png')
                  , style : 'vertical-align:middle;border:0;'
                  , title : this_grid.Translations["Apply_Filters"]
                  , alt : this_grid.Translations["Apply_Filters"]
                  , events: 'onclick="'+global_js_id+'.FilterByExample_custom('+str_js(customFilter_root_id)+');" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();"'
                }))+
          (link_type=="button"?'<input type="button" class="button buttonMask" value="' + this_grid.Translations["Add_Filter"] +'" onclick="javascript:'+global_js_id+'.AddNewFilter();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();">'
                : LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_img_filter_addnew buttonMask"
                  , image : (SPTheme.grid_img_filter_addnew||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filters_add.png')
                  , style : 'vertical-align:middle;border:0;'
                  , title : this_grid.Translations["Add_Filter"]
                  , alt : this_grid.Translations["Add_Filter"]
                  , events: 'onclick="'+global_js_id+'.AddNewFilter();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();"'
                }))+
          (link_type=="button"?'<input id="'+get_customFilter_remove_all_id()+'" type="button" class="button buttonMask" value="' +this_grid.Translations["Remove_Filters"] +'" onclick="javascript:'+global_js_id+'.RemoveAllFilters(true);'+global_js_id+'.ApplyFilter();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();">'
                : LibJavascript.DOM.buildIcon({type : 'img'
                  , id: get_customFilter_remove_all_id()
                  , className : "grid_img_filters_removeall buttonMask"
                  , image : (SPTheme.grid_img_filters_removeall||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filters_removeall.png')
                  , style : 'vertical-align:middle;border:0;'
                  , title : this_grid.Translations["Remove_Filters"]
                  , alt : this_grid.Translations["Remove_Filters"]
                  , events: 'onclick="'+global_js_id+'.RemoveAllFilters(true);'+global_js_id+'.ApplyFilter();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();"'
                }))+
          (link_type=="button"?'<input type="button" class="button buttonMask" value="' + this_grid.Translations["Close"] +'" onclick="javascript:'+global_js_id+'.ToggleDetailFilterByExample();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();">'
                : LibJavascript.DOM.buildIcon({type : 'img'
                  , className : "grid_img_filter_close buttonMask"
                  , image : (SPTheme.grid_img_filter_close||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_mask_closebutton.png')
                  , style : 'vertical-align:middle;border:0;'
                  , title : this_grid.Translations["Close"]
                  , alt : this_grid.Translations["Close"]
                  , events: 'onclick="'+global_js_id+'.ToggleDetailFilterByExample();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();"'
                }))+
            '</div>'+
            '<table cellpadding="0" cellspacing="1" style="position:relative; " class="filter_mask"><thead>'+
              '<tr id="'+customFilter_root_id+'_first_filter">'+
                '<td id="'+customFilter_root_id+'_field_descr" style="width:1px;" >'+
                  '<select id="'+customFilter_root_id+'_field" class="filters_body">'+
                  '</select>'+
                '</td><td style="width:1px;">'+
                  '<select id="'+customFilter_root_id+'_operator" class="filters_body">'+
                    operators()+
                  '</select>'+
                '</td><td style="width:100%">'+
                  '<input id="'+customFilter_root_id+'_expression" class="filters_body" style="width:98%" onkeydown="var keynum;if(window.event){keynum = event.keyCode;}else if(event.which){keynum = event.which;}if(keynum==13){javascript:'+global_js_id+'.FilterByExample_custom('+str_js(customFilter_root_id)+');};event.cancelBubble=true;if(event.stopPropagation) event.stopPropagation();">'+
                '</td><td style="width:1px; text-align:center">'+
                   '<a id="'+customFilter_root_id+'_delete_a" href="javascript:'+global_js_id+".DisableTempFilter('"+customFilter_root_id+"')\";>"+
                      LibJavascript.DOM.buildIcon({type : 'span'
                        , className : "grid_filter_delete"
                        , image : (SPTheme.grid_img_filter_delete?SPTheme.grid_img_filter_delete:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_delete.png")
                        , image_attr : "no-repeat center center"
                        , style : 'vertical-align:middle;border:0;'
                        , title : this_grid.Translations["Remove_Filters"]
                        , alt : "Remove Filters"
                        , id : customFilter_root_id+'_delete_img'
                      })+
                   '</a>'+
                 '</td>'+
              '</tr>'+
              '</thead><tbody id="'+customFilter_root_id+'_tbar_filters_tbody" >'+
              '</tbody>'+
              '</table>'+
              '</div>'+
            '<div class="filter_mask_bottom"></div>' ;
          the_mask_container.innerHTML=str;
          the_mask=Ctrl(customFilter_root_id);
        }
        return the_mask;

      }
      this.filterByExampleMask_IsVisible=function(){
        var filter_mask=LibJavascript.DOM.Ctrl(get_filterByExample_mask_container_id());
        return filter_mask ?  filter_mask.style.display!='none' : false;
      }

      this.filterByExampleHandle_IsVisible=function(){
        var filter_handler=LibJavascript.DOM.Ctrl(get_filterByExample_handler_id());
        return filter_handler ?  LibJavascript.CssClassNameUtils.hasClass( filter_handler, 'show' ) : false;
      }

      this.ToggleDetailFilterByExample=function(domObj,noAdd,fld,colId){
        var customMask=get_inlineCustomFilterMask(),
            DOM=LibJavascript.DOM,
          Ctrl=DOM.Ctrl, i,
          customMask_container=Ctrl(get_filterByExample_mask_container_id());
        if(this.filterByExampleMask_IsVisible()){
          this.Filters=LibJavascript.Array.copy(this.OldFilters);
          customMask_container.style.display='none';
          for(i=0;i<this.Filters.length;){
            if(EmptyString(this.Filters[i].expression)){
              if (!this._removeFilterByIndex(i,true)) i++;
            }else{
              i++;
            }
          }
          var tbodyFilters;
          if(tbodyFilters=Ctrl(get_customFilter_root_id()+'_tbar_filters_tbody'))
            if(tbodyFilters.innerHTML!="")
              this.ToggleFilterAreaByExample();
        }else{
          this.HideColumnLayers();
          this.HideRowLayer();
          this.HideMemoLayer();
          var clone=function (myObj){ //funzione per copia profonda dei filtri
            if(typeof(myObj) != 'object') return myObj;
            if(myObj == null) return myObj;
            var myNewObj = new Object();
            for(var i in myObj)
              myNewObj[i] = clone(myObj[i]);
            return myNewObj;
          };
          this.OldFilters=[];
          for(i=0;i<this.Filters.length;i++)
            this.OldFilters[i]=clone(this.Filters[i]);
          customMask_container.style.display='';
          var aTag = customMask_container, zIndexAssigned=false;
          do {
            if (((parseInt(aTag.style.zIndex||0)))<ZtVWeb.dragObj.zIndex){
              aTag.style.zIndex=ZtVWeb.dragObj.zIndex;
              zIndexAssigned=true;
            }
            aTag=aTag['parentNode'];
          } while(aTag.tagName!='BODY');
          if (zIndexAssigned) ZtVWeb.dragObj.zIndex++;
          var customFilter_root_id=get_customFilter_root_id(),
              tdId=(fld?'':Ctrl(customFilter_root_id+'_tdId').value),
              fldName=fld || Ctrl(customFilter_root_id+'_fldName').value,
              handler=Ctrl(get_filterByExample_handler_id());
          if(domObj && typeof(domObj)=='string')
            handler=Ctrl(domObj);
          else if(domObj && typeof(domObj)=='object')
            handler=domObj;
          var handler_w=handler.offsetWidth,
              handler_left=parseInt(handler.style.left);
          var colIdx=this.findFieldInCols(fldName);
          var notFound=(colIdx==null?true:false);
          var yetFilters=(this.Filters.length>0);
          if(colIdx==null) {
            colIdx = LibJavascript.Array.indexOf(this.Cols,null,function(el) {
              return !isExpr(el.field);
            });
            if (colIdx == -1) {
              colIdx = 0;
            }
          }
          if(colId)
            var col=this.GetColById(colId,true);
          else
            var col=this.Cols[colIdx]
          var get_filterFieldsCombo=function(filterFld){//restituisce l'html OPTIONS per i campi
            var filterFieldsCombo='', found = false,
                j,curFld,fldxIdx,datasource,fields,l;
            for(j=0,datasource=this_grid.datasource,fields=this_grid.Cols,l=fields.length; j<l; j++){
              curFld=fields[j].field;
              if(!isExpr(curFld)){
                curFld=datasource.Fields[datasource.getFldIdx(curFld)];
                if (filterFieldsCombo.indexOf("<option value='"+curFld+"'")==-1)
                  filterFieldsCombo+="<option value='"+curFld+"'"+((filterFld==curFld)?" selected":"")+">"+(fields[j].title!=''?(fields[j].title.length>25?fields[j].title.substring(0,25)+" ...":fields[j].title):fields[j].field)+'</option>';
                if (filterFld==curFld) found=true;
              }
              if (!IsA(fields[j].Layer,'A')) fields[j].Layer=[];
              for(var k=0; k<fields[j].Layer.length; k++){
                curFld=fields[j].Layer[k].field;
                if(!isExpr(curFld)){
                  curFld=datasource.Fields[datasource.getFldIdx(curFld)];
                  if (filterFieldsCombo.indexOf("<option value='"+curFld+"'")==-1)
                    filterFieldsCombo+="<option value='"+curFld+"'"+((filterFld==curFld)?" selected":"")+">"+(fields[j].Layer[k].title!=''?(fields[j].Layer[k].title.length>25?fields[j].Layer[k].title.substring(0,25)+" ...":fields[j].Layer[k].title):fields[j].Layer[k].field)+'</option>';
                  if (filterFld==curFld) found=true;
                }
              }
            }
            for(j=0,datasource=this_grid.datasource,fields=this_grid._rowLayer,l=fields.length; j<l; j++){
              curFld=fields[j].field;
              if(!isExpr(curFld)){
                curFld=datasource.Fields[datasource.getFldIdx(curFld)];
                if (filterFieldsCombo.indexOf("<option value='"+curFld+"'")==-1)
                  filterFieldsCombo+="<option value='"+curFld+"'"+((filterFld==curFld)?" selected":"")+">"+(fields[j].title!=''?(fields[j].title.length>25?fields[j].title.substring(0,25)+" ...":fields[j].title):fields[j].field)+'</option>';
                if (filterFld==curFld) found=true;
              }
            }
            if (!found) filterFieldsCombo+="<option value='"+filterFld+"' selected>"+filterFld+'</option>';
            return filterFieldsCombo;
          };
          Ctrl(customFilter_root_id+'_field_descr').innerHTML='<select id="'+customFilter_root_id+'_field" class="filters_body" '+
          'onchange="'+global_js_id+".SetFilter(null,this.value);"+'">'+
            get_filterFieldsCombo(col.field.toLowerCase())+
          '</select>';//+col.title || fldName;
          var valTd=FromHTML(getTdText(tdId));
          if (Right(valTd,4)==' ...') valTd=Left(valTd,valTd.length-4);
          Ctrl(customFilter_root_id+'_expression').value=valTd;
          if (!Empty(tdId) && (EmptyString(valTd) || (col.type=='N' && valTd=="0"))) // tdId c'è nel caso si filtri da cella (moschina)
            Ctrl(customFilter_root_id+'_operator').value="empty";
          else if (col.type == 'D' || col.type == 'T' || col.type == 'N' || col.type == 'L')
            Ctrl(customFilter_root_id+'_operator').value="=";
          else
            Ctrl(customFilter_root_id+'_operator').value=(
            LibJavascript.Array.indexOf(this.AvailableOperators,"contains",function(el,elcnfrt){ if (typeof(el)=='string') return elcnfrt==el; else return el && el.op==elcnfrt;})>-1?"contains":"=");
          function has_custom_filters(){
            for(var i=0, f; f=this.Filters[i++]; ){
              if(f.visible && !f.fixed){
                return true;
              }
            }
            return false;
          }
          Ctrl(get_customFilter_remove_all_id()).style.display= has_custom_filters.call(this) ? '' : 'none' ;
          //var pos = LibJavascript.DOM.getAbsolutePos(handler);
          //var pos =handler.getBoundingClientRect();
          var pos=LibJavascript.DOM.getPosFromFirstRel(handler,customMask_container);
          if(!domObj)
            customMask_container.style.left= Math.max(pos.x+handler_w-customMask_container.offsetWidth,0)+'px';
          else
            customMask_container.style.left= pos.x+'px';
          customMask_container.style.top=pos.y+'px';
          if(!fld && noAdd && this.Filters.length>0)
            Ctrl(customFilter_root_id+"_first_filter").style.display='none';
          else
            Ctrl(customFilter_root_id+"_first_filter").style.display='';
          this.ToggleFilterAreaByExample();
          Ctrl(customFilter_root_id+'_expression').focus();
          Ctrl(customFilter_root_id+'_expression').select();
        }
      };
      this.RemoveFiltersField=function(field){
      	var fldName;
      	if (typeof(field)=='undefined')
        	fldName=LibJavascript.DOM.Ctrl(get_customFilter_root_id()+'_fldName').value;
       	else
       		fldName=field;
        var i=0,done;
        while(this.Filters.length>i){
          if (this.Filters[i].field.toLowerCase()==fldName.toLowerCase()){
            done=this._removeFilterByIndex(i,true,false);
            if(IsAny(done)){
              if(!done){
                i++;
              }else{
                //readonly
              }
            }else{
              throw new Error('Wrong index '+i+' in '+this.Filters);
            }
          }else{
            i++;
          }
        }
        this.ApplyFilter();
      };
      this.FilterByExample_custom=function(){
        var Ctrl=LibJavascript.DOM.Ctrl,
            prefix_id=get_customFilter_root_id(),
            field=Ctrl(prefix_id+'_field').value,
            operator=Ctrl(prefix_id+'_operator').value,
            expression=Ctrl(prefix_id+'_expression').value;
        var change=this.FilterByExample(field,operator,expression);
        this.RefreshFiltersBar(true,this.ctrlid);
        if (!change)
          this.RefreshFiltersBar(true,prefix_id+'_tbar');
      };

      this.SetupDraggableColumns=function(){
        ZtVWeb.RequireLibrary(ZtVWeb.SPWebRootURL+'/zdnd_grid.js');
        this.DragColumnManager= new Z.DnD.Grid.ColumnSwap.Manager(this);
        var cols_list=new ZtVWeb.LinkedList(),
            n_cols=0,
            hasRec=this.datasource.getRecCount()>0,
            reduced=this.extensible.match(/reduced/);

        for(var i=0,col,id; col=this.Cols[i]; i++){
          if(reduced || col.hidden){
            continue;
          }
          id=col.id;
          cols_list.push({
            idx: i,
            fld: id,
            // id_pref: this.ctrlid+'_cell_'+col.id+'_swap_',
            fld_ref: col
          });
          n_cols++;
          if(hasRec){
            this.DragColumnManager.registerDroplet(new Z.DnD.Grid.ColumnLayer.Droplet(this.get_td_id(i,0), col));
          }
        }
        var list_node =  cols_list.getFirstNode(),
            node_value,
            hml_swapper,
            cell_id,hook_id;
        if(this.renderTitles && !this.floatRows && hasRec){
          while(list_node && list_node.next){
            node_value=list_node.value;
            cell_id=this.ctrlid+'_cell_'+node_value.fld;
            LibJavascript.CssClassNameUtils.addClass( document.getElementById(cell_id), "draggable");
            if(n_cols>1){
              hook_id=this.ctrlid+'_swap_'+node_value.fld+'_drag_hook_right';
              // hml_swapper=document.getElementById(node_value.id_pref+'right');
              // hml_swapper.innerHTML='<div id="'+hook_id+'" style="background-image:url('+(SPTheme.grid_img_column_dragger||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_separator.png')+'); background-repeat:no-repeat; background-position:center; width:16px;" title="'+this.Translations["Move"]+'">&nbsp;</div>';
              // hml_swapper.style.cursor='move';
              this.DragColumnManager.registerDraglet(new Z.DnD.Grid.ColumnSwap.Draglet(cell_id, hook_id, node_value, this.ctrlid+'_draggablecolumns_container'));
            }
            this.DragColumnManager.registerDroplet(new Z.DnD.Grid.ColumnSwap.Droplet(cell_id, node_value));
            list_node=list_node.next;
          }
        }
        if(this.renderRowLayer() && this.Cols.length>1){
          // if(this.renderTitles && !this.floatRows){
          //   this.DragColumnManager.registerDroplet(new Z.DnD.Grid.RowLayer.Droplet(this.ctrlid+'_row_layer_column'));
          // }
          if(hasRec){
            this.DragColumnManager.registerDroplet(new Z.DnD.Grid.RowLayer.Droplet(this.ctrlid+'_row_layer_0'));
          }
        }
      }

      this.ChangeLayout=function(){
        var _this=this;
        window.setTimeout(function(){
          _this.FillData(_this.datasource);
          _this.dispatchEvent("LayoutChanged");
        }, 0);
      }

      this.MoveColumn=function(idx_from,idx_to){//from,to
        if (IsA(idx_from,'U') || IsA(idx_to,'U') || Math.min(idx_from,idx_to)<0 || idx_from==idx_to){
          return;
        }

        var Ctrl=LibJavascript.DOM.Ctrl,
            img_loading = ZtVWeb.SPWebRootURL+'/visualweb/images/loading_small.gif',
            el;
        if(el = Ctrl(this.ctrlid+'_swap_'+this.Cols[idx_from].id+'_drag_hook_right')){
          el.style.backgroundImage='url('+img_loading+')';
        }
        if(el = Ctrl(this.ctrlid+'_swap_'+this.Cols[idx_to].id+'_drag_hook_right')){
          el.style.backgroundImage='url('+img_loading+')';
        }

        var fnc = idx_from<idx_to ? LibJavascript.Array.moveAfter : LibJavascript.Array.moveBefore;
        fnc(this.Cols,idx_from,idx_to);

        this.preserveData=true;
        this.ChangeLayout();
      }

      this.MoveColumnToRowLayer=function(idxcol, idx_row, mode){
        var indexOf = LibJavascript.Array.indexOf,
            Ctrl = LibJavascript.DOM.Ctrl,
            MODES = {
              AFTER: 'AFTER',
              BEFORE: 'BEFORE'
            };

        idx_row = IsA(idx_row,'U') ? this._rowLayer.length : idx_row ;

        mode = IsA(mode,'U') || !(mode.toUpperCase() in MODES) ? MODES.AFTER : MODES[mode.toUpperCase()] ;

        var col=this.Cols[idxcol],
            img_loading = ZtVWeb.SPWebRootURL+'/visualweb/images/loading_small.gif',
            el = Ctrl(this.ctrlid+'_swap_'+col.id+'_drag_hook_right');
        if(el){
          el.style.backgroundImage = 'url('+img_loading+')';
        }
        if (col.orderbyidx!=0){
          this.columnClick(col.id,"minus",this.datasource);
        }
        var move = LibJavascript.Array[ 'move'+(mode==MODES.AFTER ? 'After' : 'Before') ],
            remove = LibJavascript.Array.remove;

        if (col.Layer){
          for(var lay; lay=col.Layer[0];){//quando rimuove lascia sempre l'array che parte da indice 0
            lay = LibJavascript.JSONUtils.adjust(lay, getColSchema());
            this._rowLayer.push(lay);
            remove(col.Layer,0);
          }
        }

        this._rowLayer.push(col);
        move(this._rowLayer, this._rowLayer.length-1, idx_row);

        remove(this.Cols,idxcol);

        this.ChangeLayout();
      }

      this.MoveColumnToColumnLayer=function(colFrom, idx_row, mode, colTo){
        var MODES = {
              AFTER: 'AFTER',
              BEFORE: 'BEFORE'
            },
            Ctrl=LibJavascript.DOM.Ctrl,
            remove=LibJavascript.Array.remove,
            col=this.Cols[colFrom];
        if (col==colTo) return; //si tenta di spostare la colonna nel column layer di se stessa
        if (col.Layer){
          for(var lay; lay=col.Layer[0];){//quando rimuove lascia sempre l'array che parte da indice 0
            lay = LibJavascript.JSONUtils.adjust(lay, getColSchema());
            colTo.Layer.push(lay);
            remove(col.Layer,0);
          }
        }
        if (col.orderbyidx!=0){
          this.columnClick(col.id,"minus",this.datasource);
        }
        idx_row = mode==null || IsA(idx_row,'U') ? colTo.Layer.length : idx_row ;

        mode = mode==null || IsA(mode,'U') || !(mode.toUpperCase() in MODES) ? MODES.AFTER : MODES[mode.toUpperCase()] ;

        var img_loading=ZtVWeb.SPWebRootURL+'/visualweb/images/loading_small.gif',
            el=Ctrl(this.ctrlid+'_swap_'+col.id+'_drag_hook_right');
        if(el){
          el.style.backgroundImage='url('+img_loading+')';
        }

        var move= LibJavascript.Array[ 'move'+(mode==MODES.AFTER ? 'After' : 'Before') ];
        colTo.Layer.push(col);
        move(colTo.Layer, colTo.Layer.length-1, idx_row);
        remove(this.Cols, colFrom);
        this.ChangeLayout();
      }

      this.MoveFromRowLayerToColumn=function(rowLayer_field,column){
        var remove = LibJavascript.Array.remove,
            insert = LibJavascript.Array.insert,
            removed = remove(this._rowLayer, rowLayer_field.idx);

        removed = LibJavascript.JSONUtils.adjust(removed, getColSchema());
        insert(this.Cols, column.idx, removed);

        this.preserveData=true;
        this.ChangeLayout();
      }

      this.MoveFromColumnLayerToColumn=function(columnLayer_field,column){
        var columnLayer = this.GetColById(columnLayer_field.colLayerId).Layer,
            insert = LibJavascript.Array.insert,
            remove = LibJavascript.Array.remove,
            removed = remove(columnLayer, columnLayer_field.idx);

        removed = LibJavascript.JSONUtils.adjust(removed, getColSchema());
        insert(this.Cols, column.idx, removed);

        this.preserveData=true;
        this.ChangeLayout();
      }

      this.MoveRowLayer=function(from_row, to_idx_row, mode){
        var after = mode=='AFTER',
            move = LibJavascript.Array['move'+( after ? 'After' : 'Before')];

        move(this._rowLayer, from_row.idx, to_idx_row);

        var nearTo = this.Layer.nearTo,
            dataIdx = this.Layer.dataIdx;
        this.HideRowLayer();
        this.InvalidateRowLayer();
        this.ShowRowLayer(nearTo,dataIdx);
        this.dispatchEvent("LayoutChanged");
      }

      this.MoveColumnLayer=function(from_row, to_idx_row, mode){
        var after = mode=='AFTER',
            move = LibJavascript.Array['move'+( after ? 'After' : 'Before')],
            columnLayer=this.GetColById(from_row.colLayerId).Layer;

        move(columnLayer, from_row.idx, to_idx_row);

        columnLayer=this.GetColumnLayer(from_row.colLayerId);
        var nearTo=columnLayer.nearTo,
            dataIdx=columnLayer.dataIdx;
        this.HideColumnLayer(from_row.colLayerId);
        this.InvalidateColumnLayer(from_row.colLayerId);
        this.ShowColumnLayer(from_row.colLayerId,nearTo,dataIdx);
        this.dispatchEvent("LayoutChanged");
      }

      this.RemoveToolsBars=function(){
        this.spl_html_toolsbars=[];
        var tbar=document.getElementById(this.ctrlid+'_ToolsbarsContainer');
        if(tbar){
          tbar.innerHTML='';
        }
      }
      this.HideToolsBar=function() {
        var id=this.ctrlid+'_ToolsbarsContainer';
        var d=document.getElementById(id);
        if(d){
          d.style.display='none';
        }

      }
      // this.toggleToolsBarTo = null;
      this.ToggleToolsBar=function(toolsbar_id,nearTo){
        /* la funzione crea la toolbar se non era gia' stata aperta
        * viene impostato un attributo che indica la toolbar aperta
        * toolsbar_id potrebbe essere null se viene chiusa la toolbar in
        * caso di cambio riga (SetCurRec)
        */
        var id=this.ctrlid+'_ToolsbarsContainer'
          , d=document.getElementById(id)
          , actualSelected = toolsbar_id ? Strtran( toolsbar_id, this.ctrlid+'_spk_tools') : null
          , yetopened=false
          , nearTo = document.getElementById(nearTo)
          , _this = this
          , addClass=LibJavascript.CssClassNameUtils.addClass
          , removeClass=LibJavascript.CssClassNameUtils.removeClass
        ;
        var clear = function(){
          /* Funzione che ripristina l'immagine dell'anchor del toolbar layer
          */
          var activeAnchorLayer = document.querySelector("#"+_this.ctrlid+" .grid_layer_anchor_nearTo.active");
          if( activeAnchorLayer ){
            LibJavascript.CssClassNameUtils.removeClass(activeAnchorLayer,"active");
            if(ZtVWeb.IsMobile()){
              activeAnchorLayer.style.backgroundImage = SPTheme.grid_img_tbarLayer_closed ? SPTheme.grid_img_tbarLayer_closed : document.getElementById(this.activetblayer).style.backgroundImage.src.replace(/_open_(down|up)_(left|right)/,"");
            }else{
              //ripristina l'immagine di layer
              var img = activeAnchorLayer.getElementsByTagName("IMG")[0];
              if(img)
                img.src= SPTheme.grid_img_tbarLayer_closed || img.src.replace(/_open__(left|right)/,"");
              else {
                img = activeAnchorLayer.getElementsByTagName("a")[0];
                removeClass(img, "grid_img_tbarLayer_opened_left");
                removeClass(img, "grid_img_tbarLayer_opened_right");
                addClass(img, 'grid_img_tbarLayer_closed');
              }
            }
          }
        }
        if(!d){
          d=document.createElement('div');
          d.id=id;
          d.className = "grid_toolbar_layer";
          d.style.display='none';
          d.style.position="abolsute"
          document.getElementById("tbl_"+this.ctrlid+"_container").appendChild(d);
          if( ZtVWeb.IsMobile() ){
            if(!this.floatRows)
              var scroller = document.getElementById("tbl"+this.ctrlid+"_mootable_scroller");
            else
              var scroller = document.getElementById("tbl"+this.ctrlid+"_scroller");
            /* per far spostare la toolbar con il contenuto nella griglia mobile che ha
            * il contenuto scrollabile indipendentemente dai thead
            */
            if(scroller)
              scroller.addEventListener("scroll", function(){
                d.style.top = ( d.getAttribute("SPSpkLayerTop") - scroller.scrollTop) + "px";
                d.style.left = ( d.getAttribute("SPSpkLayerLeft") - scroller.scrollLeft) + "px";
              });
        }
          }
        //creazione della toolbar
        /* actualSelected potrebbe essere null in caso di chiusura forzata
        */
        if( actualSelected && d.getAttribute("SPSplLayerIdx") != actualSelected ){ //apro un nuovo layer
          d.innerHTML = (ZtVWeb.IsMobile() ? '<div class="pin"></div>':"") + this.buildSplinkerLayer(actualSelected);
          clear(); //ripristina l'immagine dell'anchor precedentemente "aperta"
          if(nearTo){
            LibJavascript.CssClassNameUtils.addClass( nearTo, "active");
            this.placeTbar( d, nearTo ); //funzione ridefinita in visualweb.mobile
          }
          d.setAttribute("SPSplLayerIdx",actualSelected);
          this.HideRowLayer();
          this.HideColumnLayers();
          this.HideMemoLayer();
          this.HideFieldList();
          this.HideOrderbyList();
          this.activetoolbar = true;
          // d.style.display=''; gia' fatto nella placeTbar
        }else{
          if(d.style.display!='none'){
            d.style.display = "none";
            d.removeAttribute("SPSplLayerIdx");
            d.innerHTML = "";
            clear();
            this.activetoolbar = false;
          }
        }
      }
      this.placeTbar=function( tbar, nearTo ){
        var img=nearTo.getElementsByTagName('IMG')[0]
          //, pos={x:nearTo.getBoundingClientRect().left-document.getElementById("tbl_"+this.ctrlid+"_container").getBoundingClientRect().left, y:nearTo.getBoundingClientRect().top-document.getElementById("tbl_"+this.ctrlid+"_container").getBoundingClientRect().top}
          , posObj=LibJavascript.DOM.getPosFromFirstRel(nearTo,tbar)
          , pos={x:posObj.x, y:posObj.y}
          , rAlign=this.splinker_pos.match(/right/)
          , addClass=LibJavascript.CssClassNameUtils.addClass
          , removeClass=LibJavascript.CssClassNameUtils.removeClass
        ;
        tbar.style.display='';
        tbar.style.zIndex=100;
        if(img)
          img.src=SPTheme["grid_img_tbarLayer_opened_"+( rAlign ? "left" : "right" )] || img.src.replace(/tools\.gif/,"tools_open_"+( rAlign ? "left" : "right" )+".gif");
        else {
          img=nearTo.getElementsByTagName('a')[0]
          if(SPTheme["grid_img_tbarLayer_opened_"+( rAlign ? "left" : "right" )]) {
            addClass(img, "grid_img_tbarLayer_opened_"+( rAlign ? "left" : "right" ));
            removeClass(img, 'grid_img_tbarLayer_closed');
          }
        }
        if ( rAlign ) {
          tbar.style.left=(-tbar.offsetWidth+pos.x)+'px';
        } else {
          tbar.style.left=(pos.x+nearTo.offsetWidth)+'px';
        }
        //pos.y=pos.y+ (topPos ? padding :img.offsetHeight/2+10)-nearTo.offsetHeight/2;
        pos.y=pos.y+ nearTo.offsetHeight/2-tbar.offsetHeight/2;
        if ( pos.y < 0 ){
          pos.y = 0;
        }
        if ( pos.y + tbar.offsetHeight > this.Ctrl.offsetHeight ){
          pos.y = this.Ctrl.offsetHeight - tbar.offsetHeight;
         }
        tbar.style.top =pos.y+'px';
      };

      this.HoverRowLayer=function(id, dataIdx){
        this.GetRowLayer().Hover(id,dataIdx);
      }
      this.ToggleRowLayer=function(id, dataIdx){
        var l=this.GetRowLayer();
        if(l.Visible() || !l.pinned){
          this.ShowRowLayer(id, dataIdx);
        }else{
          this.HideRowLayer();
        }
      }
      this.ShowRowLayer=function(id, dataIdx){
        this.GetRowLayer().Show(id, dataIdx);
      }
      this.HideRowLayer=function(){
        if(this.Layer)
          this.GetRowLayer().Hide();
      }

      this.ShowColumnLayer=function(colId, cellId, dataIdx){
        this.GetColumnLayer(colId).Show(cellId, dataIdx);
      }
      this.HideColumnLayers=function(){
        for(var i=0,col; col=this.Cols[i]; i++){
          if(!EmptyArray(col.Layer)){
            this.GetColumnLayer(col.id).Hide();
          }
        }
      }

      this.ShowMemoLayer=function(colId, cellId, dataIdx){
        this.GetMemoLayer(colId).Show(cellId, dataIdx);
      }
      this.HideMemoLayer=function(){
        for(var i=0,col; col=this.Cols[i]; i++){
          if (col.type=="M")
            this.GetMemoLayer(col.id).Hide();
        }
      }

      this.HideColumnLayer=function(colId){
        this.GetColumnLayer(colId).Hide();
      }
      this.HoverColumnLayer=function(colId, cellId, dataIdx){
        this.GetColumnLayer(colId).Hover(cellId,dataIdx);
      }
      this.HideMemo=function(colId){
        this.GetMemoLayer(colId).Hide();
      }
      this.HoverMemo=function(colId, cellId, dataIdx){
        this.GetMemoLayer(colId).Hover(cellId,dataIdx);
      }

      this.ToggleMemoLayer=function(event, colId, cellId, dataIdx){
        var l=this.GetMemoLayer(colId);
        if(l.Visible() || !l.pinned){
          this.ShowMemoLayer(colId,cellId,dataIdx);
        }else{
          this.HideMemoLayer(colId);
        }
        var evt=event||window.event;
        if(evt.cancelBubble!=null){
          evt.cancelBubble=true;
        }else if(evt.stopPropagation!=null){
          evt.stopPropagation();
        }
      }

      this.ToggleColumnLayer=function(event, colId, cellId, dataIdx){
        var l=this.GetColumnLayer(colId);
        if(l.Visible() || !l.pinned){
          this.ShowColumnLayer(colId,cellId,dataIdx);
        }else{
          this.HideColumnLayer(colId);
        }
        var evt=event||window.event;
        if(evt.cancelBubble!=null){
          evt.cancelBubble=true;
        }else if(evt.stopPropagation!=null){
          evt.stopPropagation();
        }
      }

      this.UpdateCurRec=function(datasource){
        this.curRec=datasource.curRec
        this.FillData(datasource)
      }

      this.getRecRow=function(nRec){
        return document.getElementById(this.ctrlid+'_row'+nRec);
      }
      this.getCurrRecRow=function(){
        return this.getRecRow(this.curRec-1);
      }

      this.SetCurRec=function(newCurRec,fromrowclick){
        var oldCurRec=this.datasource.curRec;
        if(oldCurRec!=newCurRec){
          this.CloseChildsRow();
          this._CloseRow();
        }
        if(oldCurRec!=newCurRec && this.openRowRel==-1){
          if (fromrowclick && this.openRow!=-1 ){
            this.movingfocus=true;
            var res=this.checkEditInput(oldCurRec-1,this.curEditFldCtrl,this.curEditFldColIdx)
            if (!res) {
              var _this=this;
              // se il fuoco si era perso senza andare in un altro campo, bisogna azzerare la variabile che segnala il ritorno al campo il cui check e' fallito
              window.setTimeout(function(){_this.curEditFldCtrl.focus();_this.movingfocus=false;},100);
              return;
            }
            this.movingfocus=false;
          }
          var addClass=LibJavascript.CssClassNameUtils.addClass,
              removeClass=LibJavascript.CssClassNameUtils.removeClass,
              Ctrl=LibJavascript.DOM.Ctrl,
              baserec,
              newRecMark;
          this.HideRowLayer();
          this.HideColumnLayers();
          this.HideMemoLayer();
          if(this.activetoolbar){
            this.ToggleToolsBar();
          }
          if(this.activeOrderByList)
            this.toggleOrderbyList(null,this.activeOrderByList.id,this.activeOrderByList.index);
          if(fromrowclick){
            this.dispatchEvent('BeforeRowChange_Click',oldCurRec,newCurRec);
          }
          this.dispatchEvent('BeforeRowChange',oldCurRec,newCurRec);
          if (this.lockChangeRow) {
            this.lockChangeRow=false;
            return;
          }
          this.datasource.curRec=newCurRec;
          if(fromrowclick){
            this.dontupdate=true;
          }
          this.datasource.refreshConsumers(false);
          baserec=this.baseRec();
          this.dontupdate=false;
          if(this.recMark=='true'){
            if(fromrowclick){
              Ctrl(this.ctrlid+'_rek'+(oldCurRec-baserec-1)).innerHTML =  LibJavascript.DOM.buildIcon({
                type : 'img'
              , className : "grid_img_recMark"
              , image : (SPTheme.grid_img_recMark?SPTheme.grid_img_recMark:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_recMark.png")
              , image_attr : "no-repeat center center"
              , style : 'vertical-align:middle;border:0;'
            });
            }
            newRecMark=Ctrl(this.ctrlid+'_rek'+(newCurRec-baserec-1));
            addClass(newRecMark, 'grid_record_mark_sel');
            newRecMark.innerHTML = LibJavascript.DOM.buildIcon({
                type : 'img'
              , className : "grid_img_recMark_sel"
              , image : (SPTheme.grid_img_recMark_sel?SPTheme.grid_img_recMark_sel:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_recMark.png")
              , image_attr : "no-repeat center center"
              , style : 'vertical-align:middle;border:0;'
            })
          }
          var base_tr_id=this.ctrlid+'_row'+(oldCurRec-baserec-1), i, tr, tr_id_sub;
          if(fromrowclick){
            removeClass(Ctrl(base_tr_id), this.class_row_selected);
            for(i=1,tr_id_sub=base_tr_id+'_sub_'; tr=Ctrl(tr_id_sub+i); i++){
              removeClass(tr, this.class_row_selected);
            }
          }
          base_tr_id=this.ctrlid+'_row'+(newCurRec-baserec-1);
          addClass(Ctrl(base_tr_id), this.class_row_selected);
          for(i=1,tr_id_sub=base_tr_id+'_sub_'; tr=Ctrl(tr_id_sub+i); i++){
            addClass(tr, this.class_row_selected);
          }
          if(fromrowclick){
            this.dispatchEvent('AfterRowChange_Click',newCurRec,oldCurRec);
          }
          this.dispatchEvent('AfterRowChange',newCurRec,oldCurRec);
        }
        if(this.draggable_row=='true'){
          if(!Empty(this.GetSelectedDataAsTrsString()))
            this.DraggerObj={'formid': this.form.formid,'name': this.name,'value':this.GetSelectedDataAsTrsString()};
          else
            this.DraggerObj={'formid': this.form.formid,'name': this.name,'value':this.datasource.rs};
        }
      }
      this.Eof=function(){ // Ultima pagina
        if(typeof(this.datasource.root) =='undefined') { // SQLDataProvider
          var tempRow=this.datasource.getRecCount();
          if(this.datasource.eof && (this.curRec > (tempRow-this.rows))){
            return true
          }else{
            return false
          }
        } else { //XMLDataProvider
          return (this.datasource.curRec+this.rows>this.datasource.getRecCount());
        }
      }
      this.Bof=function(){ // Primo record
        if(typeof(this.datasource.root) =='undefined') { // SQLDataProvider
          if(this.datasource.Bof() && this.curRec==1){
            return true
          }else{
            return false
          }
        } else { //XMLDataProvider
          return this.datasource.Bof();
        }
      }
      this.GetPages=function(){
        return Math.max(1,Math.ceil(this.datasource.getAllRecsCount()/this.rows))
      }
      this.GetCurPage=function(){
        return Math.ceil(this.datasource.getGlobalCurRec()/this.rows)
      }
      this.EopReached=function(){
        return this.datasource.getEofReached()
      }
      this.Eop=function(){ //End of pages
        return(this.GetCurPage()>=this.GetPages() && this.EopReached())
      }
      this.Bop=function(){ //Begin of pages
        return this.GetCurPage()==1
      }
      this.NextPage=function(){
        var rows=this.rows
        var changed=false
        this.preserveData=true;
        this._CloseRow();
        if(this.scroll_bars=='infinite_scroll'){
           this.appendingData=true;
           this.datasource.appendingData=true;
        }
        if(typeof(this.datasource.root)=='undefined'){ //SQLDataProvider
          if(this.appendingData){
            if(this.datasource.getRecCount() <= this.gridStartRow+this.rows) {
              this.dispatchEvent('BeforeRowChange',this.curRec,1);
              this.datasource.NextPage();
              this.dispatchEvent('AfterRowChange',this.curRec,1);
            }else{
              //this.gridStartRow+=this.rows;
              this.FillData();
            }
          }else{
            if(Math.ceil(this.curRec/rows)==Math.ceil(this.datasource.getRecCount()/rows)){
              this.dispatchEvent('BeforeRowChange',this.curRec,1);
              if(!this.datasource.NextPage()){
                this.SetCurRec(this.curRec)
              }
              this.dispatchEvent('AfterRowChange',this.curRec,1);
            }else{
              this.SetCurRec(Math.floor(((this.curRec+rows)-1)/rows)*rows+1)
            }
          }
          if(this.datasource.Bof()) this.startRows++;
        } else { //XMLDataProvider
          if(this.datasource.curRec+this.rows<=this.datasource.GetQueryCount()){
            this.datasource.curRec+=this.rows;
            changed=true
          }
          else if(!this.datasource.eof && this.datasource.curRec+this.rows!=this.datasource.GetQueryCount()){
            this.datasource.curRec=this.datasource.GetQueryCount()
            changed=true
          }
          this.datasource.refreshConsumers(false);
        }
        if(parent.effectOpenClose) parent.effectOpenClose(this.form.portletname+"_portlet.jsp",true)
        return(changed)
      }
      this.PrevPage=function(){
        var rows=this.rows
        var changed=false
        this.preserveData=true;
        this._CloseRow();
        if(typeof(this.datasource.root)=='undefined') { //SQLDataProvider
          if (this.curRec>rows){
            this.SetCurRec( Math.floor(((this.curRec-rows)-1)/rows)*rows+1)
          }else {
            if(this.curRec!=1 || !this.datasource.Bof()){
              //this.atEndRender='prevpage'
              this.datasource.atQueryEnd="lastpage "+rows
              this.CloseChildsRow();
              this.dispatchEvent('BeforeRowChange',this.curRec,1);
              this.datasource.PrevPage();
              this.dispatchEvent('AfterRowChange',this.curRec,1);
              changed=true
            }
          }
        } else { //XMLDataProvider

          if(this.datasource.curRec-rows<1)
            this.datasource.curRec=1;
          else {
            this.datasource.curRec-=rows;
            changed=true
          }
          this.datasource.refreshConsumers(false);

        }
        if(parent.effectOpenClose) parent.effectOpenClose(this.form.portletname+"_portlet.jsp",true)
        return(changed)
      }
      this.selector_keydown=function(e){
        var keyCode
        if (navigator.userAgent.toLowerCase().indexOf('msie')!=-1)
          keyCode=window.event.keyCode
        else
          keyCode=e.which
        if(keyCode==13) LibJavascript.DOM.Ctrl(this_grid.ctrlid+"_PageSelector").onblur()
      }
      this.GoToPage=function() {
        this.preserveData=true;
        var input = LibJavascript.DOM.Ctrl(this_grid.ctrlid+"_PageSelector");
        var page=parseInt(input.value,10);
        if (isNaN(page) || page<1) {
          input.value=this_grid.GetCurPage();
          input.focus();
          input.select();
          return;
        }
        if (page!=this_grid.GetCurPage()){
          var rows=this_grid.rows;
          var curRec = this_grid.curRec=rows*parseInt((page-1),10)+1;
          this.dispatchEvent('BeforeRowChange',this.curRec,1);
          this_grid.datasource.GoToPage(this_grid.curRec);
          this.dispatchEvent('AfterRowChange',this.curRec,1);
          if(curRec>this_grid.datasource.getAllRecsCount()) {
            this_grid.LastPage()
            return;
          }
          curRec=curRec-(this_grid.datasource.nStartRow||0);
          this_grid.SetCurRec(curRec)
        }
        this.preserveData=false;
      }
      this.FirstPage=function(){
        this.preserveData=true;
        this._CloseRow();
        this.dispatchEvent('BeforeRowChange',this.curRec,1);
        this.datasource.FirstPage()
        this.dispatchEvent('AfterRowChange',this.curRec,1);
      }
      this.LastPage=function(){
        this.preserveData=true;
        if(typeof(this.datasource.root)=='undefined'){ //SQLDataProvider
          this._CloseRow();
          this.datasource.atQueryEnd="lastpage "+this.rows;
          this.dispatchEvent('BeforeRowChange',this.curRec,1);
          this.datasource.LastPage()
          this.dispatchEvent('AfterRowChange',this.curRec,1);
        }else{//XMLDataProvider
          while(!this.datasource.Eof()){
            this.NextPage()
          }
        }
      }
      this.NextRecord=function(){
        this.datasource.Next();
      }
      this.PrevRecord=function(){
        this.datasource.Prev();
      }
      this.AddRows=function(event){
        var rows=this_grid.rows+this_grid.rowsToAdd;
        var mult=this_grid.datasource.nRows/this_grid.rows;
        var actual=this_grid.datasource.getGlobalCurRec();
        if (typeof(this_grid.datasource.nRows)!='undefined') {
          this_grid.datasource.nRows=this_grid.datasource.nRows+this_grid.rowsToAdd*mult;
          this_grid.datasource.nStartRow=(Math.ceil(actual/this_grid.datasource.nRows)-1)*this_grid.datasource.nRows;
        }
        this_grid.rows=rows;
        this_grid.datasource.curRec=actual-(this_grid.datasource.nStartRow||0);
        this_grid.preserveData=true;
        this_grid.datasource.keepCurRec=true;
        this_grid.Refresh();
        this_grid.dispatchEvent('RowsChanged',rows);
      }
      this.RemoveRows=function(){
        var rows=Math.max(this_grid.rows-this_grid.rowsToAdd,1);
        var mult=this_grid.datasource.nRows/this_grid.rows;
        var actual=this_grid.datasource.getGlobalCurRec();
        if (typeof(this_grid.datasource.nRows)!='undefined') {
          this_grid.datasource.nRows=this_grid.datasource.nRows-this_grid.rowsToAdd*mult;
          if(this_grid.datasource.nRows<=0) this_grid.datasource.nRows=mult;
          this_grid.datasource.nStartRow=(Math.ceil(actual/this_grid.datasource.nRows)-1)*this_grid.datasource.nRows;
        }
        this_grid.rows=rows;
        this_grid.datasource.curRec=actual-(this_grid.datasource.nStartRow||0);
        this_grid.datasource.keepCurRec=true;
        this_grid.preserveData=true;
        this_grid.Refresh();
        this_grid.dispatchEvent('RowsChanged',rows);
      }
      /// Definisce i titoli della tabella da visualizzare
      this.ColumnTitles=function(clmntitles){
        var titles;
        if(IsA(clmntitles,'A'))
          titles=[].concat(clmntitles);
        else if(IsA(clmntitles,'C')){
          titles=clmntitles.split(',');
        }
        var Cols_tmp=[];//Array con tutte le colonne anche layer
        for(var c=0;c<this.Cols.length;c++ ){
          Cols_tmp.push(this.Cols[c]);
          if(this.Cols[c].Layer){
            for(var cc=0;cc<this.Cols[c].Layer.length;cc++ ){
              Cols_tmp.push(this.Cols[c].Layer[cc]);
            }
          }
        }
        var tot_length=Cols_tmp.length;
        for(var i=0;i<titles.length;i++ ){
          if(i>=tot_length)
            this.Cols.push(LibJavascript.JSONUtils.adjust({title:titles[i],field:''},getColSchema()));
          else
            Cols_tmp[i].title=titles[i];
        }
        if(!EmptyString(titles.join('')))
          this.renderTitles=true;
        else
          this.renderTitles=false;
        return titles;
      }
      // Definisce i campi della query da visualizzare
      this.ColumnFields=function(clmnfields){
        if(IsA(clmnfields,'A'))
          this.SetFields([].concat(clmnfields));
        else if(IsA(clmnfields,'C'))
          this.SetFields(clmnfields.split(','));
        return clmnfields;
      }
      this.SetPictures=function(arr){
        var pictures=arr;
        if(IsA(arr,'A'))
          pictures=arr;
        else
          pictures=arr.split(',');
        for(var j=0;j<this.Cols.length;j++){
          this.Cols[j]['picture']=Strtran(Strtran(pictures[j],'$|$',','),'|',',');
        }
        //this.setStructures();
      }
      this.SetFields=function(arr){
        var fields;
        if(IsA(arr,'A'))
          fields=arr;
        else
          fields=arr.split(',');
        var Cols_tmp=[];//Array con tutte le colonne anche layer
        for(var c=0;c<this.Cols.length;c++ ){
          Cols_tmp.push(this.Cols[c]);
          if(this.Cols[c].Layer){
            for(var cc=0;cc<this.Cols[c].Layer.length;cc++ ){
              Cols_tmp.push(this.Cols[c].Layer[cc]);
            }
          }
        }
        var tot_length=Cols_tmp.length;
        for(var i=0;i<fields.length;i++ ){
          if(i>=tot_length)
            this.Cols.push(LibJavascript.JSONUtils.adjust({field:fields[i]},getColSchema()));
          else{
            //this.Cols[i].field=fields[i];
            Cols_tmp[i].field=fields[i];
          }
        }
        if(fields.length<tot_length){
          var toRemove=tot_length-fields.length;
          while(toRemove>0){
            if(this.Cols[this.Cols.length-1].Layer && this.Cols[this.Cols.length-1].Layer.length>0){
              this.Cols[this.Cols.length-1].Layer.pop()
            }else{
              this.Cols.pop();
            }
            toRemove--;
          }
          //this.Cols.splice(fields.length,tot_length-fields.length);
        }
      }
      this.SetTitles=function(arr){
        var titles
        if(IsA(arr,'A'))
          titles=arr;
        else
          titles=arr.split(',');
        for(var j=0;j<this.Cols.length;j++){
          this.Cols[j]['title']=titles[j];
        }
        //this.setStructures();
      }
      this.DropTitles=function(){
        this.SetTitles(new Array());
        this.renderTitles=false;
      }
      this.Refresh=function(keep){
				this.datasource.keepCurRec=(keep?true:false);
        if(this.scroll_bars=='infinite_scroll'){
          this.datasource.Query();
        }else
          this.datasource.Query(true);
      }
      //funzioni per layer di colonna
      this.SetColumnLayer=function(fldName, cl){//nome del campo con layer
        var idx=LibJavascript.Array.indexOf(this.Cols, fldName, function(e1,e2){
          return e1['field'].toLowerCase()==e2.toLowerCase();
          //return e1.toLowerCase()==e2.toLowerCase();
        });
        if(idx==-1){
          return;
        }
        var col=this.GetColByIdx(idx);
        //caption_1:field_1,caption_2:field_2,caption_3:field_3
        if(IsA(cl,'U')){
          return col.Layer;
        }
        if(IsA(cl,'C')){
          var cols=[];
          cl=cl.split(',');
          for(var i=0,l=cl.length,cf; i<l; i++){
            //caption:field:picture (ultimo opzionale)
            cf=cl[i];
            cf = cf.indexOf(':')>-1 ? cf.split(':') : ['',cf];
            cols.push({'field':cf[1],'title':cf[0],'picture':eval(cf[2]||'""')})
          }
          col.Layer=[];
          col.Layer = LibJavascript.JSONUtils.adjust(cols, getColSchema());
        }else if(IsA(cl,'A')){
          var copy=LibJavascript.Array.copy;
          col.Layer=copy(cl);
        }
        return col.Layer;
      }
      this.GetColumnLayerFields=function(fldName){//nome del campo con layer
        var idx=LibJavascript.Array.indexOf(this.Cols, fldName, function(e1,e2){
          return e1['field'].toLowerCase()==e2.toLowerCase();
        });
        if(idx==-1){
          return [];
        }
        var col=this.GetColByIdx(idx);

        var fields=[];
        for(var i=0,cl; cl=col.Layer[i]; i++){
          fields.push(cl.field);
        }
        return fields;
      }
      this.GetColumnLayerCaptions=function(fldName){//nome del campo con layer
        var idx=LibJavascript.Array.indexOf(this.Cols, fldName, function(e1,e2){
          return e1['field'].toLowerCase()==e2.toLowerCase();
        });
        if(idx==-1){
          return [];
        }
        var col=this.GetColByIdx(idx);

        var captions=[];
        for(var i=0,cl; cl=col.Layer[i]; i++){
          captions.push(cl.title);
        }
        return captions;
      }
      this.GetColumnLayerObj=function(fldName){//nome del campo con layer
        var idx=LibJavascript.Array.indexOf(this.Cols, fldName, function(e1,e2){
          return e1['field'].toLowerCase()==e2.toLowerCase();
        });
        if(idx==-1){
          return;
        }
        return this.GetColByIdx(idx);
      }

      this.GetRowLayerFields=function(){
        var fields=[];
        for(var i=0,col; col=this._rowLayer[i]; i++){
          fields.push(col.field);
        }
        return fields;
      }
      this.GetRowLayerCaptions=function(){
        var captions=[];
        for(var i=0,col; col=this._rowLayer[i]; i++){
          captions.push(col.title);
        }
        return captions;
      }
      var forceRowLayerColumn=false;
      this.forceRowLayerColumn=function(force){
        var res=forceRowLayerColumn;
        if(arguments.length)
          forceRowLayerColumn=force;
        return res;
      }
      this.renderRowLayer=function(){
        return !EmptyArray(this._rowLayer) || this.forceRowLayerColumn();
      }
      /// Definisce quali pulsanti per l'splinker
      var action_identifier_re=/[\+-]?[nevdp]/gi;
      this.SetSPLinkerActions=function(actions){
        if(!IsA(actions,'C')) return void(0);
        var tokens=actions.match(action_identifier_re);
        if(tokens!=null){
          for(var i=0,t; t=tokens[i++];){
            this.SPLinkerActions[t.charAt(t.length-1).toUpperCase()]= new Boolean(t.charAt(0)!='-');
          }
        }
        return this.SPLinkerActions;
      }
      if(this.splinker.indexOf(' -')>-1) {
        this.SetSPLinkerActions(this.splinker.substring(this.splinker.indexOf('-')));
        this.splinker=this.splinker.substring(0,this.splinker.indexOf('-')-1);
      }

      this.SetExtensibleFields=function(p_cExtensionFields){
        var extFields=p_cExtensionFields.split(',');
        for(var i=0;i<this.Cols.length;i++){
          for(var ii=0;ii<extFields.length;ii++){
            if(extFields[ii]==this.Cols[i].field)
              this.Cols[i].inExtGrid=1;
          }
        }
      }
      this.IsExtended=function(){
        return !!this.extensible.match(/extended/);
      }
      this.IsExtensible=function(){
        return !this.extensible.match(/false/i);
      }
      this.ExpandOReduce=function(){
        var extended=this.IsExtended();
        this[(extended ? 'Reduce' : 'Extend')+'Grid']();
      }

      this.GetExpandReduceImage=function(expand) {
        if (expand) {
          return SPTheme.grid_img_title_reduce_grid||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_right2left.png";
        } else {
          return SPTheme.grid_img_title_extend_grid||ZtVWeb.SPWebRootURL+"/visualweb/images/grid_left2right.png";
        }
      }
      this.SetExpanded=function(expand){
        this.extensible=(expand?'open-extended':'open-reduced');
        var itm=this.TopToolsbar.GetItem('expandoreduce_itm');
        if(itm){
          itm.SetImg(this.GetExpandReduceImage(expand));
          itm.SetTitle(expand ? this.Translations["Reduce_grid"]||'Reduce grid' : this.Translations["Expand_grid"]||'Expand grid');
        }
      }
      this.ExtendGrid=function(){
        this.SetExpanded(true);
        if (this.datasource)
          this.FillData(this.datasource);
        this.dispatchEvent("ExtendedGrid");
      }

      this.ReduceGrid=function(){
        this.SetExpanded(false);
        if (this.datasource)
          this.FillData(this.datasource);
        this.dispatchEvent("ReducedGrid");
      }

      this.HideTopToolsbarToggler=function(){
        //this.TopToolsbarToggler_managedByCode=true;
        this.TopToolsbarContainer().style.display='none';
      }
      this.ShowTopToolsbarToggler=function(){
        //this.TopToolsbarToggler_managedByCode=true;
        if(!this.TopToolsbarTogglerLocked) { //usato da superzoom (SPPortalZoom.js)
          this.TopToolsbarContainer().style.display='';
          LibJavascript.CssClassNameUtils.replaceClass(LibJavascript.DOM.Ctrl(this.ctrlid+"_tbar_toggler"),"ttbar_hidden","ttbar_visible");
          this.adjustFormHeight();
        }
      }
      this.ToggleTopToolsbar=function(){
        if(this.TopToolsbar.IsHidden()){
          // this.ShowTopToolsbar();
          this.TopToolsbar.Show();
          this.dispatchEvent("TopToolsbarShowed");
        }else{
          // this.HideTopToolsbar();
          this.TopToolsbar.Hide();
          this.dispatchEvent("TopToolsbarHidden");
        }
      }
      this.keephiddentoptoolsbar=false
      this.HideTopToolsbar=function(notadj){
        var Ctrl = LibJavascript.DOM.Ctrl
        this.TopToolsbar.Hide();
        LibJavascript.CssClassNameUtils.replaceClass(Ctrl(this.ctrlid+"_tbar_toggler"),"ttbar_visible","ttbar_hidden");
        if(!notadj){
          this.adjustFormHeight();
        }
      }
      this.ShowTopToolsbar=function(){
        var Ctrl=LibJavascript.DOM.Ctrl
        this.TopToolsbar.Show();
        LibJavascript.CssClassNameUtils.replaceClass(Ctrl(this.ctrlid+"_tbar_toggler"),"ttbar_hidden","ttbar_visible");
        this.adjustFormHeight();
      }

      this.IsFilterAreaVisible=function(){
        return false
        //return document.getElementById(this.ctrlid+"_filters_panel").style.display!="none";
      }

      this.AddNewFilter=function(){
        var filter_tbody=document.getElementById(td_id_prefix+'_customFilter_tbar_filters_tbody');
        var filters=this.Filters.length;
        if(filter_tbody.innerHTML==""){
          this.ToggleFilterAreaByExample();
        }
        this.AddFilter(null,true,this.ctrlid+'_customFilter_tbar');
      }

      this.ToggleFilterArea=function(id,ev,fld,colId){
        this._CloseRow();
        get_FilterByExample_handler()
        if(!id) id=ev.target;
        this.ToggleDetailFilterByExample(id,true,fld,colId)
        // return
        // var filter_container=document.getElementById(this.ctrlid+"_filters_panel")
        // var tbitm=this.TopToolsbar.GetItem('filter_itm');
        // if(!this.IsFilterAreaVisible()){
          // filter_container.style.display="";
          // tbitm.SetImg(SPTheme.grid_img_filter_apply||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filters_apply.png');
          // tbitm.SetTitle(this.Translations['Apply_Filters']);
          // tbitm.ShowDock();
          // if(this.FilterAreaEmpty() && this.Cols.length>0)
            // this.AddFilter();
        // }else{
          // filter_container.style.display="none";
          // tbitm.SetImg(SPTheme.grid_img_filter_open||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_filters_add.png');
          // tbitm.SetTitle(this.Translations['Filters']);
          // tbitm.HideDock();
          // this.ApplyFilter();
        // }
      }
      this.ToggleFilterAreaByExample=function(){
        var filter_tbody=document.getElementById(td_id_prefix+'_customFilter_tbar_filters_tbody'),
          i;
        if(filter_tbody.innerHTML==""){
          if (!this.FilterAreaEmpty()){
            this.RefreshFiltersBar(true,td_id_prefix+'_customFilter_tbar');
          }
        }else{
          for(i=0; i<filter_tbody.childNodes.length;)
            filter_tbody.removeChild(filter_tbody.firstChild);
          for(i=0;i<this.Filters.length;){
            if(EmptyString(this.Filters[i].expression)){
              this._removeFilterByIndex(i,true);
            }else{
              i++;
            }
          }
        }
        filter_tbody=document.getElementById(td_id_prefix+'_customFilter_tbar_filters_tbody')
      }

      this.AddEmptyFilter=function(e){
        if(this.Cols.length>0 && GetEventSrcElement(e).id==this.ctrlid+"_filters") this.AddFilter();
      }
      this.FilterAreaEmpty=function(){
        var res=true;
        for(var i=0;i<this.Filters.length;i++){
          if(this.Filters[i].visible){
            res=false;
            break;
          }
        }
        return res;
      }
      this.MakeFilter=function(field,operator,expression,type,fixed){
        //costruisce un oggetto filter da usare con AddFilter
        if(!this.IDFilterSeed)
          this.IDFilterSeed=0;
        var cur_pict;
        if(EmptyString(field)){
          for(var j=0,cols=this.Cols,l=cols.length,cur_field; j<l; j++){
            cur_field=cols[j].field;
            if(!isExpr(cur_field)){
              field=cur_field;
              cur_pict=cols[j].picture;
              break;
            }
          }
        }else{
          var objCol = null;
          for (var i=0;objCol==null && i<this.Cols.length;i++) {
            if (this.Cols[i].field==field.toLowerCase()) {
              objCol=this.Cols[i];
            } else if (this.Cols[i].Layer) {
              for (var j=0;objCol==null && j<this.Cols[i].Layer.length;j++) {
                if (this.Cols[i].Layer[j].field==field.toLowerCase()) {
                  objCol = this.Cols[i].Layer[j];
                }
              }
            }
          }
          if (!objCol) {
            for (var i=0;objCol==null && i<this._rowLayer.length;i++) {
              if (this._rowLayer[i].field==field.toLowerCase()) {
                objCol = this._rowLayer;
              }
            }
          }
          if (objCol) {
            cur_pict=objCol.picture;
          }
        }
        var fldIdx=this.datasource.getFldIdx(field)
        field= fldIdx>=0 ? this.datasource.Fields_Case[fldIdx] : field;
        var op,opIdx;
        if(IsAny(operator)){
          opIdx=LibJavascript.Array.indexOf(this.AvailableOperators,operator.toLowerCase(),function(el,elcnfrt){ if (typeof(el)=='string') return elcnfrt==el; else return el && el.op==elcnfrt;});
          op= this.AvailableOperators[ opIdx!=-1 ? opIdx : 0];
        }else{
          op=this.AvailableOperators[0];
        }
        if (typeof(op)=='object') {
          op = op.op; //operatore stringa nell'oggetto
        }
        if (typeof(type)=='undefined'){
          type=this.datasource.getType(field);
        }
        return {id:(this.IDFilterSeed++).toString(), field:field||'', operator:op, expression:expression||'', type:type, fixed:(fixed?fixed:""), picture:(cur_pict?cur_pict:"")};
      }
      this.AddFilter=function(filter,visible,containerId){
        if(!containerId) {
          containerId=this.ctrlid
        }
        if(!IsAny(visible)){
          visible=!filter || (filter && (filter.field.toLowerCase() in this.collectFields({m_bCols:true, m_bRowLayer:true, m_bColumnLayers:true, m_bCollectExpr:false, m_bToLowerCase: true}).map));
        }
        if(!filter){
          filter=this.MakeFilter();
        }else if(!EmptyString(filter.expression) || (filter.operator && filter.operator=="empty")){
          this.filter_change=true;
        }
        if(!('visible' in filter)){
          filter.visible=visible;
        }
        this.Filters.push(filter);
        if(filter.visible){
          //this.RefreshFiltersBar(false,this.ctrlid);
          this.RefreshFiltersBar(false,containerId);
        }
      }
      this.SetFilter=function(id,field,operator,exp){
        var Ctrl=LibJavascript.DOM.Ctrl;
        if (typeof(operator)=='undefined' && typeof(exp)=='undefined') {
          if (id==null) { //prima moschina
            var valTd=FromHTML(Ctrl(get_customFilter_root_id()+'_expression').value);
            var type = this.datasource.getType(field);
            if (EmptyString(valTd) || (type=='N' && valTd=="0"))
              Ctrl(get_customFilter_root_id()+'_operator').value="empty";
            else if (type == 'D' || type == 'T' || type == 'N' || type == 'L')
              Ctrl(get_customFilter_root_id()+'_operator').value="=";
            else
              Ctrl(get_customFilter_root_id()+'_operator').value="contains";
          }
        }
        var index=LibJavascript.Array.indexOf(this.Filters,id,function(e1){return e1.id==id;});
        if(index==-1){
          return;
        }
        var filter=this.Filters[index];
        if(IsAny(field) && filter.field!=field){
          filter.field=field;
          filter.picture=this.Cols[LibJavascript.Array.indexOf(this.Cols, field.toLowerCase(), function( el , field) {
            return (el.field.toLowerCase()==field);
           })].picture;
          filter.type=this.datasource.getType(field);
          this.filter_change=true;
        }
        if(IsAny(operator) && filter.operator!=operator){
          filter.operator=operator;
          this.filter_change=true;
        }
        if(IsAny(exp) && filter.expression!=exp){
          filter.expression=exp;
          this.filter_change=true;
        }
      }
      this.RemoveAllFilters=function(keepFixed,delInvisible){
        var i=0,done;
        while(this.Filters.length>i){
          done=this._removeFilterByIndex(i,keepFixed,delInvisible);
          if(IsAny(done)){
            if(!done){
              i++;
            }else{
              //readonly
            }
          }else{
            throw new Error('Wrong index '+i+' in '+this.Filters);
          }
        }
      }
      var old_value_temp_filter='';
      this.DisableTempFilter=function(customFilter_root_id){
        var Ctrl=LibJavascript.DOM.Ctrl;
        Ctrl(customFilter_root_id+'_field').disabled='true'
        Ctrl(customFilter_root_id+'_operator').disabled='true'
        Ctrl(customFilter_root_id+'_operator').value='='
        old_value_temp_filter=Ctrl(customFilter_root_id+'_expression').value;
        Ctrl(customFilter_root_id+'_expression').value=''
        Ctrl(customFilter_root_id+'_expression').disabled='true'
        Ctrl(customFilter_root_id+'_delete_img').remove();
        Ctrl(customFilter_root_id+'_delete_a').innerHTML = LibJavascript.DOM.buildIcon({
            type : 'span'
          , className : "grid_filter_temp_add"
          , image : (SPTheme.grid_img_filter_disable?SPTheme.grid_img_filter_disable:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_temp_add.png")
          , image_attr : "no-repeat center center"
          , style : 'vertical-align:middle;border:0;'
          , title : this.Translations["Add_Filter"]
          , alt : "Add Filter"
          , id : customFilter_root_id+'_delete_img'
        })
        Ctrl(customFilter_root_id+'_delete_a').href="javascript:"+global_js_id+".EnableTempFilter('"+customFilter_root_id+"');";
      }
      this.EnableTempFilter=function(customFilter_root_id){
        var Ctrl=LibJavascript.DOM.Ctrl;
        Ctrl(customFilter_root_id+'_field').disabled=''
        Ctrl(customFilter_root_id+'_operator').disabled=''
        Ctrl(customFilter_root_id+'_expression').disabled=''
        Ctrl(customFilter_root_id+'_expression').value=old_value_temp_filter;
        Ctrl(customFilter_root_id+'_delete_img').remove();
        Ctrl(customFilter_root_id+'_delete_a').innerHTML = LibJavascript.DOM.buildIcon({
            type : 'span'
          , className : "grid_filter_delete"
          , image : (SPTheme.grid_img_filter_delete?SPTheme.grid_img_filter_delete:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_delete.png")
          , image_attr : "no-repeat center center"
          , style : 'vertical-align:middle;border:0;'
          , title : this.Translations["Remove_Filters"]
          , alt : "Remove Filters"
          , id : customFilter_root_id+'_delete_img'
        })
        Ctrl(customFilter_root_id+'_delete_a').href="javascript:"+global_js_id+".DisableTempFilter('"+customFilter_root_id+"');";
      }

      this.RemoveFilter=function(id,adj){
        var index=LibJavascript.Array.indexOf(this.Filters,id,function(e1,e2){return e1.id==e2});
        this._removeFilterByIndex(index,true,false,adj);
      }
      this._removeFilterByIndex=function(index,keepFixed,delInvisible,adj){//true se rimosso; false se readonly; undefined se indice sbagliato
        if(!adj) adj='';
        if(index in this.Filters) {
          var filter=this.Filters[index];
          if(filter.fixed && keepFixed){
            return false;
          }
          if(!filter.visible && !delInvisible) {
            return false;
          }
          LibJavascript.Array.remove(this.Filters,index);
          if(!EmptyString(filter.expression) || (filter.operator && filter.operator=="empty"))
            this.filter_change=true;
          if(filter.visible){
            var filter_node=document.getElementById(this.ctrlid+adj+'_filters_'+filter.id);
            var parent;
            if (filter_node){
              parent=filter_node.parentNode;
              if(adj!='' && parent && parent.childNodes.length==1){
                this.ToggleFilterAreaByExample();
              } else {
                filter_node.parentNode.removeChild(filter_node);
              }
            }
          }
          return true;
        }
        return;
      }
      this.InitFiltersBar=function(){
        this.filter_change=false;
        var filterDiv=document.getElementById(this.ctrlid+"_filters");
        filterDiv.innerHTML='<table width="100%" cellpadding=2 cellspacing=0><tbody id="'+this.ctrlid+'_filters_tbody"></tbody></table>';
      }
      this.RefreshFiltersBar=function(repaint_all,containerId){
        this._CloseRow();
        var filterTBody;
        if(repaint_all){
          filterTBody=document.createElement('tbody');
          filterTBody.id=containerId+'_filters_tbody';//+'_filters_tbody';
        }else{
          filterTBody=document.getElementById(containerId+'_filters_tbody');
        }
        if (filterTBody==null) return;
        //se !repaint_all genera html da aggiungere in coda solo dell'ultimo filtro in this.Filters
        //html per la combo con i campi in griglia
        var _this=this,i,
            get_filterFieldsCombo=function(filterFld){//restituisce l'html OPTIONS per i campi
              var filterFieldsCombo='', found = false,
                  j, curFld, datasource, fields, l;
              for(j=0,datasource=_this.datasource,fields=_this.Cols,l=fields.length; j<l; j++){
                curFld=fields[j].field;
                if(!isExpr(curFld) || isCheckbox(curFld)){
                  curFld=datasource.Fields_Case[datasource.getFldIdx(curFld)];
                  if (filterFieldsCombo.indexOf("<option value='"+curFld+"'")==-1)
                    filterFieldsCombo+="<option value='"+curFld+"'"+((filterFld==curFld)?" selected":"")+">"+(fields[j].title!=''?(fields[j].title.length>25?fields[j].title.substring(0,25)+" ...":fields[j].title):fields[j].field)+'</option>';
                    if (filterFld==curFld) found=true;
                }
                for(var k=0; k<fields[j].Layer.length; k++){
                  curFld=fields[j].Layer[k].field;
                  if(!isExpr(curFld) || isCheckbox(curFld)){
                    curFld=datasource.Fields_Case[datasource.getFldIdx(curFld)];
                    if (filterFieldsCombo.indexOf("<option value='"+curFld+"'")==-1)
                      filterFieldsCombo+="<option value='"+curFld+"'"+((filterFld==curFld)?" selected":"")+">"+(fields[j].Layer[k].title!=''?(fields[j].Layer[k].title.length>25?fields[j].Layer[k].title.substring(0,25)+" ...":fields[j].Layer[k].title):fields[j].Layer[k].field)+'</option>';
                    if (filterFld==curFld) found=true;
                  }
                }
              }
              for(j=0,datasource=this_grid.datasource,fields=this_grid._rowLayer,l=fields.length; j<l; j++){
                curFld=fields[j].field;
                if(!isExpr(curFld)|| isCheckbox(curFld)){
                  curFld=datasource.Fields_Case[datasource.getFldIdx(curFld)];
                  if (filterFieldsCombo.indexOf("<option value='"+curFld+"'")==-1)
                    filterFieldsCombo+="<option value='"+curFld+"'"+((filterFld==curFld)?" selected":"")+">"+(fields[j].title!=''?(fields[j].title.length>25?fields[j].title.substring(0,25)+" ...":fields[j].title):fields[j].field)+'</option>';
                    if (filterFld==curFld) found=true;
                }
              }
              if (!found) filterFieldsCombo+="<option value='"+filterFld+"' selected>"+filterFld+'</option>';
              return filterFieldsCombo;
            }
        for(i= (repaint_all ? 0 : this.Filters.length-1); i<this.Filters.length; i++){
          var filter=this.Filters[i];
          if(filter.visible){
            var disabled_attr= filter.fixed ? 'disabled="true" ' : '';
            var filterOperatorsCombo='';
            //html per la combo con gli operatori
            for(var j=0,operator,caption;j<this.AvailableOperators.length; j++){
              if(typeof(this.AvailableOperators[j])=='string'){
                operator=this.AvailableOperators[j];
                caption=operator;
              }else{
                operator=this.AvailableOperators[j].op;
                caption=this.AvailableOperators[j].caption;
              }
              filterOperatorsCombo+='<option'+((filter.operator==operator)?' selected':'')+' value="'+operator+'">'+caption+'</option>';
            }
            var filterTR=document.createElement("tr");
            filterTR.id=containerId+'_filters_'+filter.id;
            var col=document.createElement("td");
            col.style.width='1px';
            col.innerHTML='<select class="filters_body" '+
              disabled_attr+
              'onchange="'+global_js_id+".SetFilter('"+filter.id+'\',this.value);">'+
                get_filterFieldsCombo(filter.field)+
            '</select>';
            filterTR.appendChild(col);

            col=col.cloneNode(false);
            col.innerHTML='<select id="'+containerId+'operator_'+i+'" class="filters_body" '+
              disabled_attr+
              'onchange="'+global_js_id+".SetFilter('"+filter.id+'\',null,this.value);">'+
                filterOperatorsCombo+
            "</select>";
            filterTR.appendChild(col);
            col=document.createElement("td");
            col.style.width='100%';
            col.innerHTML='<input id="'+containerId+'exp_'+i+'" type="text" class="filters_body" style="width:98%"'+
              disabled_attr+
              //'value="'+this.Filters[i].expression+'" '+
              'onkeydown="'+global_js_id+".ManageKey(event,'"+filter.id+'\');" '+
              'onkeyup="'+global_js_id+".SetFilter('"+filter.id+'\',null,null,this.value);">';
            filterTR.appendChild(col);

            col=document.createElement("td");
            col.style.width='1px';
            col.style.textAlign='center';
            var adj;
            if (containerId.indexOf("_tbar")>-1) adj='_customFilter_tbar';
            else adj='';
            col.innerHTML=filter.fixed ? '&nbsp;':'<a href="javascript:'+global_js_id+".RemoveFilter('"+filter.id+"','"+adj+"')\";>"+
              LibJavascript.DOM.buildIcon({type : 'span'
                , className : "grid_filter_delete"
                , image : (SPTheme.grid_img_filter_delete?SPTheme.grid_img_filter_delete:ZtVWeb.SPWebRootURL+"/visualweb/images/grid_filter_delete.png")
                , image_attr : "no-repeat center center"
                , style : 'vertical-align:middle;border:0;'
                , title : this.Translations["Remove_Filters"]
                , alt : "Remove Filters"
              })+
            '</a>';
            filterTR.appendChild(col);

            filterTBody.appendChild(filterTR);
          }
        }
        if(repaint_all){
          var cont = document.getElementById(containerId+"_filters"), filterTable;
          if (cont==null) return;
          for (i=0; i<cont.childNodes.length;i++) {
            filterTable=cont.childNodes[i];
            if (filterTable.tagName=="TABLE") break;
          }
          filterTable.replaceChild(filterTBody, filterTable.tBodies[0]);
        }
        setTimeout(global_js_id+".SetExpressionsFilters('"+containerId+"',"+repaint_all+")",1);
      }
      this.SetExpressionsFilters=function(containerId,repaint_all){
        for(var c,i= (repaint_all ? 0 : (this_grid.Filters.length>0?this_grid.Filters.length-1:0)); i<this_grid.Filters.length; i++){
          if(this_grid.Filters[i] && this_grid.Filters[i].visible){
            if (c=LibJavascript.DOM.Ctrl(containerId+'exp_'+i)) c.value=this_grid.Filters[i].expression;
          }
        }
      }
      this.CreateFilter=function(notFixed){
        //genera frase SQL
        notFixed = (typeof(notFixed)=='undefined'?false:notFixed);
        if (this.datasource.CreateFilter) return this.datasource.CreateFilter(this.Filters, notFixed, this);
        var isXMLDataProvider=(this.datasource.root?true:false);
        var filter="",sep="",exp,type,to_remove=[],pict=null;
        for(var i=0;i<this.Filters.length;){
          var cur_filter=this.Filters[i];
          if (notFixed && cur_filter.fixed) {i++;continue;}
          var operator=(typeof(cur_filter.operator)=='string'?cur_filter.operator:cur_filter.operator.op)
          if(!EmptyString(cur_filter.expression)|| (operator && operator=="empty")){
            if(EmptyString(cur_filter.type)&&this.datasource.fieldstypearray!=null&&!EmptyString(cur_filter.field)){
              var fldIdx=this.datasource.getFldIdx(cur_filter.field);
                cur_filter.type=((fldIdx==-1)?'C':this.datasource.fieldstypearray[fldIdx]);
            }
            filter+=sep;
            var op=(isXMLDataProvider && operator=="<>"?"!=":operator);
            type=cur_filter.type;
            if (op!="empty") {
              if (isXMLDataProvider && (op=='contains' || op=='like')) {
                if (op=='contains')
                  filter+="contains(translate("+cur_filter.field+",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate(";
                  //filter+="contains("+cur_filter.field+",";
                else
                  //filter+="starts-with("+cur_filter.field+",";
                  filter+="starts-with(translate("+cur_filter.field+",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate(";
              } else {
              filter+=cur_filter.field+" ";
              filter+=(op=='contains'?'like':op)  +" ";
              }
              pict=cur_filter.picture;
              exp=cur_filter.expression;
              if(!isXMLDataProvider){
              if(type=="D"){
                if(!IsAny(pict) || EmptyString(pict)) pict= ZtVWeb.defaultDatePict
                if(typeof(exp)=="string")
                  filter+=ZtVWeb.toSQL(ZtVWeb.strToValue(exp,type,pict),type);
                else
                  filter+=ZtVWeb.toSQL(exp,type);
              }else if(type=="T"){
                if(!IsAny(pict) || EmptyString(pict)) pict= ZtVWeb.defaultDateTimePict
                if(typeof(exp)=="string")
                  filter+=ZtVWeb.toSQL(ZtVWeb.strToValue(exp,type,pict),type);
                else
                   filter+=ZtVWeb.toSQL(exp,type);
              }else if(type=="N"){
                if(typeof(exp)!="string") {
                  filter+=ZtVWeb.toSQL(exp,type);
                } else if (isNaN(ZtVWeb.strToValue(exp,type,pict))){
                  filter+=ZtVWeb.toSQL(ZtVWeb.strToValue(exp,'C',pict),'C');
                } else {
                  filter+=ZtVWeb.toSQL(ZtVWeb.strToValue(exp,type,pict),type);
                }
              } else {
                  filter+=ZtVWeb.toSQL(exp,type,(isXMLDataProvider?'':op));
              }
              }else{ //XMLDataprovider
                if (exp.indexOf('"')===-1)
                  exp= '"'+exp+'"';
                else if (exp.indexOf("'")===-1)
                  exp= "'"+exp+"'";
                else
                  exp= 'concat("'+exp.replace(/"/g, '",\'"\',"')+'")';
                filter+=exp;
              }
              if (isXMLDataProvider && (op=='contains' || op=='like')) {
                //filter+=')';
                filter+=",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))";
              }
            } else {
                var nullExp;
                switch (type) {
                  case 'D':
                    nullExp = "NULL";
                    break;
                  case 'T':
                    nullExp = "NULL";
                    break;
                  case 'N':
                    nullExp = 0;
                    break;
                  case 'L':
                    nullExp = false;
                    break;
                  case 'M':
                  case 'C':
                  default :
                    if(isXMLDataProvider)
                      nullExp = "''";
                    else
                    nullExp = "";
                    break;
                }
                if(isXMLDataProvider)
                  filter="("+cur_filter.field+"="+nullExp+")";
                else
                filter+="("+cur_filter.field+" is null or "+cur_filter.field+" = "+ ZtVWeb.toSQL(nullExp,type)+")";
            }
            sep=" and ";
            i++;
          }else{
            if (!this._removeFilterByIndex(i,true)) i++;
          }
        }
        return filter;
      }
      this.ApplyFilter=function(){
        if(!this.filter_change){
          for(var i=0;i<this.Filters.length;){
            var operator=(typeof(this.Filters[i].operator)=='string'?this.Filters[i].operator:this.Filters[i].operator.op)
            if(!EmptyString(this.Filters[i].expression) || (operator && operator=="empty")){
              i++;
            }else{
              this._removeFilterByIndex(i,true);
            }
          }
        }else{
          this.preserveData=true //this.hmg_as_filter;
          if(this.datasource!=null){
            this.datasource.queryfilter=this.CreateFilter();
            this.dispatchEvent("FiltersCreated");
            this.datasource.Query();
            this.dispatchEvent("FiltersApplied");
          }
        }
        this.filter_change=false;
      }
      this.SetMobileFilterCaption=function(caption){
        var filter_portlet = window[this.ctrlid+"_search"];
        if( filter_portlet )
          filter_portlet.SetCaption(caption);
      }
      this.ManageKey=function(e,id){
        //INS aggiunge un filtro vuoto, ENTER applica i filtri e chiude il dock
        var index=LibJavascript.Array.indexOf(this.Filters,id,function(e1,e2){return e1.id==e2});
        if(e.keyCode==13)
          this.FilterByExample_custom();
          //this.ToggleFilterArea();
        else if(e.keyCode==45 && index==this.Filters.length-1)
          this.AddFilter();
        e.cancelBubble=true
        if(e.stopPropagation) e.stopPropagation();
      }
      this.RemoveColFromGrid=function(col) {
        if (this.Cols.length>1) {
          var removecol = this.Cols.splice(col,1)[0];
          var title_grid = window[this.ctrlid+"_search"] || window[this.form.Zoomtitle];
          if (title_grid && title_grid.AddField) {
            title_grid.AddField(removecol);
          }
          this.datasource.Query();
        }
      }
      this.HideTopToolsbar(true);
      this.SetTopToolsbarItems();
      this.Drop=function(j,drop_item,drag_item){
        //trovare la riga e la colonna
        var a=Strtran(drop_item.id,this.ctrlid+"_","").split('_');
        var rowidx=a[0];
        var colidx=a[1];
        this.SetCurRec(rowidx-0+1);
        j.field=this.Cols[colidx].field;//campo su cui droppo
        this.dispatchEvent("Drop",j);
      }
    }
    this.GridCtrl.prototype=new this.StdControl();
    this.GridCtrl.prototype.toggleOrderbyList=function(event,th_id,id,num_mob,foundFilters,field,close){
      var Cols=(this.ExtraCols?this.ExtraCols:this.Cols);
      var global_js_id='window.'+this.form.formid+'.'+this.name
        , Ul=document.getElementById(th_id+'_orderBy_list')
        , idx=LibJavascript.Array.indexOf(Cols,id)
        , col=this.GetColById(id,true)
        , orderby_container=document.getElementById(this.ctrlid+"_orderby_container")
        , gridOrdered = LibJavascript.Array.indexOf(Cols,col.id,function(arrEl,toExclude) {
            return arrEl.id!=toExclude && arrEl.orderbyidx>0 && arrEl.orderbystatus!=''
        })>-1;
        ;
        this.MakeWrapper();
        if (!orderby_container) {
          orderby_container = document.createElement("div");
          orderby_container.style.position = "absolute";
          orderby_container.id = this.ctrlid+"_orderby_container";
          orderby_container.style.display = "none";
          var grid_wrapper = document.getElementById(this.ctrlid+"_wrapper");
          grid_wrapper.appendChild(orderby_container);
          var ms = document.getElementById("tbl"+this.ctrlid+"_scroller")
          ms.addEventListener("scroll",function(){
            var initDX = orderby_container.getAttribute("SPOrderByLeft");
            if( typeof(initDX)!="undefined")
              orderby_container.style.left = (initDX - this.scrollLeft) + "px";
          });
        }
      if(!Ul && field!=null){
        var html='<div class="grid_orderby_ul_pin"></div>'+
        '<ul id="'+th_id+'_orderBy_list" class="grid_orderby_ul">'

        if(col.type!='M' && this.isorderby){
          // se e' discendente
          html+=(col.orderbyImgObj.img_ord_asc == col.orderbyImgObj.up ?
           LibJavascript.DOM.buildIcon({type : 'li'
                          , className : "grid_orderby_li asc"
                          , image : col.orderbyImgObj.ico_ord_asc
                          , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'arr_up\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                          , text : ZtVWeb.GridTranslations["Ascending"]
                          , image_attr : "no-repeat left center"
                          })
           : ''
           )+
          (col.orderbyImgObj.img_ord_desc==col.orderbyImgObj.dn ?
            LibJavascript.DOM.buildIcon({type : 'li'
                          , className : "grid_orderby_li desc"
                          , image : col.orderbyImgObj.ico_ord_desc
                          , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'arr_dn\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                          , text : ZtVWeb.GridTranslations["Descending"]
                          , image_attr : "no-repeat left center"
                          })

            : ''
          );
          // non e' ancora stato impostato un ordinamento su questa colonna
          if(col.orderbyImgObj.opt_ord_asc_hv != col.orderbyImgObj.minus_hv && col.orderbyImgObj.opt_ord_desc_hv != col.orderbyImgObj.minus_hv){
            if (gridOrdered) {
              html+=''+
              // (opt_ord_asc_hv==minus_hv ?
                // '' :
                LibJavascript.DOM.buildIcon({type : 'li'
                              , className : "grid_orderby_li add_asc"
                              , image : col.orderbyImgObj.ico_ord_add_asc
                              , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'plus_asc\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                              , text : ZtVWeb.GridTranslations["Ascending"]
                              , image_attr : "no-repeat left center"
                              }) +
                // '<li class="grid_orderby_li" style="background:URL('+col.orderbyImgObj.ico_ord_add_asc+') no-repeat left center;" onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick('+i+',\'plus_asc\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"> + '+ZtVWeb.GridTranslations["Ascending"]+'</li>'+
              // )+
              // (opt_ord_desc_hv==minus_hv ?
                // '' :
                LibJavascript.DOM.buildIcon({type : 'li'
                              , className : "grid_orderby_li add_desc"
                              , image : col.orderbyImgObj.ico_ord_add_desc
                              , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'plus_desc\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                              , text : ZtVWeb.GridTranslations["Descending"]
                              , image_attr : "no-repeat left center"
                              })
                // '<li class="grid_orderby_li" style="background:URL('+col.orderbyImgObj.ico_ord_add_desc+') no-repeat left center;" onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick('+i+',\'plus_desc\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"> + '+ZtVWeb.GridTranslations["Descending"]+'</li>'
              // )+
            }
          }else{
            if( col.orderbyImgObj.opt_ord_asc_hv == col.orderbyImgObj.minus_hv ) {
              html+=LibJavascript.DOM.buildIcon({type : 'li'
                              , className : "grid_orderby_li add_desc"
                              , image : col.orderbyImgObj.ico_ord_add_desc
                              , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'idx\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                              , text : ZtVWeb.GridTranslations["Descending"]
                              , image_attr : "no-repeat left center"
                              });
            }
            if( col.orderbyImgObj.opt_ord_desc_hv == col.orderbyImgObj.minus_hv ){
              html+=LibJavascript.DOM.buildIcon({type : 'li'
                              , className : "grid_orderby_li add_asc"
                              , image : col.orderbyImgObj.ico_ord_add_asc
                              , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'idx\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                              , text : ZtVWeb.GridTranslations["Ascending"]
                              , image_attr : "no-repeat left center"
                              });
            }
            html+=''+
            ((col.orderbyImgObj.opt_ord_asc_hv==col.orderbyImgObj.minus_hv && col.orderbyImgObj.opt_ord_asc_type=='minus' )|| (col.orderbyImgObj.opt_ord_desc_hv==col.orderbyImgObj.minus_hv && col.orderbyImgObj.opt_ord_desc_type=='minus')?
              LibJavascript.DOM.buildIcon({type : 'li'
                            , className : "grid_orderby_li del_sort"
                            , image : col.orderbyImgObj.ico_ord_del
                            , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick(\''+col.id+'\',\'minus\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                            , text : '- '+ZtVWeb.GridTranslations["Sorting"]
                            , image_attr : "no-repeat left center"
                            })
              // '<li class="grid_orderby_li" style="background:URL('+col.orderbyImgObj.ico_ord_del+') no-repeat left center;" onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.columnClick('+i+',\'minus\','+global_js_id+'.datasource,event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();"> - '+ZtVWeb.GridTranslations["Sorting"]+'</li>'
              : ''
            )

          }
        }
        //Filtro del campo
        if(this.show_filters.indexOf('true')>-1 && !isExpr(col.field)){
          if ( ZtVWeb.IsMobile() ) {
            html+=LibJavascript.DOM.buildIcon({type : 'li'
                              , className : "grid_orderby_li find"
                              , image : col.orderbyImgObj.ico_ord_find
                              , events : 'onclick="return (function(event){window.'+global_js_id+'.HideOrderbyList();window.'+global_js_id+'.Search(\''+col.id+'\',\''+th_id+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();return;})(event)"'
                              , text : ZtVWeb.GridTranslations["Filter"]
                              , image_attr : "no-repeat left center"
                              });
          }else{
            html+=LibJavascript.DOM.buildIcon({type : 'li'
                              , className : "grid_orderby_li find"
                              , image : col.orderbyImgObj.ico_ord_find
                              , events : 'onclick="return (function(event){window.'+global_js_id+'.ToggleFilterArea(null,event,\''+field+'\',\''+col.id+'\');window.'+global_js_id+'.HideOrderbyList();event.preventDefault();event.cancelBubble=true;event.stopPropagation();return;})(event)"'
                              , text : ZtVWeb.GridTranslations["Filter"]
                              , image_attr : "no-repeat left center"
                              });
          }
          html +=
            (foundFilters ?
              LibJavascript.DOM.buildIcon({type : 'li'
                        , className : "grid_orderby_li rem_filter"
                        , image : col.orderbyImgObj.ico_filters_del
                        , events : 'onclick="'+global_js_id+'.HideOrderbyList(); '+global_js_id+'.RemoveFiltersField(\''+field+'\');event.preventDefault();event.cancelBubble=true;event.stopPropagation();"'
                        , text : '- ' + ZtVWeb.GridTranslations["Filters"]
                        , image_attr : "no-repeat left center"
                        })
            : ''
            )
            if (!isExpr(col.field))
              LibJavascript.DOM.buildIcon({type : 'li'
                        , className : "grid_orderby_li filter"
                        , image : col.orderbyImgObj.ico_ord_filters
                        , events : 'onclick="return (function(event){window.'+global_js_id+'.HideOrderbyList();window.'+global_js_id+'.datasource.ValuesList(\''+field+'\','+global_js_id+',event);event.preventDefault();event.cancelBubble=true;event.stopPropagation();return;})(event)"'
                        , text : ZtVWeb.GridTranslations["Filters"]
                        , image_attr : "no-repeat left center"
                        })
        }
        html+='</ul>';
        //Uso il div container dei FilterByExample
        orderby_container.innerHTML=html;
        // Ul=document.getElementById(th_id+'_orderBy_list');
      }
      if(orderby_container && orderby_container.style.display=='none' && !close){
        this.HideFieldList();
        this.HideToolsBar();
        var targ=document.getElementById(th_id);//(event.target || event.srcElement);
        var pin = orderby_container.firstElementChild
          , pos=LibJavascript.DOM.getPosFromFirstRel(targ,orderby_container)
          //, targetPos = LibJavascript.DOM.getAbsolutePos(event.target || event.srcElement)
          //, pos = { x: targetPos.left, y: targetPos.top+event.target.offsetHeight+pin.offsetHeight}
        ;
        pos.y+=targ.offsetHeight+pin.offsetHeight;
        /* menu sporge a destra rispetto alla griglia*/
        orderby_container.style.top='0';
        orderby_container.style.left='0';
        orderby_container.style.display='';
        //prima devo farlo diventare visibile e poi posso calcolare la misura!
        var ULWidth = document.getElementById(th_id+'_orderBy_list').scrollWidth;
        if( pos.x + ULWidth > this.Ctrl.offsetWidth + this.Ctrl.getBoundingClientRect().left ){
          pos.x = this.Ctrl.offsetWidth - ULWidth + this.Ctrl.getBoundingClientRect().left ;
        }
        orderby_container.style.top=pos.y+'px';
        orderby_container.style.left=pos.x+'px';
        orderby_container.setAttribute("SPOrderByLeft",pos.x+document.getElementById("tbl"+this.ctrlid+"_scroller").scrollLeft);
        pin.style.left = (+(event.target || event.srcElement).offsetWidth/2) - (+pin.offsetWidth/2) +'px'
      }else{
        if (orderby_container) {
          orderby_container.style.display='none';
        }
      }
      ZtVWeb.raiseEvent(this.name+'_ColumnClick',{'col':this.GetColIdxById(id),'field':col.field,"title":col.title},null,null);
    };
    this.GridCtrl.prototype.HideOrderbyList=function(){
      var orderby_container=document.getElementById(this.ctrlid+"_orderby_container");
      if (orderby_container)
        orderby_container.style.display = "none";
    }
    this.GridCtrl.prototype.Search = function(colId,thId) {
      var filter_portlet=window[this.ctrlid+"_search"];
      var zoom_title=window[this.form.Zoomtitle];
      var col=this.GetColById(colId,true);
      var col_obj=document.getElementById(thId);
      if ( LibJavascript.CssClassNameUtils.hasClass(col_obj,"grid_cell_title_prefilter")) {
        var cont = LibJavascript.DOM.Ctrl(this.ctrlid+'_search_fields_list');
        if (cont && cont.style.display=='') {
          cont.style.display = "none";
        } else {
          this.datasource.ValuesList(col.field,this,colId,thId);
        }
      } else {
        this.HideFieldList();
        var preFilters=LibJavascript.CssClassNameUtils.getElementsByClassName("grid_cell_title_prefilter",document.getElementById(this.ctrlid),(this.floatRows?'div':'td'));
        for(var i=0;i<preFilters.length;i++){
          LibJavascript.CssClassNameUtils.removeClass(preFilters[i],"grid_cell_title_prefilter");
        }
        LibJavascript.CssClassNameUtils.addClass(col_obj,"grid_cell_title_prefilter");
        var filterValue = document.getElementById(thId + '_title_value');
        if (filterValue) {
          filterValue = filterValue.innerHTML;
          if (filterValue=="("+ZtVWeb.GridTranslations["Empty"]+")")
            filterValue = "";
        } else
          filterValue = "";
        if (filter_portlet && filter_portlet.SetSearchField){
          filter_portlet.SetSearchField(col,filterValue);
        }else if(zoom_title && zoom_title.SetSearchField){
          zoom_title.SetSearchField(col, filterValue);
        }
        this.toggleOrderbyList(null,thId,col.id,null,null,null,true);
      }
    }
    this.GridCtrl.prototype.columnClick=function(colId,wdg,datasource,evt){
      /*
        wdg: il click da qualche parte sul titolo. Puo' avalere:
          - title : click sul titolo => cambio orderby singolo campo (come idx);
          - arr_up : freccia su => ordine asc su campo e tolti altri eventuali orderby;
          - arr_dn : freccia giu => ordine desc su campo e tolti altri eventuali orderby;
          - idx : click su indice => cambio orderby singolo campo (come null);
          - plus_asc : click su + asc => aggiunto ordinamento asc;
          - plus_desc : click su + desc => aggiunto ordinamento desc;
          - minus : click su - => togliere ordinamento singolo campo;
      */
      var col=this.GetColById(colId,true), i, _col, maxidx;
      if(!Empty(col.orderbyfld)){//e' ordinabile
        this.preserveData=true;
        var Cols= (this.ExtraCols?this.ExtraCols:this.Cols);
        if(wdg=='arr_up' || wdg=='arr_dn'){
          //e' fatto click sulle frecce x l'ordinamento: rimuovo tutti gli ordinamenti e assegno quello selezionato come unico
          for(i=0; _col=Cols[i]; i++){
            if(_col.id!=colId){
              _col.orderbyidx=0;
              _col.orderbystatus='';
            }
          }
          col.orderbystatus= wdg=='arr_dn' ? 'desc' : 'asc';
          col.orderbyidx=1;
        }else if(wdg=='title' || wdg=='idx'){
          //e' stato fatto click sul titolo oppure sul numero => inverto l'ordinamento
          col.orderbystatus= col.orderbystatus=='desc' ? 'asc' : 'desc';
          if(col.orderbyidx==0){//se non aveva ordianamento tolgo tutti gli altri
            col.orderbyidx=1;
            for(i=0; _col=Cols[i]; i++){//cerco il maggiore tra tutti
              if(_col!=col){
                _col.orderbyidx=0;
                _col.orderbystatus='';
              }
            }
          }
        }else if(wdg=='plus_asc'){
          //e' stato fatto click sul + asc
          col.orderbystatus='asc';
          maxidx=0;
          for(i=0; _col=Cols[i]; i++){//cerco il maggiore tra tutti gli asc
            if( _col!= col )
              maxidx=Math.max(maxidx, _col.orderbyidx);
          }
          col.orderbyidx=maxidx+1;
        }else if(wdg=='plus_desc'){
          //e' stato fatto click sul + desc
          col.orderbystatus='desc';
          maxidx=0;
          for(i=0; _col=Cols[i]; i++){//cerco il maggiore tra tutti i desc
            if( _col!= col )
              maxidx=Math.max(maxidx, _col.orderbyidx);
          }
          col.orderbyidx=maxidx+1;
        }else if(wdg=='minus'){
          //e' stato fatto click sul -
          //devo azzerare l'ordinamento su questa colonna e diminuirne l'indice su quelle con ordinamento successivo
          col.orderbystatus='';
          var ordidx=col.orderbyidx;
          col.orderbyidx=0;
          for(i=0; _col=Cols[i]; i++){
            if(_col.orderbyidx>ordidx){
              _col.orderbyidx--;
            }
          }
        }

        var ordered_cols=[];//array x ordiare in base all'indice
        for(i=0; _col=Cols[i]; i++){
          if(_col.orderbyidx){
            if(Empty(_col.orderbyfld) || Empty(_col.orderbystatus)){//controllo che non ci siano campi con indice di ordinamento senza direzione o campo associato
              throw new Error('Wrong index ('+_col.orderbyidx+') for field '+col.field+' (direction: '+c2.field+')');
            }
            ordered_cols.push(_col);
          }
        }
        ordered_cols.sort(function(c1,c2){//ordino l'array temp in base all'idx
          var res=c1.orderbyidx-c2.orderbyidx;
          if(res==0){//controllo che non ci siano 2 campi con lo stesso indice di ordinamento
            throw new Error('Wrong index ('+c1.orderbyidx+') for field '+c1.field+' and '+c2.field);
          }
          return res;
        });

        //costruisco la stringa di orderby
        var currentOrderby;
        if (datasource.BuildOrderBy) {
          currentOrderby=datasource.BuildOrderBy(ordered_cols)
        } else {
          var ordbystr='';
          for(i=0; _col=ordered_cols[i]; i++){
            ordbystr += _col.orderbyfld+
              (_col.orderbystatus=='desc' ? ' desc' : '')+
              (i!=ordered_cols.length-1 ? ', ' : '');
          }
          currentOrderby=ordbystr;
        }
        datasource.setOrderBy(currentOrderby);
        datasource.Query();
      }
      this.dispatchEvent('onColumnClick',this.GetColIdxById(colId));
      ZtVWeb.raiseEvent(this.name+'_ColumnClick',{'col':this.GetColIdxById(colId),'field':col.field,"title":col.title},null,null);
      if(window.event){
        window.event.cancelBubble=true;
      }else if(evt){
        evt.stopPropagation();
      }
      return false;
    }
   /*  this.GridCtrl.prototype.ManageColTitleHover=function(tg,col,e){
      //all'hover sul titolo di una colonna devono mostrarsi anche gli orderby delle colonne ordinate
      var _col=this.Cols[col];
      var evt=e||window.event;
      if (evt.type=='mouseover') {
        this.dispatchEvent('onColumnOver',col);
      } else {
        this.dispatchEvent('onColumnOut',col);
      }
      if(Empty(_col.orderbyfld)){
        return;
      }
      var th_id=this.ctrlid+'_cell_';
      var orderby_id=th_id+_col.id+'_orderby';
      var fnc;
      if(evt.type=='mouseover'){
        fnc=LibJavascript.CssClassNameUtils.addClass;
      }else{
        fnc=LibJavascript.CssClassNameUtils.removeClass;
      }

      if(!ZtVWeb.IsMobile())fnc(document.getElementById(orderby_id),'grid_orderbyhover');
      //scandisco tutte le colonne che presentano un ordinamento e le evidenzio
      for(var i=0,c; c=this.Cols[i] && !ZtVWeb.IsMobile(); i++){
        if(c==_col || Empty(c.orderbystatus)){
          continue;
        }
        orderby_id= th_id + c.id + '_orderby';
        fnc(document.getElementById(orderby_id),'grid_orderbyhover');
      }
    } */
    // spostamento layers e moschina all'interno della griglia
    this.dragInGrid=function(e,obj, grid) {
      var eventPos=function(ev) {
        if(ev.pageX || ev.pageY) {
          return { x: ev.pageX, y: ev.pageY };
        }
        return {
          x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
          y: ev.clientY + document.body.scrollTop  - document.body.clientTop
        };
      }
      var Ctrl=LibJavascript.DOM.Ctrl,
          owner_grid=Ctrl(grid),
          offLeft=0,
          offTop=0;
      e=e?e:window.event
      obj=Ctrl(obj)
      if(obj) ZtVWeb.dragObj.css=obj.style
      if(!e || !ZtVWeb.dragObj.css) return
      var aTag=obj;
      var zIndexAssigned=false;
      do {
        if (((parseInt(aTag.style.zIndex||0))+1)<ZtVWeb.dragObj.zIndex){
          aTag.style.zIndex=ZtVWeb.dragObj.zIndex;
          zIndexAssigned=true;
        }
        aTag=aTag['parentNode'];
      } while(aTag.tagName!='BODY');
      if (zIndexAssigned) ZtVWeb.dragObj.zIndex++;
      var pos = eventPos(e);
      //Save mousedown location
      ZtVWeb.dragObj.downX=pos.x;
      ZtVWeb.dragObj.downY=pos.y;
      //bring to top of stack
      if(document.addEventListener){
        document.addEventListener("mousemove",ZtVWeb.dragStartInGrid,true)
        document.addEventListener("mouseup",ZtVWeb.dragEndInGrid,true)
        e.preventDefault()
      } else if(document.attachEvent) {
        document.attachEvent("onmousemove",ZtVWeb.dragStartInGrid)
        document.attachEvent("onmouseup",ZtVWeb.dragEndInGrid)
        return false
      }
    };
    this.dragStartInGrid=function(e) {
      e=e?e:window.event
      var eventPos=function(ev) {
        if(ev.pageX || ev.pageY) {
          return { x: ev.pageX, y: ev.pageY };
        }
        return {
          x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
          y: ev.clientY + document.body.scrollTop  - document.body.clientTop
        };
      }
      var pos = eventPos(e);
      // Move drag element by the amount the cursor has moved.
      var deltaX=(pos.x-ZtVWeb.dragObj.downX-(ZtVWeb.dragObj.deltaX?ZtVWeb.dragObj.deltaX:0))
      var deltaY=(pos.y-ZtVWeb.dragObj.downY-(ZtVWeb.dragObj.deltaY?ZtVWeb.dragObj.deltaY:0))
      if(ZtVWeb.dragObj.resize){
        if(Val(ZtVWeb.dragObj.css.width)+Val(ZtVWeb.dragObj.css.left)-newX>ZtVWeb.dragObj.minW){
          ZtVWeb.dragObj.css.width=Val(ZtVWeb.dragObj.css.width)+Val(ZtVWeb.dragObj.css.left)-newX+"px"
          ZtVWeb.dragObj.css.left=newX+"px"
        }
        if(Val(ZtVWeb.dragObj.css.height)+Val(ZtVWeb.dragObj.css.top)-newY>ZtVWeb.dragObj.minH){
          ZtVWeb.dragObj.css.height=Val(ZtVWeb.dragObj.css.height)+Val(ZtVWeb.dragObj.css.top)-newY+"px"
          ZtVWeb.dragObj.css.top=newY+"px"
        }
      }else{
        var newX=Val(ZtVWeb.dragObj.css.left)+deltaX;
        if (newX<0) {
          deltaX=deltaX-newX;
          newX=0;
        }
        var newY=Val(ZtVWeb.dragObj.css.top)+deltaY;
        if (newY<0) {
          deltaY=deltaY-newY;
          newY=0;
        }

        ZtVWeb.dragObj.css.left=newX+"px"
        ZtVWeb.dragObj.css.top=newY+"px"
        ZtVWeb.dragObj.downX=ZtVWeb.dragObj.downX+deltaX
        ZtVWeb.dragObj.downY=ZtVWeb.dragObj.downY+deltaY
      }
      if(e.preventDefault)e.preventDefault()
      else return false
    };
    this.dragEndInGrid=function(e) {
      ZtVWeb.dragObj.resize=false
      // Stop capturing mousemove and mouseup events.
      if(document.removeEventListener){
        document.removeEventListener("mousemove",ZtVWeb.dragStartInGrid,true)
        document.removeEventListener("mouseup",ZtVWeb.dragEndInGrid,true)
      }else if(document.detachEvent){
        document.detachEvent("onmousemove",ZtVWeb.dragStartInGrid)
        document.detachEvent("onmouseup",ZtVWeb.dragEndInGrid)
      }
    };


    // GridLayers ----------------------------------------------------------------------------------------------------------------
    this.GridCtrl.prototype.GetRowLayer=function(){
      if(!this.Layer){
        this.Layer = new ZtVWeb.GridCtrl.RowLayer(this);
      }
      return this.Layer;
    };
    this.GridCtrl.prototype.GetColumnLayer=function(colId){
      var name='ColLayer_'+colId;
      if(!this[name]){
        this[name] = new ZtVWeb.GridCtrl.ColumnLayer(this,colId);
      }
      return this[name];
    };
    this.GridCtrl.prototype.GetMemoLayer=function(colId){
      var name='MemoLayer_'+colId;
      if(!this[name]){
        this[name] = new ZtVWeb.GridCtrl.MemoLayer(this,colId);
      }
      return this[name];
    };
    this.GridCtrl.prototype.InvalidateHtmlReferences=function(){
      this.InvalidateRowLayer();
      this.InvalidateColumnLayers();
      this.InvalidateMemoLayers();
      if(this.DragColumnManager){
        this.DragColumnManager.droplets=[];
        this.DragColumnManager.draglets=[];
      }
      this.RemoveToolsBars();
    };
    this.GridCtrl.prototype.InvalidateRowLayer=function(){
      if(this.Layer)
        this.Layer.Invalidate();
      if(this.DragColumnManager){
        var d, i,
            droplets=this.DragColumnManager.droplets,
            draglets=this.DragColumnManager.draglets,
            rem=LibJavascript.Array.remove;
        for(i=droplets.length-1; i>=0; i--){
          if((d=droplets[i]) instanceof Z.DnD.Grid.RowLayer.RowDroplet || d instanceof Z.DnD.Grid.RowLayer.MainDroplet)
            rem(d, i);
        }
        for(i=draglets.length-1; i>=0; i--){
          if((d=draglets[i]) instanceof Z.DnD.Grid.RowLayer.Draglet)
            rem(d, i);
        }
      }
      this.Layer=null;
    };

    this.GridCtrl.prototype.InvalidateColumnLayer=function(fldName){
      var cl=this.GetColumnLayer(fldName);
      if(cl){
        cl.Invalidate();
        if(this.DragColumnManager){
          var droplets=this.DragColumnManager.droplets;
          var draglets=this.DragColumnManager.draglets;
          var rem=LibJavascript.Array.remove, i, d;
          for(i=droplets.length-1; i>=0; i--){
            if(((d=droplets[i]) instanceof Z.DnD.Grid.ColumnLayer.RowDroplet || d instanceof Z.DnD.Grid.ColumnLayer.MainDroplet) && d.field==fldName)
              rem(d, i);
          }
          for(i=draglets.length-1; i>=0; i--){
            if(((d=draglets[i]) instanceof Z.DnD.Grid.ColumnLayer.Draglet) && d.field.colLayerId==fldName)
              rem(d, i);
          }
        }
        this['ColLayer_'+fldName]=null;
      }
    }
    this.GridCtrl.prototype.InvalidateColumnLayers=function(){
      var i;
      if(this.DragColumnManager){
        var droplets=this.DragColumnManager.droplets,
            draglets=this.DragColumnManager.draglets,
            rem=LibJavascript.Array.remove, d;
        for(i=droplets.length-1; i>=0; i--){
          if((d=droplets[i]) instanceof Z.DnD.Grid.ColumnLayer.RowDroplet || d instanceof Z.DnD.Grid.ColumnLayer.MainDroplet)
            rem(d, i);
        }
        for(i=draglets.length-1; i>=0; i--){
          if((d=draglets[i]) instanceof Z.DnD.Grid.ColumnLayer.Draglet)
            rem(d, i);
        }
      }
      var col,layerId;
      for(i=0; col=this.Cols[i]; i++){
        layerId='ColLayer_'+col.id;
        if(layerId in this){
          this[layerId].Invalidate();
          delete this[layerId];
        }
      }
    };
    this.GridCtrl.prototype.InvalidateMemoLayer=function(fldName){
      var cl=this.GetMemoLayer(fldName);
      if(cl){
        cl.Invalidate();
        this['MemoLayer_'+fldName]=null;
      }
    }
    this.GridCtrl.prototype.InvalidateMemoLayers=function(){
      for(var i=0,col,layerId; col=this.Cols[i]; i++){
        layerId='MemoLayer_'+col.id;
        if(layerId in this){
          this[layerId].Invalidate();
          delete this[layerId];
        }
      }
    };

    // RowLayer ----------------------------------------------------------------------------------------------------------------
    this.GridCtrl.RowLayer=function(owner_grid, opts){
      this.pinned=false;
      this.grid=owner_grid;
      this.opts=opts || {
          delay_show: 500,
          delay_hide: 200
        };
      this.base_layer=new ZtVWeb.Layer();
      this.base_layer.SetContainer(ZtVWeb.GridCtrl.RowLayer.InitLayerContainer(owner_grid));
      this.base_layer.addObserver('l',this);

    }
    this.GridCtrl.RowLayer.prototype=new this.StdControl();
    this.GridCtrl.RowLayer.prototype.Invalidate=function(){
      var html_container=LibJavascript.DOM.Ctrl(this.grid.ctrlid+'_RowLayersContainer_L');
      html_container.parentNode.removeChild(html_container);
      this.grid=null;
      this.nearTo=null;
      this.dataIdx=null;
      this.pinned=false;
      this.base_layer=null;
    };
    this.GridCtrl.RowLayer.prototype.Show=function(nearTo,dataIdx){
      if(!IsA(nearTo,'U')){
        this.nearTo=nearTo;
      }
      if(!IsA(dataIdx,'U')){
        this.dataIdx=dataIdx;
      }
      this.pinned=true;
      this.base_layer.Show();
    }
    this.GridCtrl.RowLayer.prototype.Visible=function(){
      return this.base_layer.Visible();
    }
    this.GridCtrl.RowLayer.prototype.Hover=function(nearTo,dataIdx){
      if(this.pinned){
        return;
      }

      if(!IsA(nearTo,'U')){
        this.nearTo=nearTo;
      }
      if(!IsA(dataIdx,'U')){
        this.dataIdx=dataIdx;
      }

      var _this=this;
      this.clear_hide=null;
      this.clear_hover=window.setTimeout(function(){
        if(_this.grid && _this.grid.Layer!=_this){
          _this.grid=null;
          _this=null;
          return;
        }
        _this.base_layer.Show();
        _this.clear_hover=null;
      }, this.opts.delay_show);

      LibJavascript.Events.addEvent(document.getElementById(this.nearTo),"mouseout",function(e){
        if(_this.clear_hover){
          window.clearTimeout(_this.clear_hover);
        }
        _this.clear_hide=window.setTimeout(function(){
          _this.HideOut();
        }, _this.opts.delay_hide);
      });
    };
    this.GridCtrl.RowLayer.prototype.HideOut=function(){
      if(!this.pinned && this.base_layer)
        this.base_layer.Hide();
    }
    this.GridCtrl.RowLayer.prototype.Hide=function(){
      this.base_layer.Hide();
      this.pinned=false;
    }
    this.GridCtrl.RowLayer.prototype.l_Show=function(){
      if(!this.grid){
        return;
      }
      var Ctrl = LibJavascript.DOM.Ctrl,
          nearTo = Ctrl(this.nearTo),
          dataIdx = this.dataIdx;
      if(!this.ctrlid){
        this.ctrlid = this.grid.ctrlid+"_L_";
      }
      var layer = this.grid._rowLayer;
      for(var i=0,lnk,fld,html,val,p_td,target,picture,onclick,itm,datasource=this.grid.datasource,form=this.grid.form,on_click_str; itm=layer[i]; i++){
        if (!itm.inExtGrid || !this.grid.reduced){
          fld = itm.field;
          p_td = Ctrl(this.ctrlid+itm.id);
          picture = layer.picture;
          if(itm.field.indexOf("image:")>-1 || itm.field.indexOf("html:")>-1 || itm.field.indexOf("checkbox:")>-1) itm.enable_HTML=true;
          val = ZtVWeb.makeStdCell(fld, dataIdx, datasource,null,form, true,picture);
          if(!itm.enable_HTML) val=ToHTML(val);
          html = EmptyString(val) ? '-' : val;
          lnk = itm.link;
          if(lnk && this.pinned){
            target = itm.target;
            onclick = itm.onclick;
            lnk = ZtVWeb.makeStdLink(lnk, dataIdx, datasource, null, form, true);
            on_click_str="";
            if(onclick){
              onclick = ZtVWeb.makeStdLink(onclick, dataIdx, datasource, null, form, false);
              on_click_str='onclick="'+onclick+'"';
            }
            if(target=='_blank' || target=='_new'){
              on_click_str="onclick='"+(Empty(onclick)?'':onclick+';')+"ZtVWeb.Popup(this.href,\"\",event);return false;'";
            }
            html = '<a href="'+ToHTML(lnk)+'" target="'+target+'" '+on_click_str+'>'+html+"</a>";
          }
          p_td.innerHTML = html;
          if(p_td=Ctrl(this.ctrlid+itm.id+'_to_column')){
            p_td.style.display = this.pinned ? 'inline-block' : 'none';
          }
          if(p_td=Ctrl(this.ctrlid+'move')){
            p_td.style.display = this.pinned ? 'inline-block' : 'none';
            p_td.style.width=Ctrl(this.ctrlid+'_table').offsetWidth;
          }
          if(p_td=Ctrl(this.ctrlid+'close')){
            p_td.style.display = this.pinned ? 'inline-block' : 'none';
          }
        }
      }
      //var pos = LibJavascript.DOM.getAbsolutePos(nearTo);
      //var pos =nearTo.getBoundingClientRect();
      var pos=LibJavascript.DOM.getPosFromFirstRel(nearTo,this.base_layer.container)
      this.base_layer.container.style.top = (pos.y+nearTo.offsetHeight)+'px'
      this.base_layer.container.style.left = Math.max(pos.x+nearTo.offsetWidth-this.base_layer.container.offsetWidth,0)+'px'
    };
    this.GridCtrl.RowLayer.InitLayerContainer=function(owner_grid){
      var Ctrl = LibJavascript.DOM.Ctrl,
          cont_id = owner_grid.ctrlid+'_RowLayersContainer',
          d = Ctrl(cont_id);
      owner_grid.MakeWrapper();
      if(!d){
        d = document.createElement('div');
        d.id = cont_id;
        d.style.position = 'absolute';
        d.style.top ="0px";
        Ctrl(owner_grid.ctrlid+"_wrapper").appendChild(d);
      }
      d = document.createElement('div');
      d.id = cont_id+'_L';
      d.className = "layer";
      d.style.position = 'absolute';
      d.style.zIndex = 100;
      d.style.display = 'none';

      var ctrlid = owner_grid.ctrlid+"_L_",
          grd_col_drag = owner_grid.draggablecolumns,
          to_droplet=[],
          to_draglet=[],
          i,id,fld,name,itm,rowLayer,l,l_,
          src = ''

      src +=LibJavascript.DOM.buildIcon({type : 'img'
      , id :ctrlid+'close'
      , className : "grid_layer_close buttonMask"
      , image : (SPTheme.grid_layer_closeimage||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_layer_close.png')
      , style : 'vertical-align:middle;border:0;'
      , title : owner_grid.Translations["Close"]
      , alt : owner_grid.Translations["Close"]
      , events: 'onclick="window.'+owner_grid.form.formid+'.'+owner_grid.name+'.HideRowLayer();" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();"'
      });
      src +=LibJavascript.DOM.buildIcon({type : 'div'
      , id :ctrlid+'move'
      , className : "layer_dragger buttonMask"
      , title : owner_grid.Translations["Move"]
      , alt : owner_grid.Translations["Move"]
      , events: 'onMouseDown="ZtVWeb.dragInGrid(event,\''+cont_id+"_L"+'\',\''+owner_grid.ctrlid+'\')"'
      });
      src +='<div class="cb"><div class="bt"><div></div></div><div class="i1"><div class="i2"><div class="i3">';
      src +='<div class="shell">';
      src+='<table id="'+ctrlid+'_table" class="layer_content">';
      for(i=0,rowLayer=owner_grid._rowLayer,l_=rowLayer.length-1; itm=rowLayer[i]; i++){
        if (!itm.inExtGrid || !owner_grid.reduced){
          fld=itm.field;
          id=ctrlid+itm.id;
          name=itm.title;
          if(i>0 && i<l_ && name!=''){
            src+='</td></tr>';
          }
          src+='<tr';
          if(grd_col_drag){
            src+=' id="'+ctrlid+'to_layer_'+i+'"';
            src+=' class="draggable"';
            src+= 'title="'+owner_grid.Translations["Move_to_col"]+'"'
            to_droplet.push({id: ctrlid+'to_layer_'+i, idx: i});
          }
          src+='>';
          src+='<td align="right" valign="top" nowrap class="layer_title">'+name+(EmptyString(name) ? '' : ':&nbsp;')+'</td><td '+(itm.type && itm.type.match("D|T|C")?'nowrap ':'')+'class="layer_fieldValue">';
          if(grd_col_drag){
            src+='<span id="'+id+'_to_column_container">';
          }
          src+='<span id="'+id+'"></span>';
          if(grd_col_drag){
            // src+='&nbsp;<span id="'+id+'_to_column" style="cursor: move;"><img src="'+(SPTheme.grid_img_layer_row_dragger||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_external.png')+'" border="0" title="'+owner_grid.Translations["Move_to_col"]+'" alt="'+owner_grid.Translations["Move_to_col"]+'"></span></span>';
            src+='&nbsp;</span>';
            to_draglet.push({
              // id: id+'_to_column_container',
              // hooker: id+'_to_column',
              // hooker: ctrlid+'to_layer_'+i,
              id: ctrlid+'to_layer_'+i,
              field: {
                title: ( name!='' ? name : fld ),
                idx: i,
                fld_ref: itm//.id
              },
              drag_container: owner_grid.ctrlid+'_draggablecolumns_container'
            });
          }
        }
      }
      src+='</td></tr></table>';
      src+='</div></div></div></div><div class="bb"><div></div></div> </div>';
      d.innerHTML=src;
      Ctrl(cont_id).appendChild(d);

      if(owner_grid.draggablecolumns && owner_grid.DragColumnManager){
        for(i=0,l=to_droplet.length; i<l; i++){
          owner_grid.DragColumnManager.registerDroplet(new Z.DnD.Grid.RowLayer.RowDroplet(to_droplet[i].id, to_droplet[i].idx));
        }
        var arg;
        for(i=0, l=to_draglet.length; i<l; i++){
          arg=to_draglet[i];
          owner_grid.DragColumnManager.registerDraglet(new Z.DnD.Grid.RowLayer.Draglet(arg.id, arg.hooker, arg.field, arg.drag_container));
        }
        owner_grid.DragColumnManager.registerDroplet(new Z.DnD.Grid.RowLayer.MainDroplet(d.id));
      }
      return d;
    }
    // ColumnLayer ----------------------------------------------------------------------------------------------------------------
    this.GridCtrl.ColumnLayer=function(owner_grid,colId){
      this.colId=colId;
      this.grid=owner_grid;
      this.opts={
        delay_show: 500,
        delay_hide: 200
      };
      this.base_layer=new ZtVWeb.Layer();
      this.base_layer.SetContainer(ZtVWeb.GridCtrl.ColumnLayer.InitLayerContainer(owner_grid,colId));
      this.base_layer.addObserver('l',this);
    }
    this.GridCtrl.ColumnLayer.prototype=new this.StdControl();
    this.GridCtrl.ColumnLayer.prototype.Invalidate=function(){
      var html_container;
      if(html_container = LibJavascript.DOM.Ctrl(this.grid.ctrlid+'_ColumnLayersContainer_CL_'+this.colId)){
        html_container.parentNode.removeChild(html_container);
      }
      this.grid=null;
      this.colId=null;
      this.nearTo=null;
      this.dataIdx=null;
      this.pinned=false;
      this.base_layer=null;
    };
    this.GridCtrl.ColumnLayer.prototype.Show=function(nearTo,dataIdx){
      if(!IsA(nearTo,'U'))
        this.nearTo=nearTo;
      if(!IsA(dataIdx,'U'))
        this.dataIdx=dataIdx;
      this.pinned=true;
      this.base_layer.Show();
    }
    this.GridCtrl.ColumnLayer.prototype.Visible=function(){
      return this.base_layer.Visible();
    }
    this.GridCtrl.ColumnLayer.prototype.Hover=function(nearTo,dataIdx){
      if(this.pinned){
        return;
      }

      if(!IsA(nearTo,'U')){
        this.nearTo=nearTo;
      }
      if(!IsA(dataIdx,'U')){
        this.dataIdx=dataIdx;
      }

      var _this=this;

      this.clear_hide=null;
      this.clear_hover=window.setTimeout(function(){
        if(_this.grid && _this.grid['ColLayer_'+_this.colId]!=_this){
          _this.grid=null;
          _this=null;
          return;
        }
        _this.base_layer.Show();
        _this.clear_hover=null;
      }, this.opts.delay_show);

      LibJavascript.Events.addEvent(LibJavascript.DOM.Ctrl(this.nearTo), "mouseout", function(e){
        if(_this.clear_hover){
          window.clearTimeout(_this.clear_hover);
        }

        _this.clear_hide=window.setTimeout(function(){
          _this.HideOut();
        }, _this.opts.delay_hide);
      });

    };
    this.GridCtrl.ColumnLayer.prototype.HideOut=function(){
      if(!this.pinned && this.base_layer)
        this.base_layer.Hide();
    }
    this.GridCtrl.ColumnLayer.prototype.Hide=function(){
      this.base_layer.Hide();
      this.pinned=false;
    }

    this.GridCtrl.ColumnLayer.prototype.l_Show=function(){
      var Ctrl = LibJavascript.DOM.Ctrl,
          nearTo = Ctrl(this.nearTo),
          dataIdx = this.dataIdx,
          colId=this.colId,
          layer = this.grid.GetColById(colId).Layer;

      if(!this.ctrlid){
        this.ctrlid=this.grid.ctrlid+"_CL_"+colId+"_";
      }

      for(var i=0,itm,target,fld,id,p_td,td,datasource=this.grid.datasource,form=this.grid.form,html,lnk,onclick,l=layer.length,on_click_str; itm=layer[i]; i++){
        if (!itm.inExtGrid || !this.grid.reduced){
          fld = itm.field;
          id = itm.id;
          td = Ctrl(this.ctrlid+id);
          html = ZtVWeb.makeStdCell(fld, dataIdx, datasource, null, form, true, itm.picture);
          html = EmptyString(html) ? '-' : html;
          lnk = itm.link;
          if(lnk && this.pinned){
            target = itm.target;
            onclick = itm.onclick;
            if(onclick){
              onclick = ' onclick="'+ZtVWeb.makeStdLink(onclick, dataIdx, datasource, null, form, false)+'" ';
            }

            lnk = ZtVWeb.makeStdLink(lnk, dataIdx, datasource, null, form, true);
            on_click_str="";
            if(onclick){
              onclick = ZtVWeb.makeStdLink(onclick, dataIdx, datasource, null, form, false);
              on_click_str='onclick="'+onclick+'"';
            }
            if(target=='_blank' || target=='_new'){
              on_click_str="onclick='"+(Empty(onclick)?'':onclick+';')+"ZtVWeb.Popup(this.href,\"\",event);return false;'";
            }
            html = '<a href="'+ToHTML(lnk)+'" target="'+target+'" '+on_click_str+'>'+html+"</a>";
          }
          td.innerHTML = html;
          if(td = Ctrl(this.ctrlid+id+'_to_column')){
            td.style.display=this.pinned ? 'inline-block' : 'none';
          }
          if(p_td=Ctrl(this.ctrlid+'move')){
            p_td.style.display = this.pinned ? 'inline-block' : 'none';
            p_td.style.width=Ctrl(this.ctrlid+'table').offsetWidth;
          }
          if(p_td=Ctrl(this.ctrlid+'close')){
            p_td.style.display = this.pinned ? 'inline-block' : 'none';
          }
        }
      }
      //var pos = LibJavascript.DOM.getAbsolutePos(nearTo);
      //var pos =nearTo.getBoundingClientRect();
      var pos=LibJavascript.DOM.getPosFromFirstRel(nearTo,this.base_layer.container)
      this.base_layer.container.style.top = (pos.y+nearTo.offsetHeight)+'px'
      this.base_layer.container.style.left = Math.max(pos.x+nearTo.offsetWidth-this.base_layer.container.offsetWidth,0)+'px'
    };
    this.GridCtrl.ColumnLayer.InitLayerContainer=function(owner_grid,colId){
      var Ctrl = LibJavascript.DOM.Ctrl,
          cont_id = owner_grid.ctrlid+'_ColumnLayersContainer',
          d = Ctrl(cont_id);
      owner_grid.MakeWrapper();
      if(!d){
        d = document.createElement('div');
        d.id = cont_id;
        d.style.position = 'absolute';
        d.style.top = "0px";
        //Ctrl("tbl_"+owner_grid.ctrlid+"_container").appendChild(d);
        Ctrl(owner_grid.ctrlid+"_wrapper").appendChild(d);
      }
      d = document.createElement('div');
      d.id = cont_id+"_CL_"+colId
      d.className = "layer";
      d.style.position = 'absolute';
      d.style.zIndex = 100;
      d.style.display = 'none';
      var ctrlid = owner_grid.ctrlid+"_CL_"+colId+"_",
        col = owner_grid.GetColById(colId),
        cl_items = col.Layer,
        grd_col_drag = owner_grid.draggablecolumns,
        to_droplet = [],
        to_draglet = [],
        i,fld,itm,id,name,l_,l,
        src = '';
      src +=LibJavascript.DOM.buildIcon({type : 'img'
      , id :ctrlid+'close'
      , className : "grid_layer_close buttonMask"
      , image : (SPTheme.grid_layer_closeimage||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_layer_close.png')
      , style : 'vertical-align:middle;border:0;'
      , title : owner_grid.Translations["Close"]
      , alt : owner_grid.Translations["Close"]
      , events: 'onclick="window.'+owner_grid.form.formid+'.'+owner_grid.name+'.HideColumnLayer(\''+colId+'\');" onMouseDown="event.cancelBubble = true;if (event.stopPropagation) event.stopPropagation();"'
      });
      src +=LibJavascript.DOM.buildIcon({type : 'div'
      , id :ctrlid+'move'
      , className : "layer_dragger buttonMask"
      , title : owner_grid.Translations["Move"]
      , alt : owner_grid.Translations["Move"]
      , events: 'onMouseDown="ZtVWeb.dragInGrid(event,\''+cont_id+"_CL_"+colId+'\',\''+owner_grid.ctrlid+'\')"'
      });

      src +='<div class="cb"><div class="bt"><div></div></div><div class="i1"><div class="i2"><div class="i3">';
      src +='<div class="shell">';

      src += '<table id="'+ctrlid+'table" class="layer_content">';
      for(i=0,l_=cl_items.length-1; itm=cl_items[i]; i++){
        if (!itm.inExtGrid || !owner_grid.reduced){
          fld = itm.field;
          id = ctrlid+itm.id;
          name = itm.title;
          if(i>0 && i<l_ && name!=''){
            src += '</td></tr>';
          }
          src += '<tr';
          if(grd_col_drag){
            src += ' id="'+ctrlid+'to_column_layer_'+i+'"';
            src+=' class="draggable"';
            src+= 'title="'+owner_grid.Translations["Move_to_col"]+'"'
            to_droplet.push({
              id: ctrlid+'to_column_layer_'+i,
              idx: i
            });
          }
          src += '><td align="right" valign="top" nowrap class="layer_title">'+name+(EmptyString(name) ? '' : ':&nbsp;')+'</td><td '+(itm.type && itm.type.match("D|T|C")?'nowrap ':'') +'class="layer_fieldValue">';
          src += '<span id="'+id+'"></span>';
          if(grd_col_drag){
            src += '<span id="'+id+'_to_column_container">';
          }
          if(grd_col_drag){
            // src+='&nbsp;<span id="'+id+'_to_column" style="cursor: move;"><img src="'+(SPTheme.grid_img_layer_row_dragger||ZtVWeb.SPWebRootURL+'/visualweb/images/grid_external.png')+'" border="0" title="'+owner_grid.Translations["Move_to_col"]+'" alt="'+owner_grid.Translations["Move_to_col"]+'"></span></span>';
            src+='&nbsp;</span>';
            to_draglet.push({
              // id: id+'_to_column_container',
              id: ctrlid+'to_column_layer_'+i,
              // hooker: id+'_to_column',
              field: {
                title: ( name!='' ? name : fld ),
                idx: i,
                colLayerId: colId,
                fld_ref: itm//.id
              },
              drag_container: owner_grid.ctrlid+'_draggablecolumns_container'
            });
          }
        }
      }
      src += '</td></tr></table>';
      src+='</div></div></div></div><div class="bb"><div></div></div> </div>';
      d.innerHTML = src;
      Ctrl(cont_id).appendChild(d);
      if(owner_grid.draggablecolumns && owner_grid.DragColumnManager){
        for(i=0,l=to_droplet.length; i<l; i++){
          owner_grid.DragColumnManager.registerDroplet(new Z.DnD.Grid.ColumnLayer.RowDroplet(to_droplet[i].id, to_droplet[i].idx, colId));
        }
        var arg;
        for(i=0, l=to_draglet.length; i<l; i++){
          arg=to_draglet[i];
          owner_grid.DragColumnManager.registerDraglet(new Z.DnD.Grid.ColumnLayer.Draglet(arg.id, arg.hooker, arg.field, arg.drag_container));
        }
        owner_grid.DragColumnManager.registerDroplet(new Z.DnD.Grid.ColumnLayer.MainDroplet(d.id, colId));
      }
      return d;
    }

    // MemoLayer ----------------------------------------------------------------------------------------------------------------
    this.GridCtrl.MemoLayer=function(owner_grid,colId){
      this.colId=colId;
      this.grid=owner_grid;
      this.opts={
        delay_show: 500,
        delay_hide: 200
      };
      this.base_layer=new ZtVWeb.Layer();
      this.base_layer.SetContainer(ZtVWeb.GridCtrl.MemoLayer.InitLayerContainer(owner_grid,colId));
      this.base_layer.addObserver('l',this);
    }
    this.GridCtrl.MemoLayer.prototype=new this.StdControl();
    this.GridCtrl.MemoLayer.prototype.Invalidate=function(){
      var html_container;
      if(html_container = LibJavascript.DOM.Ctrl(this.grid.ctrlid+'_MemoLayersContainer_ML_'+this.colId)){
        html_container.parentNode.removeChild(html_container);
      }
      this.grid=null;
      this.colId=null;
      this.nearTo=null;
      this.dataIdx=null;
      this.base_layer=null;
    };
    this.GridCtrl.MemoLayer.prototype.Show=function(nearTo,dataIdx){
      if(!IsA(nearTo,'U'))
        this.nearTo=nearTo;
      if(!IsA(dataIdx,'U'))
        this.dataIdx=dataIdx;
      this.pinned=true;
      this.base_layer.Show();
    }
    this.GridCtrl.MemoLayer.prototype.Visible=function(){
      return this.base_layer.Visible();
    }
    this.GridCtrl.MemoLayer.prototype.Hover=function(nearTo,dataIdx){
      if(this.pinned){
        return;
      }
      if(!IsA(nearTo,'U')){
        this.nearTo=nearTo;
      }
      if(!IsA(dataIdx,'U')){
        this.dataIdx=dataIdx;
      }
      var _this=this;
      this.clear_hide=null;
      this.clear_hover=window.setTimeout(function(){
        if(_this.grid && _this.grid['MemoLayer_'+_this.colId]!=_this){
          _this.grid=null;
          _this=null;
          return;
        }
        _this.base_layer.Show();
        _this.clear_hover=null;
      }, this.opts.delay_show);

      LibJavascript.Events.addEvent(LibJavascript.DOM.Ctrl(this.nearTo), "mouseout", function(e){
        if(_this.clear_hover){
          window.clearTimeout(_this.clear_hover);
        }
        _this.clear_hide=window.setTimeout(function(){
          _this.HideOut();
        }, _this.opts.delay_hide);
      });
    };
    this.GridCtrl.MemoLayer.prototype.HideOut=function(){
      if(!this.pinned && this.base_layer)
        this.base_layer.Hide();
    }
    this.GridCtrl.MemoLayer.prototype.Hide=function(){
      this.base_layer.Hide();
      this.pinned=false;
    }

    this.GridCtrl.MemoLayer.prototype.l_Show=function(){
      var Ctrl = LibJavascript.DOM.Ctrl,
          nearTo = Ctrl(this.nearTo),
          dataIdx = this.dataIdx,
          colId=this.colId,
          itm = this.grid.GetColById(colId),
          datasource=this.grid.datasource,
          form=this.grid.form,
          fld,id,td,html;
      if(!this.ctrlid){
        this.ctrlid=this.grid.ctrlid+"_ML_"+colId+"_";
      }
      fld = itm.field;
      id = itm.id;
      td = Ctrl(this.ctrlid+id);
      html = ZtVWeb.makeStdCell(fld, dataIdx, datasource, null, form, true, itm.picture);
      if(itm.editable){
        this.grid.mem_curs.GoTo(this.grid.findCurRowInMemCurs(dataIdx));
        html=ZtVWeb.applyPicture(this.grid.mem_curs.get(itm.field+"_new"),itm.type,0,itm.picture) || html;
      }
      html=(EmptyString(html) ? '&nbsp;' : ToHTag(RTrim(html+'')))
      td.innerHTML = html;
      var mode = false;
      if (itm.Layer.length>0) mode = true; //pezza perche' si crea una tabella
      var pos=LibJavascript.DOM.getPosFromFirstRel(nearTo,this.base_layer.container);
      this.base_layer.container.style.top = (pos.y)+'px';
      var positionMemo="right";
      if ((pos.x-5)>(this.grid.Ctrl.offsetWidth-(pos.x+nearTo.offsetWidth+5))) positionMemo="left"
      if (positionMemo=="right") {
        this.base_layer.container.style.left = Math.max((pos.x+nearTo.offsetWidth+5),0)+"px";
        this.base_layer.container.style.width = (this.grid.Ctrl.offsetWidth-Math.max((pos.x+nearTo.offsetWidth+5),0))+"px"
      } else if (positionMemo=="left") {
        this.base_layer.container.style.left = 0;
        this.base_layer.container.style.width = (pos.x-5)+"px"
      }
      if(this.base_layer.container.offsetLeft<0) this.base_layer.container.style.left=0;
    };
    this.GridCtrl.MemoLayer.InitLayerContainer=function(owner_grid,colId){
      var Ctrl = LibJavascript.DOM.Ctrl,
          cont_id = owner_grid.ctrlid+'_MemoLayersContainer',
          d = Ctrl(cont_id);
      if(!d){
        d = document.createElement('div');
        d.id = cont_id;
        d.style.position = "absolute";
        d.style.top = "0px";
        Ctrl("tbl_"+owner_grid.ctrlid+"_container").appendChild(d);
      }
      d = document.createElement('div');
      d.id = cont_id+"_ML_"+colId
      d.style.position = 'absolute';
      d.style.zIndex = 100;
      d.style.display = 'none';
      var ctrlid = owner_grid.ctrlid+"_ML_"+colId+"_",
          itm = owner_grid.GetColById(colId),
          grd_col_drag = owner_grid.draggablecolumns,
          src = '<div id="'+ctrlid+'table" class="layer">',
          id = ctrlid+itm.id;
      src += '<div class="layer_fieldValue"><div id="'+id+'"></div></div></div>';
      d.innerHTML = src;
      Ctrl(cont_id).appendChild(d);
      return d;
    }
    this.GridCtrl.prototype.SetOrderBy=function() {
      var Cols = ( arguments.length>0 ? ( typeof( arguments[0] ) =='object' && arguments[0].$constructor == Array ? arguments[0] : arguments ) : [] )
      var ordered_cols=[], objCols = {}, i, _col;
      for (i=0;i<Cols.length;i=i+2) {
        var orderbystatus = (Cols[i+1]=='desc' ? 'desc' : 'asc');
        ordered_cols.push({
          orderbyfld:Cols[i]
        , orderbystatus: orderbystatus
        });
        objCols[Cols[i]] = {
          idx : (i/2) + 1
        , orderbystatus : orderbystatus
        }
      }
      for (i=0;i<this.Cols.length;i++) {
        _col = this.Cols[i];
        if (_col.orderbyfld!='') {
          if (_col.orderbyfld in objCols) {
            _col.orderbystatus = objCols[_col.orderbyfld].orderbystatus;
            _col.orderbyidx = objCols[_col.orderbyfld].idx;
          } else {
            _col.orderbyidx = 0;
            _col.orderbystatus = '';
          }
        }
      }
      var ordbystr='';
      for(i=0; _col=ordered_cols[i]; i++){
        ordbystr += _col.orderbyfld+
          (_col.orderbystatus=='desc' ? ' desc' : '')+
          (i!=ordered_cols.length-1 ? ', ' : '');
      }
      this.datasource.SetOrderBy(ordbystr);
    }

    // SQLDataProvider ----------------------------------------------------------------------------------------------------------------
    this.SQLDataProvider=function(form,name,cmd,parms,nrows,parms_source,fieldstype,count,async,cmdHash,appendingData){
      this.form=form
      this.name=name
      this.cmd=cmd
      this.Data=new Array();
      this.orderby=""
      this.parms_source=parms_source
      this.fieldstypearray=null
      this.parms=parms
      this.queryfilter=""
      this.fieldstype=fieldstype||'false';
      this.async=(async=='true'?true:false);
      this.count=count||'false';
      this.querycount=-1;
      this.cmdHash=(cmdHash==null?'':cmdHash);
      this.bof=true
      this.eof=false
      this.nRows= (typeof(nrows)=='undefined' || nrows<=0) ? 10 : nrows-0; // di default carica 10 record
      this.nStartRow=0
      this.atQueryEnd=''
      this.totalizeParms='';
      this.appendingData=appendingData || false;
      this.isStaticDataProvider = false;
      var _forceRecordChanged=false; //variabile per forzare il dispatch del Record Changed
      StdEventSrc.call( this );
      this._getCloneForPrint = function() { // ritorna un clone base, sopratutto senza i consumers del dataprovider
        var ret = new ZtVWeb.SQLDataProvider(this.form,this.name,this.cmd,this.parms,this.nRows,this.parms_source,this.fieldstype,this.count,this.async,this.cmdHash,false);
        ret.queryfilter = this.queryfilter;
        ret.orderby = this.orderby;
        ret.isStaticDataProvider = this.isStaticDataProvider;
        if(this.isStaticDataProvider) {
          ret.nRecs = this.nRecs;
          ret.Data = this.Data;
          ret.Fields_Case = this.Fields_Case;
          ret.FieldsCase_map = {};
          ret.Fields_map={};
        }
        return ret;
      }
      this.GetForceRecordChanged=function() {
        return _forceRecordChanged;
      }
      this.SetForceRecordChanged=function(forceRC) {
        _forceRecordChanged=forceRC;
      }
      this.getGlobalCurRec=function(){
        return this.nStartRow+this.curRec
      }
      this.Next=function(){
        if (this.curRec<this.nRecs){
          this.curRec+=1
          this._setLimitValues()
          this.refreshConsumers(false)
          return(true)
        } else if (this.curRec==this.nRecs && !this.eof) {
          this.nStartRow+=this.nRows
          this.Query(true)
        } else
          return(false)
      }
      this.NextPage=function(noRender){
        if ((this.nRecs%this.nRows) == 0 && !this.eof){
          this.nStartRow=this.nStartRow+this.nRows
          this.Query(true,noRender)
          return(true)
        }
        return(false)
      }
      this.LastPage=function(){
        this.nStartRow=this.nRows* parseInt(((this.querycount-1)/this.nRows))
        if(!this.eof) {
          this.Query(true)
        } else if (this.atQueryEnd=='last') {
          this.curRec=this.nRecs
          this.refreshConsumers(false)
        } else if (this.atQueryEnd.substring(0,9)=="lastpage ") {
          var rows=this.atQueryEnd.substring(9)-0
          this.curRec=Math.floor(((this.nRecs)-1)/rows)*rows+1
          this.refreshConsumers(false)
        }
        return true
      }
      this.GoToPage=function(curRec){
        if (curRec>this.getAllRecsCount() && this.querycount==-1) {
          var oldcount=this.count;
          this.count='true';
          var oldasync=this.async;
          this.async=false;
          this.dontupdate=true;
          this.Query();
          this.dontupdate=false;
          this.async=oldasync;
          this.count=oldcount;
        }
        if (curRec>this.getAllRecsCount()) return false;
        if (curRec>this.nStartRow+this.nRows || curRec<=this.nStartRow){
          this.nStartRow=Math.ceil((curRec/this.nRows)-1)*this.nRows;
          this.Query(true)
          return true;
        }
        return false;
      }
      this.FirstPage=function(){
        this.nStartRow=0
        if(!this.Bof()) {
          this.Query(true)
        } else {
          this.curRec=1
          this._setLimitValues()
          this.refreshConsumers(false)
        }
        return true
      }
      this.Prev=function(){
        if (this.curRec>1){
          this.curRec-=1
          this._setLimitValues()
          this.refreshConsumers(false)
          return(true)
        } else if (this.nStartRow>0) {
          this.nStartRow-=this.nRows
          this.atQueryEnd='last'
          this.Query(true)
          // spostato per query asincrone
        } else
          return(false)
      }
      this.PrevPage=function(){
        if (this.nStartRow>0){
          this.nStartRow-=this.nRows
          if(this.nStartRow<0) this.nStartRow=0
          this.Query(true)
          return true;
        }else
          return false;
      }
      this.Eof=function(){
        if(this.GetQueryCount()==0 || (this.eof && this.GetQueryCount()==this.nStartRow+this.curRec))
          return true;
        else
          return false;
      }
      this.Bof=function(){ // Dice se è nel primo set di risultati
        return this.bof
      }
      this.isLastRec=function(){
        return this.Eof();
      }
      this.isFirstRec=function(){
        return (this.bof && this.curRec==1);
      }
      this.CurRec=function(){
        return this.curRec
      }
      this.IsEmpty=/*DEPRECATA-->*/this.isEmpty/*<--DEPRECATA*/=function(){
        return this.Data.length<=1;
      }
      this.getRecCount=function(){
        return this.nRecs
      }
      this.GetQueryCount=function(){
        return this.querycount
      }
      this.ChangeQuery=function(newQuery){
        this.querycount=-1
        this.cmd=newQuery
      }
      this.dataconsumers=[];
      this.rowsconsumers=[];
      this.paramconsumers=[];
      this.addDataConsumer=function(ctrl,fld){
        this.dataconsumers.push(new Array(ctrl,fld));
      }
      this.addRowConsumer=function(ctrl){
        if(ctrl!=null) {
          this.rowsconsumers.push(ctrl);
          if ('datasource' in ctrl) {
            ctrl.datasource=this;
          }
        }
      }
      this.addParmConsumer=function(ctrl){
        this.paramconsumers.push(ctrl);
      }
      this.getType=function(fld){
        if(this.fieldstypearray!=null){
          return this.fieldstypearray[this.getFldIdx(fld)];
        }else
          return 'C';
      }
      // funzione unica per il refresh di tutti i dati
      this.refreshConsumers=function(newrows){
        var equalsRs=function(rs1,rs2){
          var r;
          if ((rs1==null && rs2 !=null) || (rs1!=null && rs2 ==null)) return false
          for (r in rs1){
            if (!Eq(rs1[r],rs2[r])) return false;
          }
          for (r in rs2){
            if (!Eq(rs1[r],rs2[r])) return false;
          }
          return true;
        }
        var oldRs=this.rs;
        this.rs={}; // Costruzione dell'rs
        for(var j=0, l=this.Fields_Case.length+1, fld; (fld=this.Fields_Case[j++]) || j<l; this.rs[fld]= this.rs[fld.toLowerCase()]= this.rs[fld.toUpperCase()]=this.getField(fld));
        this.refreshDataConsumers(this.dataconsumers,newrows,this.rs);
        this.refreshRowsConsumers(this.rowsconsumers,newrows);
        this.refreshParamsConsumers(this.paramconsumers,newrows);
        if (_forceRecordChanged || !equalsRs(this.rs,oldRs)) {
          this.dispatchEvent("RecordChanged");
          _forceRecordChanged=false;
        }
        //setTimeout("ZtVWeb.AdjustHidden()",100);
      }

      this.refreshDataConsumers=function(dataconsumers,newrows,rs){
        for(var i=0;i<dataconsumers.length;i++)
          this.refreshDataconsumer(dataconsumers[i],newrows,rs);
      }

      this.refreshDataconsumer=function(dataconsumer,newrows,rs){
        dataconsumer.rendered=true;
        var fieldstr=dataconsumer[1]
        dataconsumer[0].rs=rs
        fieldstr=ZtVWeb.makeStdCell(fieldstr,(this.curRec-1),this,rs,this.form,null)
        if(dataconsumer[0].Set)
          dataconsumer[0].Set(fieldstr);
        else
          dataconsumer[0].Value(fieldstr);
      }

      this.refreshRowsConsumers=function(rowsconsumers,newrows){
        for(var i=0;i<rowsconsumers.length;i++)
          this.refreshRowsConsumer(rowsconsumers[i],newrows);
      }

      this.refreshRowsConsumer=function(rowsconsumer,newrows){
        rowsconsumer.rendered=true;
        if (newrows){
          return rowsconsumer.FillData(this);
        }
        if(rowsconsumer.UpdateCurRec)
          rowsconsumer.UpdateCurRec(this);
      }

      this.refreshParamsConsumers=function(paramconsumers,newrows){
        for(var i=0;i<paramconsumers.length;i++)
          this.refreshParamconsumer(paramconsumers[i]);
      }

      this.refreshParamconsumer=function(paramconsumer,newtrows){
        paramconsumer.rendered=true;
        paramconsumer.paramUpdated();
      };

      // Rifa' la query
      this.paramUpdated=function(){
        this.Query();
      }
      this.hasField=function(fld){
        return this.getFldIdx(fld)>-1;
      }
      this.getFldIdx=function(fld){
        //cerca prima nelle mappe, poi cerca l'indice con un indexOf e popola le mappe
        var p=-1;
        var fldLowerCase;
        if(this.FieldsCase_map){
          p=this.FieldsCase_map[fld];
        }
        if(p==null && this.Fields_map){
          fldLowerCase=fld.toLowerCase();
          p=this.Fields_map[fldLowerCase];
        }
        if(p==null){
          p=-1;
          if(this.Fields_Case){
            p=LibJavascript.Array.indexOf(this.Fields_Case,fld);
          }
          if(p==-1 && this.Fields){
            p=LibJavascript.Array.indexOf(this.Fields,fldLowerCase||fld.toLowerCase());
          }
          if(p!=-1){
            this.FieldsCase_map[fld]=p;
            this.Fields_map[fldLowerCase||fld.toLowerCase()]=p;
          }
        }
        return p;
      }
      this._getV=function(nRec,cFldName,toValue){
        var p=this.getFldIdx(cFldName)
        if (p==-1) return ' ';
        nRec= IsAny(nRec) ? nRec : this.curRec-1;
        if(!this.Data[nRec])
          return '';
        var v=this.Data[nRec][p];
        if (nRec==this.nRecs)
          v='';
        if(toValue && this.fieldstypearray!=null){
          if(this.fieldstypearray[p] && this.fieldstypearray[p].match(/M|C/))
            return RTrim(ZtVWeb.strToValue(v,this.fieldstypearray[p]));
          else
            return ZtVWeb.strToValue(v,this.fieldstypearray[p]);
        }else{
          return v;
        }
      }
      this.getStr=function(nRec,cFldName){
        return this._getV(nRec,cFldName,false).toString();
      }
      this.getValue=function(nRec,cFldName){
        return this._getV(nRec,cFldName,true)
      }
      this.toRS=function(nRec){
        var rs={};
        for(var i=0;i<this.Fields_Case.length; i++){
          rs[this.Fields_Case[i]]=this.Data[nRec][i];
        }
        return rs;
      }
      this.getField=function(fld,_startIdx){
        var curRec = (_startIdx||0) + this.curRec;
        var p=this.getFldIdx(fld)
        if(this.fieldstypearray!=null)
          if (p!=-1 && curRec<=this.nRecs)
            return ZtVWeb.strToValue(this.Data[curRec-1][p],this.fieldstypearray[p])
          else
            return ZtVWeb.strToValue('',this.fieldstypearray[p])
        else{
          if(this.Data[curRec-1]!=null && this.Data[curRec-1][p]==null) return ""
          try{
            return this.Data[curRec-1][p]
          } catch(e) {
            return ""
          }
        }
      }
      this.getParam=function(fld){
        return this.getField(fld)
      }
      this.isExtData=false;
      this.FillExtData=function(flds,data){
        this.isExtData=true;
        JSONObj={'Fields':flds,'Data':data};
        var queryprop=JSONObj.Data[JSONObj.Data.length-1].split(",");
        this.querycount=parseInt(queryprop[2],10);
        this.Empty();
        this.nRows=(this.GetQueryCount()>-1?this.GetQueryCount():this.nRows);
        this.RenderQuery(null,JSONObj);
      }
      this.setOrderBy=function(orderby){
        this.orderby='&orderby='+URLenc(orderby)
      }
      this.SetOrderBy=function(orderby){this.setOrderBy(orderby);}
      this.QueryTimeStamp=function(timestamp,bUseStartRow){
        this.Query(bUseStartRow,null,null,timestamp);
      }
      this.ParseParameters=function() {
        // Valorizzazione dei parametri
        this.strparms=''
        var aparms=this.parms.split(','), valpar;
        for(var i=0,nome1,nome2;i<aparms.length;i++){
          if(!Empty(aparms[i])){
            if(aparms[i].indexOf('=')>-1){
              nome1=Trim(LTrim(aparms[i].substring(0,aparms[i].indexOf('='))))
              nome2=Trim(LTrim(aparms[i].substring(aparms[i].indexOf('=')+1)))
            }else{
              nome1=Trim(LTrim(aparms[i]))
              nome2=Trim(LTrim(nome1))
            }
            if (Empty(this.parms_source)){
              if (this.form[nome2])
                valpar=this.form[nome2].Value();
              else valpar=nome2;
              this.strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))
            }else{
              //prende parametri misti sia dal Parms_source sia da textbox
              if((typeof(this.form[nome2]))=='undefined'){
                valpar=this.form[this.parms_source].getParam(nome2); //eval('this.form.'+this.parms_source+'.getParam("'+nome2+'")')
                this.strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))
              }else{
                valpar=this.form[nome2].Value();
                this.strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))
              }
            }
          }
        }
        if(!Empty(this.queryfilter)) this.strparms="&queryfilter="+URLenc(this.queryfilter)+this.strparms
        this.strparms=this.orderby+this.strparms;
      }
      var gridFiltered = null;
      var gridFiltered_colId = null;
      var gridFiltered_thId = null;
      this.ValuesList=function(fieldName, grid,colId,thId) {
        gridFiltered = grid;
        gridFiltered_colId = colId;
        gridFiltered_thId = thId;
        var oldqueryfilter = this.queryfilter;
        var fltrs = this.queryfilter.split(' and ');
        var newqueryfilter = "", sep ="";
        for (var ii=0; ii<fltrs.length; ii++) {
          fldFound = LRTrim(fltrs[ii]).split(" ", 1);
          if  (! (fldFound[0].toLowerCase() == fieldName.toLowerCase() || (fldFound[0][0]=='(' && Substr(fldFound[0].toLowerCase(),2) == fieldName.toLowerCase()))) {
          newqueryfilter = newqueryfilter + sep + fltrs[ii];
          sep = " and ";
          }
        }
        this.queryfilter = newqueryfilter;
        this.ParseParameters();
        if(!Empty(this.cmd)) {
          this._doQuery(new Date().getTime().toString(),fieldName);
        }
        this.queryfilter = oldqueryfilter;
      }
      this.RenderFieldList=function(output,_JSONObj,timestamp) {
        var JSONObj
        if(typeof(_JSONObj)=='string'){
          if (Left(_JSONObj,1)!='{')
            _JSONObj=LibJavascript.xap('prova',_JSONObj);
          JSONObj= eval("("+_JSONObj+")");
        }else
          JSONObj= _JSONObj;
        if (JSONObj.ERROR) {
          alert(JSONObj.ERROR);
          return;
        }
        if (gridFiltered && gridFiltered.ShowFieldList) {
          gridFiltered.ShowFieldList(JSONObj,gridFiltered_colId,gridFiltered_thId);
        }
        gridFiltered = null;
      }
      this.Query=function(bUseStartRow,output_server,JSObj,timestamp){
        if (Empty(timestamp)) timestamp=new Date().getTime().toString();
        var output,valpar
        //si azzera l'indice di riga
        if (typeof(bUseStartRow)=='undefined' || !bUseStartRow) {
          this.nStartRow=0
          this._resetLimitValues()
        }
        this.dispatchEvent('BeforeQuery');
        if(typeof(output_server)=='undefined' || output_server==null){
          this.ParseParameters();
          if(!Empty(this.cmd)) {
            this._doQuery(timestamp);
          }else if(this.isExtData){
            this.RenderQuery(null,JSObj);
          }
          else if(this.isStaticDataProvider){
            this.curRec = 1;
            this.dispatchEvent('QueryExecuted');
            this.refreshConsumers(true);
            this.dispatchEvent('ConsumersRendered');
            return true;
          }
        } else {
          output=output_server;
          this.RenderQuery(output,JSObj,timestamp);
        }
      }
      this._doQuery = function(timestamp,fldToViewList) {
        var countrec = 'false';
        if ( this.count=='true' ) {
          countrec = this.nStartRow > 0 ? 'false' : 'true';//conta i record in partenza
        }
        var addr = ZtVWeb.SPWebRootURL + '/servlet/SQLDataProviderServer'
                 + '?rows='+this.nRows
                 + '&startrow='+this.nStartRow
                 + '&count='+countrec
                 + '&cmdhash='+this.cmdHash
                 + '&sqlcmd='+URLenc(this.cmd)
                 + (fldToViewList ? '&fldToViewList='+URLenc(fldToViewList) : '')
                 + this.strparms
                 + ( this.totalizeParms != '' ? '&'+this.totalizeParms : '' )
                 + ( this.orderby != '' ? this.orderby : '' )
                 + (JSURL.GetID() ? '&m_c'+'Check='+LibJavascript.tkn(JSURL.GetID(),this.cmd) : '')
                 ;
        if ( this.async ) {
          new ZtVWeb.JSURL(addr,true,'window.'+this.form.formid+'.'+this.name+'.'+(Empty(fldToViewList)?'RenderQuery':'RenderFieldList'),null,timestamp).Response();
        } else {
          var output = new ZtVWeb.JSURL(addr,true).Response();
          if ( output != "" ) {
            if (Empty(fldToViewList)) {
              this.RenderQuery('', output, timestamp);
            } else {
              this.RenderQuery('', output, timestamp);
            }
          }
        }
      }

      var JSONObj=null;
      this.parseJSONObj = function(_JSONObj){
        var JSONObj;
        if(typeof(_JSONObj)=='string'){
          if (Left(_JSONObj,1)!='{')
            _JSONObj=LibJavascript.xap('prova',_JSONObj);
          JSONObj= eval("("+_JSONObj+")");
        }else{
          JSONObj= _JSONObj;
        }
        if(this.appendingData) //Accoda i dati
          if( this.nStartRow > 0 && JSONObj.Data ){ //Non siamo in prima pagina
            JSONObj.Data[JSONObj.Data.length - 1] = "t" + Substr(JSONObj.Data[JSONObj.Data.length - 1],2);
            this.Data.splice( this.nStartRow, this.Data.length - this.nStartRow);
            Array.prototype.push.apply(this.Data,JSONObj.Data);
            JSONObj.Data = this.Data;
          }
        return JSONObj;
      }
      this.RenderQuery=function(output,_JSONObj,timestamp){
        JSONObj = this.parseJSONObj(_JSONObj);
        if (JSONObj.ERROR) {
          alert(JSONObj.ERROR);
          return;
        }
        var i, j, col, cl, rl, _col;
        // JSON result-----------------------------------------
        this.lastTimestamp=timestamp;
        this.Fields_Case=JSONObj.Fields
        this.Fields=[].concat(this.Fields_Case)
        this.FieldsCase_map={};
        this.Fields_map={};
        this.ToDateCurrentlyValid=JSONObj.ToDateCurrentlyValid||false
        for(j=0;j<this.Fields.length;j++){this.Fields[j]=this.Fields[j].toLowerCase();}
        this.Data=JSONObj.Data;
        var queryprop=JSONObj.Data[JSONObj.Data.length-1].split(",")
        if(queryprop[0].charAt(0)=='t')
          this.bof=true
        else
          this.bof=false
        if(queryprop[0].charAt(1)!='t')
          this.eof=true
        else
          this.eof=false
        if(this.fieldstype=='true')
          this.fieldstypearray=queryprop[1].split("");
        if(this.strparmsold!=this.strparms && this.count=='false' ) this.querycount=-1 // se cambiano i parametri della query
        this.nRecs=this.Data.length-1;
        var newquerycount=parseInt(queryprop[2],10);
        if (newquerycount==-1 && (this.nStartRow+this.nRecs>=this.querycount)) {
          this.querycount=-1;
          this._allRecsCount=0;
        } else if(newquerycount!=-1 || this.querycount==-2)
          this.querycount=newquerycount;
        else if(this.eof)
          this.querycount=this.nStartRow+this.nRecs;

        this.Captions=EmptyArray(JSONObj.Captions)?[].concat(this.Fields_Case):JSONObj.Captions;
        this.RowLayer=JSONObj.RowLayer||[];
        this.Cols=JSONObj.Cols||[];
        //this.extFields=[];
        this.LayerContents=JSONObj.LayerContents;
        this.IsImage=JSONObj.IsImage;
        this.Tooltips=JSONObj.Tooltips||[];
        this.Links=JSONObj.Links||[];
        this.Targets=JSONObj.Targets||[];
        this.InGrid=JSONObj.InGrid||[];
        this.InExtGrid=JSONObj.InExtGrid||[];
        if (JSONObj.Totals){
          for (j=0; j<JSONObj.Totals.Fields.length;j++){
            JSONObj.Totals.Fields[j]=this.oldAliasTotalizer[j];
          }
          if(this.form[this.totalizeCtrl]){
            this.form[this.totalizeCtrl].RenderQuery('',JSONObj.Totals)
          }
          for (i=0; i<this.rowsconsumers.length; i++){
            if(this.rowsconsumers[i].renderTotals){
              this.rowsconsumers[i].Totals=[];
              for(j=0;j<JSONObj.Totals.Data.length;j++){
                this.rowsconsumers[i].Totals[j]={};
              }
              for(j=0, col; col=this.rowsconsumers[i].Cols[j]; j++){
                var idx;
                if ((idx=LibJavascript.Array.indexOf(JSONObj.Totals.Fields,col.field))!=-1){
                  if(this.totalizeDescr.length){
                    if(this.totalizeDescr[idx]) {
                      var descr="";
                      if (Left(this.totalizeDescr[idx],1)=="%") {
                        descr = col.title;
                      } else {
                        descr = this.totalizeDescr[idx];
                      }
                      this.rowsconsumers[i].Totals[JSONObj.Totals.Data.length-1][col.field]=descr;
                    } else {
                      this.rowsconsumers[i].Totals[JSONObj.Totals.Data.length-1][col.field]=this.totalizeExpr[idx];
                    }
                    if (!Empty(this.pictureTotalizer[idx])) col.pict_total =this.pictureTotalizer[idx].replace(/\|/g, ",");
                  }
                  for (var k=0;k<JSONObj.Totals.Data.length-1;k++)
                    this.rowsconsumers[i].Totals[k][col.field]=JSONObj.Totals.Data[k][idx];
                }
              }
            }
          }
        }
        if (this.nStartRow>0 && this.nRecs<=0) {
          this.PrevPage();
          return;
        }
        if (this.keepCurRec){
          this.keepCurRec=false;
          if (this.curRec>this.nRecs) this.curRec=1;
        } else {
          this.curRec=1;
        }
        this._setLimitValues()
        if (this.atQueryEnd=='last') {
          this.curRec=this.nRecs
        } else if (this.atQueryEnd.substring(0,9)=="lastpage ") {
          var rows=this.atQueryEnd.substring(9)-0
          this.curRec=Math.floor(((this.nRecs)-1)/rows)*rows+1
        }
        if (!this.dontupdate) {
          this.dispatchEvent('QueryExecuted');
          this.refreshConsumers(true);
          this.dispatchEvent('ConsumersRendered');
        }
        this.atQueryEnd=''
        this.strparmsold=this.strparms
      }
      this._allRecsCount=0
      this._eofReached=false
      this._setLimitValues=function(){
        var oldAllRC=this._allRecsCount
        if (this.eof){
          this._eofReached=true
          this._allRecsCount=this.nStartRow+this.nRecs
          return
        }
        this._allRecsCount=Math.max(this._allRecsCount,this.nStartRow+this.nRecs)
        if(this._allRecsCount!=oldAllRC) this._eofReached=false
      }
      this._resetLimitValues=function(){
        this._allRecsCount=0
        this._eofReached=false
      }
      this.getAllRecsCount=function(){
        return Math.max(this._allRecsCount,this.GetQueryCount())
      }
      this.getEofReached=function(){
        return this._eofReached || this.GetQueryCount()!=-1
      }
      this.Empty=function(){
        this.Data=[]
        this.Fields=[]
        this.nRecs=this.Data.length
        this.curRec=1
        this._resetLimitValues()
      }
      this.firstQuery=function(exec,output_server,JSObj){
        if(exec=='true')
          this.Query(false,output_server,JSObj)
      }
      this.firstAsyncQuery=function(exec,output_server){
        if(exec=='true')
          this.AsyncQuery(false,output_server)
      }
      if(this.onInitEnd) this.onInitEnd()
      // this.setAsEventSrc(this);
      this.addTotalizer=function(totalprovider,exp,alias,grp,descr,picture){
        if (picture==null) picture='';
        var grp_fields = Trim(grp)!=""?grp.split(','):[], i;
        this.oldAliasTotalizer = grp_fields.concat(alias.split(','));
        this.pictureTotalizer = [];
        for (i=0; i<grp_fields.length; i++) {
          this.pictureTotalizer.push("");
        }
        this.pictureTotalizer = this.pictureTotalizer.concat(picture.split(','));
        for (i=0;i<grp_fields.length;i++)
          if(isExpr(grp_fields[i])){
            grp_fields[i]=grp_fields[i].replace(/\|/g, ",");
            grp_fields[i]=grp_fields[i].replace(/javascript:/g,'');
            grp_fields[i]=grp_fields[i].replace(/html:/g,'');
            grp_fields[i]=ZtVWeb.fmtPctFldPct(grp_fields[i],0,null,null,form,false) //formatta i %campo%
            grp_fields[i]=ZtVWeb.makeStdExpr(grp_fields[i],form)
          }
        var grpfld=grp_fields.join(',');
        var trueAlias='';
        var separator='';
        for (i=0; i<this.oldAliasTotalizer.length;i++){
          trueAlias+=separator+'sum_'+i;
          separator=',';
        }
        // this.totalizeParms="exp="+URLenc(Trim(exp))+"&alias="+URLenc(Trim(trueAlias))+"&groupby="+URLenc(Trim(grpfld));
        this.totalizeParms=this.BuildTotalizeParameters(exp, trueAlias, grpfld);
        this.totalizeCtrl=totalprovider;

        for (i=0; i<grp_fields.length; i++){
          grp_fields[i] = "%" + grp_fields[i];
        }
        this.totalizeDescr=(Trim(descr)!=""?(grp_fields).concat(Trim(descr)!=""?descr.split(','):[]):[]);
        this.totalizeExpr=(Trim(grp)!=""?grp.split(','):[]).concat(Trim(exp)!=""?exp.split(','):[]);
      }
      this.BuildTotalizeParameters = function(exp, trueAlias, grpfld) {
        return "exp="+URLenc(Trim(exp))+"&alias="+URLenc(Trim(trueAlias))+"&groupby="+URLenc(Trim(grpfld));
      }
    }
    // this.SQLDataProvider.prototype= new this.StdEventSrc();
    this._SQP=this.SQLDataProvider;
    // XMLDataProvider -----------------------------------------------------------------------------------
    this.XMLDataProvider=function(form,name,source,root,xmldataobj,parms,parms_source,async,auto_exec){
    this.queryfilter=""
    this.isxmldata=true
    this.form=form
    this.name=name
    this.dataconsumers=new Array()
    this.rowsconsumers=new Array()
    this.paramconsumers=new Array()
    this.source=source
    this.parms_source=parms_source
    this.parms=parms
    this.root=root
    this.xmldataobj=xmldataobj
    this.nRows=this.nrec=0
    this.fullroot=''
    this.xmlString=''
    this.curRec=1
    this.orderby="";
    this.nStartRow=0;
    this.auto_exec=auto_exec;
    this.async=(typeof(async)=='undefined'?false:async)
    this.fieldstypearray={};
    StdEventSrc.call( this );
    this._getCloneForPrint = function() { // ritorna un clone base, sopratutto senza i consumers del dataprovider
      var ret = new ZtVWeb.XMLDataProvider(this.form,this.name,this.source,this.root,this.xmldataobj,this.parms,this.parms_source,this.async,false);
      ret.queryfilter = this.queryfilter;
      ret.xmlString = this.xmlString;
      return ret;
    }
    this.GetQueryCount=function(){
      return this.nrec;
    }
    this.getGlobalCurRec=function(){
      return(this.curRec)
    }
    this.setOrderBy=this.SetOrderBy=function(orderby){
      this.orderby=orderby;
    }

    this.getEofReached=function(){
      return true
    }
    this.addDataConsumer=function(ctrl,fld){
      this.dataconsumers[this.dataconsumers.length] = new Array(ctrl,fld)
    }
    this.addRowConsumer=function(ctrl){
      if(ctrl!=null) {
        this.rowsconsumers[this.rowsconsumers.length] = ctrl;
        if ('datasource' in ctrl) {
          ctrl.datasource=this;
        }
      }
    }
    this.addParmConsumer=function(ctrl){
      this.paramconsumers[this.paramconsumers.length] = ctrl
    }
    this.refreshConsumers=function(newrows){
      var i,nodi,fld,ctrl,xpath
      this.rs={}
      this.Fields=[];
      this.Fields_Case=[];
      this.Fields_map={};
      this.FieldsCase_map={}
      var xpath_=this.fullroot+(!EmptyString(this.queryfilter)?'['+this.queryfilter+']':'')+(this.nrec>1?'['+this.curRec+']':'')
      var nodi_=this.xmlDoc.selectSingleNode(xpath_)
      if(nodi_!=null)
        for(var n=0;n<nodi_.childNodes.length;n++){
          this.rs[nodi_.childNodes[n].nodeName]=Sarissa.getText(nodi_.childNodes[n],true);
          this.Fields.push(nodi_.childNodes[n].nodeName.toLowerCase());
          this.Fields_Case.push(nodi_.childNodes[n].nodeName);
        }
      for(i=0;i<this.dataconsumers.length;i++) {
        ctrl=this.dataconsumers[i][0]
        fld=this.dataconsumers[i][1]
        xpath=xpath_+'/'+fld
        nodi=this.xmlDoc.selectSingleNode(xpath)
        if(nodi!=null && nodi.childNodes[0]!=null)
          ctrl.Value(Sarissa.getText(nodi,true));
        else
          ctrl.Value('');
      }
      for(i=0;i<this.rowsconsumers.length;i++){
        if(newrows){
          this.rowsconsumers[i].FillData(this)
        }else{
          if(this.rowsconsumers[i].UpdateCurRec)
            this.rowsconsumers[i].UpdateCurRec(this)
        }
      }
      for(i=0;i<this.paramconsumers.length;i++){
        this.paramconsumers[i].paramUpdated()
      }
      this.dispatchEvent("RecordChanged");
    }
    this.getType=function(fld){
      return this.fieldstypearray[fld.toLowerCase()]||'C';
    }
    this.SetFieldType=function(fld,type){
      this.fieldstypearray[fld.toLowerCase()]=Left(type.toUpperCase(),1);
    }
    this.Query=function(timestamp){
      if(!Empty(this.xmldataobj)){
        this.UpdateCurRec(this.xmldataobj)
        this.dispatchEvent('ConsumersRendered');
        return;
      }
      if (Empty(timestamp)) timestamp=new Date().getTime().toString();
      this.xmlDoc=Sarissa.getDomDocument();
      this.xmlDoc.async = false;
      // Valorizzazione dei parametri
      var strparms='', url, output, m_cExtra=JSURL.GetID();
      if (this.form) {
        var aparms=this.parms.split(','), valpar
        for(var i=0,nome1,nome2;i<aparms.length;i++){
          if(!Empty(aparms[i])){
            //prende i valori dai relativi textbox
            if(aparms[i].indexOf('=')>-1){
              nome1=Trim(LTrim(aparms[i].substring(0,aparms[i].indexOf('='))));
              nome2=Trim(LTrim(aparms[i].substring(aparms[i].indexOf('=')+1)));
            }else{
              nome1=Trim(LTrim(aparms[i]))
              nome2=Trim(LTrim(nome1))
            }
            if(Empty(this.parms_source)){
              if (this.form[nome2])
                valpar=this.form[nome2].Value();
              else
                valpar=nome2;
              strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar))
            }else{
              //prende parametri misti sia dal parms_source sia da textbox
              if(!(nome2 in this.form)) {
                valpar=this.form[this.parms_source].getParam(nome2);
                strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar));
              } else{
                valpar=this.form[nome2].Value();
                strparms+='&'+nome1+'='+URLenc(ZtVWeb.formatAsPrm(valpar));
              }
            }
          }
        }
      }
      strparms= (this.source.indexOf('?')>-1 ? '&' : (!Empty(strparms)?'?':'')) + (Left(strparms,1)=='&'?strparms.substring(1):strparms);
      var children;
      if(this.source.indexOf('BO:')==0) {
        var otrs=new TrsJavascript(true);
        otrs.SetRow(1);
        for(var i=0,nome1,nome2,valpar;i<aparms.length;i++){
            if(aparms[i].indexOf('=')>-1){
              nome1=Trim(aparms[i].substring(0,aparms[i].indexOf('=')))
              nome2=Trim(aparms[i].substring(aparms[i].indexOf('=')+1))
            }else{
              nome1=Trim(aparms[i])
              nome2=Trim(nome1)
            }
            if(!(nome2 in this.form) && Trim(this.parms_source)!='') {
              valpar = this.form[this.parms_source].getParam(nome2)
            } else {
              valpar=this.form[nome2].Value();
            }
            if (nome1=='children')
              children=valpar;
            else
              otrs.setValue(nome1,valpar);
        }
        var entityName = Strtran(this.source,'BO:','');
        this.root = entityName;
        var URL = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL + '/servlet/spgridoperation?m_cID='+this.m_cID+'&entity_name='+URLenc(entityName)+'&operation=load'+'&children='+URLenc(children)+'&serialized_memorycursor='+otrs.asString(), true);
        url = URL.SetUnwrapMsg(false);
        output=url.Response();
        var msgFailedLogin,msgFailedAccess;
        var res;
        if ( url.error) {
          res=url.errorCause;
        }
        if ( !EmptyString(msgFailedLogin = url.FailedLogin()) ) {
          res=msgFailedLogin;
        } else if ( !EmptyString(msgFailedAccess = url.FailedAccess()) ) {
          res = msgFailedAccess;
        } else {
          var KO = 'KO()',
              KO_IDX = output.indexOf(KO),
              error = KO_IDX>-1;
          if ( error ) {
            res =  eval("'"+ZtVWeb.JSURL.unwrap(output).substring(KO.length+1, output.length-1)); //aggiunto apice all'inizio perche' la substring toglie "'KO()"
          } else {
            res= ZtVWeb.JSURL.unwrap(output);
          }
        }
        this.RenderQuery(res,timestamp);
      } else if(this.source.indexOf('.xml')>-1){
        if(this.source.indexOf("/")==-1) this.source=ZtVWeb.SPWebRootURL+"/xml/"+this.source;
        if(this.source.indexOf('http://')==-1 && this.source.indexOf('https://')==-1) this.source=window.location.toString().substring(0,window.location.toString().lastIndexOf('/'))+'/'+this.source;
        strparms+=m_cExtra?'&m_c'+'Check='+URLenc(LibJavascript.tkn(m_cExtra,this.source)):''
        if(this.async){
          url = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL+'/servlet/XMLload?URL='+this.source+strparms,true,'window.'+this.form.formid+'.'+this.name+'.RenderQuery',null,timestamp)
            url.SendDataXML()
        }else{
          url = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL+'/servlet/XMLload?URL='+this.source+strparms,true)
          output=url.ResponseForXML()
          this.RenderQuery(output,timestamp)
        }
      }else if(this.source.indexOf('.xml')==-1 && (this.source.indexOf('http://')>-1 || this.source.indexOf('https://')>-1)){
        m_cExtra=m_cExtra?'&m_c'+'Check='+URLenc(LibJavascript.tkn(m_cExtra,this.source+strparms)):''
        if(this.async){
          url = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL + '/servlet/XMLload?URL=' + URLenc(this.source + strparms)+m_cExtra, true, 'window.' + this.form.formid + '.' + this.name + '.RenderQuery', null, timestamp);
          url.SendDataXML()
        }else{
          url = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL + '/servlet/XMLload?URL=' + URLenc(this.source + strparms)+m_cExtra, true);
          output=url.ResponseForXML()
          this.RenderQuery(output,timestamp)
        }
      }else if (!EmptyString(Trim(this.source))){
        if(this.async){
          url = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL+'/servlet/'+this.source+strparms,true,'window.'+this.form.formid+'.'+this.name+'.RenderQuery',null,timestamp)
          url.SendDataXML()
        }else{
          url = new ZtVWeb.JSURL(ZtVWeb.SPWebRootURL+'/servlet/'+this.source+strparms,true)
          output=url.ResponseForXML()
          if(output.indexOf('Function return value:')>-1)
            output=output.substring(output.indexOf('Function return value:')+22,output.indexOf(' -->'))
          this.RenderQuery(output,timestamp)
        }
      } else this.RenderQuery(null,timestamp)
    }

    this.RenderQuery=function(output,timestamp){
      if (!Empty(output)) {
        this.xmlString=output;
      }
      this.fullroot=this.root
      if(this.xmlString.indexOf("urn:yahoo:srch")>-1) this.xmlString=this.xmlString.replace("urn:yahoo:srch","");
      if (this.orderby!="") {
        var OrigXmlDoc = (new DOMParser()).parseFromString(this.xmlString, "text/xml");
        var orderbyToDo = "";
        var orderarray = this.orderby.split(",");
        for (var i=0; i < orderarray.length; i++) {
          var singlearray = LRTrim(orderarray[i]).split(" ");
          var curFldType = (this.getType(singlearray[0])=='N'?'number':'text');
          if (singlearray.length>1) {
            orderbyToDo+='<xsl:sort select="'+singlearray[0]+'" data-type="'+curFldType+'" order="'+(singlearray[1]=="desc"?"de":"a")+'scending"/>'
          }else {
            orderbyToDo+='<xsl:sort select="'+singlearray[0]+'" data-type="'+curFldType+'"/>'
          }
        }

        var forEachSelect=(Left(this.fullroot,1)=="/"?Substr(this.fullroot,2):this.fullroot);
        var rootArray = forEachSelect.split('/');

        var xmlSort = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">'
              +'<xsl:template match="/">';
        for (var i=0;i<rootArray.length-1;i++){
          xmlSort+="<"+rootArray[i]+">";
        }
        xmlSort+='<xsl:for-each select="'+forEachSelect+'">'
              +orderbyToDo
              +'<xsl:copy><xsl:copy-of select="node()"/></xsl:copy></xsl:for-each>'
        for (i=rootArray.length-2;i>=0;i--){
          xmlSort+="</"+rootArray[i]+">";
        }

        xmlSort+='</xsl:template></xsl:stylesheet>';
        var stylesheet = new XSLTProcessor();
        stylesheet.importStylesheet((new DOMParser()).parseFromString(xmlSort, "text/xml"));
        this.xmlDoc = stylesheet.transformToDocument(OrigXmlDoc);
        //Browser EDGE ritorna elemento di tipo Document invece che XMLDocument, che non ha i metodi sottostanti
        if (!('selectNodes' in this.xmlDoc)) {
          this.xmlDoc.selectNodes=XMLDocument.prototype.selectNodes;
        }
        if (!('selectSingleNode' in this.xmlDoc)) {
          this.xmlDoc.selectSingleNode=XMLDocument.prototype.selectSingleNode;
        }
      }else {
        this.xmlDoc = (new DOMParser()).parseFromString(this.xmlString, "text/xml");
      }
      this.lastTimestamp=timestamp;
      try{
        this.nRows=this.nrec=this.xmlDoc.selectNodes(this.fullroot+(!EmptyString(this.queryfilter)?'['+this.queryfilter+']':'')).length
      }catch(e){
        var translated = ZtVWeb.Translate('XML_RESOURCE_NOT_AVAILABLE');
        if (translated=='XML_RESOURCE_NOT_AVAILABLE') translated='Xml resource not available';
        alert(translated);
        return
      }
      if(this.keepCurRec) this.keepCurRec=false;
      else this.curRec=1;
      this.Captions=[];
      this.RowLayer=[];
      this.LayerContents=[];
      this.IsImage=[];
      this.Links=[];
      this.InGrid=[];
      this.InExtGrid=[];
      this.dispatchEvent('QueryExecuted');
      this.refreshConsumers(true);
      this.dispatchEvent('ConsumersRendered');
    }
    this.CreateFilter=function(Filters,notFixed){
      notFixed = (typeof(notFixed)=='undefined'?false:notFixed);
      var filter="",sep="",exp,type,to_remove=[],pict=null;
      for(var i=0;i<Filters.length;){
        var cur_filter=Filters[i];
        if (notFixed && cur_filter.fixed) {i++;continue;}
        var operator=(typeof(cur_filter.operator)=='string'?cur_filter.operator:cur_filter.operator.op)
        if(!EmptyString(cur_filter.expression)|| (operator && operator=="empty")){
          if(EmptyString(cur_filter.type)&&this.datasource.fieldstypearray!=null&&!EmptyString(cur_filter.field)){
            var fldIdx=this.datasource.getFldIdx(cur_filter.field);
              cur_filter.type=((fldIdx==-1)?'C':this.datasource.fieldstypearray[fldIdx]);
          }
          filter+=sep;
          var op=(operator=="<>"?"!=":operator);
          type=cur_filter.type;
          if (op!="empty") {
            if (op=='contains')
              filter+="contains(translate("+cur_filter.field+",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate(";
            else if (op=='like')
              filter+="starts-with(translate("+cur_filter.field+",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),translate(";
            else
              filter+=(cur_filter.field+op);
            pict=cur_filter.picture;
            exp=cur_filter.expression;
            if (exp.indexOf('"')===-1)
              exp= '"'+exp+'"';
            else if (exp.indexOf("'")===-1)
              exp= "'"+exp+"'";
            else
              exp= 'concat("'+exp.replace(/"/g, '",\'"\',"')+'")';
            filter+=exp;
            if (op=='contains' || op=='like'){
              filter+=",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'))";
            }
          } else {
            nullExp = "''";
            filter="("+cur_filter.field+"="+nullExp+")";
          }
          sep=" and ";
          i++;
        }else{
          if (!this._removeFilterByIndex(i,true)) i++;
        }
      }
      return filter;
    }
    this.getFldIdx=function(fld){
      //cerca prima nelle mappe, poi cerca l'indice con un indexOf e popola le mappe
      var p=-1;
      var fldLowerCase;
      if(this.FieldsCase_map){
        p=this.FieldsCase_map[fld];
      }
      if(p==null && this.Fields_map){
        fldLowerCase=fld.toLowerCase();
        p=this.Fields_map[fldLowerCase];
      }
      if(p==null){
        p=-1;
        if(this.Fields_Case){
          p=LibJavascript.Array.indexOf(this.Fields_Case,fld);
        }
        if(p==-1 && this.Fields){
          p=LibJavascript.Array.indexOf(this.Fields,fldLowerCase||fld.toLowerCase());
        }
        if(p!=-1){
          this.FieldsCase_map[fld]=p;
          this.Fields_map[fldLowerCase||fld.toLowerCase()]=p;
        }
      }
      return p;
    }
    this.hasField=function(fld) {
      var q=this.fullroot+(!EmptyString(this.queryfilter)?'['+this.queryfilter+']':'')+'/'+fld
      var nodi=this.xmlDoc.selectSingleNode(q)
      try{
        Sarissa.getText(nodi,true);
        return true;
      } catch(e) {
        return false;
      }
    }
    this.setXMLString=function(str){
      this.xmlDoc=Sarissa.getDomDocument();
      this.xmlDoc.async = false;
      this.keepCurRec=false;
      this.RenderQuery(str);
    }
    this.setXMLSourceString=function(str){
      this.xmlString=str;
      this.keepCurRec=false;
      if(this.auto_exec=='true')
        this.RenderQuery(str);
    }
    this.setRoot=function(newRoot){
      this.root=newRoot
      this.fullroot=newRoot
      this.queryfilter='';
      this.nRows=this.nrec=this.xmlDoc.selectNodes(this.fullroot).length
      this.curRec=1
    }
    this.firstQuery=function(exec){
      if(exec=='true')
        this.Query()
    }
    this.getRecCount=function(){
      return this.nrec
    }
    this.getAllRecsCount=this.GetQueryCount=this.getRecCount
    this.paramUpdated=function(){
      this.Query()
    }
    this.getParam=function(fld){
      var xpath,nodi
      xpath=this.fullroot+(!EmptyString(this.queryfilter)?'['+this.queryfilter+']':'')+(this.nrec>1?'['+this.curRec+']':'')+'/'+fld
      nodi=this.xmlDoc.selectSingleNode(xpath)
      try{
        return nodi.childNodes[0].nodeValue
      } catch(e) {
        return ""
      }
    }
    this.getStr=function(nRec,cNode){
      return this.getValue(nRec,cNode)
    }
    this.getValue=function(nRec,cNode){
      if(Empty(cNode)) return "";
      var nodi
      var q=this.fullroot+(!EmptyString(this.queryfilter)?'['+this.queryfilter+']':'')+'['+(nRec+1)+']/'+cNode
      nodi=this.xmlDoc.selectSingleNode(q)
      try{
        return Sarissa.getText(nodi,true);
      } catch(e) {
        return ""
      }
    }
    this.FillData=function(datasource){
      this.xmldataobj=datasource;
      this.xmlDoc=datasource.xmlDoc
      this.xmlString=datasource.xmlString
      this.fullroot=datasource.fullroot+(datasource.getRecCount()>1?'['+datasource.curRec+']':'')+'/'+this.root
      this.nRows=this.nrec=this.xmlDoc.selectNodes(this.fullroot+(!EmptyString(this.queryfilter)?'['+this.queryfilter+']':'')).length
      this.curRec=1
      this.refreshConsumers(false)
      return ''
    }
    this.UpdateCurRec=function(datasource){
      this.FillData(datasource)
    }
    this.Next=function(){
      if (this.curRec<this.nrec){
        this.curRec+=1
        this.refreshConsumers(false)
        return(true)
      } else
        return(false)
    }
    this.GoToPage=function(curRec){
      if (curRec>this.getAllRecsCount()) return false;
      else return true;
    }
    this.NextPage=function(){
      return false;
    }
    this.FirstPage=function(){
      this.nStartRow=0
      if(!this.Bof())
        this.Query()
      return true
    }
    this.Prev=function(){
      if (this.curRec>1){
        this.curRec-=1
        this.refreshConsumers(false)
        return(true)
      } else
        return(false)
      }
    this.PrevPage=function(){
    }
    this.Eof=function() {
      return this.curRec==this.nrec;
    }
    this.Bof=function() {
      return this.curRec==1;
    }
    // this.setAsEventSrc(this);
  }
    // this.XMLDataProvider.prototype= new this.StdEventSrc()

  this.SPLinkerCtrl=function(form,name,ctrlid,x,y,w,h,servlet,m_cAction,parms,popup,refresh,popup_height,popup_width,target,m_cAltInterface,type_entity,popup_scroll, async, offline, popup_style,force_msg_id,progressbar){
    this.ctrlid=ctrlid
    this.name=name
    this.form=form
    this.target=Trim(target)
    this.action=m_cAction
    this.m_cAltInterface=m_cAltInterface;
    this.servlet=servlet
    this.parms=parms
    this.popup=popup
    this.popup_style=(Empty(popup_style)?'by skin':popup_style);
    this.popup_height=popup_height
    this.popup_width=popup_width
    this.popup_scroll=popup_scroll
    this.refresh=refresh
    this.async=async||false;
    this.addToForm(this.form,this)
    this.delmessage;
    this.skipdelmessage = false;
    this.entity_type=type_entity
    this.closeAtEnd=true;
    this.offline=offline;
    //this.force_msg_id=force_msg_id||false;//deprecated
    this.progressbar=progressbar||false;
    this.progressbar_portlet='SPSplinkerProgressBar_portlet.jsp';
    this.m_cMessagesId='';
    this.prefix="";
    if (this.entity_type=='report' && Empty(this.servlet) ) this.servlet = '../servlet/Report';
    this.createForm=function(){
      var form=document.createElement("form");
      form.style.margin="0";
      form.method=(this.offline?"get":"post");
      form.action="";
      form.id=this.ctrlid+"_form";
      if(document.getElementById(this.form.formid+"_ext"))
        document.getElementById(this.form.formid+"_ext").appendChild(form);
      else
        document.body.appendChild(form);
    }
    this.createIframeForHiddenPost=function() {
      if (document.getElementById(this.ctrlid+"_iframe")==null) {
        var iframe=document.createElement("iframe");
        iframe.style.display="none";
        iframe.name=this.ctrlid+"_frm";
        iframe.id=this.ctrlid+"_iframe";
        iframe.toResize="no";
        iframe.src="javascript:''";
        if(document.getElementById(this.form.formid+"_ext"))
          document.getElementById(this.form.formid+"_ext").appendChild(iframe);
        else
          document.body.appendChild(iframe);
      } else {
        document.getElementById(this.ctrlid+"_iframe").src="javascript:''";
      }
    }
    this.DeleteHiddenIframe=function() {
      var myctrlid = this.ctrlid;
      setTimeout(function() {
        var iframe = document.getElementById(myctrlid+"_iframe")
        if (iframe)
          iframe.parentNode.removeChild(iframe)
        },10);
    }
    this.createForm();
    this.formToPost = document.getElementById(this.ctrlid+'_form');
    this.formToPostAction = (this.servlet.indexOf('http://')==0 || this.servlet.indexOf('https://')==0 ? this.servlet :
                              ( this.servlet.indexOf( ZtVWeb.SPWebRootURL + '/servlet/' ) > -1 ? this.servlet
                              : ( this.servlet.indexOf( '.jsp' ) > -1 ? this.servlet
                                : ZtVWeb.SPWebRootURL + '/servlet/' + this.servlet
                                )
                              )
                            );
    this.SkipDeleteMessage = function(bSkip) {
      var oldSkip = this.skipdelmessage;
      if ( IsA(bSkip,'L') ) {
        this.skipdelmessage = bSkip===true;
      }
      return oldSkip;
    }
    this.DeleteMessage = function(msg) {
      var oldMsg = this.delmessage!=null ? this.delmessage : function() {
        var translated = ZtVWeb.Translate('MSG_PROCEED_WITH_DELETE');
        if (translated=='MSG_PROCEED_WITH_DELETE') translated='Procedere con la cancellazione?';
        return translated;
      }();
      if ( IsA(msg, 'C') && !EmptyString(msg = Trim(msg)) ) {
        this.delmessage = msg;
      }
      return oldMsg;
    }
    this.SetDelMessage=function(mess){
      /* DEPRECATA */
      this.delmessage=mess
    }
    this.CloseAtEnd=function(close) {
      this.closeAtEnd=close;
    }
    this.Servlet=function(newServlet,force){
      var prevServlet = this.servlet
          currServlet = prevServlet
        ;
      if ( newServlet || force ) {
        this.servlet = currServlet = newServlet;
      }
      if ( this.entity_type == 'smartreport' ) {
        if ( this.offline ) {
          currServlet = '../jsp/SPSmartReportPrint_portlet.jsp';
          this.appendParam( 'm_cSPOfflineApp', window.SPOfflineLib.getEntryPointName() );
          this.appendParam( 'OpenerFormId', this.form.formid );
        }
        else {
          currServlet = '../servlet/Report';
          this.appendParam( 'isSmartReport', true );
          this.appendParam( 'portletID', this.form.formid );
          this.appendParam( 'parentPortletID', this.form.formid );
        }
      }

      this.formToPostAction = (currServlet.indexOf('http://')==0 || currServlet.indexOf('https://')==0 ? currServlet :
                                ( currServlet.indexOf( ZtVWeb.SPWebRootURL + '/servlet/' ) > -1 ? currServlet
                                : ( currServlet.indexOf( '.jsp' ) > -1 ? currServlet
                                  : ZtVWeb.SPWebRootURL + '/servlet/' + currServlet
                                  )
                                )
                              );
      //this.formToPostAction=(this.servlet.indexOf(ZtVWeb.SPWebRootURL+'/servlet/')>-1?this.servlet:ZtVWeb.SPWebRootURL+'/servlet/'+this.servlet);
      return prevServlet;
    }
    this.Parameters=function(parms,force){
      var o=this.parms;
      if(parms||force) this.parms=parms;
      return o;
    }
    this.Action = function(act) {
      var res = this.action;
      if ( arguments.length ) {
        this.action = act;
      }
      return res;
    };
    (function(_this){
      var hashesValues = {}
        , paramValues = {}
        ;
      function valueToStr (value) {
        return ZtVWeb.formatAsPrm( ZtVWeb.MemoryCursorCtrl && value instanceof ZtVWeb.MemoryCursorCtrl ? value.Value() : value );
      }
      _this.submitFormToPost = function() {
        var prm, target, hashesCalculated, input_hidden;
        if (_this.offline) {
          hashesCalculated = Object.keys( hashesValues ).map( function (key) {
            return key + '=' + URLenc( valueToStr( hashesValues[key] ) );
          } );
        }
        for ( prm in paramValues ) {
          input_hidden = _this.formToPost.elements[prm];
          if (!input_hidden) {
            input_hidden = document.createElement("input");
            input_hidden.type = "hidden";
            input_hidden.name = prm;
            _this.formToPost.appendChild(input_hidden);
          }
          input_hidden.value = valueToStr( paramValues[prm] );
        }
        _this.formToPost.action = _this.formToPostAction
                                + ( _this.offline ? ( _this.formToPostAction.indexOf( "#" ) > -1 ? "&" : "#" ) + hashesCalculated.join( '&' ) : "" );
        if ( _this.target!='' ) {
          if ( window[_this.target] || ['_blank','_parent','_self','_top'].indexOf( _this.target ) + 1) {
            _this.formToPost.target = _this.target;
          } else {
            throw new Error("Location target error", "splinker '"+_this.name+"' can not find the target '"+_this.target+"'");
          }
        } else {
          _this.formToPost.target = '';
        }
        if ( _this.offline && !input_hidden /*no server params*/) {
          // window[_this.formToPost.target] = _this.formToPost.action;
          target = _this.formToPost.target || 'self';
          if ( ['_blank','_parent','_self','_top'].indexOf( target ) + 1 ) {
            target = target.replace( '_', '' );
          }
          if ( window[target] ) {
            window[target].location.assign( _this.formToPost.action );
          } else {
            throw new Error( "Location target error", "splinker '" + _this.name + "' can not find the target '" + _this.target + "'" );
          }
        } else {
          if(navigator.userAgent.toLowerCase().indexOf('safari')!=-1 && _this.popup=='false' && !_this.async && _this.closeAtEnd && parent!=window && ["new","edit","editload","view"].indexOf(_this.action)!=-1 && history.pushState){
            setTimeout('history.pushState(null,"",""+location);document.getElementById("'+_this.ctrlid+'_form").submit()',700)//https://bugs.webkit.org/show_bug.cgi?id=42861
          }else{
            _this.formToPost.submit();
          }
        }
      };
      _this.getURL = function() {
        _this.Servlet();
        var sep, prm, URL = _this.formToPostAction, hashesCalculated=[],parmsCalculated="";
        if (_this.offline) {
          hashesCalculated = Object.keys( hashesValues ).map( function (key) {
            var value = hashesValues[key];
            return key + '=' +
                   URLenc( ZtVWeb.formatAsPrm( ZtVWeb.MemoryCursorCtrl && value instanceof ZtVWeb.MemoryCursorCtrl ? value.Value() : value ) );
          } );
        }
        sep="";
        for ( prm in paramValues) {
          parmsCalculated += sep + prm + "=" + URLenc( valueToStr( paramValues[prm] ) );
          sep="&";
        }
        if (parmsCalculated.length>0) {
          URL += (URL.indexOf("?")>-1?"&":"?")+parmsCalculated;
        }
        if (hashesCalculated.length>0) {
          URL += (URL.indexOf("#")>-1?"&":"#")+hashesCalculated.join( '&' );
        }
        return URL;
      };
      _this.getOfflineParams = function(){
        var parm=[]
        for (h in hashesValues){
          parm.push([h,hashesValues[h]])
        }
        return parm;
      };
      _this.appendParam = function(name, value) {
        if ( this.entity_type == 'smartreport' && name == 'ReportName' ) {
          value = value.replace( /\.svrp$/, '' );
        }
        if ( !_this.offline || [ 'm_cAction', 'm_cSPOfflineApp' ].indexOf( name ) > -1 ) {
          paramValues[name]=value;
        } else if (_this.offline) {
          hashesValues[name]=value;
        }
      };
      _this.hasParam = function(name) {
        return name in paramValues || name in hashesValues;
      };
      _this.emptyParam = function(){
        paramValues={};
        hashesValues={};
        _this.formToPost.innerHTML='';
      }
    })(this);

    function SPLinkerMsgOverlay(type){
      var msg;
      if (type=='delete'){
        msg = ZtVWeb.Translate( 'MSG_DELETING' );
        if ( msg == 'MSG_DELETING' ) {
          msg = 'Cancellazione in corso.\r\nAttendere prego...'
        }
      }
      else {
        msg=ZtVWeb.Translate('MSG_ROUTINE_WAIT');
        if ( msg == 'MSG_ROUTINE_WAIT' )
          msg='Wait, routine running ...';
      }
      this.transitionTime = 800;
      this.visible = false;
      this.main = window.document.createElement( 'div' );
      this.main.innerHTML = '<h1 style="font-weight:bold;font-family:Verdana, Arial, Helvetica, sans-serif;">'
                          + ToHTag( msg )
                          + '</h1>'
                          ;
      this.main.style.display = 'none';
      this.main.style.position = 'absolute';
      this.main.style.textAlign = 'center';
      this.main.style.top = '0';
      this.main.style.left = '0';
      this.main.style.right = '0';
      this.main.style.bottom = '0';
      this.main.style.margin = 'auto';
      this.main.style.zIndex = ZtVWeb.dragObj.zIndex + 1;
      this.main.style.backgroundColor = 'transparent';
      this.main.style.color = 'transparent';
      this.main.style.transition = this.main.style.webkitTransition = 'all ' + this.transitionTime+'ms';
      // this.container.appendChild( this.main );
      window.document.body.appendChild( this.main );
    }
    SPLinkerMsgOverlay.prototype = {};
    SPLinkerMsgOverlay.prototype.constructor = SPLinkerMsgOverlay;
    SPLinkerMsgOverlay.prototype.show = function () {
      var style = this.main.style
      style.display = '';
      this.showTimeout = window.setTimeout( function () {
        this.showTimeout = null;
        style.backgroundColor = 'rgba(0,0,0,.5)';
        style.color = '#FFFFFF';
      }, 0 );
      this.visible = true;
    };
    SPLinkerMsgOverlay.prototype.hide = function () {
      var main = this.main;
      main.style.backgroundColor = 'transparent';
      main.style.color = 'transparent';
      if (this.showTimeout) {
        clearTimeout(this.showTimeout);
        this.showTimeout = null;
        main.style.display = 'none';
      } else {
        setTimeout( function () {
          main.style.display = 'none';
        }, .1 + this.transitionTime );
      }
      this.visible = false;
    };
    SPLinkerMsgOverlay.prototype.isVisible = function () {
      return this.visible;
    };
    //funzione che accumula i parametri per l'SPLinker
    function ParseParameters(datasourcename, riga, valuedir, action) {
      // Valorizzazione dei parametri
      var fldpos, nome1, nome2, valpar, par_sep, parametri
        , datasource = datasourcename in this.form ? this.form[datasourcename] : null
        ;
      this.historycal=false;
      this.nomi_params = ""
      if ( !EmptyString(action) ) this.action = action;
      if ( this.action=='delete' && this.entity_type=='detail' ) this.action += 'row';
      if ( EmptyString(this.action) && this.servlet.indexOf(ZtVWeb.SPWebRootURL+'/servlet/')>-1 ) this.action = 'start';
      if (this.action=="edithist") {
        this.historycal=true;
        this.action="edit";
      } else if (this.offline && this.action=="editload"){
        this.action="edit";
        this.appendParam('m_cAtError', "new");
      }
      while ( this.formToPost && this.formToPost.firstChild ){
        this.formToPost.removeChild(this.formToPost.firstChild);
      }
      if ( !EmptyString(this.parms) ) {
        parametri = this.parms.split(',');
        for( var i=0; i<parametri.length; i++ ){
          //i parametri possono essere passati con altri nomi es: Codice=CodArt
          if ( parametri[i].indexOf('=')>-1 ) {
            nome1 = LRTrim(parametri[i].substring(0,parametri[i].indexOf('=')));
            nome2 = LRTrim(parametri[i].substring(parametri[i].indexOf('=')+1));
          } else {
            nome1 = nome2 = LRTrim(parametri[i]);
          }
          this.nomi_params = this.nomi_params + ( i==0 ? '' : ',' ) + nome1;
          fldpos = datasource ? datasource.getFldIdx(nome2) : -1;
          par_sep = i>0 ? '&' : '?';
          if ( this.form[nome2] ) { //cerca il parametro tra le variabili
            if ( ZtVWeb.MemoryCursorCtrl && this.form[nome2] instanceof ZtVWeb.MemoryCursorCtrl ) {
              valpar = this.form[nome2];
            } else {
              valpar = this.form[nome2].Value();
              //mi proteggo dal fatto che possa essere tornato null in conversione
              if (valpar==null) {
                if (this.form[nome2].type==='D') {
                  valpar=NullDate();
                } else if (this.form[nome2].type==='T') {
                  valpar=NullDateTime();
                } else if (this.form[nome2].type==='N') {
                  valpar=0;
                } else if (this.form[nome2].type==='L') {
                  valpar=false;
                } else {
                  valpar='';
                }
              }
            }
            this.appendParam(nome1, valpar);
          } else if ( fldpos>-1 ) { //cerca il parametro nel datasource
            if ( riga==null ) { riga = datasource.curRec-1; }
            valpar = datasource.getValue(riga, datasource.Fields[fldpos]);
            this.appendParam(nome1, valpar);
          } else if ( valuedir!=null ) { //cerca il parametro nel valore passato direttamente
            valpar = valuedir;
            this.appendParam(nome1, valpar);
          } else if ( nome1!=nome2 ) {
            valpar = nome2;
            this.appendParam(nome1, valpar);
            this.nomi_params = LRTrim(this.nomi_params, nome1, "");
          } else if ( this.action=='new' ) {
            this.nomi_params = Strtran(this.nomi_params, nome1, "");
          }
        }
      }
      if ( !EmptyString(this.m_cAltInterface) ) {
        this.appendParam('m_cAltInterface', this.m_cAltInterface);
      }
      if(this.progressbar) {
        this.m_cMessagesId=Math.floor((Math.random() * 1000000000) + 1);
        this.appendParam('m_cMessagesId',this.m_cMessagesId);
      }
    }
    //Funzione che fa eseguire l'SPLinker
    function ExecuteLink(datasourcename) {
      var url, showlayer_timeout_id, deletingMsgOverlay, execWindow, m_cExtra,
          datasource = datasourcename in this.form ? this.form[datasourcename] : null,
          scroll_bar_tmp = this.popup_scroll=='true' ? ',scrollbars=yes' : '';
      try {
        this.BuildSystemParameters(this.action);
        switch ( this.action ) {
          //Ritorna il risultato di una function di SitePainter
          case "function": case "function autoexec": case "async routine":
            // if ( typeof this.m_cID!='undefined' ) { this.appendParam('m_cID', this.m_cID); }
            // if ( this.action=='async routine' )   { this.appendParam('m_cAction', "executeAsync"); }
            //this.BuildSystemParameters(this.action);
            if ( this.popup=='true' ) {
              execWindow = window.open("", "Esecuzione_in_corso", 'height=35,width=250,left=100,top=100,status=no,toolbar=no,menubar=no,location=no,resizable=yes' + scroll_bar_tmp);
              execWindow.document.write('<head><title>Esecuzione in corso...</title><style type="text/css"><!--.style1 {font-family: Verdana, Arial, Helvetica, sans-serif}--></style></head><body><div align="center" class="style1">  <h3>Esecuzione in corso...</h3></div></body></html>');
            }
            this._responseFnc = function(output) {
              var msgFailedLogin,
                  msgFailedAccess;
              if ( execWindow ) {
                execWindow.close();
              }
              if ( url && url.error && !this.dispatchEvent("Error", url.errorCause.message, url.errorCause) ) {
                throw url.errorCause;
              }
              this.dispatchEvent('Response', output);
              if ( url && !EmptyString(msgFailedLogin = url.FailedLogin()) ) {
                if ( !this.dispatchEvent("FailedLogin", msgFailedLogin) ) {
                  alert(msgFailedLogin);
                }
              } else if ( url && !EmptyString(msgFailedAccess = url.FailedAccess()) ) {
                if ( !this.dispatchEvent("FailedAccess", msgFailedAccess) ) {
                  alert(msgFailedAccess);
                }
              } else {
                var OPEN_TAG = '\nError message:',
                    CLOSE_TAG = '\nFunction return value:',
                    OPEN_IDX = output.indexOf(OPEN_TAG),
                    CLOSE_IDX = output.lastIndexOf(CLOSE_TAG),
                    error = OPEN_IDX>-1,
                    result;
                if ( !this.offline ) {
                  result = ZtVWeb.JSURL.unwrap(output);
                } else {
                  result = output;
                }
                var cause = "";
                if (error) {
                  cause = output.substring(OPEN_IDX + OPEN_TAG.length, CLOSE_IDX);
                } else {
                  if ( !EmptyString(this.target) ) {
                    if (this.form[this.target].Set)
                      this.form[this.target].Set(result);
                    else
                      this.form[this.target].Value(result);
                  }
                }
                var managedExecuted = this.dispatchEvent("Executed", result, cause);
                if ( error ) {
                  this.dispatchEvent("Error", cause, result)
                } else {
                  this.dispatchEvent('Result', result);
                }
                return result;
              }
            }; // function _responseFnc()

            if (this.offline){
              var _this=this;
              window[this.servlet](this.getOfflineParams(),function(res){
                _this._responseFnc(res);
              });
            } else {
              url = ( this.async ?
                        new ZtVWeb.JSURL(this.getURL(), true, this.form.formid+'.'+this.name+'._responseFnc', true) :
                        new ZtVWeb.JSURL(this.getURL(), true)
                      ).SetUnwrapMsg(false);
              if ( this.async ) {
                url.Response();
                if(this.progressbar && !Empty(this.m_cMessagesId)){
                  window.SPOpenModalLayer.call(null,this.progressbar_portlet+'?m_cMessagesId='+this.m_cMessagesId+'&openerId='+this.form.formid+'&opener_splinker='+this.name,true,ZtVWeb.topWindow,null,null,null,null,null,1,null,
                  false,230,null,null,null,null,null,null,window,
                  null,false,null,520,null,'none',50);
                }
                return "Asynchronous link. Execution result deferred to 'Result' callback.";
              } else {
                return this._responseFnc(url.Response());
              }
            }
            break;
          case "routine caller":
            // this.appendParam('m_bApplet', true);
            // if ( typeof this.m_cID!='undefined' ) { this.appendParam('m_cID', this.m_cID); }
            //this.BuildSystemParameters(this.action);
            if ( this.popup=='true' ) {
              execWindow = window.open("", "Esecuzione_in_corso", 'height=35,width=250,left=100,top=100,status=no,toolbar=no,menubar=no,location=no,resizable=yes' + scroll_bar_tmp);
              execWindow.document.write('<head><title>Esecuzione in corso...</title><style type="text/css"><!--.style1 {font-family: Verdana, Arial, Helvetica, sans-serif}--></style></head><body><div align="center" class="style1">  <h3>Esecuzione in corso...</h3></div></body></html>');
            }

            this._responseFnc = function(output) {
              var msgFailedLogin,
                  msgFailedAccess;
              if ( execWindow ) {
                execWindow.close();
              }
              if ( url && url.error && !this.dispatchEvent("Error", url.errorCause.message, url.errorCause) ) {
                throw url.errorCause;
              }
              this.dispatchEvent('Response', output);
              if ( url && !EmptyString(msgFailedLogin = url.FailedLogin()) ) {
                if ( !this.dispatchEvent("FailedLogin", msgFailedLogin) ) {
                  alert(msgFailedLogin);
                }
              } else if ( url && !EmptyString(msgFailedAccess = url.FailedAccess()) ) {
                if ( !this.dispatchEvent("FailedAccess", msgFailedAccess) ) {
                  alert(msgFailedAccess);
                }
              } else {
                var bj=new BatchJavascript();
                bj.GetFromResponse(output);
                var params=this.parms.split(','),p;
                for( var i=0; i<params.length; i++ ){
                  if ( params[i].indexOf('=')>-1 ) {
                    p = LRTrim(params[i].substring(0,params[i].indexOf('=')));
                  } else {
                    p = LRTrim(params[i]);
                  }
                  if (bj.rdvar[p]!=null && this.form[this.prefix+p] && (this.form[this.prefix+p].Set || this.form[this.prefix+p].Value)){
                    if (this.form[this.prefix+p].Set)
                      this.form[this.prefix+p].Set(bj.rdvar[p]);
                    else
                      this.form[this.prefix+p].Value(bj.rdvar[p]);
                  }
                  else if (bj.rdvar['w_'+p]!=null && this.form[this.prefix+p] && (this.form[this.prefix+p].Set || this.form[this.prefix+p].Value)){
                    if (this.form[this.prefix+p].Set)
                      this.form[this.prefix+p].Set(bj.rdvar['w_'+p]);
                    else
                      this.form[this.prefix+p].Value(bj.rdvar['w_'+p]);
                  }
                }
                if (!Empty(bj.errmsg)){
                  this.dispatchEvent("Error", bj.errmsg);
                }
              }
            };
            url = ( this.async ?
                      new ZtVWeb.JSURL(this.getURL(), true, this.form.formid+'.'+this.name+'._responseFnc', true) :
                      new ZtVWeb.JSURL(this.getURL(), true)
                    ).SetUnwrapMsg(false);
            if ( this.async ) {
              url.Response();
              return "Asynchronous link. Execution result deferred to 'Result' callback.";
            } else {
              return this._responseFnc(url.Response());
            }
          // chiamata generica file+parametri
          case " ": case "":
            // if ( this.entity_type=='page' && !EmptyString(this.nomi_params) ) {
              // this.BuildSystemParameters(this.action);
            // }
            if ( this.popup=='false' ) {
              if ( this.async ) {
                if (this.showMsgOverlay){
                  showlayer_timeout_id = window.setTimeout( ( function (container) {
                    return function () {
                      deletingMsgOverlay = new SPLinkerMsgOverlay();
                      deletingMsgOverlay.show();
                    };
                  } )(),500 );
                }
                this._responseTxt = function(resp) {
                  clearTimeout( showlayer_timeout_id );
                  if ( deletingMsgOverlay && deletingMsgOverlay.isVisible() ) {
                    deletingMsgOverlay.hide();
                  }
                  if ( !EmptyString(this.target) ) {
                    this.form[this.target].Value(resp);
                  }
                  this.dispatchEvent('Response', resp);
                  return resp;
                };
                new ZtVWeb.JSURL(this.getURL(), !this.offline, this.form.formid+'.'+this.name+'._responseTxt', true).SetUnwrapMsg(false).Response();
                return "Asynchronous Link call to SPLinker '"+this.name+"'. Execution result deferred to 'Response' callback.";
              } else {
                this.submitFormToPost();
              }
            } else {
              this.wof(this.getURL(), this.target, 'left=50,top=50'+(Empty(this.popup_height)?'':',height='+this.popup_height)+(Empty(this.popup_width)?'':',width='+this.popup_width)+',status=no,toolbar=no,menubar=no,location=no,resizable=yes '+scroll_bar_tmp, null, null, null);
            }
            break;
          case "new": case "edit": case "editload": case "view":
            if ( datasource ) {
              datasource.keepCurRec = true;
            }
            //this.BuildSystemParameters(this.action);
            if ( this.popup=='false' ) {
              if ( this.async ) {
                alert("SPLinker '"+this.name+"': asynchronous action '"+this.action+"' to resource '"+this.servlet+"' is a nonsense.");
              } else {
                this.submitFormToPost();
              }
            } else {
              this.wof(this.getURL(), this.target, 'left=50,top=50'+(Empty(this.popup_height)?'':',height='+this.popup_height)+(Empty(this.popup_width)?'':',width='+this.popup_width)+',status=no,toolbar=no,menubar=no,location=no,resizable=yes'+scroll_bar_tmp, null, null, null);
            }
            break;
          case "delete": case "deleterow": case "changefromdate":
            //this.appendParam('m_cAction', this.action);
            if ( this.SkipDeleteMessage()===true || confirm(this.DeleteMessage()) ) {
              if ( datasource ) {
                datasource.keepCurRec = true;
              }
              this.BuildSystemParameters(this.action);
              // this.appendParam('m_cParameterSequence', this.nomi_params);
              // this.appendParam('m_cMode','hyperlink');
              // if ( !IsA(this.m_cID,'U') ) {
                // this.appendParam('m_cID',this.m_cID);
              // }
              if (this.offline) {
                var oldtarget = this.target;
                this.createIframeForHiddenPost();
                this.target = this.ctrlid+"_frm";
                this.submitFormToPost();
                this.target = oldtarget;
              } else {
                if ( this.async ) {
                  showlayer_timeout_id = window.setTimeout( ( function (container) {
                    return function () {
                      deletingMsgOverlay = new SPLinkerMsgOverlay( "delete" );
                      deletingMsgOverlay.show();
                    };
                  } )( this.form.Ctrl ), 500 );
                } else {
                  deletingMsgOverlay = new SPLinkerMsgOverlay( "delete"/*this.form.Ctrl*/ );
                  deletingMsgOverlay.show();
                }
                url = ( this.async ?
                        new ZtVWeb.JSURL(this.getURL(), true, this.form.formid+'.'+this.name+'._responseDel', true) :
                        new ZtVWeb.JSURL(this.getURL(), true)
                      ).SetUnwrapMsg(false);
              }
              this._responseDel = function(output) {
                var msgFailedLogin,
                    msgFailedAccess,
                    deleted = false;
                clearTimeout( showlayer_timeout_id );
                if ( deletingMsgOverlay && deletingMsgOverlay.isVisible() ) {
                  deletingMsgOverlay.hide();
                }
                if ( url.error && !this.dispatchEvent("Error", url.errorCause.message, url.errorCause) ) {
                  throw url.errorCause;
                }
                this.dispatchEvent('Response', output);
                if ( !EmptyString(msgFailedLogin = url.FailedLogin()) ) {
                  if ( !this.dispatchEvent("FailedLogin", msgFailedLogin) ) {
                    alert(msgFailedLogin);
                  }
                } else if ( !EmptyString(msgFailedAccess = url.FailedAccess()) ) {
                  if ( !this.dispatchEvent("FailedAccess", msgFailedAccess) ) {
                    alert(msgFailedAccess);
                  }
                } else {
                  var KO = 'KO()',
                      KO_IDX = output.indexOf(KO),
                      error = KO_IDX>-1;
                  if ( error ) {
                    var cause = eval("'"+ZtVWeb.JSURL.unwrap(output).substring(KO.length+1, output.length-1)); //aggiunto apice all'inizio perche' la substring toglie "'KO()"
                    if ( !this.dispatchEvent("Error", cause) ) {
                      alert(cause);
                    }
                  } else {
                    deleted = true;
                    this.dispatchEvent("Deleted", output.match(/Function return value:OK true/)!=null);
                    if ( datasource!=null ) {
                      datasource.Query(true);
                    }
                    if ( this.refresh=='true' ) {
                      if ( EmptyString(this.target) ) {
                        document.location.reload(true);
                        return deleted;
                      } else {
                        window[this.target].document.reload(true);
                      }
                    }
                  }
                }
                return deleted;
              } // this._responseDel()
              if (!offline) {
                if ( this.async ) {
                  url.Response();
                  return "Asynchronous Link call to SPLinker '"+this.name+"'. Execution result deferred to 'Deleted' callback.";
                } else {
                  return this._responseDel(url.Response());
                }
              }
            }
            break;
          case "write": case "writeload":
            // this.appendParam('m_cAction', this.action);
            // this.appendParam('m_cMode', "hyperlink");
            // this.appendParam('m_cParameterSequence', this.nomi_params);
            // if ( !IsA(this.m_cID, 'U') ) { this.appendParam('m_cID', this.m_cID); }
            //this.BuildSystemParameters(this.action);
            url = ( this.async ?
                      new ZtVWeb.JSURL(this.getURL(), true, this.form.formid+'.'+this.name+'._responseWrite', true) :
                      new ZtVWeb.JSURL(this.getURL(), true)
                    ).SetUnwrapMsg(false);

              if ( this.popup=='true' ) {
                execWindow = window.open("", "Esecuzione_in_corso", 'height=35,width=250,left=100,top=100,status=no,toolbar=no,menubar=no,location=no,resizable=yes' + scroll_bar_tmp);
                execWindow.document.write('<head><title>Esecuzione in corso...</title><style type="text/css"><!--.style1 {font-family: Verdana, Arial, Helvetica, sans-serif}--></style></head><body><div align="center" class="style1">  <h3>Esecuzione in corso...</h3></div></body></html>');
              }
              this._responseWrite = function(output) {
                var msgFailedLogin,
                    msgFailedAccess,
                    updated = false;
                if ( url.error && !this.dispatchEvent("Error", url.errorCause.message, url.errorCause) ) {
                  throw url.errorCause;
                }
                this.dispatchEvent('Response', output);
                //controllo se l'utente e' loggato
                if ( !EmptyString(msgFailedLogin = url.FailedLogin()) ) {
                  if ( !this.dispatchEvent("FailedLogin", msgFailedLogin) ) {
                    alert(msgFailedLogin);
                  }
                } else if ( !EmptyString(msgFailedAccess = url.FailedAccess()) ) {
                  if ( !this.dispatchEvent("FailedAccess", msgFailedAccess) ) {
                    alert(msgFailedAccess);
                  }
                } else {
                  //gestione errori
                  var KO = 'KO()',
                      KO_IDX = output.indexOf(KO),
                      error = KO_IDX>-1;
                  if ( error ) {
                    var cause = eval("'"+ZtVWeb.JSURL.unwrap(output).substring(KO.length+1, output.length-1)); //aggiunto apice all'inizio perche' la substring toglie "'KO()"
                    if ( !this.dispatchEvent("Error", cause) ) {
                      alert(cause);
                    }
                  } else {
                    updated = true;
                    if ( !this.dispatchEvent("Updated") ) { alert('Updated'); }
                    if ( datasource!=null ) {
                      datasource.Query(true);
                    }
                    if ( this.refresh=='true' ) {
                      if ( EmptyString(this.target) ) {
                        document.location.reload(true);
                      } else {
                        window[this.target].document.reload(true);
                      }
                    }
                  }
                }
                return updated;
              } // this._responseWrite()
              if ( this.async ) {
                url.Response();
                return "Asynchronous Link call to SPLinker '"+this.name+"'. Execution result deferred to 'Updated' callback.";
              } else {
                return this._responseWrite(url.Response());
              }
          break;
          case "autozoom": case "zoom":
            //this.appendParam('m_cAction', this.action);
            //this.BuildSystemParameters(this.action);
            if ( this.popup=='false' ) {
              this.submitFormToPost();
            } else {
              this.wof(this.getURL(), this.target,'height='+this.popup_height+',width='+this.popup_width+',left=50,top=50,status=no,toolbar=no,menubar=no,location=no,resizable=yes'+scroll_bar_tmp, null, null, null)
            }
            break;
          default:    //solo per modalita' query e start
            // this.appendParam('m_cAction', this.action);
            // this.appendParam('m_cParameterSequence', this.nomi_params);
            // this.appendParam('m_cMode', 'hyperlink');
            // if ( this.entity_type=='routine' && !IsA(this.m_cID, 'U') ) {
              // this.appendParam('m_cID', this.m_cID);
            // }
            if ( this.popup=='false' ) {
              if ( this.async ) {
                alert("SPLinker '"+this.name+"': asynchronous action to resource '"+this.servlet+"' is a nonsense.");
              } else {
                this.submitFormToPost();
              }
            } else {
              // var atExit='';
              // if (this.closeAtEnd) {
                // if ( this.refresh=='true' )
                  // this.appendParam('m_cAtExit', "close&reload");
                // else
                  // this.appendParam('m_cAtExit', "close");
              // }
              this.wof(this.getURL(), this.target,'left=50,top=50'+(Empty(this.popup_height)?'':',height='+this.popup_height)+(Empty(this.popup_width)?'':',width='+this.popup_width)+',status=no,toolbar=no,menubar=no,location=no,resizable=yes'+scroll_bar_tmp, null, null, null)
            }
          break;
        }
      }
      finally{
        //this.emptyParam();
      }
    }
    this.BuildSystemParameters=function(action){
      if ( !EmptyString(action) ) this.action = action;
      switch ( this.action ) {
        case " ": case "":
        if ( this.entity_type=='page' && !EmptyString(this.nomi_params) )
          this.appendParam('m_cParameterSequence', this.nomi_params);
        break;
        case "new": case "edit": case "editload": case "view":
          this.appendParam('m_cAction', this.action);
          if (this.historycal) {
            this.appendParam('m_cHistoricalEdit','true');
          }
          this.appendParam('m_cParameterSequence', this.nomi_params);
          if ( !this.hasParam('m_cMode') )
            this.appendParam('m_cMode','hyperlink');
          if (this.closeAtEnd) {
            if ( this.refresh=='true' ) {
              this.appendParam('m_cAtExit', 'close&reload');
            } else {
              this.appendParam('m_cAtExit', 'close');
            }
          }
        break;
        case "delete": case "deleterow": case "changefromdate":
          this.appendParam('m_cAction', this.action);
          this.appendParam('m_cParameterSequence', this.nomi_params);
          this.appendParam('m_cMode','hyperlink');
          if(!IsA(this.m_cID,'U')) {
            this.appendParam('m_cID',this.m_cID);
          }
          m_cExtra = JSURL.Extra(this.formToPostAction+'?m_cAction='+this.action)
          if(m_cExtra)
            this.appendParam('m_c'+'Check',m_cExtra)
          break;
        case 'routine caller':
          this.appendParam('m_bApplet', true);
          if ( typeof this.m_cID!='undefined' ) { this.appendParam('m_cID', this.m_cID); }
        break;
        case "function": case "function autoexec": case "async routine":
          if ( typeof this.m_cID!='undefined' ) { this.appendParam('m_cID', this.m_cID); }
          if ( this.action=='async routine' )   { this.appendParam('m_cAction', "executeAsync"); }
        break;
        case "write": case "writeload":
          this.appendParam('m_cAction', this.action);
          this.appendParam('m_cMode', "hyperlink");
          this.appendParam('m_cParameterSequence', this.nomi_params);
          if ( !IsA(this.m_cID, 'U') ) {
            this.appendParam('m_cID', this.m_cID);
          }
          m_cExtra = JSURL.Extra(this.formToPostAction+'?m_cAction='+this.action)
          if(m_cExtra)
            this.appendParam('m_c'+'Check',m_cExtra)
          break;
        case 'autozoom': case 'zoom':
          this.appendParam('m_cAction', this.action);
        break;
        default:    //solo per modalita' query e start
          this.appendParam('m_cAction', this.action);
          this.appendParam('m_cParameterSequence', this.nomi_params);
          this.appendParam('m_cMode', 'hyperlink');
          if ( this.entity_type=='routine' && !IsA(this.m_cID, 'U') ) {
            this.appendParam('m_cID', this.m_cID);
          }
          if(popup!='false'){
            if (this.closeAtEnd) {
              if ( this.refresh=='true' )
                this.appendParam('m_cAtExit', "close&reload");
              else
                this.appendParam('m_cAtExit', "close");
            }
          }
        break;
      }
    }
    this.BuildLinkUrl=function(datasourcename, riga, valuedir, action){
      switch ( action ) {
        case "new": case "edit": case "editload": case "view":
          this.emptyParam();
          this.BuildSystemParameters(action);
          ParseParameters.call(this,datasourcename, riga, valuedir, action);
          return this.getURL();
        break;
        default:
          return "javascript:void(0)";
        break;
      }
    }
    if (this.form.offline && !this.offline) {
      this.Link=function(datasourcename, riga, valuedir, action) {//siamo offline e perdiamo il valore di ritorno, ma e' potenzialmente previsto
        this.emptyParam();
        ParseParameters.call(this,datasourcename, riga, valuedir, action);
        if (this.ignoreServerOnline) {
          return ExecuteLink.call(this,datasourcename);
        } else {
          var _this = this;
          isServerOnline(null, function(res) {
            if (res) {
              ExecuteLink.call(this,datasourcename);
            } else {
              _this.dispatchEvent('ServerDown');
            }
          });
          return "Offline context. Execution result deferred to 'Result' callback.";
        }
      }
    } else {
      this.Link=function(datasourcename, riga, valuedir, action) {
        this.emptyParam();
        ParseParameters.call(this,datasourcename, riga, valuedir, action);
        return ExecuteLink.call(this,datasourcename);
      }
    }
    // this.setAsEventSrc(this);
    this.wof=function(){
      if(this.popup_style=='layer'){
        var new_args=[];
        for(var i=0;i<arguments.length;i++)new_args.push(arguments[i]);
        new_args.push(1);//force layer
        window.layerOpenForeground.apply(null,new_args)
      }else if(this.popup_style=='popup'){
        var new_args=[];
        for(var i=0;i<arguments.length;i++)new_args.push(arguments[i]);
        new_args.push(2);//force popup
        window.windowOpenForeground.apply(null,new_args);
      }else
        window.windowOpenForeground.apply(null,arguments);
    }
    this.setPrefix=function(prefix){
      this.prefix=prefix;
    }
    this.setProgressBarPortlet=function(p){
      this.progressbar_portlet=p;
    }
  }
  this.SPLinkerCtrl.prototype=new this.StdControl
  //--------------MemoryCursor------------------------------------
  this.MemCurs=function(){
  this.flds_map={}
  this.flds=[]
  this.rows=[]
  this.curr=-1
  this.RecCount=function(){return this.rows.length;}
  this.GoTo=function(pos){this.curr=pos-1}
  this.Remove=function(pos){LibJavascript.Array.remove(this.rows,pos-1);}
  this.AppendBlank=function(){
    var r={}
    for(var i=0;i<this.flds.length;i++){
      r[this.flds[i].name.toLowerCase()]=''
    }
    this.rows.push(r)
    this.curr=this.rows.length-1
    return this.curr+1;
  }
  this.CreateFld=function(name,type){
    if (!(name in this.flds_map)){
      this.flds.push({name:name,type:type})
      this.flds_map[name]=this.flds.length-1
    }
  }
  this.set=function(name,value){
    if (this.curr!=-1){
      this.rows[this.curr][name.toLowerCase()]=value
    }
  }
  this.get=function(name){
    if (this.curr!=-1){
      return this.rows[this.curr][name.toLowerCase()]
    }
  }
  this.Find=function(conds,startPos){
	if (startPos==null) startPos=1
    for(var i=startPos-1;i<this.rows.length;i++){
      for(var j=0;j<conds.length;j++){
        if (!Eq(this.rows[i][conds[j][0].toLowerCase()],conds[j][1]))
          break;
      }
      if (j==conds.length)
        return i+1;
    }
    return 0;
  }
  this.getTotal=function(fld){
    var total=0;
    for(var h=0;h<this.rows.length;h++){
      total+=this.rows[h][fld.toLowerCase()];
    }
    return total;
  }
}
this.getResourceNameFromUrl= function(url){
  if( url.indexOf("/") >-1)
    url = url.substring(url.lastIndexOf("/")+1);
  url = Strtran(url, '_portlet.jsp', '');
  url = Strtran(url, '.jsp', '');
  return url;
}
this.portletIncludedLoaded=function(pname, pageletId, portletId, win){ //chiamato da VisualWEB
  if(!win) win=window;
  var structure=win[pageletId+"_pagelet_structure"];
  if (structure ){
    /* navigo la struttura dall'ultima chiave inserita per mantenere l'ordine dei portlet */
    var keys = Object.keys(structure);
    for ( var i = keys.length - 1; i >= 0; i--) {
      if ( structure[keys[i]].type == 'group' ) {
        var urls = structure[keys[i]].urls;
        for ( var j = 0; j < urls.length; j++) {
          if ( ZtVWeb.getResourceNameFromUrl(urls[j]) == pname && Empty(structure[keys[i]].Ids[j]) ) {
            structure[keys[i]].loaded[j] = true;
            structure[keys[i]].Ids[j] = portletId;
            break;
          }
        }         
      } else if( structure[keys[i]].url && ZtVWeb.getResourceNameFromUrl(structure[keys[i]].url) == pname ){
        structure[keys[i]].Id = portletId;
      }
    }
  } else {
    if ( ZtVWeb.isInContainer() && parent.ZtVWeb.portletIncludedLoaded ) {
        parent.ZtVWeb.portletIncludedLoaded(pname, pageletId, portletId, parent);
    }
  }
  // if(window[pageletId+"_pagelet_loading"]){
    // window.checkLoaded(pageletId);
  // }
};
  //--------------FUNZIONI---DI--SISTEMA----JSURL-----------------
this.JavaHttpRequest=function() {
this.open = function(method,url,synch) {
  var u = java.net.URL(url);
  this.cn = u.openConnection();
  this.cn.setDoOutput(true);
  this.cn.setUseCaches(false);
  this.cn.setAllowUserInteraction(false);
}
this.setRequestHeader = function(header, value ){
  this.cn.setRequestProperty(header, value);
}
this.send = function(data) {
  var out = java.io.PrintWriter(this.cn.getOutputStream());
  if ( data!=null ) {
    out.print(data);
  }
  out.close();
  var is = this.cn.getInputStream(),
      r = 0,
      i = 0,
      read = is.read,
      fromCharCode = String.fromCharCode;
  this.responseText = [];
  while( (r=read())!=-1 ) {
    this.responseText[i] = fromCharCode(r);
    i++;
  }//while
  this.responseText = this.responseText.join('');
  is.close();
}//send
}
this.staticJSURL = [];
this.JSURL = function(srv, p_bNoCache, callback, textResponse, timestamp) {
  this.SetUnwrapMsg = function(unwrap) {
    if ( arguments.length ) {
      this._unwrapmsg = unwrap;
    }
    return this;
  }
  this.Server=function(){
    return srv
  }
// var msg;
this.async = false;
if ( callback ) {
  var idx = ZtVWeb.staticJSURL.length;
  for (var i=0; i<idx; i++) {
    if ( ZtVWeb.staticJSURL[i]==null ) {
      idx = i;
    }
  }
  ZtVWeb.staticJSURL[idx] = this;
  this.idx = idx;
  this.callback = callback;
  this.async = true;
  this.textResponse = textResponse;
  this.timestamp = timestamp;
}
this.SetUnwrapMsg(this.async);
if ( p_bNoCache==null ) { p_bNoCache = false; }
this.http = null;
var m_cExtra=JSURL.ExtractSqlcmd(srv)
this.m_cDigested=LibJavascript.lastDigested
//Microsoft KB 208427
if ( !p_bNoCache && srv.length>1500 && navigator.userAgent.toLowerCase().indexOf('msie')!=-1 ) { p_bNoCache = true; }
try {
  this.http = new XMLHttpRequest();
} catch(e) {
  try {
    this.http = new ActiveXObject('Msxml2.XMLHTTP');
  } catch(f) {
    try {
      this.http = new ActiveXObject('Microsoft.XMLHTTP');
    } catch(g) {
      try {
        this.http = new JavaHttpRequest();
      } catch(h) {
        this.http = false;
      }
    }
  }
}
this.xml_utf8_only = navigator.userAgent.toLowerCase().indexOf('msie')!=-1;
if ( p_bNoCache ) {
  var p = srv.indexOf('?');
  if ( p!=-1 ) {
    this.prm = srv.substr(p+1);
    srv = Left(srv, p);
  } else {
    this.prm = "";
  }
  this.methodUsed='POST'
  this.http.open('POST', srv, this.async);
} else {
  this.methodUsed='GET'
  this.http.open('GET', srv, this.async);
  this.prm = "";
}
if ( !/WebKit/.test(navigator.userAgent) ) {
  this.userAgent=navigator.userAgent
  if ( !IsA(window.document, 'U') && !IsA(document.location, 'U') )
    this.Referer= document.location.protocol+'//'+document.location.host+document.location.pathname
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
this.GetUnwrapMsg = function() {
  return this._unwrapmsg;
}
this.Response = function() {
  try {
    return this.__response();
  } catch(e) {
    this.error = true;
    this.errorCause = e;
    return '';
  }
}
this.Msg = function(msg) {
  var oldMsg = this._msg;
  if ( arguments.length ) {
    this._msg = msg;
  }
  return oldMsg;
}
this.__response = function() {
  this.Msg('');
  if ( this.async ) {
    this.http.onreadystatechange = new Function("ZtVWeb.__readystatechange("+this.idx+")");
  }
  this.http.send(this.prm);
  if ( !this.async ) {
    if ( this.http.status>12000 ) { // IE WinInet network error status codes
      throw new Error('WinInet network error status code: '+this.http.status);
    }
try{this.Msg(this.http.getResponseHeader("JSURL-Message"));}
    catch(e) {
    }
    if ((!this.dontloop && Left(GetSPRegionalSettingsGatherer.RSCookieValue(),1)=='C') || (!Empty(this.FailedLogin()) && this.FailedLogin.rs)){
      var u=new JSURL(ZtVWeb.SPWebRootURL+'/servlet/'+GetSPRegionalSettingsGatherer.RelativeURL())
      u.dontloop=true
      this.dontloop=true
      u.Response()
      if (srv.match(JSURL.CheckRE))
        this.srv=this.srv.replace(JSURL.CheckRE,"m_c"+"Check="+LibJavascript.tkn(JSURL.GetID(),this.m_cDigested))
      else if(this.prm.match(JSURL.CheckRE))
        this.prm=this.prm.replace(JSURL.CheckRE,"m_c"+"Check="+LibJavascript.tkn(JSURL.GetID(),this.m_cDigested))
      this.http.open(this.methodUsed,this.Server(),this.async)
      this.setHeaders()
      this.__response()
    }
    if ( this.Msg()==null ) { this.Msg(''); }
    var resp = this.http.responseText.toString();
    return this.GetUnwrapMsg() ? this.unwrap(resp) : resp ;
  }
}
this.setParmsForXML=function(){
this.prm += this.xml_utf8_only ? ((EmptyString(this.prm) ? ''/*stringa di parametri senza ? iniziale*/ : '&') + "xml_utf8_only="+this.xml_utf8_only) : '';
}
this.SendDataXML = function() {
  if (this.async){
    this.http.onreadystatechange=new Function("ZtVWeb.__readystatechange("+this.idx+",true)")
  } else if (Left(GetSPRegionalSettingsGatherer.RSCookieValue(),1)=='C' ||(!Empty(this.FailedLogin()) && this.FailedLogin.rs)){
    new JSURL(ZtVWeb.SPWebRootURL+'/servlet/'+GetSPRegionalSettingsGatherer.RelativeURL(),true).Response()
  }
  this.setParmsForXML();
  this.http.send(this.prm)
}

this.ResponseXML = function() {
this.setParmsForXML();
this.Response()
return this.http.responseXML;
}
this.FailedLogin = function() {
 this.FailedLogin.rs = 0
 if (Left(this.Msg(), 8)=='cp_login') {
  this.FailedLogin.rs = JSURL.ExtractExtra(this.http.responseText)
  return eval(Substr(this.Msg(), 9))
 }
 return ''
}
this.FailedAccess = function() {
  return Left(this.Msg(), 9)=='SPServlet' ? eval(Substr(this.Msg(), 10)) : '';
}
this.ResponseForXML = function() {
  this.setParmsForXML();
  this.Response();
  return this.http.responseText.toString()
}
this.__readystatechange= function(isxml){
  if ( this.http.readyState==4 ) {
    var z=ZtVWeb.staticJSURL[this.idx]
    ZtVWeb.staticJSURL[this.idx] = null
    if ( this.http.status>12000 ) { // IE WinInet network error status codes
      throw new Error('WinInet network error status code: '+this.http.status);
    }
    if ( this.http.status!=200 ) return;
try{this.Msg(this.http.getResponseHeader('JSURL-Message'));}
    catch (e) {
    }
    if (Left(GetSPRegionalSettingsGatherer.RSCookieValue(),1)=='C' || (!Empty(this.FailedLogin()) && this.FailedLogin.rs)){
      ZtVWeb.staticJSURL[this.idx] = z
      function Callback_l_TmpVar(){
        z.http.open(z.methodUsed,z.Server(),z.async)
        z.setHeaders()
        if (isxml)
          z.SendDataXML()
        else
          z.__response()
      }
      GetSPRegionalSettingsGatherer(true,Callback_l_TmpVar)
      return
    }
    var msg = this.http.responseText.toString(),
        XML_START = '<?xml';
    if ( this.GetUnwrapMsg() ) {
      msg = ZtVWeb.JSURL.unwrap(msg);
    }
    if ( msg.substr(0, XML_START.length).toLowerCase()==XML_START ) {
            if ( IsA(this.callback, 'F') ) {
              this.callback(msg,this.timestamp);
      } else {
        eval(this.callback+"(msg"+(this.timestamp?",this.timestamp":"")+")");
      }
          } else if ( IsA(this.callback, 'F') ) {
            this.callback(msg,this.timestamp);
    } else if( !EmptyString(msg) ) {
      if (this.textResponse==null) {
        eval(this.callback+"('',msg"+(this.timestamp?",this.timestamp":"")+")");
      } else {
        eval(this.callback+"('" +
                                msg.replace(/\\/g, "\\\\")
                                   .replace(/\r/g, "\\r")
                                   .replace(/\n/g, "\\n")
                                   .replace(/'/g, "\\'")
                          + "'" + (this.timestamp ? ", '"+this.timestamp+"'" : "") + ");");
      }
    }
  }
}
}
this.JSURL.unwrap = function(msg) {
  if ( EmptyString(msg) ) { return msg; }
  msg=Strtran(msg,"&euro;","\u20ac");
  var OPEN_TAG = 'Function return value:',
      CLOSE_TAG = ' -->',
      OPEN_IDX = msg.indexOf(OPEN_TAG),
      CLOSE_IDX = msg.lastIndexOf(CLOSE_TAG);
  if ( OPEN_IDX==-1 || CLOSE_IDX==-1 || OPEN_IDX>CLOSE_IDX ) {
    return msg;
  }
  msg = msg.substring(OPEN_IDX+OPEN_TAG.length, CLOSE_IDX);
  if ( msg.match(/\r\n$/) ) return msg.substring(0, msg.length-2);
  if ( msg.match(/[\r\n]$/) ) return msg.substring(0, msg.length-1);
  return msg;
}
this.__readystatechange= function(idx,isxml){
  if (this.staticJSURL[idx]!=null){
    this.staticJSURL[idx].__readystatechange(isxml)
  }
}
this.Popup=function(url,name,e,parms){
  if(e.preventDefault) e.preventDefault();
  if ( (url.indexOf("http://")==-1 || url.indexOf(location.origin)==0 ) && window.SPTheme.activateModalPopup) {
    window.layerOpenForeground.call(null,url,name||(''+new Date().getTime()),parms);
  } else {
    var opts=parms?','+parms:'';
    if(url.indexOf("/servlet/")>-1 || url.indexOf("_portlet.jsp")>-1)
    opts+=',status=no,toolbar=no,menubar=no,location=no';
    window.open(url,"_blank",'scrollbars=yes,resizable=yes'+opts);
  }
}
}
}
function GetEventSrcElement(e){
 return (e||window.event).srcElement || (e||window.event).target;
}
function GetEventDestinationElement(e){
  return (e||window.event).relatedTarget || (e||window.event).toElement;
}
function clearField(f){
  if(f.indexOf('checkbox:')>-1 || f.indexOf('combobox:')>-1 ){
    return f.split(":")[1];
  }
  return f;
}
function ToHTMLValue(p_cVar){
 return "'"+ToHTML(p_cVar)+"'";
}
function ToHTML(p_cVar){
 p_cVar=Strtran(p_cVar,"&","&amp;");
 p_cVar=Strtran(p_cVar,"\\","&#092;");
 p_cVar=Strtran(p_cVar,"<","&lt;");
 p_cVar=Strtran(p_cVar,">","&gt;");
 p_cVar=Strtran(p_cVar,"\"","&quot;");
 p_cVar=Strtran(p_cVar,"'","&#39;");
 p_cVar=Strtran(p_cVar,"\r","&#13;");
 p_cVar=Strtran(p_cVar,"\n","&#10;");
 p_cVar=Strtran(p_cVar,"\u20ac","&euro;");
 return p_cVar;
}
function FromHTML(p_cVar){
 p_cVar=Strtran(p_cVar,"&amp;","&");
 p_cVar=Strtran(p_cVar,"&#092;","\\");
 p_cVar=Strtran(p_cVar,"&lt;","<");
 p_cVar=Strtran(p_cVar,"&gt;",">");
 p_cVar=Strtran(p_cVar,"&quot;","\"");
 p_cVar=Strtran(p_cVar,"&#39;","'");
 p_cVar=Strtran(p_cVar,"&#13;","\r");
 p_cVar=Strtran(p_cVar,"&#10;","\n");
 p_cVar=Strtran(p_cVar,"&euro;","\u20ac");
 p_cVar=Strtran(p_cVar,"&nbsp;","");
 return p_cVar;
}
function ToHTag(p_cValue){
 p_cValue=Strtran(p_cValue,"&#13;","\r");
 p_cValue=Strtran(p_cValue,"&#10;","\n");
 var p=p_cValue.indexOf("<html>");
 var s='';
 while(p!=-1){
  s+=Strtran(Strtran(Strtran(Left(p_cValue,p-1),"\r\n","<BR>"),"\n","<BR>"),"\r","<BR>");
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
 s+=Strtran(Strtran(Strtran(p_cValue,"\r\n","<BR>"),"\n","<BR>"),"\r","<BR>");
 s = s.replace(new RegExp("<(/?script[^>]*)>",'gi'),function (match, p1, offset) { return '&lt;'+p1+'&gt;'; } ); //sanitizza i tag script
 return s;
}
function FromHTag(p_cValue){
 return Strtran(p_cValue,"<BR>","\r\n");
}
LibJavascript.Events.addEvent(window,"unload",function(){ZtVWeb.removePortlets();ZtVWeb.purgeEventsCache();ZtVWeb.removePagelets();ZtVWeb.POM.purge();});
ZtVWeb.topWindow = LibJavascript.Browser.TopFrame( 'ZtVWeb' );
