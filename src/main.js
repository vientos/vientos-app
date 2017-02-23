import 'babel-polyfill'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger'

import * as ActionTypes from './actionTypes'
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
  ActionTypes,
  util,
  config: require('../config.json')
}
