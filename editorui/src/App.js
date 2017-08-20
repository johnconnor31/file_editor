import React, { Component } from 'react';
import openSocket from 'socket.io-client';
// import ReactDOM from 'react-dom';
// import { Tabs, Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import TabsEditor from './TabsEditor';


var io = openSocket('http://localhost:8000');
class App extends Component {
  constructor(){
    super();
    this.state={
        tabList:[{
          fileName:'untitled',
          text:'abc',
        },
        {
        fileName:'thisisgreat',
        text:'hello there mate',
        }
      ],
      currentFile:'untitled',
      currentText:'hello there.edit me'
    }
    var context = this;
    context.state.currentFile = context.state.tabList[0].fileName||'untitled';

    io.on('updatefile',function(fileObj){
      var fl = context.state.tabList;
      var myFile;
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
  }
  savefile(e){
    console.log(e.keyCode,e.ctrlKey);
    if(e.keyCode == 83 && e.ctrlKey)
    {
      // console.log(this.state);
      e.preventDefault();
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
  render() {
    return (
      <div className="App">
        <header id='tools'>
          <button >New File</button>
        </header>
      <MuiThemeProvider>
        <TabsEditor update={this.update.bind(this)} savefile= {this.savefile.bind(this)}
                   currentFile={this.state.currentFile} allTabs={this.state.tabList}
                   handleTabSwitch= {this.handleTabSwitch.bind(this)} />
      </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
