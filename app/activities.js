Polymer({
  is: 'vientos-activities',
  behaviors: [ ReduxBehavior ],

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
    collaborationTypesFilter: {
      type: Array,
      statePath: 'collaborationTypesFilter',
      observer: '_collaborationTypesFilterChanged'
    },
    visibleActivities: {
      type: Array,
      value: []
      // TODO make computed property (activities, collaborationTypesFilter)
    }
  },

  _projectsChanged () {
    this.set('visibleActivities', this.activities)
  },

  _extractActivities (projects) {
    return projects.reduce((acc, project) => {
      // TODO: move normalization to reducer
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
  }

})
