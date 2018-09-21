import * as util from '../../src/util'

describe('pathFor', () => {
  test.skip('throws when parameter missing', () => {})
  let cuid = 'cff16af5-a09c-4669-8424-5eeb9afc3e79'
  let prefix = 'https://example.org/organizations/'
  let iri = prefix + cuid
  let type = 'organizations'
  let path = `/${type}/${cuid}`

  test('returns correct path for string IRI', () => {
    expect(util.pathFor(iri, type)).toEqual(path)
  })
  test('returns correct path for object', () => {
    let entity = {
      _id: iri
    }
    expect(util.pathFor(entity, type)).toEqual(path)
  })
})

describe('compareIdentifiers', () => {
  test.skip('throws when parameter missing', () => {})

  let cuid = '3c10155e-ba1b-4cc0-ba16-8a7f4ef17be5'
  let prefix = 'https://example.org/places/'
  let iri = prefix + cuid

  test('works with matching IRI', () => {
    expect(util.compareIdentifiers(iri, iri)).toBeTruthy()
  })
  test('works with non matching IRI', () => {
    expect(util.compareIdentifiers(iri, prefix + '6fb466eb-ae11-496a-a2b4-dcc3c9f9c0b6')).toBeFalsy()
  })
  test('works with matching CUID', () => {
    expect(util.compareIdentifiers(cuid, iri)).toBeTruthy()
  })
  test('works with non matching CUID', () => {
    expect(util.compareIdentifiers('d74be7e1-5ebc-4aee-b015-adf3e5515ca3', iri)).toBeFalsy()
  })
})

describe('getRef', () => {
  test.skip('throws when parameter missing', () => {})
  let prefix = 'https://example.org/places/'
  let first = prefix + 'bc53384e-96cf-40c7-9e03-7f8d72498abc'
  let second = prefix + '15b867d1-9c4d-420c-995c-37706ac00eb6'
  let entityIds = [
    first,
    second
  ]
  let notExisting = prefix + '4d368e30-0e5c-456f-82df-224a8b490d39'
  let firstMatching = { _id: first }
  let secondMatching = { _id: second }
  let collection = [
    { _id: prefix + 'bbe14304-221d-438a-860a-6eb200b26fe7' },
    { _id: prefix + 'bbcf7cf9-aca6-41a5-a8ee-d2bd319db3a8' },
    firstMatching,
    { _id: prefix + '5b90c7e9-c399-466d-bfb1-ad6bd3dd7f10' },
    secondMatching
  ]
  let allMatching = [firstMatching, secondMatching]
  test('works with single IRI', () => {
    expect(util.getRef(first, collection)).toEqual(firstMatching)
  })
  test('works with multiple IRIs', () => {
    expect(util.getRef(entityIds, collection)).toEqual(allMatching)
  })
  test('throws error entitities not in collection', () => {
    expect(() => util.getRef(notExisting, collection)).toThrowError()
    expect(() => util.getRef([...entityIds, notExisting], collection)).toThrowError()
  })
})
