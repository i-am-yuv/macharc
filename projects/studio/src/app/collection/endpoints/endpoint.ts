import { BusinessLogic } from '../../business-logic/business-logic';

export interface Endpoint {
  id?: string;
  endpointName?: string;
  endpointPath?: string;
  endpointType?: string;
  description?: string;
  returnType?: string;
  // Stored as json
  pathVariables?: string;
  api: boolean;
  webclient: boolean;
  webhook: boolean;
  requestJson: string;
  responseJson: string;
  workflow: BusinessLogic;
}