import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class AccountSettings extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'account-settings' }

  static get actions () {
    return {
      savePerson: ActionCreators.savePerson
    }
  }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person',
        observer: '_personChanged'
      },
      updated: {
        type: Object
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
        computed: '_hasChanges(person, updated, newImage, updated.name, updated.language, updated.emailNotifications)',
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

  _personChanged () {
    this._reset()
    this._makeClone()
  }

  _makeClone () {
    if (this.person) {
      let updated = util.cloneDeep(this.person)
      this.set('updated', updated)
    }
  }

  _reset () {
    this.set('newImage', null)
    this.$$('image-picker').reset()
  }

  _readyToSave (hasChanges, name) {
    return !!name && !!hasChanges
  }

  _hasChanges (person, updated, newImage) {
    return !util.deepEqual(person, updated) || !!newImage
  }

  _save () {
    this.dispatch('savePerson', this.updated, this.newImage)
    this._reset()
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _cancel () {
    this._reset()
    window.history.pushState({}, '', `/`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _languageChanged (e, detail) {
    if (detail.value) this.set('updated.language', detail.value)
  }

  _toggleEmailNotifications (e) {
    this.set('updated.emailNotifications', !this.updated.emailNotifications)
  }

  _imagePicked (e) {
    this.set('newImage', e.detail)
  }
}
window.customElements.define(AccountSettings.is, AccountSettings)
