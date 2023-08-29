
//Buttons
const setting = document.getElementById("setting");
const starts = document.getElementById("play");
const skip = document.getElementById("skip");
var timers = document.getElementById("timer");
const state = document.getElementById("state");
var intervalID;


var countDown = 2;
timers.innerText = time2text(countDown);

//Go to the setting

setting.addEventListener("click", () => {
    location.href = "scheduler.html";
})

//Start the timer

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

//Skip 

skip.addEventListener("click", () => {

    showNot();
    countDown = 0;
    timers.innerText = time2text(countDown);
})


//Util functions

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
        clearInterval(intervalID);
        timers.innerText = "AWESOME!";
        state.innerText = "You finished all sessions!";
    }
}

chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
    if (response.time) {
        const time = new Date(response.time);
    }
})

function startTime(time) {
    chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time });
    startTimer(time);
}

function startTimer(time) {
   intervalID= setInterval(updateNum, 1000);
}