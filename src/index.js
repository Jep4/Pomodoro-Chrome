
//Buttons
const setting = document.getElementById("setting");
const starts = document.getElementById("play");
const skip = document.getElementById("skip");
var timers = document.getElementById("timer");
const state = document.getElementById("state");
var intervalID;
var leftTime;


var time_block;
var focus_time;
var full_time;


var endSound = new Audio(chrome.runtime.getURL("src/end.mp3"));


chrome.runtime.sendMessage('bringData', (res) => {
    full_time = res.full_time;
    focus_time = res.focus_time;
    time_block = res.time_block;


    var countDown = time_block[0].length*60;
    timers.textContent = time2text(countDown);

    //Start the timer
    starts.addEventListener("click", () => {
        if (starts.innerHTML.length < 2) {
            starts.innerHTML = "||";

            chrome.runtime.sendMessage('startTimer', (res) => {
                var startTime = Number(res);
                timers.textContent = time2text(startTime);

                intervalID = setInterval(getTime, 1000);

            });

        }
        else {
            starts.innerHTML = "▶";
        }
    });

    function getTime() {
        chrome.runtime.sendMessage('getTime', (res) => {
            leftTime = Number(res);
            timers.textContent = time2text(leftTime);
        });


        if (leftTime <= 1) {
            clearInterval(intervalID);

            chrome.runtime.sendMessage('endTime', (res) => {
                endSound.play();
            });
        }

    }

    //Go to the setting
    setting.addEventListener("click", () => {
        location.href = "scheduler.html";
    })


    //Skip 

    skip.addEventListener("click", () => {

        showNot();
        countDown = 0;
        timers.innerText = time2text(countDown);
    })

});



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

function startTimer() {
    intervalID = setInterval(updateNum, 1000);
}
