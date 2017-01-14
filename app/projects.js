Polymer({
  is: 'vientos-projects',
  behaviors: [ ReduxBehavior ],

  properties: {
    projects: {
      type: Array,
      statePath: 'projects',
      observer: '_projectsChanged'
    },
    categoriesFilter: {
      type: Array,
      statePath: 'categoriesFilter',
      observer: '_categoriesFilterChanged'
    },
    visibleProjects: {
      type: Array,
      value: []
      // TODO: make computed instead of observing filter
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

  _linkTo (project) {
    // TODO: unify with _projectSelected() in shell.js
    return 'project-profile/' + project._id
  }

})
