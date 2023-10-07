import { Datasource } from "../datasource/datasource";

export interface MicroService {
    repoGroup?: string;
    repoName?: string;
    id?: string;
    microServiceCode?: string;
    microServiceName?: string;
    packageName?: string;
    packaging?: string;
    portNumber?: string;
    datasources?: Datasource[];
    repoId?: string;
}