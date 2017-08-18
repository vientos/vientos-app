/* global Polymer, ReduxBehavior, CustomEvent, util */

Polymer({
  is: 'vientos-project-preview',
  behaviors: [ ReduxBehavior ],

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
    }
  },

  _checkIfFollows: util.checkIfFollows,
  _getThumbnailUrl: util.getThumbnailUrl,

  _showFullProfile () {
    window.history.pushState({}, '', util.pathFor(this.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
