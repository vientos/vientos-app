Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    toggleCategory (categoryId) {
      return {
        type: 'TOGGLE_CATEGORY',
        categoryId
      }
    },
    clearCategoriesFilter () {
      return {
        type: 'CLEAR_CATEGORIES_FILTER'
      }
    },
    toggleCollaborationType (collaborationTypeId) {
      return {
        type: 'TOGGLE_COLLABORATION_TYPE',
        collaborationTypeId
      }
    },
    clearCollaborationTypesFilter () {
      return {
        type: 'CLEAR_COLLABORATION_TYPES_FILTER'
      }
    }
  },
  properties: {
    categoriesFilter: {
      type: Array,
      statePath: 'categoriesFilter'
    },
    collaborationTypesFilter: {
      type: Array,
      statePath: 'collaborationTypesFilter'
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

  _toggleCategory (event) {
    this.dispatch('toggleCategory', event.model.item.categoryId)
  },

  _clearCategoriesFilter () {
    this.dispatch('clearCategoriesFilter')
  },

  _toggleCollaborationType (event) {
    this.dispatch('toggleCollaborationType', event.model.item.collaborationTypeId)
  },

  _clearCollaborationTypesFilter () {
    this.dispatch('clearCollaborationTypesFilter')
  },

  _goBack () {
    window.history.back()
  }

})
