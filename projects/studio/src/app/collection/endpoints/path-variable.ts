import { Endpoint } from "./endpoint";

export interface PathVariable {
    id?: string;
    variableName?: string;
    variableType?: string;
    endpoint?: Endpoint;
}
