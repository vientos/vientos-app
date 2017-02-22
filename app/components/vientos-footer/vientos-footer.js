Polymer({
  is: 'vientos-footer',

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
  },

  properties: {
    page: {
      type: String,
      notify: true
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
  ready () {
  }

})
