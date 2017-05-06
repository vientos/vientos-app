/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'vientos-intent-page',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    person: {
      type: Object,
      statePath: 'person'
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
    conversationCreator: {
      type: Boolean,
      computed: '_checkIfConversationCreator(person, intent, myConversations)'
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

  _checkIfConversationCreator: util.checkIfConversationCreator,

  _getIntentProjects: util.getIntentProjects,

  _getRef: util.getRef,

  _filterIntentConversations: util.filterIntentConversations,

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

  _collaborateVisible (admin, conversationCreator) {
    return !admin && !conversationCreator
  }
})
