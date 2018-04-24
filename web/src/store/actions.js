import { call, put, takeLatest } from 'redux-saga/effects';
import { list } from '../utils/api';

const LIST_FILES_REQUESTED = Symbol('List files requested');
const LIST_FILES_SUCCEEDED = Symbol('List files succeeded');
const LIST_FILES_FAILED = Symbol('List files failed');

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

export {
  LIST_FILES_SUCCEEDED,
  LIST_FILES_REQUESTED,
  LIST_FILES_FAILED,
  listFilesSaga,
};
