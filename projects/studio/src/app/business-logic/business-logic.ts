import { MicroService } from '../microservice/microservice';

export interface BusinessLogic {
  id?: string;
  workflowCode?: string;
  workflowName?: string;
  workflowDefinition?: string;
  microService?: MicroService;
  generatedCode?: string;
}
export interface City {
  name: string,
  code: string
}

export interface Condition {
  firstValue: string;
  operator: string;
  secondValue: string;
  connector?: string;
}

export interface ConditionGroup {
  conditions: Condition[];
  connector?: string;
}

// interface Condition {
//   firstValue: string;
//   operator: string;
//   secondValue: string;
//   connector?: string;
// }

// interface ConditionGroup {
//   conditions: Condition[];
//   connector?: string;
// }