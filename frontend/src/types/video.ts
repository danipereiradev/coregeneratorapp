export interface VideoFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export type GenerateStatus =
  | 'idle'
  | 'uploading'
  | 'generating'
  | 'almost_done'
  | 'success'
  | 'error';
