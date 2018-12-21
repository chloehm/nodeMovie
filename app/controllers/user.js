var User = require('../models/user')
//showSignup
exports.showSignup =  function(req, res) {
    res.render('signup',{
        title: '注册页面',
    })
}
//showSignin
exports.showSignin =  function(req, res) {
    res.render('signin',{
        title: '登录页面',
    })
}
// signup
exports.signup = function(req, res) {
    // console.log(_user)
    // /user/signup/:userId => req.params.userId
    // /user/signup =>  req.body.userid
    // /user/signup/1111?userid=1112 => req.query.userid
    // Express取值的优先级：route(e.g. 1111)>body(e.g. 1113)>queryString(e.g. 1112)
    var _user = req.body.user
    User.findOne({userName: _user.userName}, function(err, user) {
        if(err) return err

        if(user) {
            // res.json({err: '账号已经注册'})
            res.redirect('/signin')
        }else {
            var user = new User(_user)
            user.save(function(err, user) {
                if(err) {
                    console.log(err)
                }
                res.redirect('/')
            })
        }
    })
}

// signin
exports.signin =  function(req, res) {
    var _user = req.body.user
    var name = _user.userName
    var password = _user.password
    console.log({'message': password}); 
    console.log('user in session'); 
    User.findOne({userName: name},function(err, user) {
        if(err) return console.log(err)
        if(!user) {
            // res.json({'message':'该用户不存在'}); 
            return res.redirect('/signup')
        }
        
        user.comparePassword(password, function(err, isMatch) {
            if(err)  console.log(err)

            if(isMatch) {
                req.session.user = user
                return res.redirect('/')
            } else{
                console.log('password is not matched!')
                return res.redirect('/signin')
            }
        })
    })
}
// logout 
exports.logout =  function(req, res) {
    delete req.session.user 
   // delete app.locals.user
    res.redirect('/')
}

//userlist
exports.list =  function(req, res) {
    User.fetch(function(err, users) {
        if(err) {
            console.log(err)
        }

        res.render('userlist',{
            title: 'user 列表页',
            users: users
        })
    })
    
}

//midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user
    if(!user) {
        return res.redirect('/signin')
    }
   next()
}
exports.adminRequired = function(req, res, next) {
    var user = req.session.user
    console.log(user)
    if(user.role <= 10) {
        return res.redirect('/signin')
    }
   next()
}