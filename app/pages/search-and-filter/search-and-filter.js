import { ReduxMixin, ActionCreators } from '../../../src/engine.js'

class SearchAndFilter extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(Polymer.Element)) {
  static get is () { return 'search-and-filter' }

  static get actions () {
    return {
      updateFilteredCategories: ActionCreators.updateFilteredCategories,
      updateFilteredCollaborationTypes: ActionCreators.updateFilteredCollaborationTypes
    }
  }

  static get properties () {
    return {
      categories: {
        type: Array,
        statePath: 'categories'
      },
      collaborationTypes: {
        type: Array,
        value: ['work', 'usage', 'consumption', 'ownership']
      },
      person: {
        type: Object,
        statePath: 'person'
      },
      filteredCategories: {
        type: Array,
        statePath: 'filteredCategories'
      },
      filteredCollaborationTypes: {
        type: Array,
        statePath: 'filteredCollaborationTypes'
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

  _selectionChanged (e, selection) {
    this.dispatch('updateFilteredCategories', selection)
  }

  _clearCategoriesFilter () {
    this.dispatch('updateFilteredCategories', [])
    this.updateStyles()
  }

  _collaborationTypeSelectionChanged (e, detail) {
    this.dispatch('updateFilteredCollaborationTypes', e.target.selectedValues)
  }

  _clearCollaborationTypesFilter (e) {
    this.dispatch('updateFilteredCollaborationTypes', [])
    this.updateStyles()
  }
}
window.customElements.define(SearchAndFilter.is, SearchAndFilter)
