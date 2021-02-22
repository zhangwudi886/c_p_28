const { time } = require('cron');
let query = require('../db')
let send_email = require('../email')
let debug = require('debug')("crawl:write_tag_articles")


let write_tag_articles = async (articles_list) =>{
    let tagMap = {};
    let tags_all = await query(`SELECT * FROM tags`)
    for(let article_item of articles_list){
        let {article_id,tags_id,tags_name,title,href} = article_item
        // let oldArticle = await query(`SELECT * FROM article_tag WHERE article_id = ? LIMIT 1`,[article_id])
        let emojiReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi; 
        // content = content.replace(emojiReg,"")
        // content = content.replace(/data-src/ig,"src")
        title = title.replace(emojiReg,"")
        await query(`DELETE FROM article_tag WHERE article_id =?`,[article_id])

        for(let tag of tags_id.split(',')){
            // debug(tagMap[tag])
            if(tagMap[tag]){
                // 看看这个列表中有没有，没有再push
                let existFlag = tagMap[tag].filter(item=>item.article_id == article_id)[0]
                if(!existFlag){
                    console.log(`没有一个走push？`)
                    tagMap[tag].push({
                        title,
                        article_id,
                        href:`http://localhost:3000/detail/${article_id}`
                    })
                }
            }else{
                
                tagMap[tag] = [{
                    title,
                    article_id,
                    href:`http://localhost:3000/detail/${article_id}`
                }]
            }
            await query(`INSERT INTO article_tag(tag_id,article_id,tags_id,tags_name,title,href) VALUES(?,?,?,?,?,?)`,[tag,article_id,tags_id,tags_name,title,href])
        }
    }
    let tags_list = Object.keys(tagMap)
    for(let i = 0 ;i < tags_list.length;i++){
        let cur_tag = tags_list[i];
        let cur_tag_name = tags_all.filter(item=>item.tag_id==cur_tag)[0]
        let subscribe_emails_sql = await query(`SELECT distinct users.email FROM user_tag INNER JOIN users ON user_tag.user_id = users.email WHERE tag_id = ?`,[cur_tag]);
        let subscribe_emails = subscribe_emails_sql.map(item=>item.email)
        if(Array.isArray(subscribe_emails)&&subscribe_emails.length){
            debug(`当前标签--《${cur_tag_name.title}》----id-${cur_tag},将要发送的对象是${subscribe_emails.join(',')}`)    
            await send_email(tagMap[cur_tag],subscribe_emails.join(','))
        }
    }
    debug(`全部文章标签写入完成`)
}



module.exports = write_tag_articles