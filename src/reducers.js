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
        if (!project.categories) project.categories = []
        if (!project.locations) project.locations = []
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

function places (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PLACES_SUCCEEDED:
      return action.json
    case ActionTypes.SAVE_PLACE_SUCCEEDED:
      return replaceOrAddElement(state, action.json)
    default:
      return state
  }
}

// function collaborations (state = [], action) {
//   switch (action.type) {
//     case ActionTypes.FETCH_COLLABORATIONS_SUCCEEDED:
//       return action.json
//     default:
//       return state
//   }
// }

function reviews (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_REVIEWS_SUCCEEDED:
      return action.json
    default:
      return state
  }
}

function people (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PEOPLE_SUCCEEDED:
      return action.json
    default:
      return state
  }
}

function myConversations (state = [], action) {
  let conversation
  let updated
  switch (action.type) {
    case ActionTypes.FETCH_MY_CONVERSATIONS_SUCCEEDED:
      return action.json
    case ActionTypes.START_CONVERSATION_SUCCEEDED:
      return replaceOrAddElement(state, action.json)
    case ActionTypes.ADD_MESSAGE_SUCCEEDED:
      conversation = state.find(conversation => conversation._id === action.json.conversation)
      updated = Object.assign({}, conversation, {
        messages: replaceOrAddElement(conversation.messages, action.json)})
      return replaceOrAddElement(state, updated)
    case ActionTypes.ABORT_CONVERSATION_SUCCEEDED:
      conversation = state.find(conversation => conversation._id === action.json.conversation)
      updated = Object.assign({}, conversation, {
        reviews: replaceOrAddElement(conversation.reviews, action.json)})
      delete updated.collaboratio
      return replaceOrAddElement(state, updated)
    case ActionTypes.ADD_REVIEW_SUCCEEDED:
      conversation = state.find(conversation => conversation._id === action.json.conversation)
      updated = Object.assign({}, conversation, {
        reviews: replaceOrAddElement(conversation.reviews, action.json)})
      return replaceOrAddElement(state, updated)
    case ActionTypes.SAVE_COLLABORATION_SUCCEEDED:
      conversation = state.find(conversation => conversation._id === action.json.conversation)
      updated = Object.assign({}, conversation, { collaboration: action.json })
      return replaceOrAddElement(state, updated)
    default:
      return state
  }
}

function notifications (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_NOTIFICATIONS_SUCCEEDED:
      return action.json
    case ActionTypes.SAVE_NOTIFICATION_SUCCEEDED:
      return removeElement(state, action.json)
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

function filteredFavorings (state = false, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_FILTER_FAVORINGS:
      return !state
    default:
      return state
  }
}

function boundingBoxFilter (state = true, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_BOUNDINBOX_FILTER:
      return !state
    default:
      return state
  }
}

function locationFilter (state = 'all', action) {
  switch (action.type) {
    case ActionTypes.SET_LOCATION_FILTER:
      return action.locationFilter
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
      if (!action.json.categories) action.json.categories = []
      if (!action.json.followings) action.json.followings = []
      if (!action.json.favorings) action.json.favorings = []
      return action.json
    case ActionTypes.SAVE_PERSON_SUCCEEDED:
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
    case ActionTypes.FAVOR_SUCCEEDED:
      return Object.assign({}, state, {
        favorings: replaceOrAddElement(state.favorings, action.json)})
    case ActionTypes.UNFAVOR_SUCCEEDED:
      return Object.assign({}, state, {
        favorings: removeElement(state.favorings, action.requestedAction.favoring)
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
  people,
  places,
  filteredCategories,
  filteredCollaborationTypes,
  filteredFollowings,
  filteredFavorings,
  locationFilter,
  boundingBoxFilter,
  collaborationTypes,
  person,
  myConversations,
  notifications,
  session,
  boundingBox,
  language,
  labels,
  intents,
  // collaborations,
  reviews
})
