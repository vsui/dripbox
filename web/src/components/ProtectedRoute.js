import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      localStorage.getItem('token') !== null
        ? <Component {...props} username={jwt.decode(localStorage.getItem('token')).username} />
        : <Redirect to="/login" sideEffect={toast('You need to be logged in to access that URL')} />
    )}
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
}

export default ProtectedRoute;
