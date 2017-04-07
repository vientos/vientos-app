/* global Polymer, ReduxBehavior, util */

Polymer({
  is: 'vientos-categories-selector',

  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  properties: {
    categories: {
      // from parent
      type: Array
    },
    selection: {
      type: Array
      // observer: '_selectionChanged'
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

  observers: [
    'log(categories)'
  ],

  _iconFor: util.iconFor,

  log () {
    console.log('categories', this.categories)
  },

  _selectionChanged () {
    this.fire('selection-changed', this.selection)
  },

  _isInSelected (category) {
    return this.selection.includes(category.id)
  },

  _toggleCategory (e) {
    if (this.selection.includes(e.model.item.id)) {
      this.set('selection', this.selection.filter(s => s !== e.model.item.id))
    } else {
      this.set('selection', [...this.selection, e.model.item.id])
    }
    this._selectionChanged()
  }
})
