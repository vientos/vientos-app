import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'

function projects (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS_SUCCEEDED:
      return action.projects
    default:
      return state
  }
}

export default combineReducers({
  projects
})
