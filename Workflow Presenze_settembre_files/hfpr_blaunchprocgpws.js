function hfpr_blaunchprocgpws() {
var pIDCOMPANY;
var pIDEMPLOYList;
var pProcesso;
var pDTSTART;
var pDTEND;
var pELABORACART;
var m_Caller
hfpr_blaunchprocgpws._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
pIDCOMPANY='';
pIDEMPLOYList='';
pProcesso='';
pDTSTART=NullDate();
pDTEND=NullDate();
pELABORACART='';
}
if(hfpr_blaunchprocgpws._p.length>0)_rargs([[['pIDCOMPANY',hfpr_blaunchprocgpws._p[0]],['pIDEMPLOYList',hfpr_blaunchprocgpws._p[1]],['pProcesso',hfpr_blaunchprocgpws._p[2]],['pDTSTART',hfpr_blaunchprocgpws._p[3]],['pDTEND',hfpr_blaunchprocgpws._p[4]],['pELABORACART',hfpr_blaunchprocgpws._p[5]]]],{eval:function(e){eval(e)}})
hfpr_blaunchprocgpws._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfpr_blaunchprocgpws._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfpr_blaunchprocgpws._s.SetParameterString('pIDCOMPANY',WtA(pIDCOMPANY,'C'));
hfpr_blaunchprocgpws._s.SetParameterString('pIDEMPLOYList',WtA(pIDEMPLOYList,'M'));
hfpr_blaunchprocgpws._s.SetParameterString('pProcesso',WtA(pProcesso,'C'));
hfpr_blaunchprocgpws._s.SetParameterString('pDTSTART',WtA(pDTSTART,'D'));
hfpr_blaunchprocgpws._s.SetParameterString('pDTEND',WtA(pDTEND,'D'));
hfpr_blaunchprocgpws._s.SetParameterString('pELABORACART',WtA(pELABORACART,'C'));
hfpr_blaunchprocgpws._s.SetParameterString('m_bApplet','true');
hfpr_blaunchprocgpws._s.CallServlet('hfpr_blaunchprocgpws');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfpr_blaunchprocgpws._s.errmsg;
}
}
hfpr_blaunchprocgpws.CtxLoad_ = function(){return []}
