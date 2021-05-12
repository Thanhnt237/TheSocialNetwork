const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    SpeacialActionsCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        default:"NULL"
    },
    FavoritesCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        default: "NULL"
    }
})
module.exports = mongoose.model('User',UserSchema)
