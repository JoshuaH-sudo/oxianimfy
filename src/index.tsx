import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Play from './pages/Play';
import Task from './pages/Task_creation';
import { HashRouter, Route, Switch } from "react-router-dom";
import Task_selection from './pages/Task_selection';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <div>
        <Route path="/" exact component={App} />
        <Route path="/task-creation" component={Task} />
        <Route path="/task_selection" component={Task_selection} />
        <Route path="/play" component={Play} />
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

