/* global Polymer, ReduxBehavior, CustomEvent, ActionCreators, google */

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
    googleMapsApiKey: {
      type: String,
      value: 'AIzaSyAj1ARlapCB3msLX9lAVD1h0S1fpfaosOg'
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
    window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _cancel () {
    window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _getMainLocation () {
    console.log(this.project.locations[0])
    return this.project.locations[0].address
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
  }

})
