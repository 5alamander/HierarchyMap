// this is a event package

var count = 0
const root = Symbol("root")

function HierarchyMapError(message) {
  this.name = "HierarchyMapError"
  this.message = message
  Error.captureStackTrace(this, this.constructor)
}

module.exports = class HierarchyMap {

  constructor() {
    count ++
    this._parentsMap = {}
    this._parentsMap[this.root] = null
    this._childrenMap = {}
  }

  static get count() {
    return count
  }

  static get error() {
    return HierarchyMapError
  }

  static get root() {
    return root
  }

  get root() {
    return root
  }

  // * @return {HierarchyMap}
  derive(tag, parent = root) {
    if (!this._parentsMap.hasOwnProperty(parent)) {
      throw new HierarchyMapError("No such parent in HierarchyMap: " + parent)
    }
    let parr = this._parentsMap[tag]
          || (this._parentsMap[tag] = new Set())
    let darr = this.descendants[parent]
          || (this._childrenMap[parent] = new Set())
    parr.add(parent)
    darr.add(tag)
    return this
  }

  // * @return {HierarchyMap}
  derives(tag, ...parents) {
    for (let p = 0; p < parents.length; p++) {
      this.derive(tag, parents[p])
    }
    return this
  }

  // underive

  // * @return {Set}
  parents(tag) {
    return this._parentsMap[tag]
  }

  // * @return {Set}
  children(tag) {
    return this._childrenMap[tag]
  }

  // * @return {Set}
  ancestors(tag) {
    let ret = new Set()
    ret.add(this.root)
    let recurGetP = (parr) => {
      if (parr.has(this.root)) return
      parr && parr.forEach(p => {
        recurGetP(this.parents(p))
        ret.add(p)
      })
    }
    recurGetP(this.parents(tag))
    return ret
  }

  // * @return {Array}
  ancestorsArray(tag) {
    let ret = Array.from(this.ancestors(tag)).reverse()
    return ret
  }

  // * @return {Set}
  descendants(tag) {
    // TODO
  }

  // * @return {Bool}
  isap(child, parent) {
    return this.ancestors(child).has(parent)
  }

}
