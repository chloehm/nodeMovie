var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10
var UserSchema = new mongoose.Schema({
    userName: {
        unique: true,
        type: String,
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
}) 

UserSchema.pre('save',function(next) {
    var user = this
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err)

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) return next(err)

            user.password = hash
            next()
        })
    })
    // next()//这个next()要去掉，否则加盐会失败
})

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if(err)  return cb(err)
            if(isMatch) {
                return cb(null, isMatch)
            } else {
                console.log('Password is not matched!')
            }
        })
    }
}

UserSchema.statics = {
    fetch: function(cb) {
        return this
        .find({ })   //查找所有数据
        .sort('meta.updateAt') //按照更新时间进行排序
        .exec(cb)
    },
    findById: function(id, cb) { //根据id查详情
        return this
        .findOne({_id: id})
        .exec(cb)
    }
}
module.exports = UserSchema