/* global Z */
// Default TabStrip
if (typeof Z == 'undefined') {
  Z = {};
}
Z.Tabs = function(opts) {
  /*
  * automanagedtl
  * container
  * expandcollapse
  * useseparator
  * useGlobals
  * contents
  * swipe
  * wizard
  * boxtabs
  * tabstrip_class
  */
  var tabstripContainer;

  this.registeredName = (function() {
    var k = LibJavascript.AlfaKeyGen(9);
    while (!IsA(window[k], 'U')) {
      k = LibJavascript.AlfaKeyGen(9);
    }
    return k;
  })();

  window[this.registeredName] = this;
  var Ctrl = window.Ctrl || function(c_id) {
    return document.getElementById(c_id);
  };
  var _this = this;
  var wizard = opts.wizard;
  var boxtabs = opts.boxtabs;
  var styleVarsPrefix = 'form';
  if (boxtabs) {
    styleVarsPrefix = 'box';
  }
  var clonename = opts.tabstrip_class || '';
  var autoSelect = GetStyleVariable(styleVarsPrefix + 'TabAutoSelect', false, clonename);
  var container = typeof opts.container == 'string' ? Ctrl(opts.container) : opts.container;
  container.className = wizard ?
                        (clonename || 'WizardTabstrip' ) + ' wizardWrapper ' :
                        boxtabs ?
                          (clonename || 'BoxTabstrip' ) + ' boxtabsWrapper ' :
                          (clonename || 'Tabstrip' ) + ' tabWrapper'

                      ;


  var defaultImgsPath = '../images/defaults/';
  var imgsCached = { // url immagini utilizzate
    buttonLeft: GetStyleVariable(styleVarsPrefix + 'TabLeftButton', defaultImgsPath + 'tab_strip_button_left.gif', clonename),
    buttonLeftDisabled: GetStyleVariable(styleVarsPrefix + 'TabLeftDisButton', defaultImgsPath + 'tab_strip_button_left_dis.gif', clonename),
    buttonRight: GetStyleVariable(styleVarsPrefix + 'TabRightButton', defaultImgsPath + 'tab_strip_button_right.gif', clonename),
    buttonRightDisabled: GetStyleVariable(styleVarsPrefix + 'TabRightDisButton', defaultImgsPath + 'tab_strip_button_right_dis.gif', clonename),
    bar: GetStyleVariable(styleVarsPrefix + 'TabBar', '', clonename),
    left: GetStyleVariable(styleVarsPrefix + 'TabLeft', defaultImgsPath + 'tab_pagebtnleft.gif', clonename),
    right: GetStyleVariable(styleVarsPrefix + 'TabRight', defaultImgsPath + 'tab_pagebtnright.gif', clonename),
    left_sel: GetStyleVariable(styleVarsPrefix + 'TabLeftSel', defaultImgsPath + 'tab_pagebtnleftevid.gif', clonename),
    center_sel: GetStyleVariable(styleVarsPrefix + 'TabCenterSel', defaultImgsPath + 'tab_pagebtncenterevid.gif', clonename),
    right_sel: GetStyleVariable(styleVarsPrefix + 'TabRightSel', defaultImgsPath + 'tab_pagebtnrightevid.gif', clonename),
    center: GetStyleVariable(styleVarsPrefix + 'TabCenter', defaultImgsPath + 'tab_pagebtncenter.gif', clonename),
    sep: GetStyleVariable(styleVarsPrefix + 'TabSeparator', '', clonename),
    expand: GetStyleVariable(styleVarsPrefix + 'TabExpand', defaultImgsPath + 'tab_expand.gif', clonename),
    collapse: GetStyleVariable(styleVarsPrefix + 'TabCollapse', defaultImgsPath + 'tab_collapse.gif', clonename)
  };


  function AppySliders() {
    var div = container.getElementsByClassName('tab_item');
    if (div.length > 1) {
      div = div[div.length - 1];
      if (div.offsetLeft + div.offsetWidth > tabstripContainer.offsetWidth) {
        _this.showSlider(true);
      } else {
        _this.showSlider(false);
      }
    }
  }
  LibJavascript.Events.addEvent(window, 'load', function() {
    AppySliders();
    LibJavascript.Events.addEvent(window, 'resize', AppySliders);
  });

  var expandcollapse = opts.expandcollapse || false;
  var expandTitle = Translate('MSG_EXPAND');
  if (expandTitle == 'MSG_EXPAND') {
    expandTitle = 'Espandi';
  }
  var collapseTitle = Translate('MSG_COLLAPSE');
  if (collapseTitle == 'MSG_COLLAPSE') {
    collapseTitle = 'Collassa';
  }
  var useseparator = wizard || opts.useseparator || false;
  var useGlobals = !('useGlobals' in opts) || opts.useGlobals;
  var tabs = {};
  opts.contents = opts.contents || [];
  var tabsList = [];
  var _IDs = {
    container: this.registeredName + '_TABSCONTAINER'
  };
  var _tNameSelected;
  var savedRowPos = 0;
  // forzo useStyleColor in caso di wizard
  var useStyleColor = GetStyleVariable(styleVarsPrefix + 'TabUseGradient', false, clonename);
  useStyleColor = wizard ? true : useStyleColor;
  function _Tab (tab, renderLeft, renderRight) {
    var tabsManager = _this;
    this.body = IsA(tab.element, 'C') ? Ctrl(tab.element) : tab.element;
    this.name = tab.name;
    this.layer_to_tab = tab.layer_to_tab;// riferimento al modal layer parcheggiato
    this.caption = tab.caption || tab.name;
    this.css_class = tab.css_class || '';
    var _thisTab = this;
    var _IDs = {};
    _IDs.tab = tabsManager.registeredName + '_' + this.name + '_TAB';
    _IDs.tab_item = tabsManager.registeredName + '_' + this.name + '_TAB_ITEM';
    var _HREFs = { tab_enabled: 'javascript:' + (autoSelect ? 'void(0);' : tabsManager.registeredName + '.Select("' + _thisTab.name + '");'),
      tab_disabled: 'javascript:void(0);',
      expand_enabled: 'javascript:' + (autoSelect ? 'void(0);' : tabsManager.registeredName + '.Expand("' + _thisTab.name + '");'),
      expand_disabled: 'javascript:void(0);',
      collapse_enabled: 'javascript:' + (autoSelect ? 'void(0);' : tabsManager.registeredName + '.Collapse("' + _thisTab.name + '");'),
      collapse_disabled: 'javascript:void(0);',
      close: 'javascript:' + tabsManager.registeredName + '.removeTab(\"' + _thisTab.name + '\");'
                // close:'javascript:deleteTab(\"'+_thisTab.name+'\");'
    };
    var _innerHTML;
    var _selected = false;
    var _collapsed = true;
    var _disabled = false;
    var _hidden = false;
    var _active = false;

    try {
      if (typeof tab.enable != 'undefined') {
        _disabled = !eval(tab.enable);
      }
    } catch (e) {}

    try {
      if (typeof tab.hidden != 'undefined') {
        _hidden = eval(tab.hidden);
      }
    } catch (e) {}

    var _onExpand = tab.onExpand;

    this.getInnerHTML = function() {
      return _innerHTML;
    };

    var initStrip = function() {
      _IDs.imgleft = _IDs.tab + '_pagebtnleft';
      _IDs.imgcenter = _IDs.tab + '_pagebtncenter';
      _IDs.imgright = _IDs.tab + '_pagebtnright';
      _IDs.imgsep = _IDs.tab + '_pagebtnsep';
      _IDs.span = _IDs.tab + '_pagebutton';
      _IDs.hreftab = _IDs.tab + '_href';
      _IDs.expcoll = _IDs.tab + '_expandcollapse';
      _IDs.expcollimg = _IDs.tab + '_expandcollapseimg';
      _IDs.expcollhref = _IDs.tab + '_expandcollapsehref';
      _innerHTML = '<div id=\'' + _IDs.tab + '\' class=\'tab' + ( useStyleColor ? ' useStyleColor' : '' ) + '\' style=\'display:' + (_hidden ? 'none' : '""') + '\' ' + ( useStyleColor ? 'class=\'useStyleColor\'' : 'class=\'useStyleColor\'' ) + '>';
      if (!useseparator || renderLeft) {
        _innerHTML += '<div id=\'' + _IDs.imgleft + '\'';
        if (!useStyleColor) {
          _innerHTML += 'style=\'background-image:url(' + imgsCached.left + ');background-repeat:no-repeat;\' ';
        }
        _innerHTML += 'class=\'tab_border tab_border_left\'></div>';
      } else {

        // _innerHTML +="<div id='"+_IDs.imgsep+"' ";
        // if(!useStyleColor) {
          // _innerHTML +="style='background-image:url("+imgsCached.sep+" );background-repeat:no-repeat;' ";
        // }
        // _innerHTML +="class='tab_sep'></div>"

      }
      if ( wizard ) {
        _innerHTML += '<div class=\'tab_wizard_number\'>' + (tabsList.length + 1) + '</div>';
      }
      _innerHTML += '<div id=\'' + _IDs.imgcenter + '\' ';
      if (!useStyleColor) {
        _innerHTML += 'style=\'background-image:url(' + imgsCached.center + ');background-repeat:repeat-x;\' ';
      }
      _innerHTML += 'class=\'tab_content\'>' +
                  '<div class=\'tab_center_text\'>' +
                  '<span id=\'' + _IDs.span + '\' class=\'tab_span\' >' +
                   '<a id=\'' + _IDs.hreftab + '\'  style=\'outline:none;\'  href=\'' + _HREFs['tab_' + (_disabled ? 'disabled' : 'enabled')] + '\' ' + (_disabled ? ' disabled=\'' + _disabled + '\'' : '') + '>' +
                      _thisTab.caption +
                    '</a>';
      if (tab.appended && !tab.layer_to_tab) {
        _innerHTML += '<a class=\'tab_close\' href=\'' + _HREFs.close + '\'></a>';
      }
      if (tab.appended && tab.layer_to_tab) {
        _innerHTML += '<div class=\'tab_modallayer\'></div>';
      }
      _innerHTML += '</span></div>';
      if (expandcollapse) {
        _innerHTML += '<div id=\'' + _IDs.expcoll + '\' class=\'tab_expcoll_box\'>' +
                      '<a id=\'' + _IDs.expcollhref + '\'  title=\'' + (_collapsed ? expandTitle : collapseTitle) + '\' style=\'outline:none;\' href=\'' + _HREFs[ (_collapsed ? 'expand' : 'collapse') + '_' + (_disabled ? 'disabled' : 'enabled') ] + '\'' + (_disabled ? ' disabled=\'' + _disabled + '\'' : '') + '>' +

        // "<div id='"+_IDs.expcollimg+"' ";
        // if(!useStyleColor) {
          // _innerHTML +="style='background-image:url("+imgsCached.expand+" );background-repeat:no-repeat;' ";
        // }
        // _innerHTML+="class='tab_expcoll_img tab_exp_img' ></div>"+

        LibJavascript.DOM.buildIcon({
          type: 'div',
          id: _IDs.expcollimg,
          className: 'tab_expcoll_img ' + (_collapsed ? 'tab_exp_img' : 'tab_coll_img'),
          image: _collapsed ? imgsCached.expand : imgsCached.collapse,
          image_attr: 'no-repeat'
        }) +


                      '</a>' +
                    '</div>';
      }
      _innerHTML += '</div>';
      if ( renderRight || !useseparator) {
        _innerHTML += '<div id=\'' + _IDs.imgright + '\' ';
        if (!useStyleColor) {
          _innerHTML += 'style=\' background-image:url(' + imgsCached.right + ');background-repeat:no-repeat;\' ';
        }
        _innerHTML += 'class=\'tab_border tab_border_right\'></div>';
      } else {
        _innerHTML += '<div id=\'' + _IDs.imgsep + '\' ';
        if (!useStyleColor) {
          _innerHTML += 'style=\'background-image:url(' + imgsCached.sep + ');background-repeat:no-repeat;\' ';
        }
        _innerHTML += 'class=\'tab_sep\'></div>';
      }
      _innerHTML += '</div>';
    };

    this.Select = function (onlyActive) {
      var portlet, pagelet_group, containerObj, groupName;
      containerObj = window[container.id.substring( 0, container.id.indexOf( '_' ) ) ];
      if ( containerObj ) {
        if ( containerObj.portletname ) {
          portlet = containerObj;
        } else {
          groupName = container.id.substring( container.id.indexOf('_') + 1, container.id.indexOf( '_tabs_' ) );
          pagelet_group = containerObj[groupName];
        }
      }
      if ( !_selected ) {
        if ( useGlobals && typeof NotifyEvent != 'undefined' ) {
          NotifyEvent( this.name + ' show' );
        }
        if ( !Empty( portlet ) && typeof portlet.NotifyEvent != 'undefined' && !onlyActive ) {
          portlet.NotifyEvent( this.name + ' show' );
        }
        if ( !Empty( containerObj ) && typeof containerObj.NotifyEvent != 'undefined' && !onlyActive ) {
          containerObj.NotifyEvent( this.name + ' show' );
        }
      }
      if ( !_selected ) {
        this.TurnOn();
        this.Expand();
        _selected = true;
        if ( useGlobals && window.m_cSelectedPage ) {
          window.m_cSelectedPage = this.name;
        }
        if ( useGlobals && window.PageOpened ) {
          window.PageOpened( this.name, arguments[0] );
        }
        if ( !Empty( portlet ) && typeof portlet.PageOpened != 'undefined' && !onlyActive ) {
          portlet.PageOpened(this.name, arguments[0]);
          if (portlet.Steps && portlet.Steps.length > 0) {
            portlet.queueAdjustHeight(50);
          }
        }
        if ( !Empty( pagelet_group ) && typeof pagelet_group.PageOpened != 'undefined' && !onlyActive ) {
          pagelet_group.PageOpened(this.name, arguments[0]);
        }
        if ( useGlobals && window.CalculateAndResizeEntityHeight ) {
          window.CalculateAndResizeEntityHeight();
        }
        if ( typeof adjustWidthAndHeight != 'undefined' ) {
          window.adjustWidthAndHeight( false );
        }
      }
    };

    this.TurnOn = function () {
      var c,
        imgcenter = document.getElementById( _IDs.imgcenter );
      if (/* eslint-disable */ c = document.getElementById( _IDs.imgleft ) /* eslint-enable */) {
        if ( !useStyleColor ) {
          c.style.backgroundImage = 'url(' + imgsCached.left_sel + ')';
        }
      }
      if ( !useStyleColor ) {
        imgcenter.style.backgroundImage = 'url(' + imgsCached.center_sel + ')';
      }
      if ( ( c = document.getElementById( _IDs.imgright ) ) && !useStyleColor ) {
        c.style.backgroundImage = 'url(' + imgsCached.right_sel + ')';
      }
      LibJavascript.CssClassNameUtils.addClass( _IDs.tab_item, 'selected');
      LibJavascript.CssClassNameUtils.addClass( _IDs.tab_item, 'actived' );
    };
    this.Active = function() {
      var c;
      _active = true;
      LibJavascript.CssClassNameUtils.addClass( _IDs.tab_item, 'actived' );
      if (/* eslint-disable */ c = document.getElementById( _IDs.imgsep ) /* eslint-enable */) {
        LibJavascript.CssClassNameUtils.removeClass( c, 'tab_sep_between_active_deactive' );
      }
    };
    this.Deselect = function(onlyActive, wizarddeselect) {
      var portlet = window[container.id.substring(0, container.id.indexOf('_'))];
      if (_selected) {
        if (useGlobals && typeof NotifyEvent != 'undefined' && !onlyActive) {
          NotifyEvent(this.name + ' hide');
        }
        if (!Empty(portlet) && typeof portlet.NotifyEvent != 'undefined' && !onlyActive) {
          portlet.NotifyEvent(this.name + ' hide');
        }
        if ( document.getElementById(_IDs.imgcenter) != null) {
          if ( !wizarddeselect ) {
            this.TurnOff();
            _selected = false;
          }
          if (!onlyActive) {
            this.Collapse();
          }
          if (window.adjustWidthAndHeight && !onlyActive) {
            window.adjustWidthAndHeight(false);
          }
        }
        if (_tNameSelected == this.name ) {
          _tNameSelected = null;
        }
      }
    };

    this.Deactive = function(onlyActive) {
      LibJavascript.CssClassNameUtils.removeClass( _IDs.tab_item, 'actived' );
      var c;
      _active = false;
      if (/* eslint-disable */ c = document.getElementById( _IDs.imgsep ) /* eslint-enable */) {
        LibJavascript.CssClassNameUtils.addClass( c, 'tab_sep_between_active_deactive' );
      }
    };

    this.TurnOff = function () {
      var c,
        imgcenter = document.getElementById( _IDs.imgcenter );
      if (/* eslint-disable */ c = document.getElementById( _IDs.imgleft ) /* eslint-enable */) {
        if ( !useStyleColor ) {
          c.style.backgroundImage = 'url(' + imgsCached.left + ')';
        }
      }
      if ( !useStyleColor ) {
        imgcenter.style.backgroundImage = 'url(' + imgsCached.center + ')';
      }
      if ( ( c = document.getElementById( _IDs.imgright ) ) && !useStyleColor ) {
        c.style.backgroundImage = 'url(' + imgsCached.right + ')';
      }
      LibJavascript.CssClassNameUtils.removeClass( _IDs.tab_item, 'selected' );
    };

    this.setDeactiveSeparator = function() {
      var c;
      if (/* eslint-disable */ c = document.getElementById( _IDs.imgsep ) /* eslint-enable */) {
        LibJavascript.CssClassNameUtils.addClass( c, 'tab_sep_between_active_deactive' );
      }
    };
    this.setActiveSeparator = function() {
      var c;
      if (/* eslint-disable */ c = document.getElementById( _IDs.imgsep ) /* eslint-enable */) {
        LibJavascript.CssClassNameUtils.removeClass( c, 'tab_sep_between_active_deactive' );
      }
    };

    initStrip();
    this.body.style.display = 'none';

    this.Collapse = function() {
      if (!_collapsed) {
        var expcoll;
        if (/* eslint-disable */ expcoll = document.getElementById(_IDs.expcollhref) /* eslint-enable */) {
          expcoll = document.getElementById(_IDs.expcollhref);
          expcoll.href = expcoll.href = _HREFs.expand_enabled;
          expcoll.title = expandTitle;
          expcoll.innerHTML = LibJavascript.DOM.buildIcon({
            type: 'div',
            id: _IDs.expcollimg,
            className: 'tab_expcoll_img tab_exp_img',
            image: imgsCached.expand,
            image_attr: 'no-repeat'
          });
        }
        this.body.style.display = 'none';
        _collapsed = true;
        if (useGlobals && window.CalculateAndResizeEntityHeight) {
          window.CalculateAndResizeEntityHeight();
        }
        if (window.adjustWidthAndHeight) {
          window.adjustWidthAndHeight(false);
        }
      }
    };

    this.Expand = function() {
      if (_collapsed) {
        var expcoll;
        if (/* eslint-disable */ expcoll = document.getElementById(_IDs.expcollhref) /* eslint-enable */) {
          expcoll = document.getElementById(_IDs.expcollhref);
          expcoll.href = expcoll.href = _HREFs.collapse_enabled;
          expcoll.title = collapseTitle;
          expcoll.innerHTML = LibJavascript.DOM.buildIcon({
            type: 'div',
            id: _IDs.expcollimg,
            className: 'tab_expcoll_img tab_coll_img',
            image: imgsCached.collapse,
            image_attr: 'no-repeat'
          });
        }
        this.body.style.display = '';
        if (this.body.style.height && parseInt(Strtran(this.body.style.height, '%', 'px')) == 0 ) {
          this.body.style.height = '100%';
        }
        _collapsed = false;
        if (_onExpand) {
            // callback di apertura
          _onExpand();
        }
        if (useGlobals && window.CalculateAndResizeEntityHeight) {
          window.CalculateAndResizeEntityHeight();
        }
        if (window.adjustWidthAndHeight) {
          window.adjustWidthAndHeight(false);
        }
      }
    };

    this.IsExpanded = function() {
      return !this.IsCollapsed();
    };

    this.IsCollapsed = function() {
      return _collapsed;
    };
    this.Disable = function(disable) {
      try {
        if (typeof disable == 'undefined') {
          if (typeof tab.enable != 'undefined') {
            disable = !eval(tab.enable);
          } else {
            disable = _disabled;
          } // se non passo un valore e non e' stato impostato un enable iniziale lascio la disabilitazione corrente
        }
      } catch (e) {
        disable = false;
      }
      if ( disable ) {
        this.Deactive();
      } else {
        this.Active();
      }
      if (_disabled == disable) {
        return false;
      }
      var lnk = Ctrl(_IDs.hreftab);
      lnk.href = _HREFs['tab_' + (disable ? 'disabled' : 'enabled')];
      lnk.disabled = disable;
      if (expandcollapse) {
        lnk = Ctrl(_IDs.expcollhref);
        lnk.href = _HREFs[ (_collapsed ? 'expand' : 'collapse') + '_' + (disable ? 'disabled' : 'enabled') ];
        lnk.disabled = disable;
        lnk.title = _collapsed ? expandTitle : collapseTitle;
      }
      var e, i, o;
      /* eslint-disable */
      if (e = this.body.getElementsByTagName('INPUT')) {
        for (i = 0; o = e[i++]; o.disabled = disable) {

        }
      }
      if (e = this.body.getElementsByTagName('SELECT')) {
        for (i = 0; o = e[i++]; o.disabled = disable) {

        }
      }
      if (e = this.body.getElementsByTagName('A')) {
        for (i = 0; o = e[i++]; o.disabled = disable) {

        }
      }
      var sd = window.SetDisabled;
      if (e = this.body.getElementsByTagName('BUTTON')) {
        for (i = 0; o = e[i++]; sd ? sd(o, disable) : o.disabled = disable) {

        }
      }
      if (e = this.body.getElementsByTagName('TEXTAREA')) {
        for (i = 0; o = e[i++]; o.readOnly = disable) {

        }
      }
      /* eslint-enable */
      _disabled = disable;
      return true;
    };
    this.SetCaption = function(txt) {
      Ctrl(_IDs.hreftab).innerText = txt;
    };
    this.IsDisabled = function() {
      return _disabled;
    };

    this.IsActived = function() {
      return _active;
    };

    this.Hide = function(hide) {
      try {
        if (typeof hide == 'undefined') {
          if (typeof tab.hidden != 'undefined') {
            hide = eval(tab.hidden);
          } else {
            hide = _hidden;
          } // se non passo un valore o non e' stato impostato un hidden iniziale lascio la visualizzazione corrente
        }
      } catch (e) {
        hide = false;
      }
      Ctrl(_IDs.tab).style.display = hide ? 'none' : '';
      _hidden = hide;
    };

    this.Display = function(display) {
      this.Hide(!display);
    };

    this.IsHidden = function() {
      _hidden = Ctrl(_IDs.tab).style.display == 'none';
      return _hidden;
    };

    this.SetCanCollapse = function() {
      Ctrl(_IDs.expcoll).style.display = expandcollapse ? '' : 'none';
    };

    this.GetID = function() {
      return _IDs.tab;
    };
    // la gestione del separatore avviene nel tab a sx invece del tab a destra come accadeva prima
    this.RemoveRight = function() {
      if (useseparator) {
        var c;
        if (/* eslint-disable */ c = document.getElementById(_IDs.imgright) /* eslint-enable */) {
          c.id = _IDs.imgsep;
          c.className = 'tab_sep';
          if (!useStyleColor) {
            c.style.backgroundImage = 'url(' + imgsCached.sep + ')';
          }
        }
      }
    };
    this.IsSelected = function() {
      return _selected;
    };
  }
  _Tab.prototype = new Object;
  _Tab.prototype.constructor = _Tab;

  function _JunctTab (tab, renderLeft, renderRight) {
    var _tab;
    tab.element = document.createElement( 'div' ); // dummy
    _tab = new _Tab( tab, renderLeft, renderRight );
    _tab.drivenTabs_select = tab.drivenTabs_select || [];
    _tab.drivenTabs_deselect = tab.drivenTabs_deselect || [];
    _tab.drivenTabs_turnoff = tab.drivenTabs_turnoff || [];
    _tab.Select = function (onlyActive) {
      var i, driven, tab,
        idx = 0;
      for ( i = 0; i < tabsList.length; i++ ) {
        tab = tabs[tabsList[i]];
        if ( tab ) {
          if ( this.drivenTabs_select.indexOf( tab.name ) > -1 ) {
            // if ( !tab.IsExpanded() ) {
            tab.Select( onlyActive );
            // }
          } else if ( this.drivenTabs_deselect.indexOf( tab.name ) > -1 ) {
            tab.Deselect( onlyActive );
          } else if ( this.drivenTabs_turnoff.indexOf( tab.name ) > -1 ) {
            tab.TurnOff();
          } else {
            // tab.Deselect( onlyActive );
          }
        }
      }
      this.TurnOn();
      if ( useGlobals && 'm_cSelectedPage' in window ) {
        window.m_cSelectedPage = this.name;
      }
    };
    _tab.Deselect = function (onlyActive) {
      this.TurnOff();
    };
    return _tab;
  }

  this.AddTab = function(tab) {
    if ( this.Exists( tab.name ) ) {
      throw new Error( 'Cannot add tab: \'' + tab.name + '\' already present.' );
    }
    if ( !( 'body' in tab ) ) {
      tab.element = IsA(tab.element, 'C') ? Ctrl(tab.element) : tab.element;
      if ( !tab.element ) {
        return;
      }
      tab = new _Tab(tab, tabsList.length == 0, true);
    }
    var div = document.createElement('div');
    div.innerHTML = tab.getInnerHTML();
    div.className = 'tab_item' + (tab.css_class ? ' ' + tab.css_class : '');
    div.id = this.registeredName + '_' + tab.name + '_TAB_ITEM';
    document.getElementById(_IDs.container).appendChild(div);
    tabs[tab.name] = tab;
    if (tabsList.length > 0) {
      tabs[tabsList[tabsList.length - 1]].RemoveRight();
    }
    tabsList.push(tab.name);
    // ogni volta che aggiungo un tab verifico la lunghezza totale del tabstrip
    if ( div.offsetLeft + div.offsetWidth > document.getElementById(_IDs.container + '_tabs_mask').offsetWidth) {
      this.showSlider(true);
    }
  };

  this.AddTabs = function (contents) {
    var i, tab, tab_2, hasMorePages;
    for ( i = 0; i < contents.length; i++ ) {
      tab = contents[i];
      tab.name = tab.name.replace(/[^a-zA-Z_0-9]/g, '');
      if ( opts.automanagedtl && i == 0 ) {
        if ( hasMobileBody( tab.element ) ) {
          i = i + 1;
          tab_2 = contents[i];
          hasMorePages = i < contents.length;
          addMobileTabs.call( this, tab, tab_2, hasMorePages );
        } else if ( contents.length > 1 ) {
          this.AddTab( tab );
        } else {
          container.style.display = 'none';
        }
      } else {
        this.AddTab( tab );
      }
    }
  };

  function hasMobileBody (page_1) {
    var mBody = mobileBody( page_1 );
    return mBody && LibJavascript.CssClassNameUtils.hasClass( mBody.parentElement, 'SPPage');
  }
  function mobileBody (page_1) {
    var grid_s = Ctrl( page_1 || 'page_1' ).getElementsByClassName( 'SPSectionGrid' );
    if ( grid_s ) {
      return grid_s[0];
    }
  }
  function mobileHeader (page_1) {
    var mBody = mobileBody( page_1 )
      , headerLastElement = mBody.previousElementSibling
      , segmentedHeader = headerLastElement && headerLastElement.previousElementSibling
      , headerContainer = segmentedHeader ? document.createElement('div') : headerLastElement
      ;
    if ( segmentedHeader ) {
      while ( mBody.previousElementSibling ) {
        if ( headerContainer.children.length ) {
          headerContainer.insertBefore(
            mBody.parentElement.removeChild( mBody.previousElementSibling )
          , headerContainer.children[0]
          );
        } else {
          headerContainer.appendChild(
            mBody.parentElement.removeChild( mBody.previousElementSibling )
          );
        }
      }
      mBody.parentElement.insertBefore(
        headerContainer
      , mBody.parentElement.children[0]
      );
    }
    return headerContainer;
  }
  function mobileFooter (page_1) {
    var mBody = mobileBody( page_1 )
      , footerFirstElement = mBody.nextElementSibling
      , segmentedFooter = footerFirstElement && footerFirstElement.nextElementSibling
      , footerContainer = segmentedFooter ? document.createElement('div') : footerFirstElement
      ;
    if ( segmentedFooter ) {
      while ( mBody.nextElementSibling ) {
        footerContainer.appendChild(
          mBody.parentElement.removeChild( mBody.nextElementSibling )
        );
      }
      mBody.parentElement.appendChild( footerContainer );
    }
    return footerContainer;
  }
  function addMobileTabs (tab_page_1 /* {name:"...", element:"...", caption:"..."} */, tab_page_2, hasMorePages ) {
    var headerTab, bodyTab, footerTab, page_2_tab
      , headerJunctTab, bodyJunctTab
      , headerContainer = mobileHeader( tab_page_1.element )
      , bodyContainer = mobileBody( tab_page_1.element )
      , footerContainer = mobileFooter( tab_page_1.element )
      ;

    // Crea oggetti Tab
    // Testata
    if ( headerContainer ) {
      headerTab = new _Tab( /* tab, renderLeft, renderRight*/
        { name: 'header'
        , element: headerContainer
        , caption: Translate( 'MSG_MD_TAB_HEADER' )
        }
      , true /* renderLeft */
      , true /* renderRight */
      );
    }
    // Righe
    if ( bodyContainer ) {
      bodyTab = new _Tab( /* tab, renderLeft, renderRight*/
        { name: 'body'
        , element: bodyContainer
        , caption: Translate( 'MSG_MD_TAB_ROWS' )
        }
      , !headerContainer /* renderLeft */
      , true /* renderRight */
      );
    }
    // Piede
    if ( footerContainer ) {
      footerTab = new _Tab( /* tab, renderLeft, renderRight*/
        { name: 'footer'
        , element: footerContainer
        , caption: Translate( 'MSG_MD_TAB_FOOTER' )
        }
      , !headerContainer && !bodyContainer /* renderLeft */
      , true /* renderRight */
      );
    }
    // Page_2
    if ( tab_page_2 ) {
      page_2_tab = new _Tab( tab_page_2 /* tab */
      , false /* renderLeft */
      , true /* renderRight */
      );
    }

    // Crea i tab speciali (+) tra i tab creati
    // + [Header+(Body|Footer) ]
    if ( headerTab && ( bodyTab || footerTab ) ) { // +
      headerJunctTab = new _JunctTab( /* tab, renderLeft, renderRight*/
        { name: 'headerand' + ( bodyTab ? 'body' : 'footer' )
        , caption: '&nbsp;+&nbsp;'
        , drivenTabs_select: [ headerTab.name, (bodyTab || footerTab).name ]
        , drivenTabs_deselect: footerTab ? [ footerTab.name ] : []
        , drivenTabs_turnoff: footerTab ? [ 'headerandbodyandfooter' ] : []
        }
      , false /* renderLeft */
      , true /* renderRight */
      );
    }
    if ( headerTab && bodyTab && footerTab ) { // + [ Header+Body+Footer ]
      bodyJunctTab = new _JunctTab( /* tab, renderLeft, renderRight*/
        { name: 'headerandbodyandfooter'
        , caption: '&nbsp;+&nbsp;'
        , drivenTabs_select: [ headerJunctTab.name, footerTab.name ]
        }
      , false /* renderLeft */
      , true /* renderRight */
      );
    } else if ( bodyTab && footerTab ) { // + [ Body+Footer ]
      bodyJunctTab = new _JunctTab( /* tab, renderLeft, renderRight*/
        { name: 'bodyandfooter'
        , caption: '&nbsp;+&nbsp;'
        , drivenTabs_select: [ bodyTab.name, footerTab.name ]
        }
      , false /* renderLeft */
      , true /* renderRight */
      );
    }

    // Aggiunta tabs
    if ( headerTab ) {
      this.AddTab( headerTab );
    }
    if ( headerJunctTab ) {
      this.AddTab( headerJunctTab );
    }
    if ( bodyTab ) {
      this.AddTab( bodyTab );
    }
    if ( bodyJunctTab ) {
      this.AddTab( bodyJunctTab );
    }
    if ( footerTab ) {
      this.AddTab( footerTab );
    }
    if ( page_2_tab ) {
      this.AddTab( page_2_tab );
    }
  }

  this.removeTab = function(name) {
    var pagelet_group;
    var containerObj = window[container.id.substring( 0, container.id.indexOf( '_' ) ) ];
    var groupName = container.id.substring( container.id.indexOf('_') + 1, container.id.indexOf( '_tabs_' ) );
    var idxClose = tabsList.indexOf(name);
    var idxSelected = tabsList.indexOf(_tNameSelected);
    pagelet_group = containerObj[groupName];
    delete tabs[name];
    tabsList.splice(tabsList.indexOf(name), 1);
    this.tabList.splice(this.tabList.indexOf(name), 1);
    // _tNameSelected = null;
    if (pagelet_group) {
      pagelet_group.tabs.splice(pagelet_group.tabs.indexOf(name), 1);
    }
    var cnt_content = document.getElementById(name);
    if (!cnt_content) {
      return;
    }
    cnt_content.parentNode.removeChild(cnt_content);
    var tabHtml = document.getElementById(this.registeredName + '_' + name + '_TAB_ITEM');
    tabHtml.parentNode.removeChild(tabHtml);
    var firstTabId;
    var found;
    for (var t = 0; t < this.tabList.length; t++) {
      if (this.tabList[t] == name) {
        this.tabList[t] = null;
      }
      if (!found) {
        firstTabId = this.tabList[t];
      }
      if (firstTabId != null) {
        found = true;
      }
    }
    if (firstTabId != null && idxClose == idxSelected) {
      this.Select(firstTabId);
    }
  };

  this.isTabOpened = function(tId) {
    return document.getElementById(tId).style.display != 'none';
  };
  /* ritorna array dei tab selezionati. Privata per non esporre i tab */
  function getSelectedTabs () {
    return tabsList.map( function tabName2tabObj (tabName) { /* [nomi] -> [obj tabs] */
      return tabs[tabName];
    } ).filter( function tabObj2tabObjSelected (tab) { /* [obj tabs] -> [obj tabs selected] */
      return tab.IsSelected();
    } );
  }

  /* ritorna array di elementi html relativi ai contenuti dei tab selezionati */
  this.GetSelectedTabsBody = function () {
    return getSelectedTabs().map( function tabObjSelected2htmlSelcted(selectedTab) { /* [obj tabs selected] -> [html element selected] */
      return selectedTab.body;
    } );
  };

  /* ritorna array di nomi dei tab selezionati */
  this.GetSelectedTabId = function () {
    return getSelectedTabs().map( function tabObjSelected2htmlSelcted(selectedTab) { /* [obj tabs selected] -> [name selected] */
      return selectedTab.name;
    } );
  };
  var oldidx;
  this.Select = function (tabName, onlyActive) {
    tabName = tabName.replace(/[^a-zA-Z_0-9]/g, '');
    // se e' unico selezionato esco
    if (tabName == _tNameSelected) {
      if (boxtabs && tabs[tabName]) {
        tabs[tabName].Deselect( onlyActive );
      }
      return;
    }
    var oldSelected = _tNameSelected;
    var i, tab, idx,
      tabToSelect = [],
      tabToDisable = [],
      portlet, pagelet_group, groupName, containerObj, pageletId;
    // cerca di validare i ctrls di pagina
    idx = tabsList.indexOf(tabName);
    containerObj = window[container.id.substring( 0, container.id.indexOf( '_' ) ) ];
    if ( containerObj ) {
      if ( containerObj.portletname ) {
        portlet = containerObj;
      } else {
        pageletId = container.id.substring( 0, container.id.indexOf( '_' ) );
        groupName = container.id.substring( container.id.indexOf('_') + 1, container.id.indexOf( '_tabs_' ) );
        pagelet_group = containerObj[groupName];
        containerObj.activeGroup = groupName;
      }
    }
    if (oldSelected && !Empty( portlet ) && typeof portlet.ValidateCtrlsPage != 'undefined' && !portlet.ValidateCtrlsPage() ) {
      return;
    }
    if (oldSelected && !Empty( pagelet_group ) && typeof pagelet_group.ValidateCtrlsPage != 'undefined' && !pagelet_group.ValidateCtrlsPage() ) {
      return;
    }
    if (oldSelected && !Empty( portlet ) && typeof portlet.ValidateChangePage != 'undefined' && !portlet.ValidateChangePage(idx + 1) ) {
      return;
    }
    if (oldSelected && !Empty( pagelet_group ) && typeof pagelet_group.ValidateChangePage != 'undefined' && !pagelet_group.ValidateChangePage(idx + 1) ) {
      return;
    }
    if ( wizard ) {
      if ( idx > -1 ) {
        if ( oldSelected ) { // deseleziono il precendete e metto il corrente come attivo
          tabs[oldSelected].Active();
          tabs[oldSelected].Deselect(onlyActive);
        } else { // all'inizi nessun tab e' stato selezionato
          tabs[tabName].Active();
        }
      } else {
        alert('Tab ' + tabName + ' not found');
      }
    } else {
      for ( i = 0; i < tabsList.length; i++ ) {
        tab = tabs[tabsList[i]];
        if ( tab ) {
          if ( tab.name != tabName ) {
            tab.Deselect( onlyActive );
          } else {
            idx = i;
          }
        }
      }
    }
    if ( tabs[tabName] ) {
      tabs[tabName].Select( onlyActive );
    }
    if ( wizard && idx + 1 < tabsList.length && !Empty( portlet ) && typeof portlet.EnablePage != 'undefined') { // tentativo di abilitazione del tab successivo
      portlet.EnablePage( idx + 2 ); // enable parte da 1
    }
    if ( wizard && idx + 1 < tabsList.length && !Empty( pagelet_group ) && typeof pagelet_group.EnablePage != 'undefined') {
      pagelet_group.EnablePage( idx + 2);
    }
    _this.centerTabSelected( idx );
    if ( !Empty( portlet ) && oldSelected ) {
      portlet.dispatchEvent('AfterPageChange', idx + 1, oldidx + 1);
    }
    if ( !Empty( pagelet_group ) && oldSelected ) {
      if ( pagelet_group.AfterPageChange ) {
        pagelet_group.AfterPageChange.call(window[window[pageletId].planName] ? window[window[pageletId].planName] : pagelet_group, idx + 1, oldidx + 1);
      }
    }
    oldidx = idx;
    _tNameSelected = tabName;
    if (tabs[tabName].layer_to_tab) {
      tabs[tabName].layer_to_tab.ShowLayer();
      this.removeTab(tabs[tabName].name);
    }
  };
  this.getPrev = function(tabName) {
    var prevIdx = tabsList.indexOf(tabName) - 1;
    if ( prevIdx > -1 ) {
      return tabs[tabsList[prevIdx]];
    }  // tabname e' il primo tab
    return false;
  };
  this.getNext = function(tabName) {
    var nextIdx = tabsList.indexOf(tabName) + 1;
    if ( nextIdx < tabsList.length ) {
      return tabs[tabsList[nextIdx]];
    }  // tabname e' il primo tab
    return false;
  };
  this.Next = function(onlyActive) {
    var oa = onlyActive ? onlyActive : false;
    var findNext = function(idx) {
      var next = tabsList[idx + 1];
      if (!next) {
        return false;
      }
      if (tabs[next].IsDisabled() || tabs[next].IsHidden()) {
        return arguments.callee(++idx);
      }

      _this.Select(tabsList[idx + 1], oa);
      return true;
    };
    return findNext(LibJavascript.Array.indexOf(tabsList, _tNameSelected));
  };

  this.Prev = function(onlyActive) {
    var oa = onlyActive ? onlyActive : false;
    var findPrev = function(idx) {
      var prev = tabsList[idx - 1];
      if (!prev) {
        return false;
      }
      if (tabs[prev].IsDisabled() || tabs[prev].IsHidden()) {
        return arguments.callee(--idx);
      }

      _this.Select(tabsList[idx - 1], oa);
      return true;
    };
    return findPrev(LibJavascript.Array.indexOf(tabsList, _tNameSelected));
  };

  this.Expand = function(tabName) {
    if (expandcollapse) { // apro direttamente il tab solo se nel tabstrip e' attivo expand/collapse, altrimenti chiudo prima gli altri
      tabName = tabName.replace(/[^a-zA-Z_0-9]/g, '');
      tabs[tabName].Select();
    } else {
      this.Select(tabName);
    }
  };

  this.Collapse = function(tabName) {
    tabName = tabName.replace(/[^a-zA-Z_0-9]/g, '');
    tabs[tabName].Deselect();
  };
  this.CheckTabStrip = function() {
    this.SetDisplay();
    this.SetEnable();
  };
  this.SetDisplay = function() {
    for (var i = 0, tab; /* eslint-disable */ tab = tabs[tabsList[i++]]; ) {
      tab.Hide();
    }
  };
  this.SetEnable = function() {
    for (var i = 0, tab; /* eslint-disable */ tab = tabs[tabsList[i++]]; ) {
      tab.Disable();
    }
  };
  this.SetDisable = function(name, disable) {
    name = name.replace(/[^a-zA-Z_0-9]/g, '');
    tabs[name].Disable(disable);
    if ( wizard) {
      var next = this.getNext( name );
      var prev = this.getPrev( name );
      if ( next ) {
        if ( !disable && !next.IsActived() )          {
            // sto attivando il name e il successivo e' attivo
          tabs[name].setDeactiveSeparator();
        }
      }
      if ( prev ) {
        if ( !disable ) {
          prev.setActiveSeparator();
        } else {
          prev.setDeactiveSeparator();
        }
      }
    }
  };
  this.SetCaption = function(name, txt) {
    name = name.replace(/[^a-zA-Z_0-9]/g, '');
    tabs[name].SetCaption(txt);
  };
  this.GetHeight = function() {
    return container.offsetHeight;
  };

  this.GetTabstripID = function(name) {
    return tabs[name].GetID();
  };
  this.Hide = function(n_page, display) {
    if (tabs['page' + n_page] != null) {
      tabs['page' + n_page].Hide(display);
    } else {
      n_page = n_page.replace(/[^a-zA-Z_0-9]/g, '');
      tabs[n_page].Hide(display);
    }
  };
  this.SetCanCollapse = function(bool) {
    if (bool != expandcollapse) {
      expandcollapse = bool;
      for (var i = 0, tab; tab = tabs[tabsList[i++]]; ) {
        tab.SetCanCollapse();
      }
    }
  };

  this.Exists = function(name) {
    return name in tabs;
  };

  this.IsExpanded = function(name) {
    return tabs[name].IsExpanded();
  };

  this.IsCollapsed = function(name) {
    return tabs[name].IsCollapsed();
  };
  this.moveLeft = function(size) {
    var size = typeof size == 'string' || typeof size == 'number' ? parseInt(size) : undefined;
    var btl = document.getElementById(_IDs.container + '_left');
    var btr = document.getElementById(_IDs.container + '_right');
    btr.disabled = false;
    if (!useStyleColor) {
      btr.style.backgroundImage = 'url(' + imgsCached.buttonRight + ')';
    } else {
      LibJavascript.CssClassNameUtils.addClass(btr, 'active');
    }
    var mask = document.getElementById(_IDs.container + '_tabs_mask');
    var row = document.getElementById(_IDs.container);
    var margin_row_gap = parseInt(mask.style.marginLeft != '' ? mask.style.marginLeft : 0 ); // definito nel css serve per tenere traccia dello spazio necessario ai bottoni di scroll
    var gap = typeof size != 'undefined' ? size : row.offsetLeft + mask.offsetWidth / 2; // muove di mezza maschera a volta
    if (gap >= 0 && !size) {
      btl.disabled = true;
      if (!useStyleColor) {
        btl.style.backgroundImage = 'url(' + imgsCached.buttonLeftDisabled + ')';
      } else {
        LibJavascript.CssClassNameUtils.removeClass(btl, 'active');
      }
      row.style.left = parseInt(mask.style.marginLeft != '' ? mask.style.marginLeft : 0 ) + 'px';
    } else if (size) {
      var a = Math.abs(row.offsetLeft) - size;
      if (a > margin_row_gap) {
        row.style.left = row.offsetLeft + size + margin_row_gap + 'px';
      } // spostamento verso della row verso desta
      else {
        row.style.left = margin_row_gap + 'px';
      }
    } else {
      row.style.left = (gap < 0 ? gap : parseInt(mask.style.marginLeft != '' ? mask.style.marginLeft : 0 ) ) + 'px';
    }
  };
  this.moveRight = function(size) {
    var size = typeof size == 'string' || typeof size == 'number' ? parseInt(size) : undefined;
    var btl = document.getElementById(_IDs.container + '_left');
    var btr = document.getElementById(_IDs.container + '_right');
    btl.disabled = false;
    if (!useStyleColor) {
      btl.style.backgroundImage = 'url(' + imgsCached.buttonLeft + ')';
    } else {
      LibJavascript.CssClassNameUtils.addClass(btl, 'active');
    }
    var mask = document.getElementById(_IDs.container + '_tabs_mask');
    var mask_w = mask.offsetWidth; // - parseInt(mask.style.marginRight != "" ? mask.style.marginRight : 0 ) - parseInt(mask.style.marginLeft != "" ? mask.style.marginLeft: 0 )
    var row = document.getElementById(_IDs.container);
    var gap = typeof size != 'undefined' ? size : mask.offsetWidth / 2;  // passo di spostamento
    // var items = LibJavascript.CssClassNameUtils.getElementsByClassName('tab_item')
    var items = container.querySelectorAll('.tab_item');
    var last_item = items[items.length - 1];
    var A = last_item.offsetLeft + last_item.offsetWidth + row.offsetLeft;// punto estremo dei tabs
    if ( A > mask_w) { // se non e' ancora visualizzato tutto l'ultimo tab
      // trovo la dimensione corretta per lo spostamento
      if ( A - gap > mask_w) { // se dopo lo spostamento non visualizzo ancora tutti i tap
        row.style.left = row.offsetLeft - gap + 'px'; // mi sposto ancora del passo costante
      } else {
        row.style.left = row.offsetLeft - (A - mask_w) + 'px';
        btr.disabled = true;
        if (!useStyleColor) {
          btr.style.backgroundImage = 'url(' + imgsCached.buttonRightDisabled + ')';
        } else {
          LibJavascript.CssClassNameUtils.removeClass(btr, 'active');
        }
      }
    } else {
      btr.disabled = true;
      if (!useStyleColor) {
        btr.style.backgroundImage = 'url(' + imgsCached.buttonRightDisabled + ')';
      } else {
        LibJavascript.CssClassNameUtils.removeClass(btr, 'active');
      }
    }
  };
  saveTabPos = function(tab) {
    savedRowPos = document.getElementById(_IDs.container).offsetLeft;
  };
  var tabsOverflow = false;
  this.showSlider = function(show) {
    var btl = document.getElementById(_IDs.container + '_left');
    var btr = document.getElementById(_IDs.container + '_right');
    var row = document.getElementById(_IDs.container);
    if (show) {
      btr.style.display = 'inline-block';
      btl.style.display = 'inline-block';
      document.getElementById(_IDs.container + '_tabs_mask').style.margin = ' 0px ' + btl.offsetWidth + 'px';
      this.centerTabSelected( LibJavascript.Array.indexOf(tabsList, _tNameSelected) );
      if ( document.getElementById(_IDs.container).offsetLeft - document.getElementById(_IDs.container + '_tabs_mask').offsetLeft > 0) {
        btl.disabled = false;
        if (!useStyleColor) {
          btl.style.backgroundImage = 'url(' + imgsCached.buttonLeft + ')';
        } else {
          LibJavascript.CssClassNameUtils.addClass(btl, 'active');
        }
      }
      btr.disabled = false;
      if (!useStyleColor) {
        btr.style.backgroundImage = 'url(' + imgsCached.buttonRight + ')';
      } else {
        LibJavascript.CssClassNameUtils.addClass(btr, 'active');
      }

      tabsOverflow = true;
    } else {
      btr.style.display = 'none';
      btl.style.display = 'none';
      tabsOverflow = false;
      document.getElementById(_IDs.container + '_tabs_mask').style.margin = 0;
      row.style.left = '0px';
    }
  };
  this.centerTabSelected = function(idx) {
    if (tabsOverflow && idx >= 0) { // se i tab sono di dimensioni maggiori rispetto allo spazio assegnato
      // se non c'e' un tab selezionato non tento di riposizionare i tab
      var row = document.getElementById(_IDs.container);
      var mask = document.getElementById(_IDs.container + '_tabs_mask');
      // var items = LibJavascript.CssClassNameUtils.getElementsByClassName('tab_item')
      var items = container.querySelectorAll('.tab_item');
      var tab_item = items[idx];
      if (tab_item) {
        var margin_row_gap = parseInt(mask.style.marginLeft != '' ? mask.style.marginLeft : 0 );
        if (tab_item.offsetLeft + tab_item.offsetWidth + items[0].offsetLeft - Math.abs(row.offsetLeft) > mask.offsetWidth) { // se il tab non e' completamente visibile a destra
          this.moveRight(tab_item.offsetLeft);
        }
        if (Math.abs(row.offsetLeft) + items[0].offsetLeft + margin_row_gap - tab_item.offsetLeft > 0) { // se il tab e' nascosto a sinistra
          this.moveLeft(Math.abs(row.offsetLeft) + items[0].offsetLeft - tab_item.offsetLeft);
        }
      }
    }
  };

  this.initContainer = function() {
    tabstripContainer = document.createElement('div');
    if (!useStyleColor) {
      tabstripContainer.style.backgroundImage = 'url(' + imgsCached.bar + ')';
    }
    tabstripContainer.style.width = '100%';
    tabstripContainer.className = 'tabstripContainer';
    var str = '<div id=\'' + _IDs.container + '_left\' ';
    if (!useStyleColor) {
      str += 'style=\'background-image:url(' + imgsCached.buttonLeft + ' )\' ';
    }
    str += 'class=\'tabBack ' + (useStyleColor ? 'gradientsCSS3' : '') + '\'></div>' +
                    '<div id=\'' + _IDs.container + '_tabs_mask\' class=\'tabs_mask\' >' +
                      '<div id=\'' + _IDs.container + '\' class=\'tabs_row\' >' +
                        '<div class=\'tab_item spazio\'>&nbsp;</div>' +
                      '</div>' +
                    '</div>' +
                    '<div id=\'' + _IDs.container + '_right\' ';
    if (!useStyleColor) {
      str += ' style=\'background-image:url(' + imgsCached.buttonRight + ' )\' ';
    }
    str += 'class=\'tabNext ' + (useStyleColor ? 'gradientsCSS3' : '') + '\' ></div>';
    tabstripContainer.innerHTML = str;
    container.appendChild(tabstripContainer);
    LibJavascript.Events.addEvent( document.getElementById(_IDs.container + '_left'), 'click', this.moveLeft);
    LibJavascript.Events.addEvent( document.getElementById(_IDs.container + '_right'), 'click', this.moveRight);
  };

  this.initContainer();
  this.AddTabs(opts.contents);
  this.InitSelect = function (entity_name, isChild) {
    var firstPage;
    if ( tabsList.length > 0 ) {
      if ( isChild && !window.GetOpener() && window.parent != window) { // figlio integrato
        if ( typeof window.parent.ChildSelectedPage != 'undefined' ) {
          m_cSelectedPage = window.parent.ChildSelectedPage( entity_name );
        }
      }
      if ( useGlobals && typeof m_cSelectedPage != 'undefined' && m_cSelectedPage != '' ) {
        firstPage = defaultPage( m_cSelectedPage );
      } else {
        firstPage = defaultPage( tabsList[0] );
      }
      if ( tabs[firstPage].IsHidden() ) {
        this.Next();
      } else {
        this.Select( firstPage );
      }
    }
  };
  function defaultPage (askedPage) {
    var i, junctTabNames, junctTabName;
    if ( askedPage in tabs ) {
      return askedPage;
    } else if ( askedPage == 'page_1') {
      /* priorita' sulla visualizzazione iniziale */
      junctTabNames = [ 'headerandbodyandfooter'
                      , 'headerandbody'
                      , 'headerandfooter'
                      , 'bodyandfooter'
                      , 'header'
                      , 'body'
                      , 'footer'
      ];
      for ( i = 0; i < junctTabNames.length; i++ ) {
        junctTabName = junctTabNames[i];
        if ( junctTabName in tabs ) {
          return junctTabName;
        }
      }
    }
    return tabsList[0];
  }
  this.HideTabsContainer = function() {
    container.style.display = 'none';
  };
  this.ShowTabsContainer = function() {
    container.style.display = '';
  };
  this.IsDisabled = function(n) {
    return tabs[tabsList[n - 1]].IsDisabled();
  };
};
  /*
  * Per compatibilita' con la vecchia gestione dei tabstrip.
  * Crea le funzioni deprecate.
  */
