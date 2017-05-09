/* global Polymer, ReduxBehavior, CustomEvent */

const ActionCreators = window.vientos.ActionCreators
const util = window.vientos.util

Polymer({

  is: 'vientos-shell',

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    setLanguage: ActionCreators.setLanguage,
    setBoundingBox: ActionCreators.setBoundingBox,
    hello: ActionCreators.hello,
    bye: ActionCreators.bye,
    fetchPerson: ActionCreators.fetchPerson,
    fetchPeople: ActionCreators.fetchPeople,
    fetchLabels: ActionCreators.fetchLabels,
    fetchCategories: ActionCreators.fetchCategories,
    fetchCollaborationTypes: ActionCreators.fetchCollaborationTypes,
    fetchProjects: ActionCreators.fetchProjects,
    fetchIntents: ActionCreators.fetchIntents,
    fetchMyConversations: ActionCreators.fetchMyConversations
  },

  properties: {
    config: {
      type: Object,
      value: window.vientos.config
    },
    session: {
      type: Object,
      statePath: 'session',
      observer: '_sessionChanged'
    },
    page: {
      type: String,
      reflectToAttribute: true,
      observer: '_pageChanged'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    person: {
      type: Object,
      statePath: 'person',
      observer: '_personChanged'
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    filteredCategories: {
      type: Array,
      statePath: 'filteredCategories'
    },
    filteredCollaborationTypes: {
      type: Array,
      statePath: 'filteredCollaborationTypes'
    },
    filteredFollowings: {
      type: Boolean,
      statePath: 'filteredFollowings'
    },
    locationFilter: {
      type: String,
      statePath: 'locationFilter'
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    boundingBox: {
      type: Object,
      statePath: 'boundingBox'
    },
    boundingBoxFilter: {
      type: Boolean,
      statePath: 'boundingBoxFilter'
    },
    mapView: {
      type: Object
    },
    mapButtonVisible: {
      type: Boolean,
      computed: '_mapButtonVisibility(page, locationFilter)'
    },
    currentProject: {
      type: Object,
      value: null,
      computed: '_findProject(routeData.page, subrouteData.id, projects)'
    },
    currentIntent: {
      type: Object,
      value: null,
      computed: '_findIntent(routeData.page, subrouteData.id, intents)'
    },
    currentConversation: {
      type: Object,
      value: null,
      computed: '_findConversation(routeData.page, subrouteData.id, myConversations)'
    },
    visibleProjects: {
      type: Array,
      value: [],
      computed: '_filterProjects(person, projects, intents, filteredCategories, filteredFollowings, filteredCollaborationTypes, locationFilter, boundingBoxFilter, boundingBox)'
    },
    visibleIntents: {
      type: Array,
      value: [],
      computed: '_filterIntents(intents, visibleProjects, filteredCollaborationTypes)' // TODO boundingBox
    },
    visibleLocations: {
      type: Array,
      value: [],
      computed: '_extractLocations(visibleProjects, boundingBox)'
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

  observers: [
    '_routePageChanged(routeData.page)',
    '_queryChanged(query)'
  ],

  _routePageChanged (page) {
    let selectedPage = page || 'projects'
    this.set('page', selectedPage)
    // if (!['map', 'project'].includes(page)) window.history.replaceState({}, '', `/${page}`)
  },

  _queryChanged (query) {
    if (query.zoom) {
      this.set('mapView', {
        latitude: Number(query.latitude),
        longitude: Number(query.longitude),
        zoom: Number(query.zoom)
      })
    }
  },

  _pageChanged (page) {
    // Load page import on demand. Show 404 page if fails
    var viewUrl
    switch (page) {
      case 'intents':
        viewUrl = '../vientos-collaborations/vientos-collaborations'
        break

      case 'projects':
        viewUrl = '../vientos-projects/vientos-projects'
        break

      case 'map':
        viewUrl = '../vientos-map/vientos-map'
        break

      case 'filter':
        viewUrl = '../vientos-filter/vientos-filter'
        break

      case 'me':
        viewUrl = '../vientos-me/vientos-me'
        break

      case 'project':
        viewUrl = '../vientos-project-profile/vientos-project-profile'
        break

      case 'intent':
        viewUrl = '../vientos-intent-page/vientos-intent-page'
        break

      case 'edit-intent':
        viewUrl = '../vientos-intent-editor/vientos-intent-editor'
        break

      case 'new-intent':
        viewUrl = '../vientos-intent-editor/vientos-intent-editor'
        break

      case 'edit-project-details':
        viewUrl = '../vientos-edit-project-details/vientos-edit-project-details'
        break

      case 'edit-my-profile':
        viewUrl = '../personal-profile-editor/personal-profile-editor'
        break

      case 'new-conversation':
        viewUrl = '../start-conversation/start-conversation'
        break

      case 'conversation':
        viewUrl = '../conversation-page/conversation-page'
        break
    }

    viewUrl += '.html'

    var resolvedPageUrl = this.resolveUrl(viewUrl)
    this.importHref(resolvedPageUrl, null, this._showPage404, true)
  },

  _toggleLanguage (e) {
    if (this.language === 'en') {
      this.dispatch('setLanguage', 'es')
    } else {
      this.dispatch('setLanguage', 'en')
    }
  },

  _showPage404 () {
    this.page = 'view404'
  },

  _personChanged (person) {
    if (person) {
      this.dispatch('fetchMyConversations', person)
    }
  },

  _findProject (page, projectId, projects) {
    if (page !== 'project' && page !== 'edit-project-details' && page !== 'new-intent') return null
    return projects.find(project => project._id === util.urlFromId(projectId, 'projects'))
  },

  _findIntent (page, intentId, intents) {
    if (page !== 'intent' && page !== 'edit-intent' && page !== 'new-conversation') return null
    return intents.find(intent => intent._id === util.urlFromId(intentId, 'intents'))
  },

  _findConversation (page, conversationId, conversations) {
    if (page !== 'conversation') return null
    return conversations.find(conversation => conversation._id === util.urlFromId(conversationId, 'conversations'))
  },

  _filterProjects: util.filterProjects,

  _filterIntents: util.filterIntents,

  _extractLocations: util.extractLocations,

  _updateBoundingBox (e, detail) {
    if (this.page === 'map') {
      this.dispatch('setBoundingBox', detail)
    }
  },

  _toggleDrawer () {
    this.$$('app-drawer').toggle()
  },

  _showMap () {
    window.history.pushState({}, '', '/map')
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _mapButtonVisibility (page, locationFilter) {
    return page === 'projects' && locationFilter !== 'city'
  },

  _sessionChanged (session) {
    if (session && session.person) {
      this.dispatch('fetchPerson', session.person)
    }
  },

  _bye () {
    this.dispatch('bye', this.session)
    this.$$('app-drawer').toggle()
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  ready () {
    this.dispatch('hello')
    this.dispatch('fetchLabels')
    this.dispatch('fetchCategories')
    this.dispatch('fetchCollaborationTypes')
    this.dispatch('fetchProjects')
    this.dispatch('fetchPeople')
    this.dispatch('fetchIntents')
  }

})
