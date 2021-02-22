let puppeteer = require('puppeteer');
let debug = require('debug')("crawl:read_tag_articles")

let read_tag_articles = async (tag_lists) =>{
    let browser = await puppeteer.launch({
        headless:true,
        defaultViewport:null
    })
    let tag_artitcle_list =[];
    for(let tag of tag_lists){
        let page = await browser.newPage();
        await page.goto(tag.href,{
            waitUntil:'networkidle0'
        })

        let tag_articles = await page.$$eval('ul.entry-list.entry-list>div>li',li_s=>{
            return li_s.map(li=>{
                let divWrap = li.querySelector('div.entry-box div.entry')
                let contentWrap = divWrap.querySelector('div.content-box div.info-box')
                let tagWrap = contentWrap.querySelectorAll('div.meta-row ul.meta-list li.tag a')

                let tag_ids = [];
                let tag_names = [];
                tagWrap.forEach(tag => {
                    tag_ids.push(tag.getAttribute('st:state').trim());
                    tag_names.push(tag.innerText.trim())
                });
                let title_ele = contentWrap.querySelector('div.title-row a')
                return {
                    article_id:divWrap.dataset.entryId,
                    tags_id:tag_ids.join(','),
                    tags_name:tag_names.join(','),
                    title:title_ele.innerText,
                    href:title_ele.href
                }
            })
        })

        await page.close();
        tag_artitcle_list.push(...tag_articles)
        
    }
    return tag_artitcle_list;
}

module.exports = read_tag_articles