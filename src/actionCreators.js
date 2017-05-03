import * as ActionTypes from './actionTypes'

export function setLanguage (language) {
  return {
    type: ActionTypes.SET_LANGUAGE,
    language
  }
}

export function setBoundingBox (boundingBox) {
  return {
    type: ActionTypes.SET_BOUNDING_BOX,
    boundingBox
  }
}

export function updateFilteredCategories (selection) {
  return {
    type: ActionTypes.UPDATE_FILTERED_CATEGORIES,
    selection
  }
}

export function updateFilteredCollaborationTypes (selection) {
  return {
    type: ActionTypes.UPDATE_FILTERED_COLLABORATION_TYPES,
    selection
  }
}

export function hello () {
  return { type: ActionTypes.HELLO_REQUESTED }
}

export function fetchPerson (id) {
  return { type: ActionTypes.FETCH_PERSON_REQUESTED, id }
}

export function bye (session) {
  return { type: ActionTypes.BYE_REQUESTED, session }
}

export function fetchLabels () {
  return { type: ActionTypes.FETCH_LABELS_REQUESTED }
}

export function fetchCategories () {
  return { type: ActionTypes.FETCH_CATEGORIES_REQUESTED }
}

export function fetchCollaborationTypes () {
  return { type: ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED }
}

export function fetchProjects () {
  return { type: ActionTypes.FETCH_PROJECTS_REQUESTED }
}

export function saveProject (project, image) {
  return {
    type: ActionTypes.SAVE_PROJECT_REQUESTED,
    project,
    image
  }
}

export function savePerson (person, image) {
  return {
    type: ActionTypes.SAVE_PERSON_REQUESTED,
    person,
    image
  }
}

export function fetchIntents () {
  return { type: ActionTypes.FETCH_INTENTS_REQUESTED }
}

export function saveIntent (intent, image) {
  return {
    type: ActionTypes.SAVE_INTENT_REQUESTED,
    intent,
    image
  }
}

export function deleteIntent (intent) {
  return {
    type: ActionTypes.DELETE_INTENT_REQUESTED,
    intent
  }
}

export function follow (person, project) {
  return {
    type: ActionTypes.FOLLOW_REQUESTED,
    following: {
      type: 'Following',
      person: person._id,
      project: project._id
    }
  }
}

export function unfollow (following) {
  return {
    type: ActionTypes.UNFOLLOW_REQUESTED,
    following
  }
}

export function toggleFilterFollowings () {
  return {
    type: ActionTypes.TOGGLE_FILTER_FOLLOWINGS
  }
}

export function setLocationFilter (locationFilter) {
  return {
    type: ActionTypes.SET_LOCATION_FILTER,
    locationFilter
  }
}

export function toggleBoundingBoxFilter () {
  return {
    type: ActionTypes.TOGGLE_BOUNDINBOX_FILTER
  }
}
