import React from 'react';
import PropTypes from 'prop-types';

const Folder = props => (
  <div>FOLDER { props.folderName }</div>
);

Folder.propTypes = {
  folderName: PropTypes.string.isRequired,
};

export default Folder;
