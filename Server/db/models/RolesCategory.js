const mongoose = require('mongoose')

const RolesCategorySchema = new mongoose.Schema({
    roles:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('RolesCategory',RolesCategorySchema)