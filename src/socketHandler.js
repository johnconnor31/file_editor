import { io } from "socket.io-client";

export const socketIo = io();

export const initSocketHandler = (fileList, setFileList, setCurrentFile) => {
    socketIo.on("initialData", function (filesObject) {
        console.log('init', filesObject);
        setFileList(filesObject || []);
        setCurrentFile(filesObject[0] || { fileName: "Untitled", fileContent: "" });
    });

    socketIo.on("updatefile", function ({ fileName, fileContent }) {
        let fl = [ ...fileList ];
        fl.forEach((file) => {
            // console.log("updating file", fileObj);
            if (file.fileName === fileName) {
                file.fileContent = fileContent;
                // console.log('trying to update the file',file.fileName);
            }
        });
        setFileList(fl);
    });

    socketIo.on("errormessage", function (err) {
        console.log("error errorMessage", err);
    });

    socketIo.on("newfile", function (fileObj) {
        console.log("received new file" + fileObj);
        setFileList([ ...fileList, fileObj ]);
    });
}
