
//Buttons
const setting = document.getElementById("setting");
const starts = document.getElementById("play");
const skip = document.getElementById("skip");
var timers = document.getElementById("timer");
var state = document.getElementById("state");
var intervalID;
var leftTime;

var time_block;
var focus_time;
var full_time;
var block_exists = true;
var countDown;

var endSound = new Audio(chrome.runtime.getURL("src/end.mp3"));


chrome.runtime.sendMessage('bringData', (res) => {
    full_time = res.full_time;
    focus_time = res.focus_time;
    time_block = res.time_block;

    //Initialize timer
    if (time_block[0] != undefined) {
        getTime();

    }
    else {
        block_exists = false;
        countDown = 0;
    }
    timers.textContent = time2text(countDown);

    //Automatically starts the timer even if restarted 
    if (res.started === true) {
        startTimer();
    }

    //Start the timer
    starts.addEventListener("click", () => {
        startTimer();
    });


    //Go to the setting
    setting.addEventListener("click", () => {
        location.href = "scheduler.html";
    })


    //Skip 

    skip.addEventListener("click", () => {

        //Consider to make a function (duplicated)

        chrome.runtime.sendMessage('skipTime', (res) => {

            startTimer();
        });



    })


    function getTime() {
        chrome.runtime.sendMessage('getTime', (res) => {
            leftTime = Number(res.times);
            timers.textContent = time2text(leftTime);
            console.log(res);
        });


        if (leftTime <= 0) {
            clearInterval(intervalID);

            chrome.runtime.sendMessage('endTime', (res) => {
                console.log("Time ends" + res);
                    clearInterval(intervalID);
                    timers.innerText = "AWESOME!";
                    state.innerText = "You finished all sessions!";
                chrome.storage.sync.get(null, function (data) {
                    if (data.sound === "true") {
                        endSound.play();
                    }
                });
            });
        }

    }


    function changeState(res) {
        if (res.type === "focus") {
            state.textContent = "Focus time";
        }
        else if (res.type === "break") {
            state.textContent = "Break time";
        }
        else if (res.type === "end") {
            chrome.runtime.sendMessage('endAll', (res) => {
                leftTime = Number(res);
            });
        }
        else {
            state.textContent = "Long break";
        }
    }

    function startTimer() {

        chrome.runtime.sendMessage('startTimer', (res) => {

            if (starts.innerHTML.length < 2) {
                starts.innerHTML = "||";

                var startTime = Number(res.times);
                timers.textContent = time2text(startTime);
                changeState(res);

                intervalID = setInterval(getTime, 1000);
            }

            else {
                starts.innerHTML = "▶";
                chrome.runtime.sendMessage('pauseTime', (res) => { getTime(); })
            }

        });

    }

});



//Util functions

function time2text(time) {
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    var string = min + " : " + sec;
    return string;
}
