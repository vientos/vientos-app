import { ReduxMixin, ActionCreators, util, mintUrl } from '../../../src/engine.js'

class StartConversation extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'start-conversation' }

  static get actions () {
    return {
      startConversation: ActionCreators.startConversation
    }
  }

  static get properties () {
    return {
      intent: {
        type: Object,
        observer: '_intentChanged'
      },
      person: {
        type: Object,
        statePath: 'person'
      },
      projects: {
        type: Object,
        statePath: 'projects'
      },
      intents: {
        type: Object,
        statePath: 'intents'
      },
      potentialMatches: {
        type: Array,
        computed: '_findPotentialMatches(person, projects, intents, intent)'
      },
      answer: {
        type: Object,
        computed: '_setAnswer(conversation)'
      },
      selectingMatch: {
        type: Boolean,
        value: false
      },
      online: {
        type: Boolean,
        statePath: 'online'
      },
      language: {
        type: String,
        statePath: 'language'
      },
      resources: {
        type: Object,
        statePath: 'labels'
      }
    }
  }

  static get observers () {
    return [
      '_createConversation(person, intent)'
    ]
  }

  _findPotentialMatches (...args) { return util.findPotentialMatches(...args) }

  _intentChanged () {
    this._reset()
    // this._createConversation()
  }

  _send () {
    this.conversation.messages.push(this.answer)
    this.dispatch('startConversation', this.conversation)
    this._reset()
    window.history.pushState({}, '', `/conversation/${this.conversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _reset () {
    this.set('answer.body', '')
    this.set('selectingMatch', false)
    // set inputs to empty
  }

  _setMatchingIntent (e, detail) {
    this.set('conversation.matchingIntent', detail.item.name)
  }

  _createConversation (person, intent) {
    if (person && intent) {
      this.set('conversation', {
        _id: mintUrl({ type: 'Conversation' }),
        type: 'Conversation',
        creator: person._id,
        causingIntent: intent._id,
        messages: []
      })
    }
  }

  _setAnswer (conversation) {
    return {
      type: 'Message',
      body: '',
      creator: this.person._id,
      ourTurn: false
    }
  }

  _toggleSelectingMatch () {
    this.set('selectingMatch', !this.selectingMatch)
  }

  _cancel () {
    this._reset()
    window.history.pushState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(StartConversation.is, StartConversation)
