/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent, util, google */

Polymer({
  is: 'vientos-intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveIntent: ActionCreators.saveIntent
  },

  properties: {
    intent: {
      type: Object,
      observer: '_intentChanged'
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    updated: {
      type: Object
    },
    project: {
      type: Object
    },
    imagePreviewSrc: {
      type: String,
      computed: '_getImagePreviewSrc(intent, newImage)'
    },
    newImage: {
      type: Object,
      value: null
    },
    toggled: {
      type: Boolean,
      computed: '_checkIfToggled(updated)'
    },
    googleMapsApiKey: {
      type: String,
      value: window.vientos.config.map.googleApiKey
    },
    collaborationType: {
      type: String
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    conditions: {
      type: Array,
      value: [
        'gift',
        'share'
      ]
    },
    expiryDate: {
      type: String,
      value: () => {
        return new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    },
    expiryMinDate: {
      type: String,
      value: () => {
        return new Date().toISOString().split('T')[0]
      }
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

  observers: ['_createNewIntent(person, project)'],

  _intentChanged () {
    this._reset()
    this._makeClone()
  },

  _makeClone () {
    if (this.intent) {
      let updated = Object.assign({}, this.intent)
      this.set('updated', updated)
    }
  },

  _save () {
    this.updated.collaborationType = this.collaborationType
    this.updated.condition = this.condition
    this.updated.expiryDate = this.expiryDate
    this.dispatch('saveIntent', this.updated, this.newImage)
    window.history.pushState({}, '', `/intent/${this.updated._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _reset () {
    this.set('newImage', null)
    this.$['new-image-form'].reset()
  },

  _cancel () {
    this._reset()
    if (this.project) {
      window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      window.history.pushState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  },

  _checkIfToggled (updated) {
    return updated && updated.direction === 'request'
  },

  _toggleDirection () {
    this.set('updated.direction', this.updated.direction === 'offer' ? 'request' : 'offer')
  },

  _setCollaborationType (e, detail) {
    this.collaborationType = detail.item.name
  },

  _setCollaborationCondition (e, detail) {
    this.condition = detail.item.name
  },

  _createNewIntent (person, project) {
    if (person && project) {
      this._reset()
      this.set('updated', {
        _id: util.mintUrl({ type: 'Intent' }),
        type: 'Intent',
        direction: 'offer',
        condition: 'gift',
        creator: person._id,
        admins: [person._id],
        projects: [ project._id ]
      })
    }
  },

  _getMainLocation () {
    if (this.project && this.project.locations[0]) return this.project.locations[0].address
  },

  _onGoogleMapsApiLoad () {
    this.autocomplete = new google.maps.places.Autocomplete(this.$['place-input'])
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._placeChanged.bind(this))
  },

  _placeChanged () {
    let place = this.autocomplete.getPlace()
    this.set('updated.locations', [{
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    }])
  },

  _imageInputChanged (e) {
    let image = e.target.files[0]
    if (image) {
      this.set('newImage', image)
    }
  },

  _getImagePreviewSrc (intent, newImage) {
    if (newImage) {
      return window.URL.createObjectURL(newImage)
    } else if (intent) {
      return intent.logo
    }
  },

  ready () {
    this.$.datepicker.set('i18n.firstDayOfWeek', 1)
    // this.$.datepicker.set('i18n.formatDate', (date) => { return date.toLocaleDateString() })
  }

})
