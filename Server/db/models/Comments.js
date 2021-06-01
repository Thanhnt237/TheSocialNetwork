const mongoose = require('mongoose')

const CommentsSchema = new mongoose.Schema({
    Parent_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    UserName:{
        type: String,
        required: true
    },
    avatar:{
      type: String,
      required: true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type: String
    }
})
module.exports = mongoose.model('Comments',CommentsSchema)
