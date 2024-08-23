import { Collection } from "../collection/collection";
import { Process } from "../processes/process";

export interface Screen {
    id?: string;
    screenName?: string;
    screenCode?: string;
    screenDescription?: string;
    process?: Process;
    collection?: Collection;
    screenDefinition?: string;
    microService ?: any;
    selectedParams ?: PageParam[] ;
}

export interface PageParam {
    id?: string;
    dataType?: string;
    varName?: string ;
}