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
app.use(express.static(__dirname + '/UI'));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

// Website routes
app.use('/', routes);

/*
app.all('/*', function(req, res) {
   res.sendFile('index.html', { root: __dirname });
});
*/

server.listen(PORT, () => {
  console.log("Server running on PORT -> " + PORT);
});
