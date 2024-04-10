import { displayStartButton, displayTime } from "./display.js";
import { timerButtons } from './timerButtons.js';

export let isRunning = false;
let timer: any = null;
export let counter = 0;
export let timeStamp = 0;

export function clearTimeStamp() {
    timeStamp = 0;
}

export function stopTimer() {
    isRunning = false;
    clearInterval(timer);
    clearTimeStamp();
    displayStartButton();
}

export function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    timeStamp = counter;
    displayStartButton();
}

export function timerDone() {
    stopTimer();

    let temp: any = localStorage.getItem("sound");

    let audio = new Audio(`/sound/${temp}.mp3`);
    audio.play();

    for (const key in timerButtons) {
        if (timerButtons[key].active) {
            let temp2: any = localStorage.getItem(timerButtons[key].localStorageKey);
            displayTime(temp2 * 60);
            break;
        }
    }
}

export function startCounter(duration: any) {
    if (!isRunning) {
        //CALCULATE MS
        counter = timeStamp != 0 ? timeStamp : duration * 60;
        //START TIMER
        timer = setInterval(() => {
            counter--;
            displayTime(counter);
            if (counter == 0) timerDone();
        }, 1000);
    }
}