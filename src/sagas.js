// see https://redux-saga.github.io/redux-saga/ (at least Basic Concepts)

import { takeLatest, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as ActionTypes from './actionTypes'
import * as Vientos from './vientos'

function * get (action) {
  try {
    const json = yield call(Vientos.get, action)
    yield put({
      type: ActionTypes[action.type.replace('REQUESTED', 'SUCCEEDED')],
      json
    })
  } catch (e) {
    yield put({
      type: ActionTypes[action.type.replace('REQUESTED', 'FAILED')],
      message: e.message
    })
  }
}

function * updateIntent (action) {
  try {
    yield call(Vientos.updateIntent, action.intent)
    yield put({
      type: ActionTypes.UPDATE_INTENT_SUCCEEDED,
      intent: action.intent
    })
  } catch (e) {
    yield put({
      type: ActionTypes.UPDATE_INTENT_FAILED,
      message: e.message
    })
  }
}

function * deleteIntent (action) {
  try {
    yield call(Vientos.deleteIntent, action.intentId)
    yield put({
      type: ActionTypes.DELETE_INTENT_SUCCEEDED,
      intentId: action.intentId
    })
  } catch (e) {
    yield put({
      type: ActionTypes.DELETE_INTENT_FAILED,
      message: e.message
    })
  }
}

function * bye (action) {
  try {
    yield call(Vientos.bye)
    yield put({
      type: ActionTypes.BYE_SUCCEEDED
    })
  } catch (e) {
    yield put({
      type: ActionTypes.BYE_FAILED,
      message: e.message
    })
  }
}

function * follow (action) {
  try {
    yield call(Vientos.follow, action.personId, action.projectId)
    yield put({
      type: ActionTypes.FOLLOW_SUCCEEDED,
      personId: action.personId,
      projectId: action.projectId
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FOLLOW_FAILED,
      message: e.message
    })
  }
}

function * unfollow (action) {
  try {
    yield call(Vientos.unfollow, action.personId, action.projectId)
    yield put({
      type: ActionTypes.UNFOLLOW_SUCCEEDED,
      personId: action.personId,
      projectId: action.projectId
    })
  } catch (e) {
    yield put({
      type: ActionTypes.UNFOLLOW_FAILED,
      message: e.message
    })
  }
}

function * createIntent (action) {
  try {
    const intent = yield call(Vientos.createIntent, action.intent)
    yield put({
      type: ActionTypes.CREATE_INTENT_SUCCEEDED,
      intent
    })
  } catch (e) {
    yield put({
      type: ActionTypes.CREATE_INTENT_FAILED,
      message: e.message
    })
  }
}

function * projectsSaga () {
  yield * takeLatest(ActionTypes.FETCH_PROJECTS_REQUESTED, get)
}

function * categoriesSaga () {
  yield * takeLatest(ActionTypes.FETCH_CATEGORIES_REQUESTED, get)
}

function * collaborationTypesSaga () {
  yield * takeLatest(ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED, get)
}

function * labelsSaga () {
  yield * takeLatest(ActionTypes.FETCH_LABELS_REQUESTED, get)
}

function * intentsSaga () {
  yield * takeLatest(ActionTypes.FETCH_INTENTS_REQUESTED, get)
}

function * updateIntentSaga () {
  yield * takeLatest(ActionTypes.UPDATE_INTENT_REQUESTED, updateIntent)
}

function * deleteIntentSaga () {
  yield * takeLatest(ActionTypes.DELETE_INTENT_REQUESTED, deleteIntent)
}

function * helloSaga () {
  yield * takeLatest(ActionTypes.HELLO_REQUESTED, get)
}

function * byeSaga () {
  yield * takeLatest(ActionTypes.BYE_REQUESTED, bye)
}

function * followSaga () {
  yield * takeEvery(ActionTypes.FOLLOW_REQUESTED, follow)
}

function * unfollowSaga () {
  yield * takeEvery(ActionTypes.UNFOLLOW_REQUESTED, unfollow)
}

function * createIntentSaga () {
  yield * takeEvery(ActionTypes.CREATE_INTENT_REQUESTED, createIntent)
}

function * root () {
  yield [
    call(projectsSaga),
    call(intentsSaga),
    call(updateIntentSaga),
    call(deleteIntentSaga),
    call(categoriesSaga),
    call(collaborationTypesSaga),
    call(labelsSaga),
    call(helloSaga),
    call(byeSaga),
    call(followSaga),
    call(unfollowSaga),
    call(createIntentSaga)
  ]
}

export default root
