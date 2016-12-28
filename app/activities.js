Polymer({
  is: 'vientos-activities',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    toggleCollaborationType (collaborationTypeId) {
      return {
        type: 'TOGGLE_COLLABORATION_TYPE',
        collaborationTypeId: collaborationTypeId
      }
    },
    clearFilter (collaborationTypeId) {
      return {
        type: 'CLEAR_COLLABORATION_TYPES_FILTER',
        collaborationTypeId: collaborationTypeId
      }
    }
  },

  properties: {
    projects: {
      type: Array,
      statePath: 'projects',
      observer: '_projectsChanged'
    },
    activities: {
      type: Array,
      computed: '_extractActivities(projects)'
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    collaborationTypesFilter: {
      type: Array,
      statePath: 'collaborationTypesFilter',
      observer: '_collaborationTypesFilterChanged'
    },
    visibleActivities: {
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
    this.set('visibleActivities', this.activities)
  },

  _extractActivities (projects) {
    return projects.reduce((acc, project) => {
      // TODO: move to reducer
      if (!project.needs) project.needs = []
      if (!project.offers) project.offers = []
      return acc.concat([
        ...project.needs.map(need => ({title: need.title, type: need.type, direction: 'need', project: project})),
        ...project.offers.map(offer => ({title: offer.title, type: offer.type, direction: 'offer', project: project}))
      ])
    }, [])
  },

  _collaborationTypesFilterChanged () {
    let collaborationTypesFilter = this.collaborationTypesFilter
    if (collaborationTypesFilter.every(filter => !filter.selected)) {
      this.set('visibleActivities', this.activities)
    } else {
      this.set('visibleActivities', this.activities.filter(activity => {
        return collaborationTypesFilter.some(filter => filter.selected && filter.collaborationTypeId === activity.type)
      }))
    }
  },

  _toggleCollaborationType (event) {
    this.dispatch('toggleCollaborationType', event.model.item.collaborationTypeId)
  },

  _clearFilter () {
    this.dispatch('clearFilter')
  }

})
