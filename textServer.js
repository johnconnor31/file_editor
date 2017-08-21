var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var fs1 = require('fs');
var fs2 = require('fs');
io.listen(8000);
var filesObject;
console.log('listening on port 8000');


io.on('connection',function(client){
  console.log('new user');

  fs.readdir('allFiles',function(err,fileList){
    filesObject=[];
     fileList.map(function(file,i){
        var fileContent = fs1.readFileSync('allFiles\\'+file,'utf8');
            filesObject.push({fileName:file,text:fileContent});
            if(i===fileList.length-1)
            {
                client.emit('initialData',{filesObject:filesObject});            
            }
      });
  });
  
  // console.log(filesObject);
  client.on('newfile',function(fileObj){
    // console.log('trying to create file with ',fileObj.fileName,fileObj.text);
    fs2.writeFile('allFiles\\'+fileObj.fileName,fileObj.text,{flag:'wx'},function(err){
        if(!err)
        {
        console.log('create file success'+err);
        client.broadcast.emit('newfile',{fileName:fileObj.fileName,text:fileObj.text});
      }
      else{
        console.log(err);
        if(err.code=='EEXIST')
          client.emit('errormessage',{code:1,msg:'File with that name already exists.Please choose a different name.'})
        else
          client.emit('errormessage',{code:null,msg:'Error saving file.Please try again.'});
      }
    });

  });
  client.on('savefile',function(fileObj){
    // console.log('trying to save file with ',fileObj.fileName,fileObj.text);
    fs2.writeFile('allFiles\\'+fileObj.fileName,fileObj.text,{flag:'w'},function(err){
        if(!err){
        console.log('file write success');
        client.broadcast.emit('updatefile',{fileName:fileObj.fileName,text:fileObj.text});
      }
      else{
        client.send('errormessage','Error saving file.Please try again.');
      }
    });
    
  });
});

