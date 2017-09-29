if (typeof(MooTools.More)=='undefined'){
  if (document.readyState=='loading' || typeof(LibJavascript)=='undefined')
    document.write('<'+"script src='"+(typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+"visualweb/mootools-more.js'></"+'script>');
  else
    LibJavascript.RequireLibrary((typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+'visualweb/mootools-more.js',true);
}
