/* global Polymer, ReduxBehavior, ActionCreators */

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
      value: () => { return window.vientos.config.api.login }
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

  _bye () {
    this.dispatch('bye')
  }

})
