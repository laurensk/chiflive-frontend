import React from "react";
import "./App.css";
import { Switch, Route, HashRouter } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Admin } from "./pages/admin/Admin";

function App() {
  return (
    <HashRouter>
      <div>
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
