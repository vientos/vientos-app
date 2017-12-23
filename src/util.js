import { escape } from 'escape-goat'
import shave from 'shave'
import deepEqual from 'deep-equal'
import cloneDeep from 'lodash.clonedeep'

export { deepEqual, shave, cloneDeep }

export function inBoundingBox (place, boundingBox) {
  return place.latitude <= boundingBox.ne.lat &&
    place.latitude >= boundingBox.sw.lat &&
    place.longitude <= boundingBox.ne.lng &&
    place.longitude >= boundingBox.sw.lng
}

export function hasLocationsInBoundingBox (entity, places, boundingBox) {
  return places.filter(place => {
    return entity.locations.some(placeId => placeId === place._id) &&
      inBoundingBox(place, boundingBox)
  })
}

export function filterPlaces (entities, places, boundingBox) {
  if (Array.from(arguments).includes(undefined)) return []
  return entities.reduce((acc, entity) => {
    return acc.concat(hasLocationsInBoundingBox(entity, places, boundingBox))
  }, [])
}

function appearsInSearchResults (entity, searchTerm, searchIndex) {
  return searchIndex.search(searchTerm).find(result => result.ref === entity._id)
}

export function filterProjects (person, projects, places, intents, personalFilter, filteredCategories, currentPlace, boundingBox, searchTerm, projectsIndex) {
  if (Array.from(arguments).includes(undefined)) return []
  let filtered = projects.slice()
  if (personalFilter) {
    let followed = filtered.filter(project => {
      return person.followings.some(following => {
        return following.project === project._id
      })
    })
    filtered = filtered.filter(project => project.admins.includes(person._id)).concat(followed)
  } else {
    // filter on categories
    if (filteredCategories.length) {
      filtered = projects.filter(project => {
        return project.categories.some(category => {
          return filteredCategories.includes(category)
        })
      })
    }
  }

  if (currentPlace) {
    filtered = filtered.filter(project => project.locations.includes(currentPlace._id))
  } else {
    // show all projects without location and the ones with location inside bounding box
    // TODO add default loaction to projects without location
    filtered = filtered.filter(project => {
      return hasLocationsInBoundingBox(project, places, boundingBox).length > 0
    })
  }
  if (searchTerm && projectsIndex) {
    filtered = filtered.filter(project => appearsInSearchResults(project, searchTerm, projectsIndex))
  }
  return filtered
}

export function checkIfExpired (intent) {
  if (intent) return Date.now() - new Date(intent.expiryDate) > 0
}

export function availableIntents (intents) {
  if (!intents) return []
  return intents.filter(intent => intent.status === 'active' && !checkIfExpired(intent))
}

export function filterIntents (person, intents, projects, places, myConversations, notifications, reviews, personalFilter, filteredCollaborationTypes, currentPlace, boundingBox, searchTerm, intentsIndex) {
  if (Array.from(arguments).includes(undefined)) return []
  let filtered = intents.slice()
  if (personalFilter) {
    let activeIntents = filterActiveIntents(person, intents, myConversations, notifications, reviews)
    let admined = intents.filter(intent => intent.admins.includes(person._id))
    let favored = filtered.filter(intent => {
      return person.favorings.some(favoring => {
        return favoring.intent === intent._id
      })
    })
    filtered = [...new Set(activeIntents.concat(admined).concat(favored))]
  } else {
    filtered = availableIntents(filtered)
    if (filteredCollaborationTypes.length > 0) {
      filtered = filtered.filter(intent => filteredCollaborationTypes.includes(intent.collaborationType))
    }
  }
  if (currentPlace) {
    filtered = filtered.filter(intent => intent.locations.includes(currentPlace._id))
  } else {
    // show all intents without location and the ones with location inside bounding box
    // TODO add default loaction to intents without location
    filtered = filtered.filter(intent => {
      return hasLocationsInBoundingBox(intent, places, boundingBox).length ||
        intent.projects.some(projectId => {
          let project = getRef(projectId, projects)
          return hasLocationsInBoundingBox(project, places, boundingBox).length ||
            project.locations.length === 0 // TODO remove when default location
        })
    })
  }
  if (searchTerm && intentsIndex) {
    filtered = filtered.filter(intent => appearsInSearchResults(intent, searchTerm, intentsIndex))
  }
  return filtered
}

