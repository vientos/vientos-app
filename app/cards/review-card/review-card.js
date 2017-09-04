const util = window.vientos.util

class ReviewCard extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  window.vientos.ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'review-card' }

  static get properties () {
    return {
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
        value: false,
        reflectToAttribute: true
      },
      skipLink: {
        type: Boolean,
        value: false
      }
    }
  }

  _getName (...args) { return util.getName(...args) }
  _getImage (...args) { return util.getImage(...args) }

  _linksToConversation (review, myConversations, skipLink) {
    if (Array.from(arguments).includes(undefined)) return false
    return !skipLink && !!myConversations.find(conversation => conversation._id === review.conversation)
  }

  _handleTap () {
    if (this.linksToConversation) {
      window.history.pushState({}, '', util.pathFor(this.review.conversation, 'conversation'))
      window.dispatchEvent(new CustomEvent('location-changed'))
    }
  }
}
window.customElements.define(ReviewCard.is, ReviewCard)
