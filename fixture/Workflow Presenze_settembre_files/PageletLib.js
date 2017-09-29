var LoadAtEnd = false;
function show(portlet_title){
  var opened = portlet_title.opened.Value()=="true";
  if(opened)
    return;
  var content_area=portlet_title.content_area.Value();
  var content_url=Strtran(portlet_title.content_url.Value(),"../jsp","");
  var loaded= opened || portlet_title.loaded;
  if(!loaded){
    var iframes=document.getElementById(content_area).getElementsByTagName("iframe");
    if(!document.getElementById(content_area+'_src')){
      if(ZtVWeb.Include("../"+m_cThemePath+"/jsp-decorators/"+content_url,content_area,true)==404)
        if(ZtVWeb.Include("../jsp-decorators/"+content_url, content_area,true)==404)
          ZtVWeb.Include("../jsp/"+content_url, content_area,true)
      portlet_title.loaded=true;
    } else {
      iframes[0].src=document.getElementById(content_area+'_src').value;
      LibJavascript.Events.addEvent(iframes[0],'load',function(){
        effectOpenClose2(content_area,true);
      });
    }
  }
  portlet_title.opened.Value("true");

  var div=document.getElementById(content_area);
  if (div.getAttribute('old_height')==null) {
    div.setAttribute('old_height',div.style.height);
  }
  div.style.height='1px';
  div.style.display='';
  div.style.overflow='hidden';

  window.setTimeout(function(){
    effectOpenClose2(content_area,true);
  }, 50);
}

function hide(portlet_title){
  var opened = portlet_title.opened.Value()=="true";
  if(!opened)
    return;
  portlet_title.loaded=true;
  var content_area=portlet_title.content_area.Value();
  portlet_title.opened.Value("false");
  var div=document.getElementById(content_area);
  if (div.getAttribute('old_height')==null) {
    div.setAttribute('old_height',div.style.height);
  }
  div.style.overflow='hidden';
  effectOpenClose2(content_area,false);
}
function effectOpenClose2(el,open){
  var DELTA_H=80, DEALY=50;
  if(IsA(el, 'C'))
    el=document.getElementById(el);
  if(open){
    var content;
    if(el.tagName.toLowerCase()=='iframe'){
      content=el.contentWindow.document.body;
    }else
      content=el
    if (el.offsetHeight==0 && content.scrollHeight==0) {
      window.setTimeout(function(){
        effectOpenClose2(el,open);
      }, DEALY);
    }else if(el.offsetHeight<content.scrollHeight){
      el.style.height = (el.offsetHeight + Math.min(DELTA_H, content.scrollHeight-content.offsetHeight))+'px';
      window.setTimeout(function(){
        effectOpenClose2(el,open);
      }, DEALY);
    }else{
      if (el.getAttribute('old_height')=='') {
        el.style.height=''
      } else {
        el.style.height=el.scrollHeight+'px';
      }
      el.style.overflow='';
      if(typeof(ZtVWeb)!='undefined')
        ZtVWeb.AdjustContainer();
    }
  }else{
    if(el.offsetHeight<=1){
      el.style.height='0px';
      el.style.display='none';
      if(typeof(ZtVWeb)!='undefined')
        ZtVWeb.AdjustContainer();
    }else{
      el.style.height=Math.max(el.offsetHeight-DELTA_H, 1)+'px';
      window.setTimeout(function(){
        effectOpenClose2(el,open);
      }, DEALY);
    }
  }
}

function getTitle(title_portlet){
  return title_portlet.title.Value();
}
function getPortletName(obj){
  var ele =document.getElementById(obj.formid)
  while(ele.tagName!='INPUT')
    ele=ele.previousSibling
  return  Strtran(ele.name,"_portlet.jsp","")
}

function effectOpenClose(id,open){
  var frame=document.getElementById(id)
  if(frame!=null){
    if(open){
      if(frame.offsetHeight>=frame.contentWindow.document.body.scrollHeight && frame.offsetHeight>0){
        frame.style.height=frame.contentWindow.document.body.scrollHeight+'px';
        return;
      }
      frame.style.height=frame.offsetHeight+40+'px'
    }else{
      if(frame.offsetHeight<=1){
        frame.style.height='0px';
        frame.style.display='none';
        return;
      }
      frame.style.height=Math.max(frame.offsetHeight-40,0)+'px'
    }
    if(typeof(frame.src)!='undefined' && frame.src!='') setTimeout("effectOpenClose('"+id+"',"+open+")",10)
  }
}

function resizeIframe(frame,src){
  if(Empty(frame)) return;
  if(IsA(frame,'C')){
    if(!Empty(document.getElementsByName(frame)[0]))
      frame=document.getElementsByName(frame)[0];
    else
      frame=document.getElementById(frame);
  }
  if(frame==null || frame.getAttribute("toResize")=='no') return;
  if(src && frame.src!=src){
    frame.src=src;
    return;
  }
  if(frame.getAttribute('portlet_id'))
    frame.parentNode.style.height=''; //nel caso di iframe ctrl dei portlet
  else
    frame.parentNode.parentNode.style.height=''; //in ogni caso azzero il container, serve al 100% solo se e' portalstudio
  try{frame.contentWindow.document}catch(e){frame.style.height='100%';return;}
  if ('m_cCaption' in frame.contentWindow && frame.contentWindow.m_nRowsPerPage!=null && frame.contentWindow.m_oTrsQuery!=null && frame.contentWindow.m_oTrsQuery.length>0) {
      // Page di site
      var bodyDiv = frame.contentWindow.Ctrl("bodyDiv");
      frame.style.height = (bodyDiv.scrollHeight + ( frame.scrollHeight-bodyDiv.clientHeight ) )+'px';
     try{
       frame.parentNode.style.height='';
     }catch(e){}
  } else if (frame.contentWindow.portalStudioContainer){ //nel caso sia PortalStudio
      frame.style.height = '100%';
     try{
       frame.parentNode.style.height='100%';
       frame.parentNode.parentNode.style.height='100%';
     }catch(e){}
  }else if('m_nPreferredHeight' in frame.contentWindow){
    frame.style.height=frame.contentWindow.GetWindowPreferredSize().h+'px';
    frame.parentNode.style.height=frame.contentWindow.GetWindowPreferredSize().h+'px';
  }else{ //frame.contentWindow.SPHpC==true per le page di portalstudio lascio il calcolo standard
    frame.style.height=frame.contentWindow.document.body.scrollHeight+'px';
    frame.parentNode.style.height=frame.contentWindow.document.body.scrollHeight+'px';
  }
  try {
    if(window.frameElement!=null && typeof(parent.resizeIframe)!="undefined") parent.resizeIframe(window.frameElement);
  } catch (e) { }
}

