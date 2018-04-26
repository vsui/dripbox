import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router';
import isInPath from '../utils/path';

import { LIST_FILES_REQUESTED, UPLOAD_FILE_REQUESTED } from '../redux/actions';
import { listFolder } from '../utils/api';
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
      <div>
        { props.location.pathname }
        <PathNavigator prefix="/home" path={props.location.pathname.substring(5)} />
        <FolderAdder />
        <button onClick={props.refresh}>Refresh</button>
        <Dropzone
          disableClick
          onDrop={files =>
            files.map(file =>
              props.upload(file.name, file))}
        >
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
              return <File key={file.fileName} {...file} />;
            })
          }
        </Dropzone>
      </div>
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
