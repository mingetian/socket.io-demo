/**
 * Created by Administrator on 2017/7/11.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use("/static",express.static('node_modules'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/client.html', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});
var j = 0;
var i = 0;
var cl = io.of('/cl');
var cu = io.of('/cu');
cl.on('connection', function (socket) {
    isOnlinecu();
    if(i == 0) {
        console.log(socket.id)
        cl.to(socket.id).emit('isOnline', false);
    } else {
        cl.to(socket.id).emit('isOnline', true);
    }
    socket.on('new_cl', function (data) {
        cu.to(data.id).emit("new_msg",data);
    });
});
cu.on('connection', function (socket) {
    isOnline();
    console.log(socket.id)
    if(j == 0) {
        cu.to(socket.id).emit('isOnline', false);
    } else {
        cu.to(socket.id).emit('isOnline', true);
    }
    socket.on('new_cu', function (data) {
        data.id = socket.id;
        cl.emit("new_msg",data);
    });
});

function isOnline(){
    cl.clients(function(err,data){
        j = data.length;
    })
}
function isOnlinecu(){
    cu.clients(function(err,data){
        i = data.length;
    })
}



server.listen(8001);