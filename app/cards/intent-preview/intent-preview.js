import { ReduxMixin, util } from '../../../src/engine.js'

class IntentPreview extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'intent-preview' }

  static get properties () {
    return {
      intent: {
      // passed from parent
        type: Object
      },
      intentProjects: {
        type: Array,
        computed: '_getIntentProjects(intent, projects)'
      },
      myConversations: {
        type: Array,
        statePath: 'myConversations'
      },
      person: {
        type: Object,
        statePath: 'person'
      },
      notifications: {
        type: Array,
        statePath: 'notifications'
      },
      notificationCount: {
        type: Number,
        computed: '_notificationCount(intent, myConversations, notifications)'
      },
      reviews: {
        type: Array,
        statePath: 'reviews'
      },
      ourTurnCount: {
        type: Number,
        computed: '_calcOurTurnCount(person, myConversations, intent, projectAdmin, reviews)'
      },
      projects: {
        type: Array,
        statePath: 'projects'
      },
      projectAdmin: {
        type: Boolean,
        computed: '_checkIfProjectAdmin(person, intent, projects)',
        value: false
      },
      intentAdmin: {
        type: Boolean,
        computed: '_canAdminIntent(person, intent)',
        value: false
      },
      favoring: {
        type: Object,
        value: null,
        computed: '_checkIfFavors(person, intent)'
      },
      showProjects: {
        type: Boolean
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

  _checkIfFavors (...args) { return util.checkIfFavors(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }
  _canAdminIntent (...args) { return util.canAdminIntent(...args) }

  _getIntentProjects (intent, projects) {
    if (intent && projects && projects.length) { return util.getRef(intent.projects, projects) }
  }

  _showIntentDetails () {
    window.history.pushState({}, '', util.pathFor(this.intent, 'intent'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _checkIfProjectAdmin (person, intent, projects) {
    if (!person || !intent || !projects || !projects.length) return false
    return intent.projects.reduce((acc, projectId) => {
      return acc.concat(util.getRef(projectId, projects).admins)
    }, []).includes(person._id)
  }

  _notificationCount (intent, myConversations, notifications) {
    if (!intent || !myConversations || !myConversations.length || !notifications) return 0
    return notifications.filter(notification => {
      let conversation = util.getRef(notification.object, myConversations)
      return conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id
    }).length
  }

  _calcOurTurnCount (person, myConversations, intent, projectAdmin, reviews) {
    if (person && projectAdmin && intent && myConversations) {
      return myConversations.filter(conversation => {
        return conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id
      }).reduce((count, conversation) => {
        return util.ourTurn(person, conversation, [intent], reviews) ? ++count : count
      }, 0)
    }
  }
}
window.customElements.define(IntentPreview.is, IntentPreview)
