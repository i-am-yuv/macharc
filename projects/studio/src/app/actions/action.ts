import { MicroService } from "../microservice/microservice";
import { PageParam } from "../screen/screen";

export class Actions {
    id ?: string;
    actionName ?: string ;
    actionType ?: string ;
    taskDefinition ?: string ;
    actionTasks ?: ActionTask[] ;
    microService  ?: MicroService
}

export class ActionTask {
    id ?: string;
    variableName ?: string ;
    expression ?: string ;
    taskDefinition ?: string ;
    action ?: Actions ;
}

export class MappedParamsObj {
    pageParam ?: PageParam ;
    mappedValue ?: any ;
}