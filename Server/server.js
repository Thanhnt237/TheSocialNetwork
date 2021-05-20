const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

var Database = require('./db/database');
var routes = require('./routes/core.server.routes');

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/public', express.static('public'));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

// Website routes
app.use('/', routes);

//socketIOSetup
let listUser = [];
io.on("connection", function(socket)
  {
    listUser.push(socket.id)
    io.emit("Server-sent-userName", listUser);

    console.log("Client Socket ID: " + socket.id + " connected!");

    socket.on("disconnect", () => {
      listUser.pop(socket.id);
      io.emit("Server-sent-userName", listUser);
      console.log("Client Socket ID: " + socket.id + " disconnected!")
    });

    socket.on("Admin-sent-Message", (data)=>{
      if(data !== '' && data !== null){
          io.emit("Server-reply-message", socket.id + "(admin): " + data);
      }
    })

    socket.on("Client-sent-Message", (data)=>{
      if(data !== '' && data !== null){
          io.emit("Server-reply-message", socket.id + ": " + data);
      }
    })

    socket.on("Client-is-typing", (data)=>{
      io.emit("Server-reply-typing-event", socket.id + data);
    })

    socket.on("message", data =>
  {
    //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
            io.emit("Server-sent-data", data);
  });
  });


server.listen(PORT, () => {
  console.log("Server running on PORT -> " + PORT);
});
