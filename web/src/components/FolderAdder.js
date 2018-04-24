import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ADD_FOLDER_REQUESTED } from '../redux/actions';

class FolderAdder extends Component {
  state = {
    folderName: '',
  };

  onChange = e => this.setState({ folderName: e.target.value })
  onClick = () => this.props.addFolder(this.state.folderName)

  render() {
    return (
      <div>
        <input onChange={this.onChange} value={this.state.folderName} />
        <button onClick={this.onClick}>Add folder</button>
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  addFolder: folderName => dispatch({ type: ADD_FOLDER_REQUESTED, folderName }),
});

export default connect(null, mapDispatchToProps)(FolderAdder);
