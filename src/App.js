import React, { useEffect, useState } from "react";
import $ from 'jquery';
import Button from "@mui/material/Button";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import "./App.css";
import TabsEditor from "./TabsEditor";
import { initSocketHandler, socketIo } from "./socketHandler";
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, ListItem, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { Menu as MenuIcon, ChevronLeft, Flare } from '@mui/icons-material';
import SideMenu from './SideMenu';

const drawerWidth = 200;
export default function App() {
    const [fileList, setFileList] = useState(['Untitled']);
    console.log('file list', fileList);
    const [currentFile, setCurrentFile] = useState({ fileName: 'Untitled', fileContent: '' });
    const [menu, setMenu] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        initSocketHandler(fileList, setFileList, setCurrentFile);
        // $(document).ready(function () {
        //     console.log($('Drawer'));
        //     $(document).on('keyup', function (e) {
        //         if (e.key === 'Escape')
        //             setAnchorEl(null);
        //     });
        //     $(document).click(function (event) {
        //         console.log(event.target, 'clicked');
        //         if (!$(event.target).closest('Drawer').length && !$(event.target).closest('.fileList').length) {
        //             console.log('closing menu');
        //             setAnchorEl(null);
        //         }
        //     });
        // });
    }, []);


    const updateFile = (value) => {
        // console.log(e.target.value);
        // this.setState({currentText:e.target.value});

        var fl = [...fileList];
        fl.forEach((file) => {
            if (file?.fileName === currentFile.fileName) {
                file.fileContent = value;
                setCurrentFile({ ...currentFile, fileContent: value });
            }
        });

        socketIo.emit("savefile", currentFile);
    }

    const openNewFile = () => {
        const fl = [...fileList];
        if (fl.length === 0 || (fl.length !== 0 && currentFile.fileName !== "Untitled")) {
            const newFile = {
                fileName: "Untitled",
                fileContent: ""
            };
            fl.push(newFile);
            setCurrentFile(currentFile);
            setFileList(fl);
        } else {
            fl[fl.length - 1].fileContent = "";
            setCurrentFile({ ...currentFile, fileContent: "" });
            setFileList(fle);
        }
    }
    const saveFileAs = () => {
        if (newName !== "") {
            console.log("sending new file event");
            var fl = [...fileList];
            fl[0].fileName = newName + ".txt";
            fl[0].fileContent = content;
            this.setState({
                fileList: fl,
                currentFile: newName + ".txt",
                errorMessage: "File created",
                isNewFile: false
            });

            socketIo.emit("newfile", {
                fileName: newName + ".txt",
                fileContent: content
            });
        } else {
            this.setState({ errorMessage: "Please enter a file name" });
        }
    }

    const openMenu = (menu) => (e) => {
        if (menu === 'file') {
            setMenu(['New file', 'Save as', 'Close all']);
        } else if (menu === 'options') {
            setMenu(['Set Language']);
        }
        setAnchorEl(e.target);
    }

    const handleMenuItemClick = (item) => () => {
        if(item === 'New file') {
            openNewFile();
        }
    }

    return (
        <>
            <Box>
                <AppBar sx={{ height: 50, position: 'relative', display: 'flex', justifyContent: 'center', marginLeft: isDrawerOpen && `${drawerWidth}px` }}>
                    <Toolbar>
                        <IconButton
                            size='large'
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Button color="inherit" onClick={openMenu('file')}>File</Button>
                        <Button color="inherit" onClick={openMenu('options')}>Options</Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}>
                            {menu.map((item) => <MenuItem key={item} onClick={handleMenuItemClick(item)}>{item}</MenuItem>)}
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Drawer
                    anchor='left'
                    open={isDrawerOpen}
                    variant='persistent'
                    sx={{
                        width: drawerWidth,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                        }
                    }}
                    onClose={() => setIsDrawerOpen(false)}>
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '50px', marginBottom: 0, width: '100%' }}>
                            <IconButton onClick={() => setIsDrawerOpen(false)}>
                                <ChevronLeft />
                            </IconButton>
                        </Box>
                        <Divider />
                        {fileList?.map((file) => <ListItem key={file?.fileName}>
                            <ListItemText primary={file?.fileName} />
                        </ListItem>)}
                    </>
                </Drawer>
            </Box>
            <TabsEditor
                updateFile={updateFile}
                openedTabs={fileList}
                currentFile={currentFile}
                handleTabSwitch={setCurrentFile}
                drawerWidth={drawerWidth}
                isDrawerOpen={isDrawerOpen}
            />
        </>
    );
};
