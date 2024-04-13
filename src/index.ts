import {displayTime, displayPauseButton, displayModal, hideModal, displayStartButton} from "./display.js";
import { setUpPage } from "./setUpPage.js";
import { setButtonToActive, timerButtons, resetTimerButtons } from "./timerButtons.js";
import {pauseTimer, stopTimer, startCounter, clearTimeStamp, setCounterTo, setTimeStamp} from "./timer.js";
import { resetFont } from "./font.js";
import setUpServerConnection from "./serverConnection.js";

let duration: number = selectedDuration(); //in minutes


//SET-UP
setUpPage();

const server = setUpServerConnection(({ type, room, you, serverTimestamp}) => {
    const timeOffset = room.startTimestamp === null ? 0 : Math.round((serverTimestamp - Date.now()) / 1000)
    const elapsedTime = room.elapsed + (room.startTimestamp === null ? 0 : Math.round((serverTimestamp - room.startTimestamp) / 1000))
    const counter = Math.max(0, Math.round(room.duration + timeOffset - elapsedTime))

    console.log(type, room)

    switch (type) {
        case "init":
            console.log(`I'm ${you}, my room is`, room)

            actionHighlightLabel(room.sessionLabel)

            if (room.duration === null) {
                actionSet(selectedDuration() * 60, true)
            } else {
                actionSet(room.duration)
                actionAdjust(counter)
                if (room.state === 'running') {
                    actionPlay()
                }
            }
            break

        case "play":
            actionAdjust(counter)
            actionPlay()
            break

        case "pause":
            actionAdjust(counter)
            actionPause()
            break

        case "set":
            actionSet(counter)
            break

        case "setLabel":
            actionHighlightLabel(room.sessionLabel)
            break

        case "join":
            console.log("someone joined your room! :D")
            break

        case "leave":
            console.log("someone left your room :/")
            break
    }
})

function actionPlay(broadcast = false) {
    startCounter(selectedDuration() * 60)
    displayPauseButton()
    if (broadcast) {
        server.play()
    }
}

function actionPause(broadcast = false) {
    pauseTimer()
    displayStartButton()
    if (broadcast) {
        server.pause()
    }
}

function actionReset(broadcast = false) {
    stopTimer()
    actionPause()
    actionAdjust(duration * 60)
    if (broadcast) {
        server.setDuration(duration * 60)
    }
}

function actionSet(durationInSeconds: number, broadcast = false) {
    duration = Math.round(durationInSeconds / 60)
    if (broadcast) {
        server.setDuration(durationInSeconds)
    }
    actionAdjust(durationInSeconds)
    actionPause()
}

function actionHighlightLabel(label: 'pomodoro' | 'short-break' | 'long-break', broadcast = false) {
    const mapping = {
        'pomodoro': 'pomodoroBtn',
        'short-break': 'shortBreakBtn',
        'long-break': 'longBreakBtn'
    }
    const selector = mapping[label]
    setButtonToActive(selector)
    if (broadcast) {
        server.highlightLabel(label)
    }
}

/**
 * Changes displayed timer, but doesn't mess with reset value
 * @param durationInSeconds
 */
function actionAdjust(durationInSeconds: number) {
    setTimeStamp(durationInSeconds)
    setCounterTo(durationInSeconds)
}

function selectedDuration() {
    for (const key in timerButtons) {
        if (timerButtons[key].active) {
            return parseInt(localStorage.getItem(timerButtons[key].localStorageKey) ?? "0", 10) ?? 0;
        }
    }
    throw "There's no active button. That's weird.."
}

//CONTROL BUTTON EVENTS
$("#startBtn").on('click', () => {
    actionPlay(true)
});

$("#pauseBtn").on('click', () => {
    actionPause(true)
});

$("#resetBtn").on('click', () => {

    $("#resetBtn").addClass("rotate").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
        $("#resetBtn").removeClass("rotate");
    });

    actionReset(true)
});

