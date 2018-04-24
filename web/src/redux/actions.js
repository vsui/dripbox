import { call, put, takeLatest } from 'redux-saga/effects';
import { list, remove, upload, putFolder } from '../utils/api';

const LIST_FILES_REQUESTED = ('List files requested');
const LIST_FILES_SUCCEEDED = ('List files succeeded');
const LIST_FILES_FAILED = ('List files failed');

const REMOVE_FILE_REQUESTED = ('Delete file requested');
const REMOVE_FILE_SUCCEEDED = ('Delete file succeeded');
const REMOVE_FILE_FAILED = ('Delete file failed');

const UPLOAD_FILE_REQUESTED = ('Upload file requested');
const UPLOAD_FILE_SUCCEEDED = ('Upload file succeeded');
const UPLOAD_FILE_FAILED = ('Upload file failed');

const ADD_FOLDER_REQUESTED = 'Add folder requested';
const ADD_FOLDER_SUCCEEDED = 'Add folder succeeded';
const ADD_FOLDER_FAILED = 'Add folder failed';

function* listFiles() {
  try {
    const files = yield call(list);
    yield put({ type: LIST_FILES_SUCCEEDED, files });
  } catch (err) {
    yield put({ type: LIST_FILES_FAILED, message: err.message });
  }
}

function* listFilesSaga() {
  yield takeLatest(LIST_FILES_REQUESTED, listFiles);
}

function* removeFile({ path }) {
  try {
    yield call(remove, path);
    yield put({ type: REMOVE_FILE_SUCCEEDED, path });
  } catch (err) {
    yield put({ type: REMOVE_FILE_FAILED, message: err.message });
  }
}

function* removeFileSaga() {
  yield takeLatest(REMOVE_FILE_REQUESTED, removeFile);
}

function* uploadFile(action) {
  console.log(action);
  const { file } = action;
  try {
    yield call(upload, action.name, action.file);
    yield put({ type: UPLOAD_FILE_SUCCEEDED, file, name: action.name });
  } catch (err) {
    yield put({ type: UPLOAD_FILE_FAILED, message: err.message });
  }
}

function* uploadFileSaga() {
  yield takeLatest(UPLOAD_FILE_REQUESTED, uploadFile);
}

function* addFolder({ folderName }) {
  try {
    yield call(putFolder, folderName);
    yield put({ type: ADD_FOLDER_SUCCEEDED, folderName });
  } catch (err) {
    yield put({ type: ADD_FOLDER_FAILED, message: err.message });
  }
}

function* addFolderSaga() {
  yield takeLatest(ADD_FOLDER_REQUESTED, addFolder);
}

export {
  LIST_FILES_SUCCEEDED,
  LIST_FILES_REQUESTED,
  LIST_FILES_FAILED,

  REMOVE_FILE_FAILED,
  REMOVE_FILE_REQUESTED,
  REMOVE_FILE_SUCCEEDED,

  UPLOAD_FILE_FAILED,
  UPLOAD_FILE_REQUESTED,
  UPLOAD_FILE_SUCCEEDED,

  ADD_FOLDER_REQUESTED,
  ADD_FOLDER_SUCCEEDED,
  ADD_FOLDER_FAILED,

  listFilesSaga,
  removeFileSaga,
  uploadFileSaga,
  addFolderSaga,
};
