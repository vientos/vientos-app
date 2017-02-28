import fetch from 'isomorphic-fetch'
import * as ActionTypes from './actionTypes'
const api = require('../config.json').api

export default function vientos (action) {
  let url
  switch (action.type) {
    case ActionTypes.BYE_REQUESTED:
      return fetch(api.bye, { method: 'PUT', credentials: 'include' })
    case ActionTypes.FOLLOW_REQUESTED:
      url = api.follow.replace('{personId}', action.personId).replace('{projectId}', action.projectId)
      return fetch(url, { method: 'PUT', credentials: 'include' })
    case ActionTypes.UNFOLLOW_REQUESTED:
      url = api.unfollow.replace('{personId}', action.personId).replace('{projectId}', action.projectId)
      return fetch(url, { method: 'DELETE', credentials: 'include' })
    case ActionTypes.CREATE_INTENT_REQUESTED:
      return fetch(api.intents, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(action.intent)
      }).then(response => {
        action.intent._id = response.headers.get('location').split('/')[2]
        return action.intent
      })
    case ActionTypes.UPDATE_INTENT_REQUESTED:
      return fetch(api.intents + '/' + action.intent._id, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(action.intent)
      })
    case ActionTypes.DELETE_INTENT_REQUESTED:
      return fetch(api.intents + '/' + action.intentId, {
        method: 'DELETE',
        credentials: 'include'
      })
    default:
      url = api[action.type.replace('FETCH_', '').replace('_REQUESTED', '').replace('_', '-').toLowerCase()]
      return fetch(url, { credentials: 'include' })
          .then(response => response.json())
  }
}
