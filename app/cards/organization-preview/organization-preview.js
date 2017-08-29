/* global Polymer, ReduxBehavior, CustomEvent, util */

class OrganizationPreview extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(Polymer.Element)) {

  static get is () { return 'organization-preview' }

  static get properties () { return {
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
  } }

  _checkIfFollows (...args) { return window.vientos.util.checkIfFollows(...args) }
  _getThumbnailUrl (...args) { return window.vientos.util.getThumbnailUrl(...args) }

  _showFullProfile () {
    window.history.pushState({}, '', window.vientos.util.pathFor(this.organization, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}

window.customElements.define(OrganizationPreview.is, OrganizationPreview)
