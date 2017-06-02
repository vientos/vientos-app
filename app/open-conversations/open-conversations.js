/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'open-conversations',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    // passed from parent
    conversations: {
      type: Array
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

  _getNotificationsCount (conversation, notifications) {
    return notifications.filter(notification => {
      return notification.object === conversation._id
    }).length
  },

  _getConversationCreatorName (personId, people) {
    return util.getRef(personId, people).name
  },

  _getConversationCreatorAvatar (personId, people) {
    return util.getRef(personId, people).logo
  },

  _showConversation (e) {
    window.history.pushState({}, '', util.pathFor(e.model.conversation, 'conversation'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
})
