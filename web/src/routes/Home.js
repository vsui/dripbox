import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FileListing from '../components/FileListing';

const Home = props => (
  <div>
    <h1>{props.username}</h1>
    <FileListing path={props.location.pathname.substring('/home'.length)} />
  </div>
);

Home.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  username: PropTypes.string.isRequired,
};

export default withRouter(Home);
