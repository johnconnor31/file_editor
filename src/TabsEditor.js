import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Box } from "@mui/material";

export default function Editor({ updateFile, currentFile, handleTabSwitch, openedTabs, drawerWidth, isDrawerOpen }) {
    console.log('opend is', openedTabs);
    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={currentFile.fileName}
                onChange={handleTabSwitch}
                style={{
                    marginLeft: isDrawerOpen && drawerWidth,
                    flex: 1,
                    overflowY: "auto",
                    display: 'flex',
                 }}
                contentContainerStyle={{ overflowX: "hidden" }}
            >
                {openedTabs.map((tabData, i) => {
                    console.log('tabdata',);
                    return  <Tab key={tabData.fileName + `${i}`} label={tabData.fileName} value={tabData.fileName} />;
                                        })}
            </Tabs>
            <CodeEditor
                value={currentFile.fileContent}
                language="js"
                placeholder="Please enter JS code."
                onChange={(evn) => updateFile(evn.target.value)}
                padding={15}
                style={{
                    fontSize: 12,
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    height: '90vh',
                    marginLeft: isDrawerOpen ? drawerWidth+20  : '20px'
                }}
            />
            </Box>
            );
};
