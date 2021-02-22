let query = require('../db')
let debug = require('debug')("crawl:write_article_detail")


let write_article_detail = async (articles_list) =>{
    for(let article of articles_list){
        let {content,title,article_id} = article
        debug(`开始处理文章${title}`)
        // console.log(tag)
        let oldArticle = await query(`SELECT * FROM article_detail WHERE article_id = ? LIMIT 1`,[article_id])
        let emojiReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi; 
        content = content.replace(emojiReg,"")
        content = content.replace(/data-src/ig,"src")
        title = title.replace(emojiReg,"")
        if(Array.isArray(oldArticle)&&oldArticle.length){
            debug(`更新${article_id}(${title})的文章内容`)
            await query(`UPDATE article_detail SET content=?,title=? WHERE article_id = ? `,[content,title,article_id])
        }else{
            debug(`添加${article_id}(${title})的文章`)
            await query(`INSERT INTO article_detail(content,title,article_id) VALUES(?,?,?)`,[content,title,article_id])
        }
    }
    debug(`全部文章处理完成`)
}


module.exports = write_article_detail