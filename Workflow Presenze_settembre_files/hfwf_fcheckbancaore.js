function hfwf_fcheckbancaore() {
var pIdCompany;
var pIdEmploy;
var m_Caller
hfwf_fcheckbancaore._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
pIdCompany='';
pIdEmploy='';
}
if(hfwf_fcheckbancaore._p.length>0)_rargs([[['pIdCompany',hfwf_fcheckbancaore._p[0]],['pIdEmploy',hfwf_fcheckbancaore._p[1]]]],{eval:function(e){eval(e)}})
hfwf_fcheckbancaore._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfwf_fcheckbancaore._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfwf_fcheckbancaore._s.SetParameterString('pIdCompany',WtA(pIdCompany,'C'));
hfwf_fcheckbancaore._s.SetParameterString('pIdEmploy',WtA(pIdEmploy,'C'));
hfwf_fcheckbancaore._s.SetParameterString('m_bApplet','true');
hfwf_fcheckbancaore._s.CallServlet('hfwf_fcheckbancaore');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfwf_fcheckbancaore._s.errmsg;
}
return hfwf_fcheckbancaore._s.GetBoolean();
}
hfwf_fcheckbancaore.CtxLoad_ = function(){return []}
