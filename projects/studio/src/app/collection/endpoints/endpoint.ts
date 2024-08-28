import { BusinessLogic } from '../../business-logic/business-logic';
import { Collection, RequestDto, ResponseDto } from '../collection';

export interface Endpoint {
  id?: string;
  endpointName?: string;
  endpointPath?: string;
  endpointType?: string;
  description?: string;
  returnType?: string;
  // Stored as json
  pathVariables?: any;
  api?: boolean;
  webclient?: boolean;
  webhook?: boolean;
  requestJson?: string;
  responseJson?: string;
  collection?: Collection;
  workflow?: BusinessLogic;
  requestDto?: RequestDto;
  responseDto?: ResponseDto;
}
