var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var fs1 = require("fs");
var fs2 = require("fs");
io.listen(8000);
var filesObject;

console.log("listening on port 8000");
io.on("connection", function(client) {
  console.log("new user");

  fs.readdir("allFiles", function(err, fileList) {
    filesObject = [];
    filesObject = fileList.map(function(fileName, i) {
      var fileContent = fs1.readFileSync("allFiles\\" + fileName, "utf8");
      return { fileName, 
                fileContent };
      });
      client.emit("initialData", filesObject);
  });

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
