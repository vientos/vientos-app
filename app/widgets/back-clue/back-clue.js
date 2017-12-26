import { util } from '../../../src/engine.js'

class BackClue extends Polymer.Element {
  static get is () { return 'back-clue' }

  static get properties () {
    return {
      history: {
        type: Array
      },
      list: {
        type: String,
        computed: '_computeList(history)'
      },
      organization: {
        type: Object,
        computed: '_computeOrganization(history)'
      },
      proposal: {
        type: Object,
        computed: '_computeProposal(history)'
      }
    }
  }

  _getThumbnailUrl (...args) { return util.getThumbnailUrl(...args) }

  _computeList (history) {
    if (history.length === 1) {
      return history[0].page === 'project' ? 'organization' : 'intent'
    } else return null
  }
  _computeOrganization (history) {
    if (history.length > 1) {
      let entity = history[history.length - 2].entity
      return entity && entity.type === 'Project' ? entity : null
    } else return null
  }
  _computeProposal (history) {
    if (history.length > 1) {
      let entity = history[history.length - 2].entity
      return entity && entity.type === 'Intent' ? entity : null
    } else return null
  }
}
window.customElements.define(BackClue.is, BackClue)
