import { MicroService } from "../microservice/microservice";

export interface Workflow {
    id?: string;
    workflowCode?: string;
    workflowName?: string;
    workflowDefinition?: string;
    microService?: MicroService;
}
