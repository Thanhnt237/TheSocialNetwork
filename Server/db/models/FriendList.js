const mongoose = require('mongoose')

const FriendListSchema = new mongoose.Schema({
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    Friend_ID:{
        type: mongoose.Schema.Types.ObjectId
    },
    avatar:{
        type:String
    },
    name:{
        type:String,
        required: true
    }
})
module.exports = mongoose.model('FriendList',FriendListSchema)
