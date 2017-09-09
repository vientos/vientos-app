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
      following: {
        type: Object,
        value: null,
        computed: '_checkIfFollows(person, project)'
      }
    }
  }

  _checkIfFollows (...args) { return util.checkIfFollows(...args) }
  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _showFullProfile () {
    window.history.pushState({}, '', util.pathFor(this.organization, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}

window.customElements.define(OrganizationPreview.is, OrganizationPreview)
