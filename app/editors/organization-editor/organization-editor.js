import { ReduxMixin, ActionCreators, util, mintUrl } from '../../../src/engine.js'

class OrganizationEditor extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'organization-editor' }

  static get actions () {
    return {
      saveProject: ActionCreators.saveProject,
      savePlace: ActionCreators.savePlace,
      uploadImage: ActionCreators.uploadImage
    }
  }

  static get properties () {
    return {
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
      admins: {
        type: Array,
        computed: '_getRef(updated.admins, people)'
      },
      potentialAdmins: {
        type: Array,
        computed: '_getPotentialAdmins(project, people)'
      },
      newAdmin: {
        type: String,
        value: null
      },
      addingNewAdmin: {
        type: Boolean,
        value: false
      },
      places: {
        type: Array,
        statePath: 'places'
      },
      people: {
        type: Array,
        statePath: 'people'
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
      categories: {
        type: Array,
        statePath: 'categories'
      },
      readyToSave: {
        type: Boolean,
        computed: '_readyToSave(hasChages, updated.name, updated.description)',
        value: false
      },
      hasChages: {
        type: Boolean,
        computed: '_hasChanges(project, updated, newImage, newContact, newLink, updated.name, updated.description, updated.categories, updated.locations, updated.contacts, updated.links, updated.admins)',
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

  _getPlaceAddress (...args) { return util.getPlaceAddress(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }
  _getRef (...args) {
    if (Array.from(arguments).includes(undefined)) return undefined
    try {
      return util.getRef(...args)
    } catch (e) {
      return undefined
    }
  }

  _projectChanged () {
    this._reset()
    this._makeClone()
  }

  _makeClone () {
    if (this.project) {
      let updated = Object.assign({}, this.project)
      this.set('updated', updated)
    }
  }

  _addToCollection (element, collectionPath) {
    if (element === '' || this.get(collectionPath).includes(element)) return
    this.set(collectionPath, [...this.get(collectionPath), element])
  }

  _addContact () {
    this._addToCollection(this.newContact, 'updated.contacts')
    this.set('newContact', '')
  }

  _removeContact (e) {
    this.set('updated.contacts', this.updated.contacts.filter(l => l !== e.model.item))
  }

  _addLink () {
    // TODO validate URLs
    if (this.newLink && !this.newLink.match(/https?:\/\//)) this.set('newLink', 'http://' + this.newLink)
    this._addToCollection(this.newLink, 'updated.links')
    this.set('newLink', '')
  }

  _removeLink (e) {
    this.set('updated.links', this.updated.links.filter(l => l !== e.model.item))
  }

  _categoriesSelectionChanged (e, selection) {
    this.set('updated.categories', selection)
  }

  _reset () {
    this.set('newImage', null)
    this.set('newContact', '')
    this.set('newLink', '')
    this.$$('place-picker').reset()
    this.$$('image-picker').reset()
    if (this.project) {
      this._makeClone()
    } else {
      this._createNewProject(this.creator)
    }
  }

  _save () {
    // in case person didn't click 'Add'
    this._addContact()
    this._addLink()
    this.dispatch('saveProject', this.updated, this.newImage)
    // we use replaceState to avoid when edting and going to project page, that back button take you to edit again
    window.history.replaceState({}, '', `/project/${this.updated._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
    this._reset()
  }

  _getPotentialAdmins (project, people) {
    if (!project || !people) return []
    return people.filter(person => !project.admins.includes(person._id))
  }

  _startAddingAdmin () {
    this.set('addingNewAdmin', true)
  }

  _cancelAddingAdmin () {
    this.set('addingNewAdmin', false)
  }

  _setNewAdmin (e, detail) {
    this.set('newAdmin', detail.item.name)
  }

  _addNewAdmin () {
    this.set('updated.admins', [...new Set([...this.project.admins, this.newAdmin])])
    this.set('addingNewAdmin', false)
  }

  _readyToSave (hasChages, name, description) {
    return !!name && !!description && hasChages
  }

  _hasChanges (project, updated, newImage, newLink, newContact) {
    if (!project) return true
    return !util.deepEqual(project, updated) || newImage || newLink || newContact
  }

  _createNewProject (creator) {
    if (creator) {
      this.set('updated', {
        _id: mintUrl({ type: 'Project' }),
        type: 'Project',
        admins: [creator._id],
        categories: [],
        links: [],
        contacts: [],
        locations: [],
        logo: null
      })
    }
  }

  _cancel () {
    this._reset()
    if (this.creator) {
      window.history.replaceState({}, '', `/me`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      window.history.replaceState({}, '', `/project/${this.project._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
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
}
window.customElements.define(OrganizationEditor.is, OrganizationEditor)
