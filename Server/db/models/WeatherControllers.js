const mongoose = require('mongoose')

const WeatherControllersSchema = new mongoose.Schema({
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
    WeatherState:{
        type:String,
        required:true
    },
    temp:{
        type:String,
        required:true
    },
    UV:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('WeatherControllers',WeatherControllersSchema)