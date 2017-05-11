/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, util */

Polymer({
  is: 'vientos-project-profile',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    follow: ActionCreators.follow,
    unfollow: ActionCreators.unfollow,
    saveProject: ActionCreators.saveProject
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
    following: {
      type: Object,
      value: null,
      computed: '_checkIfFollows(person, project)'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    people: {
      type: Array,
      statePath: 'people'
    },
    potentialAdmins: {
      type: Array,
      computed: '_getPotentialAdmins(project, people)'
    },
    newAdmin: {
      type: String,
      value: null
    },
    project: {
      // passed from parent
      type: Object
    },
    intents: {
      type: Array,
      statePath: 'intents'
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

  _checkIfFollows: util.checkIfFollows,

  _checkIfAdmin: util.checkIfAdmin,

  _filterOffers: util.filterProjectOffers,

  _filterRequests: util.filterProjectRequests,

  _getRef: util.getRef,

  _intentPageUrl (intent) {
    return util.pathFor(intent, 'intent')
  },

  _follow () {
    this.dispatch('follow', this.person, this.project)
  },

  _unfollow () {
    this.dispatch('unfollow', this.following)
  },

  _editDetails () {
    window.history.pushState({}, '', `/edit-project-details/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _newIntent () {
    window.history.pushState({}, '', `/new-intent/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _getPotentialAdmins (project, people) {
    if (!project) return []
    return people.filter(person => !project.admins.includes(person._id))
  },

  _setNewAdmin (e, detail) {
    this.set('newAdmin', detail.item.name)
  },

  _addNewAdmin () {
    this.project.admins = [...new Set([...this.project.admins, this.newAdmin])]
    this.dispatch('saveProject', this.project)
  },

  _showLocationOnMap (e) {
    let location = e.model.location
    window.history.pushState({}, '', `/map?latitude=${location.latitude}&longitude=${location.longitude}&zoom=15`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
