import React from "react";
import Page from "./pages/Page";
import { Database_manager } from "./utils/database/database_manager";

const db_manager = new Database_manager();
export var databaseContext = React.createContext(db_manager);

const App: React.FC = () => {
  return (
    <databaseContext.Provider value={db_manager}>
      <Page />
    </databaseContext.Provider>
  );
};

export default App;
