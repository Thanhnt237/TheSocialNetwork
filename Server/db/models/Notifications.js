const mongoose = require('mongoose')

const NotificationsSchema = new mongoose.Schema({
    User_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    noti_content:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Notifications',NotificationsSchema)