function collapseCol(id,closeWidth){
  var col_=document.getElementById(id+"_container")
  col_.style.display='none'
  if(closeWidth==null )  closeWidth=18
  var col_openclose=document.getElementById(id+"_openclose")
  var w=col_openclose.getAttribute("width_close");
  col_openclose.style.width=(w?w:closeWidth+'px') //larghezza minima del portlet decoratore
  ZtVWeb.windowResized('da colonna chiusa')
}

function openCol(id){
  var col_=document.getElementById(id+"_container");
  col_.style.display='block';
  var col_openclose=document.getElementById(id+"_openclose");
  var w=col_openclose.getAttribute("width_close");
  var col_td=document.getElementById(id);
  var w_tmp=Strtran((w?w:col_.style.width),'px','');
  col_openclose.style.width=(w_tmp.indexOf('%')>-1?w_tmp:(Empty(w_tmp)?'':w_tmp+'px'));
  var iframes=document.getElementsByTagName('IFRAME');
  for(var i=0,iframe; iframe=iframes[i++]; resizeIframe(iframe));
  ZtVWeb.windowResized()
}

function addCombo(id,value,caption){
  var obj=document.getElementById(id);
  var opt=new Option;
  opt.text=caption;
  opt.value=value;
  obj.options[obj.options.length] = opt;
}

function appendPortlet(pagelet,group,resource,url,url_title,title,opened,refresh){
  var cnt_container;
  if(refresh){
   cnt_container=document.getElementById(pagelet+"_"+resource+"_container");
   cnt_container.innerHTML = "";
  }else{
   var container=document.getElementById(pagelet+"_"+group+"_container");  // necessario aggiungere il div contenitore globale del gruppo
   cnt_container=document.createElement('div');
   cnt_container.id=pagelet+"_"+resource+"_container";
   cnt_container.className = "resource_container";
   container.appendChild(cnt_container);
  }
  //crea il title
  if(url_title!=null){
	  var theme_title_cnt = document.getElementById(pagelet+"_"+group+"_container").getAttribute("title_as_portlet");

    var cnt_title=document.createElement('div');
    cnt_title.id=pagelet+"_"+resource+"_title";
    cnt_title.style.overflow='hidden';
    cnt_container.appendChild(cnt_title);

    // se ho definito nella pagelet un titolo specifico diverso dal default allora forzo quello per coernza col tema
    // se non è definito un titlo specifico allora uso quello passato nel metodo
    if (theme_title_cnt != 'default_title_portlet_portlet.jsp')
    url_title = theme_title_cnt;

    var title_par="?content_url="+URLenc(url)+"&content_area="+pagelet+'_'+URLenc(resource)+"_content&title="+URLenc(title)+"&opened="+opened;
    if(ZtVWeb.Include("../"+m_cThemePath+"/jsp-decorators/"+url_title+title_par,cnt_title)==404)
      ZtVWeb.Include("../jsp-decorators/"+url_title+title_par,cnt_title);
    window[pagelet+"_s_cont"].registerDraglet(new Z.Draglet(cnt_container.id,cnt_title.id));


     var cnt_container_column_cb=document.createElement('div');
     cnt_container_column_cb.className="column_cb";
     cnt_container.appendChild(cnt_container_column_cb);


     var cnt_container_column_i1=document.createElement('div');
     cnt_container_column_i1.className="column_i1";
     cnt_container_column_cb.appendChild(cnt_container_column_i1);

     var cnt_container_column_i2=document.createElement('div');
     cnt_container_column_i2.className="column_i2";
     cnt_container_column_i1.appendChild(cnt_container_column_i2);

     var cnt_container_column_i3=document.createElement('div');
     cnt_container_column_i3.className="column_i3";
     cnt_container_column_i2.appendChild(cnt_container_column_i3);

     var cnt_container_column_shell=document.createElement('div');
     cnt_container_column_shell.className="column_shell";
     cnt_container_column_i3.appendChild(cnt_container_column_shell);


     var cnt_container_column_b=document.createElement('div');
     cnt_container_column_b.className="column_b";
     cnt_container_column_cb.appendChild(cnt_container_column_b);


     var cnt_container_column_bb=document.createElement('div');
     cnt_container_column_bb.className="column_bb";
     cnt_container_column_b.appendChild(cnt_container_column_bb);

     var cnt_container_column_bbb=document.createElement('div');
     cnt_container_column_bbb.className="column_bbb";
     cnt_container_column_bb.appendChild(cnt_container_column_bbb);

    }

  var cnt_content=document.createElement('div');
  cnt_content.id=pagelet+"_"+resource+"_content";
  cnt_content.style.display='block';

  if(url_title!=null){
     cnt_container_column_shell.appendChild(cnt_content);
     cnt_container.appendChild(cnt_container_column_cb);
    } else {  cnt_container.appendChild(cnt_content);}

  if(opened=='false') cnt_content.style.display='none';
  ZtVWeb.Include(url,cnt_content,true);
  window["Pagelet_mapId"][resource]=pagelet+"_"+resource+"_content";
}

