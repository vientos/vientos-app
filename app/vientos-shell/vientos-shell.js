import { ReduxMixin, ActionCreators, util } from '../../src/engine.js'

const importOrganizationEditor = () => {
  import(/* webpackChunkName: "organization-editor" */ '../editors/organization-editor/organization-editor.html')
}
const importIntentEditor = () => {
  import(/* webpackChunkName: "intent-editor" */ '../editors/intent-editor/intent-editor.html')
}

class VientosShell extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(Polymer.Element)) {
  static get is () { return 'vientos-shell' }

  static get actions () {
    return {
      setLanguage: ActionCreators.setLanguage,
      setBoundingBox: ActionCreators.setBoundingBox,
      hello: ActionCreators.hello,
      bye: ActionCreators.bye,
      fetchPerson: ActionCreators.fetchPerson,
      fetchPeople: ActionCreators.fetchPeople,
      fetchPlaces: ActionCreators.fetchPlaces,
      fetchLabels: ActionCreators.fetchLabels,
      fetchCategories: ActionCreators.fetchCategories,
      fetchProjects: ActionCreators.fetchProjects,
      fetchIntents: ActionCreators.fetchIntents,
      fetchCollaborations: ActionCreators.fetchCollaborations,
      fetchReviews: ActionCreators.fetchReviews,
      fetchMyConversations: ActionCreators.fetchMyConversations,
      fetchNotifications: ActionCreators.fetchNotifications,
      saveSubscription: ActionCreators.saveSubscription
    }
  }

