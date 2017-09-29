//Importo interlib
if (typeof(interlib_browserType)=='undefined'){
  if(typeof(ZtVWeb)!='undefined') {
	ZtVWeb.RequireLibrary('../InterLib.js')
  } else {
	LibJavascript.RequireLibrary('../InterLib.js')
  }
}
var BrowsName = InterLib.browserType();
var BrowsVersion = InterLib.browserVersion();


/**************************************************************************************************************************************
MODAL LAYER CON EFFETTO CARICAMENTO: crea il div una sola volta
**************************************************************************************************************************************/

//---------- Inizializza il layer
function initModalLayer(){
   if (typeof(MooTools)=='undefined' || typeof(MooTools.More)=='undefined') {
      if(typeof(ZtVWeb)!='undefined') {
        ZtVWeb.RequireLibrary('../mootools.js')
        ZtVWeb.RequireLibrary('../mootools_more.js')
      }else{
        LibJavascript.RequireLibrary('../mootools.js')
        LibJavascript.RequireLibrary('../mootools_more.js')
      }
    }

	
	var src = 'SpTheme_ZIP/segnalazioni.css';
	
	  var cssKey=src.replace(/\./g,'_').replace(/\//g,'$');
	  var l=document.createElement('link');
	  l.rel="StyleSheet";
	  l.type="text/css";
	  l.href=ZtVWeb.SPWebRootURL+'/'+src;
//	  document.getElementsByTagName('head')[0].appendChild(l);
	
	
	
	
    var body = document.getElementsByTagName('BODY')[0];
    //se ancora non esiste il message box lo creo
    if (!this._mbTool || !this._mbbodyTool) {
        var mb = document.createElement("DIV");
		mb.id = 'ml_cinema' 
        mb.style.position="absolute";
        mb.style.zIndex=-99999;
        mb.style.opacity=0;
        mb.style.filter="alpha(opacity=0)";
        mb.style.visibility="visible";
		mb.style.display="block";
		
        var divbody = document.createElement("DIV");
        divbody.id = 'ml_divbody' 
		divbody.style.zIndex=-99999;
        divbody.style.overflow="hidden";
		divbody.style.border="1px solid #BCBCBC";
		divbody.style.boxShadow="0 0 5px #AEAEAE"
        divbody.style.opacity=0;
        divbody.style.filter="alpha(opacity=0)";		
		divbody.style.visibility="visible";
		divbody.style.display="block";
		
        this._mbTool = mb;
        this._mbbodyTool = divbody;
        body.appendChild(mb);
        body.appendChild(divbody);
		
    }
    //configuro il message box
    this._mbTool.style.display="block";
    this._mbTool.style.backgroundColor = '#F9F9F9';
    this._mbTool.style.top="0px";
    this._mbTool.style.left="0px";
    //this._mbTool.style.width=(body.clientWidth - 0) + "px";
	this._mbTool.style.width="100%";
	this._mbTool.style.height="100%";
	
    this._mbbodyTool.style.backgroundColor = '#FFFFFF';
    this._mbbodyTool.style.display="";
    this._mbbodyTool.style.width="400px";
    this._mbbodyTool.style.height="150px";
    this._mbbodyTool.style.fontSize='10pt';
    this._mbbodyTool.style.fontFamily="tahoma";
	this._mbbodyTool.style.position='absolute';
	this._mbbodyTool.style.top='50%';
	this._mbbodyTool.style.left='50%';
    this._mbbodyTool.style.marginTop='-'+(150/2) + "px";
    this._mbbodyTool.style.marginLeft='-'+(400/2) + "px";
    
	var src="../jsp/hfpr_wmodalmsgtool_portlet.jsp?"
    ZtVWeb.Include(src,this._mbbodyTool)
	this._mbbodyTool.appendChild(l)
}


//---------- Mostra il layer
function showModalLayer(Title,Msg,lvl,btn,Portlet,Width,Height){
	if(Empty(lvl)) lvl='V';
	if(Width==0 || !Width) Width=400;
	if(Height==0 || !Height) Height=150;
	//Per explorer devo ricreare ogni volta l'oggetto
	if (BrowsName=='Explorer') {
	  ZtVWeb.removePortletObj('hfpr_wmodalmsgtool');
	  this.initModalLayer()
	}
	
	var obj = {level:lvl,width:Width,height:Height,title:Title,message:Msg,buttons:btn,portlet:Portlet}
    obj = JSON.encode(obj)
    ZtVWeb.raiseEvent('ModalParms', {obj:obj});
	
    $('ml_cinema').tween('opacity',0.5)
    $('ml_divbody').tween('opacity',1)	
	
	this._mbTool.style.zIndex=10002;
	this._mbbodyTool.style.zIndex=10003;
	this._mbbodyTool.style.display="";
    this._mbbodyTool.style.width=Width + "px";
    this._mbbodyTool.style.height=Height + "px";	
    this._mbbodyTool.style.marginTop='-'+(parseInt(Height)/2) + "px";
    this._mbbodyTool.style.marginLeft='-'+(parseInt(Width)/2) + "px";

}

//---------- Nasconde il layer
function hideModalLayer(){
	this._mbTool.style.opacity=0;
    this._mbTool.style.filter="alpha(opacity=0)";
	this._mbTool.style.zIndex=-99999;
	
	this._mbbodyTool.style.opacity=0;
    this._mbbodyTool.style.filter="alpha(opacity=0)";
	this._mbbodyTool.style.zIndex=-99999;
	this._mbbodyTool.style.display="none";
}