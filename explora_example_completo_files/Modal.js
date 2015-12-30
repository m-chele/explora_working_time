var Dialog = {};
//Dialog.Box = Class.create();
//Object.extend(Dialog.Box.prototype, {
Dialog.Box = Class.create({
    initialize: function() {
        this.winTop = window.self;
        if (window.parent != window.top)
            this.winTop = window.parent;

        this.viewportDimension = document.viewport.getDimensions();
        this.viewportScrollOff = document.viewport.getScrollOffsets();

        this.createOverlay();
        this.divLoading = null;
        this.divAjax = null;
        var b_dims = Element.getDimensions(this.overlay);
    },

    createOverlay: function() {
        if (this.winTop.$('dialog_overlay')) {
            this.overlay = this.winTop.$('dialog_overlay');
        } else {
            this.overlay = this.winTop.document.createElement('div');
            this.overlay.id = 'dialog_overlay';
            Object.extend(this.overlay.style, {
                position: 'fixed',
                top: '0px',
                left: '0px',
                //right: '0px',
                //bottom: '0px',
                width: this.winWidth().toString() + 'px',
                height: this.winHeight().toString() + 'px',
                zIndex: 90,
                backgroundColor: '#000',
                display: 'none',
                zIndex: '8888'
            });
            this.winTop.document.body.insertBefore(this.overlay, this.winTop.document.body.childNodes[0]);
            $(this.overlay).setOpacity(0.5); //IE Hack
        }
    },

    show: function() {
        this.overlay.style.height = this.winHeight() + 'px';
        this.overlay.onclick = this.hide.bind(this);
        this.selectBoxes();
        //new Effect.Appear(this.overlay, { duration: 0.0, from: 0.0, to: 0.4 });
        this.overlay.show();
    },

    persistent_show: function(divToInner) {
        this.overlay.style.height = this.winHeight() + 'px';
        this.selectBoxes();
        //new Effect.Appear(this.overlay, { duration: 0.0, from: 0.0, to: 0.4 });
        if (divToInner) {
            var y = (this.viewportDimension.height - parseInt(divToInner.style.height.replace('px', ''))) / 2;
            var x = (this.viewportDimension.width - parseInt(divToInner.style.width.replace('px', ''))) / 2;
            divToInner.setStyle({ position: 'absolute', top: y + 'px', left: x + 'px', zIndex: '8889' });
            $(this.winTop.document.body).insert(divToInner);
        }
        this.overlay.show();
    },

    loading_show: function() {
        this.overlay.style.height = this.winHeight() + 'px';
        this.selectBoxes();
        //new Effect.Appear(this.overlay, { duration: 0.0, from: 0.0, to: 0.4 });
        //
        this.divLoading = new Element('div', { 'class': 'loadingDiv' }).update('<img src="imgs/loading.gif" alt="" /> <strong>Caricamento in corso...</strong><br /><br /><span class="miniText">Attendere che il caricamento sia completato, o se l\'operazione si prolunga, ricaricare la pagina.</span>');
        //<br /><br /><span class="curPointer miniText" onclick="DialogHide();">Chiudi questo pannello</span>
        var y = ((this.viewportDimension.height - 50) / 2) + this.viewportScrollOff.top;
        var x = ((this.viewportDimension.width - 250) / 2) + this.viewportScrollOff.left;
        this.divLoading.setStyle({ width: '250px', height: '50px', position: 'absolute', top: y + 'px', left: x + 'px', zIndex: '8889' });
        $(this.winTop.document.body).insert(this.divLoading);
        //
        this.overlay.show();
    },

    html_show: function(html, w, h) {
        this.selectBoxes();

        var y = ((this.viewportDimension.height - h) / 2) + this.viewportScrollOff.top;
        var x = ((this.viewportDimension.width - w) / 2) + this.viewportScrollOff.left;

        this.divAjax = new Element('div', { 'id': 'ModalBox_LoadingDiv' });
        this.divAjax.setStyle({ width: w.toString() + 'px', height: h.toString() + 'px', position: 'absolute', top: y + 'px', left: x + 'px', zIndex: '8889', backgroundColor: '#FFFFFF', border: '2px solid #C0C0C0' });
        this.divAjax.setOpacity(1.0);
        this.divAjax.update(html);

        $(this.winTop.document.body).insert(this.divAjax);
        this.overlay.show();
    },

    ajax_show: function(url, post, w, h, callbackOK, paramsCallbackOK) {
        this.selectBoxes();

        var trns = '';
        var opt;
        var y = ((this.viewportDimension.height - h) / 2) + this.viewportScrollOff.top;
        var x = ((this.viewportDimension.width - w) / 2) + this.viewportScrollOff.left;

        this.divAjax = new Element('div', { 'id': 'ModalBox_LoadingDiv' });
        this.divAjax.setStyle({ width: w.toString() + 'px', height: h.toString() + 'px', position: 'absolute', top: y + 'px', left: x + 'px', zIndex: '8889', backgroundColor: '#FFFFFF' });
        this.divAjax.setOpacity(1.0);

        this.ajaxOnSuccessCallback = callbackOK;
        this.ajaxOnSuccessCallbackParams = paramsCallbackOK;

        opt = { method: 'post', postBody: post, onSuccess: this.ajax_onSuccess.bind(this), onFailure: this.ajax_onFailure.bind(this) };

        new Ajax.Request(url + "?d=" + (new Date()).getTime(), opt);
    },

    ajax_onSuccess: function(transport) {
        var hideAll_f = this.hide.bind(this);
        var ok_f = this.ajaxOnSuccessCallback;
        var okp_f = this.ajaxOnSuccessCallbackParams;

        var esito = transport.responseText;
        this.divAjax.update(esito);

        var btnC = this.divAjax.select("#ModalBox_BtnClose")[0];
        if (btnC) {
            btnC.observe('click', function() { hideAll_f(); });
        }
        var btnS = this.divAjax.select("#ModalBox_BtnOK")[0];
        if (btnS) {
            btnS.observe('click', function() { ok_f(okp_f, hideAll_f); });
        }

        $(this.winTop.document.body).insert(this.divAjax);
        this.overlay.show();
    },

    ajax_onFailure: function(transport) {
        var esito = transport.responseText;
        alert(esito);
    },

    hide: function() {
        this.selectBoxes();
        //new Effect.Fade(this.overlay, { duration: 0.1 });
        this.overlay.hide();
        this.ajaxOnSuccessCallback = null;
        this.ajaxOnSuccessCallbackParams = null;
        if (this.divLoading) {
            this.divLoading.remove();
            this.divLoading = null;
        }
        if (this.divAjax) {
            this.divAjax.remove();
            this.divAjax = null;
        }
    },

    selectBoxes: function() {
        if (this.winTop != self) {
            this.winTop.$$("select").each(function(select) {
                (select.visible()) ? select.hide() : select.show();
            });
        }
        $$("select").each(function(select) {
            (select.visible()) ? select.hide() : select.show();
        });
    },

    winWidth: function() {
        //return this.winTop.innerWidth || this.winTop.document.documentElement.clientWidth || this.winTop.document.body.clientWidth || 800;
        var xScroll, windowWidth;
        if (this.winTop.innerHeight && this.winTop.scrollMaxY) {
            xScroll = this.winTop.document.body.scrollWidth;
        } else if (this.winTop.document.body.scrollHeight > this.winTop.document.body.offsetHeight) {
            xScroll = this.winTop.document.body.scrollWidth;
        } else {
            xScroll = this.winTop.document.body.offsetWidth;
        }

        if (this.winTop.innerHeight) {
            windowWidth = this.winTop.innerWidth;
        } else if (this.winTop.document.documentElement && this.winTop.document.documentElement.clientHeight) {
            windowWidth = this.winTop.document.documentElement.clientWidth;
        } else if (this.winTop.document.body) {
            windowWidth = this.winTop.document.body.clientWidth;
        }
        
        if (xScroll < windowWidth) {
            return windowWidth;
        } else {
            return xScroll;
        }
    },
    winHeight: function() {
        //return this.winTop.innerHeight || this.winTop.document.documentElement.clientHeight || this.winTop.document.body.clientHeight || 600;
        var yScroll, windowHeight;
        if (this.winTop.innerHeight && this.winTop.scrollMaxY) {
            yScroll = this.winTop.innerHeight + this.winTop.scrollMaxY;
        } else if (this.winTop.document.body.scrollHeight > this.winTop.document.body.offsetHeight) {
            yScroll = this.winTop.document.body.scrollHeight;
        } else {
            yScroll = this.winTop.document.body.offsetHeight;
        }

        if (this.winTop.innerHeight) {
            windowHeight = this.winTop.innerHeight;
        } else if (this.winTop.document.documentElement && this.winTop.document.documentElement.clientHeight) {
            windowHeight = this.winTop.document.documentElement.clientHeight;
        } else if (this.winTop.document.body) {
            windowHeight = this.winTop.document.body.clientHeight;
        }

        if (yScroll < windowHeight) {
            return windowHeight;
        } else {
            return yScroll;
        }
    }

});