function appendTab(pagelet,group,resource,url,title,forceIframe,tabs_target,layer_to_tab){
  if(!resource) return false;
  resource=resource.replace(/[^a-zA-Z_0-9]/g, "");
  if(typeof(pagelet)=='string'){
    var pageletId=pagelet;
    pagelet=window[pagelet];
  }
  if(!Empty(tabs_target)){
    for(var r in pagelet.resources){
      var res=pagelet.resources[r];
      if(res.type=='group' && res.tabs_target && res.tabs_target==tabs_target)
        group=res.name;
    }
    if(group==null && tabs_target=='main'){
      if(pagelet.activeGroup){ // Apre il link nel tab corrente
        var iframe_target;
        var iframe_target_cont=pagelet[pagelet.activeGroup].tabContainer.GetSelectedTabsBody()[0];
        var currentTabId=pagelet[pagelet.activeGroup].tabContainer.GetSelectedTabId()[0];
        var tab_registeredName=pagelet[pagelet.activeGroup].tabContainer.registeredName;
        ZtVWeb.POM.addObj(currentTabId,title,'tabObj',pagelet[pagelet.activeGroup].id);
        if(iframe_target_cont){
          for(var i=0;i<iframe_target_cont.childNodes.length;i++){
            if(iframe_target_cont.childNodes[i].tagName=='IFRAME'){
              iframe_target=iframe_target_cont.childNodes[i];
              break;
            }
          }
          if( !iframe_target ) { return false;}
          //iframe_target.setAttribute("spparentobjid",currentTabId);
          iframe_target.src=url;  //+(url.indexOf('?')>-1?'&':'?') + 'SPParentObjId='+currentTabId;
          document.getElementById(tab_registeredName+'_'+iframe_target_cont.id+'_TAB_href').innerText=title; // cambio il titolo
          //Aggiorno l'input che tiene l'url
          // debugger
          // document.getElementById(iframe_target_cont.id+"_content_src").value=iframe_target.src;
          return true
        }
      }
    }
    if(group==null && tabs_target!='main') 
      return false;
  }
  if(!pagelet[group]) return;
  var tabObj=pagelet[group].tabContainer;
  pagelet.activeGroup=group;
  var pageletId=pagelet.id;
  var container=pagelet[group].Ctrl;
  var cc=LibJavascript.AlfaKeyGen(5);
  resource=resource+'_'+cc;
  var cnt_container=document.createElement('div');
  cnt_container.id=pageletId+"_"+resource+"_container"
  container.appendChild(cnt_container);
  var cnt_content=document.createElement('div');
  cnt_content.id=pageletId+"_"+resource+"_content";
  pagelet[group].tabs.push(cnt_content.id);
  cnt_content.style.display='block';
  cnt_container.appendChild(cnt_content);
  tabObj.AddTab({name:cnt_content.id, element:cnt_content.id,caption:title,onExpand:null,appended:true,target_name:resource,'layer_to_tab':layer_to_tab/*riferimento al modalLayer trasformato in tab*/});
  tabObj.tabList.push(cnt_content.id);
  ZtVWeb.POM.addObj(cnt_content.id,title,'tabObj',pagelet[group].id);
  if(url.indexOf("../servlet/")>-1 || forceIframe){
    var cnt_content_iframe=document.createElement('iframe');
    cnt_content.appendChild(cnt_content_iframe);
    cnt_content_iframe.setAttribute("spparentobjid",cnt_content.id);
    cnt_content_iframe.src=url; //+(url.indexOf('?')>-1?'&':'?')+'SPParentObjId='+cnt_content.id;
    cnt_content_iframe.style.width='100%';
    cnt_content_iframe.name=resource;
    var id_url=Strtran(url,"../servlet","");
    //id_url = id_url.indexOf("?")>-1 ? id_url.substring(0, id_url.indexOf("?")) : id_url;
    //cnt_content_iframe.id=pageletId+'_'+id_url;
    cnt_content_iframe.id=pageletId+'_'+id_url+'_'+cc;
    cnt_content_iframe.frameBorder=0;
    cnt_content_iframe.marginWidth=0;
    cnt_content_iframe.marginHeight=0;
    cnt_content_iframe.allowTransparency='true';
    cnt_content_iframe.onload=function(event){
      resizeIframe(this);
    }
  }else
    ZtVWeb.Include(url,cnt_content,true);
  window["Pagelet_mapId"][resource]=pageletId+"_"+resource+"_content";
  if(!layer_to_tab){
    window.setTimeout("window."+pageletId+"_"+group+"_tabs.Select('"+pageletId+"_"+resource+"_content')",300);
  }
  
  return true;
}
function editTabTitle(pagelet,group,resource,title){
  var cnt_content=document.getElementById(pagelet+"_"+resource+"_content");
  var id_content= window["Pagelet_mapId"][resource];
  var tabObj=window[pagelet + "_"+group+"_tabs"];
  var tabHtml=document.getElementById(tabObj.registeredName+"_"+id_content+"_TAB_href");
  tabHtml.innerHTML=title;
}
function deletePortlet(PageletId,group,resource){
  var id_content= window["Pagelet_mapId"][resource];
  var portletHtml=document.getElementById(Strtran(id_content,"_content","")+"_container");
  portletHtml.style.display='none';
  var parent = portletHtml.parentNode;
  parent.removeChild(portletHtml);
}
function deleteTab(PageletId,group,resource,tabName){
  if(tabName){
    var cnt_content=document.getElementById(tabName);
    var tab_name=tabName;
  }else{
    var cnt_content=document.getElementById(PageletId+"_"+resource+"_content");
    var tab_name=PageletId+"_"+resource+"_content";
    
  }
  var id_content= window["Pagelet_mapId"][resource];
  var tabObj=window[PageletId + "_"+group+"_tabs"];
  var tabHtml=document.getElementById(tabObj.registeredName+"_"+id_content+"_TAB");
  //var tabContentHtml=document.getElementById(id_content);
  var parent_content=cnt_content.parentNode;
  parent_content.removeChild(cnt_content);
  var parent_tab=tabHtml.parentNode;
  parent_tab.removeChild(tabHtml);
  tabObj.removeTab(tab_name);
  var firstTabId;
  var found;
  for(var t=0;t<tabObj.tabList.length;t++){
    if(tabObj.tabList[t]==tab_name) tabObj.tabList[t]=null;
    if(!found) firstTabId= tabObj.tabList[t];
    if(firstTabId!=null) found=true;
  }
  if(firstTabId!=null)
    window.setTimeout("window."+PageletId+"_"+group+"_tabs.Select('"+firstTabId+"')",500);
}

