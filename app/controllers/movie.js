var Movie = require('../models/movie')
var Comment = require('../models/comment')
var _ = require('underscore')

 //detail page
 exports.detail = function(req, res) {
    var id = req.params.id
    Movie.findById(id, function(err, movie) {
        Comment
        .find({movie: id})
        .populate('from', 'userName') //第一个参数path，第二个参数传要生成的字段
        .populate('reply.from reply.to', 'userName') //第一个参数path，第二个参数传要生成的字段
        .exec(function(err, comments) {
            console.log(comments)
            res.render('detail', {
                title: '电影 ' + movie['title'],
                movie: movie,
                comments: comments
            })
        })
    })
}

//index admin
exports.new = function(req, res) {
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
}

//admin update movie
exports.update = function(req, res) {
    var id = req.params.id

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'movie 后台更新页面',
                movie: movie
            })
        })
    } 
}

//admin post movie
exports.save = function(req, res) {
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
}

//index list
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }

        res.render('list',{
            title: 'phm 列表页',
            movies: movies
        })
    })
}

// list delete movie 
exports.del =  function(req, res) {
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
}