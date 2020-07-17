import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import NotifyBar from "../components/notify/NotifyBar";
import LoginDialog from "../components/auth/LoginDialog";
import ResetPassword from "../components/auth/ResetPassword";
import GuestAccount from "../components/auth/register/GuestAccount";
import RegisterStepper from "../components/auth/register/RegisterStepper";
import PrivateRoute from "../clientroutes/PrivateRoute";

const Routes = ({ toggleTheme }) => {
  return (
    <section className="container">
      <NotifyBar />
      {/* // Render Dashboard always, then show chatroom with id */}
      <Switch>
        <Route path="/login" component={LoginDialog} />
        <Route path="/reset/:token" component={ResetPassword} />
        <Route path="/register" component={RegisterStepper} />
        <Route path="/guest" component={GuestAccount} />
        <PrivateRoute
          path="/"
          component={() => <Dashboard toggleTheme={toggleTheme} />}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </section>
  );
};

export default Routes;
