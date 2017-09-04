class CategoriesSelector extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(Polymer.Element)) {
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

  _iconFor (...args) { return window.vientos.util.iconFor(...args) }

  _isInSelected (category, selection) {
    return selection && selection.includes(category.id)
  }

  _toggleCategory (e) {
    e.target.active = !e.target.active
    if (this.selection.includes(e.model.item.id)) {
      this.set('selection', this.selection.filter(s => s !== e.model.item.id))
    } else {
      this.set('selection', [...this.selection, e.model.item.id])
    }
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: this.selection }))
    this.updateStyles()
  }
}
window.customElements.define(CategoriesSelector.is, CategoriesSelector)
