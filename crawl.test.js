const {normalizeURL,getURLSFromHTML} = require('./crawl')
const {test,expect} = require("@jest/globals")

test('getURLSFromHTML', () => { 
    const inputHtml =`<html><body><a href="https://www.youtube.com/">salam</a></body></html>`
    const baseURL = 'https://www.youtube.com'
    const output = getURLSFromHTML(inputHtml,baseURL)
    const expected = ['https://www.youtube.com/']
    expect(output).toEqual(expected)
})

test('normalizeURL', () => { 
     const input = 'https://www.youtube.com'
     const output = normalizeURL(input)
     const expected = 'www.youtube.com'
     expect(output).toEqual(expected)
 })

