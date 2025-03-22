
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
