import { ReduxMixin, ActionCreators } from '../../../src/engine.js'

class VientosInbox extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'vientos-inbox' }

  static get actions () {
    return {
      setResume: ActionCreators.setResume
    }
  }

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

  _close () {
    this.dispatch('setResume', null)
    window.history.back()
  }
}
window.customElements.define(VientosInbox.is, VientosInbox)
