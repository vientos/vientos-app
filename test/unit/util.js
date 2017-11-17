/* global describe, it */

import expect from '../expect'
import { hasLocationsInBoundingBox } from '../../src/util'

describe('imports', function () {
  it('is ok', function () {
    expect(hasLocationsInBoundingBox).to.be.ok()
  })
})
