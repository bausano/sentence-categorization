import { expect } from 'chai'
import { Term, splitIntoTerms } from '../js/editor/Term'

describe('splitIntoTerms', () => {
    it('splits words by space', () => {
        expect(splitIntoTerms('Mary had a little lamb'))
            .to.deep.equal([c('Mary'), n(' '), c('had'), n(' '), c('a'), n(' '), c('little'), n(' '), c('lamb')])
    })

    it('considers comma as standalone term', () => {
        expect(splitIntoTerms('Rather odd, isn\'t it'))
            .to.deep.equal([c('Rather'), n(' '), c('odd'), n(','), n(' '), c('isn\'t'), n(' '), c('it')])
    })

    it('considers question marks as standalone term', () => {
        expect(splitIntoTerms('What hath God wrought?'))
            .to.deep.equal([c('What'), n(' '), c('hath'), n(' '), c('God'), n(' '), c('wrought'), n('?')])
    })

    it('considers exclamation marks as standalone term', () => {
        expect(splitIntoTerms('Boom!'))
            .to.deep.equal([c('Boom'), n('!')])
    })

    it('considers dot as standalone term', () => {
        expect(splitIntoTerms('Splash.'))
            .to.deep.equal([c('Splash'), n('.')])
    })

    it('filters out multiple spaces', () => {
        expect(splitIntoTerms('Here    there'))
            .to.deep.equal([c('Here'), n(' '), c('there')])
    })

    it('filters out new lines', () => {
        expect(splitIntoTerms('\n After new line'))
            .to.deep.equal([c('After'), n(' '), c('new'), n(' '), c('line')])
    })
})

/**
 * Creates a new categorizable term.
 * @param {string} word
 */
function c(word) {
    return new Term(word, true)
}

/**
 * Creates a new not categorizable term.
 * @param {string} text
 */
function n(text) {
    return new Term(text, false)
}
