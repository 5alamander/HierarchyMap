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
console.log(amap.ancestorsArray("fire-phy-atk"))
