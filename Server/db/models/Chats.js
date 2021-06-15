const mongoose = require('mongoose')

const ChatsSchema = new mongoose.Schema({
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    Friend_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content:[{
        User_ID:{
          type: String
        },        
        content:{
          type: String
        }
    }]
})
module.exports = mongoose.model('Chats',ChatsSchema)
