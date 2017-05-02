/* global Polymer, ReduxBehavior, util */

Polymer({
  is: 'intent-preview',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    intent: {
      type: Object
    },
    projects: {
      type: Array,
      statePath: 'projects'
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

  _getRef: util.getRef,

  _intentPageUrl (intent) {
    return util.pathFor(intent, 'intent')
  }

})
