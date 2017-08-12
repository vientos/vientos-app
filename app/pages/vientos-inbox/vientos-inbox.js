/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent, util */

Polymer({
  is: 'vientos-inbox',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    bye: ActionCreators.bye
  },

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    myProjects: {
      type: Array,
      computed: '_filterMyProjects(person, projects)'
    },
    activeIntents: {
      type: Array,
      computed: '_filterActiveIntents(person, intents, myConversations, notifications)'
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    notifications: {
      type: Array,
      statePath: 'notifications'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    loginProviders: {
      type: String,
      statePath: 'loginProviders'
    },
    session: {
      type: Object,
      statePath: 'session'
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

  _filterActiveIntents: util.filterActiveIntents,
  _filterIntentConversations: util.filterIntentConversations,
  _getThumbnailUrl: util.getThumbnailUrl,

  _editProfile () {
    window.history.pushState({}, '', `/edit-my-profile/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _showProjectProfile (e) {
    window.history.pushState({}, '', util.pathFor(e.model.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _projectUrl (project) {
    return util.pathFor(project, 'project')
  },

  _bye () {
    this.dispatch('bye', this.session)
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _addProject () {
    window.history.pushState({}, '', `/new-project`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _filterMyProjects (person, projects) {
    if (person) return projects.filter(project => project.admins.includes(this.person._id))
  }

})
