import React from 'react';
import {List, ListItem} from 'material-ui/List';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import Subheader from 'material-ui/Subheader';
class SideMenu extends React.Component{
  constructor(){
    super();
    this.state={
      open:false,
    }
  }
  renderFolder(item,i){
    if(item.fileName === undefined){
    var names = item.folderName.split('\\');
    return (<ListItem key ={i}
              primaryText={names[names.length-1]}
              leftIcon={<FolderOpen />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={item.folderContent.map((innerItem,i)=>this.renderFolder(innerItem,i))}
                />);
  }
  else{
    var names = item.fileName.split('\\');
    return (<ListItem key ={i}
              primaryText={names[names.length-1]}
              leftIcon={<InsertDriveFile />}
              initiallyOpen={false}
              primaryTogglesNestedList={true} />
      );
    }
  }
  
  
  render(){
      console.log('props'+this.props.folders[0]);
      if(this.props.folders[0]!==undefined)
      var folderStructure =  this.renderFolder(this.props.folders[0],0);
      console.log('folder sturcture'+folderStructure);
    return(
      <List className="menu-list">
            <Subheader>List of Files</Subheader>
            {folderStructure}
          </List>
    );
  }

}

export default SideMenu;