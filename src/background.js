

class Block {
    constructor(type, length) {
        this.type = type;
        this.length = length;
    }
}

let blockF = new Block("focus", 25);
let blockB = new Block("break", 5);
let blockL = new Block("long", 20);

var times;

chrome.storage.sync.get(null, function (data) {
    if (data.time_block != undefined) {
        times = data.time_block[0].length*60;
    }

    else {
        times = 25 * 60;
    }
});

var intervalID;

chrome.runtime.onMessage.addListener((message, sender, res) => {

    if (message === 'startTimer') {
        intervalID = setInterval(function () {
            times--;
        }, 1000);

        res(times);
    }
    else if (message === 'getTime') {
        res(times);
    }
    else if (message === "endTime") {
        showNot();

        clearInterval(intervalID);

        res("good");
    }
    else if (message === 'bringData') {
        chrome.storage.sync.get(null, function (data) {
            console.log("data is", data.type);
            if (data.time_block != undefined) {
                console.log("imported full time");
                res(data);
            }

            else {
                console.log("intialized times");
                res({ full_time: 105, focus_time: 75, time_block: [blockF, blockB, blockF, blockB, blockF, blockL] });
            }
        });
    }
    else if (message.type === "setData") {
        chrome.storage.sync.set(message, () => {
            console.log(message);
            console.log("data set");
        });
    }
    return true;
});



function showNot() {
    chrome.runtime.sendMessage('', {
        type: 'notification',
        message: "finished!"
    });
}

