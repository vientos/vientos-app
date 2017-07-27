/* global Polymer, ReduxBehavior, CustomEvent, util */

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
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    linksToConversation: {
      type: Boolean,
      computed: '_linksToConversation(review, myConversations, skipLink)',
      value: false
    },
    skipLink: {
      type: Boolean,
      value: false
    }
  },

  _getName: util.getName,
  _getImage: util.getImage,

  _linksToConversation (review, myConversations, skipLink) {
    return !skipLink && !!myConversations.find(conversation => conversation._id === review.conversation)
  },

  _handleTap () {
    if (this.linksToConversation) {
      window.history.pushState({}, '', util.pathFor(this.review.conversation, 'conversation'))
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }
})
