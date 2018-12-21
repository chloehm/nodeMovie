var express = require('express')
var mongoose = require('mongoose')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var morgan = require('morgan')
var MongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()

var dbUrl = 'mongodb://localhost/movie'
mongoose.connect(dbUrl,  {useNewUrlParser:true},  function(err){
　　if(err) {
　　　　console.log('Connection Error:' + err)
　　}else {
　　　　console.log('Connection success!')
    }
})

app.locals.moment = require('moment')
app.set('views', './app/views/pages') //设置模板的目录
app.set('view engine', 'jade');  // 设置解析模板文件类型：这里为jade文件

app.use(bodyParser.json()) // 使用bodyparder中间件，
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

// 使用 session 中间件
app.use(session({
    secret: 'phm', // 对session id 相关的cookie 进行签名
    store: new MongoStore({   //将session存进数据库  用来解决负载均衡的问题
        url: dbUrl,
        collection: 'sessions',
        //touchAfter:24*3600 //通过这样做，设置touchAfter:24 * 3600，您在24小时内
       //只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
    })
}))
if('development' == app.get('env')) {
    app.set('showStackError', true)
    app.use(morgan(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}
require('./config/routes')(app)
app.listen(port);
console.log('start on', port)

