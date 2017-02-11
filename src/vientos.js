import fetch from 'isomorphic-fetch'
const api = require('../config.json').api

export function get (action) {
  let url = api[action.type.replace('FETCH_', '').replace('_REQUESTED', '').replace('_', '-').toLowerCase()]
  return fetch(url, { credentials: 'include' })
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

export function updateIntent (intent) {
  return fetch(api.intents + '/' + intent._id, {
    method: 'PUT',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(intent)
  })
}

export function deleteIntent (intentId) {
  return fetch(api.intents + '/' + intentId, {
    method: 'DELETE',
    credentials: 'include'
  })
}
