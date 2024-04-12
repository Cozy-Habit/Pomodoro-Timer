import { displayTime, displayPauseButton, displayModal, hideModal } from "./display.js";
import { setUpPage } from "./setUpPage.js";
import { setButtonToActive, timerButtons, resetTimerButtons } from "./timerButtons.js";
import { pauseTimer, stopTimer, startCounter } from "./timer.js";
import { resetFont } from "./font.js";
import setUpServerConnection from "./serverConnection.js";

let duration: number = 0; //in minutes


//SET-UP
setUpPage();
setUpServerConnection(({room, you, serverTimestamp}) => {
    console.log(`I'm ${you}, my room is`, room)
})

//CONTROL BUTTON EVENTS
$("#startBtn").on('click', () => {

    displayPauseButton();

    for (const key in timerButtons) {
        if (timerButtons[key].active) {
            let temp: any = localStorage.getItem(timerButtons[key].localStorageKey)
            duration = temp;
            break;
        }
    }

    startCounter(duration);
});

$("#pauseBtn").on('click', () => {
    pauseTimer();
});

$("#resetBtn").on('click', () => {

    $("#resetBtn").addClass("rotate").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
        $("#resetBtn").removeClass("rotate");
    });

    stopTimer()

    //OUTPUT
    for (const key in timerButtons) {
        if (timerButtons[key].active) {
            let temp: any = localStorage.getItem(timerButtons[key].localStorageKey);
            displayTime(temp * 60);
            break;
        }
    }


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
    let temp: any = localStorage.getItem("pomodoroTime");
    duration = temp;
    stopTimer();
    displayTime(duration * 60);

    setButtonToActive("pomodoroBtn");
})

$("#shortBreakBtn").on('click', () => {
    let temp: any = localStorage.getItem("shortBreakTime");
    duration = temp;
    stopTimer();
    displayTime(duration * 60);

    setButtonToActive("shortBreakBtn");
})

$("#longBreakBtn").on('click', () => {
    let temp: any = localStorage.getItem("longBreakTime");
    duration = temp;
    stopTimer();
    displayTime(duration * 60);

    setButtonToActive("longBreakBtn");
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