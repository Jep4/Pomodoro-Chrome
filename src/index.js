
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

    if (time_block[0] != undefined) {
        getTime();
        
    }
    else {
        block_exists = false;
        countDown = 0;
    }
    timers.textContent = time2text(countDown);

    console.log(res.started);
    if (res.started===true) {
        startTimer();
    }

    //Start the timer
    starts.addEventListener("click", () => {
        startTimer();
    });

    function getTime() {
        chrome.runtime.sendMessage('getTime', (res) => {
            leftTime = Number(res.times);
            timers.textContent = time2text(leftTime);
            console.log(res);
        });


        if (leftTime <= 1) {
            clearInterval(intervalID);

            chrome.runtime.sendMessage('endTime', (res) => {
                console.log("Time ends" + res);
                chrome.storage.sync.get(null, function (data) {
                    if (data.sound==="true") {
                        endSound.play();
                    }
                });
            });
        }

    }



    function startTimer() {

        chrome.runtime.sendMessage('startTimer', (res) => {

            if (starts.innerHTML.length < 2) {
                starts.innerHTML = "||";

                var startTime = Number(res.times);
                timers.textContent = time2text(startTime);
                if (res.type === "focus") {
                    state.textContent = "Session " + res.order + ": Focus time";
                }
                else if (res.type === "break") {
                    state.textContent = "Session " + res.order + ": Break time";
                }
                else if (res.type === "end") {
                    endSession();
                    chrome.runtime.sendMessage('endAll', (res) => {
                        leftTime = Number(res);
                    });
                }
                else {
                    state.textContent = "Session " + res.order + ": Long break";
                }

                intervalID = setInterval(getTime, 1000);
            }

            else {
                starts.innerHTML = "▶";
                chrome.runtime.sendMessage('pauseTime', (res) => { getTime(); })
            }

        });

    }


    //Go to the setting
    setting.addEventListener("click", () => {
        location.href = "scheduler.html";
    })


    //Skip 

    skip.addEventListener("click", () => {

        chrome.runtime.sendMessage('skipTime', (res) => {
            leftTime = Number(res);
        });
        timers.innerText = time2text(leftTime);


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

        if (res.type === "focus") {
            state.textContent ="Focus time";
        }
        else if (res.type === "break") {
            state.textContent = "Break time";
        }
        else if (res.type === "end") {
            endSession();
            chrome.runtime.sendMessage('endAll', (res) => {
                leftTime = Number(res);
            });
        }
        else {
            state.textContent ="Long break";
        }

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


function endSession() {
    timers.textContent = "AWESOME!";
    state.textContent = "You finished all the sessions!"
}
