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

require('./controllers/socketio')(io);

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


app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
   socket.on('ESP-SENT-Temperature', function (msg) {
   console.log("Temperature: "+msg+" *C");
   });

socket.on('ESP-SENT-Humidity', function (msg1) {
   console.log("Humidity: "+msg1+" %");
   });

socket.on('ESP-SENT-RainState', function (msg2) {
   console.log("RainState: "+msg2);
   });

socket.on('ESP-SENT-UVLevel', function (msg3) {
   console.log("UV Level: "+msg3);
   });

socket.on('ESP-SENT-Value', function (msg4) {
   console.log("Value: "+msg4);
   });
   timeout();
});
function timeout() {
  setTimeout(function () {
   io.emit("reply","A message from server");
    timeout();
  }, 5000);
}

server.listen(PORT, () => {
  console.log("Server running on PORT -> " + PORT);
});
