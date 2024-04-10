/**
 * Displays the timer in H:MM:SS format if amount of minutes is greater than 59. Everything below will be displayed in MM:SS format. Minutes should be transformed into milliseconds as @param timeInMs
 * @param {*} timeInMs takes time as milliseconds
 */
export function displayTime(timeInMs: any) {
    let hours: number = Math.floor(Number(timeInMs) / 60 / 60);
    let minutes: number = Math.floor(Number(timeInMs) / 60 % 60);
    let seconds: number = Number(timeInMs) % 60;

    let hoursString: string = hours.toString();
    let minutesString: string = minutes.toString().padStart(2, "0");
    let secondsString: string = seconds.toString().padStart(2, "0");

    if (hours > 0) {
        $("#time").text(`${hoursString}:${minutesString}:${secondsString}`);
        $("title").text(`${hoursString}:${minutesString}:${secondsString} Aesthetic Pomodoro Timer`);
    }
    else {
        $("#time").text(`${minutesString}:${secondsString}`);
        $("title").text(`${minutesString}:${secondsString} Aesthetic Pomodoro Timer`);
    }
}

/**
 * Displays the start button and hides the pause button
 */
export function displayStartButton() {
    $("#startBtn").show();
    $("#pauseBtn").hide();
}

/**
 * Displays the pause button and hides the start button
 */
export function displayPauseButton() {
    $("#startBtn").hide();
    $("#pauseBtn").show();
}

/**
 * Displays the modal and darkens the background
 */
export function displayModal() {
    $("#modalSettings").show();
    $("#overlay").show();
}

/**
 * Hides the modal and lightens the background
 */
export function hideModal() {
    $("#modalSettings").hide();
    $("#overlay").hide();
}