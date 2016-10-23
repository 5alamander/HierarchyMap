declare module 'hierarchy-map' {
    var HierarchyMap: {
        new(arr: Array<string|Array<string>>): HierarchyMap
        count: number
        root: symbol
    }
    interface HierarchyMap {
        freeze():void
        ancestorsArray(type: string): Array<string|symbol>
        isap(type1: string, type2: string|symbol): boolean
        root: symbol
    }
    export = HierarchyMap
}