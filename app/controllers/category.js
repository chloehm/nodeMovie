var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')

 //detail page
//  exports.detail = function(req, res) {
//     var id = req.params.id
//     Movie.findById(id, function(err, movie) {
//         Comment
//         .find({movie: id})
//         .populate('from', 'userName') //第一个参数path，第二个参数传要生成的字段
//         .populate('reply.from reply.to', 'userName') //第一个参数path，第二个参数传要生成的字段
//         .exec(function(err, comments) {
//             console.log(comments)
//             res.render('detail', {
//                 title: '电影 ' + movie['title'],
//                 movie: movie,
//                 comments: comments
//             })
//         })
//     })
// }

//index admin
exports.new = function(req, res) {
    res.render('category',{
        title: 'phm 后台分类录入页',
        category: {}
    })
}

//admin update movie
// exports.update = function(req, res) {
//     var id = req.params.id

//     if(id) {
//         Movie.findById(id, function(err, movie) {
//             res.render('admin', {
//                 title: 'movie 后台更新页面',
//                 movie: movie
//             })
//         })
//     } 
// }

//admin post movie
exports.save = function(req, res) {
    var _category = req.body.category
    console.log(_category)
    var category = new Category(_category)
    category.save(function(err, category) {
            console.log(category);
            if(err) {
                console.log(err)
            }
            res.redirect('/admin/category/list')
        })
}

//index list
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if(err) {
            console.log(err)
        }
        console.log(categories)
        res.render('category_list',{
            title: 'phm 类型列表页',
            categories: categories
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