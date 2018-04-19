import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import jwt from 'jsonwebtoken';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      localStorage.getItem('token') !== null
        ? <Component {...props} username={jwt.decode(localStorage.getItem('token')).username} />
        : <Redirect to="/login" />
    )}
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default ProtectedRoute;
