/* global describe, it */

import { expect } from 'chai'

import { locationsInBoundingBox } from '../../src/util'

describe('imports', function () {
  it('is ok', function () {
    expect(locationsInBoundingBox).to.be.ok
  })
})
