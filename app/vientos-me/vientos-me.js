/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent */

Polymer({
  is: 'vientos-me',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    bye: ActionCreators.bye
  },

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    login: {
      type: String,
      value: () => { return window.vientos.login }
    },
    session: {
      type: Object,
      statePath: 'session'
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

  _editProfile () {
    window.history.pushState({}, '', `/edit-my-profile/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _bye () {
    this.dispatch('bye', this.session)
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  ready () {
    window.page = this
  }

})
