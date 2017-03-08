const service = require('../config.json').service

// FIXME: calculations work only for NW coordinates
export function locationsInBoundingBox (project, boundingBox) {
  return project.locations.filter(location => {
    return location.latitude <= boundingBox.ne.lat &&
           location.latitude >= boundingBox.sw.lat &&
           location.longitude <= boundingBox.ne.lng &&
           location.longitude >= boundingBox.sw.lng
  }).map(location => {
    location.project = project
    return location
  })
}

export function extractLocations (projects, boundingBox) {
  return projects.reduce((acc, project) => {
    return acc.concat(locationsInBoundingBox(project, boundingBox))
  }, [])
}

export function filterProjects (projects, categories, collaborationTypes, boundingBox) {
  let filtered
  // filter on categories
  if (categories.every(f => !f.selected)) {
    filtered = projects.slice()
  } else {
    filtered = projects.filter(project => {
      return project.categories.some(category => {
        return categories.some(filter => {
          return filter.selected && filter.id === category.catId
        })
      })
    })
  }
  // filter on collaboration types
  if (!collaborationTypes.every(filter => !filter.selected)) {
    filtered = filtered.filter(project => {
      return project.needs.concat(project.offers).some(intent => {
        return collaborationTypes.some(filter => {
          return filter.selected && filter.id === intent.type
        })
      })
    })
  }
  // filter by bounding box
  return filtered.filter(project => {
    return locationsInBoundingBox(project, boundingBox).length > 0
  })
}

export function filterProjectOffers (project, intents) {
  return intents.filter(intent => intent.projects.includes(project._id) && intent.direction === 'offer')
}

export function filterProjectRequests (project, intents) {
  return intents.filter(intent => intent.projects.includes(project._id) && intent.direction === 'request')
}

export function checkIfAdmin (person, project) {
  return person && project && project.admins && project.admins.includes(person._id)
}

export function checkIfFollows (person, project) {
  if (person && project && person.followings) {
    return person.followings.find(el => el.project === project._id) || null
  } else {
    return null
  }
}

export function projectPath (project) {
  return `/project/${project._id.split('/').pop()}`
}

export function urlFromId (id, collection) {
  return service + '/' + collection + '/' + id
}

export function iconFor (item) {
  return 'vientos:' + item.id
}