Z.Tabs.UseDeprecation = function() {
  var DEFAULT_TABNAME_PREFIX = 'page_';
  var tabs = window.tabs;
  window.SetCanCollapseTabstrip = function(bool) {
    if (!tabs) {
      return false;
    }
    tabs.SetCanCollapse(bool);
    return true;
  };
  window.GetTabstripID = function(idx) {
    var tName = DEFAULT_TABNAME_PREFIX + idx;
    if (!IsTabstrip(tName)) {
      return void 0;
    }
    return tabs.GetTabstripID(tName);
  };
  window.GetTabstripIdx = function(id) {
    if (!IsTabstrip(id)) {
      return Number.NaN;
    }
    return parseInt(id.replace(DEFAULT_TABNAME_PREFIX, ''));
  };
  window.IsTabstrip = function(tName) {
    return tabs && tabs.Exists(tName);
  };
  window.IsExpanded = function(idx) {
    var tName = DEFAULT_TABNAME_PREFIX + idx;
    if (!IsTabstrip(tName)) {
      return void 0;
    }
    return tabs.IsExpanded(tName);
  };
  window.IsCollapsed = function(idx) {
    var tName = DEFAULT_TABNAME_PREFIX + idx;
    if (!IsTabstrip(tName)) {
      return void 0;
    }
    return tabs.IsCollapsed(tName);
  };
  window.PageExpand = function(idx) {
    var tName = DEFAULT_TABNAME_PREFIX + idx;
    if (!IsTabstrip(tName)) {
      return void 0;
    }
    tabs.Expand(tName);
  };
  window.PageCollapse = function(idx) {
    var tName = DEFAULT_TABNAME_PREFIX + idx;
    if (!IsTabstrip(tName)) {
      return void 0;
    }
    tabs.Collapse(tName);
  };
  window.ExpandCollapse = function(idx) {
    var tName = DEFAULT_TABNAME_PREFIX + idx;
    if (!IsTabstrip(tName)) {
      return void 0;
    }
    tabs[tabs.IsCollapsed(tName) ? 'Expand' : 'Collapse'](tName);
  };
};


