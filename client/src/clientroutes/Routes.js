import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import NotifyBar from "../components/notify/NotifyBar";
import LoginDialog from "../components/auth/LoginDialog";
import RegisterStepper from "../components/auth/register/RegisterStepper";
import PrivateRoute from "../clientroutes/PrivateRoute";

const Routes = () => {
  return (
    <section className="container">
      <NotifyBar />
      {/* FOR NOW, ENTIRE APP SHOULD BE PRIVATE. FIND A WAY TO INSTANTly
      REDIRECT IF ISAUTH STATE IS NOT TRUE... */}
      {/* //! PrivateRoute // Render Dashboard always, then show chatroom with id */}
      <PrivateRoute
        path={["/", "/chatroom/:id", "/friends"]}
        component={Dashboard}
      />
      <Route exact path="/login" component={LoginDialog} />
      <Route exact path="/register" component={RegisterStepper} />
      <Route
        exact
        path="/friends"
        //TODO show all users logged in, or your friends???
      />
      <Route
        exact
        path="/user/:id"
        //TODO component={UserPage}
        // show a user's specific page
      />
    </section>
  );
};

export default Routes;
