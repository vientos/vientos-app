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

  _sectionChanged (section, prevSection) {
    if (!this.sections.includes(section)) return
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
    if (window.location.hash) {
      this.$$('app-header').set('fixed', true)
      setTimeout(() => {
        let scrollTarget = this.$[window.location.hash.slice(1)]
        if (scrollTarget) {
          scrollTarget.scrollIntoView()
          window.scrollBy(0, -100)
        }
      }, 200)
    }
    if (!window.location.hash || !this.$$(`[name=${section}] ${window.location.hash}`)) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      this.$$('app-header').set('fixed', false)
      window.history.replaceState({}, '', `/guide/${section}`)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }

  _previous () {
    let index = this.sections.indexOf(this.section)
    // this.set('section', this.sections[index - 1])
    window.history.replaceState({}, '', `/guide/${this.sections[index - 1]}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _next () {
    let index = this.sections.indexOf(this.section)
    // this.set('section', this.sections[index + 1])
    window.history.replaceState({}, '', `/guide/${this.sections[index + 1]}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _close () {
    window.history.back()
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(VientosGuide.is, VientosGuide)
