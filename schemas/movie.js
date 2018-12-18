var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    year: Number,
    country: String,
    summary: String,
    poster: String,
    flash: String,
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

MovieSchema.pre('save',function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now()
    }
    next()
})

MovieSchema.statics = {
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
module.exports = MovieSchema