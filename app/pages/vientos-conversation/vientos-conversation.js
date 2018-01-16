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
      saveNotification: ActionCreators.saveNotification
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
      intents: {
        type: Array,
        statePath: 'intents'
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
        computed: '_getMatchingIntent(conversation, intents)'
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
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _getCausingIntent (conversation, intents) {
    if (conversation && intents && intents.length) { return util.getRef(conversation.causingIntent, intents) }
  }

  _getMatchingIntent (conversation, intents) {
    if (conversation && intents && conversation.matchingIntent && intents.length) { return util.getRef(conversation.matchingIntent, intents) }
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

  _classForSameTeam (person, creator, conversation, intents) {
    return util.sameTeam(person._id, creator, conversation, intents) ? 'us' : 'others'
  }

  _reset () {
    this.set('newMessage', '')
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
