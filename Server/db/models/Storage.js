const mongoose = require('mongoose')

const StorageSchema = new mongoose.Schema({
    User_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    userCount:{
        type:String,
        required:true
    },
    userPostCount:{
        type:String,
        required:true
    },
    reactionCount:{
        type:String,
        required:true
    },
    commentCount:{
        type:String,
        required:true
    },
    weatherChart:{
        type:String,
        required:true
    },
    plasticChart:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Storage',StorageSchema)