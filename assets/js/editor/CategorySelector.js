// TODO: Hide selector when mouseout.
// TODO: Hide selector when click out.
// TODO: Make selectedTerm.term an array to allow for selecting text.

/**
 * Enumeration of events.
 */
const EVENT = {
    CLICKED: 1,
    HOVERED: 2,
}

export class CategorySelector {
    /**
     * Creates a new selector object, which will be bound to given HTML el.
     * @param {string} selectorId
     */
    constructor(selectorId) {
        this.node = document.getElementById(selectorId)
        this.node.addEventListener('click', ({ target }) => {
            if (!this.selectedTerm) {
                return
            }

            const id = target.getAttribute('data-id')
            if (id === undefined || id === null) {
                return
            }

            const shortName = target.getAttribute('data-short-name')
            const classes = target.getAttribute('data-classes')
            this.selectedTerm.term.updateCategory(id, shortName, classes.split(' '))
            this.node.classList.add('hidden')
        })
    }

    /**
     * When a term is clicked, this method is called. Click takes precedence
     * to a mouseover event and locks the selector.
     *
     * @param {Term} term
     */
    termClicked(term) {
        this.selectedTerm = {
            event: EVENT.CLICKED,
            term
        }

        this.positionSelf(term)
    }

    /**
     * When a term is hovered over, this method is called. This method won't
     * update the selected term if the previous term was more than just hovered
     * over.
     *
     * @param {Term} term
     */
    termHovered(term) {
        if (this.selectedTerm && this.selectedTerm.event !== EVENT.HOVERED) {
            return
        }

        this.selectedTerm = {
            event: EVENT.HOVERED,
            term
        }

        this.positionSelf(term)
    }

    /**
     * Positions the selector under the given term.
     * @param {Term} term
     */
    positionSelf(term) {
        const centerX = term.node.offsetLeft + term.node.offsetWidth / 2
        this.node.classList.remove('hidden')
        this.node.style.left = `${centerX - this.node.offsetWidth / 2}px`
        this.node.style.top = `${term.node.offsetTop + term.node.offsetHeight}px`
    }
}
