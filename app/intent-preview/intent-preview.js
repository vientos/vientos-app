/* global Polymer, ReduxBehavior, util, CustomEvent */

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
    showProjects: {
      type: Boolean
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

  _showIntentDetails () {
    window.history.pushState({}, '', util.pathFor(this.intent, 'intent'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  ready () {
    console.log(this.showProjects)
  }

})
