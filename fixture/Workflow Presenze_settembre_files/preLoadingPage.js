
if (document.images) {
    img1 = new Image();
   img1.src = "../SpTheme_ZIP/images/preloaderjs.gif";
}

if(applyLoading()) {
	if (document.getElementById('preloaderpage') == null && parent.name.lastIndexOf("portalstudio") < 0  && window.location.href.lastIndexOf("visualquery/sql.jsp") < 0 ) {

		var div = document.createElement ("div");
		div.style.top='0px';
		div.style.left='0px';
		div.id='preloaderpage'
		div.style.height='100%';
		div.style.width='100%';
		div.style.zIndex='99999'
		//div.style.backgroundImage='url(../SpTheme_ZIP/images/preloaderjs.gif)'
		div.style.backgroundRepeat='no-repeat'
		div.style.backgroundPosition='50% 30px'
		div.style.backgroundColor='#f3f3f3'
		div.style.position = 'absolute';

		div.innerHTML = '<span class="label" style="text-align:center;font-size:10pt"><div><b>Please Wait...</b></div></span>'
		if (isIE2()){
			if(getInternetExplorerVersion() <= 8){
				document.body.parentNode.insertBefore(div,document.body);
			}else{
				document.body.appendChild(div);
			}
		}else{
			document.body.appendChild(div);
		}
	}
}

window.document.onreadystatechange = function() {
  if (window.document.readyState == "complete") {
     if (document.getElementById('preloaderpage'))  document.getElementById('preloaderpage').style.display='none'
  }
} 

function isIE2 () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}



function getInternetExplorerVersion(){
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
       rv = parseFloat( RegExp.$1 );
  }
  return rv;
}



function applyLoading(){
  
  var browser_name=get_browser().toUpperCase();
  if(browser_name=="FIREFOX") {
	var browser_version=get_browser_version();
	if(isNaN(parseInt(browser_version)) || parseInt(browser_version)<4) return false;
	else return true;
  }
  else {
	if(browser_name=='SAFARI') return false;
	else return true;
  }
}


function get_browser(){

  try{
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[0];
  }
  catch(err){
    return '';
  }
  
}


function get_browser_version(){
  
  try{
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[1];
  }
  catch(err){
    return '';
  }
  
}