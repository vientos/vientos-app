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
      type: Boolean,
      value: false,
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
    places: {
      type: Array,
      statePath: 'places'
    },
    potentialAdmins: {
      type: Array,
      computed: '_getPotentialAdmins(project, people)'
    },
    newAdmin: {
      type: String,
      value: null
    },
    addingNewAdmin: {
      type: Boolean,
      value: false
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

  _getPlaceAddress: util.getPlaceAddress,

  _intentPageUrl (intent) {
    return util.pathFor(intent, 'intent')
  },

  _back () {
    util.back('/projects')
  },

  _canFollow (person, admin) {
    return person && !admin
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

  _startAddingAdmin () {
    this.set('addingNewAdmin', true)
  },

  _cancelAddingAdmin () {
    this.set('addingNewAdmin', false)
  },

  _setNewAdmin (e, detail) {
    this.set('newAdmin', detail.item.name)
  },

  _addNewAdmin () {
    this.project.admins = [...new Set([...this.project.admins, this.newAdmin])]
    this.dispatch('saveProject', this.project)
    this.set('addingNewAdmin', false)
  },

  _showLocationOnMap (e) {
    let place = util.getRef(e.model.placeId, this.places)
    window.history.pushState({}, '', `/map?latitude=${place.latitude}&longitude=${place.longitude}&zoom=15`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
})
