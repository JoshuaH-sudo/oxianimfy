import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Play from './pages/Play';
import Task from './pages/Task_creation';
import Edit_task_menu from './pages/Edit_task_menu';
import { HashRouter, Route, Switch } from "react-router-dom";
import Task_selection from './pages/Task_selection';
import {
  EuiPanel,
  EuiButton
} from '@elastic/eui';

ReactDOM.render(
  <React.StrictMode>
    <EuiPanel>
      <EuiButton fill href="#/">Home</EuiButton>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/task-creation" component={Task} />
          <Route path="/task_selection" component={Task_selection} />
          <Route path="/play" component={Play} />
          <Route path="/edit-tasks" component={Edit_task_menu} />
        </Switch>
      </HashRouter>
    </EuiPanel>
  </React.StrictMode>,
  document.getElementById('root')
);

