export const timerButtons: any = {
    pomodoroBtn: {
        active: true,
        localStorageKey: "pomodoroTime"
    },
    shortBreakBtn: {
        active: false,
        localStorageKey: "shortBreakTime"
    },
    longBreakBtn: {
        active: false,
        localStorageKey: "longBreakTime"
    }
}

/**
 * Sets for all properties contained in object @see timerButtons the property 'active' to false, except for the buttonId provided for @param buttonId which is set to true. Afterwards the @param buttonId is used to add CSS styling to the buttons
 * @param {string} buttonId id of the HTML button that should become active
 */
export function setButtonToActive(buttonId: string) {
    for (const key in timerButtons) {
        if (key == buttonId) timerButtons[key].active = true;
        else timerButtons[key].active = false;
    }

    addActiveClass(buttonId);
}

/**
 * Removes CSS class .active from timer buttons except for the button with id = buttonId
 * @param {*} buttonId id of the HTML button that should receive CSS class .active 
 */
export function addActiveClass(buttonId: string) {
    $("#containerTimerButtons").children().removeClass("active");
    $(`#${buttonId}`).addClass("active");
}

/**
 * Sets local storage variables of all timers to default values
 */
export function resetTimerButtons() {
    localStorage.setItem("pomodoroTime", "45");
    localStorage.setItem("shortBreakTime", "5");
    localStorage.setItem("longBreakTime", "15");
}