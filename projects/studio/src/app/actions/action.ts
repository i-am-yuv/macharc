export class Actions {
    id ?: string;
    actionName ?: string ;
    actionType ?: string ;
    actionTasks ?: ActionTask[] ;
}

export class ActionTask {
    id ?: string;
    variableName ?: string ;
    expression ?: string ;
    taskDefinition ?: string ;
    action ?: Actions ;
}