let puppeteer = require('puppeteer');
let debug = require('debug')("crawl:read_articles_detail")

let read_article_detail = async (articles_list) =>{
    let browser = await puppeteer.launch({
        headless:true,
        defaultViewport:null
    })
    let tag_artitcle_details =[];
    for(let article_item of articles_list){
        debug(`开始读取文章${article_item.title}`)
        let page = await browser.newPage();
        await page.goto(article_item.href,{
            waitUntil:'networkidle0'
        })

        let article_detail = await page.$eval('article.article',article=>{
            let article_id = article.dataset["entryId"]
            let _title = article.querySelector('h1.article-title')
            let content = article.querySelector('div.article-content')
            return {
                article_id,
                title:_title.innerText,
                content:content.innerHTML,
            }
        })

        await page.close();
        tag_artitcle_details.push(article_detail)
        
    }
    return tag_artitcle_details;
}

module.exports = read_article_detail