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
const Chats = require('../db/models/Chats');

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

      User.findByIdAndUpdate({_id: socket.userId}, {$set:{State: "Online"}}, (err)=>{
        if(err){
          console.log(err)
        }else{
          User.findById({_id: socket.userId},(err,user)=>{
            if(err){
              console.log(err)
            }else{
              //console.log(user)
            }
          })
        }
      })

      Informations.findOne({User_ID: socket.userId},(err,userInfor)=>{
        if(err){
          console.log(err)
        }else{
          console.log(userInfor);
        }
      })


    socket.on("disconnect", () => {
      User.findByIdAndUpdate({_id: socket.userId}, {$set:{State: "Offline"}}, (err)=>{
        if(err){
          console.log(err)
        }else{
          User.findById({_id: socket.userId},(err,user)=>{
            if(err){
              console.log(err)
            }else{
              //console.log(user)
            }
          })
        }
      })
    });

    FriendList.find({User_ID: socket.userId}, (err,getFriendListOfOnlineUser)=>{
      if(err){
        console.log(err)
      }else{
        let friendListOfOnlineUser = [];
        getFriendListOfOnlineUser.forEach((element)=>{friendListOfOnlineUser.push(element.Friend_ID)})

        User.find({_id: {$in: friendListOfOnlineUser}, State:"Online"}, (err,onlineFriend)=>{
          if(err){
            console.log(err)
          }else{
            let InforOfOnlineUser = [];
            onlineFriend.forEach((element)=>{InforOfOnlineUser.push(element._id)})

            Informations.find({User_ID: {$in: InforOfOnlineUser}}, (err,onlineFriendInfor)=>{
              if(err){
                console.log(err)
              }else{
                socket.emit("Server-Sent-UserOnline",onlineFriendInfor)
              }
            })
          }
        })
      }
    })



    });
};
