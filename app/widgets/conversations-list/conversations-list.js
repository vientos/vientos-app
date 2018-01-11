import { ReduxMixin, util } from '../../../src/engine.js'

class ConversationsList extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'conversations-list' }

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
      reviews: {
        type: Array,
        statePath: 'reviews'
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
        computed: '_filterConversations(person, conversations, intent, notifications, intents, reviews)'
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
    }
  }

  _getName (...args) { return util.getName(...args) }
  _getImage (...args) { return util.getImage(...args) }

  _getNotificationsCount (conversation, notifications) {
    if (Array.from(arguments).includes(undefined)) return 0
    return notifications.filter(notification => {
      return notification.object === conversation._id
    }).length
  }

  _showConversation (e) {
    window.history.pushState({}, '', util.pathFor(e.model.conversation, 'conversation'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _filterConversations (person, conversations, intent, notifications, intents, reviews) {
    if (Array.from(arguments).includes(undefined)) return []
    if (!person) return []
    return conversations.filter(conversation => {
      // show if has notification
      return util.conversationNeedsAttention(person, conversation, notifications, intents, reviews)
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
        // TODO stars
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
  }
}
window.customElements.define(ConversationsList.is, ConversationsList)
