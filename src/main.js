import 'babel-polyfill'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import * as ActionCreators from './actionCreators'
import reducer from './reducers'
import sagas from './sagas'
import * as util from './util'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(sagas)

// otherwise unit tests not run in browser will fail
if (typeof window !== 'undefined') {
  window.vientos.store = store
  window.vientos.ActionCreators = ActionCreators
  window.vientos.util = util
  window.vientos.config = require('../config.json')
}
