import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class IntentDetails extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'intent-details' }

  static get actions () {
    return {
      favor: ActionCreators.favor,
      unfavor: ActionCreators.unfavor,
      saveIntent: ActionCreators.saveIntent,
      fetchMyConversations: ActionCreators.fetchMyConversations,
      fetchNotifications: ActionCreators.fetchNotifications
    }
  }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person'
      },
      people: {
        type: Array,
        statePath: 'people'
      },
      reviews: {
        type: Array,
        statePath: 'reviews'
      },
      abortedReviewGroups: {
        type: Array,
        computed: '_reviewsOfAbortedConversations(intent, reviews)'
      },
      successfulReviewGroups: {
        type: Array,
        computed: '_reviewsOfSuccessfulConversations(intent, reviews)'
      },
      intent: {
        type: Object,
        observer: '_resizeHeader'
      },
      intents: {
        type: Object,
        statePath: 'intents'
      },
      notifications: {
        type: Object,
        statePath: 'notifications'
      },
      favoring: {
        type: Object,
        value: null,
        computed: '_checkIfFavors(person, intent)'
      },
      conversations: {
        type: Array,
        computed: '_filterConversations(intent, myConversations, person, notifications, intents, reviews)'
      },
      myConversations: {
        type: Array,
        statePath: 'myConversations'
      },
      currentConversation: {
        type: Object,
        computed: '_currentConversation(person, projectAdmin, conversations, reviews)'
      },
      projects: {
        type: Array,
        statePath: 'projects'
      },
      places: {
        type: Array,
        statePath: 'places'
      },
      intentProjects: {
        type: Array,
        computed: '_getIntentProjects(intent, projects)'
      },
      projectAdmin: {
        type: Boolean,
        value: false,
        computed: '_checkIfAdmin(person, intentProjects)'
      },
      intentAdmin: {
        type: Boolean,
        value: false,
        computed: '_checkIfAdmin(person, intent)',
        observer: '_intentAdminChanged'
      },
      active: {
        type: Boolean,
        computed: '_checkIfActive(intent)'
      },
      expired: {
        type: Boolean,
        computed: '_checkIfExpired(intent)'
      },
      online: {
        type: Boolean,
        statePath: 'online'
      },
      language: {
        type: String,
        statePath: 'language'
      },
      resources: {
        type: Object,
        statePath: 'labels'
      }
    }
  }

  _checkIfAdmin (...args) { return util.checkIfAdmin(...args) }
  _checkIfFavors (...args) { return util.checkIfFavors(...args) }
  _checkIfExpired (...args) { return util.checkIfExpired(...args) }
  _getIntentProjects (...args) { return util.getIntentProjects(...args) }
  _getRef (...args) { return util.getRef(...args) }
  _getPlaceAddress (...args) { return util.getPlaceAddress(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }
  _getName (...args) { return util.getName(...args) }
  _getImage (...args) { return util.getImage(...args) }

  _checkIfActive (intent) {
    if (intent) return intent.status === 'active'
  }

  _edit () {
    // we use replaceState to avoid when edting and going to intent page, that back button take you to edit again
    window.history.replaceState({}, '', `/edit-intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _projectPageUrl (project) {
    return util.pathFor(project, 'project')
  }

  _back () {
    util.back('/intents')
  }

  _startConversation () {
    window.history.pushState({}, '', `/new-conversation/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _continueConversation () {
    window.history.pushState({}, '', `/conversation/${this.currentConversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showConversations (projectAdmin, conversations) {
    return projectAdmin && conversations && conversations.length
  }

  _currentConversation (person, projectAdmin, conversations, reviews) {
    if (person && !projectAdmin && conversations) {
      return conversations.find(conversation => {
        return conversation.creator === person._id &&
          util.filterConversationReviews(conversation, reviews).length < 2
      }) || null
    } else {
      return null
    }
  }

  _showPrimaryAction (person, projectAdmin) {
    return person && !projectAdmin
  }

  _reviewsOfAbortedConversations (intent, reviews) {
    if (!intent || !reviews) return []
    return util.pairReviews(reviews.filter(review => !review.success && (review.causingIntent === intent._id || review.matchingIntent === intent._id)))
  }

  _reviewsOfSuccessfulConversations (intent, reviews) {
    if (!intent || !reviews) return []
    return util.pairReviews(reviews.filter(review => review.success && (review.causingIntent === intent._id || review.matchingIntent === intent._id)))
  }

  _canFavor (person, projectAdmin) {
    return person && !projectAdmin
  }

  _toggleFavor () {
    if (!this.favoring) {
      this.dispatch('favor', this.person, this.intent)
    } else {
      this.dispatch('unfavor', this.favoring)
    }
  }

  _showProjectProfile (e) {
    window.history.pushState({}, '', util.pathFor(e.model.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showLocationOnMap (e) {
    window.history.pushState({}, '', `/intents?place=${e.model.placeId}#map`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _intentAdminChanged (newValue, oldValue) {
    if (oldValue === undefined) return
    this.dispatch('fetchMyConversations', this.person)
    this.dispatch('fetchNotifications', this.person)
  }

  _filterConversations (intent, myConversations, person, notifications, intents, reviews) {
    return util.filterIntentConversations(intent, myConversations)
            .filter(conversation => {
              return util.conversationNeedsAttention(person, conversation, notifications, intents, reviews)
            })
  }

  _daysLeft (expiryDate) {
    return Math.floor((new Date(expiryDate) - Date.now()) / (1000 * 60 * 60 * 24))
  }

  _resizeHeader () {
    setTimeout(() => {
      this.$$('app-header-layout').notifyResize()
    }, 100)
  }
}
window.customElements.define(IntentDetails.is, IntentDetails)
