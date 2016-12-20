import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as ActionTypes from './actionTypes'
import { fetchProjects, fetchCategories, fetchLabels } from './vientos'

function * getProjects (action) {
  try {
    const projects = yield call(fetchProjects)
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
    const categories = yield call(fetchCategories)
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

function * getLabels (action) {
  try {
    const labels = yield call(fetchLabels)
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
function * projectsSaga () {
  yield * takeLatest(ActionTypes.FETCH_PROJECTS_REQUESTED, getProjects)
}

function * categoriesSaga () {
  yield * takeLatest(ActionTypes.FETCH_CATEGORIES_REQUESTED, getCategories)
}

function * labelsSaga () {
  yield * takeLatest(ActionTypes.FETCH_LABELS_REQUESTED, getLabels)
}

function * root () {
  yield [
    call(projectsSaga),
    call(categoriesSaga),
    call(labelsSaga)
  ]
}

export default root
