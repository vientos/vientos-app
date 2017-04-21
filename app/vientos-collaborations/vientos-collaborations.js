/* global Polymer, ReduxBehavior */

Polymer({
  is: 'vientos-collaborations',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    intents: {
      // passed from parent
      type: Array,
      observer: '_addProjectsToIntents'
    },
    projects: {
      type: Array,
      statePath: 'projects',
      observer: '_addProjectsToIntents'
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

  _addProjectsToIntents () {
    if (this.intents && this.projects) {
      this.intents.forEach(intent => {
        intent.projectRefs = intent.projects.map(projectId => this.projects.find(p => p._id === projectId))
      })
    }
  }
})
