

const setting = document.getElementById("setting");
const start = document.getElementById("play");
const skip = document.getElementById("skip");
var timer = document.getElementById("timer");
const state = document.getElementById("state");

var countDown = 2;
var intervalID = setInterval(updateNum, 60 * 1000);
timer.innerText = time2text(countDown);

//Bring data
chrome.storage.sync.get('allData', function (data) {
    if (data.allData) {
        const timeBlockList = data.allData.time_block;
        console.log(timeBlockList);

        const timeData = data.allData.time;
        console.log(timeData);
    }
    else {
        console.log("No data found");
    }
});

setting.addEventListener("click", () => {
    location.href = "scheduler.html";
})

start.addEventListener("click", () => {
    if (start.innerHTML.length < 2) {

        start.innerHTML = "||";
        intervalID = setInterval(updateNum, 1000);
    }
    else {
        start.innerHTML = "¢º";
        clearInterval(intervalID);
    }
})


skip.addEventListener("click", () => {

    showNot();
    countDown = 0;
    timer.innerText = time2text(countDown);
})




function time2text(time) {
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    var string = min + " : " + sec;
    return string;
}

function updateNum() {
    countDown--;
    timer.innerText = time2text(countDown);

    if (countDown <= 0) {

        showNot();
        clearInterval(intervalID);
        timer.innerText = "AWESOME!";
        state.innerText = "You finished all sessions!";
    }
}



function showNot() {
    chrome.runtime.sendMessage('', {
        type: 'notification',
    });

    var beepsound = new Audio(
        'https://www.soundjay.com/button/sounds/beep-01a.mp3');
    beepsound.play();

    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        type: "popup",
        top: data.top,
        left: data.left - 400,
        width: 400,
        height: 600,
    });
}