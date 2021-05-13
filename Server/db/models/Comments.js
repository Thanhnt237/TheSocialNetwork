const mongoose = require('mongoose')

const CommentsSchema = new mongoose.Schema({
    Parent_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
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
