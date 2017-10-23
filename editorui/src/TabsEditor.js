import React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import AceEditor from 'react-ace';
var TabsEditor = function(props) {
  var update = props.update;
  var savefile = props.savefile;
  // console.log(props.allTabs);
  var TabsComponents = props.allTabs.map((tab, i) => {
    // console.log(i,tab);
    return (
      <Tab key={i} label={tab.fileName} value={tab.fileName}>
        <AceEditor
            mode="csharp"
            theme="terminal"
            onChange={update}
            name="Editor"
            editorProps={{$blockScrolling: true}} 
            value = {tab.fileContent} />
            
      </Tab>
    );
  });
  // console.log(TabsComponents);
  return (
    <Tabs
      value={props.currentFile}
      onChange={props.handleTabSwitch}
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}
      contentContainerStyle={{ overflowX: "scroll" }}
    >
      {TabsComponents}
    </Tabs>
  );
};

export default TabsEditor;
