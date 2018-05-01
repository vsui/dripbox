import React from 'react';
import jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Header as H, Nav, StyledLink } from '../styled';


const Header = (props) => {
  const token = localStorage.getItem('token');
  const username = token === null ? null : jwt.decode(token).username;
  const { pathname: path } = props.location;
  return (
    <H onRegister={path === '/'}>
      <Nav>
        <StyledLink to="/">Squidbox</StyledLink>
        <StyledLink to="/home">Home</StyledLink>
        {
          token !== null &&
            <StyledLink to="/account">Account</StyledLink>
        }
        {
          token === null
            ? <StyledLink to="/login">Login</StyledLink>
            : <StyledLink to="/logout">Logout</StyledLink>
        }
      </Nav>

      <h1>Cloud,</h1>
      <h1>now for the rest of us.</h1>
    </H>
  );
};

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Header);
