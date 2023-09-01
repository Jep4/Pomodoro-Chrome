

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

var order = 0;
initialize_time();

chrome.runtime.onMessage.addListener((message, sender, res) => {

    if (message === 'startTimer') {
            chrome.storage.sync.get(null, function (data) {
                intervalID = setInterval(function () {
                    times--;

                    if (times <= 0) {
                        currentB++;
                        console.log(data.time_block.length);
                        console.log(currentB);
                        if (currentB < data.time_block.length) {
                            times = data.time_block[currentB].lengths * 60;
                            currentType = data.time_block[currentB].type;
                        }
                        else {
                            currentType = "end";
                            clearInterval(intervalID);
                        }
                    }
                }, 1000);
                ret = new toReturn(currentB+1, times, currentType);

                res(ret);

            });
    }
    else if (message === 'getTime') {
        ret = new toReturn(currentB+1, times, currentType);

        res(ret);
    }

    else if (message === 'skipTime') {
        times = 1;
        res(times);
    }
    else if (message === "endTime") {
        showNot();

        clearInterval(intervalID);

        res("good");
    }
    else if (message === 'bringData') {
        chrome.storage.sync.get(null, function (data) {
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
    else if (message === 'endAll') {
        currentB = 0;
        initialize_time();
        ret = new toReturn(currentB + 1, times, currentType);

        res(ret);
    }
    return true;
});



function showNot() {
    chrome.runtime.sendMessage('', {
        type: 'notification',
        message: "finished!"
    });
}

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
