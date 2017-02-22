Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    toggleCategory (id) {
      return {
        type: 'TOGGLE_CATEGORY',
        id
      }
    },
    clearCategoriesFilter () {
      return {
        type: 'CLEAR_CATEGORIES_FILTER'
      }
    },
    toggleCollaborationType (id) {
      return {
        type: 'TOGGLE_COLLABORATION_TYPE',
        id
      }
    },
    clearCollaborationTypesFilter () {
      return {
        type: 'CLEAR_COLLABORATION_TYPES_FILTER'
      }
    }
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
  },

  _iconFor (item) {
    return 'vientos:' + item.id
  },

  ready () {
    console.log( this.resources )
  }

})
