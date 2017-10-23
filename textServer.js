var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var fs1 = require("fs");
var fs2 = require("fs");
io.listen(8000);
function readItem(itemPath,result){
  console.log('current item'+itemPath);
    if(fs.lstatSync(itemPath).isDirectory()){
      var folder=[];
      fs.readdirSync(itemPath).map((item)=> readItem(itemPath+'\\'+item,folder));
      console.log('read the folder'+itemPath,folder);
      result.push({
        folderName:itemPath,
        folderContent:folder
      });
    }
    else{
      var fileContent = fs.readFileSync(itemPath, "utf8");
      console.log('read the file'+itemPath,fileContent);
      result.push({
        fileName:itemPath,
        fileContent});
    }
  }
console.log("listening on port 8000");
io.on("connection", function(client) {
  console.log("new user");
  var filesObject=[];
  readItem('allFiles',filesObject);
  console.log('filesObject'+filesObject);
  client.emit("initialData", filesObject);
  // console.log(filesObject);
  client.on("newfile", function(fileObj) {
    console.log('trying to create file with ',fileObj.fileName,fileObj.fileContent);
    fs2.writeFile(
      "allFiles\\" + fileObj.fileName,
      fileObj.fileContent,
      { flag: "wx" },
      function(err) {
        if (!err) {
          console.log("create file success" + err);
          client.broadcast.emit("newfile", {
            fileName: fileObj.fileName,
            fileContent: fileObj.fileContent
          });
        } 
        else {
          console.log(err);
          if (err.code == "EEXIST")
            client.emit("errormessage", {
              code: 1,
              msg:
                "File with that name already exists.Please choose a different name."
            });
          else
            client.emit("errormessage", {
              code: null,
              msg: "Error saving file.Please try again."
            });
        }
      }
    );
  });
  client.on("savefile", function(fileObj) {
    console.log('trying to save file with ',fileObj.fileName,fileObj.fileContent);
    fs2.writeFile(
      "allFiles\\" + fileObj.fileName,
      fileObj.fileContent,
      { flag: "w" },
      function(err) {
        if (!err) {
          console.log("file write success");
          client.broadcast.emit("updatefile", {
            fileName: fileObj.fileName,
            fileContent: fileObj.fileContent
          });
        } else {
          client.send("errormessage", "Error saving file.Please try again.");
        }
      }
    );
  });
});
