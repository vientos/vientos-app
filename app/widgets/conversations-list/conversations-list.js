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
      visibleConversationRecords: {
        type: Array,
        computed: '_filterConversations(person, conversations, intent, notifications, intents, reviews, people)'
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

  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _getLastMessage (person, conversation, intents, us = true) {
    return [...conversation.messages].reverse().find(message => {
      let sameTeam = util.sameTeam(person._id, message.creator, conversation, intents)
      return us ? sameTeam : !sameTeam
    })
  }

  _getNotificationsCount (conversation, notifications) {
    if (Array.from(arguments).includes(undefined)) return 0
    return notifications.filter(notification => {
      return notification.object === conversation._id
    }).length
  }

  _timeAgo (message) {
    let date = message.createdAt
    let timeDifference = Date.now() - new Date(date)
    let oneMinute = 1000 * 60
    let oneHour = oneMinute * 60
    let oneDay = oneHour * 24
    if (timeDifference < oneHour) return `${Math.floor(timeDifference / oneMinute)} ${this.localize('label:short-minute')}`
    else if (timeDifference < oneDay) return `${Math.floor(timeDifference / oneHour)} ${this.localize('label:short-hour')}`
    else return `${Math.floor(timeDifference / oneDay)} ${this.localize('label:short-day')}`
  }

  _showConversation (e) {
    window.history.pushState({}, '', util.pathFor(e.model.conversation, 'conversation'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _filterConversations (person, conversations, intent, notifications, intents, reviews, people) {
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
    }).map(conversation => {
      let record = {
        notificationsCount: this._getNotificationsCount(conversation, notifications)
      }
      let othersLastMessage = this._getLastMessage(person, conversation, intents, false)
      if (othersLastMessage) {
        record.othersPerson = util.getRef(othersLastMessage.creator, people)
        record.othersTimeAgo = this._timeAgo(othersLastMessage)
      }
      let usLastMessage = this._getLastMessage(person, conversation, intents, true)
      if (usLastMessage) {
        record.usPerson = util.getRef(usLastMessage.creator, people)
        record.usTimeAgo = this._timeAgo(usLastMessage)
      }
      return record
    })
  }
}
window.customElements.define(ConversationsList.is, ConversationsList)