  static get properties () {
    return {
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
      places: {
        type: Array,
        statePath: 'places'
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
      notifications: {
        type: Array,
        statePath: 'notifications'
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
      filteredFavorings: {
        type: Boolean,
        statePath: 'filteredFavorings'
      },
      locationFilter: {
        type: String,
        statePath: 'locationFilter'
      },
      mapOf: {
        type: String,
        value: 'projects'
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
      wideScreen: {
        type: Boolean
      },
      showingMap: {
        type: Boolean,
        value: false
      },
      mapButtonVisible: {
        type: Boolean,
        computed: '_mapButtonVisibility(page, wideScreen, showingMap)'
      },
      listButtonVisible: {
        type: Boolean,
        computed: '_listButtonVisibility(page, wideScreen, showingMap)'
      },
      placeInfoButtonVisible: {
        type: Boolean,
        computed: '_placeInfoButtonVisibility(page, wideScreen, showingMap)'
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
      currentPlace: {
        type: Object,
        value: null,
        computed: '_findPlace(routeData.page, subrouteData.id, places)',
        observer: '_setMapView'
      },
      visibleProjects: {
        type: Array,
        value: [],
        computed: '_filterProjects(person, projects, places, intents, filteredCategories, filteredFollowings, filteredFavorings, filteredCollaborationTypes, locationFilter, boundingBoxFilter, boundingBox)'
      },
      visibleIntents: {
        type: Array,
        value: [],
        computed: '_filterIntents(person, intents, visibleProjects, filteredCollaborationTypes, filteredFavorings)' // TODO boundingBox
      },
      visiblePlaces: {
        type: Array,
        value: [],
        computed: '_setVisiblePlaces(page, visibleProjectLocations, visibleIntentLocations)'
      },
      visibleProjectLocations: {
        type: Array,
        value: [],
        computed: '_filterPlaces(visibleProjects, places, boundingBox)'
      },
      visibleIntentLocations: {
        type: Array,
        value: [],
        computed: '_filterPlaces(visibleIntents, places, boundingBox)'
      },
      ourTurnCount: {
        type: Number,
        computed: '_calcOurTurnCount(person, myConversations, intents)'
      },
      availableIntents: {
        type: Array,
        value: [],
        computed: '_avilableIntents(intents)'
      },
      filterActive: {
        type: Boolean,
        computed: '_activeFilter(projects, availableIntents, visibleProjects, visibleIntents)',
        observer: '_highlightBadges'
      },
      language: {
        type: String,
        statePath: 'language'
      },
      resources: {
        type: Object,
        statePath: 'labels'
      },
      lazyPages: {
        type: Object,
        value: {
          'projects': () => {
            import(/* webpackChunkName: "organization-preview" */ '../cards/organization-preview/organization-preview.html')
              .then(() => window.dispatchEvent(new CustomEvent('location-changed')))
          },
          'intents': () => {
            import(/* webpackChunkName: "intent-preview" */ '../cards/intent-preview/intent-preview.html')
              .then(() => window.dispatchEvent(new CustomEvent('location-changed')))
          },
          'search-and-filter': () => {
            import(/* webpackChunkName: "search-and-filter" */ '../pages/search-and-filter/search-and-filter.html')
          },
          'project': () => {
            import(/* webpackChunkName: "organization-details" */ '../pages/organization-details/organization-details.html')
          },
          'edit-project-details': importOrganizationEditor,
          'new-project': importOrganizationEditor,
          'intent': () => {
            import(/* webpackChunkName: "intent-details" */ '../pages/intent-details/intent-details.html')
          },
          'edit-intent': importIntentEditor,
          'new-intent': importIntentEditor,
          'place': () => {
            import(/* webpackChunkName: "place-details" */ '../pages/place-details/place-details.html')
          },
          'me': () => {
            import(/* webpackChunkName: "vientos-inbox" */ '../pages/vientos-inbox/vientos-inbox.html')
          },
          'account': () => {
            import(/* webpackChunkName: "account-settings" */ '../editors/account-settings/account-settings.html')
          },
          'new-conversation': () => {
            import(/* webpackChunkName: "start-conversation" */ '../pages/start-conversation/start-conversation.html')
          },
          'conversation': () => {
            import(/* webpackChunkName: "vientos-conversation" */ '../pages/vientos-conversation/vientos-conversation.html')
          },
          'guide': () => {
            import(/* webpackChunkName: "vientos-guide" */ '../pages/vientos-guide/vientos-guide.html')
          }
        }
      }
    }
  }

  static get observers () {
    return [
      '_routePageChanged(routeData.page)',
      '_handleMapVisibility(page, wideScreen, showingMap)',
      '_footerPageChanged(page)'
    ]
  }

  _filterProjects (...args) { return util.filterProjects(...args) }
  _filterIntents (...args) { return util.filterIntents(...args) }
  _filterPlaces (...args) { return util.filterPlaces(...args) }
  _avilableIntents (...args) { return util.availableIntents(...args) }

  _routePageChanged (page) {
    let selectedPage = page || 'projects'
    this.set('page', selectedPage)
    // if (!['map', 'project'].includes(page)) window.history.replaceState({}, '', `/${page}`)
  }

  _pageChanged (page) {
    // Load page import on demand. Show 404 page if fails
    if (this.lazyPages[page]) {
      this.lazyPages[page]()
    } else {
      // TODO: this._showPage404();
    }
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    this._decorateMeButton(page)
  }

  _hasFooter (page) {
    return ![
      'edit-project-details',
      'new-project',
      'account',
      'new-intent',
      'edit-intent',
      'new-conversation'
    ].includes(page)
  }

  _toggleLanguage (e) {
    if (this.language === 'en') {
      this.dispatch('setLanguage', 'es')
    } else {
      this.dispatch('setLanguage', 'en')
    }
  }

  // _showPage404 () {
  //   this.page = 'view404'
  // }

  _personChanged (person) {
    if (person) {
      this.dispatch('setLanguage', person.language)
      // fetch conversations and update every 60s
      this.dispatch('fetchMyConversations', person)
      setInterval(() => { this.dispatch('fetchMyConversations', person) }, 60000)

      // fetch notifications and update every 60s
      this.dispatch('fetchNotifications', person)
      setInterval(() => { this.dispatch('fetchNotifications', person) }, 60000)

      // setup push notifications
      navigator.serviceWorker.ready.then(registration => {
        return registration.pushManager.getSubscription()
        .then(subscription => {
          if (subscription) return subscription
          return registration.pushManager.subscribe({ userVisibleOnly: true })
        })
      }).then(subscription => {
        let details = JSON.parse(JSON.stringify(subscription))
        this.dispatch('saveSubscription', details, person)
      })
    }
  }

  _findProject (page, projectId, projects) {
    if (Array.from(arguments).includes(undefined)) return null
    if (!['project', 'edit-project-details', 'new-intent'].includes(page)) return null
    return projects.find(project => project._id === util.urlFromId(projectId, 'projects'))
  }

  _findIntent (page, intentId, intents) {
    if (Array.from(arguments).includes(undefined)) return null
    if (!['intent', 'edit-intent', 'new-conversation'].includes(page)) return null
    return intents.find(intent => intent._id === util.urlFromId(intentId, 'intents'))
  }

  _findConversation (page, conversationId, conversations) {
    if (Array.from(arguments).includes(undefined)) return null
    if (page !== 'conversation') return null
    return conversations.find(conversation => conversation._id === util.urlFromId(conversationId, 'conversations'))
  }

  _findPlace (page, placeId, places) {
    if (Array.from(arguments).includes(undefined)) return null
    if (page !== 'place') return null
    return places.find(place => place._id === util.urlFromId(placeId, 'places'))
  }

  _setMapView (place) {
    if (place) {
      this.set('mapView', {
        latitude: place.latitude,
        longitude: place.longitude,
        zoom: 14 // FIXME remove magic number
      })
    }
  }

  _setVisiblePlaces (page, visibleProjectLocations, visibleIntentLocations) {
    if (page === 'place') {
      if (!this.visiblePlaces.length) return visibleProjectLocations
      return this.visiblePlaces
    }
    if (page === 'intents' || page === 'intent') {
      this.set('mapOf', 'intents')
      return visibleIntentLocations
    } else {
      this.set('mapOf', 'projects')
      return visibleProjectLocations
    }
  }

  _updateBoundingBox (e, detail) {
    if (this.page === 'projects' || this.page === 'intents') {
      this.dispatch('setBoundingBox', detail)
    }
  }

  _showMap () {
    this.set('showingMap', true)
    if (this.wideScreen) window.history.replaceState({}, '', window.location.pathname + +'#map')
    else window.history.pushState({}, '', window.location.pathname + '#map')
    window.dispatchEvent(new CustomEvent('location-changed'))
    if (this.currentPlace) this._setMapView(this.currentPlace)
  }

  _showList () {
    this.set('showingMap', false)
    if (this.wideScreen) window.history.replaceState({}, '', window.location.pathname)
    else window.history.pushState({}, '', window.location.pathname)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _mapButtonVisibility (page, wideScreen, showingMap) {
    return !wideScreen && !showingMap &&
      (page === 'projects' || page === 'intents' || page === 'place')
  }

  _listButtonVisibility (page, wideScreen, showingMap) {
    return !wideScreen && showingMap && (page === 'projects' || page === 'intents')
  }

  _placeInfoButtonVisibility (page, wideScreen, showingMap) {
    return !wideScreen && showingMap && (page === 'place')
  }

  _sessionChanged (session) {
    if (session && session.person) {
      this.dispatch('fetchPerson', session.person)
    }
  }

  _bye () {
    this.dispatch('bye', this.session)
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _viewPortWidenessChanged (mediaQueryList) {
    this.set('wideScreen', mediaQueryList.matches)
  }

  _handleMapVisibility (page, wideScreen, showingMap) {
    let vientosMapElement = this.$$('vientos-map')
    let ironPagesElement = this.$$('iron-pages')

    if (wideScreen) {
      ironPagesElement.style.display = 'block'
      if (page === 'intents' || page === 'projects' || page === 'place') {
        vientosMapElement.style.display = 'block'
      } else {
        vientosMapElement.style.display = 'none'
      }
    } else {
      if (page === 'intents' || page === 'projects' || page === 'place') {
        vientosMapElement.style.display = showingMap ? 'block' : 'none'
        ironPagesElement.style.display = showingMap ? 'none' : 'block'
      } else {
        ironPagesElement.style.display = 'block'
        vientosMapElement.style.display = 'none'
      }
    }
  }

  _calcOurTurnCount (person, myConversations, intents) {
    if (Array.from(arguments).includes(undefined)) return 0
    return myConversations.reduce((count, conversation) => {
      return util.ourTurn(person, conversation, intents) ? ++count : count
    }, 0)
  }

  _decorateMeButton (page) {
    if (page === 'me') this.$['menu-button-holder-right'].className = 'selected'
    else this.$['menu-button-holder-right'].className = ''
  }

  _showProfile () {
    window.history.pushState({}, '', '/me')
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _highlightBadges (newVal) {
    let projectsBtn = this.$$('paper-button[name=projects]')
    let intentsBtn = this.$$('paper-button[name=intents]')
    if (projectsBtn && intentsBtn) {
      let projectsBadge = projectsBtn.getElementsByTagName('paper-badge')[0]
      let intentsBadge = intentsBtn.getElementsByTagName('paper-badge')[0]
      if ((newVal && !projectsBtn.className.includes('filtered')) || (!newVal && projectsBtn.className.includes('filtered'))) {
        projectsBtn.toggleClass('filtered')
        intentsBtn.toggleClass('filtered')
        if (projectsBadge) projectsBadge.notifyResize()
        if (intentsBadge) intentsBadge.notifyResize()
        this.updateStyles()
      }
    }
  }

  _activeFilter (projects, availableIntents, visibleProjects, visibleIntents) {
    if (projects && availableIntents && visibleProjects && visibleIntents) {
      return projects.length !== visibleProjects.length || availableIntents.length !== visibleIntents.length
    } else return false
  }

  _footerPageChanged (page) {
    if (['search-and-filter', 'projects', 'intents'].includes(page)) {
      if (page === 'projects' && window.location.pathname === '/') return
      if (page === 'intents' && window.location.pathname === '/intents') return
      let pathname = page === 'projects' ? '/' : `/${page}`
      if (this.showingMap) pathname += '#map'
      window.history.pushState({}, '', pathname)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }

  _locationChanged (e) {
    if (window.location.hash === '#map') this.set('showingMap', true)
    else this.set('showingMap', false)
    // workaround for iron-list rendering issues
    if (this.page === 'projects' || this.page === 'intents') {
      setTimeout(() => {
        let ironList = this.$$(`div[name=${this.page}] iron-list`)
        if (ironList) {
          ironList.dispatchEvent(new CustomEvent('iron-resize'))
        }
      }, 100)
    }
  }

  ready () {
    super.ready()
    import(/* webpackChunkName: "vientos-map" */ '../widgets/vientos-map/vientos-map.html')
    this.dispatch('hello')
    this.dispatch('fetchLabels')
    this.dispatch('fetchCategories')
    this.dispatch('fetchProjects')
    this.dispatch('fetchPlaces')
    this.dispatch('fetchPeople')
    this.dispatch('fetchIntents')
    this.dispatch('fetchReviews')

    let mqWideScreen = window.matchMedia('(min-width: 800px)')
    this.set('wideScreen', mqWideScreen.matches)
    mqWideScreen.onchange = this._viewPortWidenessChanged.bind(this)

    // fetch reviews and update every 60s
    // setInterval(() => { this.dispatch('fetchReviews') }, 60000)

    window.addEventListener('location-changed', this._locationChanged.bind(this))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(VientosShell.is, VientosShell)
