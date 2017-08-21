import React, { Component } from 'react';
import openSocket from 'socket.io-client';
// import ReactDOM from 'react-dom';
// import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import TabsEditor from './TabsEditor';
import MenuItems from './menuItems';
import { Tabs, Tab } from 'material-ui/Tabs';
var io = openSocket('http://localhost:8000');
class App extends Component {
  constructor(){
    super();
    this.state={
      tabList:[{
        fileName:'untitled',
        text:'',
        },
      ],
      currentFile:'untitled',
      currentText:'hello there.edit me',
      isNewFile:false,
      isMenuItemOpen:false,
  }
    var context = this;

    io.on('updatefile',function(fileObj){
      var fl = context.state.tabList;
      fl=fl.map((file,i)=>{
        console.log('updating file',fileObj);
        if(file.fileName == fileObj.fileName)
        {
          file.text = fileObj.text;
          console.log('trying to update the file',file.fileName);
        }
      });
    context.setState({fileList:fl});  
    });

    io.on('initialData',function(filesObject){
      console.log(filesObject);
      context.setState({
        tabList:filesObject.filesObject,
        currentFile : filesObject.filesObject[0].fileName||'untitled',
      });

    });
  }
  savefile(e){
    console.log(e.keyCode);
    if(e.keyCode == 27)
      this.setState({isMenuItemOpen:false});
    if(e.keyCode == 83 && e.ctrlKey)
    {
      e.preventDefault();
      // console.log(this.state);
      if(this.state.currentFile == 'untitled'){
        this.setState({isNewFile:true});
        return;
      }

      io.emit('savefile',
              {fileName:this.state.currentFile,text:this.state.currentText});
    }
  }
  update(e){
    // console.log(e.target.value);
    // this.setState({currentText:e.target.value});
    var fl = this.state.tabList;
      fl=fl.map((file,i)=>{
        // console.log('finding the file');
        if(file.fileName == this.state.currentFile)
        {
          file.text = e.target.value;
          this.setState({currentText:file.text});
          // console.log('trying to update the file',file.fileName);
        }
      });
  }
  handleTabSwitch(value){
  this.setState({currentFile : value});
 }
 newFile(){
    var fl = this.state.tabList;
    console.log(fl);
    fl.unshift({fileName:'untitled',
                      text:'',
                    });
    console.log(fl);
    this.setState({tabList:fl,
                  currentFile:'untitled',
                });
 }
 saveNewFile(e){
    var fl = this.state.tabList;
    fl[0].fileName = this.refs.fileName.getValue();
    fl[0].text = this.state.currentText;
    // console.log(e.target);
    io.emit('savefile',
              {
              fileName:fl[0].fileName,
              text:fl[0].text,
            });
    this.setState({currentFile:fl[0].fileName,tabList:fl,isNewFile:false});
 }
 handleMenuToggle(){
  var isOpen = this.state.isMenuItemOpen;
  this.setState({isMenuItemOpen:!isOpen});
 }
 openMenuItem(e){
  var e,m;
  this.setState({isMenuItemOpen:!this.state.isMenuItemOpen,
    currentFile: e.target.innerText,
  });
 }
 onMenuEscape(){
  this.setState({isMenuItemOpen:false});
 }

  render() {
    var enterText = <div><TextField ref='fileName' hintText="Enter a file name" />
                    <RaisedButton label="Create File" onClick={this.saveNewFile.bind(this)}  secondary={true} style={{margin:'0px'}} />
                    <RaisedButton label="File List" onClick={this.handleMenuToggle.bind(this)} /></div>;
    var  createFile= <div> <RaisedButton label="New File" onClick={this.newFile.bind(this)} secondary={true} style={{margin:'0px',size:'5px'}} />
                      <RaisedButton label="File List" containerStyle={{textalign:'right'}} onClick={this.handleMenuToggle.bind(this)} /> </div>;

    var newFileComponent = (this.state.isNewFile? enterText:createFile) ;
    return (
  <div className="App">
    <header id='tools'>
      <MuiThemeProvider >
        <MenuItems isMenuItemOpen={this.state.isMenuItemOpen} fileList = {this.state.tabList}
                    openMenuItem={this.openMenuItem.bind(this)} onMenuEscape={this.onMenuEscape.bind(this)} />
      </MuiThemeProvider>
      <MuiThemeProvider>
      <div>
        {newFileComponent}
        </div>
      </MuiThemeProvider>
    </header>
      <MuiThemeProvider >
        <TabsEditor  update={this.update.bind(this)} savefile= {this.savefile.bind(this)}
                   currentFile={this.state.currentFile} allTabs={this.state.tabList}
                   handleTabSwitch= {this.handleTabSwitch.bind(this)} />
      </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
