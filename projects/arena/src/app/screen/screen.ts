import { Collection } from "../collection/collection";
import { Process } from "../processes/process";

export interface Screen {
    id?: string;
    screenName?: string;
    screenCode?: string;
    screenDescription?: string;
    process?: Process;
    collection?: Collection;
}