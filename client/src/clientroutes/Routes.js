import React from "react";
import { Route } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import NotifyBar from "../components/notify/NotifyBar";
import LoginDialog from "../components/auth/LoginDialog";
import ResetPassword from "../components/auth/ResetPassword";
import RegisterStepper from "../components/auth/register/RegisterStepper";
import PrivateRoute from "../clientroutes/PrivateRoute";

const Routes = () => {
  return (
    <section className="container">
      <NotifyBar />
      {/* // Render Dashboard always, then show chatroom with id */}

      <Route exact path="/login" component={LoginDialog} />
      <Route exact path="/reset/:token" component={ResetPassword} />
      <Route exact path="/register" component={RegisterStepper} />
      <PrivateRoute exact path={["/", "/chatroom/:id"]} component={Dashboard} />
    </section>
  );
};

export default Routes;
