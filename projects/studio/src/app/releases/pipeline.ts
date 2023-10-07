export interface Pipeline {
    id?: string;
    iid?: string;
    project_id?: string;
    sha?: string;
    ref?: string;
    status?: string;
    source?: string;
    created_at?: Date;
    updated_at?: Date;
    web_url?: string;
}