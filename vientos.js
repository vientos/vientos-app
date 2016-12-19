import fetch from 'isomorphic-fetch'
const api = require('./api.json')

export function fetchProjects (){
   return fetch(api.projects, {credentials:'include'})
      .then(response => response.json())
}
