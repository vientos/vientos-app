/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'vientos-intent-page',
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
    collaborations: {
      type: Array,
      statePath: 'collaborations'
    },
    reviews: {
      type: Array,
      statePath: 'reviews'
    },
    intent: {
      type: Object
    },
    conversations: {
      type: Array,
      computed: '_filterIntentConversations(intent, myConversations)'
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    intentProjects: {
      type: Array,
      computed: '_getIntentProjects(intent, projects)'
    },
    admin: {
      type: Boolean,
      computed: '_checkIfAdmin(person, intentProjects)'
    },
    conversationOfCreator: {
      type: Object,
      computed: '_getConversationOfCreator(person, intent, myConversations)'
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

  _checkIfAdmin: util.checkIfAdmin,

  _getIntentProjects: util.getIntentProjects,

  _getRef: util.getRef,

  _filterIntentConversations: util.filterIntentConversations,

  _getConversationOfCreator (person, intent, myConversations) {
    if (!intent) return
    return myConversations.find(conversation => {
      return (conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id) &&
      !conversation.reviews.some(review => review.creator === person._id)
    }) || null
  },

  _editIntent () {
    window.history.pushState({}, '', `/edit-intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _projectPageUrl (project) {
    return util.pathFor(project, 'project')
  },

  _conversationUrl (conversation) {
    return util.pathFor(conversation, 'conversation')
  },

  _startConversation () {
    window.history.pushState({}, '', `/new-conversation/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _conversationsVisible (admin, conversationCreator) {
    return admin || conversationCreator
  },

  _collaborateVisible (admin, conversationOfCreator) {
    return !admin && !conversationOfCreator
  },

  _getConversationCreatorName (personId, people) {
    return util.getRef(personId, people).name
  },

  _reviewsOfCollaboration (collaboration, reviews) {
    return reviews.filter(review => review.collaboration === collaboration._id)
  },

  _reviewsOfAbortedConversations (intent, reviews) {
    if (!intent) return []
    return intent.abortedConversations.map(conversationId => {
      return reviews.filter(review => review.conversation === conversationId)
    })
  }
})
