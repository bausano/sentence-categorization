// This module contains logic for the text editor where user can type their
// text before they go and categorize the sentence.

// ------------------------------- Constants -----------------------------------

// ------------------------------- Settings ------------------------------------

// The id attribute of the html element where the user types in their sentence.
const EDITOR_ID = 'editor-input'
// The id attribute of the html element which displays hints.
const HINT_ID = 'hint'
// The class attribute of child of HINT_ID which informs the user where to type.
const HINT_START_TYPING_CLASS = 'start-typing'
// The class attribute of child of HINT_ID which informs the user that they can
// press enter to proceed.
const HINT_PRESS_ENTER_CLASS = 'press-enter'
// There are some actions that happen on the page, like displaying or hiding the
// hints. Unless they're crucial in timing, we can use the default timing value.
const ACTION_TIMEOUT_MS = 1500

// ------------------------------- HTML Elements -------------------------------

const input = document.getElementById(EDITOR_ID)
const hint = document.getElementById(HINT_ID)
const hints = {
    startTyping: {
        el: hint.querySelector(`.${HINT_START_TYPING_CLASS}`),
        isDisplayed: true,
    },
    pressEnter: {
        el: hint.querySelector(`.${HINT_PRESS_ENTER_CLASS}`),
    },
}

// ------------------------------- Listeners -----------------------------------

// TODO: My phone does not support this event very well.
input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        console.log('TODO: Enter was pressed.')
        // And we hide the third hint.
        hints.pressEnter.el.style.display = 'none'
        e.preventDefault()
    }
})

input.addEventListener('keypress', () => {
    if (hints.startTyping.isDisplayed) {
        hints.startTyping.isDisplayed = false
        // TODO: Animate fade out.
        setTimeout(() => {
            hints.startTyping.el.style.display = 'none'
            // We swap the first hint for another one.
            setTimeout(() => hints.pressEnter.el.style.display = 'block', ACTION_TIMEOUT_MS)
        }, ACTION_TIMEOUT_MS)

    }
})
