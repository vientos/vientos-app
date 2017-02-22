Polymer({
  is: 'vientos-footer',

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
    console.log('footer-page-changed',page);
    // history.pushState({}, '', `/${page}`)
    // window.dispatchEvent(new CustomEvent('location-changed'))
  },

  ready () {
  }

})
