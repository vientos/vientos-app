Polymer({
  is: 'vientos-projects',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    toggleCategory (categoryId) {
      return {
        type: 'TOGGLE_CATEGORY',
        categoryId: categoryId
      }
    },
    clearFilter (categoryId) {
      return {
        type: 'CLEAR_CATEGORIES_FILTER',
        categoryId: categoryId
      }
    }
  },

  properties: {
    projects: {
      type: Array,
      statePath: 'projects',
      observer: '_projectsChanged'
    },
    categories: {
      type: Array,
      statePath: 'categories'
    },
    categoriesFilter: {
      type: Array,
      statePath: 'categoriesFilter',
      observer: '_categoriesFilterChanged'
    },
    visibleProjects: {
      type: Array,
      value: []
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

  _projectsChanged () {
    this.set('visibleProjects', this.projects.slice())
  },

  _categoriesFilterChanged () {
    if (this.categoriesFilter.every(f => !f.selected)) {
      this.set('visibleProjects', this.projects.slice())
    } else {
      this.set('visibleProjects', this.projects.filter(project => {
        return project.categories.some(category => {
          return this.categoriesFilter.some(filter => {
            return filter.selected && filter.categoryId === category.catId
          })
        })
      }))
    }
  },

  _toggleCategory (event) {
    this.dispatch('toggleCategory', event.model.item.categoryId)
  },

  _clearFilter () {
    this.dispatch('clearFilter')
  }

})
