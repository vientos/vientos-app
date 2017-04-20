/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, util */

Polymer({
  is: 'vientos-intent-page',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    intent: {
      type: Object,
      observer: 'log'
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

  log: console.log

})
