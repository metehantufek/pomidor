function checkLocalStorage(keyval) {
    if (localStorage[keyval] == undefined) {
        return false;
    }
    return true;
}

function updateMasterData() {
    localStorage["masterData"] = JSON.stringify(masterData);
}

// Default Values

var masterData = {
    "pomoNumber": "0",
    "minutes": "25",
    "seconds": "0",
    "defaultMinutes": "25",
    "shortBreak": "5",
    "longBreak": "10",
    "cycle": "PSPSPLPSPSPL",
    "cycleCur": "0"
};

// Local Storage Values

if (checkLocalStorage("masterData")) {
    masterData = JSON.parse(localStorage["masterData"]);
}
else {
    updateMasterData();
}

//

document.getElementById("time").innerHTML = digitFix(masterData["minutes"]) + ":" + digitFix(masterData["seconds"]);

var curIrv;

function curCycle() {
    return masterData["cycle"][masterData["cycleCur"]*1 % masterData["cycle"].length];
}

document.getElementById(curCycle()).classList.add("active");

function nextCycle() {
    document.getElementById("alarm").play();
    const curCycle = masterData["cycle"][masterData["cycleCur"]*1 % masterData["cycle"].length];
    document.getElementById(curCycle).classList.remove("active");
    masterData["cycleCur"]++;
    var newCycle = masterData["cycle"][masterData["cycleCur"]*1 % masterData["cycle"].length];
    document.getElementById(newCycle).classList.add("active");
    switch(newCycle) {
        case "P":
            masterData["minutes"] = masterData["defaultMinutes"];
            masterData["seconds"] = "0";
            break;
        case "S":
            masterData["minutes"] = masterData["shortBreak"];
            masterData["seconds"] = "0";
            break;
        case "L":
            masterData["minutes"] = masterData["longBreak"];
            masterData["seconds"] = "0";
            break;
        default:
            break;
    }
}

function digitFix(a) {
    var strFix = "" + a;
    if (strFix.length == 1) {
        return "0" + a;
    }
    return strFix;
}

function updateTimer() {
    var docFix = document.getElementById("time");
    docFix.innerHTML = digitFix(masterData["minutes"]) + ":" + digitFix(masterData["seconds"]);
    if (masterData["seconds"] == 0 && masterData["minutes"] != 0) {
        masterData["seconds"] = 59;
        masterData["minutes"]--;
    }
    else if (masterData["seconds"] == 0 && masterData["minutes"] == 0) {
        nextCycle();
    }
    else {
        masterData["seconds"]--;
    }
    updateMasterData();
}

function startInterval() {
    document.getElementById("timebutton").onclick = stopInterval;
    document.getElementById("timebutton").innerHTML = "Stop";
    curIrv = setInterval(updateTimer, 1000);
}

function stopInterval() {
    document.getElementById("timebutton").onclick = startInterval;
    document.getElementById("timebutton").innerHTML = "Start";
    clearInterval(curIrv);
}