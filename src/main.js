import 'babel-polyfill'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger'
import cuid from 'cuid'

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

window.vientos = {
  store,
  ActionCreators,
  util,
  config: require('../config.json')
}
window.cuid = cuid