/*
  * Futura implementazione: scroll delle pagine usando lo swipe e iscroll
  *
  *
  var scrollPage = document.createElement('div')
        , page = document.createElement('div')
        , pageW = //Dimensione della pagina, da calcolare al completo caricamento della pagina
      scrollPage.className='scrollpage';
      scrollPage.id='scrollerX'
      page.className='listPage';
      _tab.body.parentNode.appendChild(scrollPage);
      scrollPage.appendChild(page)
      for(var i=0; i< tabs.length; i++){
        page.appendChild(listPage[i]);
        tabs[i].body.style.width = pageW+'px';
        tabs[i].body.style.height = '100%';
        tabs[i].body.style.display = 'block';
        tabs[i].body.style.float='left';
      }
      var scrollWrapper = _tab.body.parentNode;
      scrollWrapper.style.width = (pageW)+'px';
      scrollWrapper.addEventListener('touchmove', function(e){e.preventDefault();}, false);
      var pageVisible = -1;
      var scrollTabs = new iScroll(scrollWrapper,{
        snap: true,
        momentum: false,
        hScrollbar: false,
        onScrollStart: function(){
          pageVisible = this.currPageX;
        },
        onScrollEnd: function () { //selezione del tabstrip corretto
          if(this.currPageX > pageVisible)
             tabsObj.Next(true); // attivazione tabstrip successivo
          if(this.currPageX < pageVisible)
            tabsObj.Prev(true); // attivazione tabstrip precedente
        },
        hideScrollbar:false,
        onBeforeScrollStart:null,
        child:scrollPage,
        lockDirection:true
        });
      scrollWrapper.style.position='relative';
      scrollWrapper.style.margin='0 auto';
      scrollPage.style.width = (listPage[0].offsetWidth * listPage.length)+'px'; // listPage.length
      scrollPage.style.height = '100%';
      scrollPage.style.float='left';
      page.style.float='left';
      page.style.height = '100%';
      page.style.width = '100%';
      scrollTabs.refresh();


*/
