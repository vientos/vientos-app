import { ReduxMixin } from '../../../src/engine.js'

class CategoriesSelector extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(Polymer.Element)) {
  static get is () { return 'categories-selector' }

  static get properties () {
    return {
      categories: {
      // from parent
        type: Array
      },
      selection: {
        type: Array
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

  _selectionChanged (e) {
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: e.target.selectedValues }))
  }
}
window.customElements.define(CategoriesSelector.is, CategoriesSelector)
