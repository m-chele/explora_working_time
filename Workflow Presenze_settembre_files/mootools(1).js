if (typeof(MooTools)=='undefined'){
    if (document.readyState=='loading' || typeof(LibJavascript)=='undefined')
      document.write('<'+"script src='"+(typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+"visualweb/mootools-core.js'></"+'script>');
    else
      LibJavascript.RequireLibrary((typeof(SPWebRootURL)!='undefined'?SPWebRootURL+'/':'../')+'visualweb/mootools-core.js',true);
}
