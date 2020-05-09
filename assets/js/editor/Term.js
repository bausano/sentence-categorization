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
     * @param {string} text What text does this term represent. It can be a
     *                      word, space, a comma, question mark, etc
     * @param {boolean} isCategorizable Whether this term is grammatically
     *                                  categorizable. Has to be a word
     */
    constructor(text, isCategorizable) {
        this.category = null
        this.text = text
        this.isCategorizable = isCategorizable
    }

    /**
     * Creates a new HTMLElement node which can be inserted into the document
     * and used to categorize this term.
     *
     * @param {array} categories Categories which can be attributed
     * @return {HTMLElement}
     */
    termNode(categories) {
        if (this.node) {
            return this.node
        }

        const termTextNode = document.createTextNode(this.text)

        if (!this.isCategorizable) {
            return termTextNode
        }

        // Stores the reference to the object of categories.
        this.categories = categories

        const termNode = document.createElement('div')
        termNode.classList.add('is-categorizable')
        termNode.classList.add('is-uncategorized')

        const categoryNode = document.createElement('div')
        categoryNode.classList.add('category')
        termNode.appendChild(categoryNode)

        const termNameNode = document.createElement('div')
        termNameNode.appendChild(termTextNode)
        termNode.appendChild(termNameNode)

        const selectNode = document.createElement('div')
        selectNode.classList.add('select-category')
        const select = document.createElement('select')

        // Maps group names to their html nodes.
        const groups = {}
        for (const category of categories) {
            const option = document.createElement('option')
            option.setAttribute('value', category.id)
            option.text = category.name

            if (category.hasOwnProperty('group')) {
                // Creates the optgroup if it doesn't exist yet.
                if (!groups[category.group]) {
                    const optGroup = document.createElement('optgroup')
                    optGroup.setAttribute('label', category.group)
                    select.appendChild(optGroup)
                    groups[category.group] = optGroup
                }
                groups[category.group].appendChild(option)
            } else {
                select.appendChild(option)
            }
        }

        selectNode.appendChild(select)
        termNode.appendChild(selectNode)

        // When the select input is changed, update the category appropriately.
        select.addEventListener('change', (_) => this.updateCategory(select.value))

        // Remembers this node as the term node.
        this.node = termNode

        return termNode
    }

    /**
     * Updates the category of this term.
     *
     * @param {number} id The id of the category
     */
    updateCategory(id) {
        this.category = id
        const short = this.categories.find(c => c.id == id).short
        const categoryNode = this.node.querySelector('.category')

        if (!short) {
            categoryNode.removeChild(categoryNode.lastChild)
        } else if (categoryNode.lastChild) {
            categoryNode.lastChild.textContent = short
        } else {
            const catSpan = document.createElement('span')
            catSpan.textContent = short
            categoryNode.appendChild(catSpan)
        }
    }
}

/**
 * @param {string} sentence An input sentence which will be split into terms
 * @returns {Term[]} Ordered list of terms
 */
export function splitIntoTerms(sentence) {
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
                terms.push(new Term(separateWordAndTrailingSign[1], true))
                terms.push(new Term(separateWordAndTrailingSign[2], false))
            } else {
                terms.push(new Term(part, true))
            }

            const isLastEl = a.length - 1 === i
            if (!isLastEl) {
                terms.push(new Term(' ', false))
            }

            return terms
        })
        .flat()
}
