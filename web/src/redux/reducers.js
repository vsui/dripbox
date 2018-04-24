import { combineReducers } from 'redux';

import { LIST_FILES_SUCCEEDED, REMOVE_FILE_SUCCEEDED } from './actions';

const files = (state = [], action) => {
  switch (action.type) {
    case LIST_FILES_SUCCEEDED:
      return action.files;
    case REMOVE_FILE_SUCCEEDED:
      return state.filter(({ fileName }) => fileName !== action.path);
    default:
      return state;
  }
};

export default combineReducers({
  files,
});
