Polymer({
  is: 'vientos-header',
  // behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
   },

  properties: {
    page: {
      type: String,
      notify: true
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
  }

})
