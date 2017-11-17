import * as ActionTypes from './actionTypes'
const config = require('../config.json')

export function filteredCategories (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_CATEGORIES:
      return action.selection
    default:
      return state
  }
}

export function filteredCollaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_COLLABORATION_TYPES:
      return action.selection
    default:
      return state
  }
}

export function searchTerm (state = null, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SEARCH_TERM:
      return action.searchTerm
    default:
      return state
  }
}

export function personalFilter (state = false, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_PERSONAL_FILTER:
      return !state
    default:
      return state
  }
}

export function language (state = config.language, action) {
  switch (action.type) {
    case ActionTypes.SET_LANGUAGE:
      return action.language
    default:
      return state
  }
}

export function labels (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_LABELS:
      return action.labels
    default:
      return state
  }
}

const DEFUALT_BOUNDINGBOX = {
  sw: { lat: -90, lng: -180 },
  ne: { lat: 90, lng: 180 }
}

export function boundingBox (state = DEFUALT_BOUNDINGBOX, action) {
  switch (action.type) {
    case ActionTypes.SET_BOUNDING_BOX:
      return action.boundingBox
    default:
      return state
  }
}

export function online (state = false, action) {
  switch (action.type) {
    case ActionTypes.SET_ONLINE:
      return action.online
    default:
      return state
  }
}
