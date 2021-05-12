const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const AuthenticationSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

AuthenticationSchema.methods.comparePassword = function(_password) {
  return bcrypt.compareSync(_password, this.password);
};

module.exports = mongoose.model('Authentication',AuthenticationSchema)
