let query = require('../db')
let debug = require('debug')("crawl:write_tags")


let write_tags = async (tag_lists) =>{
    console.log(tag_lists)
    for(let tag of tag_lists){
        let {title,href,subscribe,article,tag_id,imgsrc} = tag
        // console.log(tag)
        let oldTag = await query(`SELECT * FROM tags WHERE tag_id = ? LIMIT 1`,[tag_id])
        if(Array.isArray(oldTag)&&oldTag.length){
            debug(`更新${tag_id}(${title})的标签内容`)
            await query(`UPDATE tags SET href=?,imgsrc=?,subscribe=?,title=?,article=? WHERE tag_id = ? `,[href,imgsrc,subscribe,title,article,tag_id])
        }else{
            debug(`插入${tag_id}(${title})的标签`)
            await query(`INSERT INTO tags(href,imgsrc,subscribe,title,tag_id,article) VALUES(?,?,?,?,?,?)`,[href,imgsrc,subscribe,title,tag_id,article])
        }
    }
}


module.exports = write_tags