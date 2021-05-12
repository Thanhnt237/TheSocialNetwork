const mongoose = require('mongoose')
const path = require('path')

const UserCoverBasePath = 'upload/UserCover'
const UserAvatarBasePath = 'upload/UserAvatar'
const InformationsSchema = new mongoose.Schema({
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cover:{
        type:String,
        default: "NULL"
    },
    avatar:{
        type:String,
        default: "NULL"
    },
    name:{
        type:String,
        default: "NULL"
    },
    address:{
        type:String,
        default: "NULL"
    },
    DoB:{
        type:Date,
        default:Date.now,
        required:true
    },
    description:{
        type:String,
        default: "NULL"
    },
    gender:{
        type:String,
        default: "NULL"
    }
})
InformationsSchema.virtual('coverPath').get(function(){
    if(this.cover != null){
        return path.join('/',UserCoverBasePath ,this.cover)
    }
})
InformationsSchema.virtual('avatarPath').get(function(){
    if(this.avatar != null){
        return path.join('/', UserAvatarBasePath ,this.avatar)
    }
})
module.exports = mongoose.model('Informations',InformationsSchema)
