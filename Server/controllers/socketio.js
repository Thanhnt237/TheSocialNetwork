const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const Authentication = require('../db/models/Authentication');
const User = require('../db/models/User');
const PasswordReset = require('../db/models/ResetPassword');
const Informations = require('../db/models/Informations');
const Posts = require('../db/models/Posts');
const PostLayouts = require('../db/models/PostLayouts');
const Comments = require('../db/models/Comments');
const Reactions = require('../db/models/Reactions');
const FriendList = require('../db/models/FriendList');
const FriendQueue = require('../db/models/FriendQueue');

module.exports = function(io) {
    io.use(function(socket,next){
      if(!socket.handshake.query.token){
        return console.log('Unauthorized request');
      }

      let token = socket.handshake.query.token;

      if (token == 'null'){
        return console.log('Unauthorized request');
      }

      let payload = jwt.verify(token, 'secretKey');

      if(!payload){
        return console.log('Unauthorized request');
      }

      socket.userId = payload.subject;
      next();
    }).
    on('connection', function(socket,res) {
      Informations.findOne({User_ID: socket.userId},(err,user)=>{
        if(err){
          console.log(err)
        }else{
          console.log(user);
        }
      })

    });
};
