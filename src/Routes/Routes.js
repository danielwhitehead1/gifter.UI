import React from "react";
import { Switch } from "react-router-dom";
import Home from "./../Views/Home/Home";
import Signup from "./../Views/Signup/Signup";
import Login from "./../Views/Login/Login";
import Contacts from "./../Views/Contacts/Contacts";
import Profile from "./../Views/Profile/Profile";
import AppliedRoute from '../Components/AppliedRoute/AppliedRoute';

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute component={Home} props={childProps} exact path="/" />
    <AppliedRoute component={Contacts} props={childProps} exact path="/contacts" />
    <AppliedRoute component={Profile} props={childProps} exact path="/profile" />
    <AppliedRoute component={Signup} props={childProps} exact path="/signup" />
    <AppliedRoute component={Login} props={childProps} exact path="/login" />
  </Switch>;