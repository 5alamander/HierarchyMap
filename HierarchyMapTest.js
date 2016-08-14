function eqArry(a, b) {
  if (a.size !== b.size) return false
  for (let i = 0; i < a.size; i++){
    if (a[i] !== b[i]) return false
  }
  return true
}

// unit test
var assert = require('assert')
var HierarchyMap = require('./HierarchyMap.js')

// test count
assert.equal(HierarchyMap.count, 0)
let _ = new HierarchyMap()
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
assert(eqArry(amap.ancestorsArray("fire-phy-atk"),
              ["phy-atk", "fire-atk", "atk", amap.root]))

amap.derive("o")
amap.derive("a0", "o")
amap.derive("a1", "a0")
amap.derive("b0", "o")
amap.derive("b1", "b0")
amap.derives("ab", "a1", "b1")
assert(eqArry(amap.ancestorsArray("ab"),
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
assert(eqArry(amap.ancestorsArray("fire-phy-atk"),
              ["phy-atk", "fire-atk", "atk", amap.root]))
assert(eqArry(amap.ancestorsArray("ab"),
              ["b1", "b0", "a1", "a0", "o", amap.root]))
assert(amap.ancestors('a0').has('o'))
assert(amap.ancestors('a0').has(amap.root))
