const mongoose = require('mongoose')

const PagesSchema = new mongoose.Schema({
    FavoritesCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FavoritesCategory'
      }
})
module.exports = mongoose.model('Pages',PagesSchema)