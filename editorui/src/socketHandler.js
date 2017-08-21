import openSocket from "socket.io-client";
var io = openSocket("http://localhost:8000");
const SocketHandler = context => {
  io.on("updatefile", function(fileObj) {
    var fl = context.state.tabList;
    fl = fl.map((file, i) => {
      console.log("updating file", fileObj);
      if (file.fileName === fileObj.fileName) {
        file.text = fileObj.text;
        // console.log('trying to update the file',file.fileName);
      }
    });
    context.setState({ fileList: fl });
  });

    io.on("initialData", function(filesObject) {
      // console.log(filesObject);
      var count = filesObject.filesObject.length;
      var errorMessage =
        count === 0
          ? this.state.errorMessage
          : count +
            " files found.Click on NewFile to create new.Click on FileList to easy pick a file";
      context.setState({
        tabList: filesObject.filesObject,
        currentFile: filesObject.filesObject[0].fileName || "untitled",
        errorMessage: errorMessage
      });
    });
    io.on("errormessage", function(err) {
      console.log("error errorMessage", err);
      var fl;
      if (err.code === 1) {
        fl = context.state.tabList;
        console.log("duplicate file");
        fl[0].fileName = "untitled";
        context.setState({
          tabList: fl,
          currentFile: "untitled",
          errorMessage: err.msg,
          isNewFile: true
        });
      } else context.setState({ errorMessage: err.msg });
    });
    io.on("newfile", function(fileObj) {
      console.log("received new file" + fileObj);
      var fl = context.state.tabList;
      fl.push(fileObj);
      context.setState({
        tabList: fl,
        errorMessage:fl.length+' files found!',
      });
    });
};

export default {SocketHandler,io};
