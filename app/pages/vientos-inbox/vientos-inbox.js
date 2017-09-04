const ActionCreators = window.vientos.ActionCreators
const util = window.vientos.util

class VientosInbox extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'vientos-inbox' }

  static get actions () {
    return {
      bye: ActionCreators.bye
    }
  }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person'
      },
      intents: {
        type: Array,
        statePath: 'intents'
      },
      myProjects: {
        type: Array,
        computed: '_filterMyProjects(person, projects)'
      },
      activeIntents: {
        type: Array,
        computed: '_filterActiveIntents(person, intents, myConversations, notifications)'
      },
      myConversations: {
        type: Array,
        statePath: 'myConversations'
      },
      notifications: {
        type: Array,
        statePath: 'notifications'
      },
      projects: {
        type: Array,
        statePath: 'projects'
      },
      loginProviders: {
        type: String,
        statePath: 'loginProviders'
      },
      session: {
        type: Object,
        statePath: 'session'
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

  _filterActiveIntents (...args) { return util.filterActiveIntents(...args) }
  _filterIntentConversations (...args) { return util.filterIntentConversations(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _editProfile () {
    window.history.pushState({}, '', `/account/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _showProjectProfile (e) {
    window.history.pushState({}, '', util.pathFor(e.model.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _projectUrl (project) {
    return util.pathFor(project, 'project')
  }

  _bye () {
    this.dispatch('bye', this.session)
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _addProject () {
    window.history.pushState({}, '', `/new-project`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _filterMyProjects (person, projects) {
    if (Array.from(arguments).includes(undefined)) return []
    if (person) return projects.filter(project => project.admins.includes(this.person._id))
  }
}
window.customElements.define(VientosInbox.is, VientosInbox)
