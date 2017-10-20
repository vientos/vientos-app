import { ReduxMixin, util } from '../../../src/engine.js'

class OrganizationPreview extends ReduxMixin(
  Polymer.GestureEventListeners(Polymer.Element)
) {
  static get is () { return 'organization-preview' }

  static get properties () {
    return {
      organization: {
        type: Object
      },
      person: {
        type: Object,
        statePath: 'person'
      },
      places: {
        type: Object,
        statePath: 'places'
      },
      following: {
        type: Object,
        value: null,
        computed: '_checkIfFollows(person, organization)'
      }
    }
  }

  static get observers () {
    return [
      '_shaveDescription(organization.description)'
    ]
  }

  _checkIfFollows (...args) { return util.checkIfFollows(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _showFullProfile () {
    window.history.pushState({}, '', util.pathFor(this.organization, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _trimAddress (place, places) {
    if (!place || !places || !places.length) return
    return util.getRef(place, places).address.split(',').splice(0, 2).join(',')
  }

  _shaveDescription (description) {
    if (!description) return
    util.shave(this.$.description, 80)
  }
}

window.customElements.define(OrganizationPreview.is, OrganizationPreview)
