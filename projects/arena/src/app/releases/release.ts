export interface Release {
    name?: string;
    tag_name?: string;
    description?: string;
    created_at?: Date;
    released_at?: Date;
    upcoming_release?: boolean;
    commit?: any;
    commit_path?: string;
    tag_path?: string;
    assets?: any;
}