import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Play from "./pages/Play";
import Task from "./pages/Task_creation";
import Edit_task_menu from "./pages/Edit_task_menu";
import { Stats } from "./pages/Stats_display";
import Task_selection from "./pages/Task_selection";

import { HashRouter, Route, Switch } from "react-router-dom";
import { EuiPanel, EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Control_bar, Nav_bar } from "./components/navigation";

ReactDOM.render(
  <React.StrictMode>
    {/* <Nav_bar /> */}

    <EuiFlexGroup
      direction="column"
      justifyContent="spaceEvenly"
      id="main_content"
      responsive={false}
    >
      <EuiFlexItem id="main_content_flexbox">
        <EuiPanel>
          <HashRouter>
            <Switch>
              <Route path="/" exact component={App} />
              <Route path="/task-creation" component={Task} />
              <Route path="/task_selection" component={Task_selection} />
              <Route path="/play" component={Play} />
              <Route path="/edit-tasks" component={Edit_task_menu} />
              <Route path="/stats" component={Stats} />
            </Switch>
          </HashRouter>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
    <Control_bar />
  </React.StrictMode>,
  document.getElementById("root")
);
