import { takeLatest, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as ActionTypes from './actionTypes'
import { fetchProjects, fetchCategories } from './vientos'

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

function * projectsSaga () {
  yield * takeLatest(ActionTypes.FETCH_PROJECTS_REQUESTED, getProjects)
}

function * categoriesSaga () {
  yield * takeLatest(ActionTypes.FETCH_CATEGORIES_REQUESTED, getCategories)
}

function * root () {
  yield [
    call(projectsSaga),
    call(categoriesSaga)
  ]
}

export default root
