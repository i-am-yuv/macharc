import { MicroService } from "../microservice/microservice";

export interface Report {
    id?: string;
    reportName?: string;
    reportCode?: string;
    reportDescription?: string;
    reportDefinition?: string;
    microService?: MicroService;
}