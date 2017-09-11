import { ReduxMixin, util } from '../../../src/engine.js'

class VientosGuide extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'vientos-guide' }

  static get properties () {
    return {
      section: {
        type: String,
        value: 'intro'
      }
    }
  }
}
window.customElements.define(VientosGuide.is, VientosGuide)
