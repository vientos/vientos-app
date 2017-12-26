import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class OrganizationDetails extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'organization-profile' }

  static get actions () {
    return {
      follow: ActionCreators.follow,
      unfollow: ActionCreators.unfollow
    }
  }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person'
      },
      notifications: {
        type: Array,
        statePath: 'notifications'
      },
      myConversations: {
        type: Array,
        statePath: 'myConversations'
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
      canFollow: {
        type: Boolean,
        computed: '_canFollow(person, admin, project)'
      },
      project: {
      // passed from parent
        type: Object,
        observer: '_resizeHeader'
      },
      intents: {
        type: Array,
        statePath: 'intents'
      },
      reviews: {
        type: Array,
        statePath: 'reviews'
      },
      activeIntents: {
        type: Array,
        value: [],
        computed: '_filterActiveIntents(person, project, intents, myConversations, notifications, reviews)'
      },
      inactiveIntents: {
        type: Array,
        value: [],
        computed: '_filterInactiveIntents(person, project, intents, myConversations, notifications, reviews)'
      },
      expiredIntents: {
        type: Array,
        value: [],
        computed: '_filterExpiredIntents(person, project, intents, myConversations, notifications, reviews)'
      },
      online: {
        type: Boolean,
        statePath: 'online'
      },
      history: {
        type: Array,
        statePath: 'history'
      },
      language: {
        type: String,
        statePath: 'language'
      },
      resources: {
        type: Object,
        statePath: 'labels'
      }
    }
  }

  _checkIfFollows (...args) { return util.checkIfFollows(...args) }
  _checkIfAdmin (...args) { return util.checkIfAdmin(...args) }
  _filterActiveIntents (...args) { return util.filterActiveProjectIntents(...args) }
  _filterExpiredIntents (...args) { return util.filterExpiredProjectIntents(...args) }
  _filterInactiveIntents (...args) { return util.filterInactiveProjectIntents(...args) }
  _getPlaceAddress (...args) { return util.getPlaceAddress(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _intentPageUrl (intent) {
    return util.pathFor(intent, 'intent')
  }

  _back () {
    this.dispatchEvent(new CustomEvent('back'))
  }

  _canFollow (person, admin, project) {
    return person && !admin && project
  }

  _toggleFollow () {
    if (!this.following) {
      this.dispatch('follow', this.person, this.project)
    } else {
      this.dispatch('unfollow', this.following)
    }
  }

  _editDetails () {
    // we use replaceState to avoid when edting and going to project page, that back button take you to edit again
    window.history.replaceState({}, '', `/edit-project-details/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _newIntent () {
    window.history.pushState({}, '', `/new-intent/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showLocationOnMap (e) {
    window.history.pushState({}, '', `/projects?place=${e.model.placeId}#map`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showLinksAndContacts (project) {
    return project && (project.links.length || project.contacts.length)
  }

  _resizeHeader () {
    setTimeout(() => {
      this.$$('app-header-layout').notifyResize()
    }, 100)
  }
}
window.customElements.define(OrganizationDetails.is, OrganizationDetails)
