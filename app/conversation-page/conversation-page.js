/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'conversation-page',

  actions: {
    addMessage: ActionCreators.addMessage,
    addReview: ActionCreators.addReview,
    saveCollaboration: ActionCreators.saveCollaboration
  },

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    conversation: {
      type: Object,
      observer: '_setEditedCollaboration'
    },
    editedCollaborationBody: {
      type: String
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
    newMessage: {
      type: String,
      value: ''
    },
    newReview: {
      type: String,
      value: ''
    },
    reviewing: {
      type: Boolean,
      value: false
    },
    canReview: {
      type: Boolean,
      value: false,
      computed: '_canReview(person, conversation)'
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

  _getCausingIntent (conversation, intents) {
    if (conversation) return util.getRef(conversation.causingIntent, intents)
  },

  _getMatchingIntent (conversation, intents) {
    if (conversation) return util.getRef(conversation.matchingIntent, intents)
  },

  _setEditedCollaboration (conversation) {
    if (!conversation.collaboration) {
      this.set('conversation.collaboration', {
        _id: util.mintUrl({ type: 'Collaboration' }),
        type: 'Collaboration',
        body: '',
        conversation: conversation._id
      })
    }
    this.set('editedCollaborationBody', conversation.collaboration.body)
  },

  _sendMessage () {
    this.dispatch('addMessage', {
      type: 'Message',
      creator: this.person._id,
      body: this.newMessage,
      conversation: this.conversation._id
    })
    this._reset()
  },

  _canReview (person, conversation) {
    // no reviews
    if (conversation.reviews.length === 0) return true
    // you created conversation and didn't review yet
    if (conversation.creator === person._id &&
        !conversation.reviews.find(review => review.as === 'creatorOrMatchingIntentAdmin')) return true
    if (!conversation.matchingIntent) {
      // you admin the causingIntent, and no review yet
      if (conversation.creator !== person._id &&
          !conversation.reviews.find(review => review.as === 'causingIntentAdmin')) return true
    } else {
      // TODO
      // you team member created conversation with matching intent, no review yet
      // you created conversation with matching intent, but already reviewed by your team member
      // you are admion of projects from both intents
    }
    return false
  },

  _startReview () {
    this.set('reviewing', true)
  },
  _abortReview () {
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

  _sendReview () {
    this.dispatch('addReview', {
      type: 'Review',
      creator: this.person._id,
      as: this._whoReviews(),
      body: this.newReview,
      conversation: this.conversation._id
    })
    this._reset()
    this.set('reviewing', true)
  },

  _showNewMessage (conversation, reviewing) {
    return conversation.reviews.length === 0 && !reviewing
  },

  _showNewReview (conversation, canReview, reviewing) {
    return canReview && (reviewing || conversation.reviews.length > 0)
  },

  _reset () {
    this.set('newMessage', '')
    this.set('newReview', '')
  },

  ready () {
    window.foo = this
  },

  _showCollaborationEditor (conversation, reviewing, editingCollaboration) {
    let bothMessaged = [...new Set(conversation.messages.map(message => message.creator))].length > 1
    return bothMessaged && conversation.reviews.length === 0 && !reviewing && editingCollaboration
  },

  _disableSaveCollaboration (oldCollaboration, editedCollaborationBody) {
    return !editedCollaborationBody || editedCollaborationBody === oldCollaboration.body
  },

  _toggleCollaborationEditor () {
    this.set('editingCollaboration', !this.editingCollaboration)
  },

  _cancelCollaborationEditing () {
    this._toggleCollaborationEditor()
    this.set('editedCollaborationBody', this.conversation.collaboration.body)
  },

  _showReviewButton (reviewing, editingCollaboration) {
    return !reviewing && !editingCollaboration
  },

  _saveCollaboration () {
    this.conversation.collaboration.body = this.editedCollaborationBody
    this.dispatch('saveCollaboration', this.conversation.collaboration)
    this._toggleCollaborationEditor()
  }

})
