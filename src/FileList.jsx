import { ArrowCircleDown, ArrowCircleRight } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React from 'react';

export default function FileList({ files, onFileClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isFolder, setIsFolder] = React.useState(false);

  return (
    <>
      <List>
        {files?.map((item) => <ItemRender item={item} setAnchorEl={setAnchorEl} setIsFolder={setIsFolder} onFileClick={onFileClick} />)}
      </List>
      <RightClickMenu isFolder={isFolder} anchorEl={anchorEl} setAnchorEl={setAnchorEl} onClickItem={(type) => () => console.log('new', type)} />
    </>
  );
};

function ItemRender({ item, setAnchorEl, setIsFolder, onFileClick }) {
  const [expanded, setExpanded] = React.useState(false);

  let children;
  if (item.folderName) {
    children = item.folderContent?.map((it) => <ItemRender item={it} setAnchorEl={setAnchorEl} setIsFolder={setIsFolder} onFileClick={onFileClick} />);
  }

  const handleClick = () => {
    if (children) {
      setExpanded(!expanded);
    } else {
      onFileClick(item);
    }
  };

  const handleContextMenu =  (isFolder) => (e) => {
    e.preventDefault();
    setAnchorEl(e.target);
    setIsFolder(isFolder);
  }

  return <>
    <ListItemButton key={item?.folderName || item.fileName} onClick={handleClick} selected={expanded} onContextMenu={handleContextMenu(Boolean(item.folderName))}>
      <ListItemIcon style={{ minWidth: 35 }}>
        {children && (expanded ? <ArrowCircleDown /> : <ArrowCircleRight />)}
      </ListItemIcon>
      <ListItemText primary={(item?.folderName || item.fileName)?.split('\\').pop()} />
    </ListItemButton>
    {children && expanded && <div>
      {children}
    </div>}
  </>
}

const RightClickMenu = ({ isFolder, anchorEl, setAnchorEl, onClickItem }) => {
  return <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={() => setAnchorEl(null)}
  >
    {isFolder &&<><MenuItem onClick={onClickItem('File')}>New File</MenuItem><MenuItem onClick={onClickItem('Folder')}>New Folder</MenuItem></>}
    <MenuItem onClick={onClickItem('Delete')}>Delete</MenuItem>
  </Menu>
}
