const mongoose = require('mongoose')

const DevicesSchema = new mongoose.Schema({
    dname:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    }
})
module.exports = mongoose.model('Devices',DevicesSchema)