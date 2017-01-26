Polymer({
  is: 'vientos-project-profile',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    follow (projectId) {
      return {
        type: window.vientos.ActionTypes.FOLLOW_REQUESTED,
        projectId
      }
    },
    unfollow (projectId) {
      return {
        type: window.vientos.ActionTypes.UNFOLLOW_REQUESTED,
        projectId
      }
    }
  },

  properties: {
    account: {
      type: Object,
      statePath: 'account'
    },
    uuid: {
      type: String
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    project: {
      type: Object,
      computed: '_findProject(uuid, projects)'
    },
    followed: {
      type: Boolean,
      computed: '_followedByAccount(uuid, account)'
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

  _findProject (uuid, projects) {
    return projects.find(p => p._id === this.uuid)
  },

  _followedByAccount (uuid, account) {
    return account && account.follows && account.follows.includes(uuid)
  },

  _goBack () {
    window.history.back()
  },

  _follow () {
    this.dispatch('follow', this.uuid)
  },

  _unfollow () {
    this.dispatch('unfollow', this.uuid)
  }

})
