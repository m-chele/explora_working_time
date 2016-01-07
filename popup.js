// popup.js
window.onload = function() {
    document.getElementById("calculateButton").onclick = function() {
        chrome.extension.sendMessage({
            type: "calculate-result"
        });
    }
}
/*
    var calculateButton = document.getElementById('calculateButton');
        calculateButton.addEventListener('click', function() { 
            $("#mioResult").text("sdasassasa");
        });
    */
