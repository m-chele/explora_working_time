function IsNumeric(input) {
    return (input - 0) == input && input.length > 0;
}
String.prototype.ToDateTime103 = function fromDate() {
    var dd = parseInt(this.substring(0, 2),10);
    var mm = parseInt(this.substring(3, 5),10);
    var yy = parseInt(this.substring(6, 10),10);
    var d = new Date();
    d.setFullYear(yy, (mm - 1), dd);
    d.setHours(0, 0, 0, 0);
    return d;
}
String.prototype.Right = function Right(n) {
    if (n <= 0)
        return "";
    else if (n > this.length)
        return this;
    else {
        var iLen = this.length;
        return this.substring(iLen, iLen - n);
    }
}
String.prototype.Trim = function Trim() {
    return this.replace(/^\s+|\s+$/g, '');
}
String.prototype.PadLeft = function padleft(num, ch) {
    var re = new RegExp(".{" + num + "}$");
    var pad = "";
    if (!ch) ch = " ";
    do {
        pad += ch;
    } while (pad.length < num);
    return re.exec(pad + this)[0];
}
String.prototype.PadRight = function padright(num, ch) {
    var re = new RegExp("^.{" + num + "}");
    var pad = "";
    if (!ch) ch = " ";
    do {
        pad += ch;
    } while (pad.length < num);
    return re.exec(this + pad)[0];
}
Number.prototype.RoundNumber = function(dec) {
    return Math.round(this * Math.pow(10, dec)) / Math.pow(10, dec);
}
Number.prototype.H2M = function() {
    var intP = 0; var decP = 0; var tmp = this;

    if (tmp < 0) { intP = Math.ceil(tmp); } else { intP = Math.floor(tmp); }

    tmp = Math.abs(tmp);

    decP = parseInt(((tmp - intP).RoundNumber(2) * 100).RoundNumber(0));
    intP = intP * 60;

    if (this < 0)
        return (intP + decP) * -1;
    else
        return (intP + decP);
}
Number.prototype.M2H = function() {
    var tmp = Math.abs(this);

    var h = Math.floor(tmp / 60);
    var m = tmp % 60;

    if (this < 0)
        return (h + (m / 100)) * -1;
    else
        return (h + (m / 100));
}
Element.addMethods({
    setMaxLength: function(element, maxL, txtCounter) {
        element = $(element);
        $(txtCounter).value = maxL;
        element.observe('keydown', function() {
            var t = $(this);
            if (t.value.length > maxL)
                t.value = t.value.substring(0, maxL);
            var a = $(txtCounter);
            if (a) { a.value = maxL - t.value.length; }
        });
        element.observe('keyup', function() {
            var t = $(this);
            if (t.value.length > maxL)
                t.value = t.value.substring(0, maxL);
            var a = $(txtCounter);
            if (a) { a.value = maxL - t.value.length; }
        });
    }
});
function mouseHoverDGTR(elem, style) {
    elem.store('_sClass',elem.className);
    if (style == "1") {
        elem.childElements().each(function(s) { s.addClassName('GridView_ItemSel'); });
    }
    else if (style == "9") {
        elem.childElements().each(function(s) {
            $w(s.className).each(function(el) {
                if (el.startsWith('CellBg')) {
                    s.removeClassName(el);
                    s.addClassName(el + 'Hvr');
                    throw $break;
                }
            });
        });
    }
    else {
        elem.removeClassName('DataGrid_Item');
        elem.removeClassName('DataGrid_ItemAlt');
        elem.childElements().each(function(s) { s.addClassName('DataGrid_ItemSel'); });
    }
}
function mouseOutDGTR(elem, style) {
    if (style == "1") {
        elem.childElements().each(function(s) { s.removeClassName('GridView_ItemSel'); });
    }
    else if (style == "9") {
        elem.childElements().each(function(s) {
            $w(s.className).each(function(el) {
                if (el.startsWith('CellBg')) {
                    s.removeClassName(el);
                    s.addClassName(el.replace('Hvr', ''));
                    throw $break;
                }
            });
        });
    }
    else {
        elem.childElements().each(function(s) { s.removeClassName('DataGrid_ItemSel'); });
        elem.addClassName(elem.retrieve('_sClass', 'DataGrid_Item'));
    }
}
function ExpandCookieDiv(elemID, div, what) {
    div = $(div);
    if (what == 'expand') {
        //$(div).show();
        if (!div.visible())
            Effect.SlideDown(div, { delay: 0.0, duration: 0.5 });
        setCookie(elemID, '1', '', '', '', '');
    } else if (what == 'reduce') {
        //$(div).hide();
        if (div.visible())
            Effect.SlideUp(div, { delay: 0.0, duration: 0.5 });
        setCookie(elemID, '0', '', '', '', '');
    }
    else {
        if (getCookie(elemID) == '0') {
            $(div).hide();
            /*if (div.visible())
                Effect.SlideUp(div, { delay: 0.0, duration: 0.5 });*/
        }
        else {
            $(div).show();
            /*if (!div.visible())
                Effect.SlideDown(div, { delay: 0.0, duration: 0.5 });*/
        }
    }
}
function ExpandDiv(div, caller) {
    div = $(div);
    if (!div.visible())
        Effect.SlideDown(div, { delay: 0.0, duration: 0.5 });
    else
        Effect.SlideUp(div, { delay: 0.0, duration: 0.5 });
    
    if (caller) {
        caller = $(caller);
        if (caller.className.indexOf("_pressed") > -1)
            caller.className = caller.className.replace("_pressed", "");
        else
            caller.className = caller.className + "_pressed";
    }
}
function Toggle(div, img, arrToHide, imgTp) {
    var d = $(div); var m = $(img);
    if (!imgTp)
        imgTp = 0;
    if (d) {
        if (arrToHide && arrToHide.length > 0) {
            $A(arrToHide).each(function(el) {
                $(el).hide();
            });
        }
        d.toggle();
        if (m) {
            (d.visible()) ? m.src = ((imgTp == 1) ? 'imgs/chevron2.gif' : 'imgs/reduceNode.gif') : m.src = ((imgTp == 1) ? 'imgs/chevron.gif' : 'imgs/expandNode.gif');
        }
    }
}
function ToggleTR(tr, img) {
    var ss; canContinue = true;
    var d = $(tr); var m = $(img);
    var spa = parseInt(d.id.split("_")[1], 10);
    var nextElem = d.retrieve('idNextRow');
    var ImgEndwithExpand = m.src.endsWith('expandNode.gif');
    if ((typeof nextElem != 'undefined') && nextElem.length > 0) {
        ss = d;
        while (canContinue) {
            ss = ss.next();
            if (ss == null || (typeof ss == 'undefined') || ss.id == nextElem) {
                canContinue = false;
            }
            else {
                var hasImgRow = ss.down('img.curPointer');
                if (!ImgEndwithExpand) {
                    //Riduci
                    ss.hide();
                    if (hasImgRow && hasImgRow.src.endsWith('reduceNode.gif'))
                        hasImgRow.src = 'imgs/expandNode.gif';
                }
                else {
                    //Espandi
                    if (ss.id.endsWith((spa + 1).toString()))
                        ss.show();
                }
            }
        }
    }
    if (ImgEndwithExpand) {
        m.src = 'imgs/reduceNode.gif';
    }
    else {
        m.src = 'imgs/expandNode.gif';
    }
}
function ASPNET_checkCheckBoxSel(sender, args) {
    var bOk=false; var chkName='_checkImport';
    $$('input[name=' + chkName + ']').each(function(s) { if (s.checked) { bOk = true; throw $break; } });
    if (!bOk) { alert('E\' necessario selezionare almeno un dipendente!'); args.IsValid=false; return; };
    args.IsValid=true;
}
function ASPNET_checkIntPosNegComma(sender, args) {
    args.IsValid = true;
    var elem = args.Value;
    var elemArr = elem.split(",");
    $A(elemArr).each(function(el) {
        if (el.toString().match(/^-?[0-9]+$/gi)==null) {
            args.IsValid = false;
            throw $break;
        }
    });
}
function openFiltroDipe(btnFiltro, chkBox, ttclass, cuac) {
    var _top = (screen.height / 2) - (400 / 2);
    var _left = (screen.width / 2) - (720 / 2);
    if (!ttclass || (typeof ttclass == 'undefined'))
        ttclass = '';
    if (!cuac || (typeof cuac == 'undefined'))
        cuac = '1';
    window.open('Filtro.aspx?btnF=' + btnFiltro + '&chkBox=' + chkBox + '&ttclass=' + ttclass + '&cuac=' + cuac, 'filtrodipe', 'location=false,toolbar=false,status=true,resizable=false,scrollbars=yes,width=720,height=400,top=' + _top + ',left=' + _left);
}
function applyFilterToDiv(u, chkBox, _options) {
    var options = Object.extend({
        orderField: '',
        orderVerso: ''
    }, _options || {});
    var _div = $('_listDipeByFilter');
    var _ordS = ''; 
    var _ordV = '';
    if (options.orderField != '') {
        _ordS = options.orderField
    } else {
        if (!$('_filtroOrderBy')) { _ordS = 'A'; } else { _ordS = $F('_filtroOrderBy'); }
    }
    if (options.orderVerso != '') {
        _ordV = options.orderVerso
    } else {
        _ordV = 'ASC';
    }
    if (!chkBox) { chkBox = '0'; }
    if (_div) {
        new Ajax.Request(u + "?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'chkBox=' + chkBox + '&ordC=' + _ordS + '&ordV=' + _ordV,
            onSuccess: function(transport) {
                _div.update(transport.responseText);
                try {
                    FabTableInit('dt1');
                } catch (ex00) { ; }
            },
            onFailure: function(transport) {
                _div.update('<div class="centerBold"><br />Errore nel caricamento<br />del Filtro!</div>');
            },
            onCreate: function() {
                _div.update('<div class="centerBold"><br /><img src="imgs/loading.gif" alt="Caricamento..." style="border:0px solid;" /><br />Caricamento...</div>');
            }
        });
    }
}
function ASPNET_showLoad(sender, e) {
    switch (sender._serviceMethod) {
        case 'GetAutoCompleteUsersByUsername': { $('loadingUsername').show(); break; }
        case 'GetAutoCompleteUsersByMatricola': { $('loadingMatricola').show(); break; }
        case 'GetAutoCompleteUsersByNominativo': { $('loadingNominativo').show(); break; }
        case 'GetAutoCompleteAziende': { $('loadingAzienda').show(); break; }
    }
}
function ASPNET_hideLoad(sender, e) 
{
    switch (sender._serviceMethod) {
        case 'GetAutoCompleteUsersByUsername': { $('loadingUsername').hide(); break; }
        case 'GetAutoCompleteUsersByMatricola': { $('loadingMatricola').hide(); break; }
        case 'GetAutoCompleteUsersByNominativo': { $('loadingNominativo').hide(); break; }
        case 'GetAutoCompleteAziende': { $('loadingAzienda').hide(); break; }
    }
}
function CheckAllChecks(pat, st) {
    if (pat) { $$(pat).each(function(n) { n.checked = st; }); }
}
function openAddNewCausWeb() {
    $('_confCausWebIframe').src = 'Amm_ConfCausaliIframe.aspx?t=N';
}
function openCheckAutStraCausWeb() {
    $('_confCausWebIframe').src = 'Amm_ConfCausaliIframeCheckAutStra.aspx';
}
function openAddNewConvCaus() {
    $('_confConvIframe').src = 'Amm_ConversCausaliIframe.aspx?t=N';
}
function openAddNewGrpCausWeb() {
    $('_confGrpCausWebIframe').src = 'Amm_GruppiCausaliIframe.aspx?t=N';
}
function openAddNewAlberoResp() {
    $('_confAlberoRespIframe').src = 'Amm_ConfAlberiRespIframe.aspx?t=N';
}
function openAddNewRiepConf() {
    $('_confRiepConfIframe').src = 'Amm_RiepiloghiIframe.aspx?t=N';
}
function openAddNewNSVoce() {
    $('_confNSVoceIframe').src = 'Amm_NS_VociIframe.aspx?t=N';
}
function openAddNewNSGrpVoci() {
    $('_confNSGrpVociIframe').src = 'Amm_NS_GruppiVociIframe.aspx?t=N';
}
function openAddNewNSValuta() {
    $('_confNSValuteIframe').src = 'Amm_NS_ValuteIframe.aspx?t=N';
}
function openAddNewNSTariffaACI() {
    $('_confNSTariffaACIIframe').src = 'Amm_NS_TariffeACIIframe.aspx?t=N';
}
function openAddNewCommessa() {
    $('_confCommesseIframe').src = 'Amm_CommesseIframe.aspx?t=N';
}
function openAddNewPFGruppi() {
    $('_confPFGruppiIframe').src = 'Amm_PF_GruppiIframe.aspx?t=N';
}
function openAddNewCliente() {
    $('_confClientiIframe').src = 'Amm_ClientiIframe.aspx?t=N';
}
function openAddNewNSTipoRicevuta() {
    $('_confNSTipiRicevuteIframe').src = 'Amm_NS_TipiRicevuteIframe.aspx?t=N';
}
function openAddNewNSTipoOspite() {
    $('_confNSTipiOspitiIframe').src = 'Amm_NS_OspitiIframe.aspx?t=N';
}

