import { MicroService } from '../microservice/microservice';

export interface BusinessLogic {
  id?: string;
  workflowCode?: string;
  workflowName?: string;
  workflowDefinition?: string;
  microService?: MicroService;
  generatedCode?: string;
}