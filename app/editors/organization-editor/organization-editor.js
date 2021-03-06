import { ReduxMixin, ActionCreators, util, mintUrl } from '../../../src/engine.js'

class OrganizationEditor extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'organization-editor' }

  static get actions () {
    return {
      saveProject: ActionCreators.saveProject
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
        value: null,
        notify: true
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
      addingLocation: {
        type: Boolean,
        value: false
      },
      places: {
        type: Array,
        statePath: 'places'
      },
      person: {
        type: Array,
        statePath: 'person'
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
        computed: '_readyToSave(hasChanges, updated.name, updated.description, updated.locations)',
        value: false
      },
      hasChanges: {
        type: Boolean,
        computed: '_hasChanges(project, updated, newImage, newContact, newLink, updated.categories, updated.name, updated.description, updated.locations, updated.contacts, updated.links, updated.admins)',
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

  _projectChanged (project, oldProject) {
    if (project && (!this.updated || !util.deepEqual(project, oldProject))) {
      this._reset()
    }
  }

  _makeClone () {
    let updated = util.cloneDeep(this.project)
    this.set('updated', updated)
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
    this.notifyPath('updated.categories')
  }

  _reset () {
    this.set('newImage', null)
    this.set('newContact', '')
    this.set('newLink', '')
    let placePicker = this.$$('place-picker')
    if (placePicker) placePicker.reset()
    this.$$('image-picker').reset()
    this.set('updated', null)
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

  _startAddingLocation () {
    this.set('addingLocation', true)
  }

  _cancelAddingAdmin () {
    this.set('addingNewAdmin', false)
  }

  _cancelAddingLocation () {
    this.set('addingLocation', false)
  }

  _setNewAdmin (e, detail) {
    this.set('newAdmin', detail.item.name)
  }

  _addNewAdmin () {
    this.set('updated.admins', [...new Set([...this.project.admins, this.newAdmin])])
    this.set('addingNewAdmin', false)
  }

  _readyToSave (hasChanges, name, description, locations) {
    return !!name && !!description && hasChanges && locations.length
  }

  _hasChanges (project, updated, newImage, newLink, newContact, cats) {
    if (!project && updated) {
      return updated.categories.length > 0 ||
      updated.links.length > 0 ||
      updated.contacts.length > 0 ||
      updated.locations.length > 0 ||
      updated.logo ||
      newImage ||
      newLink ||
      newContact
    }
    let diff = !util.deepEqual(project, updated)
    return diff || newImage || newLink || newContact
  }

  _createNewProject (creator) {
    if (creator && !this.updated) {
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
      window.history.replaceState({}, '', `/`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      window.history.replaceState({}, '', `/project/${this.project._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }

  _removeLocation (e) {
    this.set('updated.locations', this.updated.locations.filter(placeId => placeId !== e.model.placeId))
    this.notifyPath('updated.locations')
  }

  _placePicked (e) {
    this._addToCollection(e.detail, 'updated.locations')
    this.set('addingLocation', false)
  }

  _imagePicked (e) {
    this.set('newImage', e.detail)
  }

  _mySelf (person, admin) {
    if (!person) return
    return person._id === admin._id
  }

  _removeMySelfAsAdmin (e) {
    this.set('updated.admins', this.updated.admins.filter(l => l !== e.model.item._id))
  }

  _singleAdmin (admins) {
    if (!admins || !admins.length) return
    return admins.length === 1
  }
}
window.customElements.define(OrganizationEditor.is, OrganizationEditor)
