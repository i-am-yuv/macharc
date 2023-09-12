import { Collection } from "../../collection/collection";

export interface QueryDefinition {
    primaryCollection?: Collection | undefined;
    secondaryCollections?: Collection[];
    measures?: Measure[];
    dimensions?: string[];
}

export interface Measure {
    measureName?: string | undefined;
    measureType?: MeasureType;
}
export interface QueryFilter {
    isDynamic?: boolean;
    condition?: string;
    fieldName?: string;
    operatorType?: string;
}
enum MeasureType {
    COUNT = 'COUNT',
    SUM = 'SUM',
    AVERAGE = 'AVERAGE'
}

