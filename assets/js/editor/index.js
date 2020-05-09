// This module contains logic for the text editor where user can type their
// text before they go and categorize the sentence.

import { splitIntoTerms } from './Term'

// ------------------------------- Constants -----------------------------------
const CATEGORIES = [
    { name: 'Bez kategorie', short: null, id: 0 },
    {
        name: 'Podmět',
        short: 'Pod.',
        id: 1,
    },
    {
        group: 'Přísudek',
        name: 'slovesný',
        short: 'Př.',
        id: 2
    },
    {
        group: 'Přísudek',
        name: 'jmenný',
        short: 'Př. jm.',
        id: 3
    },
    {
        group: 'Přísudek',
        name: 'slovesně jmenný',
        short: 'Př. jm. se sp.',
        id: 4
    },
    {
        name: 'Dolněk',
        short: 'Do.',
        id: 5,
    },
    {
        group: 'Příslovečné určení',
        name: 'místa',
        short: 'Pří. urč. mís.',
        id: 6,
    },
    {
        group: 'Příslovečné určení',
        name: 'času',
        short: 'Pří. urč. č.',
        id: 7,
    },
    {
        group: 'Příslovečné určení',
        name: 'způsobu',
        short: 'Pří. urč. zp.',
        id: 8,
    },
    {
        group: 'Příslovečné určení',
        name: 'příčiny',
        short: 'Pří. urč. příč.',
        id: 9,
    },
    {
        group: 'Příslovečné určení',
        name: 'míry',
        short: 'Pří. urč. mír.',
        id: 10,
    },
    {
        group: 'Příslovečné určení',
        name: 'účelu',
        short: 'Pří. urč. úč.',
        id: 11,
    },
    {
        group: 'Příslovečné určení',
        name: 'přípustky',
        short: 'Pří. urč. příp.',
        id: 12,
    },
    {
        group: 'Příslovečné určení',
        name: 'podmínky',
        short: 'Pří. urč. pod.',
        id: 13,
    },
    {
        name: 'Předmět',
        short: 'Před.',
        id: 14,
    },
    {
        group: 'Přívlastek',
        children: [
            {
                group: 'Přívlastek',
                name: 'shodný',
                short: 'Přív. shod',
                id: 15,
            },
            {
                group: 'Přívlastek',
                name: 'neshodný',
                short: 'Přív. neshod',
                id: 16,
            },
        ]
    },
]

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
// There are some actions that happen on the page, like displaying or hiding the
// hints. Unless they're crucial in timing, we can use the default timing value.
const ACTION_TIMEOUT_MS = 1500
// The id attribute of the html element where the user selects categories.
const EDITOR_CATEGORIZER_ID = 'editor-categorizer'

// ------------------------------- HTML Elements -------------------------------

const input = document.getElementById(EDITOR_INPUT_ID)
const hint = document.getElementById(HINT_ID)
const categorizer = document.getElementById(EDITOR_CATEGORIZER_ID)
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
    if (e.code === 'Enter' && categorizer.style.display !== 'block') {
        e.preventDefault()
        // And we hide the third hint.
        hints.pressEnter.el.style.display = 'none'

        // Grab all terms from the sentence.
        const terms = splitIntoTerms(input.textContent)
        for (const term of terms) {
            categorizer.appendChild(term.termNode(CATEGORIES))
        }
        input.style.display = 'none'
        categorizer.style.display = 'block'
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
