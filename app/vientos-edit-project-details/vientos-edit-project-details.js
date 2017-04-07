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
    newContact: {
      type: String,
      value: ''
    },
    categories: {
      type: Array,
      statePath: 'categories'
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
      this.set('updated', updated)
    }
  },

  _addContact () {
    // TODO validate URLs
    if (this.newContact === '' || this.updated.contacts.includes(this.newContact)) return
    this.set('updated.contacts', [...this.updated.contacts, this.newContact])
    this.set('newContact', '')
  },

  _removeContact (e) {
    this.set('updated.contacts', this.updated.contacts.filter(l => l !== e.model.item))
  },

  _addLink () {
    // TODO validate URLs
    if (this.newLink === '' || this.updated.links.includes(this.newLink)) return
    this.set('updated.links', [...this.updated.links, this.newLink])
    this.set('newLink', '')
  },

  _removeLink (e) {
    this.set('updated.links', this.updated.links.filter(l => l !== e.model.item))
  },

  _categoriesSelectionChanged (e, selection) {
    this.set('updated.categories', selection)
  },

  _save () {
    this.updated.locations.forEach(location => delete location.project)
    this.dispatch('saveProject', this.updated)
  },

  _cancel () {
    window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

})
