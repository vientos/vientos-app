// see https://redux-saga.github.io/redux-saga/ (at least Basic Concepts)

import { takeLatest, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as ActionTypes from './actionTypes'
import * as Vientos from './vientos'

function * getProjects (action) {
  try {
    const projects = yield call(Vientos.fetchProjects)
    yield put({
      type: ActionTypes.FETCH_PROJECTS_SUCCEEDED,
      projects
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_PROJECTS_FAILED,
      message: e.message
    })
  }
}

function * getIntents (action) {
  try {
    const intents = yield call(Vientos.fetchIntents)
    yield put({
      type: ActionTypes.FETCH_INTENTS_SUCCEEDED,
      intents
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_INTENTS_FAILED,
      message: e.message
    })
  }
}

function * getCategories (action) {
  try {
    const categories = yield call(Vientos.fetchCategories)
    yield put({
      type: ActionTypes.FETCH_CATEGORIES_SUCCEEDED,
      categories
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_CATEGORIES_FAILED,
      message: e.message
    })
  }
}

function * getCollaborationTypes (action) {
  try {
    const collaborationTypes = yield call(Vientos.fetchCollaborationTypes)
    yield put({
      type: ActionTypes.FETCH_COLLABORATION_TYPES_SUCCEEDED,
      collaborationTypes
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_COLLABORATION_TYPES_FAILED,
      message: e.message
    })
  }
}

function * getLabels (action) {
  try {
    const labels = yield call(Vientos.fetchLabels)
    yield put({
      type: ActionTypes.FETCH_LABELS_SUCCEEDED,
      labels
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_LABELS_FAILED,
      message: e.message
    })
  }
}

function * hello (action) {
  try {
    let person = yield call(Vientos.hello)
    if (person.error) person = null
    yield put({
      type: ActionTypes.HELLO_SUCCEEDED,
      person
    })
  } catch (e) {
    yield put({
      type: ActionTypes.HELLO_FAILED,
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
  yield * takeLatest(ActionTypes.FETCH_PROJECTS_REQUESTED, getProjects)
}

function * intentsSaga () {
  yield * takeLatest(ActionTypes.FETCH_INTENTS_REQUESTED, getIntents)
}

function * categoriesSaga () {
  yield * takeLatest(ActionTypes.FETCH_CATEGORIES_REQUESTED, getCategories)
}

function * collaborationTypesSaga () {
  yield * takeLatest(ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED, getCollaborationTypes)
}

function * labelsSaga () {
  yield * takeLatest(ActionTypes.FETCH_LABELS_REQUESTED, getLabels)
}

function * helloSaga () {
  yield * takeLatest(ActionTypes.HELLO_REQUESTED, hello)
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
