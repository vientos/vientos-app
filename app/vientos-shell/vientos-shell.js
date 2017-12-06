/* global EventSource */
import { ReduxMixin, ActionCreators, util, channelUrl, config } from '../../src/engine.js'

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
      setLabels: ActionCreators.setLabels,
      setOnline: ActionCreators.setOnline,
      setBoundingBox: ActionCreators.setBoundingBox,
      updateSearchTerm: ActionCreators.updateSearchTerm,
      enablePersonalFilter: ActionCreators.enablePersonalFilter,
      disablePersonalFilter: ActionCreators.disablePersonalFilter,
      hello: ActionCreators.hello,
      bye: ActionCreators.bye,
      fetchPerson: ActionCreators.fetchPerson,
      fetchPeople: ActionCreators.fetchPeople,
      fetchPlaces: ActionCreators.fetchPlaces,
      fetchCategories: ActionCreators.fetchCategories,
      fetchProjects: ActionCreators.fetchProjects,
      fetchIntents: ActionCreators.fetchIntents,
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
        statePath: 'myConversations',
        observer: '_resizeIntentsList'
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
      personalFilter: {
        type: Boolean,
        statePath: 'personalFilter'
      },
      locationFilter: {
        type: String,
        statePath: 'locationFilter'
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
      geoTag: {
        type: String,
        value: config.map.name
      },
      toast: {
        type: String,
        statePath: 'toast',
        observer: '_showToast'
      },
      wideScreen: {
        type: Boolean
      },
      showingMap: {
        type: Boolean,
        value: false
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
        computed: '_findPlace(query.place, places)'
      },
      visibleProjects: {
        type: Array,
        value: [],
        computed: '_filterProjects(person, projects, places, intents, personalFilter, filteredCategories, currentPlace, boundingBox, searchTerm, projectsIndex)'
      },
      visibleIntents: {
        type: Array,
        value: [],
        computed: '_filterIntents(person, intents, projects, places, myConversations, notifications, reviews, personalFilter, filteredCollaborationTypes, currentPlace, boundingBox, searchTerm, intentsIndex)'
      },
      visiblePlaces: {
        type: Array,
        value: [],
        computed: '_setVisiblePlaces(places, boundingBox)'
      },
      reviews: {
        type: Array,
        statePath: 'reviews'
      },
      availableIntents: {
        type: Array,
        value: [],
        computed: '_availableIntents(intents)'
      },
      filterActive: {
        type: Boolean,
        computed: '_activeFilter(filteredCategories, filteredCollaborationTypes)'
      },
      searchTerm: {
        type: String,
        statePath: 'searchTerm'
      },
      newSearchTerm: {
        type: String,
        value: null,
        observer: '_search'
      },
      lunr: {
        type: Object,
        value: null
      },
      projectsIndex: {
        type: Object,
        value: null
      },
      intentsIndex: {
        type: Object,
        value: null
      },
      language: {
        type: String,
        statePath: 'language'
      },
      resources: {
        type: Object,
        statePath: 'labels'
      },
      publicChannel: {
        type: Object
      },
      privateChannel: {
        type: Object
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
            import(/* webpackChunkName: "organization-profile" */ '../pages/organization-profile/organization-profile.html')
          },
          'edit-project-details': importOrganizationEditor,
          'new-project': importOrganizationEditor,
          'intent': () => {
            import(/* webpackChunkName: "intent-details" */ '../pages/intent-details/intent-details.html')
          },
          'edit-intent': importIntentEditor,
          'new-intent': importIntentEditor,
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
          'review': () => {
            import(/* webpackChunkName: "review-editor" */ '../editors/review-editor/review-editor.html')
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
      '_updateGeoTag(currentPlace, boundingBox)',
      '_handleMapVisibility(page, wideScreen, showingMap)',
      '_indexProjects(lunr, projects)',
      '_indexIntents(lunr, intents)'
    ]
  }

  _filterProjects (...args) { return util.filterProjects(...args) }
  _filterIntents (...args) { return util.filterIntents(...args) }
  _filterPlaces (...args) { return util.filterPlaces(...args) }
  _availableIntents (...args) { return util.availableIntents(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }
  _filterIntentConversations (...args) { return util.filterIntentConversations(...args) }

  _routePageChanged (page) {
    this.set('page', page || 'guide')
    if (!page) {
      window.history.replaceState({}, '', `/${this.page}`)
    }
  }

  _pageChanged (page) {
    // Load page import on demand. Show 404 page if fails
    if (this.lazyPages[page]) {
      this.lazyPages[page]()
    } else {
      // TODO: this._showPage404();
    }
    if (['intents', 'projects'].includes(page)) this.set('footerPage', page)
    if (page === 'place') {
      this.set('page', 'intents')
    }
    // clear subrouteData.id
    if (!['project', 'new-project', 'edit-project-details', 'intent', 'new-intent', 'edit-intent', 'place', 'conversation', 'new-conversation', 'review'].includes(page)) {
      delete this.subrouteData.id
    }
    this.$$('app-header-layout').notifyResize()
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  _hasFooter (page) {
    return [
      'projects',
      'intents',
      'menu',
      'search-and-filter'
    ].includes(page)
  }

  _toggleLanguage (e) {
    if (this.language === 'en') {
      this.dispatch('setLanguage', 'es')
    } else {
      this.dispatch('setLanguage', 'en')
    }
  }

  _togglePersonalFilter (e) {
    let vientosMapElement = this.$$('vientos-map')
    if (vientosMapElement) vientosMapElement._showFullZoom()
    if (this.personalFilter) this.dispatch('disablePersonalFilter')
    else this.dispatch('enablePersonalFilter')
  }

  // _showPage404 () {
  //   this.page = 'view404'
  // }

  _personChanged (person) {
    if (person) {
      this.dispatch('setLanguage', person.language)

      this._fetchProtectedData()
      this.privateChannel = new EventSource(channelUrl(person._id), { withCredentials: true })
      this.privateChannel.addEventListener('notification', this._fetchUpdates.bind(this))

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
    } else {
      if (this.privateChannel) {
        this.privateChannel.removeEventListener('notification', this._fetchUpdates.bind(this))
        this.privateChannel.close()
        this.set('privateChannel', null)
      }
    }
  }

  _findProject (page, projectCuid, projects) {
    if (Array.from(arguments).includes(undefined) || !projects.length) return null
    if (!['project', 'edit-project-details', 'new-intent'].includes(page)) return null
    try {
      return util.getRef(projectCuid, projects)
    } catch (e) {
      return null
    }
  }

  _findIntent (page, intentCuid, intents) {
    if (Array.from(arguments).includes(undefined) || !intents.length) return null
    if (!['intent', 'edit-intent', 'new-conversation'].includes(page)) return null
    try {
      return util.getRef(intentCuid, intents)
    } catch (e) {
      return null
    }
  }

  _findConversation (page, conversationCuid, conversations) {
    if (Array.from(arguments).includes(undefined) || !conversations.length) return null
    if (!['conversation', 'review'].includes(page)) return null
    try {
      return util.getRef(conversationCuid, conversations)
    } catch (e) {
      return null
    }
  }

  _findPlace (placeId, places) {
    if (Array.from(arguments).includes(undefined) || !places.length) return null
    if (!['intents', 'projects'].includes(this.page)) return null
    try {
      let place = util.getRef(placeId, places)
      this._setMapView(place)
      return place
    } catch (e) {
      return null
    }
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

  _setVisiblePlaces (places, boundingBox) {
    if (Array.from(arguments).includes(undefined)) return []
    return places.filter(place => util.inBoundingBox(place, boundingBox))
  }

  _updateBoundingBox (e, detail) {
    if (this.showingMap) {
      this.dispatch('setBoundingBox', detail)
    }
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
      if (page === 'intents' || page === 'projects' || page === 'search-and-filter') {
        vientosMapElement.style.display = 'block'
      } else {
        vientosMapElement.style.display = 'none'
      }
    } else {
      if (page === 'intents' || page === 'projects' || page === 'search-and-filter') {
        vientosMapElement.style.display = showingMap ? 'block' : 'none'
        ironPagesElement.style.display = showingMap ? 'none' : 'block'
      } else {
        ironPagesElement.style.display = 'block'
        vientosMapElement.style.display = 'none'
      }
    }
  }

  _activeFilter (filteredCategories, filteredCollaborationTypes) {
    return filteredCategories && filteredCollaborationTypes && filteredCategories.length && filteredCollaborationTypes.length
  }

  _showMap () {
    if (this.currentPlace) {
      window.history.pushState({}, '', `${this.page}?place=${this.currentPlace._id}#map`)
    } else {
      window.history.pushState({}, '', `${this.page}#map`)
    }
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _goToList (page) {
    if (this.currentPlace) {
      window.history.pushState({}, '', `${page}?place=${this.currentPlace._id}`)
    } else {
      window.history.pushState({}, '', `${page}`)
    }
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showIntentList () {
    this.set('page', 'intents')
    this._goToList(this.page)
  }

  _showProjectList () {
    this.set('page', 'projects')
    this._goToList(this.page)
  }

  _updateGeoTag (place, boundingBox) {
    let map = this.$$('vientos-map')
    if (!map.latitude || // map still loading
        (Math.abs(map.latitude - config.map.latitude) <= 0.002 &&
        Math.abs(map.longitude - config.map.longitude) <= 0.002 &&
        Math.abs(map.zoom - config.map.zoom) <= 0.002)) {
      if (place) this.set('geoTag', place.address)
      else this.set('geoTag', config.map.name)
    } else {
      // TODO: check if on my current position
      if (place) {
        this.set('geoTag', place.address)
      } else {
        this.set('geoTag', this.localize('label:custom-map-boundries'))
      }
    }
  }

  _locationChanged (e) {
    if (window.location.hash === '#map') {
      this.set('showingMap', true)
    } else {
      this.set('showingMap', false)
    }
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

  _bootstrapSearch (page) {
    import(/* webpackChunkName: "lunr" */ '../../src/lunr').then(lunrLib => {
      const lunr = lunrLib.default
      this.set('lunr', lunr)
      this._indexProjects(lunr, this.getState().projects)
      this._indexIntents(lunr, this.getState().intents)
    })
  }

  _indexProjects (lunr, projects) {
    if (!lunr || !projects || !projects.length) return
    let projectsIndex = lunr(function () {
      this.use(lunr.es)
      this.ref('_id')
      this.field('name', { boost: 10 })
      this.field('description')
      projects.forEach(function (project) {
        this.add(project)
      }, this)
    })
    this.set('projectsIndex', projectsIndex)
  }

  _indexIntents (lunr, intents) {
    if (!lunr || !intents || !intents.length) return
    let intentsIndex = lunr(function () {
      this.use(lunr.es)
      this.ref('_id')
      this.field('title', { boost: 10 })
      this.field('description')
      intents.forEach(function (intent) {
        this.add(intent)
      }, this)
    })
    this.set('intentsIndex', intentsIndex)
  }

  _fetchPublicData () {
    this.dispatch('fetchProjects')
    this.dispatch('fetchPlaces')
    this.dispatch('fetchPeople')
    this.dispatch('fetchIntents')
    this.dispatch('fetchReviews')
  }

  _fetchProtectedData () {
    this.dispatch('fetchMyConversations', this.person)
    this.dispatch('fetchNotifications', this.person)
  }

  _fetchUpdates () {
    this._fetchPublicData()
    if (this.person) this._fetchProtectedData()
  }

  _logout () {
    this.dispatch('bye', this.session)
  }

  _resizeIntentsList (myConversations) {
    if (myConversations && myConversations.length) this.$.intents.notifyResize()
  }

  _search (newSearchTerm) {
    if (newSearchTerm === '') newSearchTerm = null
    this.dispatch('updateSearchTerm', newSearchTerm)
  }

  _clearSearch () {
    this.set('newSearchTerm', null)
    this.dispatch('updateSearchTerm', null)
  }

  _showMenu () {
    this.set('page', 'menu')
  }

  _showToast (toast) {
    if (toast) this.$.toast.open()
  }

  ready () {
    super.ready()
    import(/* webpackChunkName: "vientos-map" */ '../widgets/vientos-map/vientos-map.html')
    import(/* webpackChunkName: "vientos-labels" */ '../../node_modules/vientos-data/labels/app.json')
      .then(labels => this.dispatch('setLabels', labels))
    this.dispatch('hello')
    this.dispatch('fetchCategories')
    this._fetchPublicData()
    this._bootstrapSearch()

    this.publicChannel = new EventSource(channelUrl())
    this.publicChannel.addEventListener('update', this._fetchPublicData.bind(this))

    let mqWideScreen = window.matchMedia('(min-width: 800px)')
    this.set('wideScreen', mqWideScreen.matches)
    mqWideScreen.onchange = this._viewPortWidenessChanged.bind(this)
    this.dispatch('setOnline', navigator.onLine)
    window.addEventListener('online', () => {
      this.dispatch('setOnline', true)
      this._fetchUpdates.bind(this)
    })
    window.addEventListener('offline', () => {
      this.dispatch('setOnline', false)
    })

    window.addEventListener('location-changed', this._locationChanged.bind(this))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(VientosShell.is, VientosShell)
