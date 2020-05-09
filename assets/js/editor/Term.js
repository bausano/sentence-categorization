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
     * @param {array} categoryTree Categories which can be attributed
     * @param {string} text What text does this term represent. It can be a
     *                      word, space, a comma, question mark, etc
     * @param {boolean} isCategorizable Whether this term is grammatically
     *                                  categorizable. Has to be a word
     */
    constructor(categoryTree, text, isCategorizable) {
        this.category = null
        this.text = text
        if (!isCategorizable) {
            this.node = document.createTextNode(this.text)
        } else {
            this.node = createCategorizableNode(
                categoryTree, text, v => this.updateCategory(v)
            )
        }

        // Read only reference to the global category object.
        this.categoryTree = categoryTree
    }

    /**
     * Updates the category of this term.
     *
     * @param {number|string} id The id of the category
     */
    updateCategory(id) {
        this.category = id

        let shortName = null
        const classes = ['is-categorizable']
        for (const cat of this.categoryTree) {
            if (cat.hasOwnProperty('children')) {
                const child = cat.children.find(c => c.id == id)
                if (child) {
                    classes.push(...cat.classes)
                    shortName = child.shortName
                    break
                }
            } else if (cat.id == id) {
                classes.push(...(cat.classes || ['is-cat-0']))
                shortName = cat.shortName
                break
            }
        }

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
 * @param {array} categoryTree Categories which can be attributed
 * @param {string} sentence An input sentence which will be split into terms
 * @returns {Term[]} Ordered list of terms
 */
export function splitIntoTerms(categoryTree, sentence) {
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
                terms.push(new Term(categoryTree, separateWordAndTrailingSign[1], true))
                terms.push(new Term(categoryTree, separateWordAndTrailingSign[2], false))
            } else {
                terms.push(new Term(categoryTree, part, true))
            }

            const isLastEl = a.length - 1 === i
            if (!isLastEl) {
                terms.push(new Term(categoryTree, ' ', false))
            }

            return terms
        })
        .flat()
}

/**
 * Creates a new HTML node for given term text, and adds a listener which calls
 * given closure when user updates category.
 *
 * @param {array} categoryTree Global tree of all categories
 * @param {string} text The term text
 * @param {(value: number) => void} selectChanged A hook for when user selects category
 * @return {HTMLDivElement}
 */
function createCategorizableNode(categoryTree, text, selectChanged) {
    const termNode = document.createElement('div')
    termNode.classList.add('is-categorizable')
    termNode.classList.add('is-cat-0')

    const categoryNode = document.createElement('div')
    categoryNode.classList.add('category')
    termNode.appendChild(categoryNode)

    const termNameNode = document.createElement('div')
    termNameNode.textContent = text
    termNode.appendChild(termNameNode)

    const selectNode = document.createElement('div')
    selectNode.classList.add('select-category')
    selectNode.classList.add('hidden')

    const select = document.createElement('select')
    for (const cat of categoryTree) {
        if (cat.hasOwnProperty('children')) {
            const optGroup = document.createElement('optgroup')
            optGroup.setAttribute('label', cat.name)
            for (const child of cat.children) {
                optGroup.appendChild(
                    createCategoryOption(child.id, child.name, child.shortName)
                )
            }
            select.appendChild(optGroup)
        } else {
            select.appendChild(
                createCategoryOption(cat.id, cat.name, cat.shortName)
            )
        }
    }

    selectNode.appendChild(select)
    termNode.appendChild(selectNode)

    // When the select input is changed, update the category appropriately.
    select.addEventListener('change', (_) => {
        selectNode.classList.add('hidden')
        selectChanged(select.value)
    })

    // Shows the select category box when the term is clicked.
    termNameNode.addEventListener('click', (_) => selectNode.classList.toggle('hidden'))

    return termNode
}

/**
 * Creates new HTML node for option.
 *
 * @param {number} id
 * @param {string} name
 * @param {string} shortName Appends this text to attribute "data-short-name"
 */
function createCategoryOption(id, name, shortName) {
    const option = document.createElement('option')
    option.setAttribute('value', id)
    option.setAttribute('data-short-name', shortName)
    option.text = name
    return option
}