function selectGroupItem(combo,single,title_close){
  if(combo["value"]!=''){
    var valueobj=new Function("return "+combo["value"]+";")();
    var url_selected=valueobj["url"];
    var container_selected=valueobj["container"];
    var content_selected=valueobj["content"];
    var valueobj_tmp;
    if(single){
      for(var i=1;i<combo.options.length;i++){
        valueobj_tmp=new Function("return "+combo.options[i].value+";")()
        if(valueobj_tmp.container!=container_selected){
          document.getElementById(valueobj_tmp.container).style.display='none';
        }else{
          document.getElementById(valueobj_tmp.container).style.display='block';
          if(Empty(document.getElementById(content_selected).innerHTML) && !title_close){
            ZtVWeb.Include(url_selected,document.getElementById(content_selected));
          }
        }
      }
    }else{
      document.getElementById(container_selected).style.display='block';
      if(Empty(document.getElementById(content_selected).innerHTML) && !title_close){
        ZtVWeb.Include(url_selected,document.getElementById(content_selected));
      }
    }
  }else{
    for(var i=1;i<combo.options.length;i++){
      valueobj_tmp=new Function("return "+combo.options[i].value+";")()
      document.getElementById(valueobj_tmp["container"]).style.display='none';
    }
  }
}
/*
window.portletIncludedLoaded=function(pname, pageletId, portletId){ //chiamato da VisualWEB
  var structure=window[pageletId+"_pagelet_structure"];
  if (structure ){  
    // navigo la struttura dall'ultima chiave inserita per mantenere l'ordine dei portlet 
    var keys = Object.keys(structure);
    for( var i=keys.length-1; i>=0; i--) {
      if( structure[keys[i]].type == 'group' ){
        var urls = structure[keys[i]].urls;
        for( var j=0;j<urls.length; j++){
          if( ZtVWeb.getResourceNameFromUrl(urls[j]) == pname ){
            structure[keys[i]].loaded[j] = true;
            structure[keys[i]].Ids[j] = portletId;
          }
        }
      } else if( structure[keys[i]].url && ZtVWeb.getResourceNameFromUrl(structure[keys[i]].url) == pname ){
        structure[keys[i]].Id = portletId;
      }
    }
  } else {
    if ( ZtVWeb.isInContainer() && parent.portletIncludedLoaded ) {
        parent.portletIncludedLoaded(pname, pageletId, portletId);
    }
  }
  // if(window[pageletId+"_pagelet_loading"]){
    // window.checkLoaded(pageletId);
  // }
};
*/
ZtVWeb.pageletIncludedLoaded=function(pname, parentPageletId, pageletId){ //chiamato da VisualWEB
  var structure=window[parentPageletId+"_pagelet_structure"];
  if (structure ){  
    /* navigo la struttura dall'ultima chiave inserita per mantenere l'ordine dei portlet */
    var keys = Object.keys(structure);
    for( var i=keys.length-1; i>=0; i--) {
      if( structure[keys[i]].type == 'group' ){
        var urls = structure[keys[i]].urls;
        for( var j=0;j<urls.length; j++){
          if( ZtVWeb.getResourceNameFromUrl(urls[j]) == pname ){
            structure[keys[i]].loaded[j] = true;
            structure[keys[i]].Ids[j] = pageletId;
          }
        }
      } else if( structure[keys[i]].url && ZtVWeb.getResourceNameFromUrl(structure[keys[i]].url) == pname ){
        structure[keys[i]].Id = pageletId;
      }
    }
  } else {
    if ( ZtVWeb.isInContainer() && parent.ZtVWeb.parentIncludedLoaded ) {
        parent.ZtVWeb.pageletIncludedLoaded(pname, parentPageletId, pageletId);
    }
  }
  // if(window[parentPageletId+"_pagelet_loading"]){
    // window.checkLoaded(parentPageletId);
  // }
};

window.checkLoaded=function(pageletId){
if( LoadAtEnd ){
  /* Gestione caricamento risorse al completo caricamento della pagina */
  var allLoaded=true;
  var item=null;
  for( item in window[pageletId+'_pagelet_structure']){
    if( window[pageletId+'_pagelet_structure'][item].type == 'group' ){
      if( !window[pageletId+'_pagelet_structure'][item].preloaded ) {
        if( !window[pageletId+'_pagelet_structure'][item].loaded[0] ) { //testo se e' caricato
          if( ZtVWeb.getPageletResource(window[pageletId+'_pagelet_structure'][item].urls[0],window[pageletId+'_pagelet_structure'][item].Ids[0]) ){
            window[pageletId+'_pagelet_structure'][item].loaded[0] = true;
          } else {
            allLoaded=false;
          }
        }
      } else {
        for( var i=0; i<window[pageletId+'_pagelet_structure'][item].loaded.length;i++) {
         if( !window[pageletId+'_pagelet_structure'][item].loaded[i] ) { //testo se e' caricato
           if( ZtVWeb.getPageletResource(window[pageletId+'_pagelet_structure'][item].urls[i],window[pageletId+'_pagelet_structure'][item].Ids[i])){
              window[pageletId+'_pagelet_structure'][item].loaded[i] = true;
            } else {
              allLoaded=false;
              break;
           }
         }
        }
      }
    } else {
     if( window[pageletId+'_pagelet_structure'][item].loaded === false ) {
        if( ZtVWeb.getPageletResource(window[pageletId+'_pagelet_structure'][item].url,window[pageletId+'_pagelet_structure'][item].Id)){
          window[pageletId+'_pagelet_structure'][item].loaded= true;
        } else {
          allLoaded=false;
          break;
       }
     }
    }
  }
  /* getPagelet e' definito solo quando la pagelet piu' esterna e' stata concusa */
  if( allLoaded && item && ZtVWeb.getPageletById(pageletId)){ 
      // navigazione tra le risorse della pagelet
    for( var item in window[pageletId+'_pagelet_structure']){
      var structure_item = window[pageletId+'_pagelet_structure'][item];
      // attivo i tab 
      if( structure_item.type == 'group'  && structure_item.tabs ){
        if( window[pageletId+"_"+window[pageletId+'_pagelet_structure'][item].name+"_tabs"] )
          window[pageletId+"_"+window[pageletId+'_pagelet_structure'][item].name+"_tabs"].Select( structure_item.tabs[0] );
        else
          window.setTimeout(function(){window.checkLoaded(pageletId)},100);
      }
    }
    window[pageletId+'_pagelet_loading']=false;
    /****  pagelet inclusa da un altra pagelet  ****/
    if(  window.getPagelet ) {
      window[pageletId].setFormStep();
      // LibJavascript.Events.addEvent(window,'load', function(){window[pageletId].setFormStep();});
      LibJavascript.Events.addEvent(window,'resize', function(event){window[pageletId].setFormStep();});
      window[pageletId].Loaded();
      ZtVWeb.FinalDispatchEvents();
    }
  }
}  /* Fine gestione caricamento risorse al completo caricamento della pagina */
else {  
  if( ZtVWeb.getPageletById(pageletId) ){
    window[pageletId+'_pagelet_loading']=false;
    window[pageletId].selectTab();
  } 
  if(  window.getPagelet ) {
    window[pageletId].setFormStep();
    // LibJavascript.Events.addEvent(window,'load', function(){window[pageletId].setFormStep();});
    LibJavascript.Events.addEvent(window,'resize', function(event){window[pageletId].setFormStep();});
    window[pageletId].Loaded();
    ZtVWeb.FinalDispatchEvents();
  }
}  
};

