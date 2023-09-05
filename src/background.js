

class Block {
    constructor(type, lengths) {
        this.type = type;
        this.lengths = lengths;
    }
}

class toReturn {
    constructor(order, times, type) {
        this.order = order;
        this.times = times;
        this.type = type;
    }
}

let blockF = new Block("focus", 25);
let blockB = new Block("break", 5);
let blockL = new Block("long", 20);

var times;
var intervalID;
var currentB = 0;
var currentType;
var started = false;

var order = 0;
initialize_time();

chrome.runtime.onMessage.addListener((message, sender, res) => {

    if (message === 'startTimer') {
        started = true;
        if (intervalID) {
            clearInterval(intervalID);
        }
        chrome.storage.sync.get(null, function (data) {
            intervalID = setInterval(
                function () {
                    times--;

                    if (times <= 0) {
                        currentB++;
                        if (data.time_block.length) {
                            if (currentB < data.time_block.length) {
                                times = data.time_block[currentB].lengths * 60;
                                currentType = data.time_block[currentB].type;
                            }

                            else {
                                currentType = "end";
                                clearInterval(intervalID);
                            }
                        }
                        else {
                            clearInterval(intervalID);
                        }
                    }
                }, 1000);
            ret = new toReturn(currentB + 1, times, currentType);

            res(ret);

        });
    }
    else if (message === 'getTime') {
        ret = new toReturn(currentB + 1, times, currentType);

        res(ret);
    }

    else if (message === 'pauseTime') {

        clearInterval(intervalID);
        ret = new toReturn(currentB + 1, times, currentType);

        res(ret);
    }
    else if (message === 'skipTime') {
        times = 0;
        res(times);
    }
    else if (message === "endTime") {
        clearInterval(intervalID);
        show_notification()

        res("good");
    }
    else if (message === 'bringData') {
        chrome.storage.sync.get(null, function (data) {
            if (data.time_block != undefined) {
                console.log("imported full time");

                data.started = started;
                res(data);
            }

            else {
                console.log("intialized times");
                res({ full_time: 105, focus_time: 75, time_block: [blockF, blockB, blockF, blockB, blockF, blockL], started: started });
            }
        });
    }
    else if (message.type === "setData") {
        chrome.storage.sync.set(message, () => {
            console.log(message);
            console.log("data set");
        });
    }
    else if (message === 'endAll') {
        currentB = 0;
        initialize_time();
        ret = new toReturn(currentB + 1, times, currentType);

        res(ret);
    }
    else if (message === 'soundON') {
        chrome.storage.sync.set({ 'sound': "true" });
        res("Sound ON");
    }
    else if (message === 'soundOFF') {
        chrome.storage.sync.set({ 'sound': "false" });
        res("Sound OFF")
    }
    return true;
});


function initialize_time() {

    chrome.storage.sync.get(null, function (data) {

        if (data.time_block != undefined) {
            times = data.time_block[0].lengths * 60;
            currentType = data.time_block[0].type;

        }

        else {
            times = 25 * 60;
        }
    });
    return true;
}

function show_notification() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'time-48.png',
        title: `Time up!`,
        message: "Your session ends",
        priority: 1
    });
}
