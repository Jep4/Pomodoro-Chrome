﻿

const setting = document.getElementById("setting");
const starts = document.getElementById("play");
const skip = document.getElementById("skip");
var timers = document.getElementById("timer");
const state = document.getElementById("state");

var countDown = 2;
var intervalID = setInterval(updateNum, 60 * 1000);
timers.innerText = time2text(countDown);


setting.addEventListener("click", () => {
    location.href = "scheduler.html";
})

starts.addEventListener("click", () => {
    if (starts.innerHTML.length < 2) {
        starts.innerHTML = "||";
        chrome.runtime.sendMessage('', {
            type: 'startsCountdown',
            count: 2, 
        });
    }
    else {
        starts.innerHTML = "▶";
    }
});


skip.addEventListener("click", () => {

    showNot();
    countDown = 0;
    timers.innerText = time2text(countDown);
})




function time2text(time) {
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    var string = min + " : " + sec;
    return string;
}

function updateNum() {
    countDown--;
    timers.innerText = time2text(countDown);

    if (countDown <= 0) {

        showNot();
        clearInterval(intervalID);
        timers.innerText = "AWESOME!";
        state.innerText = "You finished all sessions!";
    }
}



function showNot() {
    chrome.runtime.sendMessage('', {
        type: 'notification',
    });
}