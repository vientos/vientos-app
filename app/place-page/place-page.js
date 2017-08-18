/* global Polymer, ReduxBehavior, util */

Polymer({
  is: 'place-page',
  behaviors: [ ReduxBehavior ],

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
  },

  _back () {
    util.back('/map')
  }

})
