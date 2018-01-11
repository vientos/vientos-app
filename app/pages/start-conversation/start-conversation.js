import { ReduxMixin, ActionCreators, mintUrl } from '../../../src/engine.js'

class StartConversation extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'start-conversation' }

  static get actions () {
    return {
      saveConversation: ActionCreators.saveConversation
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
      answer: {
        type: Object,
        computed: '_setAnswer(conversation)'
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

  _intentChanged () {
    this._reset()
    // this._createConversation()
  }

  _send () {
    this.conversation.messages.push(this.answer)
    this.dispatch('saveConversation', this.conversation)
    window.history.pushState({}, '', `/conversation/${this.conversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
    this._reset()
  }

  _reset () {
    this.set('answer.body', '')
    // set inputs to empty
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
      creator: this.person._id
    }
  }

  _cancel () {
    this._reset()
    window.history.pushState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(StartConversation.is, StartConversation)
