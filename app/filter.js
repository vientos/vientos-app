/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    toggleCategory: ActionCreators.toggleCategory,
    clearCategoriesFilter: ActionCreators.clearCategoriesFilter,
    toggleCollaborationType: ActionCreators.toggleCollaborationType,
    clearCollaborationTypesFilter: ActionCreators.clearCollaborationTypesFilter
  },

  properties: {
    categories: {
      type: Array,
      statePath: 'categories'
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

  _toggleCategory (event) {
    this.dispatch('toggleCategory', event.model.item.id)
  },

  _clearCategoriesFilter () {
    this.dispatch('clearCategoriesFilter')
  },

  _toggleCollaborationType (event) {
    this.dispatch('toggleCollaborationType', event.model.item.id)
  },

  _clearCollaborationTypesFilter () {
    this.dispatch('clearCollaborationTypesFilter')
  }

})
