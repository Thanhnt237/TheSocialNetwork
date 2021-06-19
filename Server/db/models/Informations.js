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
        default: "defaultCover.jpg"
    },
    avatar:{
        type:String,
        default: "defaultAvatar.jpg"
    },
    name:{
        type:String,
        default: "Chưa rõ"
    },
    phone:{
        type:String,
        default: "Chưa rõ"
    },
    address:{
        type:String,
        default: "Việt Nam"
    },
    DoB:{
        type:Date,
        default:Date.now,
        required:true
    },
    description:{
        type:String,
        default: "Hãy bảo vệ môi trường"
    },
    gender:{
        type:String,
        default: "Không rõ"
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
