import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { getSharedFile, getSharedName } from '../utils/api';

class SharedFilePreview extends Component {
  static propTypes = {
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  state = {
    blob: null,
    fileName: null,
  }

  componentDidMount() {
    this._loadFile();
  }

  _loadFile() {
    const id = this.props.history.location.pathname.substring('/shared/files/'.length);
    this._asyncRequest = Promise.all([getSharedFile(id), getSharedName(id)])
      .then(([blob, shared]) => {
        this._asyncRequest = null;
        this.setState({ fileName: shared.key, blob });
      });
  }

  render() {
    if (this.state.blob === null) {
      return <div>loading...</div>;
    }
    const extensionStart = this.state.fileName.lastIndexOf('.');
    const extension = this.state.fileName.substring(extensionStart + 1);
    if (extension === 'png' || extension === 'jpg') {
      const url = URL.createObjectURL(this.state.blob);
      return (
        <div>
          File preview of {this.state.fileName}
          <img style={{ width: '100%' }} src={url} alt={this.state.fileName} />
        </div>
      );
    } else if (extension === 'pdf') {
      const url = URL.createObjectURL(new Blob([this.state.blob], { type: 'application/pdf' }));
      return (
        <div style={{ height: '100%' }}>
          <embed
            style={{ width: '100%', height: '100%' }}
            src={url}
            type="application/pdf"
            width="600"
            height="500"
            alt="pdf"
          />
        </div>
      );
    }
    const url = URL.createObjectURL(new Blob([this.state.blob], { type: 'text/plain' }));
    return (
      <div style={{ height: '100%' }}>
        <embed style={{ width: '100%', height: '100%' }} src={url} type="text/plain" width="600" height="500" alt="pdf" />
      </div>
    );
  }
}

export default withRouter(SharedFilePreview);
