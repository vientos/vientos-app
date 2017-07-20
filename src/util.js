/* global CustomEvent */

import { mintUrl } from './vientos'
import { escape } from 'escape-goat'
const service = require('../config.json').service

export { mintUrl }

export function locationsInBoundingBox (entity, places, boundingBox) {
  return places.filter(place => {
    return entity.locations.some(placeId => placeId === place._id) &&
           place.latitude <= boundingBox.ne.lat &&
           place.latitude >= boundingBox.sw.lat &&
           place.longitude <= boundingBox.ne.lng &&
           place.longitude >= boundingBox.sw.lng
  })
}

export function filterPlaces (entities, places, boundingBox) {
  return entities.reduce((acc, entity) => {
    return acc.concat(locationsInBoundingBox(entity, places, boundingBox))
  }, [])
}

export function filterProjects (person, projects, places, intents, filteredCategories, filteredFollowings, filteredFavorings, filteredCollaborationTypes, locationFilter, boundingBoxFilter, boundingBox) {
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
      return locationsInBoundingBox(project, places, boundingBox).length > 0
    })
  } else if (locationFilter === 'specific' && !boundingBoxFilter) {
    // filter projects with some location
    filtered = filtered.filter(project => {
      return project.locations.length !== 0
    })
  } else if (locationFilter === 'all' && boundingBoxFilter) {
    // show all projects without location and the ones with location inside bounding box
    filtered = filtered.filter(project => {
      return project.locations.length === 0 || locationsInBoundingBox(project, places, boundingBox).length > 0
    })
  } else if (locationFilter === 'city') {
    filtered = filtered.filter(project => {
      return project.locations.length === 0
    })
  }

  return filtered
}

export function filterIntents (person, intents, visibleProjects, filteredCollaborationTypes, filteredFavorings) {
  let filtered = intents.filter(intent => intent.status === 'active')
  filtered = intents.filter(intent => visibleProjects.some(project => intent.projects.includes(project._id)))
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

export function filterActiveProjectIntents (project, intents) {
  if (!project) return []
  return intents.filter(intent => intent.projects.includes(project._id) && intent.status === 'active')
}

export function filterInactiveProjectIntents (project, intents) {
  if (!project) return []
  return intents.filter(intent => intent.projects.includes(project._id) && intent.status === 'inactive')
}

export function getIntentProjects (intent, projects) {
  if (!intent) return []
  return projects.filter(project => intent.projects.includes(project._id))
}

export function checkIfAdmin (person, entities) {
  if (!entities) return false
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

export function urlFromId (id, collection) {
  return service + '/' + collection + '/' + id
}

export function iconFor (item) {
  return 'vientos:' + item.id
}

export function getRef (entityIds, collection) {
  if (!Array.isArray(entityIds)) {
    let entity = collection.find(element => entityIds === element._id)
    if (entity) return entity
    else throw new Error('entity not found in the collection: ' + entityIds)
  } else {
    let entities = collection.filter(entity => entityIds.includes(entity._id))
    if (entityIds.length === entities.length) return entities
    else throw new Error('entities not found in the collection: ' + JSON.stringify(entityIds))
  }
}

export function getPlaceAddress (placeId, places) {
  let place = getRef(placeId, places)
  if (place) return place.address
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

function onThisIntent (conversation, intent) {
  return conversation.causingIntent === intent._id ||
    conversation.matchingIntent === intent._id
}

function onThisIntentConversation (intent, notification, conversations) {
  let conversation = getRef(notification.object, conversations)
  return onThisIntent(conversation, intent)
}

function onThisIntentAndOurTurn (person, conversation, intent) {
  return onThisIntent(conversation, intent) && ourTurn(person, conversation, [intent])
}

// TODO reuse for notifications
export function filterActiveIntents (person, intents, myConversations, notifications) {
  if (person) {
    // conversations which I created
    // and conversation on intens (causing or matching) which I admin
    return intents.filter(intent => {
      return myConversations.some(conversation => {
        return foo(person, conversation, intent, notifications, intents)
      })
    }).sort((a, b) => {
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
        let aOurTurnConversations = myConversations.filter(conversation => {
          return onThisIntentAndOurTurn(person, conversation, a)
        })
        let bOurTurnConversations = myConversations.filter(conversation => {
          return onThisIntentAndOurTurn(person, conversation, b)
        })
        if (aOurTurnConversations.length && bOurTurnConversations.length) {
          let aLastConversationCreatedAt = new Date(aOurTurnConversations.pop().createdAt)
          let bLastConversationCreatedAt = new Date(bOurTurnConversations.pop().createdAt)
          return bLastConversationCreatedAt - aLastConversationCreatedAt
        } else if (aOurTurnConversations.length) {
          return -1
        } else if (bOurTurnConversations.length) {
          return 1
        } else {
          let aConversations = myConversations.filter(conversation => {
            return onThisIntent(conversation, a)
          })
          let bConversations = myConversations.filter(conversation => {
            return onThisIntent(conversation, b)
          })
          return new Date(bConversations.pop().createdAt) - new Date(aConversations.pop().createdAt)
        }
      }
    })
  }
}

// TODO fix name foo
export function foo (person, conversation, intent, notifications, intents) {
  if (!intent) return false
  return (
          // show causing intent unless im admin of matching intent
          (!conversation.matchingIntent && conversation.causingIntent === intent._id) ||
          (conversation.matchingIntent && conversation.causingIntent === intent._id && intent.admins.includes(person._id)) ||
          (conversation.matchingIntent === intent._id && intent.admins.includes(person._id))
         ) &&
         conversationNeedsAttention(person, conversation, notifications, intents)
}

export function conversationNeedsAttention (person, conversation, notifications, intents) {
  return notifications.some(notification => notification.object === conversation._id) ||
    // don't show when both sides reviewed
    conversation.reviews.length === 0 ||
    // don't show when I've reviewed
    ourTurn(person, conversation, intents)
}

export function filterIntentConversations (intent, myConversations) {
  if (intent) {
    return myConversations.filter(conversation => {
      return conversation.causingIntent === intent._id ||
      conversation.matchingIntent === intent._id
    })
  }
}

export function canAdminIntent (person, intent) {
  if (!person) return false
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

export function ourTurn (person, conversation, intents) {
  if (!person || !conversation || intents.length === 0) return false
  if (conversation.reviews.length === 2) return false
  if (conversation.reviews.length === 1) return !sameTeam(person._id, conversation.reviews[0].creator, conversation, intents)
  let lastMessage = conversation.messages[conversation.messages.length - 1]
  return sameTeam(person._id, lastMessage.creator, conversation, intents) === lastMessage.ourTurn
}

export function getThumbnailUrl (entity, width) {
  if (entity && entity.logo) {
    let urlArray = entity.logo.split('/')
    urlArray[6] = 'w_' + width
    return urlArray.join('/')
  }
}

export function back (fallbackPath) {
  let referrer = document.referrer.split('/')[2]
  if (referrer === document.location.host) window.history.back()
  else {
    window.history.pushState({}, '', fallbackPath)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}

export function getName (entity, collection) {
  if (!collection.length) return undefined
  return getRef(entity, collection).name
}

export function getImage (entity, collection, size) {
  if (!collection.length) return undefined
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
