/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'vientos-header',
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
    notifications: {
      type: Array,
      statePath: 'notifications'
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    ourTurnCount: {
      type: Number,
      computed: '_calcOurTurnCount(person, myConversations, intents)'
    },
    page: {
      type: String,
      observer: '_pageChanged'
    },
    buttons: {
      type: Array,
      value: ['me']
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

  _pageChanged (page) {
    if (this.buttons.includes(page)) {
      window.history.pushState({}, '', `/${page}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  },

  _calcOurTurnCount (person, myConversations, intents) {
    return myConversations.reduce((count, conversation) => {
      return util.ourTurn(person, conversation, intents) ? ++count : count
    }, 0)
  },

  _showProfile () {
    this.set('page', 'me')
  }
})
