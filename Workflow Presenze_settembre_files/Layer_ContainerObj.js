ZtVWeb.Layer_ContainerCtrl = new Class({

    Extends: ZtVWeb.StdControl,

    initialize: function(params)
    {
		this.form         	  = params.form;
		this.id           	  = params.id;
		this.name         	  = params.name;
		this.Layer_x      	  = params.Layer_x;
		this.Layer_y      	  = params.Layer_y;
		this.Layer_width  	  = params.Layer_width;
		this.Layer_height 	  = params.Layer_height ;
		this.Iframed      	  = params.Iframed;
		this.url_name     	  = params.url_name;
		this.Floating     	  = params.Floating;
		this.Scrollable   	  = params.Scrollable;
		this.Resizable    	  = params.Resizable;
		this.UseEffects   	  = params.UseEffects;
		this.Handle_Title 	  = params.Handle_Title;
		this.Ctrl         	  = document.id(this.id); 
		this.resContainer 	  = document.id('frm_' + this.id);
		this.titleBar     	  = document.id('table_'+this.id);
		this.resizer      	  = null;
		this.Resizer_Class    = params.Resizer_Class;
	    
		this.delay = 400;
		
		// altezza resContainer (il contenitore della risorsa) settata in percentuale
		
		var h = this._getBodyHeightPcntl();
		if(isNaN(h)) // il componente potrebbe essere in una portlet display = 'none'
			h = '100';
		this.resContainer.setStyle('height', h + '%');
		
		//opacita' fissa a 1 se non ci sono effetti
		
		if(!this.UseEffects) {
		   //this.Ctrl.setOpacity('1'); PAOLO modifica per mootools 1.6 
		   this.Ctrl.setStyle('opacity','1');
        } else {
           //this.Ctrl.setOpacity('0'); PAOLO modifica per mootools 1.6 
	      this.Ctrl.setStyle('opacity','0');
	    }  
		
		// risorsa inclusa senza iframe: uso la funzione standard di Portal Studio ZtVWeb.Include
		
		if(!this.Iframed)
			ZtVWeb.Include(this.url_name, this.resContainer);
		
		// abilita il ridimensionamento se richiesto
		
		if(this.Resizable)
			this._enableResize();
		
		// abilita lo spostamento se richiesto
		
		if(this.Floating)
			this._enableDrag();
    },
    
	/**
	Public Method: Show
		Show the layer
	*/
	
	Show: function(el){
		if( this.Ctrl.getStyle('visibility') == 'hidden' ){
			this.Ctrl.setStyle('visibility', 'visible');

			this.Ctrl.setStyle('display', 'block');
			
			this._applyFx(this.Ctrl, this.delay, Fx.Transitions.Expo.easeIn, 1);
			
			
			// apre il layer centrato rispetto all'elemento specificato
			
			if(el){
				if(el.Ctrl) el = el.Ctrl;
				coords = this._getAbsolutePosition(el);
				this.Ctrl.setStyles({
					top:  coords.y + el.offsetHeight/2 + "px",
					left: coords.x + el.offsetWidth/2 + "px"
				});
			}
			
			// chiama la relativa callback
			
			this._execCallBack('Opened');
		}
    },
	
	/**
	Public Method: Hide
		Hide the layer
	*/
	
    Hide: function(){
		this._applyFx(this.Ctrl, this.delay, Fx.Transitions.Sine.easeOut, 0);
		if(this.UseEffects)	{
			this.Ctrl.setStyle.delay(this.delay, this.Ctrl, ['visibility','hidden']);
			
			// nasconde fisicamente il layer 
			
			this.Ctrl.setStyle.delay(this.delay, this.Ctrl, ['display','none']);
		}
		else {
			this.Ctrl.setStyle('visibility','hidden');
			
			// nasconde fisicamente il layer 
			
			this.Ctrl.setStyle('display','none');
		}
		
		// chiama la relativa callback
		
		this._execCallBack('Closed');
    },
	
	/**
	Public Method: ResizeTo
		Resize the layer
	*/
	
    ResizeTo: function(w,h){
		this.Ctrl.setStyles({width: w, height: h});
    	if(this.titleBar)
			this.titleBar.setStyle('width', w);
    	this.Layer_width=w;
	    this.Layer_height=h;
    },
	
	/**
	Public Method: Move
		Move the layer
	*/
	
    MoveTo: function(x,y){
		this.Ctrl.setStyles({top: y, left: x});
    	this.Layer_x=x;
	    this.Layer_y=y;
    },
	
	/**
	Public Method: Load
		Load new url on layer
	*/
	
    Load: function(url){
    	this.url_name=url;
		if(this.Iframed)
			this.resContainer.src=this.url_name;
		else{
			this.resContainer.innerHTML = '';
			ZtVWeb.Include(this.url_name,this.resContainer);
		}
    },
	
	/**
	Public Method: Load
		Reload layer url
	*/
    
    Reload: function(){
		if(this.Iframed)
			this.resContainer.src=this.url_name;
		else{
			this.resContainer.innerHTML = '';
			ZtVWeb.Include(this.url_name,this.resContainer);
		}
    },
    
	/**
	Public Method: Set_HandleTitle
		Setta il titolo
	*/
	
    Set_HandleTitle: function(NewTitle){
    	var title = $('title_'+this.id);
		if(title) title.innerHTML = NewTitle;
    	this.Handle_Title = NewTitle;
    },
	
	/**
	Private Method: _onLoadFrame
		Chiama la funzione load del frame, al load della portlet
	*/
	
    _onLoadFrame: function(){
	
        //Richiamo della funzione OnLoad del Frame
		
        if(this.Iframed){
			try{
			  eval('form.'+name + '_OnLoadUrl()')
			}catch(e){}
		}
		//Custom End Roberta
    },
	
	/**
	Private Method: _getBodyHeightPcntl
		Ritorna la percentuale di occupazione massima, in altezza, che puo' essere assegnata al body
	*/
	
	_getBodyHeightPcntl: function(){
		return this.titleBar ? 100 - (this.titleBar.getSize().y * 100 / this.Ctrl.getSize().y) : 100;
	},
	
	/**
	Private Method: _applyFx
		Applica l'effetto di tipo transition all'elemento del DOM el, impostando la durata a un numero di millisecondi pari a duration
	*/
	
	_applyFx: function(el, duration, transition, opacityVal){
		if(this.UseEffects)
			new Fx.Morph(el, {duration: duration, transition: transition}).start({'opacity': opacityVal});
	},
	
	/**
	Private Method: _execCallBack
		Esegue la callback di nome specificato
	*/
	
	_execCallBack: function(nameStr){
		var nameStr = this.name + '_' + nameStr;
		if(typeof(this.form[nameStr]) == 'function')
			return this.form[nameStr].call(this);
	},
	
	/**
	Private Method: _enableResize
		Abilita il ridimensionamento
	*/
	
	_enableResize: function(){
		var resizer = this.Ctrl.makeResizable({
			handler: $('mousedown'),
			modifiers: {x: 'width', y: 'height'},
			preventDefault: true,
			onDrag: function(){ 
				if(this.titleBar)
					$('table_'+this.id).setStyle('width', this.resContainer.getSize().x + 'px');
				this.resContainer.setStyle('height', this._getBodyHeightPcntl() + '%');
			}.bind(this),
			onComplete: function(){
				
				// controlla che le dimensioni del layer non siano minori delle dimensioni della barra del titolo
				
				if(this.titleBar){
					if(this.Ctrl.Ctrl.getSize().y < this.titleBar.Ctrl.getSize().y)
						this.Ctrl.setStyle('height', this.titleBar.Ctrl.getSize().y + 'px');
					if(this.Ctrl.getSize().x < this.titleBar.getSize().x)
						this.Ctrl.setStyle('width', this.titleBar.getSize().x + 'px');
				}
			}.bind(this)
		});
		resizer.detach(); // parte disattivato, si attiva al mouseenter sulla maniglia
		
		// aggiunge la maniglia al Ctrl
		
		this.resizer = new Element('div', { id: this.id + '_resizer', 
							 'class': this.Resizer_Class,
							 'events': {
								'mouseenter': function(){ resizer.attach(); },
								'mouseleave': function(){ resizer.detach(); }
							 }
						   }).inject(this.Ctrl);
	},
	
	/**
	Private Method: _enableDrag
		Ritorna le coordinate assolute dell'elemento del DOM el.
		Vedi Show()
	*/
	
	_enableDrag: function(){
		if(this.titleBar){
			var dragger = new Drag(this.Ctrl, {
				 handler: $('mousedown'),
				 modifiers: {x: 'left', y: 'top'},
				preventDefault: true
			});
			 dragger.detach(); // parte disattivato, si attiva al mouseenter sul titolo del layer
			
			 this.titleBar.addEvents({
				 'mouseenter': function(){ dragger.attach(); },
				 'mouseleave': function(){ dragger.detach(); }
			 });
		}			
	},
	
	/**
	Private Method: _getAbsolutePosition
		Ritorna le coordinate assolute dell'elemento del DOM el.
		Vedi Show()
	*/
	
	_getAbsolutePosition: function(el){
		var curleft=curtop=0;
		do {
			curleft += el.offsetLeft;
			curtop += el.offsetTop;
		} while (el = el.offsetParent);

		return {x:curleft,y:curtop};
	}
});

