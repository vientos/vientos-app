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
      observer: '_projectChanged',
      value: null
    },
    creator: {
      // passed from parent just when creating new project
      type: Object,
      observer: '_createNewProject'
    },
    updated: {
      type: Object,
      value: null
    },
    places: {
      type: Array,
      statePath: 'places'
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
      computed: '_getImagePreviewSrc(updated, newImage)'
    },
    categories: {
      type: Array,
      statePath: 'categories'
    },
    googleMapsApiKey: {
      type: String,
      value: window.vientos.config.map.googleApiKey
    },
    readyToSave: {
      type: Boolean,
      computed: '_readyToSave(hasChages, updated.name, updated.description, updated.logo, newImage)',
      value: false
    },
    hasChages: {
      type: Boolean,
      computed: '_hasChanges(project, updated, newImage, newContact, newLink, updated.name, updated.description, updated.categories, updated.locations, updated.contacts, updated.links)',
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


  _addContact () {
    this._addToCollection(this.newContact, 'updated.contacts')
    this.set('newContact', '')
  },

  _removeContact (e) {
    this.set('updated.contacts', this.updated.contacts.filter(l => l !== e.model.item))
  },

  _addLink () {
    // TODO validate URLs
    if (this.newLink && !this.newLink.match(/https?:\/\//)) this.set('newLink', 'http://' + this.newLink)
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
    this.set('newContact', '')
    this.set('newLink', '')
    this.$['place-input'].value = ''
    this.$['new-image-form'].reset()
  },

  _save () {
    // in case person didn't click 'Add'
    this._addContact()
    this._addLink()
    this.dispatch('saveProject', this.updated, this.newImage)
    this._reset()
    // we use replaceState to avoid when edting and going to project page, that back button take you to edit again
    window.history.replaceState({}, '', `/project/${this.updated._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _readyToSave (hasChages, name, description, logo, newImage) {
    return !!name && !!description && (!!logo || newImage) && hasChages
  },

  _hasChanges (project, updated, newImage, newLink, newContact) {
    if (!project) return true
    return !util.deepEqual(project, updated) || newImage || newLink || newContact
  },

  _createNewProject (creator) {
    if (creator) {
      this._reset()
      this.set('updated', {
        _id: util.mintUrl({ type: 'Project' }),
        type: 'Project',
        admins: [creator._id],
        categories: [],
        links: [],
        contacts: [],
        locations: [],
        logo: null
      })
    }
  },

  _cancel () {
    this._reset()
    if (this.creator) {
      window.history.replaceState({}, '', `/me`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      window.history.replaceState({}, '', `/project/${this.project._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  },

  _addLocation (place) {
    let existingPlace = this.places.find(p => p.googlePlaceId === place.googlePlaceId)
    if (!existingPlace) {
      this.dispatch('savePlace', place)
    }
    this._addToCollection(place._id, 'updated.locations')
    this.$['place-input'].value = ''
  },

  _removeLocation (e) {
    this.set('updated.locations', this.updated.locations.filter(placeId => placeId !== e.model.placeId))
  },

  _onGoogleMapsApiLoad () {
    this.autocomplete = new google.maps.places.Autocomplete(this.$['place-input'])
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._placeChanged.bind(this))
  },

  _placeChanged () {
    let googlePlace = this.autocomplete.getPlace()
    if (googlePlace.place_id) {
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
      this._addLocation(place)
    }
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
