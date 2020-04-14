import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

//TODO: this has got to be changed, so it suits functionality of register forms...
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

// TODO: Do i need proptypes?
// PrivateRoute.propTypes = {
//   auth: PropTypes.object.isRequired
// };

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
