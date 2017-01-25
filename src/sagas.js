// see https://redux-saga.github.io/redux-saga/ (at least Basic Concepts)

import { takeLatest } from 'redux-saga'
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

function * login (action) {
  try {
    const account = yield call(Vientos.login, action.username, action.password)
    yield put({
      type: ActionTypes.LOGIN_SUCCEEDED,
      account
    })
  } catch (e) {
    yield put({
      type: ActionTypes.LOGIN_FAILED,
      message: e.message
    })
  }
}

function * projectsSaga () {
  yield * takeLatest(ActionTypes.FETCH_PROJECTS_REQUESTED, getProjects)
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

function * loginSaga () {
  yield * takeLatest(ActionTypes.LOGIN_REQUESTED, login)
}

function * root () {
  yield [
    call(projectsSaga),
    call(categoriesSaga),
    call(collaborationTypesSaga),
    call(labelsSaga),
    call(loginSaga)
  ]
}

export default root
