const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    TimeLine_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    FavoritesCategory_id:{
        type: String
    },
    States_id:{
        type: String
    }
})
module.exports = mongoose.model('Posts',PostsSchema)
