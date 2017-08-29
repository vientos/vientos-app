/* global Polymer, CustomEvent */

class IntentPreview extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(Polymer.Element)) {

  static get is () { return 'intent-preview' }

  static get properties () { return {
    intent: {
      // passed from parent
      type: Object
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
    ourTurnCount: {
      type: Number,
      computed: '_calcOurTurnCount(person, myConversations, intent, projectAdmin)'
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
  } }

  _getRef (...args) { return window.vientos.util.getRef(...args) }
  _checkIfFavors (...args) { return window.vientos.util.checkIfFavors(...args) }
  _getThumbnailUrl (...args) { return window.vientos.util.getThumbnailUrl(...args) }
  _canAdminIntent (...args) { return window.vientos.util.canAdminIntent(...args) }

  _showIntentDetails () {
    window.history.pushState({}, '', window.vientos.util.pathFor(this.intent, 'intent'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _checkIfProjectAdmin (person, intent, projects) {
    if (!person || !intent || !projects) return false
    return intent.projects.reduce((acc, projectId) => {
      return acc.concat(window.vientos.util.getRef(projectId, projects).admins)
    }, []).includes(person._id)
  }

  _notificationCount (intent, myConversations, notifications) {
    if (!intent || !myConversations || !myConversations.length || !notifications) return 0
    return notifications.filter(notification => {
      let conversation = window.vientos.util.getRef(notification.object, myConversations)
      return conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id
    }).length
  }

  _calcOurTurnCount (person, myConversations, intent, projectAdmin) {
    if (person && projectAdmin && intent && myConversations) {
      return myConversations.filter(conversation => {
        return conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id
      }).reduce((count, conversation) => {
        return window.vientos.util.ourTurn(person, conversation, [intent]) ? ++count : count
      }, 0)
    }
  }
}
window.customElements.define(IntentPreview.is, IntentPreview)
