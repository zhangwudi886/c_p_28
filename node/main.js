let express = require('express');
let bodyParser = require('body-parser');
let path = require('path')
let app = express();
let query = require('./db')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.resolve(__dirname,'build')))


// app.all('*',function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// })


app.get('/taglist',async function(req,res){
    let results = await query(`SELECT * FROM tags`)
    res.json({
        data:results
    })
})

app.post('/article_list',async function(req,res){
    let {params:{tag_id}} = req.body;
    let results = await query(`SELECT * FROM article_tag WHERE tag_id =? `,[tag_id])
    res.json({
        data:results
    })
})


app.post('/article_detail',async function(req,res){
    let {params:{article_id}} = req.body;
    let results = await query(`SELECT * FROM article_detail WHERE article_id =? `,[article_id])
    res.json({
        data:results[0]
    })
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(3022,function(){
    console.log("3022端口已经启动");
})