/* global Polymer */

Polymer({
  is: 'vientos-icon-button',

  properties: {
    text: {
      type: String
    },
    icon: {
      type: String
    },
    raised: Boolean,
    toggles: Boolean,
    active: {
      type: Boolean,
      reflectToAttribute: true
    }
  }

})
