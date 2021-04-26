import '@ionic/react/css/core.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Page from './pages/Page';
import Task from './pages/Task_creation';
import { database } from './utils/database'

const app_db = new database()
export var databaseContext = React.createContext(app_db);

const App: React.FC = () => {
  return (
    <databaseContext.Provider value={app_db}>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Page} />
            <Route path="/task" component={Task} />
          </Switch>
        </Suspense>
      </Router>
    </databaseContext.Provider>
  );
};

export default App;
