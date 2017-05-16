import { mintUrl } from './vientos'
const service = require('../config.json').service

export { mintUrl }

export function locationsInBoundingBox (project, boundingBox) {
  return project.locations.filter(location => {
    return location.latitude <= boundingBox.ne.lat &&
           location.latitude >= boundingBox.sw.lat &&
           location.longitude <= boundingBox.ne.lng &&
           location.longitude >= boundingBox.sw.lng
  }).map(location => {
    location.project = project._id
    return location
  })
}

export function extractLocations (projects, boundingBox) {
  return projects.reduce((acc, project) => {
    return acc.concat(locationsInBoundingBox(project, boundingBox))
  }, [])
}

export function filterProjects (person, projects, intents, filteredCategories, filteredFollowings, filteredFavorings, filteredCollaborationTypes, locationFilter, boundingBoxFilter, boundingBox) {
  let filtered
  // filter on categories
  if (filteredCategories.length === 0) {
    filtered = projects.slice()
  } else {
    filtered = projects.filter(project => {
      return project.categories.some(category => {
        return filteredCategories.includes(category)
      })
    })
  }
  // filter following projects
  if (filteredFollowings) {
    filtered = filtered.filter(project => {
      return person.followings.some(following => {
        return following.project === project._id
      })
    })
  }

  if (filteredFavorings) {
    filtered = filtered.filter(project => {
      // return the projects which has at least one intent which person favored
      return intents.some(intent => intent.projects.includes(project._id) && person.favorings.some(favoring => favoring.intent === intent._id))
    })
  }

  // filter on collaboration types
  if (filteredCollaborationTypes.length > 0) {
    filtered = filtered.filter(project => {
      // return the projects which has at least one intent which its collaborationType is among filteredCollaborationTypes
      return intents.some(intent => intent.projects.includes(project._id) && filteredCollaborationTypes.includes(intent.collaborationType))
    })
  }
  if (locationFilter === 'specific' && boundingBoxFilter) {
    // filter with location inside bounding box
    filtered = filtered.filter(project => {
      return locationsInBoundingBox(project, boundingBox).length > 0
    })
  } else if (locationFilter === 'specific' && !boundingBoxFilter) {
    // filter projects with some location
    filtered = filtered.filter(project => {
      return project.locations.length !== 0
    })
  } else if (locationFilter === 'all' && boundingBoxFilter) {
    // show all projects without location and the ones with location inside bounding box
    filtered = filtered.filter(project => {
      return project.locations.length === 0 || locationsInBoundingBox(project, boundingBox).length > 0
    })
  } else if (locationFilter === 'city') {
    filtered = filtered.filter(project => {
      return project.locations.length === 0
    })
  }

  return filtered
}

export function filterIntents (person, intents, visibleProjects, filteredCollaborationTypes, filteredFavorings) {
  let filtered = intents.filter(intent => visibleProjects.some(project => intent.projects.includes(project._id)))
  if (filteredCollaborationTypes.length > 0) {
    filtered = filtered.filter(intent => filteredCollaborationTypes.includes(intent.collaborationType))
  }
  // filter favoring intents
  if (filteredFavorings) {
    filtered = filtered.filter(intent => {
      return person.favorings.some(favoring => {
        return favoring.intent === intent._id
      })
    })
  }
  return filtered
}

export function filterProjectOffers (project, intents) {
  if (!project) return []
  return intents.filter(intent => intent.projects.includes(project._id) && intent.direction === 'offer')
}

export function filterProjectRequests (project, intents) {
  if (!project) return []
  return intents.filter(intent => intent.projects.includes(project._id) && intent.direction === 'request')
}

export function getIntentProjects (intent, projects) {
  if (!intent) return []
  return projects.filter(project => intent.projects.includes(project._id))
}

export function checkIfAdmin (person, projects) {
  if (!projects) return false
  if (!Array.isArray(projects)) projects = [ projects ]
  return person && projects.some(project => project.admins && project.admins.includes(person._id))
}

export function checkIfFollows (person, project) {
  if (person && project && person.followings) {
    return person.followings.find(el => el.project === project._id) || null
  } else {
    return null
  }
}

export function checkIfFavors (person, intent) {
  if (person && intent && person.favorings) {
    return person.favorings.find(el => el.intent === intent._id) || null
  } else {
    return null
  }
}

export function pathFor (entity, type) {
  let url = entity
  if (typeof entity === 'object') url = entity._id
  return `/${type}/${url.split('/').pop()}`
}

export function urlFromId (id, collection) {
  return service + '/' + collection + '/' + id
}

export function iconFor (item) {
  return 'vientos:' + item.id
}

export function getRef (entityIds, collection) {
  if (!Array.isArray(entityIds)) {
    return collection.find(entity => entityIds === entity._id)
  } else {
    return collection.filter(entity => entityIds.includes(entity._id))
  }
}

export function findPotentialMatches (person, projects, intents, matchedIntent) {
  if (matchedIntent && person) {
    return intents.filter(intent => {
      return matchedIntent.direction !== intent.direction && intent.projects.some(projectId => {
        return projects.filter(project => {
          return project.admins.includes(person._id)
        }).some(project => project._id === projectId)
      })
    })
  }
}

export function filterVisibleConversations (person, intents, myConversations) {
}

// TODO reuse for notifications
export function filterActiveIntents (person, intents, myConversations) {
  if (person) {
    // conversations which I created
    // and conversation on intens (causing or matching) which I admin
    return intents.filter(intent => {
      return myConversations.some(conversation => {
        return (conversation.causingIntent === intent._id ||
                conversation.matchingIntent === intent._id) &&
               (conversation.creator === person._id ||
                intent.admins.includes(person._id))
      })
    })
  }
}

export function filterIntentConversations (intent, myConversations) {
  if (intent) {
    return myConversations.filter(conversation => {
      return conversation.causingIntent === intent._id ||
      conversation.matchingIntent === intent._id
    })
  }
}
