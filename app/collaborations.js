/* global Polymer, ReduxBehavior */

Polymer({
  is: 'vientos-collaborations',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    collaborations: {
      type: Array
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

})
