import { MicroService } from "../microservice/microservice";

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