ZtVWeb.TimerCtrl=function(form,id,name,repeated,to_ms,i_ms,start_activated,d_ms,rounds){

	this.ctrlid = id;
	this.form   = form;
	this.name   = name;

	this.timeout_ms  = (!Empty(to_ms) && to_ms != " ") ? to_ms : 0;
	this.interval_ms = (!Empty(i_ms) && i_ms != " ") ? i_ms : 0;
	this.duration_ms = (!Empty(d_ms) && d_ms != " ") ? d_ms : -1;
	this.rounds = (!Empty(rounds) && rounds != " ") ? rounds : -1;

	this.tmp_rounds = this.rounds;
	this.tmp_duration = this.duration_ms;

	this.start_activated = (start_activated == 'true') ? true : false;
	this.repeated = (repeated == 'true') ? true : false;

	this.addToForm(this.form,this); //obbligatoria

	this.global_js_id=this.form.formid+'.'+this.name;
	var global_js_id = this.global_js_id;


	/* FUNCTIONS */

		var timer = null;

		this._executeTimer = function(){
			var form_id = this.form.formid;
      if (window[form_id][this.name+"_onTimer"])
          window[form_id][this.name+"_onTimer"]();
			if(this.duration_ms > -1){
				this.tmp_duration -= this.interval_ms;
				if (this.tmp_duration < 0)
					this.Stop();
			}
			if(this.rounds > -1){
				this.tmp_rounds -= 1;
				if (this.tmp_rounds == 0)
					this.Stop();
			}
		}

		this._StartTimeOut = function(){
			if(timer == null && this.interval_ms > 1 && this.repeated){
				timer = setInterval(global_js_id+"._executeTimer()",this.interval_ms);
			}else{
				if(this.interval_ms == 0 || !this.repeated)
					this._executeTimer();
			}
		}

		this.Start = function(){
			this.tmp_rounds = this.rounds;
			this.tmp_duration = this.duration_ms;
			if(this.timeout_ms > 1){
				setTimeout(global_js_id+"._StartTimeOut()",this.timeout_ms);
			}else{
				if(timer == null && this.interval_ms > 1 && this.repeated){
					timer = setInterval(global_js_id+"._executeTimer()",this.interval_ms);
				}else{
					if(this.interval_ms == 0 || !this.repeated)
						this._executeTimer();
				}
			}
		}

		this.Stop = function(){
			if(timer != null){
				clearInterval(timer);
				timer = null;
			}
		}

		this.SetDelay = function(ms){
			this.timeout_ms = ms;
		}

		this.SetInterval = function(ms){
			this.interval_ms = ms;
			if(timer != null){
				this.Stop();
				if(timer == null && this.interval_ms > 1 && this.repeated){
					timer = setInterval(global_js_id+"._executeTimer()",this.interval_ms);
				}
			}
		}

		this.SetDuration = function(ms){
			this.duration_ms = ms;
		}

		this.SetRounds = function(n){
			this.rounds = n;
		}

		if(this.start_activated){
			this.Start();
		}

	/* END FUNCTIONS */

}
ZtVWeb.TimerCtrl.prototype=new ZtVWeb.StdControl
