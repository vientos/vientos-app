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
  }

  _previous () {
    let index = this.sections.indexOf(this.section)
    this.set('section', this.sections[index - 1])
  }

  _next () {
    let index = this.sections.indexOf(this.section)
    this.set('section', this.sections[index + 1])
  }
}
window.customElements.define(VientosGuide.is, VientosGuide)
