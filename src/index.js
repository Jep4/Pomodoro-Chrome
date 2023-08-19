

const setting = document.getElementById("setting");
const start = document.getElementById("play");
const skip = document.getElementById("skip");
var timer = document.getElementById("timer");
const state = document.getElementById("state");

var countDown = 3;
const intervalID = setInterval(updateNum, 60 * 1000);
timer.innerHTML = time2text(countDown);

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
        start.innerHTML = "▶";
        clearInterval(intervalID);
    }
})


skip.addEventListener("click", () => {
    countDown = 0;
    timer.innerHTML = time2text(countDown);
})




function time2text(time) {
    var min = Math.floor(time / 60);
    var sec = time - (min * 60);
    var string = min + " : " + sec;
    return string;
}

function updateNum() {
    countDown--;
    timer.innerHTML = time2text(countDown);

    if (countDown <= 0) {
        clearInterval(intervalID);
        showNot();
        timer.innerHTML = "AWESOME!";
        state.innerHTML = "You finished all sessions!";
    }
}



function notPermission() {
    Notification.requestPermission().then(function (permission) {
        console.log('Notification permission:', permission);
    });
}

function showNot() {
    if (Notification.permission === 'granted') {
        let notification = new Notification('Countdown complete!', {
            body: 'Done.',
        });
    } else {
        notPermission();
    }

    notPermission();
}