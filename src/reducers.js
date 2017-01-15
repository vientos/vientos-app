import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'
const config = require('../config.json')

function projects (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS_SUCCEEDED:
      return action.projects
    default:
      return state
  }
}

function categories (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_CATEGORIES_SUCCEEDED:
      return action.categories
    default:
      return state
  }
}

function collaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_COLLABORATION_TYPES_SUCCEEDED:
      return action.collaborationTypes
    default:
      return state
  }
}

function categoriesFilter (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_CATEGORIES_SUCCEEDED:
      return action.categories.map(c => ({ categoryId: c.id, selected: false, icon: c.icon }))
    case ActionTypes.TOGGLE_CATEGORY:
      let index = state.findIndex(e => e.categoryId === action.categoryId)
      let updated = Object.create(state[index])
      updated.selected = !updated.selected
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1)
      ]
    case ActionTypes.CLEAR_CATEGORIES_FILTER:
      return state.map(e => ({ categoryId: e.categoryId, selected: false, icon: e.icon }))
    default:
      return state
  }
}

function collaborationTypesFilter (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_COLLABORATION_TYPES_SUCCEEDED:
      return action.collaborationTypes.map(ct => ({ collaborationTypeId: ct.id, selected: false }))
    case ActionTypes.TOGGLE_COLLABORATION_TYPE:
      let index = state.findIndex(e => e.collaborationTypeId === action.collaborationTypeId)
      let updated = Object.create(state[index])
      updated.selected = !updated.selected
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1)
      ]
    case ActionTypes.CLEAR_COLLABORATION_TYPES_FILTER:
      return state.map(e => ({ collaborationTypeId: e.collaborationTypeId, selected: false }))
    default:
      return state
  }
}

function language (state = config.language, action) {
  switch (action.type) {
    case ActionTypes.SET_LANGUAGE:
      return action.language
    default:
      return state
  }
}

function labels (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_LABELS_SUCCEEDED:
      return action.labels
    default:
      return state
  }
}

function boundingBox (state = config.map.boundingBox, action) {
  switch (action.type) {
    case ActionTypes.SET_BOUNDING_BOX:
      return action.boundingBox
    default:
      return state
  }
}
export default combineReducers({
  projects,
  categories,
  collaborationTypes,
  categoriesFilter,
  collaborationTypesFilter,
  language,
  labels,
  boundingBox
})
