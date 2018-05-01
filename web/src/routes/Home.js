import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FileListing from '../components/FileListing';
import FilePreview from '../components/FilePreview';

import { pathJoin } from '../utils/path';

const Home = (props) => {
  if (props.location.search.length > 0) {
    const fileName = props.location.search.substring('?preview='.length);
    const filePath = props.location.pathname.substring('/home'.length);
    const folderPath = props.location.pathname;
    return (
      <FilePreview
        fileName={fileName}
        filePath={pathJoin(filePath, fileName)}
        folderPath={folderPath}
      />
    );
  }

  return (
    <div>
      <FileListing path={props.location.pathname.substring('/home'.length)} />
    </div>
  );
};

Home.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Home);
