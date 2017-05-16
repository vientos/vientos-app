/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, google */

Polymer({
  is: 'vientos-edit-project-details',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveProject: ActionCreators.saveProject,
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

  _addToColection (element, collectionPath) {
    if (element === '' || this.get(collectionPath).includes(element)) return
    this.set(collectionPath, [...this.get(collectionPath), element])
  },

  _addContact () {
    this._addToColection(this.newContact, 'updated.contacts')
    this.set('newContact', '')
  },

  _removeContact (e) {
    this.set('updated.contacts', this.updated.contacts.filter(l => l !== e.model.item))
  },

  _addLink () {
    // TODO validate URLs
    this._addToColection(this.newLink, 'updated.links')
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
    this.$['new-image-form'].reset()
  },

  _save () {
    this.updated.locations.forEach(location => delete location.project)
    // in case person didn't click 'Add'
    this._addToColection(this.newContact, 'updated.contacts')
    this._addToColection(this.newLink, 'updated.links')

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

  _getImagePreviewSrc (project, newImage) {
    if (newImage) {
      return window.URL.createObjectURL(newImage)
    } else if (project) {
      return project.logo
    }
  }

})