/* funzioni per tutti i ctrls delle pagelet */
ZtVWeb.StdPageletCtrl= function(){
  function removeClassWithPrefix(obj, prefix){ //this:element classList
    var classWithPrefix = LibJavascript.CssClassNameUtils.getClassWithPrefix(obj,prefix);
    for( var i=0; i< classWithPrefix.length; i++){
      LibJavascript.CssClassNameUtils.removeClass(obj,classWithPrefix[i]);
    }
  }

  
  this.init=function(obj){
    for( var key in obj){
      this[key] = obj[key];
    }
    this.form.addResource(this.name,this);
    this.container = document.querySelector("#"+this.form.id+"_"+this.id+"_container");
    this.structure = window[this.form.id+'_pagelet_structure'][this.form.id+"_"+this.id];
    if( Empty(this.structure) ){
      this.empty = true;
    } else {
      this.Ctrl = document.getElementById(this.structure.containerId);
      if( typeof(this.structure.close_condition) == 'boolean' )
        this.behavior = this.structure.close_condition ? 'hide' : this.behavior;
    }
    if( typeof(this.behavior) == 'undefined' )
      return; /* Old pagelet */ 
    
    /* Creazione della struttura stretch per la risorsa corrente */
    if( this.stretch && this.strechStructure ) {
      var struct = JSON.parse(this.strechStructure);
      if( struct ){
        this.stetchAreaContainer = this.areaContainer = struct.table; //per retrocompatibilita' lascio la precende areaContainer
        this.stetchRowContainer = struct.row;
        this.stetchCellContainer = struct.cell;
      }
    }
    
    if( this.empty ) {/* potrebbe trattarsi di una risorsa stretch */
      
    } else {
      this.setPosition();
      this.setDimension();
      this.setBehavior();
      this.setStretchBehavior();
      if( /(true|titled_w_c)/ig.test(this.titled) /* || this.behavior == 'popup' */ ){ //portlet per la chiusura del popup 
        this.titlePortlet = ZtVWeb.getPortletById(window[this.form.id+"_pagelet_structure"][this.form.id+"_"+this.id].title_portlet_id);
        this.setPopupPicker();
        if( this.behavior == 'popup' ){ 
          this.titlePortlet.toolbar.Append({ 
            id: "close",
            title: "",
            action: function(pagelet,name){ return function(){pagelet.HidePageletItem(name);}}(this.form,this.name),
            image: GetStyleVariable( "toolbar_image_close", {"Char":"59133","FontName":"iMobileIcon","Size":"18","Color":"rgba(0,0,0,.87)"}, this.titlePortlet.toolbar.cssClass)
          }, this.id +"_closeButton");
        }
      }   
    }
  }

  this.setStep= function(step){
    /* creo un clone del ctrl per poterci impostare le prop dello step senza perdere il default */
    var clone = this;
    if( this.layout_steps_values && Object.keys(this.layout_steps_values).length>0){
      if(this.layout_steps_values[step]){
        for( var prop in this.layout_steps_values[step]){
          clone[prop] = this.layout_steps_values[step][prop];
        }
      }
      this.setPosition();
      this.setDimension();
      this.setBehavior();
      this.setStretchBehavior();
      if( /(true|titled_w_c)/ig.test(clone.titled) /* || this.behavior == 'popup' */ ){
        this.titlePortlet = ZtVWeb.getPortletById(window[this.form.id+"_pagelet_structure"][this.form.id+"_"+this.id].title_portlet_id);
        clone.setPopupPicker();
        if( this.behavior == 'popup' ){ //portlet per la chiusura del popup 
          // Remove
          this.titlePortlet.toolbar.Append({ 
            id: "close",
            title: "",
            action: function(pagelet,name){ return function(){pagelet.HidePageletItem(name);}}(this.form,this.name),
            image: GetStyleVariable( "toolbar_image_close", {"Char":"59133","FontName":"iMobileIcon","Size":"18","Color":"rgba(0,0,0,.87)"}, this.titlePortlet.toolbar.cssClass)
          }, this.id +"_closeButton");
        }
      }
    }
  }
  
  this.setPopupPicker= function(){
    // this.titlePortlet.RemoveButtons();
    for( var i=0; i<this.popupItems.length; i++){
      var popupItem = this.popupItems[i];
      this.titlePortlet.toolbar.Append({ 
        id: "open",
        title: "",
        action: function(pagelet,it){ return function(){pagelet.ShowPageletItem(it.name,it.side);}}(this.form,popupItem),
        image: GetStyleVariable( "toolbar_image_hamburger", {"Char":"10247","FontName":"DejaVuSans-Bold","Size":"30","Color":"rgba(0,0,0,.87)"}, this.titlePortlet.toolbar.cssClass)
      }, this.id +"_openButton");     

      // this.titlePortlet.AddActionButton("menu", function(pagelet,it){ return function(){pagelet.ShowPageletItem(it.name,it.side);}}(this.form,popupItem));
    }
  }
  
  this.setPosition= function() {
    removeClassWithPrefix(this.container, "item_prefx_");
    removeClassWithPrefix(this.container, "item_suffx_");
    LibJavascript.CssClassNameUtils.addClass(this.container, "item_prefx_"+this.prefx);
    LibJavascript.CssClassNameUtils.addClass(this.container, "item_suffx_"+this.suffx);
    // this.container.classList.add( "item_prefx_"+this.prefx );
    // this.container.classList.add( "item_suffx_"+this.suffx );
  }
  
  this.setDimension= function() {
    removeClassWithPrefix(this.container, "item_width_");
    removeClassWithPrefix(this.container, "item_height_");
    // LibJavascript.CssClassNameUtils.removeClass(this.container, "pagelet_item");
    LibJavascript.CssClassNameUtils.removeClass(this.container, "flex_item");
    LibJavascript.CssClassNameUtils.removeClass(this.container, "flex_item_empty");
    LibJavascript.CssClassNameUtils.removeClass(this.container,"item_stretch");
    // if( !/(before_stretch|stretch|after_stretch)$/ig.test(this.behavior)){
    if( !this.stretchBehavior ){
      LibJavascript.CssClassNameUtils.addClass(this.container, "item_width_"+this.renderWidth );
      LibJavascript.CssClassNameUtils.addClass(this.container, "item_height_"+this.height );
    }
    if( this.is_flex_content) {
      LibJavascript.CssClassNameUtils.addClass(this.container, "flex_item" );
      if ( this.empty ) {
        LibJavascript.CssClassNameUtils.addClass(this.container, "flex_item_empty" );
      }
    }
    if( (typeof(this.stretch) == 'string' && this.stretch == "true") || typeof(this.stretch) == 'boolean' && this.stretch )
      LibJavascript.CssClassNameUtils.addClass(this.container, "item_stretch" );
  }
  
  this.setStretchBehavior= function() {
    removeClassWithPrefix(this.container, "item_stretch_behavior_");
    if( this.stretchBehavior ){
      LibJavascript.CssClassNameUtils.addClass(this.container, "item_behavior_"+this.stretchBehavior );
      LibJavascript.CssClassNameUtils.addClass(this.container, "item_width_"+this.renderWidth );
    }
  }
  
  this.setBehavior= function() {
    removeClassWithPrefix(this.container, "item_behavior_");
    LibJavascript.CssClassNameUtils.addClass(this.container, "item_behavior_"+this.behavior );
    if( this.behavior == 'popup' ){
      this.hideItem();
    }
  }
  
  this.hideItem= function() {
    if( (typeof(this.stretch) == 'string' && this.stretch == "true") || typeof(this.stretch) == 'boolean' && this.stretch ){
      if( this.form[this.areaContainer].behavior == 'popup' )
        this.form[this.areaContainer].hideItem();
    }
    LibJavascript.CssClassNameUtils.removeClass(this.container, 'item_behavior_show' );
    LibJavascript.CssClassNameUtils.addClass(this.container, 'item_behavior_hide' );
  }
  
  this.showItem= function() {
    if( (typeof(this.stretch) == 'string' && this.stretch == "true") || typeof(this.stretch) == 'boolean' && this.stretch ){
      if( this.form[this.areaContainer].behavior != 'show' )
        this.form[this.areaContainer].showItem();
    }
    LibJavascript.CssClassNameUtils.removeClass(this.container, 'item_behavior_hide' );
    LibJavascript.CssClassNameUtils.addClass(this.container, 'item_behavior_show' );
    ZtVWeb.adjustPortletSteps();
    ZtVWeb.queueWindowResized();
  }
  
  this.isHidden= function() {
    return LibJavascript.CssClassNameUtils.hasClass( this.container, 'item_behavior_hide');
    // return this.container.classList.contains('item_behavior_hide');
  }
  
  this.isEmpty= function() {
    return this.empty;
  }
}

