







window.hfpr_wheaderpcart_Static=function(){
if(typeof select !='undefined')this.select=select;
if(typeof this_Loaded !='undefined')this.this_Loaded=this_Loaded;
if(typeof alertLinkFromMail !='undefined')this.alertLinkFromMail=alertLinkFromMail;
this.this_Calc=function(){
this.PageletCalc();
}
function select(tab){  
  if(tab==1){
    this.TABselect.Value('PER')
    this.EmitTab.Emit()
  }else{
    this.TABselect.Value('APP')
    this.EmitTab.Emit()
  }
}  
  
function this_Loaded(){
   
  document.title = FormatMsg('Workflow Presenze');
var translate = FormatMsg('Ore eccedenti')
var translate2 = FormatMsg('Segnalazioni')  
  
//eseguo la query per prendere il valore del campo che mi abilita la validazione cartellino
  this.chkdipvc.Query()
this.ABILITAVALCART.Value(this.chkdipvc.Data[0][0])
//controllo se effettivamente sono approvatore di un gruppo della validazione cartellino 
  this.qappvalcart.Query()
    if(this.qappvalcart.nRecs > 0){
      this.APPVALCART.Value('S')
    }
  
var tabs,link
tabs='&nbsp;'+FormatMsg('PERSONALE')+'&nbsp;'
link="function:select("+1+")"
  
  if(this.gTipoUte.Value()=='V' && this.gMT.Value()==1){
    tabs = tabs +','+'&nbsp;'+FormatMsg('COLLABORATORI')+'&nbsp;'
    link = link + ','+"function:select("+2+")"
		//se è un utente senza rdl, mostro solo la parte collaboratori
		if(this.gCodDip.Value()=='' || Empty(this.gCodDip.Value())){
			tabs = '&nbsp;'+FormatMsg('COLLABORATORI')+'&nbsp;';
			link = "function:select("+2+")"
		}		
  }
  
this.Tabs.links = tabs;
this.Tabs.href = link;
this.Tabs.FillTabs()
 if(this.gTipoUte.Value()=='V' && this.gMT.Value()==1 && (this.gCodDip.Value()!='' || !Empty(this.gCodDip.Value()))){
    this.Tabs.Ctrl.style.width='390px'  
 }else{
    this.Tabs.Ctrl.style.width='180px'  
 }
	
		if(this.gTipoUte.Value()=='V' && this.gMT.Value()==1){
			//apro cartellino collaboratori se arrivo da notifica APPTIMWAIT
			if(ZtVWeb.getPortlet('hfpr_wheaderpcart').pNOTIFICA.Value() == 'S'){
				this.Tabs.Select(2);
				this.select(2);
			}else{		
				if((this.TAB.Value()=='Richieste' || this.TAB.Value()=='Approvazioneoreeccedenti' || this.TAB.Value()=='ElencoSegnalazionia' || this.TAB.Value()=='Richiestecartellinoa') && (this.gCodDip.Value()!='' || !Empty(this.gCodDip.Value()))){
				// if((this.TAB.Value()=='Richieste' || this.TAB.Value()=='Approvazione ore eccedenti' || this.TAB.Value()=='Elenco Segnalazioni' || this.TAB.Value()=='Richieste cartellino')){				
					this.Tabs.Select(2)
					this.select(2)  
				}else{
					//se è un utente senza rdl, mostro solo la parte collaboratori
					if(this.gCodDip.Value()=='' || Empty(this.gCodDip.Value())){
						this.Tabs.Select(1);
						this.select(2);
					}else{
						this.Tabs.Select(1)
						this.select(1) 
					}	
				} 
			}	
		}else{
				this.Tabs.Select(1)
				this.select(1) 
		}
	alertLinkFromMail();
}
function alertLinkFromMail(){
	if(ZtVWeb.getPortlet('hfpr_wheaderpcart').pLINKDAMAIL.Value()=='S')
    alert(FormatMsg('Attenzione: alla chiusura della finestra l\'utenza rimane connessa. Per disconnettersi è necessario effettuare il logout dal portale.'));  
}
  
  
  

this.dispatchEvent('HideUnderCondition');
this.dispatchEvent('EditUnderCondition');
}


