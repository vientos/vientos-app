/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'vientos-project-preview',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    project: {
      type: Object
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    following: {
      type: Object,
      value: null,
      computed: '_checkIfFollows(person, project)'
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

  _checkIfFollows: util.checkIfFollows,

  _showFullProfile () {
    window.history.pushState({}, '', util.pathFor(this.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
