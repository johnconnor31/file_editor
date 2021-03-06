import React from "react";
import { Tabs, Tab } from "material-ui/Tabs";

var TabsEditor = function(props) {
  var update = props.update;
  var savefile = props.savefile;
  // console.log(props.allTabs);
  var TabsComponents = props.allTabs.map((tab, i) => {
    // console.log(i,tab);
    return (
      <Tab key={i} label={tab.fileName} value={tab.fileName}>
        <textarea
          value={tab.fileContent}
          onKeyDown={e =>
            (e.keyCode === 83 && e.ctrlKey)
              ? (function(e) {
                  console.log("gotcha save");
                  e.preventDefault();
                  update;
                })(e)
              : ""}
          onChange={update}
        />
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
