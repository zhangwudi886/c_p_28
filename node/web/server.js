let express = require('express');
let bodyParser = require('body-parser')
let session = require('express-session')
let app = express();
let path = require('path');
let query = require('../db');
let checkLogin = require('./middleware/auth')
let debug = require('debug')('crawl:web:Server')

// 解析请求提的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// 使用express-session中间件
app.use(session({
    resave:true,//是否每次访问服务器都要重新保存session
    saveUninitialized:true,//保存未初始化的session
    secret:'monk'//秘钥
}))

app.set('view engine','html');
app.set('views',path.resolve(__dirname,'views'));

app.engine('html',require('ejs').__express);

// 最后的session和对象都会被合并到locals上面，因此这里直接给locals赋值，在每个模板页面里面都能拿到user了。
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})

app.get('/',async function(req,res){
    let tagId = req.query.tagId
    let tags = await query(`SELECT * FROM tags`);
    tagId = tagId||tags[0].tag_id;
    let articles = await query(`SELECT * FROM article_tag WHERE tag_id = ?`,[tagId])
    // let innerJoin = `SELECT article.* FROM article_tag INNER JOIN articles ON article_tag.article_id = articles.id WHERE article_tag.tag_id = 1`
    // res.json({
    //     data:articles
    // })
    res.render('index',{
        tags,
        articles
    })
})


app.get('/detail/:id',async function(req,res){
    let article_id = req.params.id;
    let articles = await query(`SELECT * FROM article_detail WHERE article_id = ?`,[article_id]);
    res.render('detail',{
        article:articles[0]
    })
})

// 当客户端以get方式访问/login请求的时候执行回调函数
app.get('/login',async function(req,res){
    res.render('login',{
        title:'登录'
    })
})

// 当客户端以get方式访问/login请求的时候执行回调函数
app.post('/login',async function(req,res){
    let {email} = req.body;
    console.log(email)
    let oldUsers = await query(`SELECT * FROM users WHERE email=? LIMIT 1`,[email]);
    let user;
    if(Array.isArray(oldUsers)&&oldUsers.length){
        // 给req.session赋值
        user = oldUsers[0];
        // res.redirect('/');//如果登录成功。则吧当前的用户信心放在绘画中，并且重定向到首页
    }else{
        let results = await query(`INSERT INTO users(email) VALUES(?)`,[email])
        user = {
            id:results.insertId,
            email
        } 
    }
    req.session.user = user
    res.redirect('/');//如果登录成功。则吧当前的用户信心放在绘画中，并且重定向到首页
})

// 订阅路由
app.get('/subscribe',checkLogin,async function(req,res){
    let user = req.session.user;//当前当前会话中的user属性，表明当前用户是否存在，如果不存在说明没有登录，存在则说明已经登录了。这个功能通过中间件实现
    let tags = await query(`SELECT * FROM tags`);
    let userTags = await query(`SELECT tag_id FROM user_tag WHERE user_id = ?`,[user.email])
    console.log('userTags',userTags)
    let userTagIds = userTags.map(item=>item.tag_id)
    console.log('userTagIds',userTagIds)
    tags.forEach(tag=>{
        tag.imgsrc = tag.imgsrc||'https://lc-gold-cdn.xitu.io/85dd1ce8008458ac220c.png?imageView2/2/w/100/h/100/q/85/format/webp/interlace/1'
        tag.checked = userTagIds.indexOf(tag.tag_id)!==-1?true:false
    })
    res.render('subscribe',{
        tags,
        title:'请订阅标签'
    })
})

 

app.post('/subscribe',checkLogin,async function(req,res){
    let { subscribe } = req.body;
    if(subscribe&&!Array.isArray(subscribe)){
        subscribe = [subscribe]
    }
    console.log(subscribe)
    let user = req.session.user;
    if(subscribe.length){
        await query(`DELETE FROM user_tag WHERE user_id=?`,[user.email])
        for(let i = 0;i<subscribe.length;i++){
            let tag_id = subscribe[i]
            await query(`INSERT INTO user_tag(user_id,tag_id) VALUES(?,?)`,[user.email,tag_id])
        }
    }
    res.redirect('back')
})
app.listen(3003)