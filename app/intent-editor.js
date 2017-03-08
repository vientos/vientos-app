/* global Polymer, ReduxBehavior, ActionCreators */

Polymer({
  is: 'vientos-intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    saveIntent: ActionCreators.saveIntent,
    deleteIntent: ActionCreators.deleteIntent
  },

  properties: {
    intent: {
      type: Object
    },
    toggled: {
      type: Boolean,
      computed: '_checkIfToggled(intent)'
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

  _checkIfToggled (intent) {
    return intent && intent.direction === 'request'
  },

  _toggleDirection () {
    this.set('intent.direction', this.intent.direction === 'offer' ? 'request' : 'offer')
  },

  _setCollaborationType (e, detail) {
    this.collaborationType = detail.item.name
  }

})
