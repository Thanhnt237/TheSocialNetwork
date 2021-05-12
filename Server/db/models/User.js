const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    SpeacialActionsCategory_id:{
        type: String,
        default:"NULL"
    },
    FavoritesCategory_id:{
        type: String,
        default: "NULL"
    }
})
module.exports = mongoose.model('User',UserSchema)
