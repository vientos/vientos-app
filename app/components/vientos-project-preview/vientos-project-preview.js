Polymer({
  is: 'vientos-project-preview',

  actions: {
  },

  properties: {
    expanded: {
      type: Boolean,
      value: false
    },
    project: {
      type: Object
    }

  },

  _viewProfile () {

    window.history.pushState({}, '', '/project/' + this.project._id )
    window.dispatchEvent(new CustomEvent('location-changed'))

  },

  _expandCollaborations () {

    this.set("expanded", ! this.expanded )

  },

  _collapseCollaborations () {

    this.set("expanded", false )

  },

  _linkTo (item) {
    return '/project/'+item._id
  },

  ready () {

  }

})
