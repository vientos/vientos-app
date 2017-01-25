const store = window.vientos.store
const ActionTypes = window.vientos.ActionTypes
const ReduxBehavior = PolymerRedux(store)
const locationsInBoundingBox = window.vientos.util.locationsInBoundingBox
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
    account: {
      type: Object,
      statePath: 'account',
      observer: '_accountChanged'
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
    '_routePageChanged(routeData.page)'
  ],

  _routePageChanged (page) {
    this.page = page || 'projects'
  },

  _pageChanged (page) {
    this.set('routeData.page', page)
      // Load page import on demand. Show 404 page if fails
    var viewUrl
    switch (page) {

      case 'projects':
        viewUrl = 'projects'
        break

      case 'map':
        viewUrl = 'map'
        break

      case 'filter':
        viewUrl = 'filter'
        break

      case 'login':
        viewUrl = 'login'
        break

      case 'project-profile':
        viewUrl = 'project-profile'
        break

    }

    viewUrl += '.html'

    var resolvedPageUrl = this.resolveUrl(viewUrl)
    this.importHref(resolvedPageUrl, null, this._showPage404, true)
  },

  _accountChanged () {
    this.set('routeData.page', 'projects')
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

  _filterProjects (projects, categories, collaborationTypes, boundingBox) {
    let filtered
    // filter on categories
    if (categories.every(f => !f.selected)) {
      filtered = projects.slice()
    } else {
      filtered = projects.filter(project => {
        return project.categories.some(category => {
          return categories.some(filter => {
            return filter.selected && filter.id === category.catId
          })
        })
      })
    }
    // filter on collaboration types
    if (!collaborationTypes.every(filter => !filter.selected)) {
      filtered = filtered.filter(project => {
        return project.needs.concat(project.offers).some(intent => {
          return collaborationTypes.some(filter => {
            return filter.selected && filter.id === intent.type
          })
        })
      })
    }
    // filter by bounding box
    return filtered.filter(project => {
      return locationsInBoundingBox(project, boundingBox).length > 0
    })
  },

  _extractLocations (visibleProjects, boundingBox) {
    return visibleProjects.reduce((acc, project) => {
      return acc.concat(locationsInBoundingBox(project, boundingBox))
    }, [])
  },

  _projectSelected (e, detail) {
    this.set('route.path', '/project-profile/' + detail)
  },

  _updateBoundingBox (e, detail) {
    this.dispatch('setBoundingBox', detail)
  },

  ready () {
    // TODO define actions and use this.store instead
    store.dispatch({type: ActionTypes.FETCH_LABELS_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_CATEGORIES_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED})
    store.dispatch({type: ActionTypes.FETCH_PROJECTS_REQUESTED})
  }

})
