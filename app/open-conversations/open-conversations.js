/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'open-conversations',
  behaviors: [ ReduxBehavior ],

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    // passed from parent
    conversations: {
      type: Array
    },
    // passed from parent
    intent: {
      type: Object
    },
    visibleConversations: {
      type: Array,
      computed: '_filterConversations(person, conversations, intent, notifications, intents)'
    },
    notifications: {
      type: Array,
      statePath: 'notifications'
    },
    showNotification: {
      type: Boolean,
      reflectToAttribute: true
    },
    people: {
      type: Array,
      statePath: 'people'
    }
  },

  _ourTurn: util.ourTurn,
  _getName: util.getName,
  _getImage: util.getImage,

  _getNotificationsCount (conversation, notifications) {
    return notifications.filter(notification => {
      return notification.object === conversation._id
    }).length
  },

  _showConversation (e) {
    window.history.pushState({}, '', util.pathFor(e.model.conversation, 'conversation'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _filterConversations (person, conversations, intent, notifications, intents) {
    if (!person) return []
    return conversations.filter(conversation => {
      // show if has notification
      return util.intentPrimaryForMyConversation(person, conversation, intent, notifications, intents)
    }).sort((a, b) => {
      let aNotifications = notifications.filter(notification => notification.object === a._id)
      let bNotifications = notifications.filter(notification => notification.object === b._id)

      // prioritize most recent notification
      if (aNotifications.length && bNotifications.length) {
        return new Date(bNotifications.pop().createdAt) - new Date(aNotifications.pop().createdAt)
      } else if (aNotifications.length) {
        return -1
      } else if (bNotifications.length) {
        return 1
      } else {
        let aOurTurn = util.ourTurn(person, a, intents)
        let bOurTurn = util.ourTurn(person, b, intents)
        if (aOurTurn && bOurTurn) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        } else if (aOurTurn) {
          return -1
        } else if (bOurTurn) {
          return 1
        } else {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
      }
    })
  }
})
