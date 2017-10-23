import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
const MenuItems = (props)=>{
  var isOpen = props.isMenuItemOpen;
  var fileList = props.fileList;
  var openItem = props.openMenuItem;
  var onMenuEscape = props.onMenuEscape;
  var menuList = fileList. map((file,i)=>{
    return (<MenuItem key={i} onClick={openItem}>{file.fileName}</MenuItem>);
  });
  return(
        <Drawer open={isOpen} >
          {menuList}
        </Drawer>
        );
      }

export default MenuItems;