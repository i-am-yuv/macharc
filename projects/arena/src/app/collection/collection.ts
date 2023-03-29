import { MicroService } from "../microservice/microservice";

export interface Collection {
    id?: string;
    collectionName?: string;
    customTableName?: string;
    cacheable?: boolean;
    microService?: MicroService
}
