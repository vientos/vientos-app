Polymer({
  is: 'vientos-projects',
  behaviors: [ ReduxBehavior ],

  properties: {
    projects: {
      type: Array
    }
  },

  _linkTo (project) {
    // TODO: unify with _projectSelected() in shell.js
    return 'project-profile/' + project._id
  }

})
