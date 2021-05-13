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
        default: "smt"
    },
    avatar:{
        type:String,
        default: "NsL"
    },
    name:{
        type:String,
        default: "NUSDL"
    },
    address:{
        type:String,
        default: "NSDSDL"
    },
    DoB:{
        type:Date,
        default:Date.now,
        required:true
    },
    description:{
        type:String,
        default: "NUSDA"
    },
    gender:{
        type:String,
        default: "NUASDASDSA"
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
