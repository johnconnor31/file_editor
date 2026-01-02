import React, { Component } from "react";
import $ from "jquery";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import "./App.css";
import TabsEditor from "./TabsEditor";
import MenuItems from "./menuItems";
import { SocketHandler, io } from "./socketHandler";

const theme = createTheme();

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
    var fl = this.state.tabList;
    fl = fl.map((file, i) => {
      if (file.fileName === this.state.currentFile) {
        file.fileContent = e.target.value;
        this.setState({ currentContent: file.fileContent });
      }
      return file;
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
    if (fl.length === 0 || (fl.length !== 0 && fl[0].fileName !== "untitled")) {
      fl.unshift({
        fileName: "untitled",
        fileContent: "",
      });
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
    var newName = this.refs.fileName.value;
    var content = this.state.currentContent;
    if (newName !== "") {
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
        <input type="text" placeholder="Enter a file name" ref="fileName" />
        <Button
          className="createFile"
          variant="contained"
          color="secondary"
          onClick={this.saveNewFile.bind(this)}
          style={{ margin: "0px" }}
        >
          Create File
        </Button>
      </div>
    );

    var normalMode = (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.newFile.bind(this)}
          style={{ margin: "0px" }}
        >
          New File
        </Button>
      </div>
    );
    var tools = this.state.isNewFile ? saveMode : normalMode;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <header id="tools">
            <MenuItems
              isMenuItemOpen={this.state.isMenuItemOpen}
              fileList={this.state.tabList}
              openMenuItem={this.openMenuItem.bind(this)}
            />

            <Toolbar>{tools}</Toolbar>
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
