import fetch from 'isomorphic-fetch'
const api = require('../config.json').api

export function fetchProjects () {
  return fetch(api.projects, { credentials: 'include' })
      .then(response => response.json())
}

export function fetchCategories () {
  return fetch(api.categories, { credentials: 'include' })
      .then(response => response.json())
}

export function fetchCollaborationTypes () {
  return fetch(api.collaborationTypes, { credentials: 'include' })
      .then(response => response.json())
}

export function fetchLabels () {
  return fetch(api.labels, { credentials: 'include' })
      .then(response => response.json())
}

export function hello () {
  return fetch(api.hello, { credentials: 'include' })
      .then(response => response.json())
}

export function bye () {
  return fetch(api.bye, { method: 'PUT', credentials: 'include' })
}

export function follow (personId, projectId) {
  let url = api.follow.replace('{personId}', personId).replace('{projectId}', projectId)
  return fetch(url, { method: 'PUT', credentials: 'include' })
}

export function unfollow (personId, projectId) {
  let url = api.unfollow.replace('{personId}', personId).replace('{projectId}', projectId)
  return fetch(url, { method: 'DELETE', credentials: 'include' })
}

export function createIntent (intent) {
  return fetch(api.intents, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(intent)
  }).then(response => {
    intent._id = response.headers.get('location').split('/')[2]
    return intent
  })
}
