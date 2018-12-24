var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
    movie: {type: ObjectId, ref:'Movie'},
    from: {type: ObjectId, ref:'User'},
    reply: [{
        from: {type: ObjectId, ref:'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String
    }],
    content: String,
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

CommentSchema.pre('save',function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now()
    }
    next()
})

CommentSchema.statics = {
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
module.exports = CommentSchema