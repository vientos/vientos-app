/* global Polymer, ReduxBehavior, CustomEvent */

Polymer({
  is: 'vientos-footer',

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    page: {
      type: String,
      observer: '_pageChanged'
    },
    buttons: {
      type: Array,
      value: ['filter', 'projects', 'intents']
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
      if (page === 'projects' && window.location.pathname === '/') return
      if (page === 'intents' && window.location.pathname === '/intents') return
      // if (page === 'map' && window.location.search   !== '') return
      let pathname = page === 'projects' ? '/' : `/${page}`
      window.history.pushState({}, '', pathname)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }
})
