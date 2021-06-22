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

listSocket = []
let room = "Global"

module.exports = function(io) {
  //Right Navbar
  io.of('/api/right-nav').on('connection', function(socket,res) {
    //console.log(socket.id)
  });

  io.of('/api/chat-room').on('connection', function(socket,res) {

    listSocket.push(socket.id)
    socket.join("Global")
    io.to("Global").emit("Client-Join", ()=>{
      console.log("Socket" + socket.id + "Connected!")
    })
    socket.on("disconnect", ()=>{
      socket.leave("Global").emit("Client-Leave", ()=>{
        console.log("Socket" + socket.id + "disconnected!")
      })
    })
    
  })

  //Left Navbar
  io.of('/').on('connection', function(socket){
    //Non MiddleWare
    //console.log(socket.id)
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
