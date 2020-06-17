import React from "react";
import { Route } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import NotifyBar from "../components/notify/NotifyBar";
import LoginDialog from "../components/auth/LoginDialog";
import RegisterStepper from "../components/auth/register/RegisterStepper";
import PrivateRoute from "../clientroutes/PrivateRoute";

const Routes = () => {
  return (
    <section className="container">
      <NotifyBar />
      {/* // Render Dashboard always, then show chatroom with id */}
      <PrivateRoute path={["/", "/chatroom/:id"]} component={Dashboard} />
      <Route exact path="/login" component={LoginDialog} />
      <Route exact path="/register" component={RegisterStepper} />
    </section>
  );
};

export default Routes;
