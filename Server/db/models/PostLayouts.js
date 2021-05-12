const mongoose = require('mongoose')
const path = require('path')

const PostImagesBasePath = 'upload/PostImages'
const ReactionsSchema = new mongoose.Schema({
    Parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Posts'
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    images:{
        type:String
    },
    link:{
        type:String
    }

})
ReactionsSchema.virtual('imagesPath').get(function(){
    if(this.images != null){
        return path.join('/',PostImagesBasePath ,this.images)
    }
module.exports = mongoose.model('Reactions',ReactionsSchema)