// This module contains logic for the text editor where user can type their
// text before they go and categorize the sentence.

import { splitIntoTerms } from './Term'
import { CategorySelector } from './CategorySelector'

// ------------------------------- Settings ------------------------------------

// The id attribute of the html element where the user types in their sentence.
const EDITOR_INPUT_ID = 'editor-input'
// The id attribute of the html element which displays hints.
const HINT_ID = 'hint'
// The class attribute of child of HINT_ID which informs the user where to type.
const HINT_START_TYPING_CLASS = 'start-typing'
// The class attribute of child of HINT_ID which informs the user that they can
// press enter to proceed.
const HINT_PRESS_ENTER_CLASS = 'press-enter'
// The class attribute of child of HINT_ID which informs the user that they can
// start clicking/hovering/selecting the words and categorize them.
const HINT_START_CATEGORIZING = 'start-categorizing'
// There are some actions that happen on the page, like displaying or hiding the
// hints. Unless they're crucial in timing, we can use the default timing value.
const ACTION_TIMEOUT_MS = 1500
// The id attribute of the html element where the user selects categories.
const EDITOR_CATEGORIZER_ID = 'editor-categorizer'
// The id attribute of the html element where the user clicks on category name.
const CATEGORY_SELECTOR_ID = 'select-category'

// ------------------------------- HTML Elements -------------------------------

const input = document.getElementById(EDITOR_INPUT_ID)
const hint = document.getElementById(HINT_ID)
const categorizer = document.getElementById(EDITOR_CATEGORIZER_ID)
const categorySelector = new CategorySelector(CATEGORY_SELECTOR_ID)
const hints = {
    startTyping: {
        el: hint.querySelector(`.${HINT_START_TYPING_CLASS}`),
        isDisplayed: true,
    },
    pressEnter: hint.querySelector(`.${HINT_PRESS_ENTER_CLASS}`),
    startCategorizing: hint.querySelector(`.${HINT_START_CATEGORIZING}`),
}

// ------------------------------- Listeners -----------------------------------

// TODO: My phone does not support this event very well.
input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && categorizer.classList.contains('hidden')) {
        e.preventDefault()
        // We hide the second hint.
        hints.pressEnter.classList.remove('fade-in')

        // Grab all terms from the sentence.
        const terms = splitIntoTerms(categorySelector, input.textContent)
        for (const term of terms) {
            categorizer.appendChild(term.node)
        }

        // Hides the input and shows the categorization screen.
        input.classList.add('hidden')
        categorizer.classList.remove('hidden')

        // Animation for the third hint.
        setTimeout(() => {
            hint.removeChild(hints.pressEnter)
            hints.startCategorizing.classList.add('fade-in')

            // And hide the hint after a bit again.
            setTimeout(() => {
                hints.startCategorizing.classList.remove('fade-in')
            }, 4 * ACTION_TIMEOUT_MS)
        }, ACTION_TIMEOUT_MS)
    }
})

input.addEventListener('keypress', () => {
    if (hints.startTyping.isDisplayed) {
        hints.startTyping.isDisplayed = false
        // Animates fading out effect.
        hints.startTyping.el.classList.add('fade-out')
        setTimeout(() => {
            // We swap the first hint for another one.
            setTimeout(() => {
                hints.pressEnter.classList.add('fade-in')
            }, ACTION_TIMEOUT_MS)

            // Remove the previous one.
            hints.startTyping.el.classList.add('hidden')
            hint.removeChild(hints.startTyping.el)
        }, ACTION_TIMEOUT_MS)
    }
})
