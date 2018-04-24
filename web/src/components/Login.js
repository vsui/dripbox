import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import jwt from 'jsonwebtoken';

import { Input, Button } from '../styled';
import { login } from '../utils/api';
import store from '../redux/store';
import { LIST_FILES_REQUESTED } from '../redux/actions';

class Login extends Component {
  static propTypes = {
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  }

  state = {
    username: '',
    password: '',
  }

  onUsernameChange = e => this.setState({ username: e.target.value })

  onPasswordChange = e => this.setState({ password: e.target.value })

  onLoginClick = () => {
    const { username, password } = this.state;
    login(username, password)
      .then((token) => {
        // Probably best to put this all in api?
        localStorage.setItem('token', token);
        this.props.history.push('/home', null);
        toast(`Welcome, ${jwt.decode(token).username}`);
        store.dispatch({ type: LIST_FILES_REQUESTED });
      })
      .catch(() => {
        toast('Authentication failed');
      });
  }

  render() {
    const { username, password } = this.state;
    return (
      <div>
        <Input
          value={username}
          placeholder="Username"
          onChange={this.onUsernameChange}
        />
        <Input
          value={password}
          placeholder="Password (min. 10 characters)"
          type="password"
          onChange={this.onPasswordChange}
        />
        <Button onClick={this.onLoginClick}>Login</Button>
      </div>
    );
  }
}

export default withRouter(Login);
