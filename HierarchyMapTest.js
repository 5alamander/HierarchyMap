// unit test
var _ = require('underscore')
var assert = require('assert')
var HierarchyMap = require('./HierarchyMap.js')

// test count
assert.equal(HierarchyMap.count, 0)
let _first_map_ = new HierarchyMap()
assert.equal(HierarchyMap.count, 1)

// basic
let amap = new HierarchyMap()
// root
assert.equal(amap.root, HierarchyMap.root)
// from root
amap.derive("parent").derive("sub", "parent")
assert(amap.isap("sub", "parent"))
assert(amap.isap("sub", amap.root))
assert(amap.isap("parent", amap.root))
// error
assert.throws(() => {
  amap.derive("a", "b")
}, (err) => {
  return (err instanceof HierarchyMap.error)
}, 'unexpected error')

// combine
amap.derive("atk")
amap.derive("fire-atk", "atk")
amap.derive("phy-atk", "atk")
amap.derives("fire-phy-atk", "fire-atk", "phy-atk")
assert(_.isEqual(amap.ancestorsArray("fire-phy-atk"),
              ["phy-atk", "fire-atk", "atk", amap.root]))

amap.derive("o")
amap.derive("a0", "o")
amap.derive("a1", "a0")
amap.derive("b0", "o")
amap.derive("b1", "b0")
amap.derives("ab", "a1", "b1")
assert(_.isEqual(amap.ancestorsArray("ab"),
              ["b1", "b0", "a1", "a0", "o", amap.root]))
assert(amap.ancestors('a0').has('o'))
assert(amap.ancestors('a0').has(amap.root))

// freeze this map
amap.freeze()
// assert throws when change
assert.throws(() => {
  amap.derive("c", "o")
}, (err) => {
  return (err instanceof HierarchyMap.error)
}, 'unexpected error')
// assert as the same before freezed
assert.equal(amap.ancestorsArray("fire-phy-atk").indexOf("phy-atk"), 0)
assert(_.isEqual(amap.ancestorsArray("fire-phy-atk"),
                 ["phy-atk", "fire-atk", "atk", amap.root]))
assert(_.isEqual(amap.ancestorsArray("ab"),
                 ["b1", "b0", "a1", "a0", "o", amap.root]))
assert(amap.ancestors('a0').has('o'))
assert(amap.ancestors('a0').has(amap.root))
assert.equal(amap.ancestors('unkown'), null)

// **
let em = new HierarchyMap([
  'action',
  ['interface'],
  ['p-action', 'action'],
  ['m-action', 'action'],
  ['mix-action', 'p-action', 'm-action', 'interface'],
  [1, 'p-action', 'm-action', 'interface'],
])
assert(em.ancestors('p-action').has('action'))
assert(em.ancestors('mix-action').has('p-action'))
assert.equal(em.ancestorsArray('mix-action').indexOf('interface'), 0)
assert(em.ancestors(1).has('p-action'))
