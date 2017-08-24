/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent, util */

Polymer({
  is: 'intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveIntent: ActionCreators.saveIntent,
    savePlace: ActionCreators.savePlace
  },

  properties: {
    collaborationTypes: {
      type: Array,
      value: ['work', 'usage', 'consumption', 'ownership']
    },
    intent: {
      type: Object,
      value: null,
      observer: '_intentChanged'
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    places: {
      type: Object,
      statePath: 'places'
    },
    updated: {
      type: Object
    },
    project: {
      type: Object
    },
    newImage: {
      type: Object,
      value: null
    },
    toggled: {
      type: Boolean,
      computed: '_checkIfToggled(updated)'
    },
    expiryMinDate: {
      type: String,
      value: () => {
        return new Date().toISOString().split('T')[0]
      }
    },
    readyToSave: {
      type: Boolean,
      computed: '_readyToSave(hasChanges, updated.title ,updated.description, updated.question, updated.collaborationType, updated.reciprocity, updated.expiryDate)',
      value: false
    },
    hasChanges: {
      type: Boolean,
      computed: '_hasChanges(intent, updated, newImage, updated.direction, updated.locations, updated.title ,updated.description, updated.question, updated.collaborationType, updated.reciprocity, updated.expiryDate)',
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

  observers: [
    '_createNewIntent(person, project)',
    '_collaborationTypeChanged(updated.collaborationType)'
  ],

  _getPlaceAddress: util.getPlaceAddress,

  _intentChanged () {
    this._reset()
    this._makeClone()
    if (this.intent) this.set('collaborationType', this.intent.collaborationType)
  },

  _makeClone () {
    if (this.intent) {
      let updated = Object.assign({}, this.intent)
      this.set('updated', updated)
    }
  },

  _addToCollection (element, collectionPath) {
    if (element === '' || this.get(collectionPath).includes(element)) return
    this.set(collectionPath, [...this.get(collectionPath), element])
  },

  _save () {
    this.dispatch('saveIntent', this.updated, this.newImage)
    this._reset()
    // we use replaceState to avoid when edting and going to intent page, that back button take you to edit again
    window.history.replaceState({}, '', `/intent/${this.updated._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _readyToSave (hasChanges, title, description, question, collaborationType, reciprocity, expiryDate) {
    return !!title && !!description && !!question && !!collaborationType && !!reciprocity && !!expiryDate && !!hasChanges
  },

  _hasChanges (intent, updated, newImage) {
    if (!intent) return true
    return !util.deepEqual(intent, updated) || newImage
  },

  _reset () {
    this.set('newImage', null)
    this.$$('place-picker').reset()
    this.$$('image-picker').reset()
    if (this.updated && this.updated.collaborationType) this.$$(`vientos-icon-button[name=${this.updated.collaborationType}]`).set('active', false)
    this.updateStyles()
    this._makeClone()
  },

  _cancel () {
    this._reset()
    // we use replaceState to avoid when edting and going to intent page, that back button take you to edit again
    if (this.project) {
      window.history.replaceState({}, '', `/project/${this.project._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      window.history.replaceState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  },

  _checkIfToggled (updated) {
    return updated && updated.direction === 'request'
  },

  _toggleDirection () {
    this.set('updated.direction', this.updated.direction === 'offer' ? 'request' : 'offer')
  },

  _collaborationTypeChanged (updated) {
    this.collaborationTypes.forEach(colType => {
      this.$$(`vientos-icon-button[name=${colType}]`).set('active', false)
    })
    if (updated) this.$$(`vientos-icon-button[name=${updated}]`).set('active', true)
    this.updateStyles()
  },

  _setCollaborationCondition (e, detail) {
    this.condition = detail.item.name
  },

  _createNewIntent (person, project) {
    if (person && project) {
      this._reset()
      this.set('updated', {
        _id: util.mintUrl({ type: 'Intent' }),
        title: '',
        description: '',
        question: '',
        collaborationType: null,
        type: 'Intent',
        direction: 'offer',
        reciprocity: 'gift',
        expiryDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        creator: person._id,
        admins: [person._id],
        projects: [ project._id ],
        locations: []
      })
    }
  },

  _addLocation (place) {
    let existingPlace = this.places.find(p => p.googlePlaceId === place.googlePlaceId)
    if (existingPlace) {
      place = existingPlace
    } else {
      place._id = util.mintUrl({ type: 'Place' })
      this.dispatch('savePlace', place)
    }
    this._addToCollection(place._id, 'updated.locations')
  },

  _removeLocation (e) {
    this.set('updated.locations', this.updated.locations.filter(placeId => placeId !== e.model.placeId))
  },

  _placePicked (e) {
    this._addLocation(e.detail)
  },

  _imagePicked (e) {
    this.set('newImage', e.detail)
  },

  ready () {
    this.$.datepicker.set('i18n.firstDayOfWeek', 1)
    // this.$.datepicker.set('i18n.formatDate', (date) => { return date.toLocaleDateString() })
  }

})
