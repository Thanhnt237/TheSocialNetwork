const mongoose = require('mongoose')

const ChatsSchema = new mongoose.Schema({
    Parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    partner_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Chats',ChatsSchema)