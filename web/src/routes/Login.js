import React from 'react';
import { Link } from 'react-router-dom';

import Login from '../components/Login';
import { Header } from '../styled';

export default () => (
  <div>
    <Header>Log in</Header>
    <Login />
    <Link to="/">Or register</Link>
  </div>
);
