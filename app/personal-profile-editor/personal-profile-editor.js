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
      observer: '_personChanged'
    },
    updated: {
      type: Object
    },
    categories: {
      type: Object,
      statePath: 'categories'
    },
    newImage: {
      type: Object,
      value: null
    },
    imagePreviewSrc: {
      type: String,
      computed: '_getImagePreviewSrc(person, newImage)'
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

  _personChanged () {
    this._reset()
    this._makeClone()
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

  _reset () {
    this.set('newImage', null)
    this.$['new-image-form'].reset()
  },

  _save () {
    this.dispatch('savePerson', this.updated, this.newImage)
    this._reset()
    window.history.pushState({}, '', `/me`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _cancel () {
    this._reset()
    window.history.pushState({}, '', `/me`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  // TODO move to util
  _imageInputChanged (e) {
    let image = e.target.files[0]
    if (image) {
      this.set('newImage', image)
    }
  },

  // TODO move to util
  _getImagePreviewSrc (person, newImage) {
    if (newImage) {
      return window.URL.createObjectURL(newImage)
    } else if (person) {
      return person.logo
    }
  }
})
