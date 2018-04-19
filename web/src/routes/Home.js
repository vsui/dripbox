import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { list } from '../utils/api';

export default class Home extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  state = {
    files: [],
  }

  componentDidMount() {
    list().then((items) => {
      console.log(items);
      this.setState({
        files: items,
      });
    });
  }

  render() {
    return (
      <div>
        <h1>{this.props.username}</h1>
        {
          this.state.files.map(({ Key }) => (
            <h3 key={Key}>{Key}</h3>
          ))
        }
      </div>
    );
  }
}
