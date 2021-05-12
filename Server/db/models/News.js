const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
    FavoritesCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FavoritesCategory'
      },
    date:{
        type:Date,
        default:Date.now,
        required:true
    }
})
module.exports = mongoose.model('News',NewsSchema)