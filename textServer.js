var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
io.listen(8000);

function readItems(itemsPath) {
    let result = [];
    if(itemsPath === 'allFiles' && !fs.existsSync(itemsPath)) {
        fs.mkdirSync(itemsPath);
    }
    try {
        console.log('isdir', itemsPath);
        if (fs.lstatSync(itemsPath).isDirectory()) {
            result = [];
            const folderContent = fs.readdirSync(itemsPath).map((item) => readItems(itemsPath + '\\' + item));
            console.log('read the folder' + itemsPath, folderContent);
            result.push({
                folderName: itemsPath,
                folderContent
            });
        }
        else {
            var fileContent = fs.readFileSync(itemsPath, "utf8");
            console.log('read the file' + itemsPath, fileContent);
            result = {
                fileName: itemsPath,
                fileContent
            };
        }
    } catch (e) { }
    return result;
}

console.log("listening on port 8000");

io.on("connection", function (client) {
    console.log("new user");
    const filesList = readItems('allFiles');
    console.log('filesObject', filesList);
    client.emit("initialData", filesList[0]?.folderContent || []);
    // console.log(filesObject);
    client.on("newfile", function (fileObj) {
        console.log('trying to create file with ', fileObj.fileName, fileObj.fileContent);
        fs.writeFile(
            "allFiles\\" + fileObj.fileName,
            fileObj.fileContent,
            { flag: "wx" },
            function (err) {
                if (!err) {
                    console.log("create file success");
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

    client.on("savefile", function (fileObj) {
        console.log('trying to save file with ', fileObj.fileName, fileObj.fileContent);
        fs.writeFile(
            "allFiles\\" + fileObj.fileName,
            fileObj.fileContent,
            { flag: "w" },
            function (err) {
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
