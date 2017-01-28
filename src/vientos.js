import fetch from 'isomorphic-fetch'
const api = require('../config.json').api

export function fetchProjects (){
   return fetch(api.projects, {credentials:'include'})
      .then(response => response.json())
}

export function fetchCategories (){
   return fetch(api.categories, {credentials:'include'})
      .then(response => response.json())
}

export function fetchCollaborationTypes (){
   return fetch(api.collaborationTypes, {credentials:'include'})
      .then(response => response.json())
}

export function fetchLabels (){
   return fetch(api.labels, {credentials:'include'})
      .then(response => response.json())
}

export function login (email, password) {
  return fetch(api.login, {
    method: 'POST',
    credentials: 'include',
    body: `email=${email}&password=${password}`,
    headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
      .then(response => response.json())
}

export function register (email, password) {
  return fetch(api.register, {
    method: 'POST',
    credentials: 'include',
    body: `email=${email}&password=${password}`,
    headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
      .then(response => response.json())
}

export function follow (projectId) {
  return fetch(api.follow, {
    method: 'POST',
    credentials: 'include',
    body: `id=${projectId}`,
    headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
}

export function unfollow (projectId) {
  return fetch(api.unfollow.replace('{id}', projectId), {
    method: 'DELETE',
    credentials: 'include' })
}
