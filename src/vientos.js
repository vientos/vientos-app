import fetch from 'isomorphic-fetch'
import * as ActionTypes from './actionTypes'
const api = require('../config.json').api

function put (url, resource) {
  return fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(resource)
  }).then(response => response.json())
}

function del (url) {
  return fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  }).then(response => {
    if (response.ok) {
      return null
    } else {
      return response.json()
    }
  })
}

export default function vientos (action) {
  let url
  switch (action.type) {
    case ActionTypes.BYE_REQUESTED:
      url = api.sessions + '/' + action.session.id
      return del(url)
    case ActionTypes.FOLLOW_REQUESTED:
      url = api.followings + '/' + action.following._id
      return put(url, action.following)
    case ActionTypes.UNFOLLOW_REQUESTED:
      url = api.followings + '/' + action.following._id
      return del(url)
    case ActionTypes.SAVE_INTENT_REQUESTED:
      url = api.intents + '/' + action.intent._id
      return put(url, action.intent)
    case ActionTypes.DELETE_INTENT_REQUESTED:
      url = api.intents + '/' + action.intent._id
      return del(url)
    case ActionTypes.FETCH_PERSON_REQUESTED:
      url = api.people + '/' + action.id
      return fetch(url, { credentials: 'include' })
            .then(response => response.json())
    default:
      url = api[action.type.replace('FETCH_', '').replace('_REQUESTED', '').replace('_', '-').toLowerCase()]
      return fetch(url, { credentials: 'include' })
          .then(response => response.json())
  }
}
