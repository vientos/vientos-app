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

export function updateSearchTerm (searchTerm) {
  return {
    type: ActionTypes.UPDATE_SEARCH_TERM,
    searchTerm
  }
}

export function toggleFilterFollowings () {
  return {
    type: ActionTypes.TOGGLE_FILTER_FOLLOWINGS
  }
}

export function toggleFilterFavorings () {
  return {
    type: ActionTypes.TOGGLE_FILTER_FAVORINGS
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
