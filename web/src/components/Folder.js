import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { changePath } from '../redux/actions';
import { pathJoin } from '../utils/path';

const Folder = (props) => {
  const { pathname } = props.location;

  return (
    <div>
      <Link to={pathJoin(pathname, props.folderName)}>{props.folderName}<br /></Link>
    </div>
  );
};

Folder.propTypes = {
  folderName: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ path: state.path });

const mapDispatchToProps = (dispatch, props) => ({
  navigate: (currPath) => {
    if (currPath === '') {
      dispatch(changePath(props.folderName));
    } else {
      dispatch(changePath(`${currPath}/${props.folderName}`));
    }
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Folder));
