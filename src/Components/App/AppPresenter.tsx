import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import routes from "../../routes";
import AddPlace from "../../Routes/AddPlace";
import EditAccount from "../../Routes/EditAccount";
import FindAddress from "../../Routes/FindAddress";
import Home from "../../Routes/Home";
import Login from "../../Routes/Login";
import PhoneLogin from "../../Routes/PhoneLogin";
import Places from "../../Routes/Places";
import Ride from "../../Routes/Ride";
import Settings from "../../Routes/Settings";
import SocialLogin from "../../Routes/SocialLogin";
import VerifyPhone from "../../Routes/VerifyPhone";

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    <Fragment>{isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</Fragment>
  </BrowserRouter>
);

const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route path={routes.login} exact={true} component={Login} />
    <Route path={routes.phoneLogin} component={PhoneLogin} />
    <Route path={routes.verifyPhone} component={VerifyPhone} />
    <Route path={routes.socialLogin} component={SocialLogin} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

const LoggedInRoutes: React.SFC = () => (
  <Switch>
    <Route path={routes.home} exact={true} component={Home} />
    <Route path={routes.ride} exact={true} component={Ride} />
    <Route path={routes.editAccount} exact={true} component={EditAccount} />
    <Route path={routes.settings} exact={true} component={Settings} />
    <Route path={routes.places} exact={true} component={Places} />
    <Route path={routes.addPlace} exact={true} component={AddPlace} />
    <Route path={routes.findAddress} exact={true} component={FindAddress} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default AppPresenter;
