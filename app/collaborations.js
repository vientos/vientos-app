Polymer({
  is: 'vientos-collaborations',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {

  },
  properties: {
    collaborations: {
      type: Array,
      value: [
         {
            name: "Collaboration 1"
         },
         {
            name: "Collaboration 2"
         }
      ]
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
    console.log( "Collaborations Ready" )
  },

})
