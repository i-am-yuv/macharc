import { MicroService } from "../microservice/microservice";

export interface Process {
    id?: string;
    processCode?: string;
    processName?: string;
    processDescription?: string;
    microService?: MicroService;
    processDefinition?: string;
}
