export class Folder {
    id ?: any ;
    folderName ?: string ;
} 

export class Asset {
    id ?: any ;
    fileType ?: string ;
    fileSize ?: string;
    folder?: Folder;
    url ?: string ;
    fileName ?: string ;
    uploadedTime ?: any ;
} 

