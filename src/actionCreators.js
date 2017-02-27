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

export function toggleCategory (id) {
  return {
    type: ActionTypes.TOGGLE_CATEGORY,
    id
  }
}

export function toggleCollaborationType (id) {
  return {
    type: ActionTypes.TOGGLE_COLLABORATION_TYPE,
    id
  }
}

export function clearCategoriesFilter () {
  return { type: ActionTypes.CLEAR_CATEGORIES_FILTER }
}

export function clearCollaborationTypesFilter () {
  return { type: ActionTypes.CLEAR_COLLABORATION_TYPES_FILTER }
}

export function hello () {
  return { type: ActionTypes.HELLO_REQUESTED }
}

export function bye () {
  return { type: ActionTypes.BYE_REQUESTED }
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

export function fetchIntents () {
  return { type: ActionTypes.FETCH_INTENTS_REQUESTED }
}

export function createIntent (intent) {
  return {
    type: ActionTypes.CREATE_INTENT_REQUESTED,
    intent
  }
}

export function updateIntent (intent) {
  return {
    type: ActionTypes.UPDATE_INTENT_REQUESTED,
    intent
  }
}

export function deleteIntent (intent) {
  return {
    type: ActionTypes.DELETE_INTENT_REQUESTED,
    intentId: intent._id
  }
}

export function follow (person, project) {
  return {
    type: ActionTypes.FOLLOW_REQUESTED,
    personId: person._id,
    projectId: project._id
  }
}

export function unfollow (person, project) {
  return {
    type: ActionTypes.UNFOLLOW_REQUESTED,
    personId: person._id,
    projectId: project._id
  }
}
