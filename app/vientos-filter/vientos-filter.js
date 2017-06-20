/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    updateFilteredCategories: ActionCreators.updateFilteredCategories,
    updateFilteredCollaborationTypes: ActionCreators.updateFilteredCollaborationTypes,
    toggleFilterFollowings: ActionCreators.toggleFilterFollowings,
    toggleFilterFavorings: ActionCreators.toggleFilterFavorings,
    setLocationFilter: ActionCreators.setLocationFilter,
    toggleBoundingBoxFilter: ActionCreators.toggleBoundingBoxFilter
  },

  properties: {
    categories: {
      type: Array,
      statePath: 'categories'
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    locationFilter: {
      type: String,
      statePath: 'locationFilter'
    },
    boundingBoxFilter: {
      type: Boolean,
      statePath: 'boundingBoxFilter'
    },
    filteredCategories: {
      type: Array,
      statePath: 'filteredCategories'
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    filteredCollaborationTypes: {
      type: Array,
      statePath: 'filteredCollaborationTypes'
    },
    filteredFollowings: {
      type: Boolean,
      statePath: 'filteredFollowings'
    },
    filteredFavorings: {
      type: Boolean,
      statePath: 'filteredFavorings'
    },
    myActiveFiltersCount: {
      type: Number,
      computed: '_calculateMyActiveFiltersCount(filteredFavorings, filteredFollowings)'
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

  _iconFor: util.iconFor,

  _selectionChanged (e, selection) {
    this.dispatch('updateFilteredCategories', selection)
  },

  _clearCategoriesFilter () {
    this.dispatch('updateFilteredCategories', [])
    this.updateStyles()
  },

  _selectMyCategories () {
    this.dispatch('updateFilteredCategories', this.person.categories)
    this.updateStyles()
  },

  _collapseSection (e) {
    let section = Polymer.dom(e).path.find(element => element.localName === 'section')
    let collapser = section.getElementsByClassName('collapser')[0]
    let ironCollapse = section.getElementsByTagName('iron-collapse')[0]
    let icon = collapser.getElementsByTagName('iron-icon')[0]
    if (icon.icon === 'expand-more') icon.set('icon', 'expand-less')
    else icon.set('icon', 'expand-more')
    ironCollapse.toggle()
  },

  _toggleCollaborationType (e) {
    if (this.filteredCollaborationTypes.includes(e.model.item.id)) {
      this.set('filteredCollaborationTypes', this.filteredCollaborationTypes.filter(colType => colType !== e.model.item.id))
    } else {
      this.set('filteredCollaborationTypes', [...this.filteredCollaborationTypes, e.model.item.id])
    }
    this.dispatch('updateFilteredCollaborationTypes', this.filteredCollaborationTypes)
    this.updateStyles()
  },

  _clearCollaborationTypesFilter () {
    this.dispatch('updateFilteredCollaborationTypes', [])
  },

  _isCollaborationTypeSelected (collaborationType, filteredCollaborationTypes) {
    return filteredCollaborationTypes.includes(collaborationType.id)
  },

  _filterFollowings (e) {
    e.target.active = !e.target.active
    this.dispatch('toggleFilterFollowings')
    this.updateStyles()
  },

  _filterFavorings (e) {
    e.target.active = !e.target.active
    this.dispatch('toggleFilterFavorings')
    this.updateStyles()
  },

  _calculateMyActiveFiltersCount (filteredFavorings, filteredFollowings) {
    return Number(filteredFavorings) + Number(filteredFollowings)
  },

  _locationFilterChanged (e, detail) {
    if (this.locationFilter !== detail.item.name) this.dispatch('setLocationFilter', detail.item.name)
  },

  _boundingBoxButtonVisible (locationFilter) {
    return locationFilter === 'specific'
  },

  _locationFilterActive (locationFilter) {
    return Number(locationFilter !== 'all')
  },

  _toggleBoundingBoxFilter () {
    this.dispatch('toggleBoundingBoxFilter')
  }

})
