if ( !window.ControlsIsInstalled ) {
  if ( window.LibJavascript ) {
    window.LibJavascript.RequireLibrary( '../controls.js', true );
  } else {
    document.write("<script src='../controls.js'></script>");
  }
}
