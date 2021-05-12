const mongoose = require('mongoose')

const SpeacialActionsCategorySchema = new mongoose.Schema({
    RolesCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'RolesCategory'
      },
    action:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model('SpeacialActionsCategory',SpeacialActionsCategorySchema)