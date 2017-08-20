
var socketHandler = function(cb){
  io.on('updateFile',cb(fileName,text){
    console.log(filename,text);
  });
}

export default socketHandler;