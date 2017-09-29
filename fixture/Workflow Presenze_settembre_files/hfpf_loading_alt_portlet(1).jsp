






window.hfpf_loading_alt_Static=function(){
if(typeof hidePreload !='undefined')this.hidePreload=hidePreload;
if(typeof delay_onTimer !='undefined')this.delay_onTimer=delay_onTimer;
if(typeof ready !='undefined')this.ready=ready;
if(typeof finish !='undefined')this.finish=finish;
this.this_Calc=function(){
this.PageletCalc();
}
var tempo=0;
function hidePreload(){
  this.image0.Hide()
  this.label1.Hide()
}
function delay_onTimer(){
   tempo++;
   if(tempo==2)
     this.endRenderLoad.Emit();
}
function ready(caller){
   this.portlet.Value(caller)
   tempo=0;
   this.image0.Show()
   this.label1.Show()
   this.delay.Start()
}
function finish(){
  this.show.Emit()
}
this.dispatchEvent('HideUnderCondition');
this.dispatchEvent('EditUnderCondition');
}


