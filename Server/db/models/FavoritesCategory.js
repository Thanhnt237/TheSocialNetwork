const mongoose = require('mongoose')

const FavoritesCategorySchema = new mongoose.Schema({
    favorites:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('FavoritesCategory',FavoritesCategorySchema)