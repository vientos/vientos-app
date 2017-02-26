/* global describe, it */

import 'babel-polyfill'
import { expect } from 'chai'

import sagas from '../../src/sagas'

describe('imports', function () {
  it('is ok', function () {
    expect(sagas).to.be.ok
  })
})
