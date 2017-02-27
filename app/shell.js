/* global Polymer, ReduxBehavior */

const store = window.vientos.store
const ActionTypes = window.vientos.ActionTypes
const util = window.vientos.util

Polymer({

  is: 'vientos-shell',

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    setLanguage (language) {
      return {
        type: ActionTypes.SET_LANGUAGE,
        language: language
      }
    },
    setBoundingBox (boundingBox) {
      return {
        type: ActionTypes.SET_BOUNDING_BOX,
        boundingBox
      }
    }
  },

  properties: {
    config: {
      type: Object,
      value: window.vientos.config
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
    categories: {
      type: Array,
      statePath: 'categories'
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    boundingBox: {
      type: Object,
      statePath: 'boundingBox'
    },
    mapView: {
      type: Object
    },
    visibleProjects: {
      type: Array,
      value: [],
      computed: '_filterProjects(projects, categories, collaborationTypes, boundingBox)'
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

      case 'collaborations':
        viewUrl = 'collaborations'
        break

      case 'projects':
        viewUrl = 'projects'
        break

      case 'map':
        viewUrl = 'map'
        break

      case 'filter':
        viewUrl = 'filter'
        break

      case 'me':
        viewUrl = 'me'
        break

      case 'project':
        viewUrl = 'project-profile'
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

  _filterProjects: util.filterProjects,

  _extractLocations: util.extractLocations,

  _updateBoundingBox (e, detail) {
    if (this.page === 'map') {
      this.dispatch('setBoundingBox', detail)
    }
  },

  _toggleDrawer () {
    this.$$('app-drawer').toggle()
  },

  ready () {
    // TODO define actions and use this.store instead
    store.dispatch({type: ActionTypes.HELLO_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_LABELS_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_CATEGORIES_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_PROJECTS_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_INTENTS_REQUESTED})
  }

})
