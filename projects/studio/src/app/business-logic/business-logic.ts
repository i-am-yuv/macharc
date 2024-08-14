import { Field } from '../fields/field';
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
  manualEntry?: boolean;

}

export interface ConditionGroup {
  conditions: Condition[];
  connector?: string;
}

export interface CollectionObj{
 label : string ;
  value : string ;
  items :[] ;
}

export interface reqDtoMappedModel{
  reqDtoField : Field ;
  mappedModelField : Field ;
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