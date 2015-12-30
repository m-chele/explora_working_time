document.observe("dom:loaded", function() {
    window.document.observe('keypress', checkShortcut);
});

function checkShortcut(e) {
    if (!e) e = window.event;

    var ky = e.keyCode ? e.keyCode : e.charCode;

    if (ky == 112) { // F1
        //$('helpIcons').click;
    }
}