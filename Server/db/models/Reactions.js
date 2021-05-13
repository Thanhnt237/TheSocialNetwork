const mongoose = require('mongoose')

const ReactionsSchema = new mongoose.Schema({
    Posts_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
    User_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    state:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Reactions',ReactionsSchema)
