function hfpr_fdescunitorg() {
var pIDCOMPANY;
var pIDMODORG;
var pIDUNITORG;
var pDTENDVL;
var m_Caller
hfpr_fdescunitorg._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
pIDCOMPANY='';
pIDMODORG='';
pIDUNITORG='';
pDTENDVL=NullDate();
}
if(hfpr_fdescunitorg._p.length>0)_rargs([[['pIDCOMPANY',hfpr_fdescunitorg._p[0]],['pIDMODORG',hfpr_fdescunitorg._p[1]],['pIDUNITORG',hfpr_fdescunitorg._p[2]],['pDTENDVL',hfpr_fdescunitorg._p[3]]]],{eval:function(e){eval(e)}})
hfpr_fdescunitorg._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfpr_fdescunitorg._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfpr_fdescunitorg._s.SetParameterString('pIDCOMPANY',WtA(pIDCOMPANY,'C'));
hfpr_fdescunitorg._s.SetParameterString('pIDMODORG',WtA(pIDMODORG,'C'));
hfpr_fdescunitorg._s.SetParameterString('pIDUNITORG',WtA(pIDUNITORG,'C'));
hfpr_fdescunitorg._s.SetParameterString('pDTENDVL',WtA(pDTENDVL,'D'));
hfpr_fdescunitorg._s.SetParameterString('m_bApplet','true');
hfpr_fdescunitorg._s.CallServlet('hfpr_fdescunitorg');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfpr_fdescunitorg._s.errmsg;
}
return hfpr_fdescunitorg._s.GetString();
}
hfpr_fdescunitorg.CtxLoad_ = function(){return []}
