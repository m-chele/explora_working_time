function hfwf_flastgg() {
var p_mese;
var p_anno;
var m_Caller
hfwf_flastgg._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
p_mese=0;
p_anno=0;
}
if(hfwf_flastgg._p.length>0)_rargs([[['p_mese',hfwf_flastgg._p[0]],['p_anno',hfwf_flastgg._p[1]]]],{eval:function(e){eval(e)}})
hfwf_flastgg._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfwf_flastgg._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfwf_flastgg._s.SetParameterString('p_mese',WtA(p_mese,'N'));
hfwf_flastgg._s.SetParameterString('p_anno',WtA(p_anno,'N'));
hfwf_flastgg._s.SetParameterString('m_bApplet','true');
hfwf_flastgg._s.CallServlet('hfwf_flastgg');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfwf_flastgg._s.errmsg;
}
return DateFromApplet(hfwf_flastgg._s.GetDate());
}
hfwf_flastgg.CtxLoad_ = function(){return []}
