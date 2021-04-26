import '@ionic/react/css/core.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Page from './pages/Page';
import Task from './pages/Task_creation';


const App: React.FC = () => {
  return (
    <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Page}/>
        <Route path="/task" component={Task}/>
      </Switch>
    </Suspense>
  </Router>
  );
};

export default App;
