Polymer({
  is: 'vientos-project-preview',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
  },

  properties: {
    expanded: {
      type: Boolean,
      value: false
    },
    project: {
      type: Object
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

  _expandCollaborations () {

    this.set("expanded", ! this.expanded )

  },


  _linkTo (item) {
    return '/project/'+item._id
  },

  ready () {

  }

})
