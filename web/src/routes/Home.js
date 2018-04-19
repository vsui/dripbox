import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { list, upload } from '../utils/api';

export default class Home extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  state = {
    files: [],
    selected: null,
  }

  componentDidMount() {
    list().then((items) => {
      console.log(items);
      this.setState({
        files: items,
      });
    });
  }

  onSubmit = () => {
    const file = this.state.selected;
    if (file == null) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      upload(file.name, reader.result)
        .then(() => {
          this.setState({
            files: [...this.state.files, { Key: file.name }],
          });
        });
    });
    reader.readAsText(file);
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
        <input type="file" onChange={e => this.setState({ selected: e.target.files[0] })} />
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}
