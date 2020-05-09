import { expect } from 'chai'
import { splitIntoTerms } from '../js/editor/Term'

describe('splitIntoTerms', () => {
    it('splits words by space', () => {
        expect(splitIntoTerms([], 'Mary had a little lamb').map(t => t.text))
            .to.deep.equal(['Mary', ' ', 'had', ' ', 'a', ' ', 'little', ' ', 'lamb'])
    })

    it('considers comma as standalone term', () => {
        expect(splitIntoTerms([], 'Rather odd, isn\'t it').map(t => t.text))
            .to.deep.equal(['Rather', ' ', 'odd', ',', ' ', 'isn\'t', ' ', 'it'])
    })

    it('considers question marks as standalone term', () => {
        expect(splitIntoTerms([], 'What hath God wrought?').map(t => t.text))
            .to.deep.equal(['What', ' ', 'hath', ' ', 'God', ' ', 'wrought', '?'])
    })

    it('considers exclamation marks as standalone term', () => {
        expect(splitIntoTerms([], 'Boom!').map(t => t.text))
            .to.deep.equal(['Boom', '!'])
    })

    it('considers dot as standalone term', () => {
        expect(splitIntoTerms([], 'Splash.').map(t => t.text))
            .to.deep.equal(['Splash', '.'])
    })

    it('filters out multiple spaces', () => {
        expect(splitIntoTerms([], 'Here    there').map(t => t.text))
            .to.deep.equal(['Here', ' ', 'there'])
    })

    it('filters out new lines', () => {
        expect(splitIntoTerms([], '\n After new line').map(t => t.text))
            .to.deep.equal(['After', ' ', 'new', ' ', 'line'])
    })
})
