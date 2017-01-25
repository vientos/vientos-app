Polymer({
  is: 'vientos-projects',
  behaviors: [ ReduxBehavior ],

  properties: {
    projects: {
      type: Array
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

  _linkTo (project) {
    // TODO: unify with _projectSelected() in shell.js
    return 'project-profile/' + project._id
  }

})
