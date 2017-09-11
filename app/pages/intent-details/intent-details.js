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
        type: Object
      },
      favoring: {
        type: Object,
        value: null,
        computed: '_checkIfFavors(person, intent)'
      },
      conversations: {
        type: Array,
        computed: '_filterIntentConversations(intent, myConversations)'
      },
      myConversations: {
        type: Array,
        statePath: 'myConversations'
      },
      currentConversation: {
        type: Object,
        computed: '_currentConversation(person, projectAdmin, conversations)'
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
  _filterIntentConversations (...args) { return util.filterIntentConversations(...args) }
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

  _deactivate () {
    let updated = Object.assign({}, this.intent)
    updated.status = 'inactive'
    this.dispatch('saveIntent', updated)
  }

  _activate () {
    let updated = Object.assign({}, this.intent)
    updated.status = 'active'
    this.dispatch('saveIntent', updated)
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

  _currentConversation (person, projectAdmin, conversations) {
    if (person && !projectAdmin && conversations) {
      return conversations.find(conversation => {
        return conversation.creator === person._id &&
          conversation.reviews.length < 2
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
    return intent.abortedConversations.map(conversationId => {
      return reviews.filter(review => review.conversation === conversationId)
    })
  }

  _reviewsOfSuccessfulConversations (intent, reviews) {
    if (!intent || !intent.successfulConversations || !reviews) return []
    return intent.successfulConversations.map(conversationId => {
      return reviews.filter(review => review.conversation === conversationId)
    })
  }

  _canFavor (person, projectAdmin) {
    return person && !projectAdmin
  }

  _favor () {
    this.dispatch('favor', this.person, this.intent)
  }

  _unfavor () {
    this.dispatch('unfavor', this.favoring)
  }

  _showProjectProfile (e) {
    window.history.pushState({}, '', util.pathFor(e.model.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showLocationOnMap (e) {
    let place = util.getRef(e.model.placeId, this.places)
    window.history.pushState({}, '', util.pathFor(place, 'place') + '#map')
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _canLeaveAdmin (intent, intentAdmin) {
    if (!intent) return false
    return intentAdmin && intent.admins.length > 1
  }

  _leaveAdmin () {
    let updated = Object.assign({}, this.intent)
    updated.admins = this.intent.admins.filter(adminId => adminId !== this.person._id)
    this.dispatch('saveIntent', updated)
  }

  _becomeAdmin () {
    let updated = Object.assign({}, this.intent)
    updated.admins = [...this.intent.admins, this.person._id]
    this.dispatch('saveIntent', updated)
  }

  _intentAdminChanged (newValue, oldValue) {
    if (oldValue === undefined) return
    this.dispatch('fetchMyConversations', this.person)
    this.dispatch('fetchNotifications', this.person)
  }
}
window.customElements.define(IntentDetails.is, IntentDetails)