function ReloadData(u,div,p,f) {
    var _div = $(div);
    if (!p) { p = ''; }
    var ajx = new Ajax.Request(u + "?d=" + (new Date()).getTime(), {
        method: 'post',
        postBody: p,
        onSuccess: function(transport) {
            if (transport.responseText.length > 0)
                _div.update(transport.responseText);
            else
                _div.update('');
            if (f) { eval(f()); }
        },
        onFailure: function(transport) {
            _div.update('<div class="centerBold"><br />Errore nel caricamento!</div>');
        },
        onCreate: function() {
            _div.update('<div class="centerBold"><br /><img src="imgs/loading.gif" alt="Caricamento..." style="border:0px solid;" /><br />Caricamento...</div>');
        }
    });
    return ajx;
}
function updateStrengthPsw(pw,div,max) {
    var strength = getStrengthPsw(pw);
    var width = (max / 36) * strength;
    new Effect.Morph(div, { style: 'width:' + width + 'px', duration: '0.5' });
}
function getStrengthPsw(passwd) {
    var intScore=0;
    if (passwd.match(/[a-z]/)) { intScore += 1; }
    if (passwd.match(/[A-Z]/)) { intScore += 5; }
    if (passwd.match(/\d+/)) { intScore += 5; }
    if (passwd.match(/(\d.*\d)/)) { intScore += 5; }
    if (passwd.match(/[!,@#$%^&*?_~]/)) { intScore += 5; }
    if (passwd.match(/([!,@#$%^&*?_~].*[!,@#$%^&*?_~])/)) { intScore += 5; }
    if (passwd.match(/[a-z]/) && passwd.match(/[A-Z]/)) { intScore += 5; }
    if (passwd.match(/\d/) && passwd.match(/\D/)) { intScore += 5; }
    //if (passwd.match(/[a-z]/) && passwd.match(/[A-Z]/) && passwd.match(/\d/) && passwd.match(/[!,@#$%^&*?_~]/)) { intScore += 2; }
    return intScore;
}
function validPswPolicy(source, arguments) {
    var ps = arguments.Value;
    if (ps.match(/[a-z]/g) == null) {
        arguments.IsValid = false;
        return;
    }
    if (ps.match(/[A-Z]/g) == null) {
        arguments.IsValid = false;
        return;
    }
    if (ps.match(/[0-9]/g) == null) {
        arguments.IsValid = false;
        return;
    }
    arguments.IsValid = true;
}
function resizeIFrame(div, mod) {
    var iframe = window.parent.$(div);
    if (iframe) {
        var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
        if (iframe.Document && iframe.Document.body.scrollHeight) //ie5+ syntax
        {
            iframe.setStyle({ width: (iframe.Document.body.scrollWidth).toString() + 'px', height: ((mod == 'inner') ? (iframe.Document.body.scrollHeight + 30).toString() : mod) + 'px' });
        }
        else if (innerDoc.body.offsetHeight) //ns6 syntax
        {
            iframe.setStyle({ width: (iframe.scrollWidth + iframe.contentWindow.scrollMaxX).toString() + 'px', height: ((mod == 'inner') ? (innerDoc.body.offsetHeight + 30).toString() : mod) + 'px' });
        }
    }
}
function SelectItemInComboBox(slt, toSel, mod) {
    //mod=0 -> value ; mod=1 -> text start with
    var u = $(slt);
    if (u) {
        for (var P = 0; P < u.length; P++) {
            if (mod == '1') {
                if (toSel && u.options[P].toString().startsWith(toSel.toString())) { u.options[P].selected = true; }
            } else {
                if (toSel && toSel.toString() == u.options[P].value.toString()) { u.options[P].selected = true; }
            }
        }
    }
}
function SetArrayAsSelectItem(slt, arr, toSel, mod) {
    //mod=0 -> codice ; mod=1 -> text start with
    var u = $(slt);
    if (arr && u) {
        for (var P = 0; P < arr.length; P++) {
            u.options[P] = new Option(arr[P][1], arr[P][0])
            if (mod == '1') {
                if (toSel && arr[P][1].toString().startsWith(toSel.toString())) { u.options[P].selected = true; } 
            } else {
                if (toSel && toSel.toString() == arr[P][0].toString()) { u.options[P].selected = true; }
            }
        }
    }
}
function SelectCheckboxListItemFromArray(chklistDiv, toSel) {
    var u = $(chklistDiv);
    if (u && toSel) {
        var chkLst = u.select('input[type=checkbox]');
        for (var P = 0; P < chkLst.length; P++) {
            if (toSel.substring(P, P+1) == '1') { chkLst[P].checked = true }
        }
    }
}
function SelectDivOfCheckBoxElem(divName, lstElems, falseOnElse) {
    lstElems += ',';
    var dNam = $(divName);
    if (dNam) {
        dNam.select('input[type=checkbox]').each(function(el) {
            if (lstElems.indexOf(el.value + ',') > -1)
                el.checked = true;
            else if (falseOnElse)
                el.checked = false;

        });
    }
}
function removeMe(idEl,withConf) {
    var u = $(idEl);
    if (u) {
        var conf = true;
        if (withConf) {conf = confirm('Si è sicuri di voler cancellare l\'elemento selezionato?'); }
        if (conf) {
            u.remove();
        }
    }
}
function delRichiestaCart(tp, qs, idRow) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler eliminare ' + ((tp == 0) ? 'il Giustificativo selezionato' : 'la Timbratura selezionata') + ' ?\nSe il giustificativo e\' stato richiesto per piu\' giorni, sara\' rimosso da tutti.')) {
        new Ajax.Request(_urlBase + "services/dRichiesta.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'p=' + qs,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $$('tr[id^=' + idRow + ']').each(function(el) { el.remove(); });
                    $$('div[id^=' + idRow + ']').each(function(el) { el.remove(); });
                }
                else {
                    alert('Eccezione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
function OpenPopUp(u, p, f, w, h) {
    var _top = (screen.height / 2) - (h / 2);
    var _left = (screen.width / 2) - (w / 2);
    var _f = 'location=false,toolbar=false,status=true,width=' + w + ',height=' + h + ',top=' + _top + ',left=' + _left;
    if (f.toString().length > 0)
        _f += ',' + f;
    var QQ = window.open(_urlBase + u + '?' + p, 'poppy', _f);
    try { QQ.focus(); } catch (exo) { ; }
}
function ExpandResp(what, r, a, spa, opz, moreOpts) {
    var w = $('div' + r + spa.toString());
    if (w) {
        var moreOption = Object.extend({
            respUs: '',
            firstNodeRuolo: '',
            orderBy: ''
        }, moreOpts || {});
        
        var m = w.previous().down('img');
        if (m) {
            Toggle(w.id, m);
        }
        
        if (w.innerHTML.blank()) {
            new Ajax.Request(_urlBase + "services/LoadSottoposti.aspx?d=" + (new Date()).getTime(), {
                method: 'post',
                postBody: 'w=' + what + '&r=' + r + '&a=' + a + '&spa=' + spa + '&opz=' + opz + '&dU=' + moreOption.respUs + '&fnr=' + moreOption.firstNodeRuolo + '&ord=' + moreOption.orderBy,
                onCreate: function() {
                    w.update('<img src="imgs/loading.gif" alt="" /> Caricamento...');
                },
                onSuccess: function(transport) {
                    var trns = transport.responseText;
                    if (trns.substring(0, 3) == 'OK:') {
                        w.update(trns.substring(3));
                        w.setStyle({ marginLeft: (spa * 20).toString() + 'px' });
                        w.show();
                    }
                    else {
                        alert('Eccezione: ' + trns.substring(3));
                    }
                },
                onFailure: function(transport) {
                    alert('Eccezione: ' + transport.responseText);
                }
            });
        }
    }
}
function ExpandRespTR(what, r, a, spa, opz, otherQs) {
    var w = $('tbTr' + r + '_' + spa);
    if (w) {
        if (w.previous()) {
            var m = w.down('img.curPointer');
            if (m) {
                ToggleTR(w.id, m);
            }
        }
        var wCheck = w.retrieve('idNextRow');
        if (wCheck == null || (typeof wCheck == 'undefined') || wCheck.length <= 0) {
            new Ajax.Request(_urlBase + "services/LoadSottoposti.aspx?d=" + (new Date()).getTime(), {
                method: 'post',
                postBody: 'w=' + what + '&r=' + r + '&a=' + a + '&spa=' + spa + '&opz=' + opz + '&' + otherQs,
                onCreate: function() {
                    var fDisc = $('imgLoad' + r);
                    if (fDisc)
                        fDisc.show();
                },
                onSuccess: function(transport) {
                    var imgLoad_ = $('imgLoad' + r);
                    if (imgLoad_)
                        imgLoad_.hide();

                    var trns = transport.responseText;
                    if (trns.substring(0, 3) == 'OK:') {
                        if (w.next() != null)
                            w.store('idNextRow', w.next().id);
                        else
                            w.store('idNextRow', 'ultimo');

                        var arrTR = $A(trns.substring(3).split('</tr>')).reverse();
                        arrTR.each(function(el) {
                            w.insert({ after: (el + '</tr>') });
                        });
                    }
                    else {
                        alert(((trns.substring(3, 5) == '@@') ? 'Attenzione: ' + trns.substring(5) : 'Eccezione: ' + trns.substring(3)));
                    }
                },
                onFailure: function(transport) {
                    alert('Eccezione: ' + transport.responseText);
                }
            });
        }
    }
}
function checkRichiestaApprovata(c, redir) {
    // Approvato
    var valApprovato = $('auVal' + c);
    if (valApprovato) {
        var matchval = $F(valApprovato).match(/^[0-9]{4}$/g);
        if (matchval==null || matchval.length != 1) {
            alert('La durata da approvare non risulta valida!');
            valApprovato.focus(); return false;
        }
        redir = redir + '&auVal=' + $F(valApprovato);
    }
    
    if (redir.length > 0)
        location.href = redir;

    return true;
}
function checkRichiesta(c, redir) {
    // Rifiutato
    var obbl = $('notaObblig' + c); var nota = $('nota' + c);
    if (obbl && $F(obbl) == 'y' && $F(nota).length <= 0) {
        alert('La Nota di Rifiuto e\' obbligatoria!');
        nota.focus(); return false;
    }
    redir = redir + '&nota=' + $F(nota);
    
    var valApprovato = $('auVal' + c);
    if (valApprovato) {
        redir = redir + '&auNeg=1';
    }
    
    if (redir.length > 0)
        location.href = redir;

    return true;
}
function checkRichiesteAll(rifiuto, f) {
    if (rifiuto) {
        var obbls = $$('input[name^=notaObblig]'); var notaErr = null;
        obbls.each(function(el) {
            var nota = $('nota' + el.id.replace('notaObblig', ''));
            if ($F(el) == 'y' && $F(nota).length <= 0) {
                notaErr = nota;
                throw $break;
            }
        });
        if (notaErr && notaErr != null) {
            alert('La Nota di Rifiuto e\' obbligatoria!');
            notaErr.focus(); return false;
        }
    }

    var valsAuStr = $$('input[name^=auVal]'); var valAutErr = null;
    if (Object.isArray(valsAuStr) && valsAuStr.length > 0) {
        valsAuStr.each(function(el) {
            var matchval = $F(el).match(/^[0-9]{4}$/g);
            if (matchval == null || matchval.length != 1) {
                valAutErr = el;
                throw $break;
            }
        });
        if (valAutErr && valAutErr != null) {
            alert('La durata da approvare non risulta valida!');
            valAutErr.focus(); return false;
        }
    }
    
    var formm = $$('form')[0];
    if (formm) {
        formm.action = 'Resp_DoApprovazioneMulti.aspx' + f;
        formm.method = 'POST';
        formm.submit();
    }
    return true;
}
function checkRichiesteElenco(rifiuto, selected, f) {
    var els = $$('input[name^=chkSel]:checked');
    if (selected && (!els || els.length <= 0)) {
        alert('Nessuna richiesta selezionata !');
        return false;
    }

    if (!selected) {
        $$('input[name^=chkSel]').each(function(el) {
            el.checked = true;
        });
    }
    
    if (rifiuto) {
        var obbls = $$('input[name^=notaObblig]'); var notaErr = null;
        obbls.each(function(el) {
            var nota = $('nota' + el.id.replace('notaObblig', ''));
            var isSel = $('chkSel' + el.id.replace('notaObblig', ''));
            if ($F(el) == 'y' && $F(nota).length <= 0 && (!selected || (selected && isSel.checked))) {
                notaErr = nota;
                throw $break;
            }
        });
        if (notaErr && notaErr != null) {
            alert('La Nota di Rifiuto e\' obbligatoria!');
            notaErr.focus(); return false;
        }
    }

    var valsAuStr = $$('input[name^=auVal]'); var valAutErr = null;
    if (Object.isArray(valsAuStr) && valsAuStr.length > 0) {
        valsAuStr.each(function(el) {
            var isSel = $('chkSel' + el.id.replace('auVal', ''));
            var matchval = $F(el).match(/^[0-9]{4}$/g);
            if ((!selected || (selected && isSel.checked)) && (matchval == null || matchval.length != 1)) {
                valAutErr = el;
                throw $break;
            }
        });
        if (valAutErr && valAutErr != null) {
            alert('La durata da approvare non risulta valida!');
            valAutErr.focus(); return false;
        }
    }
    
    var formm = $$('form')[0];
    if (formm) {
        formm.action = 'Resp_DoApprovazioneElenco.aspx' + f + ((selected) ? '&ss=1' : '&ss=0');
        formm.method = 'POST';
        formm.submit();
    }
    return true;
}
function delNotaSpese(idRow) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler cancellare la Nota Spese selezionata ?')) {
        new Ajax.Request(_urlBase + "services/dNsHeader.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'ns=' + idRow,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $$('tr[id$=tbNsRow' + idRow + ']').each(function(el) { el.remove(); });
                }
                else {
                    alert('Eccezione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
function delAntNotaSpese(idRow) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler cancellare l\'Anticipo selezionato ?')) {
        new Ajax.Request(_urlBase + "services/dNsAnticipo.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'ant=' + idRow,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $$('tr[id$=tbAntRow' + idRow + ']').each(function(el) { el.remove(); });
                }
                else {
                    alert('Eccezione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
function delFileExport(idRow) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler eliminare il file di export selezionato ?')) {
        new Ajax.Request(_urlBase + "services/dFileExport.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'p=' + idRow,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $$('tr[id$=tbExpRow' + idRow + ']').each(function(el) { el.remove(); });
                }
                else {
                    alert('Eccezione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
function rinomFileExport(idExp, newName) {
    var ov = new Dialog.Box();
    if (ov) { ov.loading_show(); }

    //if (confirm('Si è sicuri di voler eliminare il file di export selezionato ?')) {
    new Ajax.Request(_urlBase + "services/rinomFileExport.aspx?d=" + (new Date()).getTime(), {
        method: 'post',
        postBody: 'p=' + idExp + '&nn=' + newName,
        onSuccess: function(transport) {
            var trns = transport.responseText;
            if (trns.substring(0, 3) == 'OK:') {
                $('hrefNome_' + idExp).innerHTML = newName;
                shColEditFileExport(idExp);
            }
            else {
                alert('Eccezione: ' + trns.substring(3));
            }
            if (ov) { ov.hide(); }
        },
        onFailure: function(transport) {
            alert('Eccezione: ' + transport.responseText);
            if (ov) { ov.hide(); }
        }
    });
    //}
    //else {
    //    if (ov) { ov.hide(); }
    //}
}
function shColEditFileExport(idExp) {
    var txtbox_ = $('colTextNomeExp_' + idExp);
    var text_ = $('colNomeExp_' + idExp);
    if (txtbox_ && text_) {
        if (txtbox_.visible()) {
            txtbox_.hide();
            text_.show();
        } else {
            txtbox_.show();
            txtbox_.select('input')[0].focus();
            text_.hide();
        }
    }
}
function delDelega(idRow) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler cancellare la Delega selezionata ?')) {
        new Ajax.Request(_urlBase + "services/dDelega.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'p=' + idRow,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $$('tr[id$=tbDelegRow' + idRow + ']').each(function(el) { el.remove(); });
                }
                else {
                    alert('Eccezione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
var SRE_timeout = null;
function SearchRowElement(container, strKey, _lr) {
    if (SRE_timeout)
        window.clearTimeout(SRE_timeout);
    SRE_timeout = window.setTimeout(function() { p_SearchRowElement(container, strKey, _lr); }, 800);
}
function p_SearchRowElement(container, strKey, _lr) {
    var isFind = false;
    var key_ = strKey.toLowerCase();
    var cont_ = $(container);
    var rows_ = cont_.childElements();

    if (cont_ && rows_) {
        if (key_) {
            rows_.each(function(el) {
                // elOk[0]=Azienda; elOk[1]=Matricola; elOk[3]=cognome; elOk[4]=prima parte del nome
                var elOk = null;
                if (_lr == 'lblChk') {
                    if (el.tagName.toLowerCase() == "div")
                        return;
                    elOk = el.select('span')[0].innerHTML.toLowerCase();
                }
                else {
                    elOk = el.select('a span')[0].innerHTML.toLowerCase().split(' ');
                }

                if (_lr == 'ul')
                    isFind = elOk[1].endsWith(key_) || elOk[3].startsWith(key_);
                else if (_lr == 'lblChk')
                    isFind = (elOk.indexOf(key_) > -1);
                else if (_lr == 'left')
                    isFind = elOk[1].startsWith(key_) || elOk[3].startsWith(key_);
                else
                    isFind = elOk[1].endsWith(key_) || elOk[3].startsWith(key_);

                if (isFind) { el.show(); } else { el.hide(); }
            });
        } else {
            rows_.each(function(el) { el.show(); });
        }
    }
    SRE_timeout = null;
}
function getCookie(name) {
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return null;
    }
    if (start == -1) return null;
    var end = document.cookie.indexOf(';', len);
    if (end == -1) end = document.cookie.length;
    return unescape(document.cookie.substring(len, end));
}

function setCookie(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) +
		((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
		((path) ? ';path=' + path : '') +
		((domain) ? ';domain=' + domain : '') +
		((secure) ? ';secure' : '');
}

function deleteCookie(name, path, domain) {
    if (getCookie(name)) document.cookie = name + '=' +
			((path) ? ';path=' + path : '') +
			((domain) ? ';domain=' + domain : '') +
			';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}
//Insert in TextArea nella posizione del cursore
function saveCaret(elem) {
    if (elem.isTextEdit) {
        $(elem).store('range', document.selection.createRange());
    };
}
function insertText(elem, wordInsert) {
    if (elem.isTextEdit && elem.retrieve('range')) {
        elem.retrieve('range').text += wordInsert;
    } else if (elem.selectionStart || (elem.selectionStart == '0')) {
        var before = elem.value.substring(0, elem.selectionStart);
        var after = elem.value.substring(elem.selectionEnd, elem.value.length);
        var selText = elem.value.substring(elem.selectionStart, elem.selectionEnd);
        elem.value = before + selText + wordInsert + after;
    }
}
//Trasferimento tra combo
function FromComboToCombo(cboFrom, cboTo) {
    var f = $(cboFrom);
    var t = $(cboTo);
    if (f && t) {
        if (f.selectedIndex > -1) {
            t.options[t.options.length] = new Option(f.options[f.selectedIndex].text, f.options[f.selectedIndex].value);
            f.options[f.selectedIndex] = null;
        }
    }
}
//cambio Indice tra combo
function UpDownCombo(cboFrom, where) {
    var f = $(cboFrom);
    if (f) {
        if (f.selectedIndex > -1) {
            var selIdx = f.selectedIndex;
            if (where == 'up') {
                if (selIdx == 0)
                    return;

                var tmpEl = f.options[selIdx];
                var tmpEl2 = f.options[selIdx - 1];
                f.options[selIdx] = new Option(tmpEl2.text, tmpEl2.value);
                f.options[selIdx - 1] = new Option(tmpEl.text, tmpEl.value);
                f.options[selIdx - 1].selected = true;
            } else {
                if (selIdx == (f.options.length - 1))
                    return;

                var tmpEl = f.options[selIdx];
                var tmpEl2 = f.options[selIdx + 1];
                f.options[selIdx] = new Option(tmpEl2.text, tmpEl2.value);
                f.options[selIdx + 1] = new Option(tmpEl.text, tmpEl.value);
                f.options[selIdx + 1].selected = true;
            }
        }
    }
}
//Orario in Tempo Reale
function PlayOrarioCorrente(lbl, withBR) {
    if (lbl.length>0) {
        var ut = new Date();
        var elem = $(lbl);
        var h, m, s, dayName;
        h = ut.getHours();
        m = ut.getMinutes();
        s = ut.getSeconds();
        if (s <= 9) s = "0" + s;
        if (m <= 9) m = "0" + m;
        if (h <= 9) h = "0" + h;
        dayName = ut.getDay() - 1;
        if (dayName == -1)
            dayName = 6;
        time = _arrDays[dayName] + " " + ut.getDate() + " " + _arrMonths[ut.getMonth()] + " " + ut.getFullYear() + ((withBR) ? "<br />" : " - ") + h + ":" + m + ":" + s;
        if (elem) { elem.update(time); }
        var UyT = setTimeout("PlayOrarioCorrente('" + lbl + "', " + ((withBR) ? "true" : "false") + ")", 1000);
        elem.store('setTimeoutReturn', UyT);
    }
}
function StopOrarioCorrente(lbl) {
    clearTimeout($(lbl).retrieve('setTimeoutReturn'));
}
function checkAnticiAttiviNS(mese,anno,idUs,spanRes) {
    new Ajax.Request(_urlBase + "services/LoadAnticipiAttiviAl.aspx?d=" + (new Date()).getTime(), {
        method: 'post',
        postBody: 'i=' + idUs + '&m=' + mese + '&a=' + anno,
        onCreate: function() {
            $(spanRes).update('<img src="imgs/loading.gif" alt=""/>');
        },
        onSuccess: function(transport) {
            var trns = transport.responseText;
            if (trns.substring(0, 3) == 'OK:') {
                $(spanRes).update(trns.substring(3));
            }
            else {
                alert('Eccezione: ' + trns.substring(3));
                $(spanRes).update('');
            }
        },
        onFailure: function(transport) {
            alert('Eccezione: ' + transport.responseText);
            $(spanRes).update('');
        }
    });
}
function delArchiviazioneUpload(idRow) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler eliminare l\'archiviazione selezionata ?')) {
        new Ajax.Request(_urlBase + "services/dArchiviazioneUpload.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'p=' + idRow,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $$('tr[id$=tbArchRow' + idRow + ']').each(function(el) { el.remove(); });
                    try { $('trArchFiles').remove(); } catch (uex) { }
                }
                else {
                    alert('Eccezione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
function delFileUploadNS(idRow,annomese,us) {
    var ov = new Dialog.Box();
    if (ov) { ov.persistent_show(); }

    if (confirm('Si è sicuri di voler eliminare il file selezionato ?')) {
        new Ajax.Request(_urlBase + "services/dFileUploadNS.aspx?d=" + (new Date()).getTime(), {
            method: 'post',
            postBody: 'p=' + idRow + '&am=' + annomese + '&us=' + us,
            onSuccess: function(transport) {
                var trns = transport.responseText;
                if (trns.substring(0, 3) == 'OK:') {
                    $('divFileUpl_' + idRow.toString()).remove();
                }
                else {
                    alert('Attenzione: ' + trns.substring(3));
                }
                if (ov) { ov.hide(); }
            },
            onFailure: function(transport) {
                alert('Eccezione: ' + transport.responseText);
                if (ov) { ov.hide(); }
            }
        });
    }
    else {
        if (ov) { ov.hide(); }
    }
}
function checkDirExists(p, imgChk) {
    new Ajax.Request(_urlBase + "services/checkDirExists.aspx?d=" + (new Date()).getTime(), {
        method: 'post',
        postBody: 'p=' + p,
        onCreate: function() {
            $(imgChk).writeAttribute('src', "imgs/loading.gif");
            $(imgChk).writeAttribute('alt', '');
        },
        onSuccess: function(transport) {
            var trns = transport.responseText;
            if (trns.substring(0, 3) == 'OK:') {
                $(imgChk).writeAttribute('src', 'imgs/checkOk.gif');
                $(imgChk).writeAttribute('alt', '');
            }
            else {
                $(imgChk).writeAttribute('src', 'imgs/exclamation-red.png');
                $(imgChk).writeAttribute('alt', 'Cartella inesistente o permessi insufficienti');
            }
        },
        onFailure: function(transport) {
            $(imgChk).writeAttribute('src', 'imgs/exclamation-red.png');
            $(imgChk).writeAttribute('alt', 'Cartella inesistente o permessi insufficienti');
        }
    });
}
function StopKeyPress(evt) {
    var key = (evt.which) ? evt.which : event.keyCode;
    if (Event.KEY_RETURN == key) {
        return false;
    }
}
function KeyPressOnlyNumber(evt) {
    var key = (evt.which) ? evt.which : event.keyCode;
    var keychar = String.fromCharCode(key);
    if (Event.KEY_BACKSPACE == key || ("0123456789").indexOf(keychar) > -1) {
        
        return true;
    }
    return false;
}
function clearField(w) {
    $A(w).each(function(el) { var el = $(el); if (el.tagName.toLowerCase() == 'select') { el.selectedIndex = 0; } else { el.clear(); } });
}
function emptySelectOptions(w, org) {
    var el = $(w);
    org = $(org);
    if (el.tagName.toLowerCase() == 'select') {
        var elN = el.options.length;
        for (var O = 0; O < elN; O++) {
            el.options[0].selected = true; FromComboToCombo(el, org);
        }
    }
}
function loadComboItems(u, rif, dest, addFirst) {
    dest = $(dest);
    new Ajax.Request(u + "?d=" + (new Date()).getTime(), {
        method: 'post',
        postBody: 'cid=' + rif.toString(),
        evalJSON: true,
        sanitizeJSON: true,
        onCreate: function() {
            dest.options.length = 0;
            dest.disable();
            dest.insert({ after: new Element('img', { alt: '', src: 'imgs/loading.gif' }) });
        },
        onSuccess: function(transport) {
            var addToUU = 0; var jsonOK = transport.responseJSON;
            if (addFirst) {
                dest.options[0] = new Option("Seleziona un'attività", "0");
                addToUU = 1;
            }
            if (jsonOK.length == 0) {
                dest.disable();
                if (addFirst) {
                    dest.options[0] = new Option("Nessuna attività disponibile", "0");
                }
            } else {
                dest.enable();
                for (var UU = 0; UU < jsonOK.length; UU++) {
                    dest.options[UU + addToUU] = new Option(jsonOK[UU].text, jsonOK[UU].codice)
                }
            }
            try { dest.next().remove() } catch (exx) { ; }
        },
        onFailure: function(transport) {

        }
    });
}
function showHideMainMenu() {
    var el = $('menuLeftAccHide');
    var mn = $$('.layoutTdLeft')[0];
    if (el) {
        var origVal = mn.getDimensions().height;
        if (mn.visible()) {
            //Effect.SlideUp(mn, { duration: .5, scaleX: true, scaleY: false });
            //setTimeout(function() { el.innerHTML = '<img src="imgs/hideMenu.png" alt="" /> Mostra Menu'; }, 600);
            el.innerHTML = '<img src="imgs/hideMenu.png" alt="" /> Mostra Menu';
            el.removeClassName('menuLeftAccHideVisible');
            mn.hide();
            setCookie('hideLeftMainMenu', '1');
        } else {
            //Effect.SlideDown(mn, { duration: .5, scaleX: true, scaleY: false });
            //setTimeout(function() { el.innerHTML = '<img src="imgs/hideMenu.png" alt="" /> Nascondi Menu'; }, 600);
            el.innerHTML = '<img src="imgs/hideMenu.png" alt="" /> Nascondi Menu';
            el.addClassName('menuLeftAccHideVisible');
            mn.show();
            setCookie('hideLeftMainMenu', '0');
        }
    }
}
function logout(mode,el) {
    new Ajax.Request(_urlBase + "services/logout.aspx?d=" + (new Date()).getTime(), {
        method: 'post',
        postBody: 'mode=' + mode.toLowerCase(),
        onCreate: function() {
            if (el) {
                el = $(el);
                el.insert({ before: '<img src="imgs/loading_onblue.gif" alt="" /> ' + ((mode == 'imp') ? 'Abbandono dell\'impersonificazione' : (mode == 'dlg') ? 'Abbandono della delega' : 'Logout') + ' in corso...' });
                el.hide();
            }
        },
        onSuccess: function(transport) {
            var trns = transport.responseText;
            if (trns.substring(0, 3) == 'OK:') {
                var url = trns.substring(3);
                if (url.length > 0) {
                    location.href = url;
                } else {
                    location.href = "default.aspx";
                }
            }
            else {
                alert('Impossibile effettuare ' + ((mode == 'imp') ? 'l\'abbandono dell\'impersonificazione' : (mode == 'dlg') ? 'l\'abbandono della delega' : 'il logout') + '!\n' + trns.substring(3));
            }
        },
        onFailure: function(transport) {
            alert('Impossibile effettuare ' + ((mode == 'imp') ? 'l\'abbandono dell\'impersonificazione' : (mode == 'dlg') ? 'l\'abbandono della delega' : 'il logout') + '!');
        }
    });
}
function clickRight(op, caller, cookName) {
    if (op.toString().toLowerCase() == "opmass") {
        var cookN = getCookie(cookName);
        if (cookN == null)
            setCookie(cookName, ",,0,,1,,2,,3,,");
            
        var idElm = caller.identify() + "_DIVOPENED";
        var elm = $(idElm);
        if (!elm) {
            elm = new Element("div", { "id": idElm });
        } else {
            if (elm.visible()) {
                elm.hide();
                caller.select("img")[0].src = "imgs/table-column.png";
                applyFilterToDiv(_urlGetUserFilter, '2');
                return;
            }
        }

        caller.select("img")[0].src = "imgs/subtracIcon.gif";
        
        elm.setStyle({
            top: (caller.cumulativeOffset().top + caller.up(0).measure("height") + 1).toString() + 'px',
            left: caller.cumulativeOffset().left.toString() + 'px',
            width: '180px',
            height: '170px',
            position: 'absolute',
            overflow: 'auto',
            display: 'none'
        });
        elm.addClassName("ToolTipDivMouseOver");
        var _html = '<table style="width:100%;"><tr><td class="borderBottom">&nbsp;</td><td class="borderBottom bold">Colonna</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel0" name="colSel" value="0" checked="checked"></td><td class="borderBottom">Validit&agrave; utenza</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel1" name="colSel" value="1" checked="checked"></td><td class="borderBottom">Accesso ad Explora</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel2" name="colSel" value="2" checked="checked"></td><td class="borderBottom">Abilitazione</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel3" name="colSel" value="3" checked="checked"></td><td class="borderBottom">Inserimento password</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel4" name="colSel" value="4" checked="checked"></td><td class="borderBottom">Data assunzione</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel5" name="colSel" value="5" checked="checked"></td><td class="borderBottom">Data cessazione</td></tr>';
        _html += '<tr><td class="borderBottom"><input type="checkbox" id="colSel6" name="colSel" value="6" checked="checked"></td><td class="borderBottom">e-Mail</td></tr>';
        _html += '</table>';
        elm.update(_html);
        $$("body")[0].appendChild(elm);

        $$("input[name=colSel]").each(function(elm) {
            var cookN = getCookie(cookName);
            cookN = (cookN == null) ? "" : "," + unescape(cookN) + ",";
            if (cookN != null && cookN.indexOf("," + elm.value + ",") > -1)
                elm.checked = true;
            else
                elm.checked = false;

            elm.observe("click", function() {
                hasModify = true;
                var cook = getCookie(cookName);
                cook = (cook == null) ? '' : unescape(cook);
                if (elm.checked && (cook == null || ("," + cook + ",").indexOf("," + elm.value + ",") == -1))
                    setCookie(cookName, cook + "," + elm.value + ",");
                else if (!elm.checked && cook != null && ("," + cook + ",").indexOf("," + elm.value + ",") > -1)
                    setCookie(cookName, cook.replace("," + elm.value + ",", ""));
            });
        });
        
        elm.show();
    }
}
function menuToogle(li) {
    li = $(li);
    if (li) {
        var cookieKO = true;
        var subs = li.up().select("li[data-group=" + li.readAttribute("data-group-master") + "]");
        subs.each(function(elm) {
        Toggle(elm, li.down("img"));
            
            if (cookieKO) {
                setCookie('explora_menu_amm_group_master_' + li.readAttribute("data-group-master") + '_opened', ((elm.visible()) ? '1' : '0'), '', '', '', '');
                cookieKO = false;
            }
        });
        li.up("div").setStyle({ overflow: "visible" });
        li.up("div").setStyle({ height: (li.up(0).measure("margin-box-height") + li.up("div").measure("padding-top") + li.up("div").measure("padding-bottom")) + 'px' });
        li.up(1).setStyle({ overflow: "hidden" });
    }
}
/*
try {
    if (window.addEventListener) {
        var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
        window.addEventListener("keydown", function(e) {
            kkeys.push(e.keyCode);
            if (kkeys.toString().indexOf(konami) >= 0) {
                alert("Konami Code!");
                kkeys = [];
            }
            if (kkeys.length >= 40)
                kkeys = [];
        }, true);
    }
} catch (exox) { ; }
*/