import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'
const config = require('../config.json')

function projects (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS_SUCCEEDED:
      // normalize
      return action.json.map(project => {
        if (!project.offers) project.offers = []
        if (!project.requests) project.requests = []
        if (!project.locations) {
          project.locations = []
        } else {
          project.locations = project.locations.map(location => {
            return {
              latitude: Number(location.latitude),
              longitude: Number(location.longitude)
            }
          })
        }
        return project
      })
    case ActionTypes.SAVE_PROJECT_SUCCEEDED:
      return replaceOrAddElement(state, action.json)
    default:
      return state
  }
}

function removeElement (array, element) {
  return array.filter(el => el._id !== element._id)
}

function replaceOrAddElement (array, element) {
  return [
    ...removeElement(array, element),
    Object.assign({}, element)
  ]
}

function intents (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_INTENTS_SUCCEEDED:
      return action.json
    case ActionTypes.SAVE_INTENT_SUCCEEDED:
      return replaceOrAddElement(state, action.json)
    case ActionTypes.DELETE_INTENT_SUCCEEDED:
      return removeElement(state, action.requestedAction.intent)
    default:
      return state
  }
}

function categories (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_CATEGORIES_SUCCEEDED:
      return action.json.map(category => Object.assign(category, { selected: false }))
    default:
      return state
  }
}

function filteredCategories (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_CATEGORIES:
      console.log('action', action)
      return action.selection
    case ActionTypes.CLEAR_CATEGORIES_FILTER:
      return []
    default:
      return state
  }
}

function collaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_COLLABORATION_TYPES_SUCCEEDED:
      return action.json.map(collaborationType => Object.assign(collaborationType, { selected: false }))
    case ActionTypes.TOGGLE_COLLABORATION_TYPE:
      let index = state.findIndex(e => e.id === action.id)
      let updated = Object.assign({}, state[index])
      updated.selected = !updated.selected
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1)
      ]
    case ActionTypes.CLEAR_COLLABORATION_TYPES_FILTER:
      return state.collaborationTypes.map(collaborationType => Object.assign(collaborationType, { selected: false }))
    default:
      return state
  }
}

function person (state = null, action) {
  switch (action.type) {
    case ActionTypes.FETCH_PERSON_SUCCEEDED:
      if (action.json && !action.json.followings) action.json.followings = []
      return action.json
    case ActionTypes.BYE_SUCCEEDED:
      return null
    case ActionTypes.FOLLOW_SUCCEEDED:
      return Object.assign({}, state, {
        followings: replaceOrAddElement(state.followings, action.json)})
    case ActionTypes.UNFOLLOW_SUCCEEDED:
      return Object.assign({}, state, {
        followings: removeElement(state.followings, action.requestedAction.following)
      })
    default:
      return state
  }
}

function session (state = null, action) {
  switch (action.type) {
    case ActionTypes.HELLO_SUCCEEDED:
      return action.json
    case ActionTypes.BYE_SUCCEEDED:
      return null
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
      return action.json
    default:
      return state
  }
}

const DEFUALT_BOUNDINGBOX = {
  sw: { lat: -90, lng: -180 },
  ne: { lat: 90, lng: 180 }
}

function boundingBox (state = DEFUALT_BOUNDINGBOX, action) {
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
  filteredCategories,
  collaborationTypes,
  person,
  session,
  boundingBox,
  language,
  labels,
  intents
})
