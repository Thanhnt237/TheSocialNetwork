const mongoose = require('mongoose')

const FriendListSchema = new mongoose.Schema({
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    FriendQueue_ID:{
        type: mongoose.Schema.Types.ObjectId
    },
    Friend_ID:{
        type: mongoose.Schema.Types.ObjectId
    }
})
module.exports = mongoose.model('FriendList',FriendListSchema)
