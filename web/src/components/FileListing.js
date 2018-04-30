import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import isInPath, { pathJoin } from '../utils/path';

import { LIST_FILES_REQUESTED, UPLOAD_FILE_REQUESTED } from '../redux/actions';
import { listFolder, upload, remove } from '../utils/api';
import File from './File';
import Folder from './Folder';
import FolderAdder from './FolderAdder';
import PathNavigator from './PathNavigator';

// https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
class FileListing extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.path !== prevState.prevPath) {
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
    this._loadFiles(this.props.path);
  }

  componentDidUpdate() {
    if (this.state.files === null) {
      this._loadFiles(this.props.path);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      // cancel request...
    }
  }

  uploadFile(file) {
    upload(pathJoin(this.props.path, file.name), file)
      .then(() => {
        this.setState({
          files: [...this.state.files, {
            fileName: file.name,
            lastModified: String(file.lastModified),
            fileSize: file.size,
          }],
        });
      })
      .catch(() => {
        toast('Upload failed');
      });
  }

  deleteFile(file) {
    remove(pathJoin(this.props.path, file.fileName))
      .then(() => {
        this.setState({
          files: this.state.files.filter(({ fileName }) => fileName !== file.fileName),
        });
      }).catch(() => {
        toast('Delete failed');
      });
  }

  _loadFiles(path) {
    this._asyncRequest = listFolder(path)
      .then((files) => {
        this._asyncRequest = null;
        this.setState({ files });
      });
  }

  render() {
    const { props } = this;
    if (this.state.files === null) {
      return (
        <div>
          <PathNavigator prefix="/home" path={props.location.pathname.substring(5)} />
          loading...
        </div>
      );
    }
    return (
      <Dropzone
        style={{ height: '100%', width: '100%' }}
        activeStyle={{ backgroundColor: 'red' }}
        acceptStyle={{ backgroundColor: 'green' }}
        disableClick
        onDrop={files =>
          files.map(file =>
            this.uploadFile(file))}
      >
        <PathNavigator prefix="/home" path={props.location.pathname.substring(5)} />
        <FolderAdder />
        {
          this.state.files.map((file) => {
            if (file.fileName.endsWith('/')) {
              return (
                <Folder
                  key={file.fileName}
                  {...file}
                  folderName={file.fileName.slice(0, -1)}
                />
              );
            }
            return (
              <File
                key={file.fileName}
                deleteFile={() => this.deleteFile(file)}
                {...file}
                fullPath={pathJoin(props.path, file.fileName)}
              />
            );
          })
        }
      </Dropzone>
    );
  }
}

// TODO move more logic into mappers
const mapStateToProps = state => ({
  files: state.files.filter(file => isInPath(state.path, file.fileName)),
});
const mapDispatchToProps = dispatch => ({
  refresh: () => dispatch({ type: LIST_FILES_REQUESTED }),
  upload: (name, file) => dispatch({ type: UPLOAD_FILE_REQUESTED, name, file }),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileListing));
