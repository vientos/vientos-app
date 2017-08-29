/* global Polymer, ActionCreators */

const ActionCreators = window.vientos.ActionCreators

class SearchAndFilter extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(Polymer.Element)) {

  static get is () { return 'search-and-filter' }

  static get actions () { return {
    updateFilteredCategories: ActionCreators.updateFilteredCategories,
    updateFilteredCollaborationTypes: ActionCreators.updateFilteredCollaborationTypes,
    toggleFilterFollowings: ActionCreators.toggleFilterFollowings,
    toggleFilterFavorings: ActionCreators.toggleFilterFavorings,
    setLocationFilter: ActionCreators.setLocationFilter,
    toggleBoundingBoxFilter: ActionCreators.toggleBoundingBoxFilter
  } }

  static get properties () { return {
    categories: {
      type: Array,
      statePath: 'categories'
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    locationFilter: {
      type: String,
      statePath: 'locationFilter'
    },
    boundingBoxFilter: {
      type: Boolean,
      statePath: 'boundingBoxFilter'
    },
    filteredCategories: {
      type: Array,
      statePath: 'filteredCategories'
    },
    filteredCollaborationTypes: {
      type: Array,
      statePath: 'filteredCollaborationTypes'
    },
    filteredFollowings: {
      type: Boolean,
      statePath: 'filteredFollowings'
    },
    filteredFavorings: {
      type: Boolean,
      statePath: 'filteredFavorings'
    },
    myActiveFiltersCount: {
      type: Number,
      computed: '_calculateMyActiveFiltersCount(filteredFavorings, filteredFollowings)'
    },
    language: {
      type: String,
      statePath: 'language'
    },
    resources: {
      type: Object,
      statePath: 'labels'
    }
  } }

  _iconFor(...args) { return window.vientos.util.iconFor(...args) }

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
    if (icon.icon === 'expand-more') icon.set('icon', 'expand-less')
    else icon.set('icon', 'expand-more')
    ironCollapse.toggle()
  }

  _toggleCollaborationType (e) {
    let button = Polymer.dom(e).path.find(element => element.localName === 'vientos-icon-button')
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

  _filterFollowings (e) {
    e.target.active = !e.target.active
    this.dispatch('toggleFilterFollowings')
    this.updateStyles()
  }

  _filterFavorings (e) {
    e.target.active = !e.target.active
    this.dispatch('toggleFilterFavorings')
    this.updateStyles()
  }

  _calculateMyActiveFiltersCount (filteredFavorings, filteredFollowings) {
    return Number(filteredFavorings) + Number(filteredFollowings)
  }

  _locationFilterChanged (e, detail) {
    if (this.locationFilter !== detail.item.name) this.dispatch('setLocationFilter', detail.item.name)
  }

  _boundingBoxButtonVisible (locationFilter) {
    return locationFilter === 'specific'
  }

  _locationFilterActive (locationFilter) {
    return Number(locationFilter !== 'all')
  }

  _toggleBoundingBoxFilter () {
    this.dispatch('toggleBoundingBoxFilter')
  }

}
window.customElements.define(SearchAndFilter.is, SearchAndFilter)
