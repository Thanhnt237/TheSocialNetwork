const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

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

function getOnline(socket){
  try{
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
  }catch(err){
    console.log(err)
  }
}

module.exports = function(io) {
  //Right Navbar
  io.of('/api/right-nav/123').use(function(socket,next){
    console.log("MiddleWare Running")
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

    //Set online state for user
    User.findByIdAndUpdate({_id: socket.userId}, {$set:{State: "Online"}}, (err)=>{
      if(err){
        console.log(err)
      }else{
        User.findById({_id: socket.userId},(err,user)=>{
          if(err){
            console.log(err)
          }else{
            //console.log(user)
            getOnline(socket)
          }
        })
      }
    })

    //Find user informations to put on right side
    Informations.findOne({User_ID: socket.userId},(err,userInfor)=>{
      if(err){
        console.log(err)
      }else{
        //console.log(userInfor);
      }
    })

  //Set Offline state for user
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
            getOnline(socket)
          }
        })
      }
    })
  });

  // Get online friend and put on right side
  setInterval((socket)=>{getOnline(socket)}, 10000)
});

  //Left Navbar
  io.of('/').on('connection', function(socket){
    //Non MiddleWare
      //Sent Time And Date
      io.emit("Server-Sent-Date", moment().format('MMM DD, YYYY'));

      setInterval(()=>{
        io.emit("Server-Sent-Time",moment().format('h:mm:ss'));
      }, 1000);

      //Send ESP Data+
      socket.on("ESP-SENT-Temperature", (data)=>{
        io.emit("Server-Sent-Temperature", data)
      })

      socket.on("ESP-SENT-Humidity", (data)=>{
        io.emit("Server-Sent-Humidity", data)
      })

      socket.on("ESP-SENT-RainState", (data)=>{
        io.emit("Server-Sent-RainState", data)
      })

      socket.on("ESP-SENT-UVLevel", (data)=>{
        io.emit("Server-Sent-UVLevel", data)
      })

      socket.on("ESP-SENT-Value", (data)=>{
        io.emit("Server-Sent-Value", data)
      })
    })

};
