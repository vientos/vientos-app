/* global Polymer, ReduxBehavior, ActionCreators */

Polymer({
  is: 'vientos-intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveIntent: ActionCreators.saveIntent,
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
    this.intent.title = this.$$('#intentTitle').value
    this.intent.direction = this.direction
    this.intent.collaborationType = this.collaborationType
    this.dispatch('saveIntent', this.intent)
    this._reset()
  },

  _deleteIntent () {
    this.dispatch('deleteIntent', this.intent)
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
