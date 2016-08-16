// this is a event package

var count = 0
const rootSymbol = Symbol("root")

function HierarchyMapError(message) {
  this.name = "HierarchyMapError"
  this.message = message
  Error.captureStackTrace(this, this.constructor)
}

class HierarchyMapBase {

  constructor() {
    count ++
    this._parentsMap = {}
    this._parentsMap[this.root] = null
    this._childrenMap = {}
  }

  // * @return {HierarchyMap}
  derive(tag, parent = rootSymbol) {
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
    let ps = this.parents(tag)
    if (!ps) return null
    recurGetP(ps)
    return ret
  }

  // * @return {Array}
  ancestorsArray(tag) {
    let ret = Array.from(this.ancestors(tag)).reverse()
    return ret
  }

  // * @return {Set}
  descendants(tag) {
    // TODO may be the same as ancestors
    // used in a dynamic HierarchyMap
    // TODO define the underive also
    throw new Error('not implement')
  }

  // * @return {Bool}
  isap(child, parent) {
    return this.ancestors(child).has(parent)
  }

}

module.exports = class HierarchyMap extends HierarchyMapBase {

  static get count() {
    return count
  }

  static get error() {
    return HierarchyMapError
  }

  static get root() {
    return rootSymbol
  }

  get root() {
    return rootSymbol
  }

  constructor(initList = null) {
    super()
    this._isFreezed = false
    this._ancestorsCache = {}
    this._ancestorsArrayCache = {}
    this._descendantsCache = {}

    if (initList) this.createWithList(initList)
  }

  freeze() {
    this._isFreezed = true
  }

  // * @return {HierarchyMap}
  derive(tag, parent) {
    if (this._isFreezed) {
      throw new HierarchyMapError("this hierarchy is freezed")
    }
    return super.derive(tag, parent)
  }

  // * @return {HierarchyMap}
  derives(tag, ...parents) {
    if (this._isFreezed) {
      throw new HierarchyMapError("this hierarchy is freezed")
    }
    return super.derives(tag, ...parents)
  }

  // * @return {Set}
  ancestors(tag) {
    if (this._isFreezed) {
      let ret = this._ancestorsCache[tag] || super.ancestors(tag)
      this._ancestorsCache[tag] = ret
      return ret
    }
    else {
      return super.ancestors(tag)
    }
  }

  // * @return {Array}
  ancestorsArray(tag) {
    if (this._isFreezed) {
      let ret = this._ancestorsArrayCache[tag] || super.ancestorsArray(tag)
      this._ancestorsArrayCache[tag] = ret
      return ret
    }
    else {
      return super.ancestorsArray(tag)
    }
  }

  // * @return {Set}
  descendants(tag) {
    if (this._isFreezed) {
      let ret = this._descendantsCache[tag] || super.descendants(tag)
      this._descendantsCache[tag] = ret
      return ret
    }
    else {
      return super.descendants(tag)
    }
  }

  createWithList(lst) {
    if (!lst instanceof Array) {
      throw new HierarchyMapError("create HierarchyMap with list: input is not a list")
    }
    for (let item of lst) {
      if (typeof(item) === 'string') {
        this.derive(item)
      }
      else if (item instanceof Array) {
        if (item.length === 1) this.derive(item[0])
        if (item.length > 1) this.derives(item[0], ...item.slice(1))
      }
    }
  }
}
