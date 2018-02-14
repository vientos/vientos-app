import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class MatchEditor extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'match-editor' }

  static get actions () {
    return {
      match: ActionCreators.match
    }
  }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person'
      },
      intent: {
        type: Object
      },
      projects: {
        type: Array,
        statePath: 'projects'
      },
      intents: {
        type: Array,
        statePath: 'intents'
      },
      matchings: {
        type: Array,
        statePath: 'matchings'
      },
      potentialMatches: {
        type: Array,
        computed: '_findPotentialMatches(intent, person, projects, intents, matchings)'
      },
      matchingIntentId: {
        type: String,
        value: null
      },
      readyToSave: {
        type: Boolean,
        computed: '_readyToSave(person, intent, matchingIntentId)',
        value: false
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

  _findPotentialMatches (...args) { return util.findPotentialMatches(...args) }

  _reset () {
    this.set('matchingIntentId', null)
  }

  _readyToSave (person, intent, matchingIntentId) {
    return person && intent && matchingIntentId
  }

  _cancel () {
    this._reset()
    window.history.replaceState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _save () {
    if (!this.readyToSave) return
    let matching = {
      type: 'Matching',
      creator: this.person._id,
      intents: [this.intent._id, this.matchingIntentId]
    }
    this.dispatch('match', matching)
    this._reset()
    window.history.replaceState({}, '', `/intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(MatchEditor.is, MatchEditor)
