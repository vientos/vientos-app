/* global Polymer, ReduxBehavior, ActionCreators */

Polymer({
  is: 'vientos-intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    createIntent: ActionCreators.createIntent,
    updateIntent: ActionCreators.updateIntent,
    deleteIntent: ActionCreators.deleteIntent
  },

  properties: {
    projectId: {
      type: String
    },
    intent: {
      type: Object
    },
    intentDirection: {
      type: Boolean,
      computed: '_setIntentDirection(intent)'
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

  _createOrUpdateIntent () {
    if (this.intent._id) {
      this.intent.title = this.$$('#intentTitle').value
      this.intent.direction = this.direction
      this.intent.collaborationType = this.collaborationType
      this.dispatch('updateIntent', this.intent)
    } else {
      this.dispatch('createIntent', {
        projects: [ this.projectId ],
        title: this.$$('#intentTitle').value,
        direction: this.direction,
        collaborationType: this.collaborationType
      })
    }
    this.set('intent', {})
    this._reset()
  },

  _deleteIntent () {
    this.dispatch('deleteIntent', this.intent)
    this.set('intent', {})
    this._reset()
  },

  _reset () {
    this.fire('reset')
  },

  _setIntentDirection (intent) {
    return intent && intent.direction === 'offer'
  },

  _toggleDirection () {
    this.direction = this.direction === 'offer' ? 'request' : 'offer'
  },

  _setCollaborationType (e, detail) {
    this.collaborationType = detail.item.name
  }

})
