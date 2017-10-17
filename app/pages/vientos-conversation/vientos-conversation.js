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
      addReview: ActionCreators.addReview,
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
      changeTurn: {
        type: Boolean,
        value: false
      },
      turnToggleChecked: {
        type: Boolean,
        computed: '_turnToggleChecked(person, conversation, intents, reviews, changeTurn)'
      },
      newMessage: {
        type: String,
        value: ''
      },
      showNewMessage: {
        type: Boolean,
        value: false,
        computed: '_showNewMessage(conversation, conversationReviews, reviewing)'
      },
      newReview: {
        type: String,
        value: ''
      },
      rating: {
        type: String,
        value: null
      },
      success: {
        type: Boolean,
        value: false
      },
      reviewing: {
        type: Boolean,
        value: false
      },
      canReview: {
        type: Boolean,
        value: false,
        computed: '_canReview(person, conversation, intents, conversationReviews)'
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

  _getCausingIntent (conversation, intents) {
    if (conversation && intents && intents.length) { return util.getRef(conversation.causingIntent, intents) }
  }

  _getMatchingIntent (conversation, intents) {
    if (conversation && intents && conversation.matchingIntent && intents.length) { return util.getRef(conversation.matchingIntent, intents) }
  }

  _toggleTurn () {
    this.set('changeTurn', !this.changeTurn)
  }

  _turnToggleChecked (person, conversation, intents, reviews, changeTurn) {
    if (Array.from(arguments).includes(undefined)) return
    let ourTurn = util.ourTurn(person, conversation, intents, reviews)
    return this.changeTurn ? !ourTurn : ourTurn
  }

  _toggleRequiresMessageHint (changeTurn, newMessage) {
    return changeTurn && !newMessage
  }

  _sendMessage () {
    let ourTurn = util.ourTurn(this.person, this.conversation, this.intents, this.reviews)
    this.dispatch('addMessage', {
      type: 'Message',
      creator: this.person._id,
      body: this.newMessage,
      conversation: this.conversation._id,
      ourTurn: this.changeTurn ? !ourTurn : ourTurn
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

  _abort () {
    this.set('success', false)
    this._startReview()
  }

  _succeed () {
    this.set('success', true)
    this._startReview()
  }

  _startReview () {
    this.set('reviewing', true)
  }

  _abortReview () {
    this._reset()
  }

  _whoReviews () {
    if (this.person._id === this.conversation.creator) {
      return 'creatorOrMatchingIntentAdmin'
    }
    if (!this.conversation.matchingIntent) {
      return 'causingIntentAdminReview'
    } else {
      // TODO
    }
  }

  _sendReview () {
    let review = {
      type: 'Review',
      creator: this.person._id,
      as: this._whoReviews(),
      body: this.newReview,
      conversation: this.conversation._id,
      causingIntent: this.conversation.causingIntent,
      rating: this.rating,
      success: this.success
    }
    if (this.conversation.matchingIntent) review.matchingIntent = this.conversation.matchingIntent
    this.dispatch('addReview', review)
    this._reset()
  }

  _showNewMessage (conversation, conversationReviews, reviewing) {
    if (!conversation) return
    return conversationReviews.length === 0 && !reviewing
  }

  _classForSameTeam (person, creator, conversation, intents) {
    return util.sameTeam(person._id, creator, conversation, intents) ? 'us' : 'others'
  }

  _showNewReview (conversationReviews, canReview, reviewing) {
    return canReview && (reviewing || conversationReviews.length === 1)
  }

  _reset () {
    this.set('newMessage', '')
    this.set('newReview', '')
    this.set('rating', null)
    this.set('reviewing', false)
    this.set('changeTurn', false)
  }

  _showReviewButton (canReview, reviewing, conversationReviews) {
    return canReview && !reviewing && conversationReviews.length === 0
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

  _back () {
    util.back('/me')
  }
}
window.customElements.define(VientosConversation.is, VientosConversation)
