/* global Polymer, ReduxBehavior, util */

Polymer({
  is: 'review-card',
  behaviors: [ReduxBehavior],

  properties: {
    review: {
      // passed from parent
      type: Object
    },
    people: {
      type: Array,
      statePath: 'people'
    }
  },

  _getName: util.getName,
  _getImage: util.getImage
})
