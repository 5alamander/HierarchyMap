declare module 'hierarchy-map' {
    var HierarchyMap: {
        new(arr: Array<string|Array<string>>): HierarchyMap
        root: symbol
    }
    interface HierarchyMap {
        isap(type1: string, type2: string|symbol): boolean
        root: symbol
    }
    export = HierarchyMap
}