export function filterActiveProjectIntents (person, project, intents, myConversations, notifications, reviews) {
  if (Array.from(arguments).includes(undefined)) return []
  if (!project) return []
  let filtered = intents.filter(intent => intent.projects.includes(project._id) && intent.status === 'active' && !checkIfExpired(intent))
  return (person && myConversations.length && notifications.length) ? orderIntents(filtered, person, myConversations, notifications, reviews) : filtered
}

export function filterInactiveProjectIntents (person, project, intents, myConversations, notifications, reviews) {
  if (Array.from(arguments).includes(undefined)) return []
  if (!project) return []
  let filtered = intents.filter(intent => intent.projects.includes(project._id) && intent.status === 'inactive' && !checkIfExpired(intent))
  return (person && myConversations.length && notifications.length) ? orderIntents(filtered, person, myConversations, notifications, reviews) : filtered
}

export function filterExpiredProjectIntents (person, project, intents, myConversations, notifications, reviews) {
  if (Array.from(arguments).includes(undefined)) return []
  if (!project) return []
  let filtered = intents.filter(intent => intent.projects.includes(project._id) && checkIfExpired(intent))
  return (person && myConversations.length && notifications.length) ? orderIntents(filtered, person, myConversations, notifications, reviews) : filtered
}

export function getIntentProjects (intent, projects) {
  if (!intent || !projects) return []
  return projects.filter(project => intent.projects.includes(project._id))
}

