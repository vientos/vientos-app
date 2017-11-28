import { ReduxMixin } from '../../../src/engine.js'

class VientosGuide extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'vientos-guide' }

  static get properties () {
    return {
      section: {
        type: String,
        value: 'intro',
        observer: '_sectionChanged'
      },
      sections: {
        type: Array,
        value: ['intro', 'organizations', 'intents', 'search-and-filter', 'collaborations', 'my-account']
      },
      showingFirstSection: {
        type: Boolean
      },
      showingLastSection: {
        type: Boolean
      },
      person: {
        type: Object,
        statePath: 'person'
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

  _sectionChanged (section) {
    if (section === 'intro') {
      this.set('showingFirstSection', true)
    } else {
      this.set('showingFirstSection', false)
    }
    if (section === 'my-account') {
      this.set('showingLastSection', true)
    } else {
      this.set('showingLastSection', false)
    }
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  _previous () {
    let index = this.sections.indexOf(this.section)
    this.set('section', this.sections[index - 1])
  }

  _next () {
    let index = this.sections.indexOf(this.section)
    this.set('section', this.sections[index + 1])
  }

  _close () {
    window.history.pushState({}, '', `/intents`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(VientosGuide.is, VientosGuide)
