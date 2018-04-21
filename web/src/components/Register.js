import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import jwt from 'jsonwebtoken';

import { Input, Button } from '../styled';
import { register } from '../utils/api';

class Register extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    username: '',
    usernameError: '',
    password: '',
    confirmedPassword: '',
    passwordError: '',
  }

  onUsernameChange = (e) => {
    this.setState({ username: e.target.value });
    this.validateUsername(e.target.value);
  }
  onPasswordChange = (e) => {
    this.setState({ password: e.target.value });
    this.validatePasswords(this.state.confirmedPassword, e.target.value);
  }
  onConfirmedPasswordChange = (e) => {
    this.setState({ confirmedPassword: e.target.value });
    this.validatePasswords(e.target.value, this.state.password);
  }
  onClickRegister = () => {
    const { username, password } = this.state;
    register(username, password)
      .then((token) => {
        localStorage.setItem('token', token);
        this.props.history.push('/home', null);
        toast(`Registration successful, welcome ${jwt.decode(token).username}!`);
      })
      .catch(() => {
        toast('Registration failed');
      });
  }
  validatePasswords = (confirmedPassword, password) => {
    if (password.length < 8) {
      this.setState({ passwordError: 'Password must be at least 8 characters!' });
      return;
    }
    if (password !== confirmedPassword) {
      this.setState({ passwordError: 'Passwords must match!' });
    } else {
      this.setState({ passwordError: '' });
    }
  }
  validateUsername = (username) => {
    const regex = /^\w+$/;
    if (!regex.test(username)) {
      this.setState({ usernameError: 'Username should only contain letters, digits, and underscores!' });
    } else {
      this.setState({ usernameError: '' });
    }
  }

  render() {
    const {
      username,
      password,
      confirmedPassword,
      passwordError,
      usernameError,
    } = this.state;

    return (
      <div>
        <Input
          value={username}
          placeholder="Username"
          onChange={this.onUsernameChange}
        />
        { usernameError }
        <Input
          value={password}
          placeholder="Password (min. 8 characters)"
          type="password"
          onChange={this.onPasswordChange}
          minlength="8"
        />
        <Input
          value={confirmedPassword}
          ref={(c) => { this.hello = c; }}
          placeholder="Confirm password"
          type="password"
          onChange={this.onConfirmedPasswordChange}
          minlength="8"
        />
        { passwordError }
        <Button
          disabled={usernameError !== '' || passwordError !== ''}
          onClick={this.onClickRegister}
        >
          Sign up
        </Button>

        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default withRouter(Register);
