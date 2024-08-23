import { Collection } from '../collection/collection';
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
  name: string;
  code: string;
}

export interface Condition {
  firstValue: string;
  operator: string;
  secondValue?: Field | null;
  connector?: string;
  manualEntry?: boolean;
  manualEntryValue?: string;
}

export interface ConditionGroup {
  conditions: Condition[];
  connector?: string;
}

export interface CollectionObj {
  label: string;
  value: string;
  items: any;
}

export interface reqDtoMappedModel {
  reqDtoField: Field;
  mappedModelField: Field;
}

export interface pojoMappedModel {
  pojoField: Field;
  mappedModelField: Field;
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

export interface InputParam {
  dataType?: string;
  varName?: string;
  model?: Collection;
}
