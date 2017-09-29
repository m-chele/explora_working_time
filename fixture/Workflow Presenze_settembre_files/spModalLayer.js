// Copyright 2010 and onwards Zucchetti Spa.
if (typeof spModalLayer == 'undefined') {
  var spModalLayerUid = (
    function() {
      var id = 0;
      return function() {
        return id++;
      };
    }
  )();
  var spModalLayer = function(src, options) {
    if (typeof SPTheme == 'undefined') {
      SPTheme = '';
    }
    if (typeof MooTools == 'undefined' || typeof MooTools.More == 'undefined') {
      if (typeof ZtVWeb != 'undefined') {
        ZtVWeb.RequireLibrary('../mootools.js');
        ZtVWeb.RequireLibrary('../mootools_more.js');
      } else {
        LibJavascript.RequireLibrary('../mootools.js');
        LibJavascript.RequireLibrary('../mootools_more.js');
      }
    }

    options = options || {};
    // var modal = (!Empty($('cinema'))) ? false : (options.modal || true);
    var _this_dialog = this /* Reference to the instantiated obj */
    /* OPTIONS */
      , action_on_click_mask = options.close_on_click_mask || false ? function(event) {
        _this_dialog.confirmClose(event);
      } : options.action_on_click_mask || false
      , ancestor = options.ancestor || (window.ZtVWeb && ZtVWeb.IsMobile() || IsDeviceMobile() ? ZtVWeb.topWindow : LibJavascript.Browser.TopFrame( 'LibJavascript' ))
      , background_color = options.bg_color || 'transparent'
      , background_image = options.bg_img || 'none'
      , background_position = options.bg_pos || 'center center'
      , background_repeat = options.bg_rep || 'no-repeat'
      , border_color = options.border_color || (options.see_through ? 'transparent' : '#D2D2D2')
      , border_width = typeof options.border_width == 'number' ? options.border_width : options.see_through ? '1' : '2'
      , cinema_morph_ms = options.cinema_morph_ms || 400
      , dialog_morph_ms = options.dialog_morph_ms || 300
      , dialog_height = options.height
      , dialog_width = options.width
      , dialog_uid = spModalLayerUid()
      , draggable = options.draggable || false
      , dragger_height = options.dragger_height ? options.dragger_height : options.draggable ? border_width : 0
      , dragger_image = options.dragger_image ? options.dragger_image : null
      , hide_close_btn = options.hide_close_btn || false
      , htmlsrc = options.htmlsrc || false
      , iframe_name = options.iframe_name || null
      , iframe_padding = options.iframe_padding || '0'
      , in_iframe = options.in_iframe || false
      , left = options.left || (options.margin ? options.margin.left : null)
      , manualOverlaing = options.manualOverlaing || false
      , mask_color = options.mask_color || '#000000'
      , mask_opacity = typeof options.mask_opacity == 'number' ? options.mask_opacity : options.see_through ? 0.01 : 0.4
      , maximize = options.maximize || false
      , maximized = options.maximized || false
      , modal = options.modal != 'off'
      , multiple_instances = options.multiple_instances || false
      , opener_ref = options.opener || null
      , prepare_iframe = options.prepare_iframe || false
      , resizable = options.resizable || false
      , see_through = options.see_through || false
      , show_scrollbars = options.show_scrollbars || false
      , top = options.top || (options.margin ? options.margin.top : null)
      , uiUID
      ;

    function entryPoint () {
      return options.entryPoint || SPTheme.entryEffectModalLayer || 'right';
    }

    this.isDragging = false;
    this.isResizing = false;

    this.getOpenerRef = function() {
      return opener_ref;
    };

    this.getDialogUID = function () {
      return dialog_uid;
    };

    this.getInstaceUID = this.getInstanceUID = function () {
      return spModalLayer.INSTANCE_PREFIX + this.getDialogUID();
    };

    var components = {
      dialog: new Element('div', { id: 'spModalLayer_' + dialog_uid, 'class': 'spModalLayer' }).setStyles({
        // 'position': 'fixed'/*se absolute bug in iOS*/,
        position: 'absolute'/* se fixed bug in iOS*/,
        'z-index': '10000',
        border: border_width + 'px solid ' + border_color,
        'border-top': draggable ? '0px' : LibJavascript.GetWindowTopBorder() > 0 ? LibJavascript.GetWindowTopBorder() + 'px solid ' + LibJavascript.GetWindowTopBorderColor() : border_width + 'px solid ' + border_color,
        'font-family': 'Verdana',
        opacity: '0',
        'min-width': 150,
        'min-height': 150,
        background: '#FFFFFF url(../' + (window.ZtVWeb ? ZtVWeb.theme : window.m_cThemePath || 'Fusion') + '/formPage/loading.gif) no-repeat center center',
        padding: '0px'
      }),
      resource_container: new Element('div', { 'class': 'resource_container' }).setStyles({
        position: 'relative',
        left: '0px',
        width: '100%',
        opacity: see_through ? '0' : '1',
        overflow: IsDeviceMobile() ? 'auto' : 'hidden', // questa modifica � utile per il calcolo delle dimensioni interne ( evita la presenza delle scrollbar durante il calcolo delle dimensioni)
        '-webkit-overflow-scrolling': 'touch',
        top: '0px'
      }),
      resource_container_wrapper: new Element('div', { 'class': 'resource_container_wrapper' }).setStyles({
        position: 'relative',
        left: '0px',
        opacity: see_through ? '0' : '1',
        height: Max(dialog_height - parseInt(border_width), 0),
        overflow: 'hidden',
        'background-color': background_color,
        'background-image': background_image,
        'background-position': background_position,
        'background-repeat': background_repeat
      }),
      cinema: new Element('div', { 'class': 'cinema spModalLayer_cinema' }).setStyles({
        position: 'absolute',
        top: '0px',
        left: '0px',
        'z-index': '9999',
        width: '100%',
        height: '100%',
        border: '0',
        background: mask_color,
        opacity: '0'
      }),
      close_btn: new Element('div', { id: 'spModalLayer_closebtn' + '_' + dialog_uid, title: 'close layer', 'class': 'spModalLayer_closebtn' }).setStyles({
        position: 'absolute',
        width: '24px',
        height: '24px',
        top: '-12px',
        right: -(parseInt(border_width) + 12) + 'px',
        background: 'url(../visualweb/images/dialog_closebtn.png) no-repeat center center',
        cursor: 'pointer',
        'z-index': '10001'
      }).addEvent('click', function(event) {
        _this_dialog.confirmClose(event);
      }),
      // Bottone per portare il layer a tab
      tab_btn: new Element('div', { id: 'spModalLayer_tabbtn' + '_' + dialog_uid, title: 'go to tab', 'class': 'SPModalLayerGoToTabButton' }).setStyles({
        // 'position':'absolute',
        // 'width':'24px',
        // 'height':'24px',
        // 'top':  '-12px' ,
        left: parseInt(border_width) / 2 + 'px'
        // 'background':'url(../visualweb/images/Autosuggest_small.png) no-repeat center center',
        // 'cursor':'pointer',
        // 'z-index':'10001'
      }).addEvent('click', function(event) {
        _this_dialog.GoToTab(event);
      }),

      resize_handler: new Element('div', { title: 'drag layer' }).setStyles({
        cursor: 'se-resize',
        background: 'url(' + (SPTheme.spModalLayerResizeImg ? SPTheme.spModalLayerResizeImg : '../visualweb/images/dialog_resize.png') + ') no-repeat top right',
        '-moz-user-select': 'none',
        position: 'absolute',
        bottom: '0px',
        right: '0px',
        width: '20px',
        height: '20px',
        'z-index': '10001'
      }),
      drag_handler: new Element('div', { title: 'drag layer', 'class': 'spModalLayer_draglayer' }).setStyles({
        width: '100%',
        'background-color': border_color,
        'background-image': 'url(' + (dragger_image ? dragger_image : '../visualweb/images/ps-editor-drag.png' ) + ')',
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        height: dragger_height + 'px'
      }),
      header_overlay: new Element('div'),
      maximize_btn: new Element('div', { title: 'Maximize' }).setStyles({
        cursor: 'pointer',
        'background-image': 'url(' + ( SPTheme.spModalLayerMaximizeBtn ? SPTheme.spModalLayerMaximizeBtn : '../visualweb/images/dialog_maximize.png' ) + ')',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        '-moz-user-select': 'none',
        position: 'absolute',
        'z-index': '1',
        top: '-2px',
        left: '0px',
        width: '16px',
        height: '16px'
      }),
      restore_btn: new Element('div', { title: 'Restore size' }).setStyles({
        cursor: 'pointer',
        'background-image': 'url(' + ( SPTheme.spModalLayerRestoreBtn ? SPTheme.spModalLayerRestoreBtn : '../visualweb/images/dialog_restore.png' ) + ')',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
        '-moz-user-select': 'none',
        position: 'absolute',
        'z-index': '1',
        top: '-2px',
        left: '30px',
        width: '16px',
        height: '16px'
      })
    };

    var entryPointEffect = { start: function () {
      return {};
    }
                           , end: {}
    };

    if (action_on_click_mask != false) {
      components.cinema.addEvent('click', action_on_click_mask);
    }

    if (!see_through) {
      var morphs = {
        morph_dialog: new Fx.Morph(components.dialog, { duration: cinema_morph_ms, link: 'chain', transition: 'linear' }),
        morph_container: new Fx.Morph(components.resource_container_wrapper, { duration: dialog_morph_ms, link: 'cancel', transition: 'quint:out' }),
        morph_cinema: new Fx.Morph(components.cinema, { duration: cinema_morph_ms, link: 'chain', transition: 'linear' })
      };
    }

    /* METHODS */

    this.init = function() {
      // var screenSize = window.getScrollSize();
      components.cinema.setStyle('min-height', ancestor.document.body.offsetHeight);
      components.cinema.setStyle('min-width', ancestor.document.body.offsetWidth);
      _this_dialog._open();
      if ( !multiple_instances ) {
        ancestor.modalLayerOpened = _this_dialog;
      }
      if ( window.SPStatusManager ) {
        window.SPStatusManager.routeTracker.push();
      }
    };
    this.resizeModal = function(h, w) {
      var resource_container_wrapper = components.resource_container_wrapper;
      var resource_container = components.resource_container;
      resource_container_wrapper.setStyle('height', h);
      resource_container_wrapper.setStyle('width', w);
      document.id(this.getInstanceUID()).setStyle('width', w);
      if (in_iframe) {
        resource_container.setStyle('height', h);
        document.id(this.getInstanceUID()).setStyle('height', h);
      }
    };
    this.maximize = function() {
      var dialog = components.dialog;
      dialog.setStyle('left', 0);
      dialog.setStyle('top', 0);
      this.resizeModal(document.getSize().y - 15, document.getSize().x);
    };
    this.restoreSize = function() {
      var dialog = components.dialog;
      dialog.setStyle('left', left);
      dialog.setStyle('top', top);
      this.resizeModal(dialog_height, dialog_width);
    };
    this.confirmClose = function(event) {
      if (in_iframe) { // In caso di Gestione si chiama la SendData
        var contentIsEntity = false
        , iframes = this.getContainer().getElementsByTagName('iframe')
        , ref = iframes.length ? iframes[0].contentWindow : window
        , ex = new Element('input').setStyles({ opacity: 0 }).inject(document.body, 'top');
        ex.focus();
        ex.destroy();
        contentIsEntity = ref && ref.SendData;
        if ( contentIsEntity ) { // entita'
          if ('m_cFunction' in ref && (ref.m_cFunction == 'dialog' || ref.m_cFunction == 'page')) { // dialog o page
            if ( 'm_nRowsPerPage' in ref ) { // page
              this.close(event); // non hanno pulsante di chiusura
            } else { // dialog, come da pulsante
              ref.SendData( 'discard' );
            }
          } else /* non dialog e non page */if ( ref.IsEditRowLayerOpened && ref.IsEditRowLayerOpened() ) { // chiude edit di riga
            ref.CloseEditRow();
          } else if ( ref.m_cFunction == 'query' ) { // discard non implementato in modalita' qeury
            this.close(event);
          } else { // chiude come da pulsante
            ref.SendData( 'moveto' );
          }
        } else {
          this.close(event);
        }
      } else {
        this.close(event);
      }
    };
    // Check go to tab
    this.CheckGoToTab = function() {
      if (window.SPTheme && window.SPTheme.forceOpenTab) {
        var tabs_target = 'tab';
        if (window.getPagelet) {
          var pagelet = window[window.getPagelet().id];
          var group;
          for (var r in pagelet.resources) {
            var res = pagelet.resources[r];
            if (res.type == 'group' && res.tabs_target && res.tabs_target == tabs_target) {
              group = res.name;
            }
          }
          if (group != null) {
            return true;
          }
        }
      }
      return false;
    };
    // Metodo che parcheggia il modalLayer in un Tab
    this.GoToTab = function(/* event */) {
      var iframes = this.getContainer().getElementsByTagName('iframe')
        , ref = iframes.length ? iframes[0].contentWindow : window;
      var title = ref.document.title;
      var tabs_target = 'tab';
      // Test esistenza guppo tabbed
      // var pagelet=window[getPagelet().id];
      // var group;
      // for(var r in pagelet.resources){
        // var res=pagelet.resources[r];
        // if(res.type=='group' && res.tabs_target && res.tabs_target==tabs_target)
          // group=res.name;
      // }
      // if(group==null)return;
      if (EmptyString(title)) {
        title = '....';
      }
      windowOpenForeground('javascript:[].join()', tabs_target, 'toolbar=no,scrollbars=yes,resizable=yes', null, null, null, null, false, title, this);
      components.cinema.setStyle('visibility', 'hidden');
      components.tab_btn.setStyle('visibility', 'hidden');
      components.dialog.setStyle('visibility', 'hidden');
      // components['dialog'].setStyle('left','0');
    };
    this.ShowLayer = function() {
      components.cinema.setStyle('visibility', 'visible');
      components.tab_btn.setStyle('visibility', 'visible');
      components.dialog.setStyle('visibility', 'visible');
    };
    this.HideLayer = function() {
      components.dialog.setStyle('visibility', 'hidden');
    };
    this.close = function(event) {
      if ( event ) {
        event.stopPropagation();
      }
      components.resource_container.setStyle('visibility', 'hidden');
      components.dialog.setStyle('background', '#FFFFFF url(../visualweb/images/dialog_loader.gif) no-repeat center center');
      function cls() {
        if ( in_iframe ) {
          if ( window.ZtVWeb && ZtVWeb.IsMobile() || IsDeviceMobile() ) {
            _this_dialog.removeEventFromStore(ancestor, 'orientationchange');
          }
          if ( !see_through ) {
            components.resource_container.getElement('iframe').src = '';
          }
        }
        components.resource_container.destroy();
        components.cinema.destroy();
        components.dialog.destroy();
        if ( !show_scrollbars ) {
          _this_dialog.showScrollbars();
        } else {
          document.body.style.overflow = _this_dialog.oldOverflow;
        }
        if ( !multiple_instances ) {
          ancestor.modalLayerOpened = null;
        }
        // spModalLayer['propIframe_'+dialog_uid]=null;
        delete spModalLayer[_this_dialog.getInstanceUID()];
        if (!Empty(SPTheme) && SPTheme.overlaingPopups && (window.ZtVWeb && ZtVWeb.IsMobile() || IsDeviceMobile() ) ) {
          ZtVWeb.removePortletId( uiUID );
          if ( window.SPStatusManager ) {
            window.SPStatusManager.routeTracker.pop();
          }
          /* var topwnd = LibJavascript.Browser.TopFrame( 'LibJavascript' );
          if( topwnd.LibJavascript.scrollStackObj ) {
            topwnd.LibJavascript.scrollStackObj.removeScroll( _this_dialog.layerScroll );
          } */
        }
        window.focus();
        if (opener_ref) {
          ( function /* fix paint bugs */ ( wnd ) {
            /* BO fonts */
            var fpStyleSheet = wnd.Array.prototype.filter.call( wnd.document.styleSheets, function ( styleSheet ) {
              return styleSheet.href && styleSheet.href.indexOf( 'formPage.css' ) > -1;
            } )[ 0 ] || /* no BO */ {
              cssRules: []
            };
            var spPage = wnd.Array.prototype.filter.call( fpStyleSheet.cssRules, function ( cssRule ) {
              return cssRule.selectorText && cssRule.selectorText === '.mobile .SPPage';
            } )[ 0 ] || /* rule not found */ {};
            spPage.selectorText = 'kickBOPaint';
            wnd.setTimeout( function () {
              spPage.selectorText = '.mobile .SPPage';
            }, 0 );

            /* zoom's grid scroll */
            wnd.Array.prototype.forEach.call(wnd.document.querySelectorAll('.mootable_scroller'), function(scroller) {
              var scrollerHeight = scroller.style.height;
              scroller.style.height = parseInt(scrollerHeight, 10) - 1 + 'px';
              wnd.setTimeout(function() {
                scroller.style.height = scrollerHeight;
              }, 100);
            });
          } )( opener_ref );
          opener_ref.focus();
        }
      }
      if (see_through) {
        cls();
      } else {
        if ( navigator.userAgent.match( /Android.*AppleWebKit/ ) &&
             navigator.userAgent.indexOf( 'Chrome' ) == -1
           ) {
          /* workaround click passing iframes */
          for (var i = 0; i < window.frames.length; i++) {
            if ( window.frames[i].name != iframe_name && window.frames[i].frameElement ) {
              window.frames[i].frameElement.style.visibility = '';
            }
          }
        }
        backgroundLayers.show();
        morphs.morph_dialog.start( entryPointEffect.start() ).chain(
          function() {
            if (!in_iframe) {
            } else if (navigator.userAgent.toLowerCase().indexOf('safari') != -1 &&
                     opener_ref &&
                     'ChangeIframeSrcWithoutPushingHistory' in opener_ref) {
              opener_ref.ChangeIframeSrcWithoutPushingHistory(null, '', null, null, components.resource_container.getElement('iframe'));
            } else {
              // components['resource_container'].getElement('iframe').src='javascript:[].join()'
              // window.open('javascript:[].join()',components['resource_container'].getElement('iframe').name);
            }
            if ( in_iframe ) {
              components.resource_container.getElement('iframe').removeAttribute('first_src');
            }

            if ( SPTheme && SPTheme.overlaingPopups && (window.ZtVWeb && ZtVWeb.IsMobile() || IsDeviceMobile() ) ) {
              cls();
            } else {
              morphs.morph_cinema.start({
                opacity: 0
              }).chain(cls);
            }
          }
        );
      }
    };

    this.open = function() {
      this.init();
      return this;
    };

    this._restZIndex = function() {
      var zindex = 0;
      $$('.spModalLayer').each(function(elem) {
        // elem.setStyle('z-index',10000);
        if ( zindex < parseInt(elem.getStyle('z-index'), 10)) {
          zindex = parseInt(elem.getStyle('z-index'), 10);
        }
      });
      components.dialog.setStyle('z-index', zindex + 2);
      components.cinema.setStyle('z-index', zindex + 1);
    };
    var store = {};
    this.addEventAndStore = function(obj, type, fn) {
      obj = LibJavascript.DOM.Ctrl(obj);
      if (type == 'orientationchange') {
        store[obj.id + '_' + type] = LibJavascript.Events.addOrientationChangeEvent(obj, fn);
      } else {
        LibJavascript.Events.addEvent(obj, type, fn);
        store[obj.id + '_' + type] = fn;
      }
    };
    this.removeEventFromStore = function(obj, type) {
      obj = LibJavascript.DOM.Ctrl(obj);
      LibJavascript.Events.removeEvent(obj, type, store[obj.id + '_' + type]);
      delete store[obj.id + '_' + type];
    };
    this._open = function() {
      if ( !show_scrollbars ) {
        this.hideScrollbars();
      } else {
        _this_dialog.oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      var panel = components.dialog;
      var cinema = components.cinema;
      var resource_container = components.resource_container;
      var close_btn = components.close_btn;
      var tab_btn = components.tab_btn;

      var resize_handler = components.resize_handler;
      var resource_container_wrapper = components.resource_container_wrapper;
      var drag_handler = components.drag_handler;
      var header_overlay = components.header_overlay;
      if ( draggable || !Empty(SPTheme) && !SPTheme.overlaingPopups ) {
        drag_handler.inject(panel);
      }
      panel.inject(document.body);
      if (!Empty(SPTheme) && SPTheme.overlaingPopups && typeof ZtVWeb != 'undefined' && ZtVWeb.IsMobile()) {
        header_overlay.inject(panel);
        var ForcedPortletUID = '__SPRANDOMPORTLETUID__';
        uiUID = LibJavascript.AlfaKeyGen(10);
        ZtVWeb.Include('../' + (window.ZtVWeb ? ZtVWeb.theme : window.m_cThemePath || 'iMobile') + '/jsp-decorators/header_overlaing_popup_portlet.jsp?ForcedPortletUID=' + ForcedPortletUID, header_overlay, false, function(str) {
          return str.replace( /(__SPRANDOMPORTLETUID__)/g, function() {
            return uiUID;
          });
        });
        this.titlePortletId = uiUID;
        ZtVWeb.getPortletById(uiUID).setModalLayer(this);
      }
      if (maximize) {
        var maximize_btn = components.maximize_btn;
        maximize_btn.addEvents({
          click: function() {
            _this_dialog.maximize();
            window.fireEvent('maximized', [_this_dialog]);
            if ( in_iframe ) {
              document.id(_this_dialog.getInstanceUID()).contentWindow.fireEvent('maximized', [_this_dialog]);
            }
          }
        });
        maximize_btn.inject(panel);
        var restore_btn = components.restore_btn;
        restore_btn.addEvents({
          click: function() {
            _this_dialog.restoreSize();
            window.fireEvent('restoreSize', [_this_dialog]);
            if ( in_iframe ) {
              document.id(_this_dialog.getInstanceUID()).contentWindow.fireEvent('restoreSize', [_this_dialog]);
            }
          }
        });
        restore_btn.inject(panel);
      }
      if (hide_close_btn) {
        close_btn.hide();
      }
      if (draggable) {
        drag_handler.setStyle('cursor', 'move');
        drag_handler.addEvents({
          mousedown: function() {
            resource_container.hide();
            close_btn.hide();
            panel.setStyles({
              opacity: 0.7
            });
          },
          mouseup: function() {
            if (!_this_dialog.isDragging) {
              panel.setStyles({
                opacity: 1
              });
              resource_container.show();
              if (!hide_close_btn) {
                close_btn.show();
              }
            }
          }
        });
        panel.makeDraggable({
          handle: drag_handler,
          limit: { x: [0], y: [0] },
          onStart: function(/* el */) {
            _this_dialog.isDragging = true;
            resource_container.hide();
            close_btn.hide();
            panel.setStyles({
              opacity: 0.7
            });
          },
          onDrag: function(/* el */) {
          },
          onComplete: function(/* el */) {
            _this_dialog.isDragging = false;
            panel.setStyles({
              opacity: 1
            });
            resource_container.show();
            if (!hide_close_btn) {
              close_btn.show();
            }
          }
        });
      }
      if (resizable) {
        resize_handler.inject(panel);
        resize_handler.addEvents({
          mousedown: function() {
            resource_container.hide();
            close_btn.hide();
            panel.setStyles({
              opacity: 0.7
            });
          },
          mouseup: function() {
            if (!_this_dialog.isDragging) {
              panel.setStyles({
                opacity: 1
              });
              resource_container.show();
              if (!hide_close_btn) {
                close_btn.show();
              }
            }
          }
        });
        resource_container_wrapper.makeResizable({
          handle: resize_handler,
          limit: { x: [150], y: [150] },
          onStart: function(/* el */) {
            _this_dialog.isDragging = true;
            resource_container.hide();
            close_btn.hide();
            panel.setStyles({
              opacity: 0.7
            });
          },
          onComplete: function(el) {
            _this_dialog.isDragging = false;
            panel.setStyles({
              opacity: 1
            });
            resource_container.show();
            if (!hide_close_btn) {
              close_btn.show();
            }
            document.id(_this_dialog.getInstanceUID()).setStyle('width', el.getSize().x);
            window.fireEvent('resizedIframe', [_this_dialog, el.getSize().x, el.getSize().y]);
            if (in_iframe) {
              resource_container.setStyle('height', el.getSize().y);
              document.id(_this_dialog.getInstanceUID()).setStyle('height', el.getSize().y);
              try {
                if ( document.id(_this_dialog.getInstanceUID()).contentWindow.fireEvent ) {
                  document.id(_this_dialog.getInstanceUID()).contentWindow.fireEvent('resizedIframe', [_this_dialog, el.getSize().x, el.getSize().y]);
                }
              } catch (e) { }
            }
            /*
            var ifrHeight = $($('propIframe_'+dialog_uid).contentWindow.document.body).getElement('.grid_table').getSize().y;
            var titleHeight = $($('propIframe_'+dialog_uid).contentWindow.document.body).getElement('.ZoomTitle').getSize().y;
            resource_container.setStyles({
                'min-height':ifrHeight+titleHeight
              });
            */
          },
          onDrag: function(/* el */) {
          }
        });
      }
      close_btn.inject(panel);
      if (this.CheckGoToTab()) {
        tab_btn.inject(panel);
      }
      panel.setStyles({ display: 'none' });

      this._restZIndex();

      // panel.addEvent('mousedown',function(evt){
        // debugger
        // _this_dialog._restZIndex();
      // })

      var _build = function() {
        cinema.setStyles({ display: 'block' });
        resource_container_wrapper.inject(panel);
        resource_container.inject(resource_container_wrapper);
        resource_container.setStyle('display', 'block');
        panel.setStyle('display', 'block');

        resource_container_wrapper.setStyles({
          width: dialog_width ? dialog_width : null,
          height: dialog_height ? dialog_height - header_overlay.getSize().y : null
        });
        resource_container.setStyles({
          height: dialog_height ? dialog_height - header_overlay.getSize().y : null
        });
        var dBorder = parseInt(border_width)
          , size = window.GetWindowSize()
          , dLeft = left ? left : dialog_width ? size.w / 2 - dialog_width / 2 - dBorder : 50
          , dTop = top ? top : dialog_height ? dialog_height >= size.h ? 0 : size.h / 2 - dialog_height / 2 - dBorder : 50
          // , dLeft =(dialog_width) ? ((size.x/2)-(dialog_width/2)-dBorder) : ((left) ? left : 50)
          // , dTop = (dialog_height) ? ((size.y/2)-(dialog_height/2)-dBorder) : ((top) ? top : 50)
          ;
        if ( window.ZtVWeb && window.ZtVWeb.IsMobile() && window.SPTheme && SPTheme.overlaingPopups) {
          dTop = 0;
        }
        if (maximized) {
          dLeft = 0; dTop = 0;
        }
        dTop += window.pageYOffset || window.document.documentElement && window.document.documentElement.scrollTop || window.document.body.scrollTop;
        dLeft += window.pageXOffset || window.document.documentElement && window.document.documentElement.scrollLeft || window.document.body.scrollLeft;
        entryPointEffect.start = function () {
          return { left: function () {
            return entryPoint() == 'left' ? -size.w : entryPoint() == 'right' ? size.w : dLeft;
          }
          };
        };
        entryPointEffect.end = { left: dLeft };
        panel.setStyles({
          left: entryPointEffect.start().left(),
          top: dTop || 0
        });
        var loaded = function() {
          if (!in_iframe) {
            if ( src ) {
              ZtVWeb.Include(src, resource_container);
            }
            spModalLayer[_this_dialog.getInstanceUID()] = _this_dialog;
            panel.setStyle('background-image', 'none');
            morphs.morph_dialog.start(entryPointEffect.end);
          } else {
            // if(!Empty(SPTheme) && SPTheme.overlaingPopups && ((window.ZtVWeb && ZtVWeb.IsMobile()) || IsDeviceMobile() )){
              // /*Remove header_overlaing_popup_portlet.jsp height*/
              // =  - ZtVWeb.getPortletById(uiUID).height;
            // }
            var timeoutFunc = null;
            var iframeelem = new Element('iframe', {
              id: _this_dialog.getInstanceUID(),
              // 'src': src,
              modallayer: 'true',
              spparentobjid: '',
              frameborder: '0',
              marginheight: '0',
              marginwidth: '0',
              scrolling: show_scrollbars ? 'auto' : 'no',
              // 'width' : '100%',
              // 'height' : '100%',
              toResize: 'no', // IsDeviceMobile() ? 'yes' : 'no',
              events: {
                load: function() {
                  if ( ( !Empty(this.src) && this.src != 'javascript:[].join();' ) ||
                       !Empty(this.contentWindow.location.host) ) {
                    clearTimeout(timeoutFunc);
                    if ( this.getAttribute('first_src') !== 'true' ) {
                      this.setAttribute('first_src', 'true');
                      panel.setStyle('background-image', 'none');
                      this.setStyles({
                        display: 'block'
                      });
                      if ( navigator.userAgent.match( /Android.*AppleWebKit/ ) &&
                           navigator.userAgent.indexOf( 'Chrome' ) == -1
                         ) {
                        /* workaround click passing iframes */
                        for (var i = 0; i < window.frames.length; i++) {
                          if ( window.frames[i].name != iframe_name && window.frames[i].frameElement ) {
                            window.frames[i].frameElement.style.visibility = 'hidden';
                          }
                        }
                      }
                    }
                    spModalLayer[_this_dialog.getInstanceUID()] = _this_dialog;
                    if (opener_ref) {
                      function funcAfterLoad (checksize) {
                        function adjustHeight() {
                          var ifrEl = document.getElementById( _this_dialog.getInstanceUID() )
                            , getElementsByClassName = LibJavascript.CssClassNameUtils.getElementsByClassName
                            , ifrHeight = 0
                            , titleHeight = 0
                            ;
                          try {
                            var gridTbl = ifrEl && getElementsByClassName( 'grid_table', ifrEl.contentWindow.document )[0];
                            ifrHeight = gridTbl && gridTbl.scrollHeight || 0;
                            var zoomTtl = ifrEl && getElementsByClassName( 'ZoomTitle', ifrEl.contentWindow.document )[0];
                            titleHeight = zoomTtl && zoomTtl.scrollHeight || 0;
                          } catch (e) { }
                          if (ifrHeight + titleHeight > 0) {
                            var gridHeight = ifrHeight + titleHeight;
                            var winHeight = GetWindowSize().h;
                            if (checksize < 2 && gridHeight > winHeight && gridHeight < screen.height) {
                              return gridHeight; // tento di ridimensionare il contenitore
                            }
                            var effective_height = Min(gridHeight, winHeight);
                            if (effective_height > dialog_height) {
                              resource_container_wrapper.setStyles({ height: effective_height + 'px' });
                              resource_container.setStyles({ height: effective_height + 'px' });
                              document.getElementById(_this_dialog.getInstanceUID()).setStyles({ height: effective_height });
                              if ( !window.ZtVWeb || !window.ZtVWeb.IsMobile() || !window.SPTheme || !SPTheme.overlaingPopups ) {
                                dTop = effective_height ? GetWindowSize().h / 2 - effective_height / 2 - dBorder : top ? top : 50;
                                dTop += window.pageYOffset || window.document.documentElement && window.document.documentElement.scrollTop || window.document.body.scrollTop;
                                panel.setStyles({ top: top ? top : dTop });
                              }
                            }
                          }
                        }
                        function adjustWidth() {
                          var ifrEl = document.getElementById( _this_dialog.getInstanceUID() )
                            , getElementsByClassName = LibJavascript.CssClassNameUtils.getElementsByClassName
                            , ifrWidth = 0
                            , titleWidth = 0
                            ;
                          try {
                            var gridTbl = ifrEl && getElementsByClassName( 'grid_table', ifrEl.contentWindow.document )[0];
                            ifrWidth = gridTbl && gridTbl.scrollWidth || 0;
                            var zoomTtl = ifrEl && getElementsByClassName( 'ZoomTitle', ifrEl.contentWindow.document )[0];
                            titleWidth = zoomTtl && zoomTtl.scrollWidth || 0;
                          } catch (e) { }
                          if (ifrWidth > 0) {
                            var gridWidth = Max(ifrWidth, titleWidth) + 65;
                            var winWidth = GetWindowSize().w - 65;
                            var horizontalMargin = (options.margin && options.margin.left ? options.margin.left : 0) +
                                                   (options.margin && options.margin.right ? options.margin.right : 0);
                            var availableScreen = screen.width - horizontalMargin;
                            if (checksize < 2 && gridWidth > winWidth && gridWidth < availableScreen ) {
                              return gridWidth; // tento di ridimensionare il contenitore
                            }
                            var effective_width = Min(gridWidth, winWidth);
                            effective_width = Min(availableScreen, effective_width);
                            if (effective_width > dialog_width) {
                              resource_container_wrapper.setStyles({ width: effective_width + 'px' });
                              document.getElementById(_this_dialog.getInstanceUID()).setStyles({ width: effective_width });
                              if ( !window.ZtVWeb || !window.ZtVWeb.IsMobile() || !window.SPTheme || !SPTheme.overlaingPopups ) {
                                dLeft = effective_width ? GetWindowSize().w / 2 - effective_width / 2 - dBorder : left ? left : 50;
                                panel.setStyles({ left: left ? left : dLeft });
                              }
                            }
                          }
                        }
                        var gridHeight = adjustHeight()
                          , gridWidth = adjustWidth()
                          ;
                        if (typeof gridHeight == 'number' || typeof gridWidth == 'number') {
                          var ancSize = ancestor.GetWindowSize();
                          ancestor.resizeTo(gridWidth ? Max(gridWidth || 0, ancSize.w) + 30 : ancestor.outerWidth,
                                            gridHeight ? Max(gridHeight || 0, ancSize.h) + 100 : ancestor.outerHeight);
                          funcAfterLoad.delay(10, window, checksize + 1);
                        } else {
                          morphs.morph_container.start({ opacity: 1 });
                        }
                      }
                      funcAfterLoad.delay(10, window, 0);
                      var opened = document.getElementById(_this_dialog.getInstanceUID()).contentWindow;
                      try {
                        opened.adjustWidthAndHeight;
                      } catch (crossDomain) {
                        opened = null;
                      }
                      if (opened && opened.adjustWidthAndHeight ) {
                        opened.adjustWidthAndHeight();
                      }
                      if (opened && src.match(/[\?|&]m_bInnerChild=/gi)) {
                        var cname = src.match(/\/([^\?\/]+)\?/)[1];
                        if ('m_cWv_' + cname in opener_ref && opened.FillWv && !opened.m_oFather) {
                          opened.m_oFather = opener_ref;
                          opened.SetFromContext.apply(opened, [opener_ref['m_cWv_' + cname]]);
                          opener_ref['SetChildVariables_' + cname].apply(opener_ref);
                        }
                      }
                      if (opened) {
                        opened.caller = opener_ref; // assegno solo se ho impostato l'opener
                        // sostituisco la window.close standard con la close del layer
                        opened.close = opened.closeFrame = _this_dialog.close; // Chrome e FF
                        (function() {  // IE
                          var toEval = // '(function(win){'+
                                        ' var nativeClose = window.close;' +
                                        ' function close(){' +
                                        '   if(window.frameElement && window.frameElement.id){' +
                                        '     window.parent.spModalLayer[window.frameElement.id].close();' +
                                        '   }else{' +
                                        '     nativeClose();' +
                                        '   }' +
                                        ' };';
                          ' function closeFrame(){' +
                                        '   window.parent.spModalLayer[window.frameElement.id].close();' +
                                        ' };';
                                        // '}(window));';
                          if ( opened.execScript ) {
                            opened.execScript(toEval);
                          } else {
                            opened.eval(toEval);
                          }
                        })();
                        opened.focus();
                        if (navigator.userAgent.match(/iPad;.*CPU.*OS \d_\d/i) && navigator.standalone && opened.onresize) {
                          opened.onorientationchange = opened.onresize;
                        }
                      }
                      if (Lower(Right(src, 4)) == '.pdf' && navigator.userAgent.indexOf( 'Chrome' ) != -1) {
                        timeoutFunc = funcAfterLoad.delay(500, window, 0);
                      }
                    } else {
                      morphs.morph_container.start({ opacity: 1 });
                    }
                    if (maximized) {
                      _this_dialog.maximize();
                    }
                  }
                }
              }
            });
            resource_container_wrapper.setStyle('opacity', 0);
            iframeelem.setStyles({
              width: dialog_width + 'px',
              'min-height': '100%',
              overflow: 'visible',
              top: '0px',
              border: '0',
              // 'display': 'none',
              padding: iframe_padding
            });
            iframeelem.set('name', (Empty(iframe_name)||iframe_name=='_blank')?(''+new Date().getTime()):iframe_name);
            if (!htmlsrc == false) {
              var div = new Element('div').setStyles({
                position: 'absolute',
                top: '0',
                left: '0',
                'z-index': '0',
                width: '100%',
                overflow: 'auto'
              });
              div.inject(resource_container);
              div.innerHTML = src;
            }
            if (!see_through) {
              /* Entrata del div contenitore in loading*/
              iframeelem.inject(resource_container);
              morphs.morph_dialog.start({
                left: dLeft
              }).chain(function() {
                backgroundLayers.hide();
                if (htmlsrc == false) {
                  if (src.length>1500/*Microsoft Knowledge Base Article - 208427*/) {
                    var url = src;
                    function ce(t) {
                      return document.createElement(t);
                    }
                    function barc(c,a) {
                      document.body[(a?'append':'remove')+'Child'](c);
                    }
                    var p=url.indexOf('?');
                    var varnames,varvalues=[];
                    if (p!=-1) {
                      varnames=url.substr(p+1).split('&');
                      var e=Lower(document.charset|| document.characterSet)
                      var decodeParameterValue = (e=='utf-8'?decodeURIComponent:function(s) { return unescape(Strtran(s,'%80','%u20AC'));} )
                      for (var n=0; n<varnames.length; n++) {
                        eq=varnames[n].indexOf('=');
                        varvalues[n]=decodeParameterValue(varnames[n].substr(eq+1));
                        varnames[n]=Left(varnames[n],eq);
                      }
                      url=Left(url,p);
                    } else {
                      varnames=[];
                    }
                    var f=ce("form");
                    f.method='post';
                    f.action=url;
                    f.target=iframeelem.name;
                    for (var n=0; n<varnames.length; n++) {
                      i=ce("textarea");
                      i.name=varnames[n];
                      i.value=varvalues[n];
                      f.appendChild(i);
                    }
                    barc(f,1);
                    f.submit();
                    barc(f);
                  } else {
                    iframeelem.src = src;
                  }
                }
                if (!iframe_name)
                  iframeelem.set('name', "")
              });
            }
            else 
              if (!iframe_name)
                  iframeelem.set('name', "")
            if (window.ZtVWeb && ZtVWeb.IsMobile() || IsDeviceMobile() ) {
              _this_dialog.addEventAndStore(ancestor, 'orientationchange', function () {
                var dLeft, dTop, pnl_height, pnl_width, header_overlay_height;
                if (window.SPTheme && SPTheme.overlaingPopups) {
                  morphs.morph_container.start({ opacity: 0 }).chain(function() {
                    pnl_width = window.getWidth();
                    pnl_height = GetWindowSize().h - LibJavascript.GetWindowTopBorder();
                    header_overlay_height = components.header_overlay.getSize().y;
                    iframeelem.setStyles({
                      width: pnl_width,
                      'min-height': pnl_height - header_overlay_height
                    });
                    panel.setStyles({
                      left: 0,
                      top: 0,
                      width: pnl_width,
                      height: pnl_height
                    });
                    resource_container_wrapper.setStyles({
                      left: 0,
                      top: 0,
                      width: pnl_width,
                      height: pnl_height - header_overlay_height
                    });
                    resource_container.setStyles({
                      height: pnl_height - header_overlay_height
                    });
                    components.cinema.setStyle('min-height', pnl_height);
                    components.cinema.setStyle('min-width', pnl_width);
                    // if(htmlsrc==false)
                      // iframeelem.src=src;
                    morphs.morph_container.start({ opacity: 1 });
                  });
                } else {
                  pnl_width = panel.getSize().x;
                  pnl_height = panel.getSize().y;
                  dLeft = pnl_width ? window.getWidth() / 2 - pnl_width / 2 - dBorder : left ? left : 50;
                  dTop = pnl_height ? GetWindowSize().h / 2 - pnl_height / 2 - dBorder : top ? top : 50;
                  dTop = Math.max(dTop, (!hide_close_btn ? 15 : 0) +
                                        ( window.pageYOffset || window.document.documentElement && window.document.documentElement.scrollTop || window.document.body.scrollTop));
                  dLeft = Math.max(dLeft, 0);
                  panel.setStyles({
                    left: left ? left : dLeft,
                    top: top ? top : dTop
                  });
                }
              });
            }
          }
        }.bind(this);
        if (see_through) {
          loaded();
        } else if (prepare_iframe) {
          loaded();
          components.dialog.setStyle('opacity', '1');
          spModalLayer[_this_dialog.getInstanceUID()] = _this_dialog;
        } else {
          spModalLayer[_this_dialog.getInstanceUID()] = _this_dialog;
          morphs.morph_dialog.start({
            opacity: [0, 1]
          }).chain(loaded);
        }
      };

      if (modal) {
        cinema.inject(document.body);
        cinema.setStyles({ display: 'block' });
      }
      if ( !manualOverlaing && window.SPTheme && SPTheme.overlaingPopups && (window.ZtVWeb && ZtVWeb.IsMobile() || IsDeviceMobile() ) ) {
        _build();
      } else if (see_through) {
        components.cinema.setStyle('opacity', mask_opacity);
        _build();
      } else if (prepare_iframe) {
        morphs.morph_cinema.start({
          opacity: mask_opacity
        });
        _build();
      } else if (modal) {
        morphs.morph_cinema.start({
          opacity: mask_opacity
        }).chain(_build);
      }
    };

    this.hideScrollbars = function() {
      if (window.frameElement) {
        if (document.all) {
          this.oldScroll = window.frameElement.contentWindow.document.body.scroll;
          window.frameElement.contentWindow.document.body.scroll = 'no';
        } else {
          this.oldScroll = window.frameElement.getAttribute('scrolling');
          window.frameElement.setAttribute('scrolling', 'no');
        }
      } else if (document.all) {
        this.oldScroll = document.body.scroll;
        document.body.scroll = 'no';
        this.oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        this.oldScroll = document.body.getAttribute('scrolling');
        document.body.setAttribute('scrolling', 'no');
        this.oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
    };

    this.showScrollbars = function() {
      if (window.frameElement) {
        if (document.all) {
          window.frameElement.contentWindow.document.body.scroll = this.oldScroll;
        } else if (this.oldScroll) {
          window.frameElement.setAttribute('scrolling', this.oldScroll);
        } else {
          window.frameElement.removeAttribute('scrolling');
        }
      } else if (document.all) {
        document.body.scroll = this.oldScroll;
        document.body.style.overflow = this.oldOverflow;
      } else {
        if (this.oldScroll) {
          document.body.setAttribute('scrolling', this.oldScroll);
        } else {
          document.body.removeAttribute('scrolling');
        }
        document.body.style.overflow = this.oldOverflow;
      }
    };
    this.getContainer = function() {
      return components.resource_container;
    };
    this.getGlobalContainer = function() {
      return components.dialog;
    };
    this.getTitlePortletId = function() {
      return this.titlePortletId;
    };
    var _this = this
      , backgroundLayers =
      { HIDDEN_ELEMENTS_KEY: 'data-sp-hidden-for-mobile-perfs'
        , HIDDEN_ELEMENTS_PREV_VALUE: 'data-sp-hidden-for-mobile-perfs-previous-display-value'
        , hide: function () {
          if ( window.SPTheme && window.SPTheme.overlaingPopups && window.ZtVWeb && window.ZtVWeb.IsMobile() ) {
            var el = components.dialog.parentElement.firstElementChild;
            while ( el && el !== components.dialog ) {
              switch ( el.tagName ) {
              case 'DIV' :
              case 'IFRAME' :
                if ( !el.getAttribute( this.HIDDEN_ELEMENTS_KEY ) ) {
                  el.setAttribute( this.HIDDEN_ELEMENTS_KEY, _this.getDialogUID() );
                  if ( el.style.display ) {
                    el.setAttribute( this.HIDDEN_ELEMENTS_PREV_VALUE, el.style.display );
                  }
                  el.style.display = 'none';
                }
                break;
              }
              el = el.nextElementSibling;
            }
          }
        }
        , show: function () {
          if ( window.SPTheme && window.SPTheme.overlaingPopups && window.ZtVWeb && window.ZtVWeb.IsMobile() ) {
            var layer_ref;
            Array.prototype.forEach.call(
                components.dialog.parentElement.querySelectorAll( '[' + this.HIDDEN_ELEMENTS_KEY + '="' + _this.getDialogUID() + '"]' ),
                function (el) {
                  el.style.display = el.getAttribute( this.HIDDEN_ELEMENTS_PREV_VALUE ) || '';
                  el.removeAttribute( this.HIDDEN_ELEMENTS_PREV_VALUE );
                  el.removeAttribute( this.HIDDEN_ELEMENTS_KEY );
                  layer_ref = spModalLayer.getInstance( el.getAttribute( spModalLayer.ATTRIBUTE_OBJECT_REF_ID ) );
                  if ( layer_ref ) {
                    layer_ref.adjustLayer( document.getElementById( layer_ref.getInstanceUID() ) );
                  }
                }.bind( this )
              );
            if ( !layer_ref && window.onCloseLastLayer ) {
              window.onCloseLastLayer();
            }
          }
        }
      }

      ;
  };// spModalLayer
  spModalLayer.ATTRIBUTE_OBJECT_REF_ID = 'data-sp-modal-layer-object-ref-id';
  spModalLayer.INSTANCE_PREFIX = 'spModalLayerRef_';
  spModalLayer.getInstace = spModalLayer.getInstance = function (instanceUID) {
    return spModalLayer[instanceUID];
  };
}

/* exported detectDoctype*/
function detectDoctype() {
  return document.compatMode != 'BackCompat';
}

// Object Instance
var myDialog;

/* exported showDialog*/
function showDialog(src, width, height) {
  myDialog = new spModalLayer(src, {
    in_iframe: false, // se e' a false va di include
    draggable: false,
    resizable: false,
    width: width,
    height: height,
    mask_opacity: 0.5,
    show_scrollbars: false,
    border_width: '2',
    border_color: '#D2D2D2'
  });
  myDialog.open();
}

/* exported closeDialog*/
function closeDialog(event) {
  myDialog.close(event);
}

// Modal layer per editor ps
var currentSPModalLayer = null;
/* exported openSPModalLayer*/
function openSPModalLayer(url, margin_top, margin_left, width, height, resizable, border_width, show_scrollbars, maximize, opener, iframe, hide_close_btn, draggable) {
  currentSPModalLayer = newObjSPModalLayer(url, margin_top, margin_left, width, height, resizable, border_width,
                                           show_scrollbars, maximize, opener, iframe, hide_close_btn, draggable);
  currentSPModalLayer.open();
}

/* exported closeSPModalLayer*/
function closeSPModalLayer() {
  var closed = false;
  if ( currentSPModalLayer ) {
    currentSPModalLayer.close();
    closed = true;
  }
  currentSPModalLayer = null;
  return closed;
}

function newObjSPModalLayer(url, margin_top, margin_left, width, height, resizable, border_width, show_scrollbars, maximize, opener, iframe, hide_close_btn, draggable) {
  return newObjSPModalLayerOpener(url, margin_top, margin_left, width, height, resizable, border_width, opener,
                                  show_scrollbars, false, maximize, iframe, hide_close_btn, draggable);
}

function newObjSPModalLayerOpener(url, margin_top, margin_left, width, height, resizable, border_width, opener,
                                  show_scrollbars, multiple_instances, maximize, iframe, hide_close_btn, draggable) {
  if (!url) {
    return;
  }
  var maximized = false;
  if (typeof maximize == 'undefined') {
    maximize = true;
  }
  if (typeof hide_close_btn == 'undefined') {
    hide_close_btn = false;
  }
  if (typeof draggable == 'undefined') {
    draggable = true;
  }
  var newSPModalLayer = new spModalLayer(url, { in_iframe: iframe != undefined && iframe != null ? iframe : true,
    draggable: draggable,
    top: margin_top,
    left: margin_left,
    width: width,
    height: height,
    resizable: resizable,
    border_color: '#CCCCCC',
    border_width: border_width,
    dragger_height: 12,
    dragger_image: '../visualweb/images/ps-editor-drag.png',
    opener: opener || window,
    mask_opacity: 0.4,
    mask_color: '#CCCCCC',
    show_scrollbars: show_scrollbars,
    close_on_click_mask: '',
    iframe_padding: 0,
    hide_close_btn: hide_close_btn,
    maximize: maximize,
    maximized: maximized,
    multiple_instances: multiple_instances
  });
  return newSPModalLayer;
}
