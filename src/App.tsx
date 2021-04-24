// import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';
// import { Route } from 'react-router-dom';
// import Page from './pages/Page';
import Task from './pages/Task_creation';

// /* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

// /* Basic CSS for apps built with Ionic */
// import '@ionic/react/css/normalize.css';
// import '@ionic/react/css/structure.css';
// import '@ionic/react/css/typography.css';

// /* Optional CSS utils that can be commented out */
// import '@ionic/react/css/padding.css';
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';

// /* Theme variables */
// import './theme/variables.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Page from './pages/Page';


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
