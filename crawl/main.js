let {CronJob} = require('cron')
let {spawn} = require('child_process')
let process = require('process')
let {read_tags,read_tag_articles,read_article_detail} = require('./read')

let {write_tags,write_tag_articles,write_article_detail} = require('./write')


let app = async () =>{
    let tag_lists = await read_tags();

    await write_tags(tag_lists)

    let articles_list = await read_tag_articles(tag_lists)

    await write_tag_articles(articles_list)

    let article_details = await read_article_detail(articles_list)


    console.log(article_details);
    await write_article_detail(article_details)

    

}

// let job = new CronJob('* * */12 * * *',function(){
//     // 开启一个子进程
//     let child = spawn(process.execPath,[path.resolve(__dirname,'../main')])
//     child.stdout.pipe(process.stdout)
//     child.stderr.pipe(process.stderr)
//     child.on('close',function(){
//         console.log('更新任务完成')
//     })
// })

app()


