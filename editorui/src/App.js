import React, { Component } from "react";
import $ from "jquery";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@material-ui/core";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
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
      errorMessage: "",
      isErrorMsg: false,
      newFileName: "",
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
  handleTabSwitch(e) {
    this.setState({ currentFile: e.target.textContent });
  }
  addNewFile() {
    var fl = this.state.tabList;
    fl.unshift({
      fileName: "untitled",
      fileContent: "",
    });
    this.setState({
      tabList: fl,
      currentFile: "untitled",
      currentContent: "",
      isNewFile: true,
    });
  }
  saveNewFile() {
    var newName = this.state.newFileName;
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

  handleCloseNewFileDialog() {
    this.setState({ isNewFile: false });
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

  handleCloseError() {
    this.setState({ errorMessage: "" });
  }

  fileNameChange(e) {
    this.setState({ newFileName: e.target.value });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <header id="tools">
            <MenuItems
              isMenuItemOpen={this.state.isMenuItemOpen}
              fileList={this.state.tabList}
              openMenuItem={this.openMenuItem.bind(this)}
            />
          </header>
          <Snackbar
            open={Boolean(this.state.errorMessage)}
            autoHideDuration={6000}
            onClose={this.handleCloseError.bind(this)}
            message={this.state.errorMessage}
          />
          <Dialog
            open={this.state.isNewFile}
            onClose={this.handleCloseNewFileDialog.bind(this)}
          >
            <DialogTitle>Enter file name</DialogTitle>
            <DialogContent>
              <TextField
                placeholder="Enter a file name"
                onChange={this.fileNameChange.bind(this)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                className="createFile"
                variant="contained"
                color="secondary"
                onClick={this.saveNewFile.bind(this)}
                style={{ margin: "0px" }}
              >
                Create File
              </Button>
            </DialogActions>
          </Dialog>
          <TabsEditor
            update={this.update.bind(this)}
            currentFile={this.state.currentFile}
            allTabs={this.state.tabList}
            handleTabSwitch={this.handleTabSwitch.bind(this)}
            addNewFile={this.addNewFile.bind(this)}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
