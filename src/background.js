

    let timertime;
    let timerid; 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.cmd === 'START_TIMER') {
        timertime = new Date(request.when);
        timerid = setTimeout(() => {
            showNot();
        }, timertime.getTime() - Date.now());
    } else if (request.cmd === 'GET_TIMER') {
        sendResponse({ time: timertime });
    }
    return true;
});


function showNot() {
    chrome.runtime.sendMessage('', {
        type: 'notification',
    });

    var beepsound = new Audio(
        'https://www.soundjay.com/button/sounds/beep-01a.mp3');
    beepsound.play();


    chrome.browserAction.setPopup({
        popup: "index.html"
    });

}