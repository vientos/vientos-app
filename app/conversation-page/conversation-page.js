/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'conversation-page',

  actions: {
    addMessage: ActionCreators.addMessage,
    addReview: ActionCreators.addReview,
    // saveCollaboration: ActionCreators.saveCollaboration,
    abortConversation: ActionCreators.abortConversation,
    saveNotification: ActionCreators.saveNotification
  },

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
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
  },

  _getCreatorName (creator) {
    return util.getRef(creator, this.people).name
  },

  _getCreatorAvatar (creator) {
    return util.getRef(creator, this.people).logo
  },

  _getCausingIntent (conversation, intents) {
    if (conversation) return util.getRef(conversation.causingIntent, intents)
  },

  _getMatchingIntent (conversation, intents) {
    if (conversation) return util.getRef(conversation.matchingIntent, intents)
  },

  _setEditedCollaboration (conversation) {
    if (!conversation) return
    if (conversation.collaboration) {
      this.set('editedCollaboration', Object.assign({}, conversation.collaboration))
    } else {
      this.set('editedCollaboration', {
        _id: util.mintUrl({ type: 'Collaboration' }),
        type: 'Collaboration',
        body: '',
        conversation: conversation._id
      })
    }
  },

  _toggleTurn () {
    this.set('changeTurn', !this.changeTurn)
  },

  _turnToggleChecked (person, conversation, intents, changeTurn) {
    let ourTurn = util.ourTurn(person, conversation, intents)
    return this.changeTurn ? ourTurn : !ourTurn
  },

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
  },

  _canReview (person, conversation, intents) {
    if (!conversation || !intents) return false
    // no reviews
    if (conversation.reviews.length === 0) return true
    // if only one review was made, but not from my team (includes me)
    if (conversation.reviews.length === 1) return !util.sameTeam(person._id, conversation.reviews[0].creator, conversation, intents)
    // TODO handle when project memeber, but not intent admin already reviewed (sameTeam() only checks intent admins)
    return false
  },

  _abort () {
    this.set('success', false)
    this._startReview()
  },

  _succeed () {
    this.set('success', true)
    this._startReview()
  },

  _startReview () {
    this.set('reviewing', true)
  },
  _abortReview () {
    this.set('success', false)
    this.set('reviewing', false)
  },

  _whoReviews () {
    if (this.person._id === this.conversation.creator) {
      return 'creatorOrMatchingIntentAdmin'
    }
    if (!this.conversation.matchingIntent) {
      return 'causingIntentAdminReview'
    } else {
      // TODO
    }
  },

  // TODO mark review as of success or abortion
  _sendReview () {
    let review = {
      type: 'Review',
      creator: this.person._id,
      as: this._whoReviews(),
      body: this.newReview,
      conversation: this.conversation._id
    }
    if (this.success) {
      // review.collaboration = this.conversation.collaboration._id
      review.success = true
      this.dispatch('addReview', review)
    } else {
      this.dispatch('abortConversation', this.conversation, review)
    }
    this._reset()
  },

  _showNewMessage (conversation, reviewing, editingCollaboration) {
    if (!conversation) return
    return conversation.reviews.length === 0 && !reviewing && !editingCollaboration
  },

  _showNewReview (conversation, canReview, reviewing) {
    return canReview && (reviewing || conversation.reviews.length === 1)
  },

  _reset () {
    this.set('newMessage', '')
    this.set('newReview', '')
    this.set('reviewing', false)
    this.set('editingCollaboration', false)
    this.set('changeTurn', false)
  },

  _showCollaborationBody (reviewing, success) {
    return !reviewing || (reviewing && success)
  },

  _showCollaborationEditor (conversation, reviewing, editingCollaboration) {
    return conversation && this._bothMessaged(conversation) && conversation.reviews.length === 0 && !reviewing && editingCollaboration
  },

  // _disableSaveCollaboration (oldCollaboration, editedCollaborationBody) {
  //   if (!oldCollaboration) {
  //     return editedCollaborationBody === ''
  //   } else {
  //     return !editedCollaborationBody || editedCollaborationBody === oldCollaboration.body
  //   }
  // },

  _toggleCollaborationEditor () {
    this.set('editingCollaboration', !this.editingCollaboration)
  },

  _cancelCollaborationEditing () {
    this._toggleCollaborationEditor()
    this.set('editedCollaboration.body', this.conversation.collaboration.body)
  },

  _showReviewButton (person, conversation, reviewing, editingCollaboration) {
    return this._canReview(person, conversation) && !reviewing && !editingCollaboration && conversation.reviews.length === 0
  },

  _bothMessaged (conversation) {
    return [...new Set(conversation.messages.map(message => message.creator))].length > 1
  },

  _showCollaborationEditButton (conversation, reviewing) {
    return conversation && this._bothMessaged(conversation) && !reviewing && conversation.reviews.length === 0
  },

  // _saveCollaboration () {
    // this.dispatch('saveCollaboration', this.editedCollaboration)
  //   this._toggleCollaborationEditor()
  // },

  _filterNotifications (conversation, notifications) {
    if (!conversation) return []
    return notifications.filter(notification => notification.object === conversation._id)
  },

  _deativateNotifications (notifications) {
    notifications.forEach(notification => {
      notification.active = false
      this.dispatch('saveNotification', notification)
    })
  }
})
