import { Collection } from "../collection/collection";
import { Process } from "../processes/process";

export interface DataForm {
    id?: string;
    formName?: string;
    formCode?: string;
    formDescription?: string;
    process?: Process;
    collection?: Collection;
    formDefinition?: string;
}