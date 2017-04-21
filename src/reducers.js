import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'
const config = require('../config.json')

function projects (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS_SUCCEEDED:
      // normalize
      return action.json.map(project => {
        if (!project.links) project.links = []
        if (!project.contacts) project.contacts = []
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
      return action.json
    default:
      return state
  }
}

function filteredCategories (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_CATEGORIES:
      return action.selection
    default:
      return state
  }
}

function filteredCollaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTERED_COLLABORATION_TYPES:
      return action.selection
    default:
      return state
  }
}

function filteredFollowings (state = false, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_FILTER_FOLLOWINGS:
      return !state
    default:
      return state
  }
}

function collaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_COLLABORATION_TYPES_SUCCEEDED:
      return action.json
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
  filteredCollaborationTypes,
  filteredFollowings,
  collaborationTypes,
  person,
  session,
  boundingBox,
  language,
  labels,
  intents
})
