/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    updateFilteredCategories: ActionCreators.updateFilteredCategories,
    clearCategoriesFilter: ActionCreators.clearCategoriesFilter,
    toggleCollaborationType: ActionCreators.toggleCollaborationType,
    clearCollaborationTypesFilter: ActionCreators.clearCollaborationTypesFilter
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

  _selectionChanged (e, selected) {
    console.log('e', e)
    console.log('selected', selected)
    this.dispatch('updateFilteredCategories', selected)
    // this.dispatch('clearCategoriesFilter', selected)
  },

  _clearCategoriesFilter () {
    this.dispatch('clearCategoriesFilter')
  },

  _toggleCollaborationType (e) {
    this.dispatch('toggleCollaborationType', e.model.item.id)
  },

  _clearCollaborationTypesFilter () {
    this.dispatch('clearCollaborationTypesFilter')
  }

})
