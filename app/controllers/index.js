var Movie = require('../models/movie')
var Category = require('../models/category')
  //index page
exports.index =  function(req, res) {
    // console.log(req.session.user)
    Category
    .find({})
    .populate({path: 'movies',option: {limit: 5}})
    .exec(function(err, categories) {
  if(err) {
            console.log(err)
        }
        res.render('index',{
            title: 'phm blog首页',
            categories: categories
        })
    })
}
 
