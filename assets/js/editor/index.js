// This module contains logic for the text editor where user can type their
// text before they go and categorize the sentence.

import { splitIntoTerms } from './Term'

// ------------------------------- Constants -----------------------------------
const CATEGORY_TREE = [
    {
        id: 0,
        name: 'Bez kategorie',
        shortName: null,
        class: null,
    },
    {
        id: 1,
        name: 'Podmět',
        shortName: 'Pod.',
        classes: ['is-cat-1'],
    },
    {
        name: 'Přísudek',
        classes: ['is-cat-2'],
        children: [
            { name: 'slovesný', shortName: 'Př.', id: 2 },
            { name: 'jmenný', shortName: 'Př. jm.', id: 3 },
            { name: 'slovesně jmenný', shortName: 'Př. jm. se sp.', id: 4 },
        ],
    },
    {
        id: 5,
        name: 'Doplněk',
        shortName: 'Do.',
        classes: ['is-cat-3'],
    },
    {
        name: 'Příslovečné určení',
        classes: ['is-cat-4'],
        children: [
            { name: 'místa', shortName: 'Pří. urč. mís.', id: 6 },
            { name: 'času', shortName: 'Pří. urč. č.', id: 7 },
            { name: 'způsobu', shortName: 'Pří. urč. zp.', id: 8 },
            { name: 'příčiny', shortName: 'Pří. urč. příč.', id: 9 },
            { name: 'míry', shortName: 'Pří. urč. mír.', id: 10 },
            { name: 'účelu', shortName: 'Pří. urč. úč.', id: 11 },
            { name: 'přípustky', shortName: 'Pří. urč. příp.', id: 12 },
            { name: 'podmínky', shortName: 'Pří. urč. pod.', id: 13 },
        ],
    },
    {
        id: 14,
        name: 'Předmět',
        shortName: 'Před.',
        classes: ['is-cat-5'],
    },
    {
        name: 'Přívlastek',
        classes: ['is-cat-6'],
        children: [
            { name: 'shodný', shortName: 'Přív. shod.', id: 15 },
            { name: 'neshodný', shortName: 'Přív. neshod.', id: 16 },
        ],
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
    if (e.code === 'Enter' && categorizer.classList.contains('hidden')) {
        e.preventDefault()
        // And we hide the third hint.
        hints.pressEnter.el.classList.add('hidden')

        // Grab all terms from the sentence.
        const terms = splitIntoTerms(CATEGORY_TREE, input.textContent)
        for (const term of terms) {
            categorizer.appendChild(term.node)
        }
        input.classList.add('hidden')
        categorizer.classList.remove('hidden')
    }
})

input.addEventListener('keypress', () => {
    if (hints.startTyping.isDisplayed) {
        hints.startTyping.isDisplayed = false
        // TODO: Animate fade out.
        setTimeout(() => {
            hints.startTyping.el.classList.add('hidden')
            // We swap the first hint for another one.
            setTimeout(() => hints.pressEnter.el.classList.remove('hidden'), ACTION_TIMEOUT_MS)
        }, ACTION_TIMEOUT_MS)

    }
})
