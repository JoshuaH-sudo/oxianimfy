import '@ionic/react/css/core.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import React from 'react';
import Page from './pages/Page';
import { Task_database } from './utils/task_database'

const task_db = new Task_database()
export var databaseContext = React.createContext(task_db);

const App: React.FC = () => {
  return (
    <databaseContext.Provider value={task_db}>
      <Page />
    </databaseContext.Provider>
  );
};

export default App;
