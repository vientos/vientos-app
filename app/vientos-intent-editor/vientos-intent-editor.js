/* global Polymer, ReduxBehavior, ActionCreators, CustomEvent */

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
    project: {
      type: Object,
      observer: '_createNewIntent'
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

  _saveIntent () {
    this.intent.title = this.$$('#intentTitle').value
    this.intent.collaborationType = this.collaborationType
    this.dispatch('saveIntent', this.intent)
    if (this.project) {
      window.history.pushState({}, '', `/project/${this.project._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    } else {
      window.history.pushState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
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
  },

  _createNewIntent () {
    if (this.project) {
      this.set('intent', {
        type: 'Intent',
        direction: 'offer',
        projects: [ this.project._id ]
      })
    }
  }

})
