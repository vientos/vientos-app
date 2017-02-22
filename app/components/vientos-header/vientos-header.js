// var store = window.vientos.store
// var ReduxBehavior = PolymerRedux(store)
Polymer({
  is: 'vientos-header',
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

  observers: [
  ],

  _fireToggleDrawer (){
    this.fire('toggle')
  },

  _changePage () {
    this.set('page', 'me')
  },

  ready () {
    console.log(this.localize, this.localize('job'));
  }

})
