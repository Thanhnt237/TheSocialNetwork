const mongoose = require('mongoose')

const CommentsSchema = new mongoose.Schema({
    Parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comments'
    },
    content:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Comments',CommentsSchema)