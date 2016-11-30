import { takeLatest, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as ActionTypes from './actionTypes'
import { fetchProjects } from './vientos'

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

function * projectsSaga () {
  yield* takeLatest(ActionTypes.FETCH_PROJECTS_REQUESTED, getProjects)
}

function * root () {
  yield [
    call(projectsSaga)
  ]
}

export default root
