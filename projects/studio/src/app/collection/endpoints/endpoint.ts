export interface endpoint {
    endpointName?: string;
    endpointPath?: string;
    endpointType?: string;
    description?: string;
    returnType?: string;
    // Stored as json
    pathVariables?: string;
}