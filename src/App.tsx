import '@ionic/react/css/core.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, Suspense } from 'react';
import { HashRouter, Route } from "react-router-dom";
import Page from './pages/Page';
import Task from './pages/Task_creation';
import { Task_database } from './utils/task_database'
import Play from './pages/Play';

const task_db = new Task_database()
export var databaseContext = React.createContext(task_db);

const App: React.FC = () => {
  return (
    <databaseContext.Provider value={task_db}>
      <HashRouter>
        <div>
          <Route exact path="/" component={Page} />
          <Route path="/task-creation" component={Task} />
          <Route path="/play" component={Play} />
        </div>
      </HashRouter>
    </databaseContext.Provider>
  );
};

export default App;
