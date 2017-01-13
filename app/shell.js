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

      case 'view3':
        viewUrl = 'my-view3'
        break

      case 'fakedataview':
        viewUrl = 'fake-data-view'
        break

    }

    viewUrl += '.html'

    var resolvedPageUrl = this.resolveUrl(viewUrl)
    this.importHref(resolvedPageUrl, null, this._showPage404, true)
  },

  _toggleLanguage (e) {
    console.log(e.target)
    if (e.target.checked) {
      this.dispatch('setLanguage', 'es')
    } else {
      this.dispatch('setLanguage', 'en')
    }
  },

  _showPage404 () {
    this.page = 'view404'
  },

  ready () {
    window.store.dispatch({type: 'FETCH_LABELS_REQUESTED'})
    window.store.dispatch({type: 'FETCH_CATEGORIES_REQUESTED'})
    window.store.dispatch({type: 'FETCH_COLLABORATION_TYPES_REQUESTED'})
    window.store.dispatch({type: 'FETCH_PROJECTS_REQUESTED'})
  }

})
