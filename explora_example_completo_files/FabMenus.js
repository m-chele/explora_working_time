var FabMenus = Class.create({
    initialize: function(elActives, opts) {
        this.defaultOptions = Object.extend({
            paddingLeftVoce: 0,
            paddingRightVoce: 0,
            idSelectObj: '',
            startDirection: 'left',
            onclickStyleElemActive: { backgroundColor: '#EEE', borderLeft: '1px solid #000000', borderRight: '1px solid #000000', borderTop: '1px solid #000000' }
        }, opts || {});

        this.elActive = $(elActives);
        this.itemCount = 0;
        this.menusName = 'FabMenus' + String((new Date()).getTime());
        this.divMenu = new Element('div', { id: this.menusName });
        this.divMenu.setStyle({ display: 'none', position: 'absolute', top: '0px', left: '0px', border: '1px solid #000000', zIndex: '9999' });
        document.body.insertBefore(this.divMenu, document.body.childNodes[0]);

        this.arrayElems = [this.menusName, this.elActive.identify()];

        this.elActive.addClassName('curPointer');

        var mouseclickHandler = this.mouseclickHandler.bindAsEventListener(this);
        this.elActive.observe('click', mouseclickHandler);
        var mouseclickBodyHandler = this.mouseclickBodyHandler.bindAsEventListener(this);
        $(document.body).observe('click', mouseclickBodyHandler);

        if (this.defaultOptions.idSelectObj != '') {
            var sltObj = $(this.defaultOptions.idSelectObj);
            if (sltObj) {
                $A(sltObj.options).each(function(elm) {
                    elm = $(elm);
                    this.addDropDownMenuItem('', elm.text, '', { imgPath: elm.readAttribute("icoimg"), callbackF: function() { eval(elm.readAttribute("jsfunc")); } });
                } .bind(this));
            }
        }
    },

    addMenuItem: function(ids, text, url, targets, imgPath) {
        var item = new Element('div', { 'id': ids });
        item.setStyle({ backgroundColor: '#EEE', color: '#000', borderBottom: '1px solid #CCC', padding: '5px', whiteSpace: 'nowrap' });
        item.appendChild(new Element('a', { href: url, target: targets })).setStyle({ textDecoration: 'none' }).update('<img src="' + ((imgPath) ? imgPath : "imgs/bquestion.gif") + '" alt="" /> ' + text);

        if (this.defaultOptions.paddingLeftVoce > 0)
            item.setStyle({ paddingLeft: this.defaultOptions.paddingLeftVoce.toString() + 'px' });
        if (this.defaultOptions.paddingRightVoce > 0)
            item.setStyle({ paddingRight: this.defaultOptions.paddingRightVoce.toString() + 'px' });

        this.divMenu.appendChild(item);

        this.arrayElems.push(ids);
        this.itemCount += 1;
    },

    addDropDownMenuItem: function(ids, text, valore, opz) {
        var opzs = Object.extend({
            imgPath: '',
            ctrlSelectedVal: '',
            callbackF: undefined
        }, opz || {});

        var FM_clickopone = (opzs.callbackF == undefined) ? this.mouseclickOperazioneOne.bind(this) : opzs.callbackF;
        var thisClass = this;

        var item = new Element('div', { 'id': ids });
        item.setStyle({ backgroundColor: '#EEE', color: '#000', borderBottom: '1px solid #CCC', padding: '5px', whiteSpace: 'nowrap' });
        item.appendChild(new Element('span', { 'class': 'curPointer' })).setStyle({ textDecoration: 'none' }).update('<img src="' + ((opzs.imgPath) ? opzs.imgPath : "imgs/bquestion.gif") + '" alt="" /> ' + text);
        item.observe('click', function() {
            FM_clickopone(item, valore, opzs.ctrlSelectedVal, { objMenu: thisClass });
        });

        if (this.defaultOptions.paddingLeftVoce > 0)
            item.setStyle({ paddingLeft: this.defaultOptions.paddingLeftVoce.toString() + 'px' });
        if (this.defaultOptions.paddingRightVoce > 0)
            item.setStyle({ paddingRight: this.defaultOptions.paddingRightVoce.toString() + 'px' });

        this.divMenu.appendChild(item);

        this.arrayElems.push(ids);
        this.itemCount += 1;
    },

    mouseclickHandler: function(e) {
        var el;
        if (Object.isElement(e))
            el = $(e);
        else
            el = e.element();

        var vpDim = document.viewport.getDimensions();
        var vpScrollOff = document.viewport.getScrollOffsets();
        var _offset = el.cumulativeOffset();
        var _offsetScroll = [0, 0]; //cell.cumulativeScrollOffset();
        var _x = _offset[0] + _offsetScroll[0] + 1;
        var _y = _offset[1] + _offsetScroll[1] + el.getHeight() + 2;

        if (this.defaultOptions.startDirection == 'right') {
            _x = _offset[0] + _offsetScroll[0] - this.divMenu.getWidth() + el.getWidth();
            _y = _offset[1] + _offsetScroll[1] + el.getHeight() + 2;
        }

        if ((_x + this.divMenu.getWidth()) > (vpDim.width + vpScrollOff.left))
            _x -= this.divMenu.getWidth() - el.getWidth();
        if ((_y + this.divMenu.getHeight()) > (vpDim.height + vpScrollOff.top))
            _y -= this.divMenu.getHeight() + el.getHeight() + 8;

        if (this.defaultOptions.startDirection == 'right') {
            if ((_x - this.divMenu.getWidth()) < 0)
                _x += this.divMenu.getWidth();
        }

        if (this.divMenu.getStyle('display').toString() == 'none') {
            if (this.elActive.up().tagName.toLowerCase() == 'span') this.elActive.up().setStyle(this.defaultOptions.onclickStyleElemActive);
            this.divMenu.setStyle({ top: String(_y) + 'px', left: String(_x) + 'px' });
            //this.divMenu.show();
            this.divMenu.appear({ duration: 0.2 });
        }
    },

    mouseclickBodyHandler: function(e) {
        var el = e.element();
        if (this.arrayElems.indexOf(el.identify()) == -1) {
            //this.divMenu.hide();
            this.close();
            try {
                if (this.elActive.up().tagName.toLowerCase() == 'span') this.elActive.up().setStyle({ backgroundColor: '', border: '' });
            } catch (oex) { ; }
        }
    },

    mouseclickOperazioneOne: function(el, val, ctrl) {
        this.elActive.writeAttribute('src', el.down(1).readAttribute('src'));

        if (ctrl != '') {
            var ctrlE = $(ctrl);
            if (!ctrlE)
                this.elActive.insert({ after: '<input type="hidden" id="' + ctrl + '" name="' + ctrl + '" value="' + val + '" />' });
            else
                ctrlE.value = val;
        }
    },

    close: function() {
        this.divMenu.fade({ duration: 0.2 });
    }

});