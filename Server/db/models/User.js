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
    },
    Role:{
      type: String,
      require: true,
      default: "MEMBER"
    }
})
module.exports = mongoose.model('User',UserSchema)
