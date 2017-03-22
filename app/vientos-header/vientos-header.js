/* global Polymer, ReduxBehavior, CustomEvent */

Polymer({
  is: 'vientos-header',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
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

  _fireToggleDrawer () {
    this.fire('toggle')
  },

  _showProfile () {
    this.set('page', 'me')
  }
})
