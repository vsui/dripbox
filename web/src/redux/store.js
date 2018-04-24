import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import { listFilesSaga, removeFileSaga } from './actions';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(listFilesSaga);
sagaMiddleware.run(removeFileSaga);

export default store;
