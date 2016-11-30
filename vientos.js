import fetch from 'isomorphic-fetch'

export function fetchProjects (){
   return fetch('http://localhost:3000/api/projects',{credentials:'include'})
      .then(response => response.json())
}
