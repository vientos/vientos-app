/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    updateFilteredCategories: ActionCreators.updateFilteredCategories,
    clearCategoriesFilter: ActionCreators.clearCategoriesFilter,
    toggleCollaborationType: ActionCreators.toggleCollaborationType,
    clearCollaborationTypesFilter: ActionCreators.clearCollaborationTypesFilter,
    toggleFilterFollowings: ActionCreators.toggleFilterFollowings
  },

  properties: {
    categories: {
      type: Array,
      statePath: 'categories'
    },
    filteredCategories: {
      type: Array,
      statePath: 'filteredCategories'
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    language: {
      type: String,
      statePath: 'language'
    },
    resources: {
      type: Object,
      statePath: 'labels'
    }
  },

  _iconFor: util.iconFor,

  _selectionChanged (e, selection) {
    this.dispatch('updateFilteredCategories', selection)
  },

  _clearCategoriesFilter () {
    this.dispatch('updateFilteredCategories', [])
  },

  _toggleCollaborationType (e) {
    this.dispatch('toggleCollaborationType', e.model.item.id)
  },

  _clearCollaborationTypesFilter () {
    this.dispatch('clearCollaborationTypesFilter')
  },

  _filterFollowings () {
    this.dispatch('toggleFilterFollowings')
  }

})
