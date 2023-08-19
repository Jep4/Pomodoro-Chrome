
class Block {
    constructor(type, length) {
        this.type = type;
        this.length = length;
    }
}
//time block
const bar = document.getElementById("bar");
const focusB = document.getElementById("focus");
const breakB = document.getElementById("break");
const longBB = document.getElementById("long-break");
let total = document.getElementById("total");
let totalstudy = document.getElementById("totalStudy")

//Delete
const deleteB = document.getElementById("delete");

//Start
const start = document.getElementById("start");
const cancel = document.getElementById("cancel");

let blockF = new Block("focus", 25);
let blockB = new Block("break", 5);
let blockL = new Block("long", 20);

let time_block = [];
let focus_time = 105;
let full_time = 75;

total.innerHTML = time2text(full_time);
totalstudy.innerHTML = "working " + time2text(focus_time);


//Bring time block data from chrome local storage
window.onload = function () {
    chrome.storage.sync.get('allData', function (data) {
        if ('time' in data) {
            full_time = data;
            console.log("import full time");
        }
        else {

            full_time = 105;
            focus_time = 75;
            console.log("intialize times");
        }
    })


    chrome.storage.sync.get('allData', function (data) {
        if ('time_block' in data) {

            for (let i = 0; i < data.length; i++) {
                createBlock(data.time_block.type);
            }
            console.log("import blocks");
        }
        else {

            time_block = [blockF, blockB, blockF, blockB, blockF, blockL];
            console.log("intialize blocks");
        }
    })


    const storageData = { 'time_block': time_block, 'time': full_time };
    chrome.storage.sync.set(storageData, () => {
        console.log("setting");
    });
}


//Add time block

focusB.addEventListener("click", () => {
    chrome.storage.sync.get('allData', function (data) {
       })

    const focusData = document.getElementById("focus-input").value;
    blockF = { type: "focus", length: focusData };
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
})

breakB.addEventListener("click", () => {
    const breakData = document.getElementById("break-input").value;
    blockB = { type: "break", length: breakData };
    if (time_block.length <= 16) {

        full_time += Number(breakData);
        total.innerHTML = time2text(full_time);
        time_block.push(blockB);
        createBlock("break");
    }
    else {
        alert("You can't add more time blocks!");
    }
})

longBB.addEventListener("click", () => {
    const longBData = document.getElementById("long-input").value;
    blockL = { type: "long", length: longBData };
    if (time_block.length <= 16) {

        full_time += Number(longBData);
        total.innerHTML = time2text(full_time);
        time_block.push(blockL);
        createBlock("long");
    }
    else {
        alert("You can't add more time blocks!");
    }
})

deleteB.addEventListener("click", () => {
    if (time_block.length > 0) {
        time_data = time_block[time_block.length - 1].length;
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
    else {
        alert("there is no time block!");
    }
})


start.addEventListener("click", () => {
    const storageData = { 'time_block': time_block, 'time': full_time };
    chrome.storage.sync.set(storageData, () => {
        console.log("Sets data");
    });

    chrome.storage.sync.get("allData", function (data) {
        console.log(data);
        location.href = "index.html";
    })
})


cancel.addEventListener("click", () => {
    location.href = "index.html";
})




function createBlock(type) {
    const newBlock = document.createElement("div");

    if (type == "focus") {
        newBlock.setAttribute("class", "session focus");
        newBlock.textContent = "F";
    }
    else if (type == "break") {
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