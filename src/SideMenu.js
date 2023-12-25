import React, { useState } from 'react';
import { List, ListItem } from '@mui/material';
import InsertDriveFile from '@mui/icons-material/FolderOpen';
import Subheader from '@mui/material/ListSubheader';

export default function SideMenu({ folders, onClick, item }) {
    const [open, setOpen] = useState(false);

    const names = item?.fileName?.split('\\');
    if (folders[0] !== undefined) {
        var folderStructure = this.renderFolder(folders[0], 0);
        console.log('folder sturcture' + folderStructure);
        return (
            <List className="menu-list">
                <Subheader>List of Files</Subheader>
                <ListItem key={i}
                    primaryText={names[names.length - 1]}
                    leftIcon={<InsertDriveFile />}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true} />
            </List>
        );
    }
    return null;
};
