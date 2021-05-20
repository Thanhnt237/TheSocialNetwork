const mongoose = require('mongoose')

const FriendQueueSchema = new mongoose.Schema({
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    FriendQueue_ID:{
        type: mongoose.Schema.Types.ObjectId
    },
    avatar:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    }
})
module.exports = mongoose.model('FriendQueue',FriendQueueSchema)
