const util = window.vientos.util

class PlaceDetails extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(Polymer.Element)) {
  static get is () { return 'place-details' }

  static get properties () {
    return {
      place: {
        type: Object,
        value: null
      },
      intents: {
        type: Array,
        statePath: 'intents'
      },
      organizations: {
        type: Array,
        statePath: 'projects'
      },
      placeIntents: {
        type: Array,
        computed: '_filterIntents(place, intents)'
      },
      placeOrganizations: {
        type: Array,
        computed: '_filterOrganizations(place, organizations)'
      }
    }
  }

  // TODO filter visible not all
  _filterIntents (place, intents) {
    if (!place || !intents) return []
    return intents.filter(intent => intent.locations.includes(place._id))
  }

  _filterOrganizations (place, projects) {
    if (!place || !projects) return []
    return projects.filter(project => project.locations.includes(place._id))
  }

  _back () {
    util.back('/projects')
  }
}
window.customElements.define(PlaceDetails.is, PlaceDetails)
