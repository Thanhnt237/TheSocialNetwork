const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    SpeacialActionsCategory_id:{
        type: String,
        default:"NULL"
    },
    FavoritesCategory_id:{
        type: String,
        default: "NULL"
    },
    State:{
      type: String,
      default: "Offline"
    }
})
module.exports = mongoose.model('User',UserSchema)
