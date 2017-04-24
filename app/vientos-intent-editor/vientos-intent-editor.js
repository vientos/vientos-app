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
    conditions: {
      type: Array,
      value: [
        'gift',
        'share'
      ]
    },
    expiryDate: {
      type: String,
      value: () => {
        return new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    },
    expiryMinDate: {
      type: String,
      value: () => {
        return new Date().toISOString().split('T')[0]
      }
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
    this.intent.condition = this.condition
    this.intent.expiryDate = this.expiryDate
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

  _setCollaborationCondition (e, detail) {
    this.condition = detail.item.name
  },

  _createNewIntent () {
    if (this.project) {
      this.set('intent', {
        type: 'Intent',
        direction: 'offer',
        condition: 'gift',
        projects: [ this.project._id ]
      })
    }
  },

  ready () {
    window.editor = this
    this.$.datepicker.set('i18n.firstDayOfWeek', 1)
    // this.$.datepicker.set('i18n.formatDate', (date) => { return date.toLocaleDateString() })
  }

})
