import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class VientosConversation extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'vientos-conversation' }

  static get actions () {
    return {
      addMessage: ActionCreators.addMessage,
      saveNotification: ActionCreators.saveNotification,
      saveConversation: ActionCreators.saveConversation
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
      projects: {
        type: Object,
        statePath: 'projects'
      },
      intents: {
        type: Object,
        statePath: 'intents'
      },
      matchings: {
        type: Object,
        statePath: 'matchings'
      },
      notifications: {
        type: Array,
        statePath: 'notifications'
      },
      conversationNotifications: {
        type: Array,
        computed: '_filterNotifications(conversation, notifications)',
        observer: '_deativateNotifications'
      },
      conversation: {
        type: Object
      },
      reviews: {
        type: Array,
        statePath: 'reviews'
      },
      conversationReviews: {
        type: Array,
        value: [],
        computed: '_filterConversationReviews(conversation, reviews)'
      },
      causingIntent: {
        type: Object,
        computed: '_getCausingIntent(conversation, intents)'
      },
      matchingIntent: {
        type: Object,
        value: null,
        computed: '_getMatchingIntent(conversation, intents)'
      },
      availableMatchedIntents: {
        type: Array,
        computed: '_computeAvailableMatchedIntents(causingIntent, matchings, intents)'
      },
      ableToMatch: {
        type: Boolean,
        computed: '_computeAbleToMatch(person, causingIntent, matchingIntent, projects)'
      },
      selectingMatch: {
        type: Boolean,
        value: false
      },
      newMatchingIntentId: {
        type: String,
        value: null
      },
      newMessage: {
        type: String,
        value: ''
      },
      showNewMessage: {
        type: Boolean,
        value: false,
        computed: '_showNewMessage(conversation, conversationReviews, reviewing, online)'
      },
      canReview: {
        type: Boolean,
        value: false,
        computed: '_canReview(person, conversation, intents, conversationReviews)'
      },
      online: {
        type: Boolean,
        statePath: 'online'
      },
      history: {
        type: Array,
        statePath: 'history'
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

  static get observers () {
    return [
      '_setSuccess(conversationReviews)'
    ]
  }

  _getName (...args) { return util.getName(...args) }
  _getImage (...args) { return util.getImage(...args) }
  _addHyperLinks (...args) { return util.addHyperLinks(...args) }
  _filterConversationReviews (...args) { return util.filterConversationReviews(...args) }
  _computeAvailableMatchedIntents (...args) { return util.filterMatchedIntents(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _getCausingIntent (conversation, intents) {
    if (conversation && intents && intents.length) { return util.getRef(conversation.causingIntent, intents) }
  }

  _getMatchingIntent (conversation, intents) {
    if (conversation && intents && conversation.matchingIntent && intents.length) {
      return util.getRef(conversation.matchingIntent, intents)
    } else return null
  }

  _sendMessage () {
    this.dispatch('addMessage', {
      type: 'Message',
      creator: this.person._id,
      body: this.newMessage,
      conversation: this.conversation._id
    })
    this._reset()
  }

  _canReview (person, conversation, intents, conversationReviews) {
    if (!conversation || !intents) return false
    // no reviews
    if (conversationReviews.length === 0) return true
    // if only one review was made, but not from my team (includes me)
    if (conversationReviews.length === 1) return !util.sameTeam(person._id, conversationReviews[0].creator, conversation, intents)
    // TODO handle when project memeber, but not intent admin already reviewed (sameTeam() only checks intent admins)
    return false
  }

  _setSuccess (conversationReviews) {
    if (conversationReviews && conversationReviews.length) {
      this.set('success', conversationReviews[0].success)
    }
  }

  _showNewMessage (conversation, conversationReviews, reviewing, online) {
    if (!conversation || !online) return false
    return conversationReviews.length === 0 && !reviewing
  }

  _computeAbleToMatch (person, causingIntent, matchingIntent, projects) {
    if (Array.from(arguments).includes(undefined)) return false
    return person && !matchingIntent &&
           !causingIntent.projects.some(projectId => util.getRef(projectId, projects).admins.includes(person._id)) && // not an admin of org from causing intent
           projects.some(project => project.admins.includes(person._id)) // some other org admin
  }

  _toggleSelectingMatch () {
    this.set('selectingMatch', !this.selectingMatch)
  }

  _cancelSelectingMatch () {
    this._toggleSelectingMatch()
    if (this.newMatchingIntentId) this.set('newMatchingIntentId', null)
  }

  _saveSelectedMatch () {
    this._toggleSelectingMatch()
    let updated = util.cloneDeep(this.conversation)
    updated.matchingIntent = this.newMatchingIntentId
    this.dispatch('saveConversation', updated)
    this._reset()
  }

  _classForSameTeam (person, creator, conversation, intents) {
    return util.sameTeam(person._id, creator, conversation, intents) ? 'us' : 'others'
  }

  _reset () {
    this.set('newMessage', '')
    this.set('selectingMatch', false)
    this.set('newMatchingIntentId', null)
  }

  _bothMessaged (conversation) {
    return [...new Set(conversation.messages.map(message => message.creator))].length > 1
  }

  _filterNotifications (conversation, notifications) {
    if (!conversation || !notifications) return []
    return notifications.filter(notification => notification.object === conversation._id)
  }

  _deativateNotifications (notifications) {
    notifications.forEach(notification => {
      notification.active = false
      this.dispatch('saveNotification', notification)
    })
  }

  _goToIntentDetails (e, detail) {
    window.history.pushState({}, '', util.pathFor(detail, 'intent'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _goToReview () {
    window.history.pushState({}, '', `/review/${this.conversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _back () {
    this.dispatchEvent(new CustomEvent('back'))
  }
}
window.customElements.define(VientosConversation.is, VientosConversation)
