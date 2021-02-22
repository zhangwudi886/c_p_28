let puppeteer = require('puppeteer');
let debug = require('debug')("crawl:read_tags")

let read_tags = async () =>{
    let url = 'https://juejin.cn/subscribe/all';
    let browser = await puppeteer.launch({
        headless:true,
        defaultViewport:null
    })
    let page = await browser.newPage();
    await page.goto(url,{
        waitUntil:'networkidle0'
    })
    // await page.waitFor(100000);
    let tag_lists = await page.$$eval('div.tag-list-box>ul.tag-list>li.item',li_s=>{
        return li_s.map(li=>{
            let _div = li.querySelector('div.tag')
            let _a = _div.querySelector('div.info-box>a')
            let _img = _a.querySelector('img')
            let _info = _div.querySelector('div.info-box>div.meta-box')
            let subscribe = _info.querySelector('div.subscribe')
            let article = _info.querySelector('div.article')
            return {
                title:_a.innerText,
                href:decodeURI(_a.href),
                subscribe:subscribe.innerText.replace(/([0-9]+).+/,'$1'),
                article:article.innerText.replace(/([0-9]+).+/,'$1'),
                tag_id:_div.getAttribute('st:state'),
                imgsrc:_img.dataset["src"],
            }
        })
        
    })
    await page.close()
    return tag_lists
}

module.exports = read_tags