ZtVWeb.StdPageletCtrl.prototype = new ZtVWeb.StdControl();


// ZtVWeb.PageletCtrl= function(form,id,steps) {
ZtVWeb.PageletCtrl= function(form, obj){
  this.form = form;
  this.name = this.form.id
  this.form.resources = {};
  this.form.pageletCtrl=this;
	for( var key in obj){
    this[key] = obj[key];
  }
  this.form.ctrls = [];
  // per compatibilita' con il newForm dei portlet
  this.form.ctrls.pages = [];
  this.form.ctrls.pages.push({});
  //
  this.form.Steps=(this.steps?this.steps.split(','):[]);
  this.form.Step="";this.form.Step_old="";
  ZtVWeb.StdEventSrc.call(this.form);
  // StdEventSrc.call(form);
  this.form.addObserver('this', this.form);
  this.form.__isAlive__=function(){};
  this.form.Ctrl = document.getElementById(this.id+"_container");
  if(this.stretch=='true'){
    LibJavascript.CssClassNameUtils.addClass( document.querySelector('html'), 'stretch');
    LibJavascript.CssClassNameUtils.addClass( document.querySelector('body'), 'stretch');
    LibJavascript.CssClassNameUtils.addClass( this.form.Ctrl, 'stretch');
  }
  
  // this.setCtrlStdMethods(this);
  this.form.EnablePageCall=function( group ){
    if( this[group]) {
      var groupId =  this[group].id;
      if( window[this.id+'_pagelet_structure'][this.id+"_"+groupId]&& window[this.id+'_pagelet_structure'][this.id+"_"+groupId].type=='group' && this[group]){
        for(var i = 0; i < window[this.id+'_pagelet_structure'][this.id+"_"+groupId].resources.length ; i++){
          if(this[group].tabs)
            this[group].EnablePage(i+1);
        }
      }
    }
  }
  /* Function called from plan to add 
   *
  */
  this.form.addObservers=function(planObj){ 
    for( var item in window[this.id+'_pagelet_structure']){
      if(window[this.id+'_pagelet_structure'][item].type == 'group'){
        this[window[this.id+'_pagelet_structure'][item]['name']].addObservers(planObj);
      } else if(window[this.id+'_pagelet_structure'][item].type == 'resource'){
        var res = ZtVWeb.getPageletResource(item,window[this.id+'_pagelet_structure'][item].Id);
        if(res)  
          res.addObserver(window[this.id+'_pagelet_structure'][item].name,planObj)
      }
    }
  }
  this.form.ShowTitle=function(titleId, contentId ){
    document.getElementById(titleId).style.display = "";
    document.getElementById(contentId).style.display = "none";
  }
  this.form.ShowContent=function(titleId, contentId ){
    document.getElementById(contentId).style.display = "";
    document.getElementById(titleId).style.display = "none";
  }
  /* funzioni per la gestione degli step */
  
  this.form.setFormStep=function(bFromResize){    
    if(this.Steps.length==0) return;
    this.Steps=this.Steps.sort(function(a,b){
      return parseInt(a)>parseInt(b);
    });
    var pw=this.Ctrl.offsetWidth;
    var step = LibJavascript.Array.indexOf(this.Steps, pw, function(el){
      return ( pw < el );
    })-1;
    if(step==-2) step=this.Steps.length-1; // se non trova niente sei nello step oltre il piu grande
    if(step==-1) step=0;
    this.Step=this.Steps[step];
    if(this.Step_old!=this.Step){
      this.setCtrlsStepPos(step,bFromResize);
      if( this.Step_old )
        LibJavascript.CssClassNameUtils.removeClass( document.getElementById(this.id+"_container"), "layout_step_"+this.Step_old);
      LibJavascript.CssClassNameUtils.removeClass( document.getElementById(this.id+"_container"), "layout_step_"+this.Step);
      this.Step_old=this.Step;
      this.dispatchEvent("StepChanged",this.Step);
    }
  }
  
  //Metodo al cambio di step 
  form.setCtrlsStepPos=function(step,bFromResize){
    for( var item in window[this.id+'_pagelet_structure']){
      this[window[this.id+'_pagelet_structure'][item].name].setStep(this.Step);
    }
  }
  form.ShowPageletItem=function(name,position){
    // titledItem.titlePortlet.RemoveButton(id);
    var item = this[name];
    if(item) // l'item puo n esserci se e' un gruppo o una risorsa
      item.showItem();
  }
  form.HidePageletItem=function(name,position){
    var item = this[name];
    if(item) // l'item puo n esserci se e' un gruppo o una risorsa
      item.hideItem();
  }
  form.IsStretch=function(){
    return this.stretch;
  }
  form.addResource=function(name,res){
    // if( this.resources[name] ) {
      // this.resources[name].push(res);
    // } else {
      this.resources[name] = res
    // }
  }
  form.Loaded=function(){
    for( var item in window[this.id+'_pagelet_structure']){
      if( this[window[this.id+'_pagelet_structure'][item].name].Loaded)
        this[window[this.id+'_pagelet_structure'][item].name].Loaded();
    }
    this.dispatchEvent('Loaded');
  }
  
  form.selectTab=function(){
    // var r;
    // for( var res in this.resources ) {
      // r = this.resources[res];
      // if ( r.type == 'group' && r.tabs )
        // r.tabContainer.Select(r.tabs[0]);
    // }
    for( var item in window[this.id+'_pagelet_structure']){
      var structure_item = window[this.id+'_pagelet_structure'][item];
      if( structure_item.type == 'group'  && structure_item.tabs ){
        if( window[this.id+"_"+window[this.id+'_pagelet_structure'][item].name+"_tabs"] )
          window[this.id+"_"+window[this.id+'_pagelet_structure'][item].name+"_tabs"].Select( structure_item.tabs[0] );
      }
    }
  }
}
ZtVWeb.PageletCtrl.prototype = new ZtVWeb.StdPageletCtrl();

