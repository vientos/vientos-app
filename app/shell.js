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
    page: {
      type: String,
      reflectToAttribute: true,
      observer: '_pageChanged'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    categoriesFilter: {
      type: Array,
      statePath: 'categoriesFilter'
    },
    collaborationTypesFilter: {
      type: Array,
      statePath: 'collaborationTypesFilter'
    },
    boundingBox: {
      type: Object,
      statePath: 'boundingBox'
    },
    visibleProjects: {
      type: Array,
      value: [],
      computed: '_filterProjects(projects, categoriesFilter, collaborationTypesFilter, boundingBox)'
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

      case 'project-profile':
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

  _filterProjects (projects, categoriesFilter, collaborationTypesFilter, boundingBox) {
    let filtered
    // filter on categories
    if (categoriesFilter.every(f => !f.selected)) {
      filtered = projects.slice()
    } else {
      filtered = projects.filter(project => {
        return project.categories.some(category => {
          return categoriesFilter.some(filter => {
            return filter.selected && filter.categoryId === category.catId
          })
        })
      })
    }
    // filter on collaboration types
    if (!collaborationTypesFilter.every(filter => !filter.selected)) {
      filtered = filtered.filter(project => {
        return project.needs.concat(project.offers).some(intent => {
          return collaborationTypesFilter.some(filter => {
            return filter.selected && filter.collaborationTypeId === intent.type
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
