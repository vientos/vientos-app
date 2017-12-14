import { ReduxMixin, ActionCreators, util, mintUrl } from '../../../src/engine.js'

class IntentEditor extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'intent-editor' }

  static get actions () {
    return {
      saveIntent: ActionCreators.saveIntent,
      savePlace: ActionCreators.savePlace
    }
  }

  static get properties () {
    return {
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
      intentAdminChecked: {
        type: Boolean,
        value: false,
        computed: '_checkIfAdmin(person, updated)'
      },
      intentAdmin: {
        type: Boolean,
        value: false,
        computed: '_checkIfAdmin(person, updated, updated.admins)',
        observer: '_setDatePicker'
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
      expiryMinDate: {
        type: String,
        value: () => {
          return new Date().toISOString().split('T')[0]
        }
      },
      activeToggleChecked: {
        type: Boolean,
        computed: '_checkIfActive(updated)'
      },
      expired: {
        type: Boolean,
        computed: '_checkIfExpired(updated, updated.expiryDate)'
      },
      readyToSave: {
        type: Boolean,
        computed: '_readyToSave(hasChanges, updated.title ,updated.description, updated.question, updated.collaborationType, updated.expiryDate)', // TODO updated.reciprocity,
        value: false
      },
      hasChanges: {
        type: Boolean,
        computed: '_hasChanges(intent, updated, newImage, updated.direction, updated.locations, updated.title ,updated.description, updated.question, updated.collaborationType, updated.reciprocity, updated.expiryDate, updated.admins, updated.status)',
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
    }
  }

  static get observers () {
    return [
      '_createNewIntent(person, project)'
    ]
  }

  _checkIfAdmin (...args) { return util.checkIfAdmin(...args) }
  _getPlaceAddress (...args) { return util.getPlaceAddress(...args) }
  _checkIfExpired (...args) { return util.checkIfExpired(...args) }

  _intentChanged () {
    this._reset()
    this._makeClone()
  }

  _makeClone () {
    if (this.intent && (!this.updated || this.intent._id !== this.updated._id)) {
      let updated = util.cloneDeep(this.intent)
      this.set('updated', updated)
    }
  }

  _addToCollection (element, collectionPath) {
    if (element === '' || this.get(collectionPath).includes(element)) return
    this.set(collectionPath, [...this.get(collectionPath), element])
  }

  _save () {
    let updated = this.updated
    if (!updated.reciprocity) updated.reciprocity = 'gift'
    this.dispatch('saveIntent', this.updated, this.newImage)
    this._reset()
    // we use replaceState to avoid when edting and going to intent page, that back button take you to edit again
    window.history.replaceState({}, '', `/intent/${this.updated._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _readyToSave (hasChanges, title, description, question, collaborationType, expiryDate) { // TODO reciprocity
    return !!title && !!description && !!question && !!collaborationType && !!expiryDate && !!hasChanges
  }

  _hasChanges (intent, updated, newImage) {
    if (!intent && updated) {
      return updated.title !== '' ||
      updated.description !== '' ||
      updated.status !== 'active' ||
      updated.question !== '' ||
      updated.collaborationType !== null ||
      updated.direction !== 'offer' ||
      updated.expiryDate !== new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ||
      updated.locations.length > 0 ||
      newImage
    }
    return !util.deepEqual(intent, updated) || newImage
  }

  _reset () {
    this.set('newImage', null)
    let placePicker = this.$$('place-picker')
    if (placePicker) placePicker.reset()
    let imagePicker = this.$$('image-picker')
    if (imagePicker) imagePicker.reset()
    this.set('updated', null)
    this.updateStyles()
    if (this.intent) {
      this._makeClone()
    } else {
      this._createNewIntent(this.person, this.project)
    }
  }

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
  }

  _toggleIntentStatus (e) {
    let status = this._checkIfActive(this.updated) ? 'inactive' : 'active'
    this.set('updated.status', status)
  }

  _checkIfActive (intent) {
    if (intent) return intent.status === 'active'
  }

  _createNewIntent (person, project) {
    if (person && project && (!this.updated || this.intent._id !== this.updated._id)) {
      this.set('updated', {
        _id: mintUrl({ type: 'Intent' }),
        status: 'active',
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
  }

  _addLocation (place) {
    let existingPlace = this.places.find(p => p.googlePlaceId === place.googlePlaceId)
    if (existingPlace) {
      place = existingPlace
    } else {
      place._id = mintUrl({ type: 'Place' })
      this.dispatch('savePlace', place)
    }
    this._addToCollection(place._id, 'updated.locations')
  }

  _removeLocation (e) {
    this.set('updated.locations', this.updated.locations.filter(placeId => placeId !== e.model.placeId))
  }

  _placePicked (e) {
    this._addLocation(e.detail)
  }

  _imagePicked (e) {
    this.set('newImage', e.detail)
  }

  _toggleAdminEnabled (intentAdmin, updated) {
    if (!updated) return false
    return !intentAdmin || (intentAdmin && updated.admins.length > 1)
  }

  _toggleAdmin () {
    if (this.intentAdmin) {
      this.set('updated.admins', this.intent.admins.filter(adminId => adminId !== this.person._id))
    } else {
      this.set('updated.admins', [...this.updated.admins, this.person._id].sort())
    }
  }

  _setDatePicker () {
    let datePicker = this.$.datepicker
    if (datePicker) {
      datePicker.set('i18n.firstDayOfWeek', 1)
      datePicker.set('i18n.formatDate', date => date.toLocaleDateString())
    }
  }
}
window.customElements.define(IntentEditor.is, IntentEditor)
