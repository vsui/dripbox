import React from 'react';
import jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const Header = (props) => {
  const token = localStorage.getItem('token');
  const username = token === null ? null : jwt.decode(token).username;
  return token === null
    ? (
      <div>
        Log in
      </div>
    )
    : (
      <div>
        Logged in as { username }
        <button
          onClick={() => {
            localStorage.removeItem('token');
            props.history.push('/', null);
          }}
        >
          Logout
        </button>
      </div>
    );
};

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Header);
