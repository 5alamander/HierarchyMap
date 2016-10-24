declare module 'hierarchy-map' {
    type MapElement = string | number | symbol
    var HierarchyMap: {
        new (arr: Array<MapElement | Array<MapElement>>): HierarchyMap
        count: number
        root: symbol
    }
    interface HierarchyMap {
        freeze(): void
        ancestorsArray(type: MapElement): Array<MapElement>
        isap(type1: MapElement, type2: MapElement): boolean
        root: symbol
    }
    export = HierarchyMap
}
