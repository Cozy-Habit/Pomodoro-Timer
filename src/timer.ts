import { displayStartButton, displayTime } from "./display.js";
import { timerButtons } from './timerButtons.js';

export let isRunning = false;
let timer: any = null;
export let counter = 0;
export let timeStamp = 0;

export function clearTimeStamp() {
    timeStamp = 0;
}

export function setTimeStamp(counter: number) {
    timeStamp = counter;
}

export function stopTimer() {
    isRunning = false;
    clearTimeStamp();
    clearInterval(timer);
    displayStartButton();
}

export function pauseTimer() {
    isRunning = false;
    timeStamp = counter;
    clearInterval(timer);
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

export function startCounter(duration: number) {
    if (!isRunning) {
        //CALCULATE MS
        counter = timeStamp != 0 ? timeStamp : duration;
        //START TIMER
        timer = setInterval(() => {
            counter--;
            displayTime(counter);
            if (counter == 0) timerDone();
        }, 1000);
    }
}

export function setCounterTo(counterInSeconds: number) {
    counter = counterInSeconds
    displayTime(counter)
}