const {JSDOM}  = require("jsdom")
const axios = require('axios');
async function crawlPage(baseURL,currentURL,pages){
    const response = await axios.get(currentURL);
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if (baseURLObj.hostname !== currentURLObj.hostname ) {
        return pages
    }
    const normalizeCurrentURL = normalizeURL(currentURL)
    if (pages[normalizeCurrentURL]>0){
        pages[normalizeCurrentURL]++
        return pages
    }
    pages[normalizeCurrentURL] = 1
    try {
        if (response.status > 399){
            console.log('error in fetch with this status code');
            return pages
        }
        const htmlBody = await response.data
        nextUrls = getURLSFromHTML(htmlBody,baseURL)
        for (const nextUrl of nextUrls){
            pages = await crawlPage(baseURL,nextUrl,pages)
        }
    } catch (err) {
        console.log(err.message +'on the page' + currentURL);
        return pages
    }
    return pages
   
}


function getURLSFromHTML(htmlBody,baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
   const linkElements = dom.window.document.querySelectorAll('a')
    for (let linkElement of linkElements){
        if(linkElement.href.slice(0,1) === '/'){
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
                
            } catch (error) {
               console.log(error.message); 
            }
           
        }else{
            try {
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href);          
            } catch (error) {
               console.log(error.message); 
            }
        }
    }
    return urls
}

function normalizeURL(urlstring){
    const urlObj = new URL(urlstring)
    const hostPath =`${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length>0 && hostPath.slice(-1) === '/'){
           return hostPath.slice(0,-1)
    }
    return hostPath
}
module.exports ={
    normalizeURL,
    getURLSFromHTML,
    crawlPage
}