export function checkIfAdmin (person, entities) {
  if (Array.from(arguments).includes(undefined)) return false
  if (entities === null) return false
  if (!Array.isArray(entities)) entities = [ entities ]
  return person && entities.some(entity => entity.admins && entity.admins.includes(person._id))
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

function compareIdentifiers (fuzzy, cannonical) {
  if (fuzzy.includes(':')) {
    // IRI identifier
    return fuzzy === cannonical
  } else {
    // CUID identifier
    return fuzzy === cannonical.split('/').pop()
  }
}
/**
 * accepts string identifier (IRI or CUID) or array of them
 * and an array of entities
 * returns a reference to entity or array of references
 * where entity _id matches the string
 */
export function getRef (entityIds, collection) {
  if (!Array.isArray(entityIds)) {
    // single identifier
    let entity = collection.find(element => compareIdentifiers(entityIds, element._id))
    if (entity) return entity
    else throw new Error('entity not found in the collection: ' + entityIds)
  } else {
    // array of identifiers
    let entities = collection.filter(entity => {
      return entityIds.find(id => compareIdentifiers(id, entity._id))
    })
    if (entityIds.length === entities.length) return entities
    else throw new Error('entities not found in the collection: ' + JSON.stringify(entityIds))
  }
}

export function getPlaceAddress (placeId, places) {
  try {
    return getRef(placeId, places).address
  } catch (e) {
  }
}

export function findPotentialMatches (person, projects, intents, matchedIntent) {
  if (Array.from(arguments).includes(undefined)) return
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

function onThisIntent (conversation, intent) {
  return conversation.causingIntent === intent._id ||
    conversation.matchingIntent === intent._id
}

function onThisIntentConversation (intent, notification, conversations) {
  let conversation = getRef(notification.object, conversations)
  return onThisIntent(conversation, intent)
}

function orderIntents (intents, person, myConversations, notifications, reviews) {
  return intents.sort((a, b) => {
    let aNotifications = notifications.filter(notification => {
      return onThisIntentConversation(a, notification, myConversations)
    })
    let bNotifications = notifications.filter(notification => {
      return onThisIntentConversation(b, notification, myConversations)
    })
    if (aNotifications.length && bNotifications.length) {
      return new Date(bNotifications.pop().createdAt) - new Date(aNotifications.pop().createdAt)
    } else if (aNotifications.length) {
      return -1
    } else if (bNotifications.length) {
      return 1
    } else {
      let aConversations = myConversations.filter(conversation => {
        return onThisIntent(conversation, a)
      })
      let bConversations = myConversations.filter(conversation => {
        return onThisIntent(conversation, b)
      })
      if (aConversations.length && bConversations.length) {
        return new Date(bConversations.pop().createdAt) - new Date(aConversations.pop().createdAt)
      } else if (aConversations.length) {
        return -1
      } else if (bConversations.length) {
        return 1
      }
    }
  })
}

// TODO reuse for notifications
export function filterActiveIntents (person, intents, myConversations, notifications, reviews) {
  if (Array.from(arguments).includes(undefined)) return []
  if (person) {
    // conversations which I created
    // and conversation on intens (causing or matching) which I admin
    let activeIntents = intents.filter(intent => {
      return myConversations.some(conversation => {
        return intentPrimaryForMyConversation(person, conversation, intent, notifications, intents, reviews)
      })
    })
    return orderIntents(activeIntents, person, myConversations, notifications, reviews)
  }
}

export function intentPrimaryForMyConversation (person, conversation, intent, notifications, intents, reviews) {
  if (!intent) return false
  return (
          // show causing intent unless im admin of matching intent
          (!conversation.matchingIntent && conversation.causingIntent === intent._id) ||
          (conversation.matchingIntent && conversation.causingIntent === intent._id && intent.admins.includes(person._id)) ||
          (conversation.matchingIntent === intent._id && intent.admins.includes(person._id))
         ) &&
         conversationNeedsAttention(person, conversation, notifications, intents, reviews)
}

export function filterConversationReviews (conversation, reviews) {
  if (!conversation || !reviews) return []
  return reviews.filter(review => review.conversation === conversation._id)
}

export function conversationNeedsAttention (person, conversation, notifications, intents, reviews) {
  return notifications.some(notification => notification.object === conversation._id) ||
    filterConversationReviews(conversation, reviews).length === 0
    // TODO stars
}

export function filterIntentConversations (intent, myConversations) {
  if (Array.from(arguments).includes(undefined)) return []
  if (intent && myConversations) {
    return myConversations.filter(conversation => {
      return conversation.causingIntent === intent._id ||
      conversation.matchingIntent === intent._id
    })
  } else {
    return []
  }
}

export function canAdminIntent (person, intent) {
  if (!person || !intent) return false
  let personId = person
  if (typeof person === 'object') personId = person._id
  return !!intent && intent.admins.includes(personId)
}

export function sameTeam (myId, otherPersonId, conversation, intents) {
  if (!conversation) return
  if (myId === otherPersonId) return true
  let causingIntent = intents.find(intent => intent._id === conversation.causingIntent)
  let matchingIntent = intents.find(intent => intent._id === conversation.matchingIntent)
  return (canAdminIntent(myId, causingIntent) && canAdminIntent(otherPersonId, causingIntent)) ||
        ((myId === conversation.creator || canAdminIntent(myId, matchingIntent)) &&
        (otherPersonId === conversation.creator || canAdminIntent(otherPersonId, matchingIntent)))
}

export function getThumbnailUrl (entity, width) {
  if (entity && entity.logo) {
    let urlArray = entity.logo.split('/')
    urlArray[6] = 'w_' + width
    return urlArray.join('/')
  }
}

export function getName (entity, collection) {
  if (!collection || !collection.length) return undefined
  return getRef(entity, collection).name
}

export function getImage (entity, collection, size) {
  if (!collection || !collection.length) return undefined
  return getThumbnailUrl(getRef(entity, collection), size)
}

export function addHyperLinks (text) {
  text = escape(text)
  let matches = text.match(/https?:\/\/[^\s]*/g)

  if (matches) {
    matches.forEach(link => {
      text = text.replace(link, `<a href="${link}" target="_blank">${link}</a>`)
    })
  }
  return text
}

export function pairReviews (reviews) {
  return Object.values(reviews.reduce((acc, review) => {
    if (!acc[review.conversation]) acc[review.conversation] = []
    acc[review.conversation].push(review)
    return acc
  }, {}))
}