// ZtVWeb.GroupCtrl= function (form, name, id, w, h, row, col, prefx, suffx, wizard, layout_steps_values) {
ZtVWeb.GroupCtrl= function(form, obj){
  this.form = form;
	this.init(obj);
  //this.tabs_target
  // this.addToForm( this.form, this );
  ZtVWeb.StdEventSrc.call( this );
  this.addObserver(this.name, this);
  this.addObservers=function(planObj){
    for(var resource in this.resources){
      this.resources[resource].addObserver(resource,planObj);
    }
  }
  /* init empty prop */
  this.resources = {};
  this.tabs = [];
  /* actionCode function */
  this.getResourcesName=function(){
    if( !this.empty )
      return this.structure.urls;
  }
  this.getResource=function ( resName ) {
    if( Object.keys(this.resources).length == 0){
      for( var i=0; i< this.structure.urls.length; i++){
        var res = ZtVWeb.getPageletResource(this.structure.urls[i], this.structure.Ids[i]);
        if( res )
          this.resources[this.structure.resources[i]] = res;
      }  
    }else if(!this.resources[resName]){
      for(var i=0; i< this.structure.resources.length; i++){
      if(this.structure.resources[i]==resName)
        this.resources[resName]=ZtVWeb.getPortletById(this.structure.Ids[i]);
      }
    }
    return this.resources[resName];
  };
  this.getResources=function(){
    return this.resources;
  }
  this.GetTabsLength=function(){
    return this.tabs.length;
  };
  if( !this.empty ){
    this.Iframe = this.Ctrl.getElementsByTagName('iframe')[0];
    this.tabContainer = window[this.form.id+"_"+this.name+"_tabs"];
    this.tabs = this.structure.tabs;
    for( var i=0; i< this.structure.urls.length; i++){
      var res = ZtVWeb.getPageletResource(this.structure.urls[i], this.structure.Ids[i]);
      if( res )
        this.resources[this.structure.resources[i]] = res;
    }
  }
  for( var resName in this.resources ) {
    this.form.addObserver(resName,this.resources[resName]);
  }
  this.Loaded = function(){
    for( var resName in this.resources ){
      if(this.resources[resName] ){
        if( this.resources[resName].Loaded){ //page e pagelet 
          this.resources[resName].Loaded()
        } else if(this.resources[resName].this_PageLoaded) { //portlet 
          this.resources[resName].this_PageLoaded();
        }
      } 
    }
  }
  
  this.currentPage = 1;
  this.CurrentPage = function(){
    return this.currentPage;
  }; 
  this.Prev=function(){
    this.tabContainer.Prev();
  };
  this.Next=function(){
    this.tabContainer.Next();
  };
  this.maxPageVisited=1;
  
  this.PageOpened = function( page ){
    this.currentPage = this.tabs.indexOf(page)+1;
    this.maxPageVisited=(this.currentPage>this.maxPageVisited?this.currentPage:this.maxPageVisited);
    /* when change page call refresh of resources */
    ZtVWeb.adjustPortletSteps();
    ZtVWeb.queueWindowResized();
  }
  this.EnablePage=function(n){
    var disable=false;
    if(this.wizard ){
      if( this.currentPage == (n-1) ){
        this.tabContainer.SetDisable(this.tabs[n-1],false);
      }else{
        if(this.maxPageVisited < (n-1)){ // Disabilita sempre i tab successivi n+2
        //if(form.currentPage <(n-1)){ // Disabilita sempre i tab successivi n+2
        //if(n>1 && form.ZtTabs.IsDisabled(n-1)){ // Disabilita i tab successivo se il precedente è disabilitato
          disable=true;
          this.tabContainer.SetDisable(this.tabs[n-1],true);
        }
      }
    } 
    var tabConditionName = 'EnablePage_'+( this.tabs[n-1].replace(this.form.id+"_","").replace("_content",""));
    if( window[form.planName] && window[form.planName][this.name] && window[form.planName][this.name][tabConditionName]) { //se e' definita this_EnablePageX nel plan abilita o disabilita il tab X
      if( !window[form.planName][this.name][tabConditionName].call(window[form.planName])){
        this.tabContainer.SetDisable(this.tabs[n-1],true);
        disable=true;
      }else{
        if(!disable)
          this.tabContainer.SetDisable(this.tabs[n-1],false);
      }
    }
    /* Abilitazione dei pushbutton con type_wizard forward o back */
    if(this.wizard && this.currentPage == n ){
      if( window[form.id+'_pagelet_structure']['wizard_footer'] ){ //static portlet in this pagelet
        var portlet = ZtVWeb.getPortlet('wizard_footer');
        for(i=0;i<portlet.ctrls.length;i++){
          var ctl=portlet.ctrls[i];
          if(ctl instanceof ZtVWeb.PushBtnCtrl && ctl.type_wizard == "forward" ){
            if ( !this.tabContainer.IsDisabled(n) && (n-1) < this.tabs.length ) {
              ctl.Enabled();
            } else {
              ctl.Disabled();
            }
          }
        }
      }
      
    }
  }
  this.ValidateCtrlsPage=function(){
    if(!this.tabs[this.currentPage-1]) return true;// bypasso non c'è piu il tab 
    var res = this.getResource(this.tabs[this.currentPage-1].replace(this.form.id+"_","").replace("_content",""));
    if( res && res.ValidateCtrlsPage){
      return res.ValidateCtrlsPage();
    }
    return true;
  }
  this.ValidateChangePage=function(to){
    if( this["ValidatePageChange"+this.currentPage])
      return this["ValidatePageChange"+this.currentPage].call(window[form.planName] ? window[form.planName] : this, to);
    return true;
  }
}
ZtVWeb.GroupCtrl.prototype = new ZtVWeb.StdPageletCtrl();

