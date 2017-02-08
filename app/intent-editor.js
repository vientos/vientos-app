Polymer({
  is: 'vientos-intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    createIntent () {
      return {
        type: window.vientos.ActionTypes.CREATE_INTENT_REQUESTED,
        intent: {
          projects: [ this.projectId ],
          title: this.$$('#intentTitle').value,
          direction: this.direction,
          collaborationType: this.collaborationType
        }
      }
    }
  },

  properties: {
    projectId: {
      type: String
    },
    direction: {
      type: String,
      value: 'offer'
    },
    collaborationType: {
      type: String
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

  _createIntent () {
    this.dispatch('createIntent')
  },

  _toggleDirection () {
    this.direction = this.direction === 'offer' ? 'request' : 'offer'
    console.log(this.direction)
  },

  _setCollaborationType (e, detail) {
    this.collaborationType = detail.item.name
    console.log(this.collaborationType)
  }
})
