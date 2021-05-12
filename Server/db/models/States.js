const mongoose = require('mongoose')

const StatesSchema = new mongoose.Schema({
    states:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('States',StatesSchema)