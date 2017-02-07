Polymer({
  is: 'vientos-project-profile',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    follow (personId, projectId) {
      return {
        type: window.vientos.ActionTypes.FOLLOW_REQUESTED,
        personId,
        projectId
      }
    },
    unfollow (personId, projectId) {
      return {
        type: window.vientos.ActionTypes.UNFOLLOW_REQUESTED,
        personId,
        projectId
      }
    }
  },

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    admin: {
      type: Boolean,
      value: false,
      computed: '_checkIfAdmin(person, project)'
    },
    projectId: {
      type: String
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    project: {
      type: Object,
      computed: '_findProject(projectId, projects)'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    projectIntents: {
      type: Array,
      value: [],
      computed: '_filterIntents(intents)'
    },
    followed: {
      type: Boolean,
      computed: '_followedByPerson(projectId, person)'
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

  _findProject (projectId, projects) {
    return projects.find(p => p._id === this.projectId)
  },

  _followedByPerson (projectId, person) {
    return person && person.follows && person.follows.includes(projectId)
  },

  _checkIfAdmin (person, project) {
    return person && project && project.admins && project.admins.includes(person._id)
  },

  _filterIntents (intents) {
    return intents.filter(intent => intent.projects.includes(this.projectId))
  },

  _goBack () {
    window.history.back()
  },

  _follow () {
    this.dispatch('follow', this.person._id, this.projectId)
  },

  _unfollow () {
    this.dispatch('unfollow', this.person._id, this.projectId)
  }

})
