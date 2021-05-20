module.exports = function(io) {
    io.on('connection', function(socket) {

      console.log("Client Socket ID: " + socket.id + " connected!");

    });
};
