/* global describe, it */

import expect from '../expect'

import * as ActionTypes from '../../src/actionTypes'
import reducers from '../../src/reducers'

describe('language', function () {
  it('state has last set language', function () {
    let action = {
      type: ActionTypes.SET_LANGUAGE,
      language: 'es'
    }
    let state = reducers({ language: 'en' }, action)
    expect(state.language).to.equal(action.language)
  })
})