// ZtVWeb.ResourceCtrl= function (form, name, id, w, h, row, col, prefx, suffx, resource_id, in_iframe, layout_steps_values) {
ZtVWeb.ResourceCtrl= function(form, obj){
  this.form = form;
	this.init(obj);
  var _this = this;
  this.addToForm( this.form, this );
  ZtVWeb.StdEventSrc.call( this );
  this.src = '';
  if( !this.empty ){
    this.Iframe =(!Empty(this.Ctrl)?getIframe():null);
    // this.setCtrlStdMethods(this);
    // this.setAsEventSrc( this );
    if ( this.Iframe ) {
      this.src = getIframe().getAttribute( 'data-sp-src' );
      getIframe().removeAttribute( 'data-sp-src' );
    }
  }
  this.getResource=function(){
    if( !this.empty )
      return ZtVWeb.getPageletResource(this.structure.url,this.structure.Id);
    return null; 
  }
  function getIframe () {
    if( !this.empty )
      return _this.Ctrl.querySelectorAll( 'iframe' )[0];
  }
  this.setSrc = function () {
    // if( this.in_iframe ){
      this.dispatchEvent( "beforeSetSrc" );
      if ( this.src ) {
        getIframe().src = this.src;
      }
    // }
  }
  this.form.addObserver(this.name,this.getResource());
  this.Loaded= function(){
    if( this.getResource() ){
      if( this.getResource().Loaded ) {
        this.getResource().Loaded(); //pagelet e page 
      } else if(this.getResource().this_PageLoaded) {// portlet
        this.getResource().this_PageLoaded();
      }
    }
  }
  
}
ZtVWeb.ResourceCtrl.prototype = new ZtVWeb.StdPageletCtrl();

//ZtVWeb.StaticCtrl= function (form, name, id, w, h, row, col, prefx, suffx, src, layout_steps_values) {
ZtVWeb.StaticCtrl= function(form, obj){
  this.form = form;
  this.init(obj);
  if( !this.empty) {
    this.Iframe = this.Ctrl.getElementsByTagName('iframe')[0];
    this.setCtrlStdMethods(this);
  }
  this.inIframe=function(){
    return /(true)/ig.test(this.in_iframe);
  }
  this.getResource=function(){
    if( !this.empty )
      return ZtVWeb.getPageletResource(this.structure.url,this.structure.Id);
    return null; 
  }
  this.form.addObserver(this.name,this.getResource());
  this.Loaded= function(){
    if( this.getResource() ){
      if( this.getResource().Loaded ) {
        this.getResource().Loaded(); //pagelet e page 
      } else if(this.getResource().this_PageLoaded) {// portlet
        this.getResource().this_PageLoaded(); 
      }
    }
  }
}
ZtVWeb.StaticCtrl.prototype = new ZtVWeb.StdPageletCtrl();

// ZtVWeb.AreaCtrl= function (form, name, id, w, h, row, col, prefx, suffx, items, layout_steps_values) {
ZtVWeb.AreaCtrl= function(form, obj){
  this.form = form;
  this.init(obj);
  this.form.ctrls = [];
  this.setCtrlStdMethods(this);
}
ZtVWeb.AreaCtrl.prototype = new ZtVWeb.StdPageletCtrl();


ZtVWeb.PageCtrl = function(form, id, pageletId ){
  this.form = form;
  this.form.pagelet = window[pageletId];
  this.form.pagelet.addObservers(this.form); // attacco gli eventi dei portlet dei gruppi e le risorse all'oggetto plan
  ZtVWeb.StdEventSrc.call( form );
  form.addObserver( 'this', form );
  form.Loaded=function(){
    this.pagelet.Loaded(); //funzione che richiama la Loaded della pagelet 
    this.dispatchEvent('Loaded');
  }
}
ZtVWeb.PageCtrl.prototype = new ZtVWeb.StdControl();

ZtVWeb.getPageletResource = function( url, id ){
  if( id && ZtVWeb.getPortletById( id ) ){
    return ZtVWeb.getPortletById( id );
  } else {
    var name = ZtVWeb.getResourceNameFromUrl( url );
    if( window[name] && window[name].pagelet ){ // e' una page 
      return window[name];
    }
    if( ZtVWeb.getPageletById(id) ) { //e' una pagelet
      return ZtVWeb.getPageletById(id);
    }
  }
  return null;
}
/*
ZtVWeb.getResourceNameFromUrl= function(url){
  if( url.indexOf("/") >-1)
    url = url.substring(url.lastIndexOf("/")+1);
  url = Strtran(url, '_portlet.jsp', '');
  url = Strtran(url, '.jsp', '');
  return url;
}
*/
