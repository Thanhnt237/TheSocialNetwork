const mongoose = require('mongoose')

const PostLayoutsSchema = new mongoose.Schema({
    Post_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
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
    }

})

module.exports = mongoose.model('PostLayouts',PostLayoutsSchema)
