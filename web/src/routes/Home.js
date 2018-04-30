import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FileListing from '../components/FileListing';

const Home = props => (
  <FileListing path={props.location.pathname.substring('/home'.length)} />
);

Home.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Home);
