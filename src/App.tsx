import '@ionic/react/css/core.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import React from 'react';
import Page from './pages/Page';
import { Database_manager } from './utils/database/database_manager'
import { App_manager } from './utils/database/app_manager'


const db_manager = new Database_manager()
export var databaseContext = React.createContext(db_manager);

// const app_manager = new App_manager(db_manager.app_db)
// export var appContext = React.createContext(app_manager);

const App: React.FC = () => {
  return (
    <databaseContext.Provider value={db_manager}>
      <Page />
    </databaseContext.Provider>
  );
};

export default App;
