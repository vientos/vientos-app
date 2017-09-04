/* global Polymer */

class VientosIconButton extends Polymer.Element {
  static get is () { return 'vientos-icon-button' }

  static get properties () {
    return {
      text: {
        type: String
      },
      icon: {
        type: String
      },
      raised: Boolean,
      toggles: Boolean,
      active: {
        type: Boolean,
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        reflectToAttribute: true
      }
    }
  }
}
window.customElements.define(VientosIconButton.is, VientosIconButton)
