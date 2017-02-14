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

  _toggleExpanded () {
    this.expanded = !this.expanded
    this.$.list.fire('iron-resize')
  },

  _addIntentsToProjects () {
    if (this.projects && this.intents) {
      this.projects.forEach((project, index) => {
        this.set(['projects', index, 'offers'], this.intents.filter(intent => intent.projects.includes(project._id) && intent.direction === 'offer'))
        this.set(['projects', index, 'requests'], this.intents.filter(intent => intent.projects.includes(project._id) && intent.direction === 'request'))
      })
    }
  },

  _linkTo (project) {
    // TODO: unify with _projectSelected() in shell.js
    return 'project/' + project._id
  }

})
