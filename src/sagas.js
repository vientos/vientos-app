// see https://redux-saga.github.io/redux-saga/ (at least Basic Concepts)

import { takeLatest, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as ActionTypes from './actionTypes'
import vientos from './vientos'

function * handler (action) {
  try {
    const json = yield call(vientos, action)
    if (json && json.error) {
      yield put({
        type: ActionTypes[action.type.replace('REQUESTED', 'FAILED')],
        message: json.message
      })
    } else {
      let success = { type: ActionTypes[action.type.replace('REQUESTED', 'SUCCEEDED')] }
      if (json) {
        success.json = json
      } else {
        success.requestedAction = action
      }
      yield put(success)
    }
  } catch (e) {
    yield put({
      type: ActionTypes[action.type.replace('REQUESTED', 'FAILED')],
      message: e.message
    })
  }
}

const handleLatest = [
  ActionTypes.FETCH_PROJECTS_REQUESTED,
  ActionTypes.FETCH_CATEGORIES_REQUESTED,
  ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED,
  ActionTypes.FETCH_LABELS_REQUESTED,
  ActionTypes.FETCH_INTENTS_REQUESTED,
  ActionTypes.FETCH_PERSON_REQUESTED,
  ActionTypes.FETCH_MY_CONVERSATIONS_REQUESTED,
  ActionTypes.HELLO_REQUESTED,
  ActionTypes.BYE_REQUESTED,
  ActionTypes.SAVE_PERSON_REQUESTED
]

const handleEvery = [
  ActionTypes.FOLLOW_REQUESTED,
  ActionTypes.UNFOLLOW_REQUESTED,
  ActionTypes.SAVE_INTENT_REQUESTED,
  ActionTypes.DELETE_INTENT_REQUESTED,
  ActionTypes.SAVE_PROJECT_REQUESTED,
  ActionTypes.START_CONVERSATION_REQUESTED,
  ActionTypes.ADD_MESSAGE_REQUESTED,
  ActionTypes.ADD_REVIEW_REQUESTED,
  ActionTypes.SAVE_COLLABORATION_REQUESTED
]

function * root () {
  yield [
    ...handleLatest.map(actionType => takeLatest(actionType, handler)),
    ...handleEvery.map(actionType => takeEvery(actionType, handler))
  ]
}

export default root
