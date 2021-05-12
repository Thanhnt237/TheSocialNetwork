const mongoose = require('mongoose')

const PlasticControllersSchema = new mongoose.Schema({
    Devices_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Devices'
      },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    plasticSaved:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('PlasticControllers',PlasticControllersSchema)