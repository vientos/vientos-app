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
      observer: '_pageChanged'
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

  _pageChanged (page) {
    history.pushState({}, '', `/${page}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _fireToggleDrawer (){
    this.fire('toggle')
  },

  _showProfile () {
    this._pageChanged('me')
  },

  ready () {
    console.log(this.localize, this.localize('job'));
  }

})
