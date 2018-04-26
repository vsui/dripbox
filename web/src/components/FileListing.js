import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router';
import isInPath from '../utils/path';

import { LIST_FILES_REQUESTED, UPLOAD_FILE_REQUESTED } from '../redux/actions';
import File from './File';
import Folder from './Folder';
import FolderAdder from './FolderAdder';
import PathNavigator from './PathNavigator';

const FileListing = props => (
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
        props.files.map((file) => {
          if (file.fileName.endsWith('/')) {
            return <Folder key={file.fileName} {...file} folderName={file.fileName.slice(0, -1)} />;
          }
          return <File key={file.fileName} {...file} />;
        })
      }
    </Dropzone>
  </div>
);

FileListing.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    fileName: PropTypes.string.isRequired,
  })).isRequired,
  refresh: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

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
