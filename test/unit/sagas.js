/* global describe, it */

import 'babel-polyfill'
import expect from '../expect'
import sagas from '../../src/sagas'

describe('imports', function () {
  it('is ok', function () {
    expect(sagas).be.ok()
  })
})
