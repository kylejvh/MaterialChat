import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import NotifyBar from "../components/notify/NotifyBar";
import LoginDialog from "../components/auth/LoginDialog";
import ChatWindow from "../components/ChatWindow";

import Friends from "../components/Friends";
import RegisterDialog from "../components/auth/RegisterDialog";
import PrivateRoute from "../clientroutes/PrivateRoute";

const Routes = () => {
  return (
    <section className="container">
      <NotifyBar />
      {/*  should this be a private route? */}
      {/* FOR NOW, ENTIRE APP SHOULD BE PRIVATE. FIND A WAY TO INSTANTly
      REDIRECT IF ISAUTH STATE IS NOT TRUE... */}
      {/* //! PrivateRoute // Render Dashboard always, then show chatroom with id */}
      <PrivateRoute
        path={["/", "/chatroom/:id", "/friends"]}
        component={Dashboard}
      />

      {/* <Route exact path={"/" | "chatroom/:id"}>

        <Dashboard>
          <ChatWindow />
        </Dashboard>
      </Route> */}
      <Route exact path="/login" component={LoginDialog} />
      <Route exact path="/register" component={RegisterDialog} />
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
      {/* <PrivateRoute exact path='/create-profile' component={CreateProfile} /> 

       
        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/add-experience' component={AddExperience} />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <PrivateRoute exact path='/posts' component={Posts} />
        <PrivateRoute exact path='/posts/:id' component={Post} /> */}
      {/* <Route
        // component={NotFound}
        /> */}
    </section>
  );
};

export default Routes;
