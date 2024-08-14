import { MicroService } from "../microservice/microservice";

export interface Collection {
    id?: string;
    collectionName?: string;
    customTableName?: string;
    cacheable?: boolean;
    microService?: MicroService;
    crud?: boolean;
    readonly?: boolean;
    hasService?: boolean;
    requestDto ?: RequestDto ;
    responseDto ?: ResponseDto ;

}

export interface RequestDto{
    id ?: string ;
    dtoClassName ?: string;
}

export interface ResponseDto{
    id ?: string ;
    dtoClassName ?: string;
}
