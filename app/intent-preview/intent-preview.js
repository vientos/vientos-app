/* global Polymer, ReduxBehavior, util, CustomEvent */

Polymer({
  is: 'intent-preview',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    intent: {
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
      computed: '_calcOurTurnCount(person, myConversations, intent)'
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
  },

  _getRef: util.getRef,
  _checkIfFavors: util.checkIfFavors,
  _getThumbnailUrl: util.getThumbnailUrl,
  _canAdminIntent: util.canAdminIntent,

  _showIntentDetails () {
    window.history.pushState({}, '', util.pathFor(this.intent, 'intent'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _checkIfProjectAdmin (person, intent, projects) {
    if (!person) return false
    return intent.projects.reduce((acc, projectId) => {
      return acc.concat(util.getRef(projectId, projects).admins)
    }, []).includes(person._id)
  },

  _notificationCount (intent, myConversations, notifications) {
    if (!intent || !myConversations.length) return 0
    return notifications.filter(notification => {
      let conversation = util.getRef(notification.object, myConversations)
      return conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id
    }).length
  },

  _calcOurTurnCount (person, myConversations, intent) {
    if (person) {
      return myConversations.filter(conversation => {
        return conversation.causingIntent === intent._id || conversation.matchingIntent === intent._id
      }).reduce((count, conversation) => {
        return util.ourTurn(person, conversation, [intent]) ? ++count : count
      }, 0)
    }
  }

})
