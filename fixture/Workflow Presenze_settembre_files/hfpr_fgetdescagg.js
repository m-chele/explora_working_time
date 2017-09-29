function hfpr_fgetdescagg() {
var pInfoAgg;
var pCodice;
var pCodAzi;
var m_Caller
hfpr_fgetdescagg._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
pInfoAgg='';
pCodice='';
pCodAzi='';
}
if(hfpr_fgetdescagg._p.length>0)_rargs([[['pInfoAgg',hfpr_fgetdescagg._p[0]],['pCodice',hfpr_fgetdescagg._p[1]],['pCodAzi',hfpr_fgetdescagg._p[2]]]],{eval:function(e){eval(e)}})
hfpr_fgetdescagg._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfpr_fgetdescagg._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfpr_fgetdescagg._s.SetParameterString('pInfoAgg',WtA(pInfoAgg,'C'));
hfpr_fgetdescagg._s.SetParameterString('pCodice',WtA(pCodice,'C'));
hfpr_fgetdescagg._s.SetParameterString('pCodAzi',WtA(pCodAzi,'C'));
hfpr_fgetdescagg._s.SetParameterString('m_bApplet','true');
hfpr_fgetdescagg._s.CallServlet('hfpr_fgetdescagg');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfpr_fgetdescagg._s.errmsg;
}
return hfpr_fgetdescagg._s.GetString();
}
hfpr_fgetdescagg.CtxLoad_ = function(){return []}
