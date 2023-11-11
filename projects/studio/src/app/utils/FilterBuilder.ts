export class FilterBuilder {

    static build(cols: any[], searchString: string) {
        let filterstr = '';
        let filters: string[] = [];
        cols.forEach((key) => {
            filters.push(key + " ~ '%" + searchString + "%'");
        })
        filterstr += encodeURIComponent(filters.join(' or '));
        return filterstr;
    }

    static equal(col: string, searchString: string) {
        const filterstr = col + " : '" + searchString + "'";
        return encodeURIComponent(filterstr);
    }

    static boolEqual(col: string, value: boolean) {
        const filterstr = col + " : " + value + "";
        return encodeURIComponent(filterstr);
    }
}