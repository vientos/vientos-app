/* global Polymer, ReduxBehavior, CustomEvent */

Polymer({
  is: 'vientos-footer',

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    page: {
      type: String,
      observer: '_pageChanged'
    },
    buttons: {
      type: Array,
      value: ['filter', 'projects', 'intents']
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    intents: {
      type: Array,
      statePath: 'intents'
    },
    filterActive: {
      type: Boolean,
      computed: '_activeFilter(projects, intents, visibleProjectsCount, visibleIntentsCount)',
      observer: '_highlightBadges'
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

  _highlightBadges (newVal) {
    console.log(this.$$('vientos-icon-button[name=projects]').className)
    let projectsBtn = this.$$('vientos-icon-button[name=projects]')
    let intentsBtn = this.$$('vientos-icon-button[name=intents]')
    if ((newVal && !projectsBtn.className.includes('filtered')) || (!newVal && projectsBtn.className.includes('filtered'))) {
      projectsBtn.toggleClass('filtered')
      intentsBtn.toggleClass('filtered')
      this.updateStyles()
    }
  },

  _activeFilter (projects, intents, visibleProjectsCount, visibleIntentsCount) {
    return projects.length !== visibleProjectsCount || intents.length !== visibleIntentsCount
  },

  _pageChanged (page) {
    if (this.buttons.includes(page)) {
      if (page === 'projects' && window.location.pathname === '/') return
      if (page === 'intents' && window.location.pathname === '/intents') return
      // if (page === 'map' && window.location.search   !== '') return
      let pathname = page === 'projects' ? '/' : `/${page}`
      window.history.pushState({}, '', pathname)
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }
})
