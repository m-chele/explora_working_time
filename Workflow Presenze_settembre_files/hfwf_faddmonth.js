function hfwf_faddmonth() {
var pDTSTART;
var pNRMONTH;
var pFLOPERATOR;
var m_Caller
hfwf_faddmonth._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
pDTSTART=NullDate();
pNRMONTH=0;
pFLOPERATOR='';
}
if(hfwf_faddmonth._p.length>0)_rargs([[['pDTSTART',hfwf_faddmonth._p[0]],['pNRMONTH',hfwf_faddmonth._p[1]],['pFLOPERATOR',hfwf_faddmonth._p[2]]]],{eval:function(e){eval(e)}})
hfwf_faddmonth._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfwf_faddmonth._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfwf_faddmonth._s.SetParameterString('pDTSTART',WtA(pDTSTART,'D'));
hfwf_faddmonth._s.SetParameterString('pNRMONTH',WtA(pNRMONTH,'N'));
hfwf_faddmonth._s.SetParameterString('pFLOPERATOR',WtA(pFLOPERATOR,'C'));
hfwf_faddmonth._s.SetParameterString('m_bApplet','true');
hfwf_faddmonth._s.CallServlet('hfwf_faddmonth');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfwf_faddmonth._s.errmsg;
}
return DateFromApplet(hfwf_faddmonth._s.GetDate());
}
hfwf_faddmonth.CtxLoad_ = function(){return []}