$("#settingsBtn").on('click', () => {
    displayModal();

    let temp: any = localStorage.getItem("pomodoroTime");
    let temp1: any = localStorage.getItem("shortBreakTime");
    let temp2: any = localStorage.getItem("longBreakTime");
    $("#setPomodoroInput").val(temp);
    $("#setShortBreakInput").val(temp1);
    $("#setLongBreakInput").val(temp2);

    for (let i = 0; i < $("#themesOptions")[0].children.length; i++) {

        $("#themesOptions")[0].children[i].removeAttribute("selected");

        if ($("#themesOptions")[0].children[i].id == localStorage.getItem("backgroundImage")) {
            $("#themesOptions")[0].children[i].setAttribute("selected", "true");
            break;
        }
    }

    for (let i = 0; i < $("#soundsOptions")[0].children.length; i++) {

        $("#soundsOptions")[0].children[i].removeAttribute("selected");

        if ($("#soundsOptions")[0].children[i].id == localStorage.getItem("sound")) {
            $("#soundsOptions")[0].children[i].setAttribute("selected", "true");
            break;
        }
    }

});

//MODAL BUTTONS EVENTS
$("#closeBtn").on('click', () => hideModal());

$("#saveChangesBtn").on('click', () => {

    let temp: any = $("#setPomodoroInput").val();
    let temp1: any = $("#setShortBreakInput").val();
    let temp2: any = $("#setLongBreakInput").val();

    localStorage.setItem("pomodoroTime", temp);
    localStorage.setItem("shortBreakTime", temp1);
    localStorage.setItem("longBreakTime", temp2);


    //button is key
    //this is still not working
    for (const key in timerButtons) {
        if (timerButtons[key].active) {
            let temp3: any = localStorage.getItem(timerButtons[key].localStorageKey);
            displayTime(temp3 * 60);
            break;
        }
    }

    stopTimer()
    hideModal();
})

$("#resetChangesBtn").on('click', () => {
    resetTimerButtons();
    resetFont();

    let temp: any = localStorage.getItem("pomodoroTime");
    let temp1: any = localStorage.getItem("shortBreakTime");
    let temp2: any = localStorage.getItem("longBreakTime");

    $("#setPomodoroInput").val(temp);
    $("#setShortBreakInput").val(temp1);
    $("#setLongBreakInput").val(temp2);



    for (const key in timerButtons) {
        if (timerButtons[key].active) {
            let temp3: any = localStorage.getItem(timerButtons[key].localStorageKey);
            duration = temp * 60;
            break;
        }
    }


})

//TIMER BUTTONS EVENTS
$("#pomodoroBtn").on('click', () => {
    const minutes = parseInt(localStorage.getItem("pomodoroTime") ?? "0", 10);
    actionSet(minutes * 60, true)
    actionHighlightLabel('pomodoro', true)
})

$("#shortBreakBtn").on('click', () => {
    let minutes = parseInt(localStorage.getItem("shortBreakTime") ?? "0", 10);
    actionSet(minutes * 60, true)
    actionHighlightLabel('short-break', true)
})

$("#longBreakBtn").on('click', () => {
    let minutes = parseInt(localStorage.getItem("longBreakTime") ?? "0", 10);
    actionSet(minutes * 60, true)
    actionHighlightLabel('long-break', true)
})

//FONT FEATURE EVENTS
$("#poppins").on('click', () => {
    localStorage.setItem("font", "poppins");
    $("*").addClass("poppins");
    $("*").removeClass("playfair");
    $("*").removeClass("aleo");
})

$("#playfair").on('click', () => {
    localStorage.setItem("font", "playfair");
    $("*").addClass("playfair");
    $("*").removeClass("poppins");
    $("*").removeClass("aleo");
})

$("#aleo").on('click', () => {
    localStorage.setItem("font", "aleo");
    $("*").addClass("aleo");
    $("*").removeClass("playfair");
    $("*").removeClass("poppins");
})

//BACKGROUND IMAGE FEATURE EVENTS
$("#themesOptions").on('click', () => {
    //console.log($("#themesOptions option:selected")[0].id);

    localStorage.setItem("backgroundImage", `${$("#themesOptions option:selected")[0].id}`);

    $("body").css("background-image", `url(/img/${localStorage.getItem("backgroundImage")}.png)`);
})

//SOUND FEATURE EVENTS
$("#soundsOptions").on('change', () => {
    localStorage.setItem("sound", $("#soundsOptions option:selected")[0].id);

    let audio = new Audio(`/sound/${localStorage.getItem("sound")}.mp3`);
    audio.play();
})

//Add a function that creates an EventListener for all aside elements, with which the respective div content will be displayed
//Add a function that shows the first aside item and its div content as default