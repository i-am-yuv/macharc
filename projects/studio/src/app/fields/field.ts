import { Collection } from "../collection/collection";

export interface Field {
    id?: string;
    fieldName?: string;
    dataType?: string;
    validation?: string;
    pattern?: string;
    collection: Collection;
}
