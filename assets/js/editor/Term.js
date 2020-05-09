import { CategorySelector } from "./CategorySelector"

/**
 * A term is a stand alone part of a sentence. The goal of this abstraction is
 * to separate standalone words which can be categorized and other constructs
 * such as question marks, spaces, exclamation marks, commas, dots etc.
 *
 * Given sentence "Mary had a little lamb.", the terms would be
 * `["Mary", " ", "had", " ", "a", " ", "little", " ", "lamb", "."]` and
 * categorizable would be `["Mary", "had", "a", "little", "lamb"]`.
 */
export class Term {
    /**
     * Creates a new sentence term. It stores information that the user input.
     *
     * @param {array} categorySelector
     * @param {string} text What text does this term represent. It can be a
     *                      word, space, a comma, question mark, etc
     * @param {boolean} isCategorizable Whether this term is grammatically
     *                                  categorizable. Has to be a word
     */
    constructor(categorySelector, text, isCategorizable) {
        this.category = null
        this.text = text
        this.categorySelector = categorySelector

        if (!isCategorizable) {
            this.node = document.createTextNode(this.text)
        } else {
            this.node = createCategorizableNode(this)
        }
    }

    /**
     * Updates the category of this term.
     *
     * @param {number|string} id The id of the category
     * @param {string} shortName The string to display above the term
     * @param {string[]} classes Additional classes to assign to the term
     */
    updateCategory(id, shortName, classes) {
        this.category = id
        classes.push('is-categorizable')

        const categoryNode = this.node.querySelector('.category')
        if (!shortName) {
            this.node.setAttribute('class', 'is-categorizable is-cat-0')
            // Removes the child span if it exists.
            categoryNode.lastChild
                && categoryNode.removeChild(categoryNode.lastChild)
        } else if (categoryNode.lastChild) {
            this.node.setAttribute('class', classes.join(' '))
            categoryNode.lastChild.textContent = shortName
        } else {
            this.node.setAttribute('class', classes.join(' '))
            const catSpan = document.createElement('span')
            catSpan.textContent = shortName
            categoryNode.appendChild(catSpan)
        }
    }
}

/**
 * @param {CategorySelector} categorySelector
 * @param {string} sentence An input sentence which will be split into terms
 * @returns {Term[]} Ordered list of terms
 */
export function splitIntoTerms(categorySelector, sentence) {
    return sentence
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((part, i, a) => {
            const terms = []

            // If the part is equal to "end.", "end!" or "end?", then this regex
            // will match and capture "end" as first group and the sign as
            // second group.
            const separateWordAndTrailingSign = /(.+)(\!|\.|\,|\?)$/.exec(part)
            if (separateWordAndTrailingSign !== null) {
                terms.push(new Term(categorySelector, separateWordAndTrailingSign[1], true))
                terms.push(new Term(categorySelector, separateWordAndTrailingSign[2], false))
            } else {
                terms.push(new Term(categorySelector, part, true))
            }

            const isLastEl = a.length - 1 === i
            if (!isLastEl) {
                terms.push(new Term(categorySelector, ' ', false))
            }

            return terms
        })
        .flat()
}

/**
 * Creates a new HTML node for given term text, and adds a listener which calls
 * given closure when user updates category.
 *
 * @param {Term} term
 * @return {HTMLDivElement}
 */
function createCategorizableNode(term) {
    const termNode = document.createElement('div')
    termNode.classList.add('is-categorizable')
    termNode.classList.add('is-cat-0')

    const categoryNode = document.createElement('div')
    categoryNode.classList.add('category')
    termNode.appendChild(categoryNode)

    const termNameNode = document.createElement('div')
    termNameNode.textContent = term.text
    termNode.appendChild(termNameNode)

    termNameNode.addEventListener('click', (_) => {
        term.categorySelector.termClicked(term)
    })

    termNode.addEventListener('mouseenter', (_) => {
        term.categorySelector.termHovered(term)
    })

    return termNode
}
