/* global Polymer, CustomEvent */

const ActionCreators = window.vientos.ActionCreators
const util = window.vientos.util

class VientosConversation extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {

  static get is () { return 'vientos-conversation' }

  static get actions() { return {
    addMessage: ActionCreators.addMessage,
    addReview: ActionCreators.addReview,
    saveNotification: ActionCreators.saveNotification
  } }

  static get properties () { return {
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
      type: Object,
      observer: '_setEditedCollaboration'
    },
    editedCollaboration: {
      type: Object
    },
    editingCollaboration: {
      type: Boolean,
      value: false
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
      computed: '_turnToggleChecked(person, conversation, intents, changeTurn)'
    },
    newMessage: {
      type: String,
      value: ''
    },
    showNewMessage: {
      type: Boolean,
      value: false,
      computed: '_showNewMessage(conversation, reviewing, editingCollaboration)'
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
      computed: '_canReview(person, conversation, intents)'
    },
    language: {
      type: String,
      statePath: 'language'
    },
    resources: {
      type: Object,
      statePath: 'labels'
    }
  } }

  _getName(...args) { return util.getName(...args) }
  _getImage(...args) { return util.getImage(...args) }
  _addHyperLinks(...args) { return util.addHyperLinks(...args) }

  _getCausingIntent (conversation, intents) {
    if (conversation && intents && intents.length)
      return util.getRef(conversation.causingIntent, intents)
  }

  _getMatchingIntent (conversation, intents) {
    if (conversation && intents && conversation.matchingIntent && intents.length)
      return util.getRef(conversation.matchingIntent, intents)
  }

  _setEditedCollaboration (conversation) {
    if (!conversation) return
    if (conversation.collaboration) {
      this.set('editedCollaboration', Object.assign({}, conversation.collaboration))
    } else {
      this.set('editedCollaboration', {
        _id: window.vientos.mintUrl({ type: 'Collaboration' }),
        type: 'Collaboration',
        body: '',
        conversation: conversation._id
      })
    }
  }

  _toggleTurn () {
    this.set('changeTurn', !this.changeTurn)
  }

  _turnToggleChecked (person, conversation, intents, changeTurn) {
    if (Array.from(arguments).includes(undefined)) return
    let ourTurn = util.ourTurn(person, conversation, intents)
    return this.changeTurn ? !ourTurn : ourTurn
  }

  _toggleRequiresMessageHint (changeTurn, newMessage) {
    return changeTurn && !newMessage
  }

  _sendMessage () {
    let ourTurn = util.ourTurn(this.person, this.conversation, this.intents)
    this.dispatch('addMessage', {
      type: 'Message',
      creator: this.person._id,
      body: this.newMessage,
      conversation: this.conversation._id,
      ourTurn: this.changeTurn ? !ourTurn : ourTurn
    })
    this._reset()
  }

  _canReview (person, conversation, intents) {
    if (!conversation || !intents) return false
    // no reviews
    if (conversation.reviews.length === 0) return true
    // if only one review was made, but not from my team (includes me)
    if (conversation.reviews.length === 1) return !util.sameTeam(person._id, conversation.reviews[0].creator, conversation, intents)
    // TODO handle when project memeber, but not intent admin already reviewed (sameTeam() only checks intent admins)
    return false
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

  // TODO mark review as of success or abortion
  _sendReview () {
    let review = {
      type: 'Review',
      creator: this.person._id,
      as: this._whoReviews(),
      body: this.newReview,
      conversation: this.conversation._id,
      rating: this.rating,
      success: this.success
    }
    this.dispatch('addReview', review)
    this._reset()
  }

  _showNewMessage (conversation, reviewing, editingCollaboration) {
    if (!conversation) return
    return conversation.reviews.length === 0 && !reviewing && !editingCollaboration
  }

  _classForSameTeam (person, creator, conversation, intents) {
    return util.sameTeam(person._id, creator, conversation, intents) ? 'us' : 'others'
  }

  _showNewReview (conversation, canReview, reviewing) {
    return canReview && (reviewing || conversation.reviews.length === 1)
  }

  _reset () {
    this.set('newMessage', '')
    this.set('newReview', '')
    this.set('rating', null)
    this.set('reviewing', false)
    this.set('editingCollaboration', false)
    this.set('changeTurn', false)
  }

  _showCollaborationBody (reviewing, success) {
    return !reviewing || (reviewing && success)
  }

  _showCollaborationEditor (conversation, reviewing, editingCollaboration) {
    return conversation && this._bothMessaged(conversation) && conversation.reviews.length === 0 && !reviewing && editingCollaboration
  }

  _toggleCollaborationEditor () {
    this.set('editingCollaboration', !this.editingCollaboration)
  }

  _cancelCollaborationEditing () {
    this._toggleCollaborationEditor()
    this.set('editedCollaboration.body', this.conversation.collaboration.body)
  }

  _showReviewButton (person, conversation, intents, reviewing, editingCollaboration) {
    return this._canReview(person, conversation, intents) && !reviewing && !editingCollaboration && conversation.reviews.length === 0
  }

  _bothMessaged (conversation) {
    return [...new Set(conversation.messages.map(message => message.creator))].length > 1
  }

  _showCollaborationEditButton (conversation, reviewing) {
    return conversation && this._bothMessaged(conversation) && !reviewing && conversation.reviews.length === 0
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
