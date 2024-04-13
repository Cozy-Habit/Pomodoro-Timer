import { displayTime, displayStartButton } from "./display.js";

/**
 * Sets up the page and local storage variables upon loading the document
 */
export function setUpPage() {

    addDefaultBackgroundImage();
    addDefaultTimer();
    addDefaultSound();
    addDefaultFont();

    let temp: any = localStorage.getItem("pomodoroTime");
    displayTime(temp * 60);

    displayStartButton();
}

/**
 * Adds a default background image to the document and stores it in local storage variable "backgroundImage"
 */
function addDefaultBackgroundImage() {
    if (!localStorage.getItem("backgroundImage")) localStorage.setItem("backgroundImage", "cafeteria.png");
    $("body").css({
        "background-image": `url(/img/${localStorage.getItem("backgroundImage")})`
    });
}

/**
 * Adds default duration to pomodoro, long break and short break timer to the document and stores it in local storage variable "pomodoroTime", "shortBreakTime", "longBreakTime"
 */
function addDefaultTimer() {
    if (!localStorage.getItem("pomodoroTime")) localStorage.setItem("pomodoroTime", "45");
    if (!localStorage.getItem("shortBreakTime")) localStorage.setItem("shortBreakTime", "5");
    if (!localStorage.getItem("longBreakTime")) localStorage.setItem("longBreakTime", "15");
}

/**
 * Adds a default sound upon timer finish to the document and stores it in local storage variable "sound"
 */
function addDefaultSound() {
    if (!localStorage.getItem("sound")) localStorage.setItem("sound", "/sound/bell.mp3");
}

/**
 * Adds a default font family to the document and stores it in local storage variable "font"
 */
function addDefaultFont() {
    let temp: any = localStorage.getItem("font");

    if (!localStorage.getItem("font")) localStorage.setItem("font", "poppins");
    $("*").removeClass("poppins");
    $("*").removeClass("playfair");
    $("*").removeClass("aleo");
    $("*").addClass(temp);
}