/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, util */

Polymer({
  is: 'vientos-project-profile',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    follow: ActionCreators.follow,
    unfollow: ActionCreators.unfollow
  },

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    admin: {
      type: Boolean,
      value: false,
      computed: '_checkIfAdmin(person, project)'
    },
    followed: {
      type: Boolean,
      computed: '_checkIfFollows(person, project)'
    },
    projectId: {
      type: String
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    project: {
      type: Object,
      computed: '_findProject(projectId, projects)'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    intent: {
      type: Object,
      value: {}
    },
    offers: {
      type: Array,
      value: [],
      computed: '_filterOffers(project, intents)'
    },
    requests: {
      type: Array,
      value: [],
      computed: '_filterRequests(project, intents)'
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

  _findProject (projectId, projects) {
    return projects.find(p => p._id === this.projectId)
  },

  _checkIfFollows: util.checkIfFollows,

  _checkIfAdmin: util.checkIfAdmin,

  _filterOffers: util.filterProjectOffers,

  _filterRequests: util.filterProjectRequests,

  _follow () {
    this.dispatch('follow', this.person, this.project)
  },

  _unfollow () {
    this.dispatch('unfollow', this.person, this.project)
  },

  _editIntent (e) {
    this.set('intent', e.model.item)
  },

  _resetIntent () {
    this.set('intent', {})
  },

  _showLocationOnMap (e) {
    let location = e.model.location
    window.history.pushState({}, '', `/map?latitude=${location.latitude}&longitude=${location.longitude}&zoom=15`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
