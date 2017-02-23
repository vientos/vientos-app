/* global Polymer, ReduxBehavior */

Polymer({
  is: 'vientos-intent-editor',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],
  actions: {
    createIntent (intent) {
      return {
        type: window.vientos.ActionTypes.CREATE_INTENT_REQUESTED,
        intent: {
          projects: [ this.projectId ],
          title: this.$$('#intentTitle').value,
          direction: this.direction,
          collaborationType: this.collaborationType
        }
      }
    },
    updateIntent (intent) {
      intent.title = this.$$('#intentTitle').value
      intent.direction = this.direction
      intent.collaborationType = this.collaborationType
      return {
        type: window.vientos.ActionTypes.UPDATE_INTENT_REQUESTED,
        intent
      }
    },
    deleteIntent (intentId) {
      return {
        type: window.vientos.ActionTypes.DELETE_INTENT_REQUESTED,
        intentId
      }
    }

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
      this.dispatch('updateIntent', this.intent)
    } else {
      this.dispatch('createIntent')
    }
    this.set('intent', {})
    this._reset()
  },

  _deleteIntent () {
    this.dispatch('deleteIntent', this.intent._id)
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
