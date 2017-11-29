import { ReduxMixin, ActionCreators, util } from '../../../src/engine.js'

class ReviewEditor extends Polymer.mixinBehaviors(
  [Polymer.AppLocalizeBehavior],
  ReduxMixin(
    Polymer.GestureEventListeners(Polymer.Element)
  )) {
  static get is () { return 'review-editor' }

  static get actions () {
    return {
      addReview: ActionCreators.addReview
    }
  }

  static get properties () {
    return {
      person: {
        type: Object,
        statePath: 'person'
      },
      review: {
        type: Object
      },
      reviewBody: {
        type: String,
        value: ''
      },
      conversation: {
        type: Object
      },
      reviews: {
        type: Array,
        statePath: 'reviews'
      },
      conversationReviews: {
        type: Array,
        value: [],
        computed: '_filterConversationReviews(conversation, reviews)'
      },
      rating: {
        type: String,
        value: null
      },
      readyToSave: {
        type: Boolean,
        computed: '_readyToSave(rating, outcome, success)',
        value: false
      },
      outcome: {
        type: String,
        value: null
      },
      success: {
        type: Boolean,
        computed: '_computeSuccess(conversationReviews)'
      },
      hasChanges: {
        type: Boolean,
        computed: '_hasChanges(rating, outcome, reviewBody, success)',
        value: false
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

  _filterConversationReviews (...args) { return util.filterConversationReviews(...args) }

  _reset () {
    this.set('reviewBody', '')
    this.set('rating', null)
    this.set('outcome', null)
  }

  _readyToSave (rating, outcome, success) {
    return !!rating && (success !== null ? true : !!outcome)
  }

  _hasChanges (rating, outcome, reviewBody, success) {
    return rating !== null || (success !== null ? false : outcome !== null) || reviewBody !== ''
  }

  _whoReviews () {
    if (this.person._id === this.conversation.creator) {
      return 'creatorOrMatchingIntentAdmin'
    }
    if (!this.conversation.matchingIntent) {
      return 'causingIntentAdminReview'
    } else {
      // TODO
    }
  }

  _cancel () {
    this._reset()
    window.history.pushState({}, '', `/conversation/${this.conversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }

  _ratingChanged (e, detail) {
    if (detail.value) this.set('updated.language', detail.value)
  }

  _computeSuccess (conversationReviews) {
    if (!conversationReviews) return null
    return conversationReviews[0] ? conversationReviews[0].success : null
  }

  _save () {
    let review = {
      type: 'Review',
      creator: this.person._id,
      as: this._whoReviews(),
      body: this.reviewBody,
      conversation: this.conversation._id,
      causingIntent: this.conversation.causingIntent,
      rating: this.rating,
      success: this.success !== null ? this.success : this.outcome === 'succeeded'
    }
    if (this.conversation.matchingIntent) review.matchingIntent = this.conversation.matchingIntent
    this.dispatch('addReview', review)
    this._reset()
    window.history.pushState({}, '', `/conversation/${this.conversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
}
window.customElements.define(ReviewEditor.is, ReviewEditor)
