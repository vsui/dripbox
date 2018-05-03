import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { listSharedFolder } from '../utils/api';
import SharedFolder from './SharedFolder';
import SharedFile from './SharedFile';
import FilePreview from './FilePreview';
import { pathJoin } from '../utils/path';

class SharedFileListing extends Component {
  static propTypes = {
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.history.location.pathname.substring('/shared/folders'.length) !== prevState.prevPath) {
      return {
        files: null,
        prevPath: nextProps.path,
      };
    }
    return null;
  }

  state = {
    files: null,
  }

  componentDidMount() {
    this._loadFiles(this.props.history.location.pathname.substring('/shared/folders'.length));
  }

  componentDidUpdate() {
    if (this.state.files === null) {
      this._loadFiles(this.props.history.location.pathname.substring('/shared/folders'.length));
    }
  }

  _loadFiles(path) {
    this._asyncRequest = listSharedFolder(path)
      .then((files) => {
        this._asyncRequest = null;
        console.log(files);
        console.log('^^^');
        this.setState({ files });
      });
  }

  render() {
    if (this.state.files === null) {
      return <div>loading...</div>;
    }
    if (this.props.history.location.search.length > 0) {
      const fileName = this.props.history.location.search.substring('?preview='.length);
      const filePath = this.props.history.location.pathname.substring('/shared/folders'.length);
      const folderPath = this.props.history.location.pathname;
      return (
        <FilePreview
          shared
          fileName={fileName}
          filePath={pathJoin(filePath, fileName)}
          folderPath={folderPath}
        />
      );
    }
    return (
      <div>
        {this.state.files.map((file) => {
          if (file.fileName.endsWith('/')) {
            return (
              <SharedFolder
                key={file.fileName}
                folderName={file.fileName.slice(0, -1)}
                {...file}
              />
            );
          }
          return (
            <SharedFile
              key={file.fileName}
              {...file}
              fullPath={`${this.props.history.location.pathname.substring('/shared/folders'.length)}/${file.fileName}`}
            />
          );
        })}
      </div>
    );
  }
}

export default withRouter(SharedFileListing);
