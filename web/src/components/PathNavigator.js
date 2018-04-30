import React from 'react';
import PropTypes from 'prop-types';
import { pathToList, pathJoin } from '../utils/path';
import { StyledLink } from '../styled';

const PathNavigator = ({ path, prefix }) => (
  <div>
    {
      pathToList(path).map(({ absolute, relative }) => (
        <StyledLink
          primary
          key={absolute}
          to={pathJoin(prefix, absolute)}
          style={{
            fontSize: '2em',
            textDecoration: 'none',
          }}
        >
          /{relative}
        </StyledLink>
      ))
    }
  </div>
);

PathNavigator.propTypes = {
  path: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
};

export default PathNavigator;
