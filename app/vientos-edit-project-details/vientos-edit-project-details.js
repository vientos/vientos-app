/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, util */

Polymer({
  is: 'vientos-edit-project-details',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveProject: ActionCreators.saveProject
  },

  properties: {
    project: {
      // passed from parent
      type: Object,
      observer: '_makeClone'
    },
    updated: {
      type: Object
    },
    newLink: {
      type: String,
      value: ''
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

  _makeClone () {
    if (this.project) {
      let updated = Object.assign({}, this.project)
      // FIXME util.js creates ciruclar references
      updated.locations.forEach(location => delete location.project)
      this.set('updated', updated)
    }
  },

  _addLink () {
    this.set('updated.links', [...this.updated.links, this.newLink])
    this.set('newLink', '')
  },

  _removeLink (e) {
    this.set('updated.links', this.updated.links.filter(l => l !== e.model.item))
  },

  _save () {
    window.foo = this.updated
    console.log(JSON.stringify(this.updated))
    // this.dispatch('saveProject', this.updated)
  }
})
