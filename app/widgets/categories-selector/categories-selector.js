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
        type: Array,
        observer: '_selectionChanged'
      },
      initialSetActiveDone: {
        type: Boolean,
        value: false
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

  _selectionChanged (selection) {
    if (selection && !this.initialSetActiveDone) {
      selection.forEach(categoryId => {
        let button = this.$$(`paper-button#${categoryId}`)
        if (button && !button.active) button.set('active', true)
      })
      this.set('initialSetActiveDone', true)
      this.updateStyles()
    }
  }

  _toggleCategory (e) {
    if (this.selection.includes(e.model.item.id)) {
      this.set('selection', this.selection.filter(s => s !== e.model.item.id))
    } else {
      this.set('selection', [...this.selection, e.model.item.id])
    }
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: this.selection }))
  }
}
window.customElements.define(CategoriesSelector.is, CategoriesSelector)
