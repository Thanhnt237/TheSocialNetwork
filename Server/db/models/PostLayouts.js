const mongoose = require('mongoose')
const moment = require('moment');
const PostLayoutsSchema = new mongoose.Schema({
    Post_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    UserName:{
        type: String,
        required: true
    },
    UserAvatar:{
        type: String
    },
    title:{
        type:String,
        default:"NULL"
    },
    content:{
        type:String,
        required:true,
        default:"NULL"
    },
    images:{
        type: String
    },
    link:{
        type: String
    },
    date:{
        type: String,
        default: moment().format('dddd, DD-MM-YYYY LTS'),
        required:true
    },
    Comments: []

})

module.exports = mongoose.model('PostLayouts',PostLayoutsSchema)
