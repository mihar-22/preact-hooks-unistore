import shallowEqual from '../shallowEqual'

describe('shallowEqual', () => {
  it('should return true given equal object properties', () => {
    const objA = {
      a: 0,
      b: '',
      c: 'apples',
      d: 10,
      e: false
    }

    const objB = {
      a: 0,
      b: '',
      c: 'apples',
      d: 10,
      e: false
    }

    expect(shallowEqual(objA, objB)).toBeTruthy()
  })

  it('should return false given an unequal property', () => {
    const objA = {
      a: 0,
      b: 5
    }

    const objB = {
      a: 0,
      b: 10
    }

    expect(shallowEqual(objA, objB)).toBeFalsy()
  })

  it('should return false given unequal object lengths', () => {
    const objA = {
      a: 0
    }

    const objB = {
      a: 0,
      b: 5
    }

    expect(shallowEqual(objA, objB)).toBeFalsy()
  })
})
