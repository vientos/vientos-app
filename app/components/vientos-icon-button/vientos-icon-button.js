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
    active: {
      type: Boolean,
      reflectToAttribute: true
    },
    raised: Boolean
  }

})
