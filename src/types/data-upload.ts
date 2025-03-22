
export type FileWithPreview = {
  file: File;
  preview: string | null;
  tags: string[];
  selected: boolean;
};

export interface PreprocessingFormValues {
  chunkSize: string;
  overlap: string;
  cleaningOptions: string[];
  customRegex: string;
}

export const PREPROCESSING_MIN_CHUNK_SIZE = 100;
export const PREPROCESSING_MAX_CHUNK_SIZE = 10000;
export const PREPROCESSING_MIN_OVERLAP = 0;
export const PREPROCESSING_MAX_OVERLAP = 1000;
