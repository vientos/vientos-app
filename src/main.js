import 'babel-polyfill'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger'

import * as ActionCreators from './actionCreators'
import reducer from './reducers'
import sagas from './sagas'
import * as util from './util'

const sagaMiddleware = createSagaMiddleware()
const logger = createLogger()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware, logger)
)

sagaMiddleware.run(sagas)

// otherwise unit tests not run in browser will fail
if (typeof window !== 'undefined') {
  window.vientos.store = store
  window.vientos.ActionCreators = ActionCreators
  window.vientos.util = util
  window.vientos.config = require('../config.json')
}
