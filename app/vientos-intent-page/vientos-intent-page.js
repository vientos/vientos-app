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

  _editIntent () {
    window.history.pushState({}, '', `/edit-intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _projectPageUrl (project) {
    return util.pathFor(project, 'project')
  },

  _startConversation () {
    window.history.pushState({}, '', `/new-conversation/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
