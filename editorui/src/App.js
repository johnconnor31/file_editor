import React, { Component } from "react";
import $ from "jquery";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./App.css";
import TabsEditor from "./TabsEditor";
import MenuItems from "./menuItems";
import { SocketHandler, io } from "./socketHandler";
import { Toolbar } from "material-ui/Toolbar";

class App extends Component {
  constructor() {
    super();
    this.state = {
      tabList: [],
      currentFile: "",
      currentContent: "",
      isMenuItemOpen: false,
      errorMessage: "Nothing to show here.Start by clicking on NewFile",
    };
    SocketHandler(this);
    var context = this;
    $(document).ready(function () {
      $(document).on("keyup", function (e) {
        if (e.key === "Escape") context.setState({ isMenuItemOpen: false });
      });
      $(document).click(function (event) {
        console.log(event.target, "clicked");
        if (
          !$(event.target).closest("Drawer").length &&
          !$(event.target).closest(".fileList").length
        ) {
          console.log("closing menu");
          context.setState({ isMenuItemOpen: false });
        }
      });
    });
  }

  update(e) {
    // console.log(e.target.value);
    // this.setState({currentText:e.target.value});

    var fl = this.state.tabList;
    fl = fl.map((file, i) => {
      // console.log(e.target.value);
      if (file.fileName === this.state.currentFile) {
        file.fileContent = e.target.value;
        this.setState({ currentContent: file.fileContent });
        // console.log('current content',this.state.currentContent);
      }
    });

    io.emit("savefile", {
      fileName: this.state.currentFile,
      fileContent: this.state.currentContent,
    });
    this.setState({ errorMessage: "File saved!" });
  }
  handleTabSwitch(value) {
    this.setState({ currentFile: value });
  }
  newFile() {
    var fl = this.state.tabList;
    // console.log(fl);
    if (fl.length === 0 || (fl.length !== 0 && fl[0].fileName !== "untitled")) {
      fl.unshift({
        fileName: "untitled",
        fileContent: "",
      });
      console.log(fl);
      this.setState({
        tabList: fl,
        currentFile: "untitled",
        currentContent: "",
        errorMessage: "Press Ctrl+s to save the file",
        isNewFile: true,
      });
    } else
      this.setState({
        errorMessage: "Please save the unnamed file first to Continue.",
      });
  }
  saveNewFile() {
    // console.log(e.target.keyCode,e.isMouseClick);
    var newName = this.refs.fileName.getValue();
    var content = this.state.currentContent;
    console.log("content" + content);
    if (newName !== "") {
      console.log("sending new file event");
      var fl = this.state.tabList;
      fl[0].fileName = newName + ".txt";
      fl[0].fileContent = content;
      this.setState({
        tabList: fl,
        currentFile: newName + ".txt",
        errorMessage: "File created",
        isNewFile: false,
      });

      io.emit("newfile", {
        fileName: newName + ".txt",
        fileContent: content,
      });
    } else {
      this.setState({ errorMessage: "Please enter a file name" });
    }
  }
  handleMenuToggle() {
    var isOpen = this.state.isMenuItemOpen;
    this.setState({ isMenuItemOpen: !isOpen });
  }
  openMenuItem(e) {
    this.setState({
      isMenuItemOpen: !this.state.isMenuItemOpen,
      currentFile: e.target.innerText,
    });
  }

  render() {
    var saveMode = (
      <div>
        <TextField hintText="Enter a file name" ref="fileName" />
        <RaisedButton
          class="createFile"
          label="Create File"
          onClick={this.saveNewFile.bind(this)}
          secondary={true}
          style={{ margin: "0px" }}
        />
      </div>
    );

    var normalMode = (
      <div>
        {" "}
        <RaisedButton
          label="New File"
          onClick={this.newFile.bind(this)}
          secondary={true}
          style={{ margin: "0px", size: "5px" }}
        />
      </div>
    );
    var tools = this.state.isNewFile ? saveMode : normalMode;
    return (
      <MuiThemeProvider>
        <div className="App">
          <header id="tools">
            <MenuItems
              isMenuItemOpen={this.state.isMenuItemOpen}
              fileList={this.state.tabList}
              openMenuItem={this.openMenuItem.bind(this)}
            />

            <Toolbar>
              {tools}
            </Toolbar>
          </header>
          <div id="errorMessage">{this.state.errorMessage}</div>
          <TabsEditor
            update={this.update.bind(this)}
            currentFile={this.state.currentFile}
            allTabs={this.state.tabList}
            handleTabSwitch={this.handleTabSwitch.bind(this)}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
