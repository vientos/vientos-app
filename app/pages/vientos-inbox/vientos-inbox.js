import { ReduxMixin, util } from '../../../src/engine.js'

class VientosInbox extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'vientos-inbox' }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person'
      },
      loginProviders: {
        type: String,
        statePath: 'loginProviders'
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

  _back () {
    window.history.pushState({}, '', '/intents')
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(VientosInbox.is, VientosInbox)
