import { combineReducers } from 'redux';

import { LIST_FILES_SUCCEEDED } from './actions';

const files = (state = [], action) => {
  switch (action.type) {
    case LIST_FILES_SUCCEEDED:
      return action.files;
    default:
      return state;
  }
};

export default combineReducers({
  files,
});
