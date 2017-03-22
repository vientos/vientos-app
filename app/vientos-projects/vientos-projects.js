/* global Polymer, ReduxBehavior, util */

Polymer({
  is: 'vientos-projects',
  behaviors: [ ReduxBehavior ],

  properties: {
    projects: {
      type: Array,
      // filtered list passed as property
      observer: '_addIntentsToProjects'
    },
    intents: {
      type: Array,
      statePath: 'intents',
      observer: '_addIntentsToProjects'
    },
    expanded: {
      type: Boolean,
      value: false
    }
  },

  _addIntentsToProjects () {
    if (this.projects && this.intents) {
      this.projects.forEach((project, index) => {
        this.set(['projects', index, 'offers'], util.filterProjectOffers(project, this.intents))
        this.set(['projects', index, 'requests'], util.filterProjectRequests(project, this.intents))
      })
    }
  }

})
