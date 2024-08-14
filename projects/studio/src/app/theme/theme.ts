export interface Theme {
    id?: string;
    applicationId?: string;
    name?: string;
    code?: string;
    key?: string;
    custom?: boolean
}

export interface Font {
    id?: string;
    applicationId?: string;
    name?: string;
    key?: string;
    font?: string;
    size?: string;
    weight?: string;
    letterSpacing?: string;
    custom?: boolean;
}

export interface ThemeData {
    colorModels: Theme[],
    fontModels: Font[],
}

export interface FontWeight {
    key?: string
    value?: string
}