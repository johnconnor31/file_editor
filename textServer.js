var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.listen(8000);
console.log('listening on port 8000');

io.on('connection',function(client){
  console.log('new user');
  client.on('savefile',function(fileObj){
    console.log('trying to save file with ',fileObj.fileName,fileObj.text);
    io.emit('updatefile',{fileName:fileObj.fileName,text:fileObj.text});
  });
});