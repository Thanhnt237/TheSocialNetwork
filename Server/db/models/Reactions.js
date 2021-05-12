const mongoose = require('mongoose')

const ReactionsSchema = new mongoose.Schema({
    Posts_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Posts'
      },
      User_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    state:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Reactions',ReactionsSchema)