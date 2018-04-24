import { call, put, takeLatest } from 'redux-saga/effects';
import { list, remove } from '../utils/api';

const LIST_FILES_REQUESTED = Symbol('List files requested');
const LIST_FILES_SUCCEEDED = Symbol('List files succeeded');
const LIST_FILES_FAILED = Symbol('List files failed');

const REMOVE_FILE_REQUESTED = Symbol('Delete files requested');
const REMOVE_FILE_SUCCEEDED = Symbol('Delete files succeeded');
const REMOVE_FILE_FAILED = Symbol('Delete files failed');

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


export {
  LIST_FILES_SUCCEEDED,
  LIST_FILES_REQUESTED,
  LIST_FILES_FAILED,

  REMOVE_FILE_FAILED,
  REMOVE_FILE_REQUESTED,
  REMOVE_FILE_SUCCEEDED,

  listFilesSaga,
  removeFileSaga,
};
