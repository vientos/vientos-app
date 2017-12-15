import * as ActionTypes from './actionTypes'
import { ActionTypes as ClientActionTypes } from 'vientos-client'
const config = require('../config.json')

export function filteredCategories (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_CATEGORIES:
      return [...action.selection]
    default:
      return state
  }
}

export function filteredCollaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_COLLABORATION_TYPES:
      return [...action.selection]
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
    case ActionTypes.ENABLE_PERSONAL_FILTER:
      return true
    case ActionTypes.DISABLE_PERSONAL_FILTER:
      return false
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

export function toast (state = null, action) {
  switch (action.type) {
    case ActionTypes.ENABLE_PERSONAL_FILTER:
      return { label: 'toast:personal-filter-enabled' }
    case ActionTypes.DISABLE_PERSONAL_FILTER:
      return { label: 'toast:personal-filter-disabled' }
    case ClientActionTypes.ADD_REVIEW_SUCCEEDED:
      return { label: 'toast:review-saved' }
    case ClientActionTypes.FOLLOW_SUCCEEDED:
      return { label: 'toast:followed' }
    case ClientActionTypes.UNFOLLOW_SUCCEEDED:
      return { label: 'toast:unfollowed' }
    case ClientActionTypes.FAVOR_SUCCEEDED:
      return { label: 'toast:favored' }
    case ClientActionTypes.UNFAVOR_SUCCEEDED:
      return { label: 'toast:unfavored' }
    case ClientActionTypes.SAVE_INTENT_SUCCEEDED:
      return { label: 'toast:proposal-saved' }
    case ClientActionTypes.SAVE_PROJECT_SUCCEEDED:
      return { label: 'toast:organization-saved' }
    case ClientActionTypes.SAVE_PERSON_SUCCEEDED:
      return { label: 'toast:account-settings-saved' }
    default:
      return state
  }
}

export function history (state = [], action) {
  switch (action.type) {
    case ActionTypes.SET_HISTORY:
      return action.history
    default:
      return state
  }
}
