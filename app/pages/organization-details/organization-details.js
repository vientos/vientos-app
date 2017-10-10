import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class OrganizationDetails extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'organization-details' }

  static get actions () {
    return {
      follow: ActionCreators.follow,
      unfollow: ActionCreators.unfollow,
      saveProject: ActionCreators.saveProject
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
      potentialAdmins: {
        type: Array,
        computed: '_getPotentialAdmins(project, people)'
      },
      canFollow: {
        type: Boolean,
        computed: '_canFollow(person, admin, project)'
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
      activeIntents: {
        type: Array,
        value: [],
        computed: '_filterActiveIntents(person, project, intents, myConversations, notifications)'
      },
      inactiveIntents: {
        type: Array,
        value: [],
        computed: '_filterInactiveIntents(person, project, intents, myConversations, notifications)'
      },
      expiredIntents: {
        type: Array,
        value: [],
        computed: '_filterExpiredIntents(person, project, intents, myConversations, notifications)'
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
  _getRef (...args) { return util.getRef(...args) }
  _getPlaceAddress (...args) { return util.getPlaceAddress(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _intentPageUrl (intent) {
    return util.pathFor(intent, 'intent')
  }

  _back () {
    util.back('/projects')
  }

  _canFollow (person, admin, project) {
    return person && !admin && project
  }

  _follow () {
    this.dispatch('follow', this.person, this.project)
  }

  _unfollow () {
    this.dispatch('unfollow', this.following)
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

  _getPotentialAdmins (project, people) {
    if (!project || !people) return []
    return people.filter(person => !project.admins.includes(person._id))
  }

  _startAddingAdmin () {
    this.set('addingNewAdmin', true)
  }

  _cancelAddingAdmin () {
    this.set('addingNewAdmin', false)
  }

  _setNewAdmin (e, detail) {
    this.set('newAdmin', detail.item.name)
  }

  _addNewAdmin () {
    this.project.admins = [...new Set([...this.project.admins, this.newAdmin])]
    this.dispatch('saveProject', this.project)
    this.set('addingNewAdmin', false)
  }

  _showLocationOnMap (e) {
    let place = util.getRef(e.model.placeId, this.places)
    window.history.pushState({}, '', util.pathFor(place, 'place') + '#map')
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showLinksAndContacts (project) {
    return project && (project.links.length || project.contacts.length)
  }
}
window.customElements.define(OrganizationDetails.is, OrganizationDetails)
