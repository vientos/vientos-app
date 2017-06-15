/* global Polymer, ReduxBehavior, ActionCreators,  CustomEvent, util */

Polymer({
  is: 'vientos-intent-page',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    favor: ActionCreators.favor,
    unfavor: ActionCreators.unfavor
  },

  properties: {
    person: {
      type: Object,
      statePath: 'person'
    },
    people: {
      type: Array,
      statePath: 'people'
    },
    reviews: {
      type: Array,
      statePath: 'reviews'
    },
    abortedReviewGroups: {
      type: Array,
      computed: '_reviewsOfAbortedConversations(intent, reviews)'
    },
    successfulReviewGroups: {
      type: Array,
      computed: '_reviewsOfSuccessfulConversations(intent, reviews)'
    },
    intent: {
      type: Object
    },
    favoring: {
      type: Object,
      value: null,
      computed: '_checkIfFavors(person, intent)'
    },
    conversations: {
      type: Array,
      computed: '_filterIntentConversations(intent, myConversations)'
    },
    myConversations: {
      type: Array,
      statePath: 'myConversations'
    },
    currentConversation: {
      type: Object,
      computed: '_currentConversation(person, admin, conversations)'
    },
    projects: {
      type: Array,
      statePath: 'projects'
    },
    places: {
      type: Array,
      statePath: 'places'
    },
    intentProjects: {
      type: Array,
      computed: '_getIntentProjects(intent, projects)'
    },
    admin: {
      type: Boolean,
      value: false,
      computed: '_checkIfAdmin(person, intentProjects)'
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

  _checkIfAdmin: util.checkIfAdmin,

  _checkIfFavors: util.checkIfFavors,

  _getIntentProjects: util.getIntentProjects,

  _filterIntentConversations: util.filterIntentConversations,

  _getRef: util.getRef,

  _getPlaceAddress: util.getPlaceAddress,

  // _getCollaborations (intent, collaborations) {
  //   if (!intent || !intent.collaborations || !collaborations) return
  //   return util.getRef(intent.collaborations, collaborations)
  // },

  _editIntent () {
    window.history.pushState({}, '', `/edit-intent/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _projectPageUrl (project) {
    return util.pathFor(project, 'project')
  },

  _startConversation () {
    window.history.pushState({}, '', `/new-conversation/${this.intent._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _continueConversation () {
    window.history.pushState({}, '', `/conversation/${this.currentConversation._id.split('/').pop()}`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _showConversations (admin, conversations) {
    return admin && conversations.length
  },

  _currentConversation (person, admin, conversations) {
    if (person && !admin && conversations.length) {
      return conversations.find(conversation => {
        return conversation.creator === person._id &&
          conversation.reviews.length < 2
      })
    } else {
      return false
    }
  },

  _showFab (person, admin) {
    return person && !admin
  },

  // _reviewsOfCollaboration (collaboration, reviews) {
  //   return reviews.filter(review => review.collaboration === collaboration._id)
  // },

  _reviewsOfAbortedConversations (intent, reviews) {
    if (!intent) return []
    return intent.abortedConversations.map(conversationId => {
      return reviews.filter(review => review.conversation === conversationId)
    })
  },

  _reviewsOfSuccessfulConversations (intent, reviews) {
    if (!intent) return []
    return intent.successfulConversations.map(conversationId => {
      return reviews.filter(review => review.conversation === conversationId)
    })
  },

  _canFavor (person, admin) {
    return person && !admin
  },

  _favor () {
    this.dispatch('favor', this.person, this.intent)
  },

  _unfavor () {
    this.dispatch('unfavor', this.favoring)
  },

  _showProjectProfile (e) {
    window.history.pushState({}, '', util.pathFor(e.model.project, 'project'))
    window.dispatchEvent(new CustomEvent('location-changed'))
  },

  _showLocationOnMap (e) {
    let place = util.getRef(e.model.placeId, this.places)
    window.history.pushState({}, '', `/map?latitude=${place.latitude}&longitude=${place.longitude}&zoom=15`)
    window.dispatchEvent(new CustomEvent('location-changed'))
  }
})
