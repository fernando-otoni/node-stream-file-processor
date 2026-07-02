import { IFile } from "src/modules/upload/infra/controller/upload.controller";

export enum EnumProcessTypes {
  FILE = 'FILE'
}

export interface FileJob extends IFile {
  process_type: EnumProcessTypes
}