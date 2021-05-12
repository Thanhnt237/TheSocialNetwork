const mongoose = require('mongoose')

const FriendListSchema = new mongoose.Schema({
    User_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    friend_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})
module.exports = mongoose.model('FriendList',FriendListSchema)