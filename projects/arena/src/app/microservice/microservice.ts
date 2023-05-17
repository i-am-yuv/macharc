import { Datasource } from "../datasource/datasource";

export interface MicroService {
    id?: string;
    microServiceCode?: string;
    microServiceName?: string;
    packageName?: string;
    packaging?: string;
    datasources?: Datasource[];
}