/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, google, util */

Polymer({
  is: 'vientos-edit-project-details',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveProject: ActionCreators.saveProject,
    savePlace: ActionCreators.savePlace,
    uploadImage: ActionCreators.uploadImage
  },

  properties: {
    project: {
      // passed from parent
      type: Object,
      observer: '_projectChanged'
    },
    updated: {
      type: Object
    },
    places: {
      type: Array,
      statePath: 'places'
    },
    newPlace: {
      type: Object,
      value: null
    },
    newLink: {
      type: String,
      value: ''
    },
    newContact: {
      type: String,
      value: ''
    },
    newImage: {
      type: Object,
      value: null
    },
    imagePreviewSrc: {
      type: String,
      computed: '_getImagePreviewSrc(project, newImage)'
    },
    categories: {
      type: Array,
      statePath: 'categories'
    },
    googleMapsApiKey: {
      type: String,
      value: window.vientos.config.map.googleApiKey
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

  _getPlaceAddress: util.getPlaceAddress,

  _projectChanged () {
    this._reset()
    this._makeClone()
  },

  _makeClone () {
    if (this.project) {
      let updated = Object.assign({}, this.project)
      this.set('updated', updated)
    }
  },

  _addToCollection (element, collectionPath) {
    if (element === '' || this.get(collectionPath).includes(element)) return
    this.set(collectionPath, [...this.get(collectionPath), element])
  },

  _addLocation () {
    this._addToCollection(this.newPlace._id, 'updated.locations')
    let existingPlace = this.places.find(place => place.googlePlaceId === this.newPlace.googlePlaceId)
    if (!existingPlace) {
      this.dispatch('savePlace', this.newPlace)
    }
    this.set('newPlace', null)
    this.$['place-input'].value = ''
  },

  _removeLocation (e) {
    this.set('updated.locations', this.updated.locations.filter(placeId => placeId !== e.model.placeId))
  },

  _addContact () {
    this._addToCollection(this.newContact, 'updated.contacts')
    this.set('newContact', '')
  },

  _removeContact (e) {
    this.set('updated.contacts', this.updated.contacts.filter(l => l !== e.model.item))
  },

  _addLink () {
    // TODO validate URLs
    if (this.newLink && !this.newLink.match(/https*:\/\//)) this.set('newLink', 'http://' + this.newLink)
    this._addToCollection(this.newLink, 'updated.links')
    this.set('newLink', '')
  },

  _removeLink (e) {
    this.set('updated.links', this.updated.links.filter(l => l !== e.model.item))
  },

  _categoriesSelectionChanged (e, selection) {
    this.set('updated.categories', selection)
  },

  _reset () {
    this.set('newImage', null)
    this.set('newPlace', null)
    this.set('newContact', '')
    this.set('newLink', '')
    this.$['place-input'].value = ''
    this.$['new-image-form'].reset()
  },

  _save () {
    // in case person didn't click 'Add'
    this._addContact()
    this._addLink()
    if (this.newPlace) {
      this._addToCollection(this.newPlace, 'updated.locations')
      let existingPlace = this.places.find(place => place.googlePlaceId === this.newPlace.googlePlaceId)
      if (!existingPlace) {
        this.dispatch('savePlace', this.newPlace)
      }
    }

    this.dispatch('saveProject', this.updated, this.newImage)
    this._reset()
    window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _cancel () {
    this._reset()
    window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _onGoogleMapsApiLoad () {
    this.autocomplete = new google.maps.places.Autocomplete(this.$['place-input'])
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._placeChanged.bind(this))
  },

  _placeChanged () {
    let googlePlace = this.autocomplete.getPlace()
    let place = {
      address: googlePlace.formatted_address,
      latitude: googlePlace.geometry.location.lat(),
      longitude: googlePlace.geometry.location.lng(),
      googlePlaceId: googlePlace.place_id
    }
    let existingPlace = this.places.find(p => p.googlePlaceId === place.googlePlaceId)
    if (existingPlace) {
      place = existingPlace
    } else {
      place._id = util.mintUrl({ type: 'Place' })
    }
    this.set('newPlace', place)
  },

  _imageInputChanged (e) {
    let image = e.target.files[0]
    if (image) {
      this.set('newImage', image)
    }
  },

  _getImagePreviewSrc (project, newImage) {
    if (newImage) {
      return window.URL.createObjectURL(newImage)
    } else if (project) {
      return project.logo
    }
  }

})
