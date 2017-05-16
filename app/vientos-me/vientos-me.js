/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent, util */

Polymer({
  is: 'vientos-me',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    bye: ActionCreators.bye,
    saveProject: ActionCreators.saveProject
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
      computed: '_filterActiveIntents(person, intents, myConversations)'
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    newProjectName: {
      type: String,
      value: ''
    },
    addingNewProject: {
      type: Boolean,
      value: false
    },
    login: {
      type: String,
      value: () => { return window.vientos.login }
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

  _editProfile () {
    window.history.pushState({}, '', `/edit-my-profile/`)
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

  _startAddingProject () {
    this.set('addingNewProject', true)
  },

  _cancelAddingProject () {
    this.set('newProjectName', '')
    this.set('addingNewProject', false)
  },

  _crateProject () {
    this.dispatch('saveProject', {
      _id: util.mintUrl({ type: 'Project' }),
      name: this.newProjectName,
      type: 'Project',
      admins: [this.person._id]
    })
    this.set('newProjectName', '')
    this.set('addingNewProject', false)
  },

  _filterMyProjects (person, projects) {
    if (person) return projects.filter(project => project.admins.includes(this.person._id))
  },

  _filterActiveIntents: util.filterActiveIntents

})
