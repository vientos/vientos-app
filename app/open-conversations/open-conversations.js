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
    visibleConversations: {
      type: Array,
      computed: '_filterConversations(person, conversations, notifications)'
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
    return util.getThumbnailUrl(util.getRef(personId, people).logo, 26)
  },

  _showConversation (e) {
    window.history.pushState({}, '', util.pathFor(e.model.conversation, 'conversation'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _filterConversations (person, conversations, notifications) {
    return conversations.filter(conversation => {
      // show if has notification
      return util.conversationNeedsAttention(person, conversation, notifications)
    })
  }
})
