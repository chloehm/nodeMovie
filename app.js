var express = require('express')
var mongoose = require('mongoose')
var path = require('path')
var _ = require('underscore')
var Movie = require('./models/movie')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/movie',  {useNewUrlParser:true},  function(err){
　　if(err) {
　　　　console.log('Connection Error:' + err)
　　}else {
　　　　console.log('Connection success!')
    }
})
app.locals.moment = require('moment')
app.set('views', './views/pages') //设置系统的根目录
app.set('view engine', 'jade');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.listen(port);
console.log('start on', port)

//index page
app.get('/', function(req, res) {
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
