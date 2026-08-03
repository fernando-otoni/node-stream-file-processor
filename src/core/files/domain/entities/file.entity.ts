import { FileStatusEnum } from "../enums/file-status.enum";

export interface FileEntity {
  id?: number | undefined;
  field_name: string;
  original_name: string;
  encoding: string;
  mimetype: string;
  path: string;
  destination: string;
  file_name: string;
  size: number;
  hash: string | undefined;
  status: FileStatusEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | undefined;
}