(function() {//MakeInterLib
var focusedWindow; //contiene il riferimento alla pagina a cui dare il focus (showMessageBoxMA)


//---Start function: NVL
function interlib_NVL(value, def) {
   if (Empty(value)) {
     return def;
   } else {
     return value;
   }
}
//---End function

//---Start function: RndString
function interlib_RndString(lung) {
  var res = "";
  return res;
}
//---End function

//---Start function: Trunc
function interlib_Trunc(text, len) {
  var res = "";
  return res;
}
//---End function

//---Start function: _interlibmain
String.prototype.appendGet = function(key, value) {
	if (/\?.+$/.test(this)) {
		return this.concat('&').concat(key).concat('=').concat(value);
	} else if (/\?$/.test(this)) {
		return this.concat(key).concat('=').concat(value);
	} else {
		return this.concat('?').concat(key).concat('=').concat(value);
	}
}
var interlib__help_opts = {parent:document.body, id:'interlib_dh', 
   applyto:null, callback:null, 
   bgColor:'white', bgImage:'url(w.gif)', 
   fontFamily:'Verdana', fontSize:'8pt',
   position:'cursor-right', top:0, left:0,
   zIndex:0, cursor:'help'
};
var interlib__menu_opts = {parent:document.body, id:'interlib_dm',
   bgColor:'white', bgImage:'url(w.gif)',
   fontFamily:'Verdana', fontSize:'8pt',
   position:'cursor-right', top:0, left:0,
   zIndex:0, buttonWidth:20, buttonHeight:20,
   buttonBgColor:'', timeout: 5000,
   border: 'solid 1px', buttonBorder:'solid 1px',
   buttonsPerRow:0
};
var interlib__progressBar_opts = {
   src:'about:blank',
   mode:'init',
   display:'greater-than-0', //always, greater-than-0, normal
   interval: 1000,
   callback: null
};
var interlib__progressBarEx_opts = {
   parent: null,
   id: 'interlib_pb',
   display:'greater-than-0', //always, greater-than-0, normal
   interval: 1000,
   callback: null,
   tag: null,
   backgroundImage: 'url(../images/login_scuro.gif)',
   backgroundColor: '#ececec'  
};
var interlib__showMessageBox_opts = {
   backgroundColor: '#F9F9F9',
   boxBackgroundColor: '#ffffff',
   width: 350,
   height: 200,
   paddingTop: 0,
   paddingBottom: 0,
   paddingLeft: 0,
   paddingRight: 0,
   callback: null,
   title: 'Title',
   msg: 'text text text text text text',
   message: null,
   level: '', //N, E, W, ...
   coderr: '0',
   date: new Date(),
   toparse: null,
   backgroundColorHeader: 'LightSlateGray',
   colorHeader: 'white',
   fontWeightHeader: 'bold',
   borderTopFooter: 'solid 1px #999',
   buttons: null //[{text:'text', action:function, href:'href'}, {...}]
};
function interlib__interlibmain() {
//non serve a nulla
}
//---End function

//---Start function: addEvent
function interlib_addEvent(element, event, pcallback) {
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

//---Start function: addOption
//aggiunge una opzione alla combo con identificativo specificato
function interlib_addOption(id, text, value) {
	var cmb = document.getElementById(id);
	if (cmb && cmb.tagName == 'SELECT') {
		var opt = document.createElement("OPTION");
		opt.value = value;
		opt.text = text;
		try {
			cmb.add(opt, null);
		} catch (ex) {
			cmb.add(opt);
		}
	}
}
//---End function

//---Start function: browserType
function interlib_browserType() {
  var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
  };
  BrowserDetect.init();
  return BrowserDetect.browser;
}
//---End function

//---Start function: browserVersion
function interlib_browserVersion() {
  var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
  };
  BrowserDetect.init();
  return BrowserDetect.version;
}
//---End function

//---Start function: changeEvent
/**
  * 
  */
function interlib_changeEvent(obj, event, callback) {
   if (!obj) return false;
   if (!event) return false;
   if (!callback) return false;
   try {
      if (obj.tagName) {
        obj[event+'Old'] = obj[event];
        obj[event] = callback;
      } else if (obj[0] && obj[0].tagName) {
        for (var ii=0; ii<obj.length; ii++) {
          if (!obj[ii]) continue;
          obj[ii][event+'Old'] = obj[ii][event];
          obj[ii][event] = callback;
        }
      }
      return true;
   } catch (ex) {
      return false;
   }
}
//---End function

//---Start function: clearCombo
function interlib_clearCombo(id) {
	var cmb = document.getElementById(id);
	if (cmb && cmb.tagName == 'SELECT') {
		for (var ii=cmb.length-1; ii>=0; ii--) {
			cmb.remove(ii)
		}
	}
}
//---End function

//---Start function: concatPath
function interlib_concatPath(path1, path2) {
  var res = "";
  return res;
}
//---End function

//---Start function: execQuery
function interlib_execQuery(queryName, numrec, pars) {
   var userCode = Utilities.UserCode();
   var company = Utilities.GetCompany();
   //
   var aaaaaaa = BatchApplet();
   aaaaaaa.SetParameterString("__user",WtA(userCode,'C'));
   aaaaaaa.SetParameterString("__company",WtA(company,'C'));
   aaaaaaa.SetParameterString("__query",WtA(queryName,'C'));
   aaaaaaa.SetParameterString("__numrec",WtA(numrec,'C'));
   for (var par in pars) {
     aaaaaaa.SetParameterString(par,WtA(pars[par],'C'));
   }
   aaaaaaa.SetParameterString('m_bApplet','true');
   aaaaaaa.CallServlet(PlatformPathStart('SPJSONQuery'));
   var result = aaaaaaa.GetString();
   var obj = eval(result);
   return obj;
}
//---End function

//---Start function: explodeInterval
function interlib_explodeInterval(value) {
  var res = new Array();
  var ss1 = value.split(",");
  for (var ii=0; ii<ss1.length; ii++) {
	   var ss2 = ss1[ii].split("-");
	   if (ss2.length==1) {
		   res[res.length] = ss2[0];
	   } else {
		   for (var jj=ss2[0]; jj<=ss2[1]; jj++) {
			   res[res.length] = jj;
		   }
	   }
   }
  return res.join(",");
}
//---End function

//---Start function: fixOnMouseOut
function interlib_fixOnMouseOut(element, event, callback) {
	var current_mouse_target = null;
	if( event.toElement ) {
		current_mouse_target 			 = event.toElement;
	} else if( event.relatedTarget ) {
		current_mouse_target 			 = event.relatedTarget;
	}
	if( !InterLib.isChildOf(element, current_mouse_target) && element != current_mouse_target ) {
		callback();
	}
}
//---End function

//---Start function: getElementByName
//cerca un elemento con l'attributo name specificato
//nel caso esistano più elementi con lo stesso name verrà controllato
//l'indice (index, per default vale 1)
function interlib_getElementByName(name, index) {
	if (!name) return null;
	index = index || 1; //se non definito restituisco solo il primo elemento trovato
  //cerco tutti gli elementi
	var els = document.getElementsByTagName("*");
	var arr = new Array(); //elenco degli elementi trovati
	var nn=0; //indici elementi trovati
  //scorro gli elementi
	for (var ii=0; ii<els.length; ii++) {
    //se il nome è corretto e l'indice è quello voluto
		if (els[ii].name == name && (index==0 || index==++nn)) {
      //aggiungo l'elemento all'array
			arr.push(els[ii]);
		}
	}
  //restituisco tutto l'array nel caso siano stati trovati più elementi
  //altirmenti solo l'elemento trovato (o null se non ce ne sono)
	if (arr.length==0) {
		return null;
	} else if (arr.length==1) {
		return arr[0];
	} else {
		return arr;
	}
}
//---End function

//---Start function: getRealPath
function interlib_getRealPath(path, filename) {
  var res = "";
  return res;
}
//---End function

//---Start function: getTarget
function interlib_getTarget(event) {
   return event.target != null ? event.target : event.srcElement;
}
//---End function

//---Start function: isChildOf
function interlib_isChildOf(parent, child) {
   try {
	   if( child != null ) {
	     while( child.parentNode ) {
			   if( (child = child.parentNode) == parent ) {
				   return true;
			   }
		   }
	   }
	   return false;
   } catch (ex) {
     return false;
   }
}
//---End function

//---Start function: join
function interlib_join(separator, excludeEmpty, values) {
   if (arguments.length>2) {
  	 var arr = new Array();
  	 for (var ii=2; ii<arguments.length; ii++) {
  	   var arg = arguments[ii];
  		 if (!excludeEmpty || !Empty(arg)) {
  		   arr.push(arg);
  		 }
  	 }
  	 return arr.join(separator);
   } else {
  	 return "";
   }
}
//---End function

//---Start function: makeForm
//crea dinamicamente un tag FORM e ne restituisce il riferimento
//id: identificativo form
//method: GET oppure POST
//action: url di destinazione dei dati
//target: 
//params: parametri della form nel seguente formato
//   {par1:val1, par2:val2, ... , parn:valn}
//   es: {nome:'Gianfranco', eta:32}
//
//per inviare i dati richiamare il metodo submit()
//   es: var frm = makeForm(...); frm.submit();
function interlib_makeForm(id, method, action, target, params) {
   //eseguo i controlli sui parametri
   if(!/^(GET|POST)$/i.test(method)) {
     alert("makeForm: method not valid: " + method);
     return null;
   }
   if (Empty(id)) {
     alert("makeForm: id form cannot be empty");
     return null;
   }
   //creo la form
   var frm = document.getElementById(id);
   if (frm) document.body.removeChild(frm);
   frm = document.createElement("FORM");
   frm.id=id;
   document.body.appendChild(frm);
   frm.action=action;
   frm.method=method;
   frm.target=target;
   //aggiungo i parametri
   for (var par in params) {
     var el = document.createElement('INPUT');
     el.type='HIDDEN';
     el.name=''+par;
     frm.appendChild(el);
     el.value=params[par];
   }
   return frm;
}
//---End function

//---Start function: makeHelp
function interlib_makeHelp(opts) {
   opts = InterLib.mergeObj(interlib__help_opts, opts);
   var dh = InterLib[opts.id] = document.createElement('DIV');
	 dh._opts = opts;
   dh.id=opts.id;
   dh.style.backgroundColor=opts.bgColor;
   dh.style.backgroundImage=opts.bgImage;
   dh.style.fontFamily=opts.fontFamily;
   dh.style.fontSize=opts.fontSize;
   dh.style.top=opts.top+'px';
   dh.style.left=opts.left+'px';
   dh.style.position='absolute';
   dh.style.display='none';
   dh.style.border='solid 1px';
   dh.style.padding='5px';
   dh.style.zIndex=opts.zIndex;
   if (opts.parent == null) {
     opts.parent = document.body
   }
   opts.parent.appendChild(dh);
   dh._checkHelpPosition = function() {
     var parent = this._opts.parent;
     if (this.style.pixelLeft < 0) {
       this.style.pixelLeft = 5;
     } else if (this.style.pixelLeft + this.clientWidth > parent.clientWidth) {
       this.style.pixelLeft = parent.clientWidth - this.clientWidth - 5;
     }
   }
   dh.show = function(text, evt) {
     if (text!==0 && Empty(text)) return;
     evt = evt || window.event;
     this.innerHTML = text;
     this.style.display='';
     this.style.top=parseInt(evt.clientY + 15)+'px';
     this.style.zIndex = 9;
     if (this._opts.position == 'cursor-left') {
       this.style.left=parseInt(evt.clientX - this.clientWidth + 10)+'px';
     } else if (this._opts.position == 'cursor-right') {
       this.style.left=parseInt(evt.clientX + 10)+'px';
     } else if (this._opts.position == 'fixed') {
       //nulla da fare posizione fissa
     }
     this._checkHelpPosition();
     return dh;
   };
   dh.hide = function(evt) {
     dh.style.display='none';
     return dh;
   };
   dh.applyTo = function(obj, callback) {
     obj.style.cursor=this._opts.cursor ;
     obj.onmouseover = function() {dh.show(callback(obj, event))}
     obj.onmouseout = function() {dh.hide(event)}
     return dh;
   }
   return dh;
}
//---End function

//---Start function: makeMenu
function interlib_makeMenu(opts) {
   opts = InterLib.mergeObj(interlib__menu_opts, opts);
   var dh = InterLib[opts.id] = document.createElement('DIV');
     dh._opts = opts;
   dh.id=opts.id;
   dh.style.backgroundColor=opts.bgColor;
   dh.style.backgroundImage=opts.bgImage;
   dh.style.fontFamily=opts.fontFamily;
   dh.style.fontSize=opts.fontSize;
   dh.style.border=opts.border;
   dh.style.top=opts.top;
   dh.style.left=opts.left;
   dh.style.position='absolute';
   dh.style.display='none';
   dh.style.padding='2px';
   dh.style.zIndex=opts.zIndex;
   dh.onmouseover = function() {
     dh._entered=true;
     dh._clearTimeout();
   }
   dh.onmouseout = function(evt) {
     InterLib.fixOnMouseOut(this, evt || window.event, dh.hide)
   }
   dh._entered=false;
   dh._target=null;
   dh._ptTimeout=null;
   for (var ii=1; ii<arguments.length; ii++) {
     var btn = document.createElement('BUTTON');
     btn.style.width=opts.buttonWidth;
     btn.style.height=opts.buttonHeight;
     btn.style.border=opts.buttonBorder;
     btn.style.marginRight=2
     btn.style.marginBottom=2
     if (arguments[ii].img) {
       btn.innerHTML='<img align=absmiddle src=\'' + arguments[ii].img + '\'>';
     } else {
        btn.innerHTML = arguments[ii].text;
     }
     if (opts.buttonBgColor) {
       btn.style.backgroundColor=opts.buttonBgColor;
     }
     btn.title=arguments[ii].title || '';
     btn._oc = arguments[ii].onclick;
     btn.id = arguments[ii].id;
     btn.onclick=function(evt) { dh.hide(); this._oc(dh._target, this.id, evt || window.event); };
     dh.appendChild(btn);
     if (opts.buttonsPerRow>0 && ii%opts.buttonsPerRow==0) dh.appendChild(document.createElement('BR'));
   }
   if (opts.parent == null) {
     opts.parent = document.body
   }
   opts.parent.appendChild(dh);
   dh._checkMenuPosition = function() {
     var parent = this._opts.parent;
     if (this.style.pixelLeft < 0) {
       this.style.pixelLeft = 5;
     } else if (this.style.pixelLeft + this.clientWidth > parent.clientWidth) {
       this.style.pixelLeft = parent.clientWidth - this.clientWidth - 5;
     }
   }
   dh._clearTimeout = function() {
     if (this._ptTimeout) {
       clearTimeout(this._ptTimeout);
     }
     this._ptTimeout = null;
   }
   dh.show = function(evt) {
     evt = evt || window.event;
     //this.innerHTML = text;
     this._target=evt.target || evt.srcElement;
     this.style.display='';
     this.style.top=evt.clientY + 7+'px';
     if (this._opts.position == 'cursor-left') {
       this.style.left=evt.clientX - this.clientWidth + 7+'px';
     } else if (this._opts.position == 'cursor-right') {
       this.style.left=evt.clientX + 7+'px';
     } else if (this._opts.position == 'fixed') {
       //nulla da fare posizione fissa
     }
     this._checkMenuPosition();
     this._clearTimeout();
     this._ptTimeout = setTimeout('InterLib.' + this.id + '.hide()', this._opts.timeout);
     return dh;
   };
   dh.hide = function(evt) {
     dh.style.display='none';
     dh._entered=false;
     dh._clearTimeout();
     return dh;
   };
   dh.applyTo = function() {
     for (var ii=0; ii<arguments.length; ii++) {
       var obj = arguments[ii];
       if (typeof obj == 'string') {
         obj = document.getElementById(obj);
       }
       if(obj) {
         if (!obj._intelibmenu || !obj.onclick) {
           InterLib.addEvent(obj, 'click', function(event) { dh.show(event) });
           InterLib.addEvent(obj, 'blur', function(event) { if (!dh._entered) dh.hide() });
           obj._intelibmenu = true;
         }
       }
     }
     return dh;
   };
   return dh;
}
//---End function

//---Start function: makeProgressBar
function interlib_makeProgressBar(opts) {
   opts = InterLib.mergeObj(interlib__progressBarEx_opts, opts);
   //controllo che esista il contenitore
   var cc = document.getElementById(opts.parent);
   if (!cc) throw "Progress bar container not found.";
   //creo la progress bar
   var pb = InterLib[opts.id] = document.createElement('DIV');
   pb._opts = opts;
   pb.id = opts.id;
   pb.tag = opts.tag;
   pb.value = 0;
   pb.text = null;
   pb._enabled = false;
   pb.style.height='100%';
   //altre impostazioni
   pb.style.font = 'bold 14px arial';
   pb.style.color = 'white';
   pb.style.visibility = 'hidden';
   pb.style.border = 'solid 1px #cecece';
   pb.style.backgroundColor = opts.backgroundColor;
   pb.style.backgroundImage = opts.backgroundImage;
   pb.style.width = 0;
   pb.debug = function() {
     var cc = document.getElementById(opts.parent);
     cc.style.width='100%'
     cc.style.height='100%'
   }
   pb.addToParent = function() {
     var cc = document.getElementById(opts.parent);
     if (!cc.children[pb.id]) {
       cc.appendChild(pb);
     }
   }
   //render: disegna la barra
   pb.render = function() {
     var value = Math.max(pb.value, 0);
     var ww = parseInt(document.getElementById(opts.parent).offsetWidth);
     if (opts.display=='always' ||
       (value>=100 && opts.display=='normal') ||
       (value>0 && value<100))
     {
       pb.style.visibility = 'visible';
       pb.style.width = Math.max(10, value*ww/100);
       if (pb.text!=null) {
         pb.innerHTML = pb.text;
       } else {
         pb.innerHTML = ' ' + value + '%';
       }
     } else {
       pb.style.visibility = 'hidden';
     }
   }
   //exec: se la funzione di callback ritorna false interrompe l'esecuzione
   pb.exec = function(cicle) {
     if (pb._enabled && opts.callback && opts.callback(pb)!=false) {
       pb.render();
       if (cicle && pb.value<100) {
         setTimeout('InterLib.' + opts.id + '.exec(true)', opts.interval);
       } else {
         pb._enabled = false;
         return true;
       }
     } else {
       pb._enabled = false;
       return false;
     }
   } //end exec
   //start: cicla partendo resettando il valore
   pb.start = function(tag) {
     if (tag) pb.tag = tag;
     pb.addToParent();
     if (!pb._enabled) {
       pb.value = 0;
       pb._enabled = true;
       pb.exec(true);
     }
   }
   //stop: interrompe il ciclo
   pb.stop = function() {
     pb.addToParent();
     pb._enabled = false;
   }
   //check: cicla solo se il valore è significativo
   pb.check = function(tag) {
     if (tag) pb.tag = tag;
     pb.addToParent();
     if (!pb._enabled) {
       pb._enabled = true;
       if (pb.exec() && pb.value>0 && pb.value<100) {
         pb._enabled = true;
         return pb.exec(true);
       }
     }
     return false;
   }
   //aggiungo la barra al contenitore
   pb.addToParent();
   //renderizzo solo se la proprietà display è always
   if (opts.display=='always') {
     pb.render();
   }
   return pb;
}
//---End function

//---Start function: makeSlider
function interlib_makeSlider(opts) {
		//id:string, parent:obj, steps:[]|{min max step}, stepOnMove:bool
		//knobImage, knobWidth, knobHeight
		//sliderImage,
		//onslide:event, onchange:event
		var dSlider = document.createElement('DIV');
		var dKnob = document.createElement('DIV');
		//stili knob
		dKnob.id = dSlider.id + '_dk1';
		dKnob.style.backgroundAttachment = 'scroll';
		dKnob.style.backgroundClip = 'border-box';
		dKnob.style.backgroundColor = 'transparent';
		dKnob.style.backgroundImage = 'url(' + opts.knobImage + ')';
		dKnob.style.backgroundOrigin = 'padding-box';
		dKnob.style.backgroundPosition = '50% 50%';
		dKnob.style.backgroundRepeat = 'no-repeat';
		dKnob.style.backgroundSize = 'auto auto';
		dKnob.style.cursor = 'pointer';
		dKnob.style.height = opts.knobHeight || 16;
		dKnob.style.left = '0px';
		dKnob.style.position = 'relative';
		dKnob.style.width = opts.knobWidth || 16;
		//stili slider
		dSlider.id = opts.id || 'ds1';
		dSlider.style.backgroundAttachment = 'scroll';
		dSlider.style.backgroundClip = 'border-box';
		dSlider.style.backgroundColor = 'transparent';
		dSlider.style.backgroundImage = 'url(' + opts.sliderImage + ')';
		dSlider.style.backgroundOrigin = 'padding-box';
		dSlider.style.backgroundPosition = '0px 50%';
		dSlider.style.backgroundRepeat = 'repeat-x';
		dSlider.style.backgroundSize = 'auto auto';
		dSlider.style.fontFamily = 'Helvetica, Arial';
		dSlider.style.fontSize = '12px';
		dSlider.style.fontStyle = 'normal';
		dSlider.style.fontVariant = 'normal';
		dSlider.style.fontWeight = 'normal';
		dSlider.style.width = (opts.width || 400) + parseInt(dKnob.style.width);
		//
		dSlider.appendChild(dKnob);
		dSlider.knob = dKnob;
		opts.parent.appendChild(dSlider);
		//attributi inerni
		dSlider._width = opts.width || 400;
		dSlider._clicked = false;
		dSlider._offsetX = 0;
		dSlider._startX = 0;
		//gestione degli steps
		dSlider._stepOnMove = opts.stepOnMove;
		dSlider._manageSteps = ((opts.steps instanceof Array) && opts.steps.length>0);
		//gli steps possono essere definiti tramite un oggetto con min e max,
		//i punti intermedi vengono calcolati
		if (!dSlider._manageSteps && opts.steps && ('min' in opts.steps && 'max' in opts.steps)) {
			//alert(opts.steps.min + ' ' + opts.steps.max);
			dSlider._steps = [];
			for (var ii = opts.steps.min; ii<=opts.steps.max; ii+=(opts.steps.step||1)) {
				dSlider._steps.push(ii);
			}
			dSlider._manageSteps = (dSlider._steps.length>0);
		} else {
			dSlider._steps = opts.steps;
		}
		//ricavo le coordinate degli steps
		dSlider._stepsPoint = null;
		if (dSlider._manageSteps) {
			dSlider._stepsPoint = [];
			var ww = dSlider._width;
			//se l'array contiene stringhe, gli steps saranno tutti a distanze uguali
			if (typeof dSlider._steps[0] == 'string') {
				var interval = parseInt(ww/(dSlider._steps.length-1));
				for (var ii=0, jj=0; ii<dSlider._steps.length; ii++, jj+=interval) {
					//TODO sistemare jj in base alla lunghezza del knob
					dSlider._stepsPoint.push(jj);
					//alert(jj + ' ' + dSlider._steps[ii]);
				}
			} else {
				//TODO ricavare coordinate di ogni punto
				var min = dSlider._steps[0];
				var max = dSlider._steps[dSlider._steps.length-1] - min;
				for (var ii=0; ii<dSlider._steps.length; ii++) {
					dSlider._stepsPoint.push((dSlider._steps[ii]-min)*ww/max);
				}
			}
		}
		//alert(dSlider._manageSteps);
		//alert(dSlider._stepsPoint);
		//eventi
		dSlider.onmousedown = function(event) { this.sliderMouseDown(event || window.event); this.moveSlider(event || window.event) }
		dSlider.onmousemove = function(event) { this.sliderMouseMove(event || window.event); }
		dSlider.onmouseup = function(event) { this.sliderMouseUp(event || window.event); }
		dSlider._onslide = opts.onslide;
		dSlider._onchange = opts.onchange;
		//
		var _mousemove = function(event) { dSlider.moveSlider(event); }
		var _mouseup = function(event) { dSlider.sliderMouseUp(event); }
		dSlider.sliderMouseDown = function(event) {
			this._clicked = true;
			this._offsetX = parseInt(InterLib.getTarget(event).style.left || event.offsetX || event.layerX);
			//debug(db2, event);
			this._startX = event.clientX;
			InterLib.addEvent(document.body, 'mousemove', _mousemove);
			InterLib.addEvent(document.body, 'mouseup', _mouseup);
			//_print('down ' + this._offsetX + ' ' + this._startX + ' > ' + InterLib.getTarget(event).style.left + ' ' + event.offsetX  + ' ' + event.layerX);
			document.body.style.MozUserSelect = "none";
			document.body.focus();
			// prevent text selection in IE
			document.onselectstart = function () { return false; };
			// prevent IE from trying to drag an image
			InterLib.getTarget(event).ondragstart = function() { return false; };
		}
		dSlider.moveSlider = function(event) {
			var left = (this._offsetX + event.clientX - this._startX);
			if (left<=0) left=0;
			var ww = opts.width; //this.offsetWidth; // - this.knob.offsetWidth;
			//_print2(left + ' ' + ww);
			//debug(db2, event);
			if (left>ww) left=ww;
			var stepIndex = -1;
			if (this._manageSteps && this._stepOnMove) {
				stepIndex = this._nearest(this._stepsPoint, left);
				left = this._stepsPoint[stepIndex];
			}
			this.knob.style.left = parseInt(left);
			//_print('move ' + this.knob.style.left + '=' + this._offsetX + '+' + event.clientX + '-' + this._startX + ' ' + this);
			this._fireOnslide(stepIndex, left);
		}
		dSlider.sliderMouseMove = function(event) {
			if (this._clicked) {
				this.moveSlider(event);
			}
		}
		dSlider.sliderMouseUp = function(event) {
			//_print('up');
			if (this._clicked) {
				this._clicked=false;
				InterLib.removeEvent(document.body, 'mousemove', _mousemove);
				InterLib.removeEvent(document.body, 'mouseup', _mouseup);
				var left = (this._offsetX + event.clientX - this._startX);
				if (left<=0) left=0;
				var ww = this.offsetWidth - this.knob.offsetWidth;
				if (left>ww) left=ww;
				var stepIndex = -1;
				if (this._manageSteps) {
					stepIndex = this._nearest(this._stepsPoint, left);
					left = this._stepsPoint[stepIndex];
				}
				this.knob.style.left = left;
				//_print('up ' + this.knob.style.left + '=' + this._offsetX + '+' + event.clientX + '-' + this._startX);
				this._fireOnchange(stepIndex, left);
			}
		}
		//indice dell'elemento più vicino al valore passato
		dSlider._nearest = function(arr, nn) {
			for (var ii=0; ii<arr.length; ii++) {
				var n1 = arr[ii] - nn;
				var n2 = (arr[ii+1] || arr[ii]) - nn;
				if (n1<=0 && n2>=0) {
					return Math.abs(n1) < Math.abs(n2)?ii:Math.min(ii+1, arr.length-1);
				}
			}
			return arr.length-1;
		}
		dSlider._fireOnslide = function(stepIndex, realValue) {
			if (this._onslide) {
				this._onslide(this, stepIndex>=0?this._steps[stepIndex]:realValue, realValue);
			}
		}
		dSlider._fireOnchange = function(stepIndex, realValue) {
			if (this._onchange) {
				this._onchange(this, stepIndex>=0?this._steps[stepIndex]:realValue, realValue);
			}
		}
    return dSlider;
}
//---End function

//---Start function: mergeObj
function interlib_mergeObj(obj1, obj2) {
   //creo un oggetto "vuoto"
   var merg = {};
   //inserisco le proprietà prelevandole dal primo oggetto
   if (obj1) {
     for (var pr in obj1) {
       merg[pr] = obj1[pr];
     }
   }
   //inserisco le proprietà prelevandole dal secondo oggetto
   //quelle già presenti verranno sostituite
   if (obj2) {
     for (var pr in obj2) {
       merg[pr] = obj2[pr];
     }
   }
   return merg;
}
//---End function

//---Start function: parseSearch
function interlib_parseSearch() {
   if (location.search) {
     var res = {};
     var search = location.search.substr(1)
     if (search) {
       search = search.split('&')
       for (var ii=0; ii<search.length; ii++) {
         var arg = search[ii].split("=");
         res[arg[0]] = arg[1];
       }
       return res;
     }
   }
   return null;
}
//---End function

//---Start function: progressBar
function interlib_progressBar(id, mode, callback, display, interval) {
   var obj = document.getElementById(id);
   if (!obj) throw "Progress bar container not found.";
   var pgid = 'pg_' + id;
   var opts = InterLib[pgid];
   if (!opts) {
     opts = InterLib[pgid] = InterLib.mergeObj(interlib__progressBar_opts, null);
     opts.src = document.getElementById(id).src;
   }
   if (mode) opts.mode = mode;
   if (display) opts.display  = display;
   if (interval) opts.interval = interval;
   if (callback) opts.callback = callback;
   if (mode=='check' || mode=='start' || mode=='stop') {
     obj.src = opts.src
       .appendGet('MODE', opts.mode)
        .appendGet('DISPLAY', opts.display)
			 .appendGet('INTERVAL', opts.interval)
			 .appendGet('CALLBACK', opts.callback);
	 } else {
	   throw "Progress bar mode not supported.";
	 }
}
//---End function

//---Start function: quote
function interlib_quote(value) {
  return '\"' + value + '\"';
}
//---End function

//---Start function: removeEvent
function interlib_removeEvent(element, event, callback) {
   if (element.removeEventListener) {
     element.removeEventListener(event, callback, false);   } else if (element.detachEvent) {
     element.detachEvent('on' + event, callback);
   } else {
     element[event] = null;
   }
}
//---End function

//---Start function: showMessageBox
function interlib_showMessageBox(opts) {
   var body = document.getElementsByTagName('BODY')[0];
   if (opts===false) {
     if(typeof InterLib['mb_bgElement'] != 'undefined'){
       body.removeChild(InterLib['mb_bgElement']);
       body.removeChild(InterLib['mb_div1']);
       body.removeChild(InterLib['mb_div2']);
       body.removeChild(InterLib['mb_div3']);
       InterLib['mb_bgElement'] = null;
       InterLib['mb_div1'] = null
       InterLib['mb_div2'] = null
       InterLib['mb_div3'] = null
       if (InterLib['mb_callback']) {
         InterLib['mb_callback']();
         InterLib['mb_callback'] = null;
       }
     }
   } else {
     opts = InterLib.mergeObj(interlib__showMessageBox_opts, opts);
     InterLib['mb_callback'] = opts.callback;
     //
     if (opts.toparse) {
       var ress = opts.toparse.split(':');
       opts.level = ress[0];
       opts.msg = ress[2];
       opts.coderr = ress[1];
     }
     if (opts.message) {
       opts.msg = opts.message;
     }
     //creo l'elemento che copra tutto il documento
     var bgElement = InterLib['mb_bgElement'] = document.createElement('DIV');
     bgElement.style.backgroundColor = opts.backgroundColor;
     bgElement.style.position='absolute';
     bgElement.style.zIndex=998;
     bgElement.style.top=0 + opts.paddingTop + "px";
     bgElement.style.left=0 + opts.paddingLeft + "px";
     bgElement.style.width=body.clientWidth - opts.paddingRight + "px";
     bgElement.style.height=body.clientHeight - opts.paddingBottom + "px";
     bgElement.style.opacity=0.8;
     bgElement.style.filter='alpha(opacity=80)';
     //bgElement.style.-moz-opacity:0.5;
     var div1 = InterLib['mb_div1'] = document.createElement('DIV');
     div1.style.backgroundColor = opts.boxBackgroundColor;
     div1.style.padding='10px';
     div1.style.border='solid 1px';
     div1.style.position='absolute';
     div1.style.zIndex=999;
     div1.style.width=opts.width + "px";
     div1.style.height=opts.height + "px";
     div1.style.top=(body.clientHeight-opts.height)/2 + "px";
     div1.style.left=(body.clientWidth-opts.width)/2 + "px";
     var imgsrc;
     switch (opts.level) {
       case 'N': case 'E':
         imgsrc='../images/mb_error.png'; break;
       case 'W':
         imgsrc='../images/CheckNO.png'; break;
       case 'V':
         imgsrc='../SpTheme_3/formPage/loading.gif'; break;
       default:
         imgsrc='../img/toolbar/ok.png'; break;
     }
     if(opts.message == 'N')
      div1.innerHTML='<img src=\'' + imgsrc + '\' align=absmiddle> <b><font face=verdana size=4>' + opts.title + '</font></b>';
     else
      div1.innerHTML='<img src=\'' + imgsrc + '\' align=absmiddle> <b><font face=verdana size=4>' + opts.title + '</font></b><hr><font face=verdana size=2>' + opts.msg + '</font>';
     var div2 = InterLib['mb_div2'] = document.createElement('DIV');
     div2.style.top=parseInt(div1.style.top) + parseInt(div1.style.height) + (IsIE()?10:30) + "px";
     div2.style.left=parseInt(div1.style.left) + "px";
     div2.style.position='absolute';
     div2.style.zIndex=999;
     if (opts.coderr>'0') {
       div2.innerHTML='<font face=verdana size=1>Codice: ' + opts.coderr + '</font>';
     }
     var div3 = InterLib['mb_div3'] = document.createElement('DIV');
     div3.style.top=parseInt(div1.style.top) + parseInt(div1.style.height) + (IsIE()?5:35) + "px";
     //div3.style.left=parseInt(div1.style.left) + parseInt(div1.style.width) - (IsIE()?55:35);
     div3.style.left=parseInt(div1.style.left) + "px";
     div3.style.width=parseInt(div1.style.width) + "px";
     div3.style.textAlign='right';
     div3.style.position='absolute';
     div3.style.zIndex=999;
     //div3.innerHTML='<button onclick=\'InterLib.showMessageBox(false)\'>Chiudi</button>';
     if (opts.buttons && opts.buttons.length>0) {
       for (var ii=0; ii<opts.buttons.length; ii++) {
         var btn = document.createElement('BUTTON');
         btn.innerHTML = opts.buttons[ii].text;
         if (opts.buttons[ii].href) {
           btn.btnhref = opts.buttons[ii].href;
           btn.onclick = function() { location.href=this.btnhref; }
         } else {
           btn.onclick = opts.buttons[ii].action;
         }
         div3.appendChild(btn);
       }
     }
     var btnClose = document.createElement('BUTTON');
     btnClose.innerHTML = 'Chiudi';
     btnClose.onclick = function() { InterLib.showMessageBox(false) };
     if(opts.close != 'N')
        div3.appendChild(btnClose);
     //
     body.appendChild(bgElement);
     body.appendChild(div1);
     body.appendChild(div2);
     body.appendChild(div3);
   }  
}
//---End function

//---Start function: showMessageBoxJSP
function interlib_showMessageBoxJSP(opts) {
  if (opts===false) {
    this._mbJSP.style.display="none";
    this._mbtableJSP.style.display="none";
    return;
  }
  var body = document.getElementsByTagName('BODY')[0];
  //se ancora non esiste il message box lo creo
  if (!this._mbJSP || !this._mbtableJSP) {
    var mb = document.createElement("DIV");
    mb.style.position="absolute";
    mb.style.zIndex=998;
    mb.style.opacity=0.5;
    mb.style.filter="alpha(opacity=50)";
    mb.style.visibility="hidden";
    var table = document.createElement("TABLE");
    table.style.border="solid 2px #516C94";
    table.style.position="absolute";
    table.cellSpacing=1;
    table.style.zIndex=999;
    var row1 = table.insertRow(table.rows.length);
    var cell1 = row1.insertCell(row1.cells.length);
    cell1.style.height="15%";
    cell1.style.color="#333";
    cell1.style.backgroundColor="LightSlateGray"; /*MODIFICA*/
    cell1.style.fontFamily="verdana"; /*MODIFICA*/
		cell1.style.color="white"; /*MODIFICA*/
    cell1.style.borderBottom="solid 1px #999";
    //cell1.style.fontWeight="bold";
    cell1.style.fontSize="10pt";
    cell1.innerHTML="Titolo";
    var row2 = table.insertRow(table.rows.length);
    var cell2 = row2.insertCell(row2.cells.length);
    cell2.style.verticalAlign="top";
    cell2.style.height="100%";
    cell2.style.paddingTop="0px";
    cell2.style.paddingLeft="0px";
    var divbody = document.createElement("DIV");
    divbody.style.overflow="auto";
    cell2.appendChild(divbody);
    var row3 = table.insertRow(table.rows.length);
    var cell3 = row3.insertCell(row3.cells.length);
    //cell3.style.height="15%";
    //cell3.align="center";
    //cell3.style.backgroundColor="#eee";
    //cell3.style.borderTop="solid 1px #999";
    //cell3.innerHTML="Footer";
    var row4 = table.insertRow(table.rows.length);
    var cell4 = row4.insertCell(row4.cells.length);
    cell4.style.borderTop="solid 1px #999";
    cell4.style.color="#666";
    cell4.style.fontSize="60%";
    cell4.innerHTML="Error Code";
    cell4.style.display="none";
    this._mbJSP = mb;
    this._mbtableJSP = table;
    this._mbbodyJSP = divbody;
    body.appendChild(mb);
    body.appendChild(table);
  }
  //dimensioni pagina 
  var IE = InterLib.browserType();
  var docWidth,docHeight;
  if (IE == 'Explorer') { // grab the x-y pos.s if browser is IE
    docWidth = document.documentElement.clientWidth;
    docHeight = document.documentElement.clientHeight;  
  }else{  // grab the x-y pos.s if browser is NS
    docWidth = window.innerWidth;
    docHeight = window.innerHeight;
  }    
  //configuro il message box
  opts = this.mergeObj(interlib__showMessageBox_opts, opts);
  this._mbJSP.style.display="block";
  this._mbtableJSP.style.display="";
  this._mbJSP.style.backgroundColor = opts.backgroundColor;
  this._mbJSP.style.top=(0 + opts.paddingTop) + "px";
  this._mbJSP.style.left=(0 + opts.paddingLeft) + "px";    
  this._mbJSP.style.width=(docWidth - opts.paddingRight) + "px";
  this._mbJSP.style.height=(docHeight - opts.paddingBottom) + "px";
  this._mbtableJSP.style.backgroundColor = opts.boxBackgroundColor;
  //aggiunto parametro per stile "layer"
  if(opts.layerStyle == "S"){
    this._mbtableJSP.style.backgroundColor = "#FFFFFF";
    this._mbtableJSP.style.backgroundImage = "url(../SpTheme_ZIP/images/menu/bg_submenu.png)";  
    this._mbtableJSP.style.backgroundRepeat = "repeat-y";           
    this._mbtableJSP.rows[0].cells[0].style.backgroundColor = "";       
    this._mbtableJSP.rows[0].cells[0].style.color = "#343434";       
    this._mbtableJSP.rows[0].cells[0].style.fontWeight="normal";
    this._mbtableJSP.rows[0].cells[0].style.fontFamily = "Tahoma,Helvetica";
    this._mbtableJSP.rows[0].cells[0].style.borderBottom="1px dotted #dcdcdc";      
  }
  this._mbtableJSP.style.width=(opts.width) + "px";
  this._mbtableJSP.style.height=(opts.height) + "px";
  this._mbbodyJSP.style.width=(opts.width) + "px";
  this._mbbodyJSP.style.height=(opts.height) + "px";
  this._mbbodyJSP.style.fontSize='10pt';
  this._mbbodyJSP.style.fontFamily="tahoma";
  this._mbtableJSP.style.top=((parseInt(docHeight)-parseInt(opts.height))/2) + "px";
  this._mbtableJSP.style.left=((parseInt(docWidth)-parseInt(opts.width))/2) + "px";
  var imgsrc;
  switch (opts.level) {
    case 'N': case 'E':
      imgsrc='../img/toolbar/cancel.png'; break; /*MODIFICA*/
    case 'W':
      imgsrc='../images/AlertMessage.png'; break; /*MODIFICA*/
    case 'Q':
      imgsrc='mb_question.png'; break;
    case 'F':
      imgsrc=null; break;
    case 'V':
      imgsrc='../images/ProcessRun.png'; break;
    default:
      imgsrc='mb_ok.png'; break;
  }
  //aggiunto parametro per mostrare la "x" chiudi
  mm = '../images/close.gif'
  if(opts.imgClose == 'S')
    this._mbtableJSP.rows[0].cells[0].innerHTML = (imgsrc?"<img src=\'" + imgsrc + "\' align=absmiddle> ":" ") + "&nbsp;&nbsp;" + opts.title + "<a href=#1><img src=\'" + mm + "\' border =0 align = right onClick=InterLib.showMessageBoxJSP(false)></a>"; 
  else
    this._mbtableJSP.rows[0].cells[0].innerHTML = (imgsrc?"<img src=\'" + imgsrc + "\' align=absmiddle> ":" ") + "&nbsp;&nbsp;" + opts.title;
  this._mbbodyJSP.innerHTML = opts.message;
  if (opts.coderr && opts.coderr!="0") {
    this._mbtableJSP.rows[3].cells[0].style.display="block";
    this._mbtableJSP.rows[3].cells[0].innerHTML = opts.coderr;
  }else{
    this._mbtableJSP.rows[3].cells[0].style.display="none";
  }
  this._mbtableJSP.rows[2].cells[0].innerHTML = "";
  if (opts.buttons && opts.buttons.length>0) {
    for (var ii=0; ii<opts.buttons.length; ii++) {
      var btn = document.createElement("BUTTON");
      btn.className='button';
	    btn.style.marginRight='10px'; /*MODIFICA*/
      //btn.style.width="40%"; /*MODIFICA*/
	    btn.style.width="100px"; /*MODIFICA*/
      btn.innerHTML = opts.buttons[ii].text;
      if (opts.buttons[ii].href) {
        btn.btnhref = opts.buttons[ii].href;
        btn.onclick = function() { location.href=this.btnhref; }
      } else {
        btn.onclickcb = opts.buttons[ii].action;
        btn.onclick = function() { 
          if (this.onclickcb() !== false) InterLib.showMessageBox(false) 
        };
      }
      this._mbtableJSP.rows[2].cells[0].appendChild(btn);
    }
  }
  this._mbJSP.style.visibility="visible";
}
//---End function

//---Start function: showMessageBoxMA
function interlib_showMessageBoxMA(opts) {
if (opts===false) {
    this._mbJSP.style.display="none";
    this._mbtableJSP.style.display="none";
    if(focusedWindow != '' || focusedWindow != null)    
    {         
      try
      {
        focusedWindow.focus();
      }
      catch(err){}    
      } 
    return;
  }
  opts = this.mergeObj(interlib__showMessageBox_opts, opts);
  var body = document.getElementsByTagName('BODY')[0];
  //se ancora non esiste il message box lo creo
  if (!this._mbJSP || !this._mbtableJSP) {
    var mb = document.createElement("DIV");
    mb.style.position="absolute";
    mb.style.zIndex=998;
    mb.style.opacity=0.5;
    mb.style.filter="alpha(opacity=50)";
    mb.style.visibility="hidden";
    var table = document.createElement("TABLE");
    table.style.border="solid 1px #999";
    table.style.position="absolute";
    table.cellSpacing=1;
    table.style.zIndex=999;
    var row1 = table.insertRow(table.rows.length);
    var cell1 = row1.insertCell(row1.cells.length);
    cell1.style.height="20px";
    cell1.style.color="#333";
    cell1.style.backgroundColor="LightSlateGray"; /*MODIFICA*/
    cell1.style.fontFamily="verdana"; /*MODIFICA*/
		cell1.style.color="white"; /*MODIFICA*/
    cell1.style.borderBottom="solid 1px #999";   
    cell1.style.fontSize="10pt";
    cell1.innerHTML="Titolo";
    var row2 = table.insertRow(table.rows.length);
    var cell2 = row2.insertCell(row2.cells.length);
    cell2.style.verticalAlign="top";
    cell2.style.height="100%";
    cell2.style.paddingTop="0px";
    cell2.style.paddingLeft="0px";
    var divbody = document.createElement("DIV");
    //setto l'overflow quando arrivo da wsendgstf in modo tale da mostrare la scrollbar
    if(opts.overflow == "auto")
      divbody.style.overflow="auto";
    else
      divbody.style.overflow="hidden";
	  divbody.style.marginLeft="25px";
    cell2.appendChild(divbody);
    var row3 = table.insertRow(table.rows.length);
    var cell3 = row3.insertCell(row3.cells.length);    
    var row4 = table.insertRow(table.rows.length);
    var cell4 = row4.insertCell(row4.cells.length);
    cell4.style.borderTop="solid 1px #999";
    cell4.style.color="#666";
    cell4.style.fontSize="60%";
    cell4.innerHTML="Error Code";
    cell4.style.display="none";
    this._mbJSP = mb;
    this._mbtableJSP = table;
    this._mbbodyJSP = divbody;
    body.appendChild(mb);
    body.appendChild(table);
  }
  //dimensioni pagina 
  var IE = InterLib.browserType();
  var docWidth,docHeight;
  if (IE == 'Explorer') { // grab the x-y pos.s if browser is IE
    docWidth = document.documentElement.clientWidth;
    docHeight = document.documentElement.clientHeight;  
  }else{  // grab the x-y pos.s if browser is NS
    docWidth = window.innerWidth;
    docHeight = window.innerHeight;
  }    
  //configuro il message box
  //se passato come parametro, è il riferimento alla pagina a cui voglio dare il focus dopo la chiusura del layer
  focusedWindow = opts.focused;
  this._mbJSP.style.display="block";
  this._mbtableJSP.style.display="";
  this._mbJSP.style.backgroundColor = opts.backgroundColor;
  this._mbJSP.style.top=(0 + opts.paddingTop) + "px";
  this._mbJSP.style.left=(0 + opts.paddingLeft) + "px";    
  this._mbJSP.style.width=(docWidth - opts.paddingRight) + "px";
  this._mbJSP.style.height=(docHeight - opts.paddingBottom) + "px";
  this._mbtableJSP.style.backgroundColor = opts.boxBackgroundColor;
  //aggiunto parametro per stile "layer"
  if(opts.layerStyle == "S"){
    this._mbtableJSP.style.backgroundColor = "#FFFFFF";
    this._mbtableJSP.style.backgroundImage = "url(../SpTheme_ZIP/images/menu/bg_submenu.png)";  
    this._mbtableJSP.style.backgroundRepeat = "repeat-y";           
    this._mbtableJSP.rows[0].cells[0].style.backgroundColor = "";       
    this._mbtableJSP.rows[0].cells[0].style.color = "#343434";       
    this._mbtableJSP.rows[0].cells[0].style.fontWeight="normal";
    this._mbtableJSP.rows[0].cells[0].style.fontFamily = "Tahoma,Helvetica";
    this._mbtableJSP.rows[0].cells[0].style.borderBottom="1px dotted #dcdcdc";      
  }
  if(opts.layerStyle == "Z"){
    this._mbtableJSP.style.backgroundColor = "#F3F3F3";           
    this._mbtableJSP.rows[0].cells[0].style.backgroundColor = "";       
    this._mbtableJSP.rows[0].cells[0].style.color = "#343434";       
    this._mbtableJSP.rows[0].cells[0].style.fontWeight="bold";
    this._mbtableJSP.rows[0].cells[0].style.fontFamily = "hrfont";
    this._mbtableJSP.rows[0].cells[0].style.fontSize="12px";
    this._mbtableJSP.rows[0].cells[0].style.borderBottom="1px dotted #dcdcdc";      
  }
  this._mbtableJSP.style.width=(opts.width) + "px";
  this._mbtableJSP.style.height=(opts.height) + "px";
  this._mbbodyJSP.style.width=(opts.width) + "px";
  this._mbbodyJSP.style.height=(opts.height) + "px";
  this._mbbodyJSP.style.fontSize='10pt';
  this._mbbodyJSP.style.fontFamily="tahoma";
  this._mbtableJSP.style.top=((parseInt(docHeight)-parseInt(opts.height))/2) + "px";
  this._mbtableJSP.style.left=((parseInt(docWidth)-parseInt(opts.width))/2) + "px";
  var imgsrc;
  switch (opts.level) {
    case 'N': case 'E':
      imgsrc='../img/toolbar/cancel.png'; break; /*MODIFICA*/
    case 'W':
      imgsrc='../images/AlertMessage.png'; break; /*MODIFICA*/
    case 'Q':
      imgsrc='mb_question.png'; break;
    case 'F':
      imgsrc=null; break;
    case 'V':
      imgsrc='../images/ProcessRun.png'; break;
    default:
      imgsrc='mb_ok.png'; break;
  }
  //aggiunto parametro per mostrare la "x" chiudi
  mm = '../images/close.gif'
  if(opts.imgClose == 'S')
    this._mbtableJSP.rows[0].cells[0].innerHTML = (imgsrc?"<img src=\'" + imgsrc + "\' align=absmiddle> ":" ") + "&nbsp;&nbsp;" + opts.title + "<a href=#1><img src=\'" + mm + "\' border =0 align = right onClick=InterLib.showMessageBoxMA(false)></a>"; 
  else
    this._mbtableJSP.rows[0].cells[0].innerHTML = (imgsrc?"<img src=\'" + imgsrc + "\' align=absmiddle> ":" ") + "&nbsp;&nbsp;" + opts.title;
  if(opts.layerStyle == "Z")  
    this._mbtableJSP.rows[0].cells[0].style.textAlign = "center";
  this._mbbodyJSP.innerHTML = opts.message;
  if (opts.coderr && opts.coderr!="0") {
    this._mbtableJSP.rows[3].cells[0].style.display="block";
    this._mbtableJSP.rows[3].cells[0].innerHTML = opts.coderr;
  }else{
    this._mbtableJSP.rows[3].cells[0].style.display="none";
  }
  this._mbtableJSP.rows[2].cells[0].innerHTML = "";
  //aggiunto parametro per aggiungere il bottone OK in basso a destra del layer
  if (opts.button == 'S') {    
      var btn = document.createElement("BUTTON");
      btn.className='button';
	    btn.style.marginRight='10px'; /*MODIFICA*/     
	    btn.style.width="50px"; /*MODIFICA*/
      btn.innerHTML = 'OK';
      if (IE == 'Explorer') {
        btn.style.styleFloat='right';
      }else{
        btn.style.cssFloat='right';
      }
      btn.onclick = function() { 
           InterLib.showMessageBoxMA(false) 
      };
      this._mbtableJSP.rows[2].cells[0].appendChild(btn);    
  }
  this._mbJSP.style.visibility="visible";
}
//---End function

//---Start function: showMessageBoxTS
function interlib_showMessageBoxTS(opts) {
    if (opts===false) {
        this._mb.style.display="none";
        this._mbtable.style.display="none";
        return;
    }
    var body = document.getElementsByTagName('BODY')[0];
    //se ancora non esiste il message box lo creo
    if (!this._mb || !this._mbtable) {
        var mb = document.createElement("DIV");
        mb.style.position="absolute";
        mb.style.zIndex=998;
        mb.style.opacity=0.5;
        mb.style.filter="alpha(opacity=50)";
        mb.style.visibility="hidden";
        var table = document.createElement("TABLE");
        table.style.border="solid 2px #516C94";
        table.style.position="absolute";
        table.cellSpacing=1;
        table.style.zIndex=999;
        var row1 = table.insertRow(table.rows.length);
        var cell1 = row1.insertCell(row1.cells.length);
        cell1.id = 'rif_0_0' /*MODIFICA*/
        cell1.style.height="15%";
        cell1.style.color="#333";
        cell1.style.backgroundColor="LightSlateGray"; /*MODIFICA*/
        cell1.style.fontFamily="tahoma"; /*MODIFICA*/
        cell1.style.color="white"; /*MODIFICA*/
        cell1.style.borderBottom="solid 1px #999";
        cell1.style.fontWeight="bold";
        cell1.innerHTML="Titolo";
        var row2 = table.insertRow(table.rows.length);
        var cell2 = row2.insertCell(row2.cells.length);
        cell2.style.verticalAlign="top";
        cell2.style.height="100%";
        cell2.style.paddingTop="5px";
        cell2.style.paddingLeft="5px";
        var divbody = document.createElement("DIV");
        divbody.id = 'rif_divbody' /*MODIFICA*/
        divbody.style.overflow="auto";
        cell2.appendChild(divbody);
        var row3 = table.insertRow(table.rows.length);
        var cell3 = row3.insertCell(row3.cells.length);
        cell3.style.height="15%";
        cell3.align="center";
        cell3.style.backgroundColor="#eee";
        cell3.style.borderTop="solid 1px #999";
        cell3.innerHTML="Footer";
        var row4 = table.insertRow(table.rows.length);
        var cell4 = row4.insertCell(row4.cells.length);
        cell4.style.borderTop="solid 1px #999";
        cell4.style.color="#666";
        cell4.style.fontSize="60%";
        cell4.innerHTML="Error Code";
        cell4.style.display="none";
        this._mb = mb;
        this._mbtable = table;
        this._mbbody = divbody;
    		this._cell1 = cell1;
		    this._cell3 = cell3;
        body.appendChild(mb);
        body.appendChild(table);
    }
    //configuro il message box
    opts = this.mergeObj(interlib__showMessageBox_opts, opts);
    this._mb.style.display="block";
    this._mbtable.style.display="";
    this._mb.style.backgroundColor = opts.backgroundColor;
    this._mb.style.top=(0 + opts.paddingTop) + "px";
    this._mb.style.left=(0 + opts.paddingLeft) + "px";
    this._mb.style.width=(body.clientWidth - opts.paddingRight) + "px";
    this._mb.style.height=(body.clientHeight - opts.paddingBottom) + "px";
    this._mbtable.style.backgroundColor = opts.boxBackgroundColor;
    this._mbtable.style.width=(opts.width) + "px";
    this._mbtable.style.height=(opts.height) + "px";
    this._mbbody.style.width=(opts.width) + "px";
    this._mbbody.style.height=(opts.height) + "px";
    this._mbbody.style.fontSize='10pt';
    this._mbbody.style.fontFamily="tahoma";
    this._mbtable.style.top=((parseInt(body.clientHeight)-parseInt(opts.height))/2) + "px";
    this._mbtable.style.left=((parseInt(body.clientWidth)-parseInt(opts.width))/2) + "px";
	  //-- Parametri aggiuntivi
	  this._cell1.style.backgroundColor = opts.backgroundColorHeader;
	  this._cell1.style.color = opts.colorHeader;
	  this._cell1.style.fontWeight = opts.fontWeightHeader;
	  this._cell3.style.borderTop = opts.borderTopFooter;
	
    var imgsrc;
    switch (opts.level) {
    case 'N': case 'E':
        imgsrc='../img/toolbar/cancel.png'; break; /*MODIFICA*/
    case 'W':
        imgsrc='../images/AlertMessage.png'; break; /*MODIFICA*/
    case 'Q':
        imgsrc='mb_question.png'; break;
    case 'F':
        imgsrc=null; break;
    case 'V':
        imgsrc='../images/ProcessRun.png'; break;
    case 'L':
        imgsrc='../SpTheme_ZIP/images/loading.gif'; break;
    default:
        imgsrc='mb_ok.png'; break;
    }
    this._mbtable.rows[0].cells[0].innerHTML = (imgsrc?"<img src=\'" + imgsrc + "\' align=absmiddle> ":" ") + "&nbsp;&nbsp;" + opts.title;
    this._mbbody.innerHTML = opts.message;
    if (opts.coderr && opts.coderr!="0") {
        this._mbtable.rows[3].cells[0].style.display="block";
        this._mbtable.rows[3].cells[0].innerHTML = opts.coderr;
    } else {
        this._mbtable.rows[3].cells[0].style.display="none";
    }
    this._mbtable.rows[2].cells[0].innerHTML = "";
    if (opts.buttons && opts.buttons.length>0) {
        for (var ii=0; ii<opts.buttons.length; ii++) {
            var btn = document.createElement("BUTTON");
            btn.className='button';
			      btn.style.marginRight='10px'; /*MODIFICA*/
            //btn.style.width="40%"; /*MODIFICA*/
			      btn.style.width="100px"; /*MODIFICA*/
            btn.innerHTML = opts.buttons[ii].text;
            if (opts.buttons[ii].href) {
                btn.btnhref = opts.buttons[ii].href;
                btn.onclick = function() { location.href=this.btnhref; }
            } else {
                btn.onclickcb = opts.buttons[ii].action;
                btn.onclick = function() { 
                    if (this.onclickcb() !== false) InterLib.showMessageBox(false) 
                };
            }
            this._mbtable.rows[2].cells[0].appendChild(btn);
        }
    } else {
        //var btnClose = document.createElement("BUTTON");
        //btnClose.innerHTML = "Ok";
        //btnClose.style.width="50%";
        //if (opts.callback) {
            //btnClose.onclickcb = opts.callback;
            //btnClose.onclick = function() { if (this.onclickcb() !== false) InterLib.showMessageBox(false) };
        //} else {
            //btnClose.onclick = function() { InterLib.showMessageBox(false) };
        //}
        //if(opts.close != 'N')
          //this._mbtable.rows[2].cells[0].appendChild(btnClose);
    }
    //var btnFocus = this._mbtable.rows[2].cells[0].children[this._mbtable.rows[2].cells[0].children.length-1];
    //if (btnFocus.tagName == "BUTTON") {
    //    btnFocus.focus();
    //    btnFocus.onkeyup = function(evt) {
    //        evt = evt || window.event;
    //        if ((evt.which || evt.keyCode) == 27) {
    //            InterLib.showMessageBox(false);
    //        }
    //    }
    //}
    this._mb.style.visibility="visible";
}
//---End function

//---Start function: startProgressBar
function interlib_startProgressBar() {
   var progbarm = document.getElementById('progbarm');
   var progbar = document.getElementById('progbar');
   var ww = parseInt(progbarm.style.width);
   var callBackObj = {value:0, descr:''};
   if (w_CALLBACK && window.parent) {
     var fCallBack = eval('window.parent.' + w_CALLBACK);
     w_VALUE = fCallBack(callBackObj);
     if (w_VALUE==undefined) {
		   w_VALUE = callBackObj.value;
		   w_DESCR = callBackObj.descr;
     }
     DoUpdate(true);
   }
   if (w_DISPLAY=='always' ||
     (w_VALUE>=100 && w_DISPLAY!='normal') ||
     (w_VALUE>0 && w_VALUE<100))
   {
     progbarm.style.visibility='visible';
     var width = Math.max(10, w_VALUE*ww/100);
     progbar.style.width=width;
     progbar.innerHTML = ' ' + w_VALUE + '%';
   } else {
     progbarm.style.visibility='hidden';
   }
   if (w_MODE!='stop' && w_VALUE<100) {
     if (w_MODE=='start' || w_VALUE>0) {
       setTimeout("InterLib.startProgressBar()", w_INTERVAL);
     }
   }
}
//---End function

//---Start function: switchCase
function interlib_switchCase(value) {
	 if (arguments.length%2!=0) {
		 for (var ii=1; ii<arguments.length; ii+=2) {
			 if (arguments[ii] == value) {
				 return arguments[ii+1];
			 }
		 }
		 return null;
	 } else {
	   throw 'switchCase: numero di parametri errati';
	 }
}
//---End function

//---Start function: MakeInterLib
function MakeInterLib() {
  this.NVL=interlib_NVL
  this.RndString=interlib_RndString
  this.Trunc=interlib_Trunc
  this._interlibmain=interlib__interlibmain
  this.addEvent=interlib_addEvent
  this.addOption=interlib_addOption
  this.browserType=interlib_browserType
  this.browserVersion=interlib_browserVersion
  this.changeEvent=interlib_changeEvent
  this.clearCombo=interlib_clearCombo
  this.concatPath=interlib_concatPath
  this.execQuery=interlib_execQuery
  this.explodeInterval=interlib_explodeInterval
  this.fixOnMouseOut=interlib_fixOnMouseOut
  this.getElementByName=interlib_getElementByName
  this.getRealPath=interlib_getRealPath
  this.getTarget=interlib_getTarget
  this.isChildOf=interlib_isChildOf
  this.join=interlib_join
  this.makeForm=interlib_makeForm
  this.makeHelp=interlib_makeHelp
  this.makeMenu=interlib_makeMenu
  this.makeProgressBar=interlib_makeProgressBar
  this.makeSlider=interlib_makeSlider
  this.mergeObj=interlib_mergeObj
  this.parseSearch=interlib_parseSearch
  this.progressBar=interlib_progressBar
  this.quote=interlib_quote
  this.removeEvent=interlib_removeEvent
  this.showMessageBox=interlib_showMessageBox
  this.showMessageBoxJSP=interlib_showMessageBoxJSP
  this.showMessageBoxMA=interlib_showMessageBoxMA
  this.showMessageBoxTS=interlib_showMessageBoxTS
  this.startProgressBar=interlib_startProgressBar
  this.switchCase=interlib_switchCase
}
//---End function

arguments[0].InterLib = new MakeInterLib()
})(window);//MakeInterLib
