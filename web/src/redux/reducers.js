import { combineReducers } from 'redux';
import { toast } from 'react-toastify';

import { LIST_FILES_SUCCEEDED, REMOVE_FILE_SUCCEEDED, UPLOAD_FILE_SUCCEEDED, LIST_FILES_FAILED, REMOVE_FILE_FAILED, UPLOAD_FILE_FAILED } from './actions';

const files = (state = [], action) => {
  switch (action.type) {
    case LIST_FILES_SUCCEEDED:
      return action.files;
    case REMOVE_FILE_SUCCEEDED:
      return state.filter(({ fileName }) => fileName !== action.path);
    case UPLOAD_FILE_SUCCEEDED:
      return [...state, {
        fileName: action.name,
        lastModified: String(action.file.lastModified),
        fileSize: action.file.size,
      }];
    default:
      return state;
  }
};

const errors = (state = [], action) => {
  switch (action.type) {
    case LIST_FILES_FAILED:
    case REMOVE_FILE_FAILED:
    case UPLOAD_FILE_FAILED:
      toast(action.message);
      return state;
    default:
      return state;
  }
};

export default combineReducers({
  files,
  errors,
});
