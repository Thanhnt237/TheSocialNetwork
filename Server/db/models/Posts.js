const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    User_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    FavoritesCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FavoritesCategory'
      },
    States_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'States'
    }
})
module.exports = mongoose.model('Posts',PostsSchema)