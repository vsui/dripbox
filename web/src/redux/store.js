import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import { listFilesSaga, removeFileSaga, uploadFileSaga } from './actions';

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);
/* eslint-enable */

sagaMiddleware.run(listFilesSaga);
sagaMiddleware.run(removeFileSaga);
sagaMiddleware.run(uploadFileSaga);

export default store;
