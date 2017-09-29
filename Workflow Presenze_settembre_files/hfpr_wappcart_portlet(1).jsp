







window.hfpr_wappcart_Static=function(){
if(typeof go !='undefined')this.go=go;
this.this_Calc=function(){
this.PageletCalc();
}
this.this_HideUnderCondition=function(){
ZtVWeb.HideCtrl(true,this.label20);
}
//Inizializzo il div per il modal layer
initModalLayer()
var company = '000000'
this.setup.queryfilter = "IDCOMPANY = "+"'"+this.gCodSoc.Value()+"'";
this.setup.Query()
if(this.setup.nRecs==0){
    this.setup.queryfilter = "IDCOMPANY = '"+company+"'";
    this.setup.Query()
}
//se checkato abilito il TAB Approvazione ore eccedenti
this.IGVALRICH.Value(this.setup.Data[0][39])
this.FLIVABIL.Value(this.setup.Data[0][40])
this.gStampaRich.Value(this.setup.Data[0][41])
this.EMPTYAZI.Value(this.setup.Data[0][51])
this.ABILSTLIVVR.Value(this.setup.rs.ABILSTLIVVR)
this.ABILSTLIVVRAPP.Value(this.setup.rs.ABILSTLIVVRAPP)
this.ABILSTLIVVRCOL.Value(this.setup.rs.ABILSTLIVVRCOL)
this.IGCANLOG.Value(this.setup.rs.IGCANLOG)
this.CANRICCOL.Value(this.setup.rs.CANRICCOL)
this.NUMLIVELLI.Value(this.setup.rs.NUMLIVELLI)
this.w_IGORDGRUP.Value(this.setup.rs.IGORDGRUP)
this.CANAUTOAPP.Value(this.setup.rs.CANAUTOAPP)
this.CANTIMBAPP.Value(this.setup.rs.CANTIMBAPP)
this.CTRLCAU.Value(this.setup.rs.CTRLCAU)
this.LIMITEORECC.Value(this.setup.rs.LIMITEORECC)
this.GUIDAORECC.Value(this.setup.rs.GUIDAORECC)
this.w_ABILORECCOLD.Value(this.setup.rs.ABILORECCOLD)
this.IGTIPOCANL.Value(this.setup.rs.IGTIPOCANL)
//setup per abilitare filtri quadratoni spalla cartellino Approvatore e Uff. Personale
this.FCARTATTUFFP.Value(this.setup.rs.SPCUFFPCA)
this.FCARTINVUFFP.Value(this.setup.rs.SPCUFFPCI)
this.FANOMUFFP.Value(this.setup.rs.SPUFFPAN)
this.FRICHATTUFFP.Value(this.setup.rs.SPCUFFPRA)
this.FCARTATTCOL.Value(this.setup.rs.SPCCOLCA)
this.FCARTINVCOL.Value(this.setup.rs.SPCCOLCI)
this.FANOMCOL.Value(this.setup.rs.SPCCOLAN)
this.FRICHATTCOL.Value(this.setup.rs.SPCCOLRA)
//setup per filtri quadratoni in Elenco segnalazioni lato personale e collaboratori
this.ESRICHATTCOL.Value(this.setup.rs.ESCOLRA)
this.ESANOMCOL.Value(this.setup.rs.ESCOLAN)
this.ESANOMNVCOL.Value(this.setup.rs.ESCOLANV)
this.ESANOMFCOL.Value(this.setup.rs.ESCOLANF)
this.ESRICHATTPER.Value(this.setup.rs.ESPERRA)
this.ESANOMPER.Value(this.setup.rs.ESPERAN)
this.ESANOMNVPER.Value(this.setup.rs.ESPERANV)
this.ESANOMFPER.Value(this.setup.rs.ESPERANF)
  
this.CHANGECART.Value(this.setup.rs.CHANGECART)
  
if(this.w_ABILORECCOLD.Value()!='S' && this.TAB.Value()=='Approvazioneoreeccedenti'){
  this.TAB.Value('Approvazioneoreeccedenti1')
}
if(this.w_ABILORECCOLD.Value()!='S' && this.TAB.Value()=='Inserimentooreeccedenti'){
  this.TAB.Value('Inserimentooreeccedenti1')
}
//controllo nel cambio utente se sono abilitato per il processo CARTELLINO
this.OKMLCARTELLINO.Value('S');
if(this.GCHANGEUSR.Value()=='S'){
	this.pCODUTEML.Value(this.hfwf_fusercode.Link());
	this.pIDCOMPANYML.Value(this.gCodSoc.Value());
	this.pIDEMPLOYML.Value(this.gCodDip.Value());
	this.hfpr_qfindmultilogin.Query();
	if(this.hfpr_qfindmultilogin.nRecs > 0){
		this.OKMLCARTELLINO.Value('S');
	}else{
		this.OKMLCARTELLINO.Value('N');
	}
}
//fine conotrlli validazione
function go(){  
  //messo try-catch perchè al caricamento, il pagelet non è ancora caricato e genera errore
  //questa funzione è usata anche per quando si cambia tab personale-collaboratore
  try{
    exec(this.TABselect.Value(),this.TAB.Value())	
  }catch(e){}  
}

this.dispatchEvent('HideUnderCondition');
this.dispatchEvent('EditUnderCondition');
}


