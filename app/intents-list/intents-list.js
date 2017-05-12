/* global Polymer, ReduxBehavior */

Polymer({
  is: 'intents-list',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    intents: {
      // passed from parent
      type: Array
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
  }
})
