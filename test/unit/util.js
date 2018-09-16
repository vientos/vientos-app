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
