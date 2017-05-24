/* global Polymer, ReduxBehavior */

Polymer({
  is: 'place-page',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    place: {
      type: Object,
      value: null
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    placeIntents: {
      type: Array,
      computed: '_filterIntents(place, intents)'
    },
    placeProjects: {
      type: Array,
      computed: '_filterProjects(place, projects)'
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

  // TODO filter visible not all
  _filterIntents (place, intents) {
    if (!place) return []
    return intents.filter(intent => intent.locations.includes(place._id))
  },

  _filterProjects (place, projects) {
    if (!place) return []
    return projects.filter(project => project.locations.includes(place._id))
  }

})
