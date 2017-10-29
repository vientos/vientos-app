/* global fetch, FormData */
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux'
import PolymerRedux from 'polymer-redux'
import {
  ActionTypes,
  ActionCreators as ClientActionCreators,
  DataReducers,
  createSagaMiddleware,
  clientFactory,
  sagaFactory
} from 'vientos-client'
import * as AppActionCreators from './actionCreators'
import * as AppReducers from './reducers'
import * as util from './util'

const config = require('../config.json')

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducer = combineReducers({
  loginProviders: DataReducers.loginProviders,
  projects: DataReducers.projects,
  categories: DataReducers.categories,
  people: DataReducers.people,
  places: DataReducers.places,
  person: DataReducers.person,
  myConversations: DataReducers.myConversations,
  notifications: DataReducers.notifications,
  session: DataReducers.session,
  intents: DataReducers.intents,
  reviews: DataReducers.reviews,
  filteredCategories: AppReducers.filteredCategories,
  filteredCollaborationTypes: AppReducers.filteredCollaborationTypes,
  searchTerm: AppReducers.searchTerm,
  filteredFollowings: AppReducers.filteredFollowings,
  filteredFavorings: AppReducers.filteredFavorings,
  locationFilter: AppReducers.locationFilter,
  boundingBoxFilter: AppReducers.boundingBoxFilter,
  boundingBox: AppReducers.boundingBox,
  language: AppReducers.language,
  labels: AppReducers.labels,
  online: AppReducers.online
})

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

const handleLatest = [
  ActionTypes.FETCH_PROJECTS_REQUESTED,
  ActionTypes.FETCH_PLACES_REQUESTED,
  ActionTypes.FETCH_CATEGORIES_REQUESTED,
  ActionTypes.FETCH_REVIEWS_REQUESTED,
  ActionTypes.FETCH_INTENTS_REQUESTED,
  ActionTypes.FETCH_PERSON_REQUESTED,
  ActionTypes.FETCH_PEOPLE_REQUESTED,
  ActionTypes.FETCH_MY_CONVERSATIONS_REQUESTED,
  ActionTypes.FETCH_NOTIFICATIONS_REQUESTED,
  ActionTypes.HELLO_REQUESTED,
  ActionTypes.BYE_REQUESTED,
  ActionTypes.SAVE_PERSON_REQUESTED,
  ActionTypes.SAVE_SUBSCRIPTION_REQUESTED
]

const handleEvery = [
  ActionTypes.FOLLOW_REQUESTED,
  ActionTypes.UNFOLLOW_REQUESTED,
  ActionTypes.FAVOR_REQUESTED,
  ActionTypes.UNFAVOR_REQUESTED,
  ActionTypes.SAVE_INTENT_REQUESTED,
  ActionTypes.SAVE_PROJECT_REQUESTED,
  ActionTypes.START_CONVERSATION_REQUESTED,
  ActionTypes.ADD_MESSAGE_REQUESTED,
  ActionTypes.ADD_REVIEW_REQUESTED,
  ActionTypes.SAVE_NOTIFICATION_REQUESTED,
  ActionTypes.SAVE_PLACE_REQUESTED
]

const client = clientFactory(config, fetch, FormData)
const saga = sagaFactory(client, handleLatest, handleEvery)
sagaMiddleware.run(saga)

const ReduxMixin = PolymerRedux(store)
const ActionCreators = Object.assign({}, ClientActionCreators, AppActionCreators)
const mintUrl = client.mintUrl
const channelUrl = client.channelUrl

export {
  ReduxMixin,
  ActionCreators,
  mintUrl,
  channelUrl,
  util,
  config
}
