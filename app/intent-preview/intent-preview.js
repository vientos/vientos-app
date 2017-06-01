/* global Polymer, ReduxBehavior, util, CustomEvent */

Polymer({
  is: 'intent-preview',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    intent: {
      type: Object
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    favoring: {
      type: Object,
      value: null,
      computed: '_checkIfFavors(person, intent)'
    },
    showProjects: {
      type: Boolean
    },
    showNotification: {
      type: Boolean,
      reflectToAttribute: true
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
  _checkIfFavors: util.checkIfFavors,

  _showIntentDetails () {
    window.history.pushState({}, '', util.pathFor(this.intent, 'intent'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
