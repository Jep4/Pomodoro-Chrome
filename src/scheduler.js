
class Block {
    constructor(type, lengths) {
        this.type = type;
        this.lengths = lengths;
    }
}
//time block
const bar = document.getElementById("bar");
const focusB = document.getElementById("focus");
const breakB = document.getElementById("break");
const longBB = document.getElementById("long-break");
var total = document.getElementById("total");
var totalstudy = document.getElementById("totalStudy");

var soundON = document.getElementById("soundON");
var soundOFF = document.getElementById("soundOFF");

//Delete
const deleteB = document.getElementById("delete");

//Start
const start = document.getElementById("start");
const cancel = document.getElementById("cancel");

let blockF = new Block("focus", 25);
let blockB = new Block("break", 5);
let blockL = new Block("long", 20);

var time_block;
var focus_time;
var full_time;


//Bring time block data from chrome local storage

chrome.runtime.sendMessage('bringData', (res) => {
    full_time = res.full_time;
    focus_time = res.focus_time;
    time_block = res.time_block;

    total.innerHTML = time2text(full_time);
    totalstudy.innerHTML = "working " + time2text(focus_time);



    for (let i = 0; i < time_block.length; i++) {
        createBlock(time_block[i].type);
    }

    console.log("import blocks");



    //Add time blocks

    focusB.addEventListener("click", () => {
        chrome.storage.sync.get('allData', function (data) {
        })

        const focusData = document.getElementById("focus-input").value;
        if (focusData < 1) {
            alert("You can't set time block less than 1 minutes!")
        }
        else {
            blockF = { type: "focus", lengths: focusData };
            if (time_block.length <= 16) {

                full_time += Number(focusData);
                focus_time += Number(focusData);

                total.innerHTML = time2text(full_time);
                totalstudy.innerHTML = "working " + time2text(focus_time);

                time_block.push(blockF);
                createBlock("focus");

            }
            else {
                alert("You can't add more time blocks!");
            }
        }
    })

    breakB.addEventListener("click", () => {
        const breakData = document.getElementById("break-input").value;
        if (breakData < 1) {
            alert("You can't set time block less than 1 minutes!")
        }
        else {
            blockB = { type: "break", lengths: breakData };
            if (time_block.length <= 16) {

                full_time += Number(breakData);
                total.innerHTML = time2text(full_time);
                time_block.push(blockB);
                createBlock("break");
            }
            else {
                alert("You can't add more time blocks!");
            }
        }
    })

    longBB.addEventListener("click", () => {
        const longBData = document.getElementById("long-input").value;
        if (longBData < 1) {
            alert("You can't set time block less than 1 minutes!")
        }
        else {
            blockL = { type: "long", lengths: longBData };
            if (time_block.length <= 16) {

                full_time += Number(longBData);
                total.innerHTML = time2text(full_time);
                time_block.push(blockL);
                createBlock("long");
            }
            else {
                alert("You can't add more time blocks!");
            }
        }
    })

    deleteB.addEventListener("click", () => {
        if (time_block.length > 0) {
            if (time_block.length <= res.order) {

                alert("You can't delete current block!");
            }
            else {
                time_data = time_block[time_block.length - 1].lengths;
                if (time_block[time_block.length - 1].type == "focus") {
                    focus_time -= Number(time_data);
                }

                time_block.pop(time_block[time_block.length]);
                var bar = document.querySelectorAll(".session");
                full_time -= Number(time_data);

                totalstudy.innerHTML = "working " + time2text(focus_time);

                total.innerHTML = time2text(full_time);
                bar[bar.length - 1].remove();
}

        }
        else {
            alert("there is no time block!");
        }
    })


    start.addEventListener("click", () => {
        const storageData = { 'type': "setData", 'full_time': full_time, 'focus_time': focus_time, 'time_block': time_block };

        chrome.runtime.sendMessage(storageData, (res) => {

        });

        location.href = "index.html";
    })


    cancel.addEventListener("click", () => {
        location.href = "index.html";
    })


});

var ifSound;
ifSound = chrome.storage.sync.get(null, function (data) {
    ifSound = data.sound;

    if (ifSound === "true") {
        soundON.style.background = "aliceblue";
        soundON.style.color = "black";
        soundOFF.style.background = "black";
        soundOFF.style.color = "aliceblue";
    }

    else if (ifSound === "false") {
        soundOFF.style.background = "aliceblue";
        soundOFF.style.color = "black";
        soundON.style.background = "black";
        soundON.style.color = "aliceblue";
    }


    soundON.addEventListener("click", () => {
        if (ifSound === "false") {
            soundON.style.background = "aliceblue";
            soundON.style.color = "black";
            soundOFF.style.background = "black";
            soundOFF.style.color = "aliceblue";
            chrome.runtime.sendMessage('soundON', (res) => {
                console.log(res, " turn on sound");
            });

        }

        ifSound = "true";
    });
    soundOFF.addEventListener("click", () => {
        if (ifSound === "true") {
            soundOFF.style.background = "aliceblue";
            soundOFF.style.color = "black";
            soundON.style.background = "black";
            soundON.style.color = "aliceblue";

            chrome.runtime.sendMessage('soundOFF', (res) => {
                console.log(res, "turn off sound");
            });

        }

        ifSound = "false";

    });

}


);




function createBlock(type) {
    const newBlock = document.createElement("div");

    if (type === "focus") {
        newBlock.setAttribute("class", "session focus");
        newBlock.textContent = "F";
    }
    else if (type === "break") {
        newBlock.setAttribute("class", "session break");
        newBlock.textContent = "B";

    }
    else {
        newBlock.setAttribute("class", "session long-break");
        newBlock.textContent = "LB";
    }
    bar.appendChild(newBlock);
}

function time2text(time) {
    var hour = Math.floor(time / 60);
    var min = time - (hour * 60);
    var string = hour + " hours " + min + " minutes";
    return string;
}
