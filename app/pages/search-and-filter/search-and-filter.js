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

  _selectMyCategories () {
    this.dispatch('updateFilteredCategories', this.person.categories)
    this.updateStyles()
  }

  _collapseSection (e) {
    let section = Polymer.dom(e).path.find(element => element.localName === 'section')
    let collapser = section.getElementsByClassName('collapser')[0]
    let ironCollapse = section.getElementsByTagName('iron-collapse')[0]
    let icon = collapser.getElementsByTagName('iron-icon')[0]
    if (icon.icon === 'vientos:expand-more') icon.set('icon', 'vientos:expand-less')
    else icon.set('icon', 'vientos:expand-more')
    ironCollapse.toggle()
  }

  _toggleCollaborationType (e) {
    let button = Polymer.dom(e).path.find(element => element.localName === 'paper-button')
    let collaborationType = button.getAttribute('name')
    button.active = !button.active
    if (this.filteredCollaborationTypes.includes(collaborationType)) {
      this.set('filteredCollaborationTypes', this.filteredCollaborationTypes.filter(colType => colType !== collaborationType))
    } else {
      this.set('filteredCollaborationTypes', [...this.filteredCollaborationTypes, collaborationType])
    }
    this.dispatch('updateFilteredCollaborationTypes', this.filteredCollaborationTypes)
    this.updateStyles()
  }

  _clearCollaborationTypesFilter (e) {
    this.dispatch('updateFilteredCollaborationTypes', [])
    let ironCollapse = Polymer.dom(e).path.find(element => element.localName === 'iron-collapse')
    ironCollapse.querySelectorAll('vientos-icon-button').forEach(button => button.set('active', false))
    this.updateStyles()
  }

  _isCollaborationTypeSelected (collaborationType, filteredCollaborationTypes) {
    return filteredCollaborationTypes.includes(collaborationType.id)
  }
}
window.customElements.define(SearchAndFilter.is, SearchAndFilter)
