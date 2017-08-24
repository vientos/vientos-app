/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent, util */

Polymer({
  is: 'account-settings',
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
    readyToSave: {
      type: Boolean,
      computed: '_readyToSave(hasChanges, updated.name)',
      value: false
    },
    hasChanges: {
      type: Boolean,
      computed: '_hasChanges(person, updated, newImage, updated.name, updated.language, updated.emailNotifications, updated.categories)',
      value: false
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
    this.$$('image-picker').reset()
  },

  _readyToSave (hasChanges, name) {
    return !!name && !!hasChanges
  },

  _hasChanges (person, updated, newImage) {
    return !util.deepEqual(person, updated) || !!newImage
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

  _toggleLanguage (e) {
    if (this.updated.language === 'en') {
      this.set('updated.language', 'es')
    } else {
      this.set('updated.language', 'en')
    }
  },

  _checkedLanguageInput (language) {
    return language === 'en'
  },

  _toggleEmailNotifications (e) {
    this.set('updated.emailNotifications', !this.updated.emailNotifications)
  },

  _imagePicked (e) {
    this.set('newImage', e.detail)
  }
})
