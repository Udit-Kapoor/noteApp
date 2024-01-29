// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
