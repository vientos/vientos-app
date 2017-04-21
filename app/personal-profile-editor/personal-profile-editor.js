/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent */

Polymer({
  is: 'personal-profile-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    savePerson: ActionCreators.savePerson
  },

  properties: {
    person: {
      type: Object,
      statePath: 'person',
      observer: '_makeClone'
    },
    updated: {
      type: Object
    },
    categories: {
      type: Object,
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
    if (this.person) {
      let updated = Object.assign({}, this.person)
      this.set('updated', updated)
    }
  },

  _categoriesSelectionChanged (e, selection) {
    this.set('updated.categories', selection)
  },

  _save () {
    this.dispatch('savePerson', this.updated)
  },

  _cancel () {
    window.history.pushState({}, '', `/me`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
})
