// FabToolTip
//FabToolTip = Class.create();
//FabToolTip.prototype = {
var FabToolTip = Class.create({
    initialize: function(tooltipDiv, callerObj, _innerHTML) {
        this.tooltipDiv = $(tooltipDiv);
        this.callerObj = $(callerObj);
        this.HTML = _innerHTML;
        this.operationsCode = new Array();
        if (!this.tooltipDiv) {
            //alert('Impossibile identificare il div del ToolTip indicato.');
            var _div = new Element('div', { 'class': 'ToolTipDivMouseOver', id: tooltipDiv });
            _div.setStyle({
                display: 'none'
            });
            this.tooltipDiv = _div;
            window.document.body.insertBefore(this.tooltipDiv, window.document.body.childNodes[0]);

            this.tooltipDiv.store('isComplete', false);
        }
        if (!this.callerObj) {
            alert('Impossibile identificare il Caller indicato.');
        }

        if (this.HTML != '') {
            this.tooltipDiv.update(this.HTML);
        } else {
            this.ReloadToolTipFilter();
        }

        this.callerObj.observe('mouseover', this.Open.bind(this));
        this.callerObj.observe('mouseout', this.Close.bind(this));
    },

    Open: function() {
        /*if (this.operationsCode.length > 0) {
            this.operationsCode.push("this.Open()");
            return;
        }*/

        if (!this.tooltipDiv.retrieve('isComplete')) {
            var _offset = this.callerObj.cumulativeOffset();
            var _offsetScroll = [0, 0]; //this.callerObj.cumulativeScrollOffset();
            var _x = _offset[0] + _offsetScroll[0];
            var _y = _offset[1] + _offsetScroll[1] + this.callerObj.getHeight() + 1;

            this.tooltipDiv.setStyle({
                left: _x.toString() + 'px',
                top: _y.toString() + 'px'
            });
            this.tooltipDiv.appear({
                duration: 0.3,
                afterFinish: function() { this.tooltipDiv.store('isComplete', true); if (this.operationsCode.length > 0) { eval(this.operationsCode.pop()); } } .bind(this)
            });
        } else {
            this.operationsCode.push("this.Open()");
        }
    },

    Close: function() {
        /*if (this.operationsCode.length > 0) {
            this.operationsCode.push("this.Close()");
            return;
        }*/

        if (this.tooltipDiv.retrieve('isComplete')) {
            this.tooltipDiv.fade({
                duration: 0.3,
                afterFinish: function() { this.tooltipDiv.store('isComplete', false); if (this.operationsCode.length > 0) { eval(this.operationsCode.pop()); } } .bind(this)
            });
        } else {
            this.operationsCode.push("this.Close()");
        }
    },

    ReloadToolTipFilter: function() {
        var _div = this.tooltipDiv;
        new Ajax.Request(_urlBase + "services/ExistFilter.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: '',
            onCreate: function() {
                _div.update('<img src="imgs/loading.gif" alt="Caricamento..." style="border:0px solid;" /> Caricamento...');
            },
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    _div.update(trns.substring(3));
                }
                else {
                    _div.update('Eccezione:' + trns.substring(3));
                }
            },
            onFailure: function(transport) {
                _div.update('Eccezione:' + trns.substring(3));
            }
        });
    }
});