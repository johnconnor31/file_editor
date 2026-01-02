import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddIcon from "@material-ui/icons/Add";

var TabsEditor = function (props) {
  var update = props.update;
  var savefile = props.savefile;
  // console.log(props.allTabs);
  const tabsComponents = props.allTabs.map((tab, i) => {
    // console.log(i,tab);
    return (
      <Tab key={i} label={tab.fileName} value={tab.fileName}>
        <textarea
          value={tab.fileContent}
          onKeyDown={(e) =>
            e.keyCode === 83 && e.ctrlKey
              ? (function (e) {
                  console.log("gotcha save");
                  e.preventDefault();
                  update;
                })(e)
              : ""
          }
          onChange={update}
        />
      </Tab>
    );
  });

  tabsComponents.push(
    <Tab
      key={"addFile"}
      icon={<AddIcon />}
      disableRipple
      onClick={props.addNewFile}
    ></Tab>,
  );
  // console.log(TabsComponents);
  return (
    <Tabs
      value={props.currentFile}
      onChange={props.handleTabSwitch}
      variant="scrollable"
      tabScrollButtonProps={{
        classes: {
          root: {
            background: "lightblue !important",
            borderRadius: "10px !important",
          },
        },
      }}
    >
      {tabsComponents}
    </Tabs>
  );
};

export default TabsEditor;
