import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { pathToList, pathJoin } from '../utils/path';

const PathNavigator = ({ path, prefix }) => (
  <div>
    {
      pathToList(path).map(({ absolute, relative }) =>
        <Link key={absolute} to={pathJoin(prefix, absolute)}>{relative} -> </Link>)
    }
  </div>
);

PathNavigator.propTypes = {
  path: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
};

export default PathNavigator;
