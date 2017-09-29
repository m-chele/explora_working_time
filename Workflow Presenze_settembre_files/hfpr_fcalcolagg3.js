function hfpr_fcalcolagg3() {
var Giorno;
var Datastr;
var m_Caller
hfpr_fcalcolagg3._p=_rargs(arguments,{eval:function(e){eval(e)}})
function i_BlankParameters() {
Giorno='';
Datastr='';
}
if(hfpr_fcalcolagg3._p.length>0)_rargs([[['Giorno',hfpr_fcalcolagg3._p[0]],['Datastr',hfpr_fcalcolagg3._p[1]]]],{eval:function(e){eval(e)}})
hfpr_fcalcolagg3._s=new BatchJavascript();
if (Ne(typeof(document.FSender),'undefined') && Ne(typeof(document.FSender.m_cRegionalSettings),'undefined')) {
hfpr_fcalcolagg3._s.SetParameterString('m_cRegionalSettings',document.FSender.m_cRegionalSettings.value);
}
hfpr_fcalcolagg3._s.SetParameterString('Giorno',WtA(Giorno,'C'));
hfpr_fcalcolagg3._s.SetParameterString('Datastr',WtA(Datastr,'C'));
hfpr_fcalcolagg3._s.SetParameterString('m_bApplet','true');
hfpr_fcalcolagg3._s.CallServlet('hfpr_fcalcolagg3');
if (Eq(typeof(m_bCalculating),'undefined') ||  ! (m_bCalculating)) {
m_cErrorFromRoutine=hfpr_fcalcolagg3._s.errmsg;
}
return DateFromApplet(hfpr_fcalcolagg3._s.GetDate());
}
hfpr_fcalcolagg3.CtxLoad_ = function(){return []}
