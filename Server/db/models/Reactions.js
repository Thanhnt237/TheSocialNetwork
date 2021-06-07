const mongoose = require('mongoose')

const ReactionsSchema = new mongoose.Schema({
    Post_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
    User_ID:{
        type: mongoose.Schema.Types.ObjectId
    }
})
module.exports = mongoose.model('Reactions',ReactionsSchema)
