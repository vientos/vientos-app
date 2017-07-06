/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'open-conversations',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

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

  _getNotificationsCount (conversation, notifications) {
    return notifications.filter(notification => {
      return notification.object === conversation._id
    }).length
  },

  _getConversationCreatorName (personId, people) {
    return util.getRef(personId, people).name
  },

  _getConversationCreatorAvatar (personId, people) {
    return util.getThumbnailUrl(util.getRef(personId, people), 26)
  },

  _showConversation (e) {
    window.history.pushState({}, '', util.pathFor(e.model.conversation, 'conversation'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _filterConversations (person, conversations, intent, notifications, intents) {
    if (!person) return []
    return conversations.filter(conversation => {
      // show if has notification
      return util.foo(person, conversation, intent, notifications, intents)
    })
  }
})
