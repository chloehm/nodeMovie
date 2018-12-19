var express = require('express')
var mongoose = require('mongoose')
var path = require('path')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
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
app.set('views', './views/pages') //设置模板的目录
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
app.listen(port);
console.log('start on', port)

//pre handle user
app.use(function(req, res, next) {
    var _user = req.session.user
    if(_user) {
        app.locals.user = _user
    }
        return next()
})

//index page
app.get('/', function(req, res) {
    console.log(req.session.user)
   
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('index',{
            title: 'phm blog首页',
            movies: movies
        })
    })
   
})

// signup
app.post('/user/signup', function(req, res) {
    var _user = req.body.user
    // console.log(_user)
    // /user/signup/:userId => req.params.userId
    // /user/signup =>  req.body.userid
    // /user/signup/1111?userid=1112 => req.query.userid
    // Express取值的优先级：route(e.g. 1111)>body(e.g. 1113)>queryString(e.g. 1112)
    User.findOne({userName: _user.userName}, function(err, user) {
        if(err) return err

        if(user) {
            return res.redirect('/')
        }else {
            var user = new User(_user)
            user.save(function(err, user) {
                if(err) {
                    console.log(err)
                }
                res.redirect('/admin/userlist')
            })
        }

    })
   
})

// signin
app.post('/user/signin', function(req, res) {
    var _user = req.body.user
    var name = _user.userName
    var password = _user.password
    console.log({'message': password}); 
    console.log('user in session'); 
    User.findOne({userName: name},function(err, user) {
        if(err) return console.log(err)
        if(!user) {
            res.json({'message':'该用户不存在'}); 
        }
        
        user.comparePassword(password, function(err, isMatch) {
            if(err)  console.log(err)

            if(isMatch) {
                req.session.user = user
                return res.redirect('/')
            } else{
                console.log('password is not matched!')
            }
        })
    })
})

//logout
app.get('/logout', function(req, res) {
    delete req.session.user

    delete app.locals.user
    res.redirect('/')
})
//userlist page
app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
        if(err) {
            console.log(err)
        }

        res.render('userlist',{
            title: 'user 列表页',
            users: users
        })
    })
})

//detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: '电影 ' + movie['title'],
            movie: movie
        })
    })
  
})

//index admin
app.get('/admin/movie', function(req, res) {
    res.render('admin',{
        title: 'phm 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: '',
        }
    })
})
//admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'movie 后台更新页面',
                movie: movie
            })
        })
    } 
})
//admin post movie
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie = null

    if(id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie['_id'])
            })
        })
    } else{
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save(function(err, movie) {
            console.log(movie);
            if(err) {
                console.log(err)
            }
            res.redirect('/movie/'+ movie._id)
        })
    }
})

//index list
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }

        res.render('list',{
            title: 'phm 列表页',
            movies: movies
        })
    })
})

// list delete movie 
app.delete('/admin/list', function(req, res) {
    var id = req.query.id

    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err)
            }else {
                res.json({success: 1})
                // res.send({success: 1})
            }
        })
    }
})