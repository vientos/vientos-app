/* global Polymer, ReduxBehavior */

Polymer({
  is: 'vientos-projects',
  behaviors: [ ReduxBehavior ],

  properties: {
    projects: {
      // filtered list passed as property
      type: Array
    }
  }

})
