let ReduxBehavior = PolymerRedux(window.store)
Polymer({
  is: 'vientos-shell',
  behaviors: [ ReduxBehavior ],
  actions: {
    setLanguage (language) {
      return {
        type: 'SET_LANGUAGE',
        language: language
      }
    }
  },

  properties: {
    page: {
      type: String,
      reflectToAttribute: true,
      observer: '_pageChanged'
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

      case 'activities':
        viewUrl = 'activities'
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
    if (e.target.checked) {
      this.dispatch('setLanguage', 'es')
    } else {
      this.dispatch('setLanguage', 'en')
    }
  },

  _showPage404 () {
    this.page = 'view404'
  },

  _projectSelected (e, detail) {
    this.set('route.path', '/project-profile/' + detail)
  },

  ready () {
    window.store.dispatch({type: 'FETCH_LABELS_REQUESTED'})
    window.store.dispatch({type: 'FETCH_CATEGORIES_REQUESTED'})
    window.store.dispatch({type: 'FETCH_COLLABORATION_TYPES_REQUESTED'})
    window.store.dispatch({type: 'FETCH_PROJECTS_REQUESTED'})
